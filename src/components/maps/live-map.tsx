'use client'
import { useEffect, useState } from 'react'
export function LiveMap({ lat, lng, zoom, markerTitle }: { lat: number, lng: number, zoom: number, markerTitle: string }) {
  const [mounted, setMounted] = useState(false)
  useEffect(()=> setMounted(true), [])
  if (!mounted) return <div className="h-64 bg-muted animate-pulse rounded-lg" />
  const delta = 0.01
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}#map=${zoom}/${lat}/${lng}`
  return (
    <div className="relative h-64 md:h-80 rounded-lg overflow-hidden border border-border">
      <iframe title={markerTitle} src={src} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      <a href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`} target="_blank" rel="noopener noreferrer" className="absolute bottom-2 right-2 bg-card border border-border text-xs px-2 py-1 rounded shadow hover:bg-muted">
        Lihat peta besar →
      </a>
    </div>
  )
}
