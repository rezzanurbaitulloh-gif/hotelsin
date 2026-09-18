import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://hotelsin.vercel.app').replace(/\/$/, '')
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/account/', '/api/', '/reserve/payment/', '/reserve/confirmation'] },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
