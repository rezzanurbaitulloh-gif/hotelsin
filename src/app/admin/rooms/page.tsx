import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
const statusColor: Record<string,string> = { AVAILABLE:'bg-emerald-500', OCCUPIED:'bg-slate-900', RESERVED:'bg-amber-500', CLEANING:'bg-blue-500', DIRTY:'bg-orange-500', MAINTENANCE:'bg-red-500', OUT_OF_SERVICE:'bg-zinc-400' }
export default async function RoomsPage() {
  const supabase = await createClient()
  const { data: rooms } = await supabase.from('rooms').select('id,room_number,floor,status,room_type_id').order('room_number')
  const { data: types } = await supabase.from('room_types').select('id,name,base_price')
  const typeMap = Object.fromEntries((types||[]).map(t=>[t.id, t.name.en]))
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-light">Rooms</h1><p className="text-sm text-muted-foreground">{rooms?.length||0} rooms • status live from DB</p></div><button className="h-9 px-4 bg-brand-foreground text-brand-background text-xs tracking-widest">+ NEW ROOM</button></div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {(rooms||[]).map(r=> (
          <Card key={r.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2"><CardTitle className="flex items-center justify-between text-sm"><span className="font-mono">{r.room_number}</span><span className={"h-2 w-2 rounded-full "+(statusColor[r.status]||'bg-zinc-500')}></span></CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">{typeMap[r.room_type_id]||'—'} • Floor {r.floor}</p>
              <Badge variant={r.status==='AVAILABLE'?'secondary': r.status==='OCCUPIED'?'default':'outline'} className="text-[10px] tracking-widest">{r.status}</Badge>
              <div className="flex gap-2 pt-2"><button className="h-8 flex-1 border border-border text-xs">EDIT</button><button className="h-8 flex-1 bg-muted text-xs">HISTORY</button></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
