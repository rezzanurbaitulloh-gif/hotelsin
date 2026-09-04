import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function OffersAdminPage(){
  const supabase=await createClient()
  const {data}=await supabase.from('offers').select('id,name,discount_type,discount_value,valid_from,valid_to,is_active').order('valid_from',{ascending:false}).limit(20)
  return (<div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-light">Offers</h1><p className="text-sm text-muted-foreground">{data?.length||0} offers • discount engine live</p></div><a href="/admin/offers/new" className="h-9 px-4 bg-brand-foreground text-brand-background inline-flex items-center text-brand-background text-xs tracking-widest">+ NEW OFFER</a></div>
  <div className="grid gap-4 md:grid-cols-2">{(data||[]).map(o=> <Card key={o.id}><CardHeader className="pb-2"><CardTitle className="flex items-center justify-between text-sm"><span>{o.name.en}</span><Badge variant={o.is_active?'secondary':'outline'}>{o.is_active?'Active':'Expired'}</Badge></CardTitle></CardHeader><CardContent className="text-sm space-y-1"><p className="text-muted-foreground">{o.discount_type==='percentage'? o.discount_value+'% off' : '$'+o.discount_value+' off'}</p><p className="text-xs text-muted-foreground">{o.valid_from} → {o.valid_to}</p><div className="flex gap-2 pt-2"><a href="/admin/offers/new" className="h-8 flex-1 bg-brand-foreground text-brand-background grid place-items-center text-xs hover:bg-brand-foreground/90">EDIT</a><a href="/admin/offers/new" className="h-8 flex-1 border border-border grid place-items-center text-xs hover:bg-muted">DUPLICATE</a></div></CardContent></Card>)}</div>
  </div>)
}
