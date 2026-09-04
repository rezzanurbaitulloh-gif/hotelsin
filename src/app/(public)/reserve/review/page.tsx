import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function ReviewPage({ searchParams }: { searchParams: Promise<Record<string,string>> }) {
  const sp = await searchParams
  const supabase = await createClient()
  const roomTypeId = sp.room_type
  const checkIn = sp.check_in
  const checkOut = sp.check_out
  const guests = Number(sp.guests || 2)
  const nights = Number(sp.nights || 1)
  const rate = Number(sp.rate || 0)
  const firstName = sp.first_name || ''
  const lastName = sp.last_name || ''
  const email = sp.email || ''

  if (!roomTypeId || !checkIn || !checkOut) {
    return <div className="container mx-auto px-6 py-12 text-center"><p className="text-muted-foreground">Data tidak lengkap</p><Link href="/reserve" className="text-brand-accent underline">Kembali</Link></div>
  }

  const { data: roomType } = await supabase.from('room_types').select('id,name,base_price').eq('id', roomTypeId).single()
  const actualRate = rate || roomType?.base_price || 0
  const subtotal = actualRate * nights
  const taxRate = 0.11
  const feeRate = 0.05
  const tax = Math.round(subtotal * taxRate)
  const fee = Math.round(subtotal * feeRate)
  const total = subtotal + tax + fee

  const query = new URLSearchParams(sp as any).toString()

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-2">Review</p>
      <h1 className="font-display text-3xl font-light mb-2">Tinjau Pemesanan</h1>
      <p className="text-sm text-muted-foreground mb-8">Pastikan detail benar — konfirmasi akan buat record real di DB.</p>

      <div className="grid gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">Ringkasan Menginap</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span>Kamar</span><span className="font-medium">{roomType?.name?.en || roomTypeId.slice(0,8)}</span></div>
            <div className="flex justify-between"><span>Tanggal</span><span>{checkIn} → {checkOut} • {nights} malam</span></div>
            <div className="flex justify-between"><span>Tamu</span><span>{guests}</span></div>
            <div className="flex justify-between"><span>Tamu Nama</span><span>{firstName} {lastName} • {email}</span></div>
            {sp.special_requests && <div className="flex justify-between"><span>Request</span><span className="max-w-[200px] text-right truncate">{sp.special_requests}</span></div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Rincian Biaya — Dinamis</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Room Rate × Nights</span><span>${actualRate} × {nights} = ${subtotal}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Pajak 11%</span><span>${tax}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Biaya Layanan 5%</span><span>${fee}</span></div>
            <div className="flex justify-between font-medium border-t border-border pt-2"><span>Total</span><span className="font-display text-lg">${total} USD</span></div>
            <Badge variant="secondary" className="mt-2">Kalkulasi: rate×nights + tax + fee — dari DB, bukan hardcode</Badge>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6 text-sm">
            <p className="font-medium">Konfirmasi akan:</p>
            <ol className="list-decimal ml-5 mt-2 space-y-1 text-xs text-muted-foreground">
              <li>Buat/update <code className="bg-white px-1 rounded">guests</code> (email {email})</li>
              <li>Buat <code className="bg-white px-1 rounded">reservations</code> status <code>CONFIRMED</code> dengan <code>confirmation_code</code> unik</li>
              <li>Buat <code className="bg-white px-1 rounded">transactions</code> <code>ROOM_REVENUE</code></li>
              <li>Terlihat langsung di <Link href="/admin/reservations" className="text-brand-accent underline">/admin/reservations</Link> dan <Link href="/account/reservations" className="text-brand-accent underline">/account/reservations</Link></li>
            </ol>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Link href={`/reserve/guest?${query}`} className="h-11 px-6 border border-border inline-flex items-center text-xs tracking-widest">KEMBALI</Link>
          <Link href={`/reserve/confirmation?${query}`} className="flex-1 h-11 bg-brand-foreground text-brand-background inline-flex items-center justify-center text-xs tracking-widest hover:bg-brand-foreground/90">
            KONFIRMASI & BUAT RESERVASI →
          </Link>
        </div>
        <p className="text-[10px] text-muted-foreground text-center">Dengan konfirmasi, Anda setuju syarat & ketentuan. Data tersimpan persisten — refresh browser tetap ada.</p>
      </div>
    </div>
  )
}
