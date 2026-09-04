'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useI18n } from '@/lib/i18n'

const navigation = [
  { key: 'stay', href: '/stay' },
  { key: 'dine', href: '/dine' },
  { key: 'wellness', href: '/wellness' },
  { key: 'experiences', href: '/experiences' },
  { key: 'property', href: '/property' },
  { key: 'offers', href: '/offers' },
  { key: 'journal', href: '/journal' },
]

export function PublicHeader() {
  const pathname = usePathname()
  const { locale, currency, setLocale, setCurrency, t } = useI18n()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2" aria-label="HotelsIn Home">
            <span className="font-display text-2xl font-medium tracking-tight text-foreground">
              HotelsIn
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  'text-xs font-medium tracking-[0.15em] transition-colors hover:text-brand-accent',
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'text-brand-accent'
                    : 'text-muted-foreground'
                )}
              >
                {t(`nav.${item.key.toLowerCase()}`)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden md:flex items-center gap-2">
              <Select value={locale} onValueChange={(v) => setLocale(v as typeof locale)}>
                <SelectTrigger className="w-[110px] h-9 bg-transparent border-border text-xs tracking-wider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">ENGLISH</SelectItem>
                  <SelectItem value="id">INDONESIA</SelectItem>
                </SelectContent>
              </Select>
              <Select value={currency} onValueChange={(v) => setCurrency(v as typeof currency)}>
                <SelectTrigger className="w-[90px] h-9 bg-transparent border-border text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="IDR">IDR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button asChild size="sm" className="hidden sm:inline-flex h-9 px-5 bg-brand-foreground text-brand-background hover:bg-brand-foreground/90 text-xs tracking-[0.15em] rounded-none font-medium">
              <Link href="/reserve">{t('nav.reserve')}</Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/account/profile" className="flex w-full items-center">
                    <User className="mr-2 h-4 w-4" />
                    {t('nav.account')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/reservations" className="flex w-full items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    My Reservations
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="flex w-full items-center text-brand-accent">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Admin
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('auth.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-slide-down">
          <div className="container mx-auto px-6 py-6 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  'block py-3 text-sm font-medium tracking-[0.15em] border-b border-border/50 last:border-0',
                  pathname === item.href ? 'text-brand-accent' : 'text-muted-foreground'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(`nav.${item.key.toLowerCase()}`)}
              </Link>
            ))}
            <div className="flex gap-2 pt-4">
              <Select value={locale} onValueChange={(v) => setLocale(v as typeof locale)}>
                <SelectTrigger className="flex-1 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">ENGLISH</SelectItem>
                  <SelectItem value="id">INDONESIA</SelectItem>
                </SelectContent>
              </Select>
              <Select value={currency} onValueChange={(v) => setCurrency(v as typeof currency)}>
                <SelectTrigger className="flex-1 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="IDR">IDR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button asChild className="w-full mt-4 rounded-none bg-brand-foreground text-brand-background h-11 tracking-[0.15em] text-xs">
              <Link href="/reserve" onClick={() => setMobileMenuOpen(false)}>{t('nav.reserve')}</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
