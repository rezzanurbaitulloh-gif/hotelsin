'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'

declare global {
  interface Window {
    snap?: {
      pay: (token: string, opts?: Record<string, any>) => void
    }
  }
}

export function PayOnlineButton({ snapToken, clientKey, snapJsUrl, orderId }: {
  snapToken: string
  clientKey: string
  snapJsUrl: string
  orderId: string
}) {
  const { t } = useI18n()
  const [ready, setReady] = useState(false)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    if (!clientKey) {
      setError('Kunci pembayaran belum dikonfigurasi.')
      return
    }
    const existing = document.querySelector('script[data-midtrans]')
    if (existing) {
      setReady(true)
      return
    }
    const s = document.createElement('script')
    s.src = snapJsUrl
    s.setAttribute('data-client-key', clientKey)
    s.setAttribute('data-midtrans', 'true')
    s.onload = () => setReady(true)
    s.onerror = () => setError('Gagal memuat Midtrans. Periksa koneksi lalu coba lagi.')
    document.body.appendChild(s)
  }, [clientKey, snapJsUrl])

  const pay = () => {
    setError(null)
    setClosed(false)
    if (!window.snap) {
      setError('Midtrans belum siap. Tunggu sebentar lalu coba lagi.')
      return
    }
    setPaying(true)
    try {
      window.snap.pay(snapToken, {
        onSuccess: () => {
          window.location.href = `/reserve/payment/finish?order_id=${encodeURIComponent(orderId)}`
        },
        onPending: () => {
          window.location.href = `/reserve/payment/finish?order_id=${encodeURIComponent(orderId)}`
        },
        onError: () => {
          setPaying(false)
          setError('Pembayaran gagal. Silakan coba lagi atau pilih metode lain.')
        },
        onClose: () => {
          setPaying(false)
          setClosed(true)
        },
      })
    } catch {
      setPaying(false)
      setError('Tidak bisa membuka pembayaran. Coba lagi.')
    }
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={pay}
        disabled={!ready || paying || !snapToken}
        className="w-full bg-brand-foreground text-brand-background hover:bg-brand-foreground/90 h-12 tracking-[0.15em] text-xs"
      >
        {!ready ? 'MEMUAT PEMBAYARAN...' : paying ? 'MEMBUKA MIDTRANS...' : t('booking.pay_now')}
      </Button>
      {closed && (
        <p className="text-xs text-center text-muted-foreground">
          Jendela pembayaran ditutup. Belum ada dana yang ditarik — klik bayar untuk lanjut.
        </p>
      )}
      {error && <p className="text-sm text-center text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}
      <p className="text-[10px] text-center text-muted-foreground">Order ID: <span className="font-mono">{orderId}</span></p>
    </div>
  )
}
