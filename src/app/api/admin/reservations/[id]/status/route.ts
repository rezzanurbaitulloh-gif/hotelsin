import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { validateTransition, type ReservationStatus } from '@/lib/reservation-lifecycle'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { status: newStatus } = await req.json() as { status: ReservationStatus }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: actor } = await supabase.from('users').select('role').eq('email', user.email).single()
  const actorRole = actor?.role as string
  if (!actorRole) return NextResponse.json({ error: 'Role tidak ditemukan' }, { status: 403 })

  const service = createServiceClient()
  const { data: reservation } = await service.from('reservations').select('id,status').eq('id', id).single()
  if (!reservation) return NextResponse.json({ error: 'Reservasi tidak ditemukan' }, { status: 404 })

  const from = reservation.status as ReservationStatus
  const to = newStatus as ReservationStatus

  const check = validateTransition(from, to, actorRole, false)
  if (!check.ok) return NextResponse.json({ error: check.reason }, { status: 400 })

  const now = new Date().toISOString()
  const updates: any = { status: to }
  if (to === 'CHECKED_IN') updates.checked_in_at = now
  if (to === 'CHECKED_OUT') updates.checked_out_at = now
  if (to === 'CANCELLED') updates.cancelled_at = now

  const { error } = await service.from('reservations').update(updates).eq('id', id).eq('status', from) // idempotent
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Side effects: update room status
  const { data: res } = await service.from('reservations').select('room_id,property_id').eq('id', id).single()
  if (res?.room_id) {
    if (to === 'CHECKED_IN') await service.from('rooms').update({ status: 'OCCUPIED' }).eq('id', res.room_id)
    if (to === 'CHECKED_OUT') {
      await service.from('rooms').update({ status: 'CLEANING' }).eq('id', res.room_id)
      await service.from('housekeeping_tasks').insert({ property_id: res.property_id, room_id: res.room_id, status: 'PENDING', priority: 'NORMAL', notes: 'Auto after check-out' })
    }
    if (to === 'CANCELLED') await service.from('rooms').update({ status: 'AVAILABLE' }).eq('id', res.room_id)
  }

  // Log to history
  await service.from('reservation_status_history').insert({ reservation_id: id, status: to, notes: `by ${actorRole} ${user.email}` })

  return NextResponse.json({ success: true, from, to })
}
