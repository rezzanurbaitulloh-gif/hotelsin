import { LiveMap } from '@/components/maps/live-map'
import { getSiteSettings } from '@/lib/db/site-settings'
import { createClient } from '@/lib/supabase/server'
import { ReviewStars, ReviewForm } from '@/components/review-form'
export const dynamic = 'force-dynamic'
export default async function PropertyPage(){
  let maps:any = null
  try { maps = await getSiteSettings('maps') } catch {}
  const lat = maps?.lat ?? -8.5069, lng = maps?.lng ?? 115.2625, zoom = maps?.zoom ?? 15
  const supabase = await createClient()
  const { data: reviews } = await supabase.from('reviews').select('id,guest_name,rating,title,comment,created_at').eq('status', 'APPROVED').order('created_at', { ascending: false }).limit(6)
  const avg = (reviews && reviews.length) ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length) : 0
  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] min-h-[400px] flex items-center bg-stone-900 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=80&auto=format&fit=crop" alt="HotelsIn property" className="absolute inset-0 h-full w-full object-cover opacity-70"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
        <div className="relative container mx-auto px-6">
          <p className="text-xs tracking-[0.35em] text-white/70 uppercase mb-4">Our Story</p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-white leading-none">Architecture that<br/><span className="italic">breathes</span></h1>
        </div>
      </section>
      <section className="py-16 md:py-24 container mx-auto px-6 max-w-3xl">
        <p className="text-lg leading-relaxed text-muted-foreground mb-8">Carved into a hillside above the Ayung River, HotelsIn is not a hotel imposed upon nature, but one grown from it. Local volcanic stone, reclaimed teak, and hand-woven alang-alang roofs compose a village that feels as though it has always been here.</p>
        <div className="grid gap-6 md:grid-cols-3 py-8 border-y border-border text-center">
          <div><p className="font-display text-3xl">20</p><p className="text-xs tracking-widest text-muted-foreground uppercase">Villas</p></div>
          <div><p className="font-display text-3xl">2019</p><p className="text-xs tracking-widest text-muted-foreground uppercase">Established</p></div>
          <div><p className="font-display text-3xl">12<span className="text-brand-accent">ha</span></p><p className="text-xs tracking-widest text-muted-foreground uppercase">Private Valley</p></div>
        </div>
        <h2 className="font-display text-2xl font-light mt-12 mb-4">Philosophy</h2>
        <p className="text-muted-foreground leading-relaxed">No air conditioning by design — cross-ventilation, deep eaves, and stone thermal mass keep villas cool. No shared walls. No overlooking terraces. Just privacy, canopy, and the river hundreds of meters below.</p>
      </section>
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-2xl font-light mb-4">Live Location</h2>
          <p className="text-sm text-muted-foreground mb-6">Jalan Raya Ubud No. 88, Sayan, Ubud, Gianyar, Bali</p>
          <LiveMap lat={lat} lng={lng} zoom={zoom} markerTitle="HotelsIn Ubud" />
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-2 text-center">Guest Reviews</p>
          <h2 className="font-display text-3xl font-light text-center mb-2">Apa kata tamu kami</h2>
          {reviews && reviews.length > 0 ? (
            <p className="text-center text-sm text-muted-foreground mb-8"><ReviewStars rating={Math.round(avg)} /> {avg.toFixed(1)} / 5 • {reviews.length} ulasan</p>
          ) : (
            <p className="text-center text-sm text-muted-foreground mb-8">Jadilah yang pertama berbagi pengalaman.</p>
          )}
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {(reviews || []).map((r: any) => (
              <div key={r.id} className="border border-border rounded-lg p-5">
                <ReviewStars rating={r.rating} />
                <p className="font-medium text-sm mt-2">{r.title || r.guest_name}</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{r.comment}</p>
                <p className="text-[10px] text-muted-foreground mt-3">— {r.guest_name}</p>
              </div>
            ))}
          </div>
          <div className="max-w-xl mx-auto">
            <h3 className="font-medium text-center mb-4">Bagikan pengalaman Anda</h3>
            <ReviewForm />
          </div>
        </div>
      </section>
    </div>
  )
}
