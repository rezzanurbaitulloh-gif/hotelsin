'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CalendarDays, Users, BedDouble, Sparkles, DollarSign, Image, Settings, Menu, X, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

const nav = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard, group: 'COMMAND CENTER' },
  { label: 'Reservations', href: '/admin/reservations', icon: CalendarDays, group: 'FRONT OFFICE' },
  { label: 'Arrivals', href: '/admin/arrivals', group: 'FRONT OFFICE' },
  { label: 'Departures', href: '/admin/departures', group: 'FRONT OFFICE' },
  { label: 'Guests', href: '/admin/guests', icon: Users, group: 'FRONT OFFICE' },
  { label: 'Guest Requests', href: '/admin/guest-requests', group: 'FRONT OFFICE' },
  { label: 'Rooms', href: '/admin/rooms', icon: BedDouble, group: 'PROPERTY' },
  { label: 'Room Types', href: '/admin/room-types', group: 'PROPERTY' },
  { label: 'Availability', href: '/admin/availability', group: 'PROPERTY' },
  { label: 'Amenities', href: '/admin/amenities', group: 'PROPERTY' },
  { label: 'Housekeeping', href: '/admin/housekeeping', icon: Sparkles, group: 'OPERATIONS' },
  { label: 'Maintenance', href: '/admin/maintenance', group: 'OPERATIONS' },
  { label: 'Rates', href: '/admin/rates', icon: DollarSign, group: 'REVENUE' },
  { label: 'Offers', href: '/admin/offers', group: 'REVENUE' },
  { label: 'Transactions', href: '/admin/transactions', group: 'REVENUE' },
  { label: 'Reports', href: '/admin/reports', group: 'REVENUE' },
  { label: 'Dining', href: '/admin/dining', group: 'EXPERIENCE' },
  { label: 'Wellness', href: '/admin/wellness', group: 'EXPERIENCE' },
  { label: 'Experiences', href: '/admin/experiences', group: 'EXPERIENCE' },
  { label: 'Homepage', href: '/admin/website/homepage', icon: Image, group: 'WEBSITE' },
  { label: 'Pages', href: '/admin/website/pages', group: 'WEBSITE' },
  { label: 'Gallery', href: '/admin/website/gallery', group: 'WEBSITE' },
  { label: 'Journal', href: '/admin/website/journal', group: 'WEBSITE' },
  { label: 'Reviews', href: '/admin/reviews', group: 'WEBSITE' },
  { label: 'Navigation', href: '/admin/website/navigation', group: 'WEBSITE' },
  { label: 'Localization', href: '/admin/website/localization', group: 'WEBSITE' },
  { label: 'Activity', href: '/admin/activity', group: 'ADMINISTRATION' },
  { label: 'Users', href: '/admin/administration/users', icon: Settings, group: 'ADMINISTRATION' },
  { label: 'Roles', href: '/admin/administration/roles', group: 'ADMINISTRATION' },
  { label: 'Permissions', href: '/admin/administration/permissions', group: 'ADMINISTRATION' },
  { label: 'Settings', href: '/admin/administration/settings', group: 'ADMINISTRATION' },
]

function Sidebar({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const groups = Array.from(new Set(nav.map(n => n.group)))
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <Link href="/admin" className="font-display text-xl font-medium tracking-tight">HotelsIn</Link>
        <p className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase mt-1">Operations</p>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-6">
          {groups.map(g => (
            <div key={g}>
              <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-2 px-2">{g}</p>
              <ul className="space-y-1">
                {nav.filter(n => n.group === g).map(item => {
                  const active = pathname === item.href
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href as any}
                        onClick={onNavigate}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          active ? "bg-brand-foreground text-brand-background font-medium" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {item.icon ? <item.icon className="h-4 w-4" /> : <span className="w-4" />}
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t border-border space-y-2">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground px-3 py-2">
          ← Back to Website
        </Link>
        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  return (
    <div className="min-h-screen flex bg-muted/20">
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-border bg-card flex-col fixed inset-y-0 left-0">
        <Sidebar pathname={pathname} />
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-card border-r border-border flex flex-col">
            <Sidebar pathname={pathname} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" aria-label="Menu" className="lg:hidden" onClick={() => setOpen(!open)}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="font-medium text-sm tracking-wide hidden sm:block">
              {nav.find(n => n.href === pathname)?.label ?? 'Command Center'}
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="hidden md:inline text-muted-foreground">SUPER ADMIN · rezzanurbaitulloh</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-muted-foreground hidden sm:inline">Live</span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
