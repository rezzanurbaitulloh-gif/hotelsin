import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, MapPin, Utensils, Waves, Compass, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* HERO — Cinematic Fullscreen */}
      <section className="relative h-[100vh] min-h-[640px] flex items-center overflow-hidden bg-stone-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80&auto=format&fit=crop"
            alt="HotelsIn — Tropical sanctuary at dusk"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
        </div>

        <div className="relative container mx-auto px-6 pt-16">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.35em] text-white/70 uppercase mb-6 animate-fade-in">Ubud · Bali · Indonesia</p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[0.9] tracking-tight text-white mb-6 animate-slide-up">
              A quieter<br />
              <span className="italic font-light">way to</span><br />
              arrive
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed mb-10 animate-slide-up delay-200 font-light">
              A private sanctuary shaped by architecture, nature and time. Twenty villas hidden within a valley of rice terraces and ancient forest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up delay-300">
              <Button asChild size="xl" className="rounded-none bg-white text-stone-900 hover:bg-white/90 h-14 px-8 tracking-[0.15em] text-xs font-medium">
                <Link href="/reserve">RESERVE YOUR STAY</Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="rounded-none border-white/30 bg-white/10 backdrop-blur text-white hover:bg-white hover:text-stone-900 h-14 px-8 tracking-[0.15em] text-xs font-medium">
                <Link href="/property">EXPLORE THE PROPERTY</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/60">
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-12 bg-white/30" />
        </div>
      </section>

      {/* RESERVATION BAR — Floating Editorial */}
      <section className="relative z-20 -mt-12 container mx-auto px-6">
        <div className="bg-card border border-border shadow-xl max-w-6xl mx-auto">
          <form className="grid grid-cols-2 md:grid-cols-5 divide-x divide-border">
            <label className="p-5 flex flex-col gap-1 cursor-pointer hover:bg-muted/30 transition-colors">
              <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Arrival</span>
              <input type="date" className="bg-transparent text-sm font-medium outline-none" defaultValue="2026-09-15" />
              <span className="text-xs text-muted-foreground">Tue · Sep 15</span>
            </label>
            <label className="p-5 flex flex-col gap-1 cursor-pointer hover:bg-muted/30 transition-colors">
              <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Departure</span>
              <input type="date" className="bg-transparent text-sm font-medium outline-none" defaultValue="2026-09-18" />
              <span className="text-xs text-muted-foreground">Fri · Sep 18</span>
            </label>
            <label className="p-5 flex flex-col gap-1 cursor-pointer hover:bg-muted/30 transition-colors">
              <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Guests</span>
              <span className="text-sm font-medium">2 Adults</span>
              <span className="text-xs text-muted-foreground">1 Room</span>
            </label>
            <label className="p-5 hidden md:flex flex-col gap-1 cursor-pointer hover:bg-muted/30 transition-colors">
              <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Promo Code</span>
              <input placeholder="Optional" className="bg-transparent text-sm placeholder:text-muted-foreground/50 outline-none" />
              <span className="text-xs text-muted-foreground">&nbsp;</span>
            </label>
            <div className="col-span-2 md:col-span-1">
              <button type="submit" className="w-full h-full bg-brand-foreground text-brand-background hover:bg-brand-foreground/90 transition-colors flex items-center justify-center gap-2 text-xs tracking-[0.2em] font-medium p-5">
                CHECK AVAILABILITY <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* BRAND STATEMENT */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-8">HotelsIn Ubud</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight mb-8">
              Architecture that <em className="italic font-light">breathes</em><br />with the landscape
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto mb-10">
              Carved into a hillside above the Ayung River, HotelsIn is not a hotel imposed upon nature, but one grown from it. Local volcanic stone, reclaimed teak, and hand-woven alang-alang roofs compose a village that feels as though it has always been here.
            </p>
            <Link href="/property" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] border-b border-brand-accent pb-2 hover:text-brand-accent transition-colors">
              DISCOVER OUR STORY <ArrowRight className="h-3 w-3" />
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
            <p className="text-xs tracking-[0.3em] text-brand-accent uppercase mb-6">The Property</p>
            <h3 className="font-display text-3xl md:text-4xl font-light leading-tight mb-6">Twenty villas.<br />One valley. <br /><span className="italic">Endless horizon.</span></h3>
            <p className="text-stone-300 leading-relaxed mb-8 font-light">Each villa is positioned for absolute privacy — no shared walls, no overlooking terraces. Just you, the canopy, and the river hundreds of meters below.</p>
            <Button asChild variant="outline" className="rounded-none border-white/20 text-white hover:bg-white hover:text-stone-900 bg-transparent tracking-[0.15em] text-xs h-11 px-6">
              <Link href="/property">EXPLORE THE ESTATE</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ROOMS — Editorial Showcase */}
      <section className="py-24 md:py-32 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-4">Stay</p>
              <h2 className="font-display text-4xl md:text-5xl font-light leading-none">A place to<br /><span className="italic">belong</span></h2>
            </div>
            <Link href="/stay" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] border border-border bg-card px-6 h-11 hover:bg-brand-foreground hover:text-brand-background hover:border-brand-foreground transition-colors">
              VIEW ALL ROOMS <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: 'Ocean Residence', m2: '380', guests: '4', price: '890', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80&auto=format&fit=crop' },
              { name: 'Garden Villa', m2: '210', guests: '2', price: '520', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80&auto=format&fit=crop' },
              { name: 'Cliff Villa', m2: '290', guests: '3', price: '680', img: 'https://images.unsplash.com/photo-1578683010236-d716f649c0d8?w=800&q=80&auto=format&fit=crop' },
            ].map((room) => (
              <Link key={room.name} href="/stay" className="group">
                <div className="aspect-[4/3] overflow-hidden bg-muted mb-5">
                  <img src={room.img} alt={room.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h3 className="font-display text-xl font-light mb-2 group-hover:text-brand-accent transition-colors">{room.name}</h3>
                <p className="text-xs tracking-widest text-muted-foreground uppercase mb-3">{room.m2} m² · {room.guests} Guests · Private Pool</p>
                <p className="text-sm"><span className="text-muted-foreground">From</span> <span className="font-medium">${room.price}</span> <span className="text-muted-foreground">/ night</span></p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCES — Horizontal Editorial */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-4">Experiences</p>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-none mb-12">Designed by <span className="italic">place</span></h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { k: 'Dawn Temple Trek', cat: 'Culture', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80&auto=format&fit=crop' },
              { k: 'Rice Terrace Cycling', cat: 'Nature', img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80&auto=format&fit=crop' },
              { k: 'Ayung River Rafting', cat: 'Adventure', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80&auto=format&fit=crop' },
              { k: 'Private Balinese Feast', cat: 'Culinary', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&auto=format&fit=crop' },
            ].map((e) => (
              <Link key={e.k} href="/experiences" className="group">
                <div className="aspect-[3/4] overflow-hidden bg-muted mb-4 relative">
                  <img src={e.img} alt={e.k} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-[10px] tracking-[0.2em] text-white/80 uppercase border border-white/30 px-2 py-1 backdrop-blur">{e.cat}</span>
                </div>
                <h3 className="font-display text-lg font-light leading-tight group-hover:text-brand-accent transition-colors">{e.k}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DINING & WELLNESS — Two Panels */}
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

      {/* JOURNAL TEASER */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-4">Journal</p>
              <h2 className="font-display text-4xl md:text-5xl font-light leading-none">Stories from<br /><span className="italic">the valley</span></h2>
            </div>
            <Link href="/journal" className="hidden md:inline-flex items-center gap-2 text-xs tracking-[0.2em] border-b border-brand-accent pb-2 hover:text-brand-accent transition-colors">
              VIEW ALL <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'The Weaver of Sidemen', cat: 'Culture', img: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=700&q=80&auto=format&fit=crop' },
              { title: 'A Guide to Balinese Offerings', cat: 'Wellness', img: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=700&q=80&auto=format&fit=crop' },
              { title: 'Architecture Without Air Conditioning', cat: 'Design', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80&auto=format&fit=crop' },
            ].map((post) => (
              <Link key={post.title} href="/journal" className="group">
                <div className="aspect-[4/3] overflow-hidden bg-muted mb-4">
                  <img src={post.img} alt={post.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <p className="text-[10px] tracking-[0.2em] text-brand-accent uppercase mb-2">{post.cat}</p>
                <h3 className="font-display text-xl font-light leading-tight group-hover:text-brand-accent transition-colors">{post.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-24 md:py-32 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <Sparkles className="h-6 w-6 mx-auto mb-6 text-brand-accent" />
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6">Your villa awaits</h2>
          <p className="text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">Availability is limited to preserve stillness. We recommend reserving 30–60 days in advance, especially for Garden and Ocean residences.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="xl" className="rounded-none bg-brand-foreground text-brand-background hover:bg-brand-foreground/90 h-14 px-10 tracking-[0.15em] text-xs">
              <Link href="/reserve">CHECK AVAILABILITY</Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="rounded-none h-14 px-10 tracking-[0.15em] text-xs">
              <Link href="/offers">VIEW OFFERS</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
