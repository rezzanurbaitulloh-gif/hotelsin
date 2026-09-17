import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, MapPin, Utensils, Waves, Compass, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ReservationBar } from '@/components/reservation-bar'
import { Price } from '@/components/price'
import { LocalizedText, T } from '@/components/localized'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch real data from Supabase — no hardcode
  const [{ data: roomTypes }, { data: experiences }, { data: journalPosts }, { data: properties }] = await Promise.all([
    supabase.from('room_types').select('id,name,description,base_price,max_occupancy,size_sqm,images,is_active').eq('is_active', true).order('sort_order').limit(3),
    supabase.from('experiences').select('id,name,category,images').eq('is_active', true).order('sort_order').limit(4),
    supabase.from('journal_posts').select('id,slug,title,category,cover_image_url').eq('status', 'PUBLISHED').order('published_at', { ascending: false }).limit(3),
    supabase.from('properties').select('id,name,tagline,hero_image_url').limit(1),
  ])

  const heroImage = properties?.[0]?.hero_image_url || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80&auto=format&fit=crop'

  return (
    <div className="flex flex-col">
      {/* HERO — Cinematic Fullscreen */}
      <section className="relative h-[100vh] min-h-[640px] flex items-center overflow-hidden bg-stone-900">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="HotelsIn — Tropical sanctuary at dusk"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
        </div>

        <div className="relative container mx-auto px-6 pt-16">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.35em] text-white/70 uppercase mb-6 animate-fade-in">Ubud · Bali · Indonesia</p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[0.9] tracking-tight text-white mb-6 animate-slide-up">
              <T k="hero.headline" />
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed mb-10 animate-slide-up delay-200 font-light">
              <T k="hero.subheadline" />
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up delay-300">
              <Button asChild size="xl" className="rounded-none bg-white text-stone-900 hover:bg-white/90 h-14 px-8 tracking-[0.15em] text-xs font-medium">
                <Link href="/reserve"><T k="hero.reserve" /></Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="rounded-none border-white/30 bg-white/10 backdrop-blur text-white hover:bg-white hover:text-stone-900 h-14 px-8 tracking-[0.15em] text-xs font-medium">
                <Link href="/property"><T k="hero.explore" /></Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/60">
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-12 bg-white/30" />
        </div>
      </section>

      {/* RESERVATION BAR — Real Availability Engine */}
      <section className="relative z-20 -mt-12 container mx-auto px-6">
        <div className="bg-card border border-border shadow-xl max-w-6xl mx-auto">
          <ReservationBar />
        </div>
      </section>

      {/* BRAND STATEMENT */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-8"><T k="home.brand_eyebrow" /></p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight mb-8">
              <T k="home.brand_title" />
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto mb-10">
              <T k="home.brand_body" />
            </p>
            <Link href="/property" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] border-b border-brand-accent pb-2 hover:text-brand-accent transition-colors">
              <T k="home.brand_cta" /> <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* PROPERTY STORY — Split */}
      <section className="grid md:grid-cols-2 min-h-[640px]">
        <div className="relative min-h-[480px]">
          <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80&auto=format&fit=crop" alt="Teak pavilion overlooking jungle valley" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="flex items-center bg-stone-900 text-stone-100 p-10 md:p-16 lg:p-20">
          <div className="max-w-md">
            <p className="text-xs tracking-[0.3em] text-brand-accent uppercase mb-6"><T k="home.property_eyebrow" /></p>
            <h3 className="font-display text-3xl md:text-4xl font-light leading-tight mb-6"><T k="home.property_title" /></h3>
            <p className="text-stone-300 leading-relaxed mb-8 font-light"><T k="home.property_body" /></p>
            <Button asChild variant="outline" className="rounded-none border-white/20 text-white hover:bg-white hover:text-stone-900 bg-transparent tracking-[0.15em] text-xs h-11 px-6">
              <Link href="/property"><T k="home.property_cta" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ROOMS — Real DB Editorial Showcase */}
      <section className="py-24 md:py-32 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-4"><T k="home.stay_eyebrow" /></p>
              <h2 className="font-display text-4xl md:text-5xl font-light leading-none"><T k="home.stay_title" /></h2>
            </div>
            <Link href="/stay" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] border border-border bg-card px-6 h-11 hover:bg-brand-foreground hover:text-brand-background hover:border-brand-foreground transition-colors">
              <T k="home.stay_cta" /> <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {!roomTypes || roomTypes.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground"><T k="home.stay_empty" /></p>
              <Link href="/stay" className="inline-block mt-4 text-xs tracking-widest border-b border-brand-accent pb-1">BROWSE STAY</Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {roomTypes.map((room) => (
                <Link key={room.id} href={`/stay/${room.id}`} className="group">
                  <div className="aspect-[4/3] overflow-hidden bg-muted mb-5">
                    <img src={room.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80&auto=format&fit=crop'} alt={(room.name as any)?.en || 'Room'} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <h3 className="font-display text-xl font-light mb-2 group-hover:text-brand-accent transition-colors"><LocalizedText value={room.name as any} fallback="Villa" /></h3>
                  <p className="text-xs tracking-widest text-muted-foreground uppercase mb-3">{room.size_sqm} m² · {room.max_occupancy} <T k="rooms.capacity" /> · Private Pool</p>
                  <p className="text-sm"><span className="font-medium"><Price amount={room.base_price} /></span> <span className="text-muted-foreground"> <T k="rooms.per_night" /></span> · <span className="text-muted-foreground"><T k="rooms.from" /></span></p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* EXPERIENCES — Real DB Horizontal Editorial */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-4"><T k="home.exp_eyebrow" /></p>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-none mb-12"><T k="home.exp_title" /></h2>
          {!experiences || experiences.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-border rounded-lg text-muted-foreground"><T k="home.stay_empty" /></div>
          ) : (
            <div className="grid md:grid-cols-4 gap-6">
              {experiences.map((e) => (
                <Link key={e.id} href={`/experiences/${e.id}`} className="group">
                  <div className="aspect-[3/4] overflow-hidden bg-muted mb-4 relative">
                    <img src={e.images?.[0] || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80&auto=format&fit=crop'} alt={(e.name as any)?.en || 'Experience'} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-4 left-4 text-[10px] tracking-[0.2em] text-white/80 uppercase border border-white/30 px-2 py-1 backdrop-blur">{e.category || 'Experience'}</span>
                  </div>
                  <h3 className="font-display text-lg font-light leading-tight group-hover:text-brand-accent transition-colors"><LocalizedText value={e.name as any} fallback="Experience" /></h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* DINING & WELLNESS — Two Panels (static featured, but could be DB) */}
      <section className="grid md:grid-cols-2 gap-6 container mx-auto px-6 pb-24">
        <Link href="/dine" className="group relative aspect-[4/3] overflow-hidden bg-stone-900">
          <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80&auto=format&fit=crop" alt="Dining at HotelsIn" className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 p-8 md:p-10">
            <p className="text-xs tracking-[0.3em] text-white/70 uppercase mb-3 flex items-center gap-2"><Utensils className="h-3 w-3" /> Dining</p>
            <h3 className="font-display text-3xl font-light text-white mb-2">Ember & Earth</h3>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">Wood-fired tasting menus built from the island&apos;s volcanic soil.</p>
          </div>
        </Link>
        <Link href="/wellness" className="group relative aspect-[4/3] overflow-hidden bg-stone-900">
          <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=80&auto=format&fit=crop" alt="Wellness at HotelsIn" className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 p-8 md:p-10">
            <p className="text-xs tracking-[0.3em] text-white/70 uppercase mb-3 flex items-center gap-2"><Waves className="h-3 w-3" /> Wellness</p>
            <h3 className="font-display text-3xl font-light text-white mb-2">The Sanctuary</h3>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">Ancient healing, modern science. Private treatment pavilions above the forest.</p>
          </div>
        </Link>
      </section>

      {/* DESTINATION */}
      <section className="relative py-24 md:py-32 bg-stone-900 text-stone-100 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80&auto=format&fit=crop" alt="Ubud rice terraces" className="h-full w-full object-cover" />
        </div>
        <div className="relative container mx-auto px-6">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-6 flex items-center gap-2"><MapPin className="h-3 w-3" /> Destination</p>
            <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6">At the cultural<br />heart of Bali</h2>
            <p className="text-stone-300 leading-relaxed mb-8 font-light">Fifteen minutes from Ubud&apos;s royal palace and artisan villages, yet entirely removed. Wake to gamelan drifting through the valley, spend the day among temples and terraces, return to absolute stillness.</p>
            <div className="grid grid-cols-3 gap-6 py-8 border-y border-white/10 mb-8 text-center">
              <div><p className="font-display text-2xl">7<span className="text-brand-accent">′</span></p><p className="text-[10px] tracking-[0.2em] text-stone-400 uppercase">To Ubud Centre</p></div>
              <div><p className="font-display text-2xl">35<span className="text-brand-accent">′</span></p><p className="text-[10px] tracking-[0.2em] text-stone-400 uppercase">To Airport</p></div>
              <div><p className="font-display text-2xl">12<span className="text-brand-accent">°</span></p><p className="text-[10px] tracking-[0.2em] text-stone-400 uppercase">Avg. Breeze</p></div>
            </div>
            <Button asChild variant="outline" className="rounded-none border-white/20 text-white bg-transparent hover:bg-white hover:text-stone-900 tracking-[0.15em] text-xs h-11 px-7">
              <Link href="/destination">EXPLORE UBUD <Compass className="ml-2 h-3 w-3" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* JOURNAL TEASER — Real DB */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-4"><T k="home.journal_eyebrow" /></p>
              <h2 className="font-display text-4xl md:text-5xl font-light leading-none"><T k="home.journal_title" /></h2>
            </div>
            <Link href="/journal" className="hidden md:inline-flex items-center gap-2 text-xs tracking-[0.2em] border-b border-brand-accent pb-2 hover:text-brand-accent transition-colors">
              <T k="home.journal_cta" /> <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {!journalPosts || journalPosts.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-border rounded-lg text-muted-foreground"><T k="home.journal_empty" /></div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {journalPosts.map((post) => (
                <Link key={post.id} href={`/journal/${post.slug}`} className="group">
                  <div className="aspect-[4/3] overflow-hidden bg-muted mb-4">
                    <img src={post.cover_image_url || 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=700&q=80&auto=format&fit=crop'} alt={(post.title as any)?.en || 'Journal'} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <p className="text-[10px] tracking-[0.2em] text-brand-accent uppercase mb-2">{post.category || 'Journal'}</p>
                  <h3 className="font-display text-xl font-light leading-tight group-hover:text-brand-accent transition-colors"><LocalizedText value={post.title as any} fallback="Untitled" /></h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-24 md:py-32 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <Sparkles className="h-6 w-6 mx-auto mb-6 text-brand-accent" />
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6"><T k="home.cta_title" /></h2>
          <p className="text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto"><T k="home.cta_body" /></p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="xl" className="rounded-none bg-brand-foreground text-brand-background hover:bg-brand-foreground/90 h-14 px-10 tracking-[0.15em] text-xs">
              <Link href="/reserve"><T k="home.cta_check" /></Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="rounded-none h-14 px-10 tracking-[0.15em] text-xs">
              <Link href="/offers"><T k="home.cta_offers" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
