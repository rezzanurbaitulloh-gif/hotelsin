'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export function ReservationBar() {
  const router = useRouter()
  const { t } = useI18n()
  const [arrival, setArrival] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d.toISOString().split('T')[0]
  })
  const [departure, setDeparture] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 10)
    return d.toISOString().split('T')[0]
  })
  const [guests, setGuests] = useState(2)
  const [promo, setPromo] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams({
      check_in: arrival,
      check_out: departure,
      guests: String(guests),
      promo,
    })
    router.push(`/reserve/availability?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-5 divide-x divide-border">
      <label className="p-5 flex flex-col gap-1 cursor-pointer hover:bg-muted/30 transition-colors">
        <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">{t('reservation.arrival')}</span>
        <input type="date" value={arrival} onChange={e=> setArrival(e.target.value)} className="bg-transparent text-sm font-medium outline-none" required />
        <span className="text-xs text-muted-foreground">{new Date(arrival).toLocaleDateString('id-ID', { weekday:'short', day:'numeric', month:'short' })}</span>
      </label>
      <label className="p-5 flex flex-col gap-1 cursor-pointer hover:bg-muted/30 transition-colors">
        <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">{t('reservation.departure')}</span>
        <input type="date" value={departure} onChange={e=> setDeparture(e.target.value)} className="bg-transparent text-sm font-medium outline-none" required />
        <span className="text-xs text-muted-foreground">{new Date(departure).toLocaleDateString('id-ID', { weekday:'short', day:'numeric', month:'short' })}</span>
      </label>
      <label className="p-5 flex flex-col gap-1 cursor-pointer hover:bg-muted/30 transition-colors">
        <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">{t('reservation.guests')}</span>
        <select value={guests} onChange={e=> setGuests(Number(e.target.value))} className="bg-transparent text-sm font-medium outline-none">
          {[1,2,3,4,6,8].map(n=> <option key={n} value={n}>{n} {n===1?'Guest':'Guests'}</option>)}
        </select>
        <span className="text-xs text-muted-foreground">1 Room</span>
      </label>
      <label className="p-5 hidden md:flex flex-col gap-1 cursor-pointer hover:bg-muted/30 transition-colors">
        <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">{t('reservation.promo')}</span>
        <input value={promo} onChange={e=> setPromo(e.target.value)} placeholder="Optional" className="bg-transparent text-sm placeholder:text-muted-foreground/50 outline-none" />
        <span className="text-xs text-muted-foreground">&nbsp;</span>
      </label>
      <div className="col-span-2 md:col-span-1">
        <button type="submit" className="w-full h-full bg-brand-foreground text-brand-background hover:bg-brand-foreground/90 transition-colors flex items-center justify-center gap-2 text-xs tracking-[0.2em] font-medium p-5">
          {t('reservation.check')} <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </form>
  )
}
