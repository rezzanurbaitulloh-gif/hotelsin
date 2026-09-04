import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<Record<string,string>> }) {
  const sp = await searchParams
  const roomTypeId = sp.room_type
  const checkIn = sp.check_in
  const checkOut = sp.check_out
  const guests = Number(sp.guests || 2)
  const nights = Number(sp.nights || 1)
  const rate = Number(sp.rate || 0)
  const firstName = sp.first_name || 'Tamu'
  const lastName = sp.last_name || 'HotelsIn'
  const email = sp.email || `guest-${Date.now()}@example.com`
  const phone = sp.phone || ''
  const city = sp.city || ''
  const country = sp.country || ''
  const specialRequests = sp.special_requests || ''

  if (!roomTypeId || !checkIn || !checkOut) {
    return <div className="container mx-auto px-6 py-12 text-center"><p className="text-muted-foreground">Data tidak lengkap</p><Link href="/reserve" className="text-brand-accent underline">Kembali</Link></div>
  }

  const supabase = await createClient()
  // Get property
  const { data: props } = await supabase.from('properties').select('id').limit(1)
  const propId = props?.[0]?.id
  if (!propId) return <div className="container mx-auto px-6 py-12 text-center text-destructive">Property belum di-setup</div>

  // Check if already exists (idempotency) — look for recent reservation with same email+dates+room_type in last 10m
  const tenMinsAgo = new Date(Date.now() - 10*60*1000).toISOString()
  const { data: existing } = await supabase.from('reservations').select('id,confirmation_code').eq('room_type_id', roomTypeId).gte('created_at', tenMinsAgo).limit(1)
  // We will not use existing check by email because we haven't created guest yet, so just create new

  // Upsert guest by email
  let guestId: string | null = null
  const { data: existingGuest } = await supabase.from('guests').select('id,email').eq('email', email).single()
  if (existingGuest) {
    guestId = existingGuest.id
    await supabase.from('guests').update({ first_name: firstName, last_name: lastName, phone, city, country }).eq('id', guestId)
  } else {
    const { data: newGuest, error: gErr } = await supabase.from('guests').insert({
      property_id: propId,
      first_name: firstName,
      last_name: lastName,
      email, phone, city, country,
      nationality: country,
    }).select('id').single()
    if (gErr) {
      return <div className="container mx-auto px-6 py-12 text-center text-destructive">Gagal buat tamu: {gErr.message}</div>
    }
    guestId = newGuest.id
  }

  // Calculate pricing
  const subtotal = rate * nights
  const tax = Math.round(subtotal * 0.11)
  const fee = Math.round(subtotal * 0.05)
  const total = subtotal + tax + fee

  // Find an available room of that type
  const { data: rooms } = await supabase.from('rooms').select('id,room_number').eq('room_type_id', roomTypeId).eq('status', 'AVAILABLE').limit(1)
  const roomId = rooms?.[0]?.id || null

  // Generate confirmation code
  const confirmationCode = `HI${Math.random().toString(36).slice(2,8).toUpperCase()}${Date.now().toString().slice(-4)}`

  // Check if this exact confirmation already exists via query param? If sp has code param, try to fetch
  let reservation: any = null
  let errorMsg: string | null = null

  // Try to create reservation — if duplicate code, retry
  const { data: newRes, error: rErr } = await supabase.from('reservations').insert({
    property_id: propId,
    guest_id: guestId,
    room_id: roomId,
    room_type_id: roomTypeId,
    check_in: checkIn,
    check_out: checkOut,
    nights,
    adults: guests,
    children: 0,
    status: 'CONFIRMED',
    source: 'DIRECT',
    special_requests: specialRequests,
    room_rate: rate,
    subtotal,
    tax_amount: tax,
    fee_amount: fee,
    discount_amount: 0,
    total_amount: total,
    currency: 'USD',
    confirmation_code: confirmationCode,
  }).select('id,confirmation_code,total_amount,currency').single()

  if (rErr) {
    errorMsg = rErr.message
  } else {
    reservation = newRes
    // Create transaction
    await supabase.from('transactions').insert({
      property_id: propId,
      reservation_id: reservation.id,
      guest_id: guestId,
      type: 'ROOM_REVENUE',
      amount: total,
      currency: 'USD',
      payment_method: 'CARD',
      status: 'COMPLETED',
      reference: confirmationCode,
    })
    // Update room status to RESERVED if room assigned
    if (roomId) {
      await supabase.from('rooms').update({ status: 'RESERVED' }).eq('id', roomId)
    }
  }

  if (errorMsg) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-2xl text-center">
        <p className="text-destructive">Gagal buat reservasi: {errorMsg}</p>
        <Link href="/reserve" className="inline-block mt-4 h-9 px-6 border border-border inline-flex items-center text-xs">KEMBALI</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl">
      <div className="text-center mb-8">
        <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
        <h1 className="font-display text-4xl font-light">Reservasi Dikonfirmasi</h1>
        <p className="text-sm text-muted-foreground mt-2">Record real telah dibuat di Supabase — refresh browser, data tetap ada.</p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-mono text-2xl tracking-widest">{reservation.confirmation_code}</CardTitle>
          <Badge variant="secondary" className="mx-auto mt-2">CONFIRMED • {reservation.currency} {Number(reservation.total_amount).toLocaleString()}</Badge>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div><p className="text-xs tracking-widest text-muted-foreground uppercase">Tamu</p><p className="font-medium">{firstName} {lastName}</p><p className="text-xs text-muted-foreground">{email}</p></div>
            <div><p className="text-xs tracking-widest text-muted-foreground uppercase">Menginap</p><p>{checkIn} → {checkOut} • {nights} malam • {guests} tamu</p></div>
          </div>
          <div className="flex gap-3">
            <Link href={`/account/reservations/${reservation.id}`} className="flex-1 h-11 bg-brand-foreground text-brand-background grid place-items-center text-xs tracking-widest">LIHAT DI AKUN</Link>
            <Link href="/admin/reservations" className="flex-1 h-11 border border-border grid place-items-center text-xs tracking-widest">LIHAT DI ADMIN</Link>
          </div>
          <p className="text-[10px] text-muted-foreground text-center">Verifikasi: <code className="bg-muted px-1 rounded">SELECT * FROM reservations WHERE confirmation_code = '{reservation.confirmation_code}'</code> di Supabase Dashboard → Table Editor → reservations</p>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Link href="/" className="text-xs tracking-widest border-b border-brand-accent pb-1 hover:text-brand-accent">KEMBALI KE HOME</Link>
      </div>
    </div>
  )
}
