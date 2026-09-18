import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getTransactionStatus } from '@/lib/midtrans'

// GET /api/payments/midtrans/status?order_id=HI-XXXX
// Returns local DB status + live Midtrans status (for polling on finish page).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get('order_id')
  if (!orderId) return NextResponse.json({ error: 'order_id wajib diisi' }, { status: 400 })

  const service = createServiceClient()
  const { data: tx } = await service
    .from('transactions')
    .select('status,payment_method,amount,currency')
    .eq('reference', orderId)
    .maybeSingle()
  const { data: res } = await service
    .from('reservations')
    .select('id,status,confirmation_code')
    .eq('confirmation_code', orderId)
    .maybeSingle()

  let gateway: Record<string, any> | null = null
  try {
    gateway = await getTransactionStatus(orderId)
  } catch {
    gateway = null
  }

  return NextResponse.json({
    ok: true,
    order_id: orderId,
    local_transaction_status: (tx as any)?.status || null,
    local_payment_method: (tx as any)?.payment_method || null,
    reservation_status: (res as any)?.status || null,
    reservation_id: (res as any)?.id || null,
    gateway_status: gateway?.transaction_status || null,
    gateway_payment_type: gateway?.payment_type || null,
  })
}
