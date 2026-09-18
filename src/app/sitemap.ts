import type { MetadataRoute } from 'next'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://hotelsin.vercel.app').replace(/\/$/, '')
  const now = new Date()
  const staticRoutes = [
    '', '/stay', '/dine', '/wellness', '/experiences', '/property',
    '/destination', '/offers', '/gallery', '/journal', '/reserve', '/policies',
  ].map((p) => ({ url: `${base}${p || '/'}`, lastModified: now, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.8 }))

  try {
    const supabase = createServiceClient()
    const [{ data: rooms }, { data: posts }, { data: offers }] = await Promise.all([
      supabase.from('room_types').select('id,updated_at').eq('is_active', true),
      supabase.from('journal_posts').select('slug,updated_at').eq('status', 'PUBLISHED'),
      supabase.from('offers').select('id,updated_at').eq('is_active', true),
    ])
    const dynamicRoutes: MetadataRoute.Sitemap = [
      ...((rooms as any[]) || []).map((r) => ({ url: `${base}/stay/${r.id}`, lastModified: r.updated_at ? new Date(r.updated_at) : now, changeFrequency: 'weekly' as const, priority: 0.7 })),
      ...((posts as any[]) || []).map((p) => ({ url: `${base}/journal/${p.slug}`, lastModified: p.updated_at ? new Date(p.updated_at) : now, changeFrequency: 'monthly' as const, priority: 0.6 })),
      ...((offers as any[]) || []).map((o) => ({ url: `${base}/offers/${o.id}`, lastModified: o.updated_at ? new Date(o.updated_at) : now, changeFrequency: 'weekly' as const, priority: 0.6 })),
    ]
    return [...staticRoutes, ...dynamicRoutes]
  } catch {
    return staticRoutes
  }
}
