import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function AmenitiesPage(){
  const supabase=await createClient()
  const {data}=await supabase.from('amenities').select('id,name,icon,category').order('category')
  return (<div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-light">Amenities</h1><p className="text-sm text-muted-foreground">{data?.length||0} amenities</p></div><a href="/admin/amenities/new" className="h-9 px-4 bg-brand-foreground text-brand-background inline-flex items-center text-xs tracking-widest hover:bg-brand-foreground/90">+ NEW</a></div>
  <Card><CardHeader><CardTitle className="text-sm">Master List</CardTitle></CardHeader><CardContent className="grid gap-2 md:grid-cols-3">
    {(data||[]).map(a=> <div key={a.id} className="border border-border rounded-lg p-3 flex items-center justify-between"><div><p className="font-medium text-sm">{a.name.en}</p><p className="text-xs text-muted-foreground">{a.category} • {a.icon}</p></div><Badge variant="outline">{a.category}</Badge></div>)}
  </CardContent></Card></div>)
}
