import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
export const dynamic='force-dynamic'
export default async function ReportsPage(){
  const supabase=await createClient()
  const {data: rooms}=await supabase.from('rooms').select('status')
  const {data: transactions}=await supabase.from('transactions').select('amount,status,created_at').eq('status','COMPLETED')
  const totalRooms = rooms?.length||0
  const occupied = rooms?.filter(r=>r.status==='OCCUPIED').length||0
  const occupancy = totalRooms? Math.round(occupied/totalRooms*100):0
  const revenue = (transactions||[]).reduce((s,t)=>s+Number(t.amount),0)
  const adr = occupied? Math.round(revenue/Math.max(occupied,1)):0
  const revpar = totalRooms? Math.round(revenue/totalRooms):0
  const {data: closures}=await supabase.from('daily_closures').select('date,rooms_occupied,rooms_total,occupancy_pct,room_revenue,total_revenue,adr,revpar').order('date',{ascending:false}).limit(14)
  return (<div className="space-y-6"><div><h1 className="font-display text-2xl font-light">Reports</h1><p className="text-sm text-muted-foreground">Occupancy, ADR, RevPAR — real DB calculations</p></div>
  <div className="grid gap-4 md:grid-cols-3"><Card><CardHeader><CardTitle className="text-xs tracking-widest uppercase text-muted-foreground">Occupancy</CardTitle></CardHeader><CardContent><p className="text-3xl font-light">{occupancy}%</p><div className="h-2 bg-muted rounded-full mt-2"><div className="h-2 bg-brand-accent rounded-full" style={{width: occupancy+'%'}}/></div></CardContent></Card>
  <Card><CardHeader><CardTitle className="text-xs tracking-widest uppercase text-muted-foreground">ADR</CardTitle></CardHeader><CardContent><p className="text-3xl font-light">${adr}</p><p className="text-xs text-muted-foreground">Revenue / occupied rooms</p></CardContent></Card>
  <Card><CardHeader><CardTitle className="text-xs tracking-widest uppercase text-muted-foreground">RevPAR</CardTitle></CardHeader><CardContent><p className="text-3xl font-light">${revpar}</p><p className="text-xs text-muted-foreground">Revenue / available rooms</p></CardContent></Card></div>
  <Card><CardHeader><CardTitle className="text-sm">Revenue Trend (Completed Transactions)</CardTitle></CardHeader><CardContent><div className="h-40 flex items-end gap-1">{(transactions||[]).slice(0,20).map((t,i)=>{const h=Math.min(100, Number(t.amount)/50); return <div key={i} className="flex-1 bg-brand-foreground" style={{height: h+'%'}} title={t.amount}/>})}<p className="text-xs text-muted-foreground mt-2">Each bar = one transaction (height ∝ amount)</p></div></CardContent></Card>
  <Card><CardHeader><CardTitle className="text-sm">Night Audit — Daily Closures (14 hari)</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full text-sm"><thead className="text-xs tracking-widest text-muted-foreground uppercase border-b"><tr><th className="text-left py-2">Tanggal</th><th className="text-center">Occ</th><th className="text-right">Room Rev</th><th className="text-right">Total Rev</th><th className="text-right">ADR</th><th className="text-right">RevPAR</th></tr></thead><tbody>{(closures||[]).map((c:any)=> <tr key={c.date} className="border-b last:border-0"><td className="py-2">{c.date}</td><td className="text-center">{c.rooms_occupied}/{c.rooms_total} ({c.occupancy_pct}%)</td><td className="text-right">{Number(c.room_revenue).toLocaleString()}</td><td className="text-right font-medium">{Number(c.total_revenue).toLocaleString()}</td><td className="text-right">{Number(c.adr).toLocaleString()}</td><td className="text-right">{Number(c.revpar).toLocaleString()}</td></tr>)}</tbody></table>{(!closures||closures.length===0) && <p className="py-8 text-center text-xs text-muted-foreground">Belum ada closure — cron malam hari akan mengisi otomatis.</p>}</CardContent></Card>
  <Card><CardContent className="py-4 text-xs text-muted-foreground">iCal feed untuk channel manager: <code className="bg-muted px-1 rounded">/api/calendar/ical?key=CRON_SECRET</code> — import ke OTA extranet untuk cegah double-booking.</CardContent></Card>
  </div>)
}
