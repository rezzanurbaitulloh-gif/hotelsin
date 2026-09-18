import { ReactNode } from 'react'
import Link from 'next/link'
import { PublicHeader } from '@/components/public-header'
import { SocialIcons } from '@/components/social-icons'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { getAllSiteSettings } from '@/lib/db/site-settings'

export default async function PublicLayout({ children }: { children: ReactNode }) {
  let social: any[] = []
  let wa: any = null
  let footer: any = null
  try {
    const all = await getAllSiteSettings()
    social = all.social_links || []
    wa = all.floating_wa || null
    footer = all.footer || null
  } catch {}
  // fallback if DB not available
  if (!social.length) {
    social = [
      { platform: 'instagram', url: 'https://instagram.com/hotelsin', enabled: true },
      { platform: 'facebook', url: 'https://facebook.com/hotelsin', enabled: true },
      { platform: 'x', url: 'https://x.com/hotelsin', enabled: true },
      { platform: 'youtube', url: 'https://youtube.com/@hotelsin', enabled: true },
      { platform: 'tiktok', url: 'https://tiktok.com/@hotelsin', enabled: true },
      { platform: 'whatsapp', url: 'https://wa.me/62361975888', enabled: true },
    ]
  }
  if (!wa) wa = { enabled: true, phone: '+62 361 975 888', message: 'Halo HotelsIn, saya ingin bertanya tentang ketersediaan villa.', side: 'right', position: 'bottom' }
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1 pt-16">{children}</main>
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <Link href="/" className="font-display text-2xl font-medium tracking-tight">HotelsIn</Link>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">A private sanctuary shaped by architecture, nature and time. Nested in the heart of Ubud, Bali.</p>
              <SocialIcons links={social} />
            </div>
            <nav className="space-y-3">
              <h4 className="font-medium tracking-[0.15em] uppercase text-xs">Explore</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/stay" className="hover:text-foreground transition-colors">Stay</Link></li>
                <li><Link href="/dine" className="hover:text-foreground transition-colors">Dine</Link></li>
                <li><Link href="/wellness" className="hover:text-foreground transition-colors">Wellness</Link></li>
                <li><Link href="/experiences" className="hover:text-foreground transition-colors">Experiences</Link></li>
                <li><Link href="/offers" className="hover:text-foreground transition-colors">Offers</Link></li>
                <li><Link href="/journal" className="hover:text-foreground transition-colors">Journal</Link></li>
              </ul>
            </nav>
            <nav className="space-y-3">
              <h4 className="font-medium tracking-[0.15em] uppercase text-xs">Property</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/property" className="hover:text-foreground transition-colors">Our Story</Link></li>
                <li><Link href="/destination" className="hover:text-foreground transition-colors">Destination</Link></li>
                <li><Link href="/gallery" className="hover:text-foreground transition-colors">Gallery</Link></li>
                <li><Link href="/reserve" className="hover:text-foreground transition-colors">Reserve</Link></li>
              </ul>
            </nav>
            <div className="space-y-3">
              <h4 className="font-medium tracking-[0.15em] uppercase text-xs">Contact</h4>
              <address className="text-sm text-muted-foreground not-italic space-y-1 leading-relaxed">
                <p>{footer?.address || 'Jalan Raya Ubud No. 88'}</p>
                <p>Ubud, Gianyar, Bali 80571</p>
                <p>Indonesia</p>
                <p className="pt-3 font-medium text-foreground">{footer?.contact || '+62 361 975 888'}</p>
                <p>{footer?.email || 'reservations@hotelsin.com'}</p>
              </address>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs tracking-wider text-muted-foreground uppercase">© {new Date().getFullYear()} portoja. All rights reserved.</p>
            <div className="flex items-center space-x-6 text-xs tracking-wider">
              <Link href="/policies#privacy" className="text-muted-foreground hover:text-foreground transition-colors uppercase">Privacy</Link>
              <Link href="/policies#terms" className="text-muted-foreground hover:text-foreground transition-colors uppercase">Terms</Link>
              <Link href="/policies#cookies" className="text-muted-foreground hover:text-foreground transition-colors uppercase">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
      {wa?.enabled && <FloatingWhatsApp phone={wa.phone} message={wa.message} side={wa.side||'right'} position={wa.position||'bottom'} />}
    </div>
  )
}
