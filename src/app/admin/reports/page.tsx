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
  return (<div className="space-y-6"><div><h1 className="font-display text-2xl font-light">Reports</h1><p className="text-sm text-muted-foreground">Occupancy, ADR, RevPAR — real DB calculations</p></div>
  <div className="grid gap-4 md:grid-cols-3"><Card><CardHeader><CardTitle className="text-xs tracking-widest uppercase text-muted-foreground">Occupancy</CardTitle></CardHeader><CardContent><p className="text-3xl font-light">{occupancy}%</p><div className="h-2 bg-muted rounded-full mt-2"><div className="h-2 bg-brand-accent rounded-full" style={{width: occupancy+'%'}}/></div></CardContent></Card>
  <Card><CardHeader><CardTitle className="text-xs tracking-widest uppercase text-muted-foreground">ADR</CardTitle></CardHeader><CardContent><p className="text-3xl font-light">${adr}</p><p className="text-xs text-muted-foreground">Revenue / occupied rooms</p></CardContent></Card>
  <Card><CardHeader><CardTitle className="text-xs tracking-widest uppercase text-muted-foreground">RevPAR</CardTitle></CardHeader><CardContent><p className="text-3xl font-light">${revpar}</p><p className="text-xs text-muted-foreground">Revenue / available rooms</p></CardContent></Card></div>
  <Card><CardHeader><CardTitle className="text-sm">Revenue Trend (Completed Transactions)</CardTitle></CardHeader><CardContent><div className="h-40 flex items-end gap-1">{(transactions||[]).slice(0,20).map((t,i)=>{const h=Math.min(100, Number(t.amount)/50); return <div key={i} className="flex-1 bg-brand-foreground" style={{height: h+'%'}} title={t.amount}/>})}<p className="text-xs text-muted-foreground mt-2">Each bar = one transaction (height ∝ amount)</p></div></CardContent></Card>
  </div>)
}
