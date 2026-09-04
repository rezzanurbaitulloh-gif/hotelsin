'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, LogOut, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useI18n } from '@/lib/i18n'
import { ThemeToggle } from '@/components/theme-toggle'

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
  const [user, setUser] = React.useState<any>(null)
  const [role, setRole] = React.useState<string | null>(null)
  const [isCoreRole, setIsCoreRole] = React.useState(false)

  React.useEffect(()=>{
    const supabase = require('@/lib/supabase/client').createClient()
    supabase.auth.getUser().then(async ({data}:{data:any})=>{
      const u = data.user
      setUser(u)
      if (u?.email) {
        const { data: pub } = await supabase.from('users').select('role').eq('email', u.email).single()
        const r = (pub?.role as string) || (u.user_metadata as any)?.role || (u.app_metadata as any)?.role || null
        setRole(r)
        setIsCoreRole(['SUPER_ADMIN','HOTEL_ADMIN','FRONT_DESK','HOUSEKEEPING','REVENUE_MANAGER','CONTENT_MANAGER'].includes(r as string))
      }
    })
    const { data: { subscription } } = require('@/lib/supabase/client').createClient().auth.onAuthStateChange((_e:any, s:any)=>{
      const u = s?.user || null
      setUser(u)
      if (u?.email) {
        require('@/lib/supabase/client').createClient().from('users').select('role').eq('email', u.email).single().then(({data:pub}:any)=>{
          const r = (pub?.role as string) || (u.user_metadata as any)?.role || (u.app_metadata as any)?.role || null
          setRole(r)
          setIsCoreRole(['SUPER_ADMIN','HOTEL_ADMIN','FRONT_DESK','HOUSEKEEPING','REVENUE_MANAGER','CONTENT_MANAGER'].includes(r as string))
        })
      } else {
        setRole(null); setIsCoreRole(false)
      }
    })
    return ()=> subscription.unsubscribe()
  }, [])

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
                href={item.href as any}
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
              <Select value={locale} onValueChange={(v) => { setLocale(v as typeof locale); setCurrency((v === 'id' ? 'IDR' : 'USD') as typeof currency) }}>
                <SelectTrigger className="w-[140px] h-9 bg-transparent border-border text-xs tracking-wider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">ENGLISH — USD</SelectItem>
                  <SelectItem value="id">INDONESIA — IDR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ThemeToggle />
            <Button asChild size="sm" className="hidden sm:inline-flex h-9 px-5 bg-brand-foreground text-brand-background hover:bg-brand-foreground/90 text-xs tracking-[0.15em] rounded-none font-medium">
              <Link href="/reserve">{t('nav.reserve')}</Link>
            </Button>

            {!user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Button asChild variant="outline" size="sm" className="h-9 px-5 rounded-none text-xs tracking-[0.15em]">
                  <Link href="/login">MASUK</Link>
                </Button>
                <Button asChild size="sm" className="h-9 px-5 rounded-none bg-brand-foreground text-brand-background text-xs tracking-[0.15em]">
                  <Link href="/register">DAFTAR</Link>
                </Button>
              </div>
            ) : null}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 relative overflow-hidden">
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
                  ) : user ? (
                    <span className="h-8 w-8 rounded-full bg-brand-accent text-white grid place-items-center text-xs font-medium">
                      {(user.email?.[0] || 'U').toUpperCase()}
                    </span>
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  {isCoreRole && <span className="absolute -top-1 -right-1 h-2 w-2 bg-brand-accent rounded-full animate-pulse"/>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {!user ? (
                  <>
                    <DropdownMenuItem asChild><Link href="/login" className="flex w-full items-center"><LogOut className="mr-2 h-4 w-4 rotate-180"/>Masuk</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/register" className="flex w-full items-center"><User className="mr-2 h-4 w-4"/>Daftar</Link></DropdownMenuItem>
                    <p className="px-2 py-1 text-[10px] text-muted-foreground">Belum punya akun? Daftar sekarang</p>
                  </>
                ) : (
                  <>
                    <div className="px-2 py-2 border-b border-border mb-1 flex items-center gap-3">
                      {user?.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <span className="h-8 w-8 rounded-full bg-muted grid place-items-center"><User className="h-4 w-4"/></span>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{user.email}</p>
                        <p className="text-[10px] tracking-widest text-muted-foreground uppercase">{role || 'GUEST'} {isCoreRole && '• CORE'}</p>
                      </div>
                    </div>
                    <DropdownMenuItem asChild><Link href="/account/profile" className="flex w-full items-center"><User className="mr-2 h-4 w-4"/>{t('nav.account')} — Avatar</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/account/reservations" className="flex w-full items-center"><LayoutDashboard className="mr-2 h-4 w-4"/>My Reservations</Link></DropdownMenuItem>
                    {isCoreRole && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild><Link href="/admin" className="flex w-full items-center text-brand-accent font-medium"><LayoutDashboard className="mr-2 h-4 w-4"/>Admin Dashboard</Link></DropdownMenuItem>
                        <p className="px-2 py-1 text-[10px] text-muted-foreground">Akses: {role}</p>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={async ()=>{
                      const { createClient } = await import('@/lib/supabase/client')
                      await createClient().auth.signOut()
                      window.location.href='/'
                    }}>
                      <LogOut className="mr-2 h-4 w-4"/>{t('auth.logout')}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
