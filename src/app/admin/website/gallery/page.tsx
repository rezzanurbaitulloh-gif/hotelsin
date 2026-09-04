import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function GalleryCMSPage(){
  const supabase=await createClient()
  const {data}=await supabase.from('gallery_items').select('id,image_url,category,sort_order,is_active').order('sort_order').limit(30)
  return (<div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-light">Gallery CMS</h1><p className="text-sm text-muted-foreground">{data?.length||0} items • drag reorder, category, caption</p></div><a href="/admin/website/gallery/new" className="h-9 px-4 bg-brand-foreground text-brand-background inline-flex items-center text-xs tracking-widest hover:bg-brand-foreground/90">+ UPLOAD</a></div>
  <div className="grid gap-3 md:grid-cols-4">
    {(data||[]).map(g=> <Card key={g.id} className="overflow-hidden"><div className="aspect-[4/3] bg-muted overflow-hidden"><img src={g.image_url} alt={g.category} className="h-full w-full object-cover"/></div><CardContent className="p-3 flex items-center justify-between"><Badge variant="outline" className="text-[10px]">{g.category}</Badge><span className="text-xs text-muted-foreground">#{g.sort_order}</span></CardContent></Card>)}
  </div>
  </div>)
}
