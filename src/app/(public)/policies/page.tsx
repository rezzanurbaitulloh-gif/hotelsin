import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Policies — Cancellation, Check-in & House Rules',
  description: 'HotelsIn cancellation policy, check-in/check-out times, payment and house rules.',
}

export default function PoliciesPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-2">Policies</p>
      <h1 className="font-display text-4xl font-light mb-8">Kebijakan Kami</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader><CardTitle>Kebijakan Pembatalan</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• Pembatalan gratis hingga <strong>3 hari</strong> sebelum tanggal check-in (15:00 WITA).</p>
            <p>• Pembatalan dalam 3 hari sebelum check-in dikenakan <strong>biaya 1 malam pertama</strong>.</p>
            <p>• <strong>No-show</strong> (tidak datang tanpa kabar) dikenakan <strong>100% total reservasi</strong>.</p>
            <p>• Tarif non-refundable tidak dapat dibatalkan atau diubah.</p>
            <p>• Refund (jika berhak) diproses ke metode pembayaran asal dalam 7–14 hari kerja.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Check-in & Check-out</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• Check-in mulai pukul <strong>15:00 WITA</strong>, check-out hingga <strong>11:00 WITA</strong>.</p>
            <p>• Early check-in / late check-out sesuai ketersediaan (late check-out hingga 14:00 tersedia sebagai add-on).</p>
            <p>• Wajib menunjukkan identitas berfoto saat check-in.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pembayaran</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• Pembayaran aman via Midtrans: QRIS, Virtual Account bank lokal, e-wallet, kartu kredit/debit, dan gerai retail.</p>
            <p>• Link pembayaran kedaluwarsa dalam <strong>24 jam</strong>; reservasi yang belum dibayar dibatalkan otomatis.</p>
            <p>• Harga sudah termasuk pajak 11% dan biaya layanan 5%, kecuali dinyatakan lain.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Aturan Villa</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• Dilarang merokok di dalam ruangan • Hewan peliharaan tidak diizinkan • Tamu tambahan wajib lapor resepsionis.</p>
            <p>• Kerusakan atau kehilangan inventaris akan ditagihkan sesuai nilai penggantian.</p>
          </CardContent>
        </Card>
        <div className="text-center">
          <Link href="/reserve" className="inline-block h-11 px-8 bg-brand-foreground text-brand-background items-center text-xs tracking-widest">MULAI RESERVASI</Link>
        </div>
      </div>
    </div>
  )
}
