import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { redirect } from 'next/navigation'
export const dynamic = 'force-dynamic'
export default async function AccountReservationsPage(){
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  // Find guest by email then reservations by guest_id
  const { data: guest } = await supabase.from('guests').select('id').eq('email', user.email!).single()
  let reservations: any[] = []
  if (guest) {
    const { data } = await supabase.from('reservations').select('id,confirmation_code,check_in,check_out,status,total_amount,currency').eq('guest_id', guest.id).order('created_at',{ascending:false}).limit(20)
    reservations = data||[]
  } else {
    // fallback: show all for demo if no guest link
    const { data } = await supabase.from('reservations').select('id,confirmation_code,check_in,check_out,status,total_amount,currency').limit(5)
    reservations = data||[]
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center justify-between"><span>Reservasi Saya</span><Badge variant="secondary">{reservations.length} records</Badge></CardTitle></CardHeader>
        <CardContent className="divide-y">
          {reservations.map(r=> (
            <Link key={r.id} href={`/account/reservations/${r.id}`} className="flex items-center justify-between py-4 hover:bg-muted/30 px-2 rounded-lg">
              <div><p className="font-mono text-sm font-medium">{r.confirmation_code}</p><p className="text-xs text-muted-foreground">{r.check_in} → {r.check_out} • {r.currency} {Number(r.total_amount).toLocaleString()}</p></div>
              <Badge variant={r.status==='CANCELLED'?'destructive': r.status==='CONFIRMED'?'secondary':'outline'}>{r.status}</Badge>
            </Link>
          ))}
          {!reservations.length && <p className="py-12 text-center text-muted-foreground">Belum ada reservasi — <Link href="/reserve" className="text-brand-accent underline">Buat reservasi</Link></p>}
        </CardContent>
      </Card>
    </div>
  )
}
