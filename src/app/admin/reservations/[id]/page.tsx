import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { PrintButton } from '@/components/print-button'
import { validateTransition, type ReservationStatus } from '@/lib/reservation-lifecycle'
import { auditLog } from '@/lib/email'

export const dynamic = 'force-dynamic'

const NEXT_ACTIONS: Record<string, ReservationStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  PENDING_PAYMENT: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['CHECKED_IN', 'CANCELLED', 'NO_SHOW'],
  CHECKED_IN: ['CHECKED_OUT'],
  CHECKED_OUT: [],
  CANCELLED: [],
  NO_SHOW: [],
}

export default async function AdminReservationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: me } = user?.email
    ? await supabase.from('users').select('role').eq('email', user.email).single()
    : { data: null }
  const actorRole = (me as any)?.role as string
  if (!actorRole) redirect('/login?next=/admin/reservations/' + id)

  const service = createServiceClient()
  const { data: r } = await service.from('reservations').select('*').eq('id', id).single()
  if (!r) return notFound()
  const res = r as any

  const { data: guest } = await service.from('guests').select('first_name,last_name,email,phone').eq('id', res.guest_id).single()
  const { data: rt } = await service.from('room_types').select('name').eq('id', res.room_type_id).single()
  const { data: txs } = await service.from('transactions').select('id,type,amount,currency,payment_method,status,reference,created_at').eq('reservation_id', id).order('created_at')
  const { data: addonLines } = await service.from('reservation_addons').select('id,qty,unit_price,total,addon_id').eq('reservation_id', id)
  const { data: history } = await service.from('reservation_status_history').select('status,notes,created_at').eq('reservation_id', id).order('created_at', { ascending: false }).limit(10)

  const paid = ((txs as any[]) || []).filter(t => t.status === 'COMPLETED').reduce((s, t) => s + Number(t.amount), 0)
  const balance = Number(res.total_amount) - paid

  async function changeStatus(formData: FormData) {
    'use server'
    const to = formData.get('to') as ReservationStatus
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) redirect('/login')
    const { data: actor } = await supabase.from('users').select('role').eq('email', user.email).single()
    const service = createServiceClient()
    const { data: cur } = await service.from('reservations').select('status,room_id,property_id').eq('id', id).single()
    const { validateTransition } = await import('@/lib/reservation-lifecycle')
    const check = validateTransition((cur as any).status, to, (actor as any)?.role, false)
    if (!check.ok) redirect(`/admin/reservations/${id}?error=${encodeURIComponent(check.reason || 'Transisi ditolak')}`)
    const now = new Date().toISOString()
    const updates: any = { status: to }
    if (to === 'CHECKED_IN') updates.checked_in_at = now
    if (to === 'CHECKED_OUT') updates.checked_out_at = now
    if (to === 'CANCELLED') { updates.cancelled_at = now; updates.cancellation_reason = 'Dibatalkan via admin' }
    await service.from('reservations').update(updates).eq('id', id).eq('status', (cur as any).status)
    if ((cur as any)?.room_id) {
      if (to === 'CHECKED_IN') await service.from('rooms').update({ status: 'OCCUPIED' }).eq('id', (cur as any).room_id)
      if (to === 'CHECKED_OUT') {
        await service.from('rooms').update({ status: 'CLEANING' }).eq('id', (cur as any).room_id)
        await service.from('housekeeping_tasks').insert({ property_id: (cur as any).property_id, room_id: (cur as any).room_id, status: 'PENDING', priority: 'NORMAL', notes: 'Auto after check-out' })
      }
      if (to === 'CANCELLED') await service.from('rooms').update({ status: 'AVAILABLE' }).eq('id', (cur as any).room_id)
    }
    await service.from('reservation_status_history').insert({ reservation_id: id, status: to, notes: `by ${(actor as any)?.role} ${user.email}` })
    const { auditLog } = await import('@/lib/email')
    await auditLog(service as any, { property_id: (cur as any).property_id, actor_email: user.email, actor_role: (actor as any)?.role, action: 'reservation.status', entity: 'reservations', entity_id: id, detail: { from: (cur as any).status, to } })
    redirect(`/admin/reservations/${id}`)
  }

  async function postCharge(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) redirect('/login')
    const service = createServiceClient()
    const { data: cur } = await service.from('reservations').select('property_id,guest_id').eq('id', id).single()
    const type = formData.get('type') as string
    const amount = Math.round(Number(formData.get('amount')))
    const notes = (formData.get('notes') as string) || ''
    if (!['F&B', 'SPA', 'EXPERIENCE', 'OTHER'].includes(type) || !(amount > 0)) redirect(`/admin/reservations/${id}?error=${encodeURIComponent('Tipe/nominal charge tidak valid')}`)
    await service.from('transactions').insert({
      property_id: (cur as any).property_id, reservation_id: id, guest_id: (cur as any).guest_id,
      type, amount, currency: res.currency || 'IDR', payment_method: 'ROOM_CHARGE', status: 'PENDING',
      reference: `POS-${Date.now().toString().slice(-6)}`, notes,
    })
    const { auditLog } = await import('@/lib/email')
    const { data: actor } = await supabase.from('users').select('role').eq('email', user.email).single()
    await auditLog(service as any, { property_id: (cur as any).property_id, actor_email: user.email, actor_role: (actor as any)?.role, action: 'folio.charge', entity: 'transactions', entity_id: id, detail: { type, amount } })
    redirect(`/admin/reservations/${id}`)
  }

  const actions = NEXT_ACTIONS[res.status as string] || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/reservations" className="text-xs tracking-widest text-muted-foreground hover:text-foreground">← Reservasi</Link>
          <h1 className="font-display text-2xl font-light mt-1">Folio <span className="font-mono">{res.confirmation_code}</span></h1>
        </div>
        <Badge variant={res.status === 'CANCELLED' ? 'destructive' : 'secondary'}>{res.status}</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Tamu & Menginap</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-2">
            <p className="font-medium">{(guest as any)?.first_name} {(guest as any)?.last_name}</p>
            <p className="text-xs text-muted-foreground">{(guest as any)?.email} • {(guest as any)?.phone}</p>
            <p>{(rt as any)?.name?.en || (rt as any)?.name?.id} • {res.check_in} → {res.check_out} • {res.nights} malam • {res.adults} tamu</p>
            {res.rate_plan_name && <p className="text-xs">Paket: {res.rate_plan_name}</p>}
            {res.special_requests && <p className="text-xs text-muted-foreground">Request: {res.special_requests}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Aksi Status</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {actions.length === 0 && <p className="text-xs text-muted-foreground">Tidak ada transisi (status final).</p>}
            {actions.map((to) => (
              <form key={to} action={changeStatus}>
                <input type="hidden" name="to" value={to} />
                <Button size="sm" variant={to === 'CANCELLED' ? 'destructive' : 'outline'} className="h-8 text-xs">
                  {to === 'CHECKED_IN' ? 'CHECK-IN' : to === 'CHECKED_OUT' ? 'CHECK-OUT' : to === 'NO_SHOW' ? 'NO SHOW' : to}
                </Button>
              </form>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Folio Tagihan</CardTitle></CardHeader>
        <CardContent className="text-sm">
          <div className="divide-y">
            <div className="flex justify-between py-2"><span>Kamar {res.nights} mlm @ {res.currency} {Number(res.room_rate).toLocaleString()}</span><span>{res.currency} {Number(res.subtotal).toLocaleString()}</span></div>
            {((addonLines as any[]) || []).map((l: any) => (
              <div key={l.id} className="flex justify-between py-2 text-muted-foreground"><span>Add-on × {l.qty}</span><span>{res.currency} {Number(l.total).toLocaleString()}</span></div>
            ))}
            {Number(res.discount_amount) > 0 && <div className="flex justify-between py-2 text-emerald-700"><span>Diskon</span><span>−{res.currency} {Number(res.discount_amount).toLocaleString()}</span></div>}
            <div className="flex justify-between py-2 text-muted-foreground"><span>Pajak 11%</span><span>{res.currency} {Number(res.tax_amount).toLocaleString()}</span></div>
            <div className="flex justify-between py-2 text-muted-foreground"><span>Biaya layanan 5%</span><span>{res.currency} {Number(res.fee_amount).toLocaleString()}</span></div>
            <div className="flex justify-between py-2 font-medium"><span>Total</span><span>{res.currency} {Number(res.total_amount).toLocaleString()}</span></div>
            <div className="flex justify-between py-2"><span>Dibayar</span><span className="text-emerald-700">{res.currency} {paid.toLocaleString()}</span></div>
            <div className="flex justify-between py-2 font-medium border-t"><span>Sisa</span><span className={balance > 0 ? 'text-destructive' : ''}>{res.currency} {balance.toLocaleString()}</span></div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Transaksi / Pembayaran</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {((txs as any[]) || []).map((t: any) => (
              <div key={t.id} className="flex items-center justify-between border-b last:border-0 py-2">
                <div><p className="font-mono text-xs">{t.reference}</p><p className="text-[10px] text-muted-foreground">{t.type} • {t.payment_method} • {new Date(t.created_at).toLocaleString('id-ID')}</p></div>
                <div className="text-right"><p className="font-medium">{t.currency} {Number(t.amount).toLocaleString()}</p><Badge variant={t.status === 'COMPLETED' ? 'secondary' : t.status === 'FAILED' ? 'destructive' : 'outline'} className="text-[10px]">{t.status}</Badge></div>
              </div>
            ))}
            {(!txs || txs.length === 0) && <p className="text-xs text-muted-foreground">Belum ada transaksi.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">POS Charge ke Kamar</CardTitle></CardHeader>
          <CardContent>
            <form action={postCharge} className="space-y-3">
              <div className="space-y-1"><Label className="text-xs">Tipe</Label>
                <select name="type" className="h-9 w-full border border-input bg-background px-2 rounded-lg text-sm">
                  <option>F&B</option><option>SPA</option><option>EXPERIENCE</option><option>OTHER</option>
                </select>
              </div>
              <div className="space-y-1"><Label className="text-xs">Nominal ({res.currency})</Label><Input name="amount" type="number" min={1} required /></div>
              <div className="space-y-1"><Label className="text-xs">Catatan</Label><Input name="notes" placeholder="Mis: dinner 2 pax" /></div>
              <Button className="w-full h-9 text-xs bg-brand-foreground text-brand-background">POST KE FOLIO</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Riwayat Status</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-xs">
          {((history as any[]) || []).map((h: any, i: number) => (
            <div key={i} className="flex justify-between border-b last:border-0 py-1.5"><span><Badge variant="outline" className="text-[10px]">{h.status}</Badge> <span className="text-muted-foreground ml-2">{h.notes}</span></span><span className="text-muted-foreground">{new Date(h.created_at).toLocaleString('id-ID')}</span></div>
          ))}
          {(!history || history.length === 0) && <p className="text-muted-foreground">Belum ada riwayat.</p>}
        </CardContent>
      </Card>

      <div className="flex gap-2 print:hidden">
        <PrintButton />
        <span className="text-[10px] text-muted-foreground self-center">Role Anda: {actorRole}</span>
      </div>
    </div>
  )
}
