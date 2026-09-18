import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

// Vercel Cron will call GET https://hotelsin.vercel.app/api/cron/reservations?key=CRON_SECRET
// Configure in vercel.json: { "crons": [{ "path": "/api/cron/reservations", "schedule": "0 2 * * *" }] }

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  // Simple protection: check CRON_SECRET or allow Vercel Cron header
  const cronSecret = process.env.CRON_SECRET || 'hotelsin-cron-2026'
  const authHeader = req.headers.get('authorization')
  const isVercelCron = req.headers.get('x-vercel-cron') === '1' || authHeader === `Bearer ${cronSecret}` || key === cronSecret

  // Allow in development without secret for testing, but in production require secret
  if (process.env.NODE_ENV === 'production' && !isVercelCron && key !== cronSecret) {
    // Still allow if called from Vercel Cron (has x-vercel-cron header)
    const vercelId = req.headers.get('x-vercel-id')
    if (!vercelId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const supabase = createServiceClient()
  // Property timezone: WITA (Asia/Makassar, UTC+8)
  const today = new Date(Date.now() + 8 * 3600 * 1000).toISOString().split('T')[0]
  const now = new Date().toISOString()

  // 1. Auto check-in: CONFIRMED where check_in <= today and check_in <= now, and status is CONFIRMED -> CHECKED_IN
  // For demo, we check_in if check_in date is today or past and not yet checked in
  const { data: toCheckIn, error: checkInErr } = await supabase
    .from('reservations')
    .select('id,check_in,status')
    .eq('status', 'CONFIRMED')
    .lte('check_in', today)

  let checkedInCount = 0
  if (toCheckIn && toCheckIn.length) {
    for (const r of toCheckIn) {
      const { error } = await supabase.from('reservations').update({
        status: 'CHECKED_IN',
        checked_in_at: now,
      }).eq('id', r.id).eq('status', 'CONFIRMED') // idempotent: only if still CONFIRMED
      if (!error) checkedInCount++
      // Also update room status to OCCUPIED if room_id exists
      const { data: res } = await supabase.from('reservations').select('room_id').eq('id', r.id).single()
      if (res?.room_id) {
        await supabase.from('rooms').update({ status: 'OCCUPIED' }).eq('id', res.room_id)
      }
    }
  }

  // 2. Auto check-out: CHECKED_IN where check_out <= today -> CHECKED_OUT
  const { data: toCheckOut } = await supabase
    .from('reservations')
    .select('id,check_out,status')
    .eq('status', 'CHECKED_IN')
    .lte('check_out', today)

  let checkedOutCount = 0
  if (toCheckOut && toCheckOut.length) {
    for (const r of toCheckOut) {
      const { error } = await supabase.from('reservations').update({
        status: 'CHECKED_OUT',
        checked_out_at: now,
      }).eq('id', r.id).eq('status', 'CHECKED_IN')
      if (!error) checkedOutCount++
      const { data: res } = await supabase.from('reservations').select('room_id').eq('id', r.id).single()
      if (res?.room_id) {
        await supabase.from('rooms').update({ status: 'CLEANING' }).eq('id', res.room_id)
        // Create housekeeping task
        const { data: prop } = await supabase.from('reservations').select('property_id').eq('id', r.id).single()
        if (prop?.property_id && res.room_id) {
          await supabase.from('housekeeping_tasks').insert({
            property_id: prop.property_id,
            room_id: res.room_id,
            status: 'PENDING',
            priority: 'NORMAL',
            notes: 'Auto after check-out',
          })
        }
      }
    }
  }

  // 3. Auto no-show: CONFIRMED where check_in < today (past) and not checked in -> NO_SHOW (optional)
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const { data: toNoShow } = await supabase
    .from('reservations')
    .select('id')
    .eq('status', 'CONFIRMED')
    .lt('check_in', yesterday)

  let noShowCount = 0
  if (toNoShow && toNoShow.length) {
    for (const r of toNoShow) {
      const { error } = await supabase.from('reservations').update({ status: 'NO_SHOW' }).eq('id', r.id).eq('status', 'CONFIRMED')
      if (!error) noShowCount++
    }
  }

  // 4. Expire unpaid: PENDING_PAYMENT older than 24h -> CANCELLED + free room
  // (matches Midtrans Snap expiry 24h; idempotent via status guard)
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: toExpire } = await supabase
    .from('reservations')
    .select('id,room_id')
    .eq('status', 'PENDING_PAYMENT')
    .lt('created_at', dayAgo)

  let expiredCount = 0
  if (toExpire && toExpire.length) {
    for (const r of toExpire) {
      const { error } = await supabase.from('reservations').update({
        status: 'CANCELLED',
        cancelled_at: now,
        cancellation_reason: 'Pembayaran kedaluwarsa (24 jam)',
      }).eq('id', r.id).eq('status', 'PENDING_PAYMENT')
      if (!error) {
        expiredCount++
        if ((r as any).room_id) {
          await supabase.from('rooms').update({ status: 'AVAILABLE' }).eq('id', (r as any).room_id)
        }
        await supabase.from('reservation_status_history').insert({ reservation_id: r.id, status: 'CANCELLED', notes: 'Auto-expire unpaid (cron)' })
      }
    }
  }

  // 5. Night audit snapshot: daily revenue + occupancy into daily_closures (idempotent upsert)
  try {
    const { data: allRooms } = await supabase.from('rooms').select('id,status')
    const totalRooms = (allRooms || []).length
    const occupiedRooms = (allRooms || []).filter((x: any) => x.status === 'OCCUPIED').length
    const dayStart = `${today}T00:00:00.000Z`
    const { data: dayTx } = await supabase.from('transactions').select('amount,type').eq('status', 'COMPLETED').gte('created_at', dayStart)
    const roomRev = ((dayTx as any[]) || []).filter(t => t.type === 'ROOM_REVENUE').reduce((s, t) => s + Number(t.amount), 0)
    const otherRev = ((dayTx as any[]) || []).reduce((s, t) => s + Number(t.amount), 0) - roomRev
    const totalRev = roomRev + otherRev
    const { data: propRow } = await supabase.from('properties').select('id').limit(1).single()
    if ((propRow as any)?.id) {
      await supabase.from('daily_closures').upsert({
        property_id: (propRow as any).id,
        date: today,
        rooms_total: totalRooms,
        rooms_occupied: occupiedRooms,
        occupancy_pct: totalRooms ? Math.round((occupiedRooms / totalRooms) * 10000) / 100 : 0,
        room_revenue: Math.round(roomRev),
        other_revenue: Math.round(otherRev),
        total_revenue: Math.round(totalRev),
        adr: occupiedRooms ? Math.round(roomRev / occupiedRooms) : 0,
        revpar: totalRooms ? Math.round(totalRev / totalRooms) : 0,
      }, { onConflict: 'property_id,date' })
    }
  } catch {
    // snapshot best-effort
  }

  return NextResponse.json({
    success: true,
    date: today,
    checkedIn: checkedInCount,
    checkedOut: checkedOutCount,
    noShow: noShowCount,
    expiredUnpaid: expiredCount,
    errors: { checkInErr: checkInErr?.message || null },
  })
}
