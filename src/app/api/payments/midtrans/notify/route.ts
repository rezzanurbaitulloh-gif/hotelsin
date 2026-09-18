import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { verifySignature, mapMidtransStatus } from '@/lib/midtrans'
import { sendEmail, bookingConfirmationEmail } from '@/lib/email'
import { formatCurrency } from '@/lib/utils'

interface Notify {
  order_id?: string
  status_code?: string
  gross_amount?: string
  signature_key?: string
  transaction_status?: string
  fraud_status?: string
  payment_type?: string
}

// POST /api/payments/midtrans/notify — webhook Midtrans (tanpa auth,
// diverifikasi via signature_key). Pasang URL ini di dashboard Midtrans:
// https://hotelsin.vercel.app/api/payments/midtrans/notify
export async function POST(req: Request) {
  const n = (await req.json().catch(() => ({}))) as Notify
  if (!n.order_id || !n.status_code || !n.gross_amount || !n.signature_key) {
    return NextResponse.json({ error: 'Payload tidak lengkap.' }, { status: 400 })
  }
  if (!verifySignature({ order_id: n.order_id, status_code: n.status_code, gross_amount: n.gross_amount, signature_key: n.signature_key })) {
    return NextResponse.json({ error: 'Signature tidak valid.' }, { status: 403 })
  }

  const service = createServiceClient()
  const mapped = mapMidtransStatus(n.transaction_status, n.fraud_status)

  const { data: tx } = await service
    .from('transactions')
    .select('id,reservation_id,guest_id,status,amount')
    .eq('reference', n.order_id)
    .maybeSingle()
  if (!tx) return NextResponse.json({ ok: true, note: 'order tidak dikenal' })

  const paymentMethod = `MIDTRANS-${(n.payment_type ?? 'OTHER').toUpperCase()}`
  // Idempotent: skip if already in final state matching this notification
  const { data: current } = await service.from('transactions').select('status').eq('id', (tx as any).id).single()
  if ((current as any)?.status === 'COMPLETED' && mapped === 'COMPLETED') {
    return NextResponse.json({ ok: true, note: 'sudah diproses' })
  }

  await service
    .from('transactions')
    .update({ status: mapped, payment_method: paymentMethod })
    .eq('id', (tx as any).id)

  const reservationId = (tx as any).reservation_id as string | null
  if (reservationId) {
    if (mapped === 'COMPLETED') {
      // Confirm reservation (idempotent: only from PENDING_PAYMENT/PENDING)
      const { data: res } = await service.from('reservations').select('id,status,guest_id,room_id,property_id,confirmation_code').eq('id', reservationId).single()
      const prevStatus = (res as any)?.status
      if (prevStatus === 'PENDING_PAYMENT' || prevStatus === 'PENDING') {
        await service.from('reservations').update({ status: 'CONFIRMED', paid_at: new Date().toISOString() }).eq('id', reservationId)
        await service.from('reservation_status_history').insert({ reservation_id: reservationId, status: 'CONFIRMED', notes: `Midtrans ${n.payment_type} ${n.order_id}` })
        // Send confirmation email (best effort)
        try {
          const { data: full } = await service
            .from('reservations')
            .select('confirmation_code,check_in,check_out,nights,total_amount,currency,room_type_id,guest_id')
            .eq('id', reservationId)
            .single()
          const { data: guest } = await service.from('guests').select('first_name,last_name,email').eq('id', (res as any).guest_id).single()
          const { data: rt } = await service.from('room_types').select('name').eq('id', (full as any).room_type_id).single()
          const site = (process.env.NEXT_PUBLIC_SITE_URL || 'https://hotelsin.vercel.app').replace(/\/$/, '')
          const to = (guest as any)?.email
          if (to && to.includes('@') && !to.includes('@example.com')) {
            const mail = bookingConfirmationEmail({
              guestName: `${(guest as any)?.first_name || ''} ${(guest as any)?.last_name || ''}`.trim() || 'Tamu',
              confirmationCode: (full as any).confirmation_code,
              roomName: ((rt as any)?.name?.en || (rt as any)?.name?.id || 'Villa'),
              checkIn: (full as any).check_in,
              checkOut: (full as any).check_out,
              nights: (full as any).nights,
              total: formatCurrency(Number((full as any).total_amount), ((full as any).currency || 'IDR') as any, 'id'),
              siteUrl: site,
              manageUrl: `${site}/account/reservations/${reservationId}`,
            })
            await sendEmail({ to, subject: mail.subject, html: mail.html, text: mail.text })
          }
        } catch {
          // email best-effort only
        }
      }
    } else if (mapped === 'FAILED') {
      // Payment failed/expired -> cancel unpaid reservation, free the room
      const { data: res } = await service.from('reservations').select('id,status,room_id').eq('id', reservationId).single()
      if ((res as any)?.status === 'PENDING_PAYMENT') {
        await service.from('reservations').update({ status: 'CANCELLED', cancelled_at: new Date().toISOString(), cancellation_reason: `Pembayaran ${n.transaction_status} (${n.payment_type})` }).eq('id', reservationId)
        await service.from('reservation_status_history').insert({ reservation_id: reservationId, status: 'CANCELLED', notes: `Midtrans ${n.transaction_status}` })
        if ((res as any)?.room_id) {
          await service.from('rooms').update({ status: 'AVAILABLE' }).eq('id', (res as any).room_id)
        }
      }
    }
  }

  return NextResponse.json({ ok: true, payment: mapped })
}
