import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LocalizedText, T } from '@/components/localized'
import { Price } from '@/components/price'
import { getI18nFromCookies, getTranslationServer } from '@/lib/i18n/server'

export const dynamic = 'force-dynamic'

export default async function ReviewPage({ searchParams }: { searchParams: Promise<Record<string,string>> }) {
  const sp = await searchParams
  const supabase = await createClient()
  const { locale } = await getI18nFromCookies()
  const tr = (k: string) => getTranslationServer(locale, k)
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
      <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-2"><T k="booking.review" /></p>
      <h1 className="font-display text-3xl font-light mb-2">{tr('booking.review')}</h1>
      <p className="text-sm text-muted-foreground mb-8">Pastikan detail benar sebelum konfirmasi.</p>

      <div className="grid gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">Ringkasan Menginap</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span>Kamar</span><span className="font-medium"><LocalizedText value={roomType?.name as any} fallback="Kamar Pilihan" /></span></div>
            <div className="flex justify-between"><span>Tanggal</span><span>{checkIn} → {checkOut} • {nights} malam</span></div>
            <div className="flex justify-between"><span>Tamu</span><span>{guests}</span></div>
            <div className="flex justify-between"><span>Tamu Nama</span><span>{firstName} {lastName} • {email}</span></div>
            {sp.special_requests && <div className="flex justify-between"><span>Request</span><span className="max-w-[200px] text-right truncate">{sp.special_requests}</span></div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Rincian Biaya — Dinamis</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span>{tr('booking.room_rate')} × {tr('booking.nights')}</span><span><Price amount={actualRate} /> × {nights} = <Price amount={subtotal} /></span></div>
            <div className="flex justify-between text-muted-foreground"><span>{tr('booking.taxes')} 11%</span><span><Price amount={tax} /></span></div>
            <div className="flex justify-between text-muted-foreground"><span>{tr('booking.fees')} 5%</span><span><Price amount={fee} /></span></div>
            <div className="flex justify-between font-medium border-t border-border pt-2"><span>{tr('booking.total')}</span><span className="font-display text-lg"><Price amount={total} /></span></div>
            <p className="text-xs text-muted-foreground mt-2">Rincian biaya transparan, termasuk pajak dan biaya layanan. Mata uang mengikuti pilihan Anda di header (USD/IDR).</p>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6 text-sm">
            <p className="font-medium">Setelah konfirmasi:</p>
            <ol className="list-decimal ml-5 mt-2 space-y-1 text-xs text-muted-foreground">
              <li>Reservasi Anda akan dikonfirmasi</li>
              <li>Anda akan menerima kode konfirmasi</li>
              <li>Reservasi dapat dilihat di akun Anda dan dikelola kapan saja</li>
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
