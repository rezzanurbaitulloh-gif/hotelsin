import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function RatesPage(){
  const supabase=await createClient()
  const {data}=await supabase.from('rate_plans').select('id,name,base_price,is_active').limit(20)
  const hasData = data && data.length
  return (<div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-light">Rates</h1><p className="text-sm text-muted-foreground">Rate plans & seasonal pricing</p></div><button className="h-9 px-4 bg-brand-foreground text-brand-background text-xs tracking-widest">+ NEW RATE</button></div>
  {hasData ? <Card><CardHeader><CardTitle className="text-sm">Rate Plans • {data.length}</CardTitle></CardHeader><CardContent className="divide-y">{data.map(r=> <div key={r.id} className="flex items-center justify-between py-3"><div><p className="font-medium text-sm">{r.name.en}</p><p className="text-xs text-muted-foreground">${r.base_price}/night</p></div><Badge variant={r.is_active?'secondary':'outline'}>{r.is_active?'Active':'Inactive'}</Badge></div>)}</CardContent></Card> : <Card><CardContent className="py-12 text-center text-muted-foreground">No rate plans yet — create from room types base price ($420–1450). Seed uses room_types.base_price directly.</CardContent></Card>}
  </div>)
}
