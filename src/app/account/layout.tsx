import { ReactNode } from 'react'
import Link from 'next/link'

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-6 py-8 pt-20">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-2">Account</p>
          <h1 className="font-display text-3xl font-light">Your HotelsIn</h1>
        </div>
        <nav className="flex gap-2">
          <Link href="/account/profile" className="h-9 px-4 inline-flex items-center border border-border text-xs tracking-[0.15em] hover:bg-brand-foreground hover:text-brand-background transition-colors">PROFILE</Link>
          <Link href="/account/reservations" className="h-9 px-4 inline-flex items-center bg-brand-foreground text-brand-background text-xs tracking-[0.15em]">RESERVATIONS</Link>
          <Link href="/" className="h-9 px-4 inline-flex items-center border border-border text-xs tracking-[0.15em]">HOME</Link>
        </nav>
      </div>
      {children}
    </div>
  )
}
