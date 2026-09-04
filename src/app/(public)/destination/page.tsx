import { LiveMap } from '@/components/maps/live-map'
import { getSiteSettings } from '@/lib/db/site-settings'
export const dynamic = 'force-dynamic'
export default async function DestinationPage(){
  let maps:any = null
  try { maps = await getSiteSettings('maps') } catch {}
  const lat = maps?.lat ?? -8.5069, lng = maps?.lng ?? 115.2625, zoom = maps?.zoom ?? 13
  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] min-h-[400px] flex items-center bg-stone-900 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80&auto=format&fit=crop" alt="Ubud destination" className="absolute inset-0 h-full w-full object-cover opacity-70"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
        <div className="relative container mx-auto px-6">
          <p className="text-xs tracking-[0.35em] text-white/70 uppercase mb-4">Destination</p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-white leading-none">At the cultural<br/><span className="italic">heart</span> of Bali</h1>
        </div>
      </section>
      <section className="py-16 container mx-auto px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4"><h3 className="font-medium">7′ to Ubud Centre</h3><p className="text-sm text-muted-foreground">Royal palace, artisan villages, morning market with Chef Wayan.</p></div>
          <div className="space-y-4"><h3 className="font-medium">35′ to Airport</h3><p className="text-sm text-muted-foreground">Ngurah Rai via new toll — private transfer included for suite guests.</p></div>
          <div className="space-y-4"><h3 className="font-medium">Curated Experiences</h3><p className="text-sm text-muted-foreground">Temple blessings, Sidemen weavers, Ayung rafting — all private.</p></div>
        </div>
        <div className="mt-12">
          <h2 className="font-display text-2xl font-light mb-4">Explore Live Map</h2>
          <LiveMap lat={lat} lng={lng} zoom={zoom} markerTitle="HotelsIn — Ubud" />
        </div>
      </section>
    </div>
  )
}
