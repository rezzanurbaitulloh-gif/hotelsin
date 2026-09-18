import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function ActivityPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('audit_logs')
    .select('id,actor_email,actor_role,action,entity,entity_id,created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-light">Activity Log</h1>
        <p className="text-sm text-muted-foreground">Jejak audit aksi staff — status reservasi, moderasi review, charge folio, user.</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm">100 aktivitas terakhir</CardTitle></CardHeader>
        <CardContent className="divide-y">
          {((data as any[]) || []).map((l: any) => (
            <div key={l.id} className="flex items-center justify-between py-2.5 text-sm">
              <div>
                <p className="font-medium">{l.action} <span className="text-muted-foreground font-normal">• {l.entity}{l.entity_id ? ` ${String(l.entity_id).slice(0, 8)}` : ''}</span></p>
                <p className="text-xs text-muted-foreground">{l.actor_email} • {l.actor_role} • {new Date(l.created_at).toLocaleString('id-ID')}</p>
              </div>
              <Badge variant="outline" className="text-[10px]">{l.actor_role}</Badge>
            </div>
          ))}
          {(!data || data.length === 0) && (
            <p className="py-12 text-center text-muted-foreground text-sm">Belum ada aktivitas tercatat. Aksi admin (ubah status, moderasi, charge, user) akan muncul di sini.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
