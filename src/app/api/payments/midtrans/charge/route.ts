import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { snapCharge } from '@/lib/midtrans'
import { convertCurrency } from '@/lib/utils'

// POST /api/payments/midtrans/charge { order_id }
// Creates (or refreshes) a Snap token for a PENDING_PAYMENT reservation.
export async function POST(req: Request) {
  try {
    const { order_id } = (await req.json().catch(() => ({}))) as { order_id?: string }
    if (!order_id) return NextResponse.json({ error: 'order_id wajib diisi' }, { status: 400 })

    const supabase = await createClient()
    const service = createServiceClient()

    const { data: reservation } = await service
      .from('reservations')
      .select('id,guest_id,total_amount,currency,status,confirmation_code')
      .eq('confirmation_code', order_id)
      .single()
    if (!reservation) return NextResponse.json({ error: 'Reservasi tidak ditemukan' }, { status: 404 })
    if (!['PENDING_PAYMENT', 'PENDING'].includes((reservation as any).status)) {
      return NextResponse.json({ error: 'Reservasi tidak dalam status menunggu pembayaran' }, { status: 400 })
    }

    // Ownership check when logged in (staff bypass)
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email) {
      const { data: staff } = await supabase.from('users').select('role').eq('email', user.email).single()
      if (!staff) {
        const { data: guest } = await service.from('guests').select('email').eq('id', (reservation as any).guest_id).single()
        if ((guest as any)?.email !== user.email) {
          return NextResponse.json({ error: 'Bukan reservasi Anda' }, { status: 403 })
        }
      }
    }

    const { data: guest } = await service
      .from('guests')
      .select('first_name,last_name,email,phone')
      .eq('id', (reservation as any).guest_id)
      .single()

    const currency = ((reservation as any).currency || 'USD') as 'USD' | 'IDR'
    const total = Number((reservation as any).total_amount)
    const grossAmount = currency === 'IDR' ? Math.round(total) : Math.round(convertCurrency(total, 'USD', 'IDR'))
    if (!Number.isInteger(grossAmount) || grossAmount <= 0) {
      return NextResponse.json({ error: 'Nominal tidak valid' }, { status: 400 })
    }

    const snap = await snapCharge({
      order_id,
      amount: grossAmount,
      customerName: `${(guest as any)?.first_name || ''} ${(guest as any)?.last_name || ''}`.trim() || 'Tamu HotelsIn',
      customerPhone: (guest as any)?.phone || undefined,
      customerEmail: (guest as any)?.email || undefined,
    })

    await service
      .from('transactions')
      .update({ snap_token: snap.token, snap_redirect_url: snap.redirect_url, amount: grossAmount, currency: 'IDR' })
      .eq('reference', order_id)
      .eq('status', 'PENDING')

    return NextResponse.json({ ok: true, token: snap.token, redirect_url: snap.redirect_url, order_id, gross_amount: grossAmount, currency: 'IDR' })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Gagal membuat pembayaran' }, { status: 500 })
  }
}
