import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
export const dynamic = 'force-dynamic'
export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: rooms } = await supabase.from('rooms').select('id,status')
  const { data: reservations } = await supabase.from('reservations').select('id,status,total_amount,check_in,check_out,created_at')
  const { data: guests } = await supabase.from('guests').select('id')
  const { data: arrivals } = await supabase.from('reservations').select('id,check_in,guest_id,room_id,status').eq('status','CONFIRMED').gte('check_in', new Date().toISOString().split('T')[0]).limit(5)
  const { data: departures } = await supabase.from('reservations').select('id,check_out,guest_id,room_id,status').eq('status','CHECKED_IN').limit(5)
  const { data: transactions } = await supabase.from('transactions').select('amount,status').eq('status','COMPLETED')
  const totalRooms = rooms?.length || 0
  const occupied = rooms?.filter(r=> r.status==='OCCUPIED').length || 0
  const available = rooms?.filter(r=> r.status==='AVAILABLE').length || 0
  const occupancy = totalRooms ? Math.round((occupied/totalRooms)*100) : 0
  const revenue = transactions?.reduce((s,t)=> s+Number(t.amount),0) || 0
  const totalNights = reservations?.filter(r=> r.status!=='CANCELLED').length || 1
  const adr = totalNights ? Math.round(revenue/totalNights) : 0
  const revpar = totalRooms ? Math.round(revenue/totalRooms) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-light">Command Center</h1>
        <p className="text-sm text-muted-foreground">Live operations — {new Date().toLocaleDateString('id-ID', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs tracking-widest uppercase text-muted-foreground">Occupancy</CardTitle></CardHeader><CardContent><p className="text-3xl font-light">{occupancy}%</p><p className="text-xs text-muted-foreground">{occupied}/{totalRooms} rooms occupied</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs tracking-widest uppercase text-muted-foreground">ADR</CardTitle></CardHeader><CardContent><p className="text-3xl font-light">${adr}</p><p className="text-xs text-muted-foreground">Avg daily rate</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs tracking-widest uppercase text-muted-foreground">RevPAR</CardTitle></CardHeader><CardContent><p className="text-3xl font-light">${revpar}</p><p className="text-xs text-muted-foreground">Revenue per available room</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs tracking-widest uppercase text-muted-foreground">Revenue</CardTitle></CardHeader><CardContent><p className="text-3xl font-light">${revenue.toLocaleString()}</p><p className="text-xs text-muted-foreground">{reservations?.length||0} reservations • {guests?.length||0} guests</p></CardContent></Card>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-sm">Room Status</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Available</span><Badge variant="secondary">{available}</Badge></div>
          <div className="flex justify-between"><span>Occupied</span><Badge>{occupied}</Badge></div>
          <div className="flex justify-between"><span>Reserved</span><Badge variant="outline">{rooms?.filter(r=>r.status==='RESERVED').length||0}</Badge></div>
          <div className="flex justify-between"><span>Cleaning/Dirty</span><Badge variant="outline">{rooms?.filter(r=>['CLEANING','DIRTY'].includes(r.status)).length||0}</Badge></div>
          <div className="flex justify-between"><span>Maintenance</span><Badge variant="destructive">{rooms?.filter(r=>r.status==='MAINTENANCE').length||0}</Badge></div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Today Arrivals</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">
          {arrivals && arrivals.length ? arrivals.map(a=> <div key={a.id} className="flex justify-between border-b border-border py-2 last:border-0"><span>{a.check_in}</span><Badge variant="secondary">{a.status}</Badge></div>) : <p className="text-muted-foreground">No arrivals today</p>}
          <Link href="/admin/arrivals" className="text-xs text-brand-accent hover:underline">View all →</Link>
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Today Departures</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">
          {departures && departures.length ? departures.map(d=> <div key={d.id} className="flex justify-between border-b border-border py-2 last:border-0"><span>{d.check_out}</span><Badge>{d.status}</Badge></div>) : <p className="text-muted-foreground">No departures</p>}
          <Link href="/admin/departures" className="text-xs text-brand-accent hover:underline">View all →</Link>
        </CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm">Quick Actions</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link href="/admin/reservations" className="h-9 px-4 inline-flex items-center bg-brand-foreground text-brand-background text-xs tracking-widest">RESERVATIONS</Link>
          <Link href="/admin/rooms" className="h-9 px-4 inline-flex items-center border border-border text-xs tracking-widest">ROOMS</Link>
          <Link href="/admin/guests" className="h-9 px-4 inline-flex items-center border border-border text-xs tracking-widest">GUESTS</Link>
          <Link href="/admin/housekeeping" className="h-9 px-4 inline-flex items-center border border-border text-xs tracking-widest">HOUSEKEEPING</Link>
        </CardContent>
      </Card>
    </div>
  )
}
