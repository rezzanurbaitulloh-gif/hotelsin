import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function GuestRequestsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('guest_requests').select('id,title,priority,status,created_at,guest_id').order('created_at',{ascending:false}).limit(30)
  return (
    <div className="space-y-6"><div><h1 className="font-display text-2xl font-light">Guest Requests</h1><p className="text-sm text-muted-foreground">{data?.length||0} requests by priority</p></div>
      <Card><CardHeader><CardTitle className="text-sm">Requests</CardTitle></CardHeader><CardContent className="divide-y">
        {(data||[]).map(r=> <div key={r.id} className="flex items-center justify-between py-3"><div><p className="font-medium text-sm">{r.title}</p><p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString('id-ID')}</p></div><div className="flex items-center gap-2"><Badge variant={r.priority==='URGENT'?'destructive':'secondary'}>{r.priority}</Badge><Badge variant="outline">{r.status}</Badge></div></div>)}
        {!data?.length && <p className="py-12 text-center text-muted-foreground">No requests</p>}
      </CardContent></Card>
    </div>
  )
}
