import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function GuestsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('guests').select('id,first_name,last_name,email,city,country,vip_status,created_at').order('created_at',{ascending:false}).limit(50)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-light">Guests</h1><p className="text-sm text-muted-foreground">{data?.length||0} guests • VIP highlighted • klik EDIT untuk update (persist)</p></div><a href="/admin/guests/new" className="h-9 px-4 bg-brand-foreground text-brand-background inline-flex items-center text-xs tracking-widest hover:bg-brand-foreground/90">+ NEW GUEST</a></div>
      <Card><CardHeader><CardTitle className="text-sm">Guest Directory</CardTitle></CardHeader><CardContent className="overflow-x-auto">
        <table className="w-full text-sm"><thead className="text-xs tracking-widest text-muted-foreground uppercase border-b"><tr><th className="text-left py-3">Name</th><th className="text-left">Email</th><th className="text-left">Location</th><th className="text-left">VIP</th><th className="text-center">Actions</th></tr></thead>
        <tbody>{(data||[]).map(g=> <tr key={g.id} className="border-b last:border-0 hover:bg-muted/30"><td className="py-3 font-medium">{g.first_name} {g.last_name}</td><td className="text-muted-foreground">{g.email}</td><td>{g.city}, {g.country}</td><td>{g.vip_status? <Badge className="bg-brand-accent text-white">VIP</Badge>: <span className="text-muted-foreground">—</span>}</td><td className="text-center"><a href={`/admin/guests/${g.id}`} className="h-7 px-3 border border-border inline-flex items-center text-xs hover:bg-muted">EDIT</a></td></tr>)}
        </tbody></table>
      </CardContent></Card>
    </div>
  )
}
