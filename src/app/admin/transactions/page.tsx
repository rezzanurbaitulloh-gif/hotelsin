import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function TransactionsPage(){
  const supabase=await createClient()
  const {data}=await supabase.from('transactions').select('id,amount,currency,type,status,reference,created_at').order('created_at',{ascending:false}).limit(30)
  const total = (data||[]).filter(t=>t.status==='COMPLETED').reduce((s,t)=>s+Number(t.amount),0)
  return (<div className="space-y-6"><div><h1 className="font-display text-2xl font-light">Transactions</h1><p className="text-sm text-muted-foreground">Revenue • ${total.toLocaleString()} completed • {data?.length||0} records</p></div>
  <Card><CardHeader><CardTitle className="text-sm">All Transactions</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full text-sm"><thead className="text-xs tracking-widest text-muted-foreground uppercase border-b"><tr><th className="text-left py-3">Ref</th><th className="text-left">Type</th><th className="text-right">Amount</th><th className="text-left">Status</th><th className="text-left">Date</th></tr></thead><tbody>{(data||[]).map(t=> <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30"><td className="py-3 font-mono text-xs">{t.reference||t.id.slice(0,8)}</td><td>{t.type}</td><td className="text-right font-medium">{t.currency} {Number(t.amount).toLocaleString()}</td><td><Badge variant={t.status==='COMPLETED'?'secondary': t.status==='REFUNDED'?'destructive':'outline'}>{t.status}</Badge></td><td className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString('id-ID')}</td></tr>)}</tbody></table></CardContent></Card></div>)
}
