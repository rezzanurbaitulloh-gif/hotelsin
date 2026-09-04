import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function WellnessAdminPage(){
  const supabase=await createClient()
  const {data}=await supabase.from('spa_services').select('id,name,price,duration_minutes,category,is_active').order('sort_order')
  return (<div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-light">Wellness</h1><p className="text-sm text-muted-foreground">{data?.length||0} services • price & duration</p></div><button className="h-9 px-4 bg-brand-foreground text-brand-background text-xs tracking-widest">+ NEW SERVICE</button></div>
  <Card><CardHeader><CardTitle className="text-sm">Spa Services</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full text-sm"><thead className="text-xs tracking-widest text-muted-foreground uppercase border-b"><tr><th className="text-left py-3">Service</th><th className="text-left">Category</th><th className="text-center">Duration</th><th className="text-right">Price</th><th className="text-center">Status</th></tr></thead><tbody>{(data||[]).map(s=> <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30"><td className="py-3 font-medium">{s.name.en}</td><td><Badge variant="outline">{s.category}</Badge></td><td className="text-center">{s.duration_minutes}′</td><td className="text-right">${s.price}</td><td className="text-center"><Badge variant={s.is_active?'secondary':'outline'}>{s.is_active?'Active':'Draft'}</Badge></td></tr>)}</tbody></table></CardContent></Card>
  </div>)
}
