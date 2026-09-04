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
      <div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-light">Rooms</h1><p className="text-sm text-muted-foreground">{rooms?.length||0} rooms • status live from DB • klik EDIT untuk ubah status (persist ke DB)</p></div><a href="/admin/rooms/new" className="h-9 px-4 bg-brand-foreground text-brand-background inline-flex items-center text-xs tracking-widest hover:bg-brand-foreground/90">+ NEW ROOM</a></div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {(rooms||[]).map(r=> (
          <Card key={r.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2"><CardTitle className="flex items-center justify-between text-sm"><span className="font-mono">{r.room_number}</span><span className={"h-2 w-2 rounded-full "+(statusColor[r.status]||'bg-zinc-500')}></span></CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">{typeMap[r.room_type_id]||'—'} • Floor {r.floor}</p>
              <Badge variant={r.status==='AVAILABLE'?'secondary': r.status==='OCCUPIED'?'default':'outline'} className="text-[10px] tracking-widest">{r.status}</Badge>
              <form action={async (formData: FormData)=>{
                'use server'
                const { createClient } = await import('@/lib/supabase/server')
                const supabase = await createClient()
                const newStatus = formData.get('status') as string
                const roomId = formData.get('roomId') as string
                await supabase.from('rooms').update({ status: newStatus }).eq('id', roomId)
              }} className="flex gap-2 pt-2">
                <input type="hidden" name="roomId" value={r.id} />
                <select name="status" defaultValue={r.status} className="h-8 flex-1 border border-border text-xs px-2">
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="OCCUPIED">OCCUPIED</option>
                  <option value="RESERVED">RESERVED</option>
                  <option value="CLEANING">CLEANING</option>
                  <option value="DIRTY">DIRTY</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                  <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
                </select>
                <button type="submit" className="h-8 px-3 bg-brand-foreground text-brand-background text-xs">SAVE</button>
              </form>
              <div className="flex gap-2"><a href={`/admin/rooms/${r.id}`} className="h-8 flex-1 border border-border grid place-items-center text-xs hover:bg-muted">EDIT</a><a href={`/admin/rooms/${r.id}#history`} className="h-8 flex-1 bg-muted grid place-items-center text-xs hover:bg-muted/80">HISTORY</a></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
