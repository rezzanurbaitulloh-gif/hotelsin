import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function DiningAdminPage(){
  const supabase=await createClient()
  const {data}=await supabase.from('restaurants').select('id,name,cuisine,hours,is_active,images').order('sort_order')
  return (<div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-light">Dining</h1><p className="text-sm text-muted-foreground">{data?.length||0} restaurants • hours & cuisine editable</p></div><button className="h-9 px-4 bg-brand-foreground text-brand-background text-xs tracking-widest">+ NEW RESTAURANT</button></div>
  <div className="grid gap-4 md:grid-cols-2">{(data||[]).map(r=> <Card key={r.id}><div className="aspect-[16/9] bg-muted overflow-hidden">{r.images?.[0]? <img src={r.images[0]} alt={r.name.en} className="h-full w-full object-cover"/>: <div className="h-full w-full grid place-items-center text-muted-foreground">No image</div>}</div><CardHeader><CardTitle className="flex items-center justify-between"><span>{r.name.en}</span><Badge variant={r.is_active?'secondary':'outline'}>{r.is_active?'Active':'Draft'}</Badge></CardTitle></CardHeader><CardContent className="text-sm space-y-1"><p className="text-muted-foreground">{r.cuisine.en}</p><p className="text-xs text-muted-foreground">{r.hours.en}</p><div className="flex gap-2 pt-2"><button className="h-8 flex-1 bg-brand-foreground text-brand-background text-xs">EDIT</button><button className="h-8 flex-1 border text-xs">HOURS</button></div></CardContent></Card>)}</div>
  </div>)
}
