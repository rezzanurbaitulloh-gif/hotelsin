import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function ExperiencesAdminPage(){
  const supabase=await createClient()
  const {data}=await supabase.from('experiences').select('id,name,category,price,is_active').order('sort_order')
  return (<div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-light">Experiences</h1><p className="text-sm text-muted-foreground">{data?.length||0} experiences • category & price</p></div><a href="/admin/experiences/new" className="h-9 px-4 bg-brand-foreground text-brand-background inline-flex items-center text-brand-background text-xs tracking-widest">+ NEW EXPERIENCE</a></div>
  <Card><CardHeader><CardTitle className="text-sm">All Experiences</CardTitle></CardHeader><CardContent className="grid gap-2 md:grid-cols-2">
    {(data||[]).map(e=> <div key={e.id} className="border border-border rounded-lg p-3 flex items-center justify-between"><div><p className="font-medium text-sm">{e.name.en}</p><p className="text-xs text-muted-foreground">{e.category} • ${e.price}</p></div><Badge variant={e.is_active?'secondary':'outline'}>{e.is_active?'Active':'Draft'}</Badge></div>)}
  </CardContent></Card>
  </div>)
}
