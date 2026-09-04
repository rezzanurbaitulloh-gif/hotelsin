import { LiveMap } from '@/components/maps/live-map'
import { getSiteSettings } from '@/lib/db/site-settings'
export const dynamic = 'force-dynamic'
export default async function PropertyPage(){
  let maps:any = null
  try { maps = await getSiteSettings('maps') } catch {}
  const lat = maps?.lat ?? -8.5069, lng = maps?.lng ?? 115.2625, zoom = maps?.zoom ?? 15
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
          <p className="text-sm text-muted-foreground mb-6">Jalan Raya Ubud No. 88, Sayan, Ubud — drag to explore, admin can update lat/lng in Settings → Maps</p>
          <LiveMap lat={lat} lng={lng} zoom={zoom} markerTitle="HotelsIn Ubud" />
        </div>
      </section>
    </div>
  )
}
