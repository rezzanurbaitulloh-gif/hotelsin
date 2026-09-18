import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LocalizedText, T } from '@/components/localized'
import { Price } from '@/components/price'
import { getI18nFromCookies, getTranslationServer } from '@/lib/i18n/server'
import { computeBookingPrice, parseAddons } from '@/lib/pricing'

export const dynamic = 'force-dynamic'

export default async function ReviewPage({ searchParams }: { searchParams: Promise<Record<string, string | string[]>> }) {
  const sp = await searchParams
  const supabase = await createClient()
  const { locale, currency } = await getI18nFromCookies()
  const tr = (k: string) => getTranslationServer(locale, k)

  const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v || '')
  const roomTypeId = str(sp.room_type)
  const checkIn = str(sp.check_in)
  const checkOut = str(sp.check_out)
  const guests = Number(str(sp.guests) || 2)
  const nights = Number(str(sp.nights) || 1)
  const firstName = str(sp.first_name)
  const lastName = str(sp.last_name)
  const email = str(sp.email)
  const promoCode = str(sp.promo)
  const ratePlanId = str(sp.rate_plan) || undefined
  const addons = parseAddons(sp as any)

  if (!roomTypeId || !checkIn || !checkOut) {
    return <div className="container mx-auto px-6 py-12 text-center"><p className="text-muted-foreground">Data tidak lengkap</p><Link href="/reserve" className="text-brand-accent underline">Kembali</Link></div>
  }

  const { data: roomType } = await supabase.from('room_types').select('id,name').eq('id', roomTypeId).single()
  const { data: { user } } = await supabase.auth.getUser()
  let guestId: string | null = null
  if (user?.email || email) {
    const { data: g } = await supabase.from('guests').select('id').eq('email', user?.email || email).maybeSingle()
    guestId = (g as any)?.id || null
  }

  // Server-side price computation (never trust browser)
  const price = await computeBookingPrice(supabase as any, {
    roomTypeId, nights, guests, currency,
    promoCode, checkIn, guestId, addons, ratePlanId,
  })

  const { data: addonLines } = await supabase.from('addons').select('id,name').in('id', addons.map(a => a.addonId)).eq('is_active', true)
  const addonName = new Map(((addonLines as any[]) || []).map(a => [a.id, (a.name as any)?.[locale] || (a.name as any)?.en]))

  const query = new URLSearchParams(sp as any).toString()

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-2"><T k="booking.review" /></p>
      <h1 className="font-display text-3xl font-light mb-2">{tr('booking.review')}</h1>
      <p className="text-sm text-muted-foreground mb-8">Pastikan detail benar sebelum pembayaran.</p>

      <div className="grid gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">Ringkasan Menginap</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span>Kamar</span><span className="font-medium"><LocalizedText value={(roomType as any)?.name as any} fallback="Kamar Pilihan" /></span></div>
            {price.ratePlanName && <div className="flex justify-between"><span>{tr('booking.rate_plan')}</span><span className="font-medium">{price.ratePlanName}</span></div>}
            <div className="flex justify-between"><span>Tanggal</span><span>{checkIn} → {checkOut} • {nights} {tr('booking.nights').toLowerCase()}</span></div>
            <div className="flex justify-between"><span>Tamu</span><span>{guests}</span></div>
            <div className="flex justify-between"><span>Tamu Nama</span><span>{firstName} {lastName} • {email}</span></div>
            {str(sp.special_requests) && <div className="flex justify-between"><span>Request</span><span className="max-w-[200px] text-right truncate">{str(sp.special_requests)}</span></div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Rincian Biaya</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span>{tr('booking.room_rate')} × {tr('booking.nights')}</span><span><Price amount={price.rate} originalCurrency={currency} /> × {nights} = <Price amount={price.subtotal} originalCurrency={currency} /></span></div>
            {addons.length > 0 && (
              <div className="border-t border-border pt-2 space-y-1">
                {addons.map((a, i) => (
                  <div key={i} className="flex justify-between text-muted-foreground">
                    <span>+ {addonName.get(a.addonId) || 'Add-on'} × {a.qty}</span>
                  </div>
                ))}
                <div className="flex justify-between"><span>Add-ons</span><span><Price amount={price.addonsTotal} originalCurrency={currency} /></span></div>
              </div>
            )}
            {price.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>{tr('booking.discount')}{price.appliedOfferName ? ` (${price.appliedOfferName})` : ''}{price.loyaltyDiscount > 0 ? ' + member' : ''}</span>
                <span>−<Price amount={price.discount} originalCurrency={currency} /></span>
              </div>
            )}
            {promoCode && price.discount === 0 && (
              <p className="text-xs text-destructive">{tr('booking.promo_invalid')}: {promoCode}</p>
            )}
            <div className="flex justify-between text-muted-foreground"><span>{tr('booking.taxes')} 11%</span><span><Price amount={price.tax} originalCurrency={currency} /></span></div>
            <div className="flex justify-between text-muted-foreground"><span>{tr('booking.fees')} 5%</span><span><Price amount={price.fee} originalCurrency={currency} /></span></div>
            <div className="flex justify-between font-medium border-t border-border pt-2"><span>{tr('booking.total')}</span><span className="font-display text-lg"><Price amount={price.total} originalCurrency={currency} /></span></div>
            <p className="text-xs text-muted-foreground mt-2">Mata uang mengikuti pilihan Anda ({currency}). Pembayaran diproses aman via Midtrans (QRIS, VA, e-wallet, kartu).</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">{tr('booking.cancellation_title')}</CardTitle></CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>• {locale === 'id' ? 'Pembatalan gratis hingga 3 hari sebelum check-in.' : 'Free cancellation until 3 days before check-in.'}</p>
            <p>• {locale === 'id' ? 'Dalam 3 hari: biaya 1 malam. No-show: 100%.' : 'Within 3 days: 1 night charge. No-show: 100%.'}</p>
            <p>• <Link href="/policies" className="text-brand-accent underline">{locale === 'id' ? 'Lihat kebijakan lengkap' : 'Full policy'}</Link></p>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Link href={`/reserve/guest?${query}`} className="h-11 px-6 border border-border inline-flex items-center text-xs tracking-widest">KEMBALI</Link>
          <Link href={`/reserve/payment?${query}`} className="flex-1 h-11 bg-brand-foreground text-brand-background inline-flex items-center justify-center text-xs tracking-widest hover:bg-brand-foreground/90">
            {tr('booking.continue_payment')}
          </Link>
        </div>
        <p className="text-[10px] text-muted-foreground text-center">Dengan lanjut, Anda setuju syarat & ketentuan.</p>
      </div>
    </div>
  )
}
