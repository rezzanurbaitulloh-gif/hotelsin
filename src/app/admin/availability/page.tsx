import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function AvailabilityPage(){
  const supabase=await createClient()
  const {data: rooms}=await supabase.from('rooms').select('id,room_number,status')
  const {data: reservations}=await supabase.from('reservations').select('id,check_in,check_out,status,room_type_id')
  return (<div className="space-y-6"><div><h1 className="font-display text-2xl font-light">Availability</h1><p className="text-sm text-muted-foreground">Calendar & occupancy map • {rooms?.length||0} rooms • {reservations?.length||0} reservations</p></div>
  <Card><CardHeader><CardTitle className="text-sm">Room Map</CardTitle></CardHeader><CardContent className="grid gap-2 md:grid-cols-6">
    {(rooms||[]).map(r=> <div key={r.id} className={"h-20 rounded-lg border flex flex-col items-center justify-center text-xs "+(r.status==='AVAILABLE'?'bg-emerald-50 border-emerald-200': r.status==='OCCUPIED'?'bg-zinc-900 text-white': 'bg-amber-50 border-amber-200')}><span className="font-mono font-medium">{r.room_number}</span><Badge variant="secondary" className="mt-1 text-[9px]">{r.status}</Badge></div>)}
  </CardContent></Card>
  <Card><CardHeader><CardTitle className="text-sm">Upcoming Reservations</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">
    {(reservations||[]).slice(0,10).map(r=> <div key={r.id} className="flex justify-between border-b py-2 last:border-0"><span>{r.check_in} → {r.check_out}</span><Badge variant="outline">{r.status}</Badge></div>)}
  </CardContent></Card>
  </div>)
}
