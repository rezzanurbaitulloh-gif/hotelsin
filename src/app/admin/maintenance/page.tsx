import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function MaintenancePage() {
  const supabase = await createClient()
  const { data } = await supabase.from('maintenance_tasks').select('id,title,status,priority,room_id,created_at').order('created_at',{ascending:false}).limit(30)
  const { data: rooms } = await supabase.from('rooms').select('id,room_number')
  const rmap = Object.fromEntries((rooms||[]).map(r=>[r.id, r.room_number]))
  return (
    <div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-light">Maintenance</h1><p className="text-sm text-muted-foreground">{data?.length||0} open issues</p></div><button className="h-9 px-4 bg-brand-foreground text-brand-background text-xs tracking-widest">+ REPORT ISSUE</button></div>
      <Card><CardHeader><CardTitle className="text-sm">All Tasks</CardTitle></CardHeader><CardContent className="overflow-x-auto">
        <table className="w-full text-sm"><thead className="text-xs tracking-widest text-muted-foreground uppercase border-b"><tr><th className="text-left py-3">Issue</th><th className="text-left">Room</th><th className="text-left">Priority</th><th className="text-left">Status</th><th className="text-right">Actions</th></tr></thead>
        <tbody>{(data||[]).map(t=> <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30"><td className="py-3 font-medium">{t.title}</td><td className="font-mono text-xs">{t.room_id? rmap[t.room_id]||'—':'General'}</td><td><Badge variant={t.priority==='HIGH'?'destructive':'secondary'}>{t.priority}</Badge></td><td><Badge variant="outline">{t.status}</Badge></td><td className="text-right"><button className="text-xs text-brand-accent hover:underline">Resolve</button></td></tr>)}</tbody></table>
      </CardContent></Card>
    </div>
  )
}
