import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Price } from '@/components/price'
import { LocalizedText, T } from '@/components/localized'
import { getI18nFromCookies, getTranslationServer } from '@/lib/i18n/server'
import { computeBookingPrice, parseAddons } from '@/lib/pricing'
import { convertCurrency } from '@/lib/utils'
import { snapCharge, midtransClientKey, snapJsUrl } from '@/lib/midtrans'
import { PayOnlineButton } from '@/components/pay-online'

export const dynamic = 'force-dynamic'

function genCode(): string {
  return `HI${Math.random().toString(36).slice(2, 8).toUpperCase()}${Date.now().toString().slice(-4)}`
}

export default async function PaymentPage({ searchParams }: { searchParams: Promise<Record<string, string | string[]>> }) {
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
  const firstName = str(sp.first_name) || 'Tamu'
  const lastName = str(sp.last_name) || ''
  const email = str(sp.email)
  const phone = str(sp.phone)
  const city = str(sp.city)
  const country = str(sp.country)
  const specialRequests = str(sp.special_requests)
  const promoCode = str(sp.promo)
  const ratePlanId = str(sp.rate_plan) || undefined
  const addons = parseAddons(sp as any)

  if (!roomTypeId || !checkIn || !checkOut || !email) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <p className="text-muted-foreground">Data tidak lengkap — lengkapi data tamu dulu.</p>
        <Link href="/reserve" className="text-brand-accent underline">Kembali</Link>
      </div>
    )
  }

  const { data: props } = await supabase.from('properties').select('id').limit(1)
  const propId = (props as any)?.[0]?.id
  if (!propId) return <div className="container mx-auto px-6 py-12 text-center text-destructive">Property belum di-setup</div>

  // Guest upsert
  let guestId: string | null = null
  const { data: existingGuest } = await supabase.from('guests').select('id').eq('email', email).maybeSingle()
  if ((existingGuest as any)?.id) {
    guestId = (existingGuest as any).id
    await supabase.from('guests').update({ first_name: firstName, last_name: lastName, phone, city, country }).eq('id', guestId)
  } else {
    const { data: ng, error: gErr } = await supabase.from('guests').insert({
      property_id: propId, first_name: firstName, last_name: lastName,
      email, phone, city, country, nationality: country,
    }).select('id').single()
    if (gErr || !(ng as any)?.id) {
      return <div className="container mx-auto px-6 py-12 text-center text-destructive">Gagal menyimpan data tamu: {gErr?.message}</div>
    }
    guestId = (ng as any).id
  }

  // Server-side price (never trust browser)
  const price = await computeBookingPrice(supabase as any, {
    roomTypeId, nights, guests, currency, promoCode, checkIn, guestId, addons, ratePlanId,
  })

  // Idempotency: reuse recent PENDING_PAYMENT for same guest+room+dates
  const thirtyAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()
  const { data: existingRes } = await supabase
    .from('reservations')
    .select('id,confirmation_code,total_amount')
    .eq('guest_id', guestId)
    .eq('room_type_id', roomTypeId)
    .eq('check_in', checkIn)
    .eq('check_out', checkOut)
    .eq('status', 'PENDING_PAYMENT')
    .gte('created_at', thirtyAgo)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  let reservationId: string
  let confirmationCode: string
  if ((existingRes as any)?.id) {
    reservationId = (existingRes as any).id
    confirmationCode = (existingRes as any).confirmation_code
    await supabase.from('reservations').update({
      nights, adults: guests, room_rate: price.rate, subtotal: price.subtotal,
      tax_amount: price.tax, fee_amount: price.fee, discount_amount: price.discount,
      addons_total: price.addonsTotal, total_amount: price.total, currency,
      rate_plan_id: price.ratePlanId, rate_plan_name: price.ratePlanName,
      special_requests: specialRequests, updated_at: new Date().toISOString(),
    }).eq('id', reservationId)
    // sync addon lines
    await supabase.from('reservation_addons').delete().eq('reservation_id', reservationId)
  } else {
    // Assign an available room (held; freed on cancel/expire)
    const { data: rooms } = await supabase.from('rooms').select('id').eq('room_type_id', roomTypeId).eq('status', 'AVAILABLE').limit(1)
    const roomId = (rooms as any)?.[0]?.id || null
    confirmationCode = genCode()
    const { data: nr, error: rErr } = await supabase.from('reservations').insert({
      property_id: propId, guest_id: guestId, room_id: roomId, room_type_id: roomTypeId,
      check_in: checkIn, check_out: checkOut, nights, adults: guests, children: 0,
      status: 'PENDING_PAYMENT', source: 'DIRECT', special_requests: specialRequests,
      rate_plan_id: price.ratePlanId, rate_plan_name: price.ratePlanName,
      room_rate: price.rate, subtotal: price.subtotal, tax_amount: price.tax,
      fee_amount: price.fee, discount_amount: price.discount, addons_total: price.addonsTotal,
      total_amount: price.total, currency, confirmation_code: confirmationCode,
      payment_order_id: confirmationCode,
    }).select('id').single()
    if (rErr || !(nr as any)?.id) {
      return <div className="container mx-auto px-6 py-12 text-center text-destructive">Gagal membuat reservasi: {rErr?.message}</div>
    }
    reservationId = (nr as any).id
  }

  // Persist addon lines
  if (addons.length) {
    const { data: addonRows } = await supabase.from('addons').select('id,price,price_unit').in('id', addons.map(a => a.addonId))
    const map = new Map(((addonRows as any[]) || []).map(a => [a.id, a]))
    const lines = addons.map(sel => {
      const a = map.get(sel.addonId) as any
      if (!a) return null
      let unit = Number(a.price)
      if (currency === 'IDR') unit = Math.round(convertCurrency(unit, 'USD', 'IDR'))
      let total = unit * Math.max(1, sel.qty || 1)
      if (a.price_unit === 'per_night') total = unit * Math.max(1, sel.qty || 1) * nights
      else if (a.price_unit === 'per_person') total = unit * guests
      else if (a.price_unit === 'per_person_night') total = unit * guests * nights
      return { reservation_id: reservationId, addon_id: sel.addonId, qty: Math.max(1, sel.qty || 1), unit_price: unit, total: Math.round(total) }
    }).filter(Boolean)
    if (lines.length) await supabase.from('reservation_addons').insert(lines as any)
  }

  // Snap amount must be IDR integer
  const grossIdr = currency === 'IDR' ? Math.round(price.total) : Math.round(convertCurrency(price.total, 'USD', 'IDR'))

  // Ensure PENDING transaction row
  const { data: existingTx } = await supabase.from('transactions').select('id').eq('reference', confirmationCode).eq('status', 'PENDING').maybeSingle()
  let snapToken = ''
  let snapRedirect = ''
  try {
    const snap = await snapCharge({
      order_id: confirmationCode,
      amount: grossIdr,
      customerName: `${firstName} ${lastName}`.trim(),
      customerPhone: phone || undefined,
      customerEmail: email || undefined,
    })
    snapToken = snap.token
    snapRedirect = snap.redirect_url
    if ((existingTx as any)?.id) {
      await supabase.from('transactions').update({ snap_token: snapToken, snap_redirect_url: snapRedirect, amount: grossIdr, currency: 'IDR' }).eq('id', (existingTx as any).id)
    } else {
      await supabase.from('transactions').insert({
        property_id: propId, reservation_id: reservationId, guest_id: guestId,
        type: 'ROOM_REVENUE', amount: grossIdr, currency: 'IDR',
        payment_method: 'MIDTRANS', status: 'PENDING', reference: confirmationCode,
        snap_token: snapToken, snap_redirect_url: snapRedirect,
        notes: `Display total ${currency} ${price.total}`,
      })
    }
  } catch (e: any) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-2xl text-center">
        <h1 className="font-display text-3xl font-light mb-4">Pembayaran belum bisa dibuat</h1>
        <p className="text-sm text-muted-foreground mb-2">Reservasi Anda tersimpan sebagai <strong>{confirmationCode}</strong> (menunggu pembayaran).</p>
        <p className="text-sm text-destructive mb-8">{e?.message || 'Midtrans error'}</p>
        <div className="flex gap-3 justify-center">
          <Link href="/reserve" className="h-11 px-6 border border-border inline-flex items-center text-xs tracking-widest">KEMBALI</Link>
          <Link href={`/reserve/payment?${new URLSearchParams(sp as any).toString()}`} className="h-11 px-6 bg-brand-foreground text-brand-background inline-flex items-center text-xs tracking-widest">COBA LAGI</Link>
        </div>
      </div>
    )
  }

  const { data: roomType } = await supabase.from('room_types').select('name').eq('id', roomTypeId).single()

  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl">
      <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-2 text-center"><T k="booking.payment_title" /></p>
      <h1 className="font-display text-3xl font-light mb-2 text-center">{tr('booking.payment_title')}</h1>
      <p className="text-sm text-muted-foreground mb-8 text-center">{tr('booking.payment_subtitle')}</p>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-mono text-xl tracking-widest">{confirmationCode}</CardTitle>
          <p className="text-xs text-muted-foreground mt-1"><LocalizedText value={(roomType as any)?.name as any} /> • {checkIn} → {checkOut} • {nights} malam</p>
          <p className="font-display text-3xl mt-3"><Price amount={price.total} /></p>
          <p className="text-[10px] text-muted-foreground">Ditagih via Midtrans: Rp{grossIdr.toLocaleString('id-ID')} • {tr('booking.expiry_note')}</p>
        </CardHeader>
        <CardContent>
          <PayOnlineButton
            snapToken={snapToken}
            clientKey={midtransClientKey()}
            snapJsUrl={snapJsUrl()}
            orderId={confirmationCode}
          />
          <div className="mt-6 text-xs text-muted-foreground space-y-1">
            <p>• QRIS • Virtual Account (BCA, BRI, Mandiri, BNI) • E-wallet (GoPay, OVO, DANA, ShopeePay) • Kartu kredit/debit • Gerai retail</p>
            <p>• {locale === 'id' ? 'Pembayaran aman terenkripsi standar PCI-DSS.' : 'Secure PCI-DSS encrypted payment.'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
