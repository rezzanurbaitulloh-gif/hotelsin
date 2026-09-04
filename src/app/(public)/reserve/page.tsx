import { ReservationBar } from '@/components/reservation-bar'
import Link from 'next/link'

export default function ReservePage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-2">Reserve</p>
        <h1 className="font-display text-4xl md:text-5xl font-light leading-none mb-4">Mulai perjalanan Anda</h1>
        <p className="text-muted-foreground">Pilih tanggal, tamu, dan preferensi — sistem akan cek ketersediaan real-time dari database.</p>
      </div>
      <div className="max-w-4xl mx-auto bg-card border border-border shadow-xl p-6 rounded-lg">
        <h2 className="font-medium mb-4">Cari Ketersediaan</h2>
        <ReservationBar />
        <p className="text-xs text-muted-foreground mt-4">Data ketersediaan diambil langsung dari <code className="bg-muted px-1 rounded">supabase.from('rooms').from('reservations')</code> — tidak ada hardcode.</p>
      </div>
      <div className="max-w-4xl mx-auto mt-8 flex justify-center gap-4">
        <Link href="/stay" className="h-10 px-6 inline-flex items-center border border-border text-xs tracking-widest">LIHAT KAMAR</Link>
        <Link href="/" className="h-10 px-6 inline-flex items-center bg-muted text-xs tracking-widest">KEMBALI KE HOME</Link>
      </div>
    </div>
  )
}
