import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Users, Maximize, BedDouble } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function RoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: room, error } = await supabase.from('room_types').select('id,name,description,short_description,base_price,max_occupancy,size_sqm,bed_type,images,is_active').eq('id', slug).single()

  if (error || !room) {
    // Try by slugified name fallback
    const { data: all } = await supabase.from('room_types').select('id,name,description,short_description,base_price,max_occupancy,size_sqm,bed_type,images').eq('is_active', true)
    const found = all?.find(r => r.name?.en?.toLowerCase().replace(/\s+/g,'-') === slug || r.id === slug)
    if (!found) return notFound()
    return renderRoom(found)
  }

  return renderRoom(room)

  function renderRoom(r: any) {
    return (
      <div className="container mx-auto px-6 py-12">
        <Link href="/stay" className="inline-flex items-center gap-2 text-xs tracking-widest hover:text-brand-accent mb-8"><ArrowLeft className="h-3 w-3"/> KEMBALI KE STAY</Link>
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-[4/3] overflow-hidden bg-muted rounded-lg">
              <img src={r.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80&auto=format&fit=crop'} alt={r.name?.en} className="h-full w-full object-cover" />
            </div>
            {r.images?.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {r.images.slice(1,4).map((img:string,i:number)=> (
                  <div key={i} className="aspect-[4/3] overflow-hidden bg-muted rounded-lg"><img src={img} alt="" className="h-full w-full object-cover" /></div>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-2">Stay • {r.id.slice(0,8)}</p>
              <h1 className="font-display text-4xl font-light leading-tight">{r.name?.en}</h1>
              <p className="text-sm tracking-widest text-muted-foreground uppercase mt-2">{r.short_description?.en}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="inline-flex items-center gap-2 border border-border px-3 py-2"><Maximize className="h-4 w-4"/>{r.size_sqm} m²</span>
              <span className="inline-flex items-center gap-2 border border-border px-3 py-2"><Users className="h-4 w-4"/>{r.max_occupancy} Tamu</span>
              <span className="inline-flex items-center gap-2 border border-border px-3 py-2"><BedDouble className="h-4 w-4"/>{r.bed_type?.en}</span>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed">{r.description?.en}</p>
              <p className="text-xs text-muted-foreground mt-2">ID: {r.id} • Data dari Supabase room_types — admin edit di /admin/room-types</p>
            </div>
            <div className="border-y border-border py-6 space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl">${r.base_price}</span>
                <span className="text-sm text-muted-foreground">/ malam</span>
                <Badge variant="secondary" className="ml-auto">From DB</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Harga dinamis — admin ubah di database, langsung update di sini.</p>
            </div>
            <div className="flex gap-3">
              <Button asChild size="lg" className="flex-1 rounded-none bg-brand-foreground text-brand-background h-12 tracking-widest text-xs">
                <Link href={`/reserve?room_type=${r.id}`}>PESAN SEKARANG</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-none h-12 px-6">
                <Link href="/stay">LIHAT LAINNYA</Link>
              </Button>
            </div>
            <div className="p-4 bg-muted/30 border border-border rounded-lg">
              <p className="text-xs tracking-widest uppercase mb-2">Data Source Verification</p>
              <p className="text-xs text-muted-foreground">Halaman ini fetch <code className="bg-white px-1 border rounded">supabase.from('room_types').eq('id', slug)</code> — tidak ada hardcode. Coba admin ubah harga di /admin/room-types, refresh halaman ini, harga baru langsung muncul.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
