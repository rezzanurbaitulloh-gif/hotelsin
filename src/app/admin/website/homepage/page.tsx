import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function HomepageCMSPage(){
  const supabase=await createClient()
  const {data: sections}=await supabase.from('page_sections').select('id,section_key,section_type,content,is_active').eq('page_id','homepage').order('sort_order')
  const {data: props}=await supabase.from('properties').select('id,name,hero_image_url').limit(1)
  return (<div className="space-y-6"><div><h1 className="font-display text-2xl font-light">Homepage CMS</h1><p className="text-sm text-muted-foreground">Hero, brand statement, featured sections • {sections?.length||0} sections • property {props?.[0]?.name.en}</p></div>
  <Card><CardHeader><CardTitle className="text-sm">Page Sections</CardTitle></CardHeader><CardContent className="divide-y">
    {(sections||[]).map(s=> <div key={s.id} className="flex items-center justify-between py-3"><div><p className="font-medium text-sm">{s.section_key} <span className="text-xs text-muted-foreground">({s.section_type})</span></p><p className="text-xs text-muted-foreground line-clamp-1">{JSON.stringify(s.content).slice(0,120)}</p></div><Badge variant={s.is_active?'secondary':'outline'}>{s.is_active?'Active':'Hidden'}</Badge></div>)}
    {!sections?.length && <p className="py-12 text-center text-muted-foreground">No sections — seed has hero + brand_statement. Add featured rooms/offers here.</p>}
  </CardContent></Card>
  <Card><CardHeader><CardTitle className="text-sm">Hero Preview</CardTitle></CardHeader><CardContent>{props?.[0]?.hero_image_url ? <img src={props[0].hero_image_url} alt="hero" className="w-full h-48 object-cover rounded-lg"/> : <p className="text-muted-foreground">No hero image</p>}</CardContent></Card>
  </div>)
}
