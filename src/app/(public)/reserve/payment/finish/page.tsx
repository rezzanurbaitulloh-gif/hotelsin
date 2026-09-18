'use client'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Clock, XCircle } from 'lucide-react'

interface StatusResp {
  ok: boolean
  reservation_status?: string | null
  reservation_id?: string | null
  local_transaction_status?: string | null
  gateway_status?: string | null
  gateway_payment_type?: string | null
  error?: string
}

function FinishInner() {
  const sp = useSearchParams()
  const orderId = sp.get('order_id') || ''
  const [state, setState] = useState<StatusResp | null>(null)
  const [retrying, setRetrying] = useState(false)
  const [retryError, setRetryError] = useState<string | null>(null)

  const fetchStatus = useCallback(async () => {
    if (!orderId) return
    try {
      const res = await fetch(`/api/payments/midtrans/status?order_id=${encodeURIComponent(orderId)}`)
      const data = (await res.json()) as StatusResp
      setState(data)
      return data
    } catch {
      return null
    }
  }, [orderId])

  useEffect(() => {
    fetchStatus()
    const t = setInterval(async () => {
      const d = await fetchStatus()
      if (d?.reservation_status === 'CONFIRMED' || d?.reservation_status === 'CANCELLED') {
        clearInterval(t)
      }
    }, 3000)
    return () => clearInterval(t)
  }, [fetchStatus])

  const retryPay = async () => {
    setRetrying(true)
    setRetryError(null)
    try {
      const res = await fetch('/api/payments/midtrans/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Gagal')
      const snapJs = document.querySelector('script[data-midtrans]') as HTMLScriptElement | null
      const openPay = () => {
        if (window.snap) {
          window.snap.pay(data.token, {
            onSuccess: () => fetchStatus(),
            onPending: () => fetchStatus(),
            onError: () => setRetryError('Pembayaran gagal. Coba lagi.'),
            onClose: () => setRetrying(false),
          })
        } else {
          window.location.href = data.redirect_url
        }
      }
      if (!snapJs && data.redirect_url) {
        window.location.href = data.redirect_url
      } else {
        openPay()
        setRetrying(false)
      }
    } catch (e: any) {
      setRetryError(e?.message || 'Gagal')
      setRetrying(false)
    }
  }

  if (!orderId) {
    return <div className="container mx-auto px-6 py-12 text-center"><p className="text-muted-foreground">Order tidak ditemukan.</p><Link href="/reserve" className="text-brand-accent underline">Kembali</Link></div>
  }

  const resStatus = state?.reservation_status
  const isConfirmed = resStatus === 'CONFIRMED'
  const isFailed = resStatus === 'CANCELLED' || state?.local_transaction_status === 'FAILED'

  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          {isConfirmed ? (
            <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
          ) : isFailed ? (
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
          ) : (
            <Clock className="h-12 w-12 text-amber-500 mx-auto mb-2 animate-pulse" />
          )}
          <CardTitle className="font-mono text-xl tracking-widest">{orderId}</CardTitle>
          <div className="mt-2">
            <Badge variant={isConfirmed ? 'secondary' : isFailed ? 'destructive' : 'outline'}>
              {isConfirmed ? 'CONFIRMED' : isFailed ? 'FAILED / CANCELLED' : 'MENUNGGU PEMBAYARAN'}
            </Badge>
          </div>
          {state?.gateway_payment_type && (
            <p className="text-xs text-muted-foreground mt-2">Via {state.gateway_payment_type} • Status gateway: {state.gateway_status}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-center">
          {isConfirmed ? (
            <>
              <p className="text-muted-foreground">Pembayaran terverifikasi. Reservasi Anda dikonfirmasi.</p>
              <div className="flex gap-3">
                <Link href={`/reserve/confirmation?code=${encodeURIComponent(orderId)}`} className="flex-1 h-11 bg-brand-foreground text-brand-background grid place-items-center text-xs tracking-widest">LIHAT KONFIRMASI</Link>
                {state?.reservation_id && (
                  <Link href={`/account/reservations/${state.reservation_id}`} className="flex-1 h-11 border border-border grid place-items-center text-xs tracking-widest">LIHAT DI AKUN</Link>
                )}
              </div>
            </>
          ) : isFailed ? (
            <>
              <p className="text-muted-foreground">Pembayaran gagal/kedaluwarsa dan reservasi dibatalkan otomatis. Silakan buat reservasi baru.</p>
              <Link href="/reserve" className="inline-block h-11 px-6 bg-brand-foreground text-brand-background items-center text-xs tracking-widest">BUAT RESERVASI BARU</Link>
            </>
          ) : (
            <>
              <p className="text-muted-foreground">Selesaikan pembayaran di jendela Midtrans. Halaman ini mengecek status otomatis tiap 3 detik.</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={retryPay} disabled={retrying} variant="outline" className="h-10 text-xs tracking-widest">
                  {retrying ? 'MEMBUKA...' : 'BUKA PEMBAYARAN LAGI'}
                </Button>
                <Button onClick={fetchStatus} variant="ghost" className="h-10 text-xs tracking-widest">CEK STATUS</Button>
              </div>
              {retryError && <p className="text-destructive text-xs">{retryError}</p>}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function FinishPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-6 py-12 text-center text-sm text-muted-foreground">Memuat status pembayaran...</div>}>
      <FinishInner />
    </Suspense>
  )
}
