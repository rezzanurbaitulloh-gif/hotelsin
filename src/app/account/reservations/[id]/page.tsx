import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
export const dynamic = 'force-dynamic'
export default async function ReservationDetailPage({ params }: { params: Promise<{id:string}>}){
  const { id } = await params
  const supabase = await createClient()
  const { data: r } = await supabase.from('reservations').select('id,confirmation_code,check_in,check_out,status,total_amount,currency,adults,nights,room_rate,guest_id').eq('id', id).single()
  if (!r) return <div className="p-12 text-center text-muted-foreground">Reservation not found — <Link href="/account/reservations" className="text-brand-accent underline">Kembali</Link></div>
  const { data: guest } = await supabase.from('guests').select('first_name,last_name,email').eq('id', r.guest_id).single()
  return (
    <div className="space-y-6">
      <Link href="/account/reservations" className="text-xs tracking-widest text-muted-foreground hover:text-foreground">← Kembali ke Reservasi</Link>
      <Card>
        <CardHeader><CardTitle className="flex items-center justify-between"><span className="font-mono">{r.confirmation_code}</span><Badge variant={r.status==='CANCELLED'?'destructive':'secondary'}>{r.status}</Badge></CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div><p className="text-xs tracking-widest text-muted-foreground uppercase">Tamu</p><p className="font-medium">{guest?.first_name} {guest?.last_name}</p><p className="text-xs text-muted-foreground">{guest?.email}</p></div>
            <div><p className="text-xs tracking-widest text-muted-foreground uppercase">Tanggal</p><p>{r.check_in} → {r.check_out} • {r.nights} malam</p><p className="text-xs text-muted-foreground">{r.adults} tamu • \${r.room_rate}/malam</p></div>
          </div>
          <div className="pt-4 border-t border-border flex justify-between items-center">
            <span className="font-medium">Total</span><span className="font-display text-xl">{r.currency} {Number(r.total_amount).toLocaleString()}</span>
          </div>
          {r.status!=='CANCELLED' && r.status!=='CHECKED_OUT' && <button className="h-9 w-full border border-destructive text-destructive text-xs tracking-widest hover:bg-destructive hover:text-destructive-foreground">BATALKAN RESERVASI</button>}
        </CardContent>
      </Card>
    </div>
  )
}
