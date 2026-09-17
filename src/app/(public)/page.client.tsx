'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { Price } from '@/components/price'
import { LocalizedText } from '@/components/localized'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function HomeRooms() {
  const { t } = useI18n()
  const [rooms, setRooms] = useState<any[]>([])
  useEffect(()=>{
    const supabase = createClient()
    supabase.from('room_types').select('id,name,size_sqm,max_occupancy,base_price,images').eq('is_active', true).order('sort_order').limit(3).then(({data})=> setRooms(data||[]))
  },[])
  if (!rooms.length) return <div className="py-12 text-center border border-dashed rounded-lg text-muted-foreground">No rooms</div>
  return (
    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
      {rooms.map((room:any)=> (
        <Link key={room.id} href={`/stay/${room.id}`} className="group">
          <div className="aspect-[4/3] overflow-hidden bg-muted mb-5">
            <img src={room.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'} alt={room.name?.en} className="h-full w-full object-cover group-hover:scale-105 duration-700" />
          </div>
          <h3 className="font-display text-xl font-light mb-2 group-hover:text-brand-accent"><LocalizedText value={room.name} /></h3>
          <p className="text-xs tracking-widest text-muted-foreground uppercase mb-3">{room.size_sqm} m² · {room.max_occupancy} <LocalizedText value={{ en: 'Guests', id: 'Tamu' } as any} /> · Private Pool</p>
          <p className="text-sm"><span className="text-muted-foreground">{t('rooms.from')}</span> <span className="font-medium"><Price amount={room.base_price} /></span> <span className="text-muted-foreground">{t('rooms.per_night')}</span></p>
        </Link>
      ))}
    </div>
  )
}
