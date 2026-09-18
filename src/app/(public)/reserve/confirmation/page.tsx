import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock } from 'lucide-react'
import { getI18nFromCookies } from '@/lib/i18n/server'
import { formatCurrency } from '@/lib/utils'
import { LocalizedText } from '@/components/localized'

export const dynamic = 'force-dynamic'

// Display-only confirmation. Reservations are created in /reserve/payment
// (server-side, PENDING_PAYMENT -> CONFIRMED via Midtrans webhook).
// ?code=HI-XXXX shows an existing reservation. No auto-creation here
// (prevents duplicates on refresh).
export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams
  const code = sp.code || ''
  const { locale: selectedLocale } = await getI18nFromCookies()

  if (!code) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-2xl text-center">
        <h1 className="font-display text-3xl font-light mb-4">Kode tidak ditemukan</h1>
        <p className="text-sm text-muted-foreground mb-8">Buka halaman ini lewat link konfirmasi atau mulai reservasi baru.</p>
        <Link href="/reserve" className="inline-block h-11 px-6 bg-brand-foreground text-brand-background items-center text-xs tracking-widest">MULAI RESERVASI</Link>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: r } = await supabase
    .from('reservations')
    .select('id,confirmation_code,check_in,check_out,nights,adults,status,total_amount,currency,guest_id,room_type_id')
    .eq('confirmation_code', code)
    .maybeSingle()

  if (!r) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-2xl text-center">
        <p className="text-muted-foreground">Reservasi <span className="font-mono">{code}</span> tidak ditemukan.</p>
        <Link href="/reserve" className="text-brand-accent underline">Kembali</Link>
      </div>
    )
  }

  const reservation = r as any
  const { data: guest } = await supabase.from('guests').select('first_name,last_name,email').eq('id', reservation.guest_id).single()
  const { data: rt } = await supabase.from('room_types').select('name').eq('id', reservation.room_type_id).single()
  const isPending = reservation.status === 'PENDING_PAYMENT' || reservation.status === 'PENDING'

  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl">
      <div className="text-center mb-8">
        {isPending ? (
          <Clock className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        ) : (
          <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
        )}
        <h1 className="font-display text-4xl font-light">
          {isPending ? 'Menunggu Pembayaran' : 'Reservasi Dikonfirmasi'}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          {isPending
            ? 'Selesaikan pembayaran untuk mengkonfirmasi reservasi Anda.'
            : 'Reservasi Anda telah dikonfirmasi — simpan kode untuk check-in.'}
        </p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-mono text-2xl tracking-widest">{reservation.confirmation_code}</CardTitle>
          <Badge variant={isPending ? 'outline' : 'secondary'} className="mx-auto mt-2">
            {reservation.status} • {formatCurrency(Number(reservation.total_amount), reservation.currency as any, selectedLocale as any)}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-xs tracking-widest text-muted-foreground uppercase">Tamu</p>
              <p className="font-medium">{(guest as any)?.first_name} {(guest as any)?.last_name}</p>
              <p className="text-xs text-muted-foreground">{(guest as any)?.email}</p>
            </div>
            <div>
              <p className="text-xs tracking-widest text-muted-foreground uppercase">Menginap</p>
              <p><LocalizedText value={(rt as any)?.name} fallback="Villa" /></p>
              <p>{reservation.check_in} → {reservation.check_out} • {reservation.nights} malam • {reservation.adults} tamu</p>
            </div>
          </div>
          <div className="flex gap-3">
            {isPending ? (
              <Link href={`/reserve/payment/finish?order_id=${encodeURIComponent(reservation.confirmation_code)}`} className="flex-1 h-11 bg-brand-foreground text-brand-background grid place-items-center text-xs tracking-widest">LANJUTKAN PEMBAYARAN</Link>
            ) : (
              <Link href={`/account/reservations/${reservation.id}`} className="flex-1 h-11 bg-brand-foreground text-brand-background grid place-items-center text-xs tracking-widest">LIHAT DI AKUN</Link>
            )}
            <Link href="/" className="flex-1 h-11 border border-border grid place-items-center text-xs tracking-widest">KEMBALI KE BERANDA</Link>
          </div>
          <a
            href={`https://wa.me/62361975888?text=${encodeURIComponent(`Halo HotelsIn, saya ${(guest as any)?.first_name || ''} ${(guest as any)?.last_name || ''} — konfirmasi reservasi ${reservation.confirmation_code} (${reservation.check_in} → ${reservation.check_out}). Terima kasih!`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-11 border border-emerald-600 text-emerald-700 grid place-items-center text-xs tracking-widest hover:bg-emerald-50"
          >
            KONFIRMASI VIA WHATSAPP
          </a>
          <p className="text-[10px] text-muted-foreground text-center">Simpan kode konfirmasi Anda untuk referensi check-in.</p>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Link href="/" className="text-xs tracking-widest border-b border-brand-accent pb-1 hover:text-brand-accent">KEMBALI KE HOME</Link>
      </div>
    </div>
  )
}
