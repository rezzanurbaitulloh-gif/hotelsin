import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Price } from '@/components/price'
import { ReviewForm } from '@/components/review-form'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ReservationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) redirect('/login?next=/account/reservations/' + id)

  const { data: r } = await supabase.from('reservations').select('id,confirmation_code,check_in,check_out,status,total_amount,currency,adults,nights,room_rate,guest_id').eq('id', id).single()
  if (!r) return <div className="p-12 text-center text-muted-foreground">Reservation not found — <Link href="/account/reservations" className="text-brand-accent underline">Kembali</Link></div>

  // Ownership check (IDOR protection): reservation guest email must match, unless staff
  const { data: guest } = await supabase.from('guests').select('first_name,last_name,email').eq('id', (r as any).guest_id).single()
  const { data: staff } = await supabase.from('users').select('role').eq('email', user.email).maybeSingle()
  if (!staff && (guest as any)?.email !== user.email) {
    return <div className="p-12 text-center text-muted-foreground">Bukan reservasi Anda. <Link href="/account/reservations" className="text-brand-accent underline">Kembali</Link></div>
  }

  const canCancel = ['PENDING', 'PENDING_PAYMENT', 'CONFIRMED'].includes((r as any).status)

  async function cancelReservation() {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) redirect('/login')
    const service = createServiceClient()
    const { data: res } = await service.from('reservations').select('id,status,guest_id,room_id').eq('id', id).single()
    if (!res) redirect('/account/reservations')
    const { validateTransition } = await import('@/lib/reservation-lifecycle')
    const check = validateTransition((res as any).status, 'CANCELLED', 'GUEST', true)
    if (!check.ok) redirect(`/account/reservations/${id}?error=${encodeURIComponent(check.reason || 'Tidak bisa dibatalkan')}`)
    // verify ownership again server-side
    const { data: g } = await service.from('guests').select('email').eq('id', (res as any).guest_id).single()
    const { data: st } = await service.from('users').select('role').eq('email', user.email).maybeSingle()
    if (!st && (g as any)?.email !== user.email) redirect('/account/reservations')
    await service.from('reservations').update({ status: 'CANCELLED', cancelled_at: new Date().toISOString(), cancellation_reason: 'Dibatalkan tamu via akun' }).eq('id', id).eq('status', (res as any).status)
    await service.from('reservation_status_history').insert({ reservation_id: id, status: 'CANCELLED', notes: `Dibatalkan tamu ${user.email}` })
    if ((res as any)?.room_id) {
      await service.from('rooms').update({ status: 'AVAILABLE' }).eq('id', (res as any).room_id)
    }
    const { auditLog } = await import('@/lib/email')
    await auditLog(service as any, { actor_email: user.email, actor_role: 'GUEST', action: 'reservation.cancel', entity: 'reservations', entity_id: id, detail: { from: (res as any).status } })
    redirect(`/account/reservations/${id}?cancelled=1`)
  }

  return (
    <div className="space-y-6">
      <Link href="/account/reservations" className="text-xs tracking-widest text-muted-foreground hover:text-foreground">← Kembali ke Reservasi</Link>
      <Card>
        <CardHeader><CardTitle className="flex items-center justify-between"><span className="font-mono">{(r as any).confirmation_code}</span><Badge variant={(r as any).status === 'CANCELLED' ? 'destructive' : 'secondary'}>{(r as any).status}</Badge></CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div><p className="text-xs tracking-widest text-muted-foreground uppercase">Tamu</p><p className="font-medium">{(guest as any)?.first_name} {(guest as any)?.last_name}</p><p className="text-xs text-muted-foreground">{(guest as any)?.email}</p></div>
            <div><p className="text-xs tracking-widest text-muted-foreground uppercase">Tanggal</p><p>{(r as any).check_in} → {(r as any).check_out} • {(r as any).nights} malam</p><p className="text-xs text-muted-foreground">{(r as any).adults} tamu • <Price amount={Number((r as any).room_rate)} />/malam</p></div>
          </div>
          <div className="pt-4 border-t border-border flex justify-between items-center">
            <span className="font-medium">Total</span><span className="font-display text-xl"><Price amount={Number((r as any).total_amount)} /></span>
          </div>
          {canCancel ? (
            <form action={cancelReservation}>
              <Button variant="outline" className="h-9 w-full border-destructive text-destructive text-xs tracking-widest hover:bg-destructive hover:text-destructive-foreground">BATALKAN RESERVASI</Button>
              <p className="text-[10px] text-muted-foreground text-center mt-2">Gratis hingga H-3 check-in. Dalam 3 hari dikenakan 1 malam.</p>
            </form>
          ) : (
            <p className="text-xs text-center text-muted-foreground">
              {(r as any).status === 'CANCELLED' ? 'Reservasi ini sudah dibatalkan.' : 'Reservasi ini tidak dapat dibatalkan dari akun (sudah check-in/selesai). Hubungi resepsionis.'}
            </p>
          )}
          {(r as any).status === 'CHECKED_OUT' && (
            <div className="pt-4 border-t border-border">
              <p className="text-xs tracking-widest uppercase mb-3">Bagaimana pengalaman Anda?</p>
              <ReviewForm reservationId={(r as any).id} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
