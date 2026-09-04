import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function HousekeepingPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('housekeeping_tasks').select('id,room_id,status,priority,notes,created_at').order('created_at',{ascending:false}).limit(30)
  const { data: rooms } = await supabase.from('rooms').select('id,room_number')
  const rmap = Object.fromEntries((rooms||[]).map(r=>[r.id, r.room_number]))
  const cols = ['PENDING','IN_PROGRESS','INSPECTION','COMPLETED'] as const
  return (
    <div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-light">Housekeeping</h1><p className="text-sm text-muted-foreground">Kanban by status • {data?.length||0} tasks</p></div><a href="/admin/housekeeping/new" className="h-9 px-4 bg-brand-foreground text-brand-background inline-flex items-center text-brand-background text-xs tracking-widest">+ NEW TASK</a></div>
      <div className="grid gap-4 md:grid-cols-4">
        {cols.map(col=> (
          <Card key={col} className="bg-muted/20"><CardHeader className="pb-2"><CardTitle className="text-xs tracking-widest uppercase">{col} • {(data||[]).filter(t=>t.status===col).length}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {(data||[]).filter(t=>t.status===col).map(t=> (
                <div key={t.id} className="bg-card border border-border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between"><span className="font-mono text-xs font-medium">{rmap[t.room_id]||t.room_id.slice(0,6)}</span><Badge variant={t.priority==='HIGH'||t.priority==='URGENT'?'destructive':'secondary'} className="text-[10px]">{t.priority}</Badge></div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{t.notes||'—'}</p>
                  <div className="flex gap-1"><a href="/admin/housekeeping" className="h-7 flex-1 border border-border grid place-items-center text-[10px] tracking-widest hover:bg-muted">MOVE</a><a href="/admin/housekeeping" className="h-7 flex-1 bg-muted grid place-items-center text-[10px] hover:bg-muted/80">DONE</a></div>
                </div>
              ))}
              {(data||[]).filter(t=>t.status===col).length===0 && <p className="text-xs text-muted-foreground py-8 text-center">Empty</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
