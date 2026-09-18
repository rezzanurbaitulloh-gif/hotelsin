import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

// GET /api/calendar/ical?key=CRON_SECRET
// iCal feed of CONFIRMED + CHECKED_IN reservations for OTA/channel-manager import.
// Prevents double-booking when listing on external channels.
export const dynamic = 'force-dynamic'

function icsDate(d: string): string {
  return d.replace(/-/g, '') // YYYYMMDD (all-day, Asia/Jakarta)
}

function escapeIcs(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  const cronSecret = process.env.CRON_SECRET || 'hotelsin-cron-2026'
  if (key !== cronSecret && req.headers.get('x-vercel-cron') !== '1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const service = createServiceClient()
  const { data: reservations } = await service
    .from('reservations')
    .select('id,confirmation_code,check_in,check_out,status,room_id')
    .in('status', ['CONFIRMED', 'CHECKED_IN'])
    .order('check_in')
    .limit(500)
  const { data: rooms } = await service.from('rooms').select('id,room_number')
  const roomMap = new Map(((rooms as any[]) || []).map((r: any) => [r.id, r.room_number]))

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HotelsIn//Booking//EN',
    'CALSCALE:GREGORIAN',
    'X-WR-CALNAME:HotelsIn Reservations',
  ]
  for (const r of ((reservations as any[]) || [])) {
    const room = r.room_id ? roomMap.get(r.room_id) || 'Unassigned' : 'Unassigned'
    lines.push(
      'BEGIN:VEVENT',
      `UID:${r.id}@hotelsin.vercel.app`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;VALUE=DATE:${icsDate(r.check_in)}`,
      `DTEND;VALUE=DATE:${icsDate(r.check_out)}`,
      `SUMMARY:${escapeIcs(`OCCUPIED — ${room} (${r.confirmation_code})`)}`,
      `DESCRIPTION:${escapeIcs(`Status: ${r.status}`)}`,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT'
    )
  }
  lines.push('END:VCALENDAR')

  return new NextResponse(lines.join('\r\n'), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="hotelsin-reservations.ics"',
    },
  })
}
