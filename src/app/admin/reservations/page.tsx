import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
export const dynamic='force-dynamic'
export default async function ReservationsPage({searchParams}:{searchParams: Promise<{status?:string, q?:string}>}) {
  const sp = await searchParams
  const supabase = await createClient()
  let query = supabase.from('reservations').select('id,confirmation_code,check_in,check_out,status,total_amount,currency,adults,guest_id,room_id').order('created_at',{ascending:false}).limit(50)
  if (sp.status && sp.status!=='all') query = query.eq('status', sp.status)
  const { data } = await query
  const filtered = sp.q ? (data||[]).filter(r=> r.confirmation_code.toLowerCase().includes(sp.q!.toLowerCase())) : data||[]
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><h1 className="font-display text-2xl font-light">Reservations</h1><p className="text-sm text-muted-foreground">{filtered.length} records • filter by status / search code</p></div>
        <a href="/admin/reservations" className="h-9 px-4 inline-flex items-center bg-brand-foreground text-brand-background text-xs tracking-widest">+ NEW RESERVATION</a>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-sm">All Reservations</CardTitle>
          <form className="flex gap-2">
            <Input name="q" placeholder="Search code…" defaultValue={sp.q||''} className="h-9 w-40"/>
            <Select name="status" defaultValue={sp.status||'all'}>
              <SelectTrigger className="w-36 h-9"><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="CHECKED_IN">Checked In</SelectItem>
                <SelectItem value="CHECKED_OUT">Checked Out</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <button type="submit" className="h-9 px-4 border border-border text-xs tracking-widest">FILTER</button>
          </form>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs tracking-widest text-muted-foreground uppercase border-b"><tr><th className="text-left py-3">Code</th><th className="text-left">Check In</th><th className="text-left">Check Out</th><th className="text-left">Status</th><th className="text-right">Total</th><th className="text-center">Actions</th></tr></thead>
            <tbody>
              {filtered.map(r=> (
                <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="py-3 font-mono text-xs">{r.confirmation_code}</td>
                  <td>{r.check_in}</td>
                  <td>{r.check_out}</td>
                  <td><Badge variant={r.status==='CANCELLED'?'destructive': r.status==='CONFIRMED'?'secondary':'outline'}>{r.status}</Badge></td>
                  <td className="text-right">{r.currency} {Number(r.total_amount).toLocaleString()}</td>
                  <td className="text-center"><a href={"/admin/reservations/"+r.id} className="text-xs text-brand-accent hover:underline">View</a></td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">No reservations found</td></tr>}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
