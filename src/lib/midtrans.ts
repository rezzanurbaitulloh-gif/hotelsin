import { createHash } from 'crypto'

// Helper SERVER-ONLY Midtrans (jangan import di client component).
// Key produksi dari projek catering (proven working vs app.midtrans.com).

function isProduction(): boolean {
  return (process.env.MIDTRANS_IS_PRODUCTION ?? 'true') !== 'false'
}

function snapBase(): string {
  return isProduction()
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions'
}

export function snapJsUrl(): string {
  return isProduction()
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js'
}

export function midtransClientKey(): string {
  return process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? ''
}

function serverKey(): string | null {
  const k = process.env.MIDTRANS_SERVER_KEY
  if (!k) return null
  return k
}

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hotelsin.vercel.app').replace(/\/$/, '')
}

export interface SnapResult {
  token: string
  redirect_url: string
}

/** Buat transaksi Snap. amount = rupiah integer > 0 (Midtrans wajib IDR). */
export async function snapCharge(opts: {
  order_id: string
  amount: number
  customerName?: string
  customerPhone?: string
  customerEmail?: string
}): Promise<SnapResult> {
  const key = serverKey()
  if (!key) throw new Error('MIDTRANS_SERVER_KEY belum dikonfigurasi di server.')
  if (!Number.isInteger(opts.amount) || opts.amount <= 0)
    throw new Error('Nominal tidak valid (harus integer IDR > 0).')
  const site = siteUrl()
  const res = await fetch(snapBase(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Basic ${Buffer.from(`${key}:`).toString('base64')}`,
    },
    body: JSON.stringify({
      transaction_details: { order_id: opts.order_id, gross_amount: opts.amount },
      customer_details: {
        first_name: (opts.customerName ?? 'Tamu HotelsIn').slice(0, 50),
        phone: opts.customerPhone || undefined,
        email: opts.customerEmail || undefined,
      },
      callbacks: {
        finish: `${site}/reserve/payment/finish?order_id=${encodeURIComponent(opts.order_id)}`,
      },
      expiry: { unit: 'hours', duration: 24 },
    }),
  })
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
  if (!res.ok || typeof data.token !== 'string') {
    const msg = Array.isArray(data.error_messages)
      ? (data.error_messages as string[]).join('; ')
      : 'Gagal membuat transaksi Midtrans.'
    throw new Error(msg)
  }
  return { token: data.token as string, redirect_url: data.redirect_url as string }
}

/** Verifikasi signature notifikasi: SHA512(order_id+status_code+gross_amount+serverKey). */
export function verifySignature(input: {
  order_id: string
  status_code: string
  gross_amount: string
  signature_key: string
}): boolean {
  const key = serverKey()
  if (!key) return false
  const raw = `${input.order_id}${input.status_code}${input.gross_amount}${key}`
  const calc = createHash('sha512').update(raw).digest('hex')
  return calc === input.signature_key
}

/** Ambil status transaksi dari Midtrans (server-to-server). */
export async function getTransactionStatus(orderId: string): Promise<Record<string, any>> {
  const key = serverKey()
  if (!key) throw new Error('MIDTRANS_SERVER_KEY belum dikonfigurasi di server.')
  const base = isProduction()
    ? 'https://api.midtrans.com/v2'
    : 'https://api.sandbox.midtrans.com/v2'
  const res = await fetch(`${base}/${encodeURIComponent(orderId)}/status`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${Buffer.from(`${key}:`).toString('base64')}`,
    },
  })
  const data = (await res.json().catch(() => ({}))) as Record<string, any>
  if (!res.ok) throw new Error((data.status_message as string) || 'Gagal cek status Midtrans.')
  return data
}

/** Mapping status Midtrans -> status transaksi internal. */
export function mapMidtransStatus(transaction_status?: string, fraud_status?: string): 'COMPLETED' | 'PENDING' | 'FAILED' {
  if (transaction_status === 'settlement') return 'COMPLETED'
  if (transaction_status === 'capture') return fraud_status === 'challenge' ? 'PENDING' : 'COMPLETED'
  if (['deny', 'cancel', 'expire', 'failure'].includes(transaction_status ?? '')) return 'FAILED'
  return 'PENDING'
}
