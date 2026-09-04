import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function RoomTypesPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('room_types').select('id,name,description,base_price,max_occupancy,size_sqm,images,is_active').order('sort_order')
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-light">Room Types</h1><p className="text-sm text-muted-foreground">{data?.length||0} types • price & content editable • klik EDIT untuk persist</p></div><a href="/admin/room-types/new" className="h-9 px-4 bg-brand-foreground text-brand-background inline-flex items-center text-xs tracking-widest hover:bg-brand-foreground/90">+ NEW TYPE</a></div>
      <div className="grid gap-6 md:grid-cols-2">
        {(data||[]).map(rt=> (
          <Card key={rt.id} className="overflow-hidden">
            <div className="aspect-[16/9] bg-muted overflow-hidden">{rt.images?.[0] ? <img src={rt.images[0]} alt={rt.name.en} className="h-full w-full object-cover"/> : <div className="h-full w-full flex items-center justify-center text-muted-foreground">No image</div>}</div>
            <CardHeader><CardTitle className="flex items-center justify-between"><span className="font-display text-lg">{rt.name.en}</span><Badge variant={rt.is_active?'secondary':'outline'}>{rt.is_active?'Active':'Draft'}</Badge></CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground line-clamp-2">{rt.description.en}</p>
              <div className="flex gap-4 text-xs text-muted-foreground"><span>{rt.size_sqm} m²</span><span>{rt.max_occupancy} guests</span><span className="font-medium text-foreground">${rt.base_price}/night</span></div>
              <div className="flex gap-2 pt-2"><a href={`/admin/room-types/${rt.id}`} className="h-8 flex-1 bg-brand-foreground text-brand-background grid place-items-center text-xs tracking-widest hover:bg-brand-foreground/90">EDIT</a><a href={`/admin/room-types/${rt.id}#images`} className="h-8 flex-1 border border-border grid place-items-center text-xs hover:bg-muted">IMAGES</a></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
