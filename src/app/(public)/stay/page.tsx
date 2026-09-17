import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Price } from '@/components/price'
import { LocalizedText, T } from '@/components/localized'
import { getI18nFromCookies, getTranslationServer } from '@/lib/i18n/server'
import { ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function StayPage({ searchParams }: { searchParams: Promise<{ guests?: string, sort?: string }> }) {
  const sp = await searchParams
  const supabase = await createClient()
  const { locale } = await getI18nFromCookies()
  const tr = (k: string) => getTranslationServer(locale, k)
  let query = supabase.from('room_types').select('id,name,description,short_description,base_price,max_occupancy,size_sqm,bed_type,images,is_active').eq('is_active', true).order('sort_order')
  if (sp.guests) {
    const g = Number(sp.guests)
    if (!isNaN(g)) query = query.gte('max_occupancy', g)
  }
  const { data: rooms, error } = await query

  if (error) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <p className="text-destructive">Gagal memuat data kamar: {error.message}</p>
        <Link href="/stay" className="inline-block mt-4 text-xs border-b border-brand-accent pb-1">COBA LAGI</Link>
      </div>
    )
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-4"><T k="nav.stay" /></p>
        <h1 className="font-display text-4xl font-light mb-4">{tr('stay.empty_title')}</h1>
        <p className="text-muted-foreground mb-8">{tr('stay.empty_body')}</p>
        <Link href="/stay" className="h-11 px-6 inline-flex items-center bg-brand-foreground text-brand-background text-xs tracking-widest">{tr('stay.reset')}</Link>
      </div>
    )
  }

  // Sort
  const sorted = [...rooms].sort((a,b)=>{
    if (sp.sort === 'price_asc') return a.base_price - b.base_price
    if (sp.sort === 'price_desc') return b.base_price - a.base_price
    if (sp.sort === 'size_desc') return b.size_sqm - a.size_sqm
    return 0
  })

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-2"><T k="nav.stay" /></p>
        <h1 className="font-display text-4xl md:text-5xl font-light leading-none mb-4">{tr('stay.title')}</h1>
        <p className="text-muted-foreground max-w-2xl">{tr('stay.subtitle')}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 border-y border-border py-4">
        <span className="text-xs tracking-widest text-muted-foreground uppercase py-2">{tr('stay.filter')}:</span>
        <Link href="/stay" className={`h-8 px-4 inline-flex items-center border text-xs ${!sp.guests ? 'bg-brand-foreground text-brand-background border-brand-foreground' : 'border-border'}`}>{tr('stay.all')}</Link>
        <Link href="/stay?guests=2" className={`h-8 px-4 inline-flex items-center border text-xs ${sp.guests==='2' ? 'bg-brand-foreground text-brand-background' : 'border-border'}`}>2 {tr('stay.guests_suffix')}</Link>
        <Link href="/stay?guests=4" className={`h-8 px-4 inline-flex items-center border text-xs ${sp.guests==='4' ? 'bg-brand-foreground text-brand-background' : 'border-border'}`}>4 {tr('stay.guests_suffix')}</Link>
        <Link href="/stay?guests=6" className={`h-8 px-4 inline-flex items-center border text-xs ${sp.guests==='6' ? 'bg-brand-foreground text-brand-background' : 'border-border'}`}>6+ {tr('stay.guests_suffix')}</Link>
        <span className="text-xs tracking-widest text-muted-foreground uppercase py-2 ml-4">{tr('stay.sort')}:</span>
        <Link href="/stay?sort=price_asc" className="h-8 px-4 inline-flex items-center border border-border text-xs">{tr('stay.price_asc')}</Link>
        <Link href="/stay?sort=price_desc" className="h-8 px-4 inline-flex items-center border border-border text-xs">{tr('stay.price_desc')}</Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sorted.map((room)=> (
          <div key={room.id} className="group border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/stay/${room.id}`} className="block aspect-[4/3] overflow-hidden bg-muted">
              <img src={room.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80&auto=format&fit=crop'} alt={(room.name as any)?.en} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </Link>
            <div className="p-6">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Link href={`/stay/${room.id}`} className="font-display text-xl font-light hover:text-brand-accent"><LocalizedText value={room.name as any} /></Link>
                <Badge variant="secondary" className="text-[10px]">{room.max_occupancy} tamu</Badge>
              </div>
              <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">{room.size_sqm} m² • <LocalizedText value={room.bed_type as any} /></p>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4"><LocalizedText value={(room.short_description as any) || room.description as any} /></p>
              <div className="flex items-center justify-between">
                <p className="text-sm"><span className="font-medium"><Price amount={room.base_price} showRate /></span></p>
                <Button asChild size="sm" className="rounded-none bg-brand-foreground text-brand-background h-9 px-4 text-xs tracking-widest">
                  <Link href={`/stay/${room.id}`}><T k="stay.view" /> <ArrowRight className="ml-2 h-3 w-3"/></Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-muted/30 border border-border rounded-lg">
        <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">{tr('stay.comfort_title')}</p>
        <p className="text-sm text-muted-foreground">{tr('stay.comfort_body')}</p>
      </div>
    </div>
  )
}
