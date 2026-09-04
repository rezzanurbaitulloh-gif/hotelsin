import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function ArrivalsPage() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase.from('reservations').select('id,confirmation_code,check_in,status,guest_id').gte('check_in', today).eq('status','CONFIRMED').order('check_in').limit(20)
  const { data: guests } = await supabase.from('guests').select('id,first_name,last_name')
  const gmap = Object.fromEntries((guests||[]).map(g=>[g.id, g.first_name+' '+g.last_name]))
  return (
    <div className="space-y-6"><div><h1 className="font-display text-2xl font-light">Arrivals</h1><p className="text-sm text-muted-foreground">Today • {today}</p></div>
      <Card><CardHeader><CardTitle className="text-sm">Today&apos;s Arrivals • {data?.length||0}</CardTitle></CardHeader><CardContent className="divide-y">
        {(data||[]).map(r=> <div key={r.id} className="flex items-center justify-between py-3"><div><p className="font-medium text-sm">{gmap[r.guest_id]||r.guest_id.slice(0,8)}</p><p className="text-xs text-muted-foreground font-mono">{r.confirmation_code} • {r.check_in}</p></div><Badge>{r.status}</Badge></div>)}
        {!data?.length && <p className="py-12 text-center text-muted-foreground">No arrivals today</p>}
      </CardContent></Card>
    </div>
  )
}
