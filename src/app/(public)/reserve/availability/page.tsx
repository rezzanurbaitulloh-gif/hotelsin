import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Price } from '@/components/price'
import { LocalizedText } from '@/components/localized'

export const dynamic = 'force-dynamic'

export default async function AvailabilityPage({ searchParams }: { searchParams: Promise<{ check_in?: string, check_out?: string, guests?: string, promo?: string }> }) {
  const sp = await searchParams
  const checkIn = sp.check_in || new Date(Date.now() + 7*86400000).toISOString().split('T')[0]
  const checkOut = sp.check_out || new Date(Date.now() + 10*86400000).toISOString().split('T')[0]
  const guests = Math.min(16, Math.max(1, Number(sp.guests || 2) || 2))

  // Validate dates (WITA)
  const todayWita = new Date(Date.now() + 8 * 3600 * 1000).toISOString().split('T')[0]
  const ci = new Date(checkIn).getTime()
  const co = new Date(checkOut).getTime()
  if (isNaN(ci) || isNaN(co) || checkOut <= checkIn) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <p className="text-muted-foreground">Tanggal tidak valid — tanggal check-out harus setelah check-in.</p>
        <Link href="/reserve" className="inline-block mt-4 h-9 px-6 bg-brand-foreground text-brand-background items-center text-xs tracking-widest">PILIH TANGGAL LAGI</Link>
      </div>
    )
  }
  if (checkIn < todayWita) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <p className="text-muted-foreground">Tanggal check-in sudah lewat. Silakan pilih tanggal mendatang.</p>
        <Link href="/reserve" className="inline-block mt-4 h-9 px-6 bg-brand-foreground text-brand-background items-center text-xs tracking-widest">PILIH TANGGAL LAGI</Link>
      </div>
    )
  }
  if ((co - ci) / 86400000 > 90) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <p className="text-muted-foreground">Maksimal 90 malam per reservasi. Hubungi kami untuk long stay.</p>
        <Link href="/reserve" className="inline-block mt-4 h-9 px-6 bg-brand-foreground text-brand-background items-center text-xs tracking-widest">PILIH TANGGAL LAGI</Link>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: roomTypes, error: rtError } = await supabase.from('room_types').select('id,name,base_price,max_occupancy,size_sqm,bed_type,images').eq('is_active', true).order('sort_order')
  const { data: rooms } = await supabase.from('rooms').select('id,room_type_id,status').neq('status', 'OUT_OF_SERVICE')
  const { data: reservations } = await supabase.from('reservations').select('id,room_type_id,check_in,check_out,status').not('status', 'in', '("CANCELLED","NO_SHOW")').lt('check_in', checkOut).gt('check_out', checkIn)

  if (rtError) {
    return <div className="container mx-auto px-6 py-12 text-center text-destructive">Error memuat kamar: {rtError.message}</div>
  }

  const availability = (roomTypes || []).map(rt => {
    const total = (rooms || []).filter(r => r.room_type_id === rt.id).length
    const reserved = (reservations || []).filter(r => r.room_type_id === rt.id).length
    const available = Math.max(0, total - reserved)
    const canAccommodate = rt.max_occupancy >= guests
    return { ...rt, total, reserved, available, canAccommodate, isAvailable: available > 0 && canAccommodate }
  })

  const nights = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-2">Availability</p>
        <h1 className="font-display text-3xl md:text-4xl font-light">Ketersediaan untuk {checkIn} → {checkOut}</h1>
        <p className="text-sm text-muted-foreground mt-2">{nights} malam • {guests} tamu • {availability.filter(a=>a.isAvailable).length} tipe tersedia dari {availability.length}</p>
        <div className="mt-4 flex gap-2">
          <Link href={`/reserve?check_in=${checkIn}&check_out=${checkOut}&guests=${guests}`} className="h-9 px-4 border border-border inline-flex items-center text-xs tracking-widest">UBAH TANGGAL</Link>
          <Link href="/stay" className="h-9 px-4 bg-muted inline-flex items-center text-xs tracking-widest">LIHAT SEMUA KAMAR</Link>
        </div>
      </div>

      {availability.length === 0 ? (
        <div className="py-12 text-center border border-dashed rounded-lg text-muted-foreground">Tidak ada tipe kamar aktif — hubungi admin.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availability.map(rt => (
            <div key={rt.id} className={`border rounded-lg overflow-hidden ${rt.isAvailable ? 'border-border hover:shadow-lg' : 'border-border/50 opacity-60'} transition-shadow`}>
              <div className="aspect-[4/3] bg-muted overflow-hidden">
                <img src={rt.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'} alt={(rt.name as any)?.en} className="h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-light"><LocalizedText value={rt.name as any} /></h3>
                  <Badge variant={rt.isAvailable ? 'secondary' : 'destructive'} className="text-[10px]">{rt.isAvailable ? `${rt.available} TERSEDIA` : 'PENUH'}</Badge>
                </div>
                <p className="text-xs tracking-widest text-muted-foreground uppercase mt-1">{rt.size_sqm} m² • <LocalizedText value={rt.bed_type as any} /> • max {rt.max_occupancy} tamu</p>
                <p className="text-sm font-medium mt-3"><Price amount={rt.base_price} showRate /> <span className="text-xs text-muted-foreground">• {nights} malam = <Price amount={rt.base_price * nights} /></span></p>
                {!rt.canAccommodate && <p className="text-xs text-destructive mt-2">Kapasitas tidak cukup untuk {guests} tamu</p>}
                {rt.available === 0 && rt.canAccommodate && <p className="text-xs text-destructive mt-2">Semua {rt.total} unit terpesan untuk tanggal ini ({rt.reserved} reservasi overlap)</p>}
                <div className="mt-4 flex gap-2">
                  {rt.isAvailable ? (
                    <Button asChild size="sm" className="flex-1 rounded-none bg-brand-foreground text-brand-background h-10 text-xs tracking-widest">
                      <Link href={`/reserve/guest?room_type=${rt.id}&check_in=${checkIn}&check_out=${checkOut}&guests=${guests}&nights=${nights}&rate=${rt.base_price}${sp.promo ? `&promo=${encodeURIComponent(sp.promo)}` : ''}`}>PILIH</Link>
                    </Button>
                  ) : (
                    <Button disabled size="sm" className="flex-1 rounded-none h-10 text-xs">TIDAK TERSEDIA</Button>
                  )}
                  <Button asChild variant="outline" size="sm" className="rounded-none h-10 px-4 text-xs">
                    <Link href={`/stay/${rt.id}`}>DETAIL</Link>
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-3">Total unit: {rt.total} • Terpesan: {rt.reserved}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 p-4 bg-muted/30 border border-border rounded-lg text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Ketersediaan Terkini:</p>
        <p>Availability is updated regularly to ensure accuracy.</p>
      </div>
    </div>
  )
}
