import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function JournalCMSPage(){
  const supabase=await createClient()
  const {data}=await supabase.from('journal_posts').select('id,slug,title,status,category,published_at').order('created_at',{ascending:false}).limit(20)
  return (<div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-light">Journal CMS</h1><p className="text-sm text-muted-foreground">{data?.length||0} posts • DRAFT/PUBLISHED/ARCHIVED</p></div><a href="/admin/website/journal/new" className="h-9 px-4 bg-brand-foreground text-brand-background inline-flex items-center text-xs tracking-widest hover:bg-brand-foreground/90">+ NEW POST</a></div>
  <Card><CardHeader><CardTitle className="text-sm">All Posts</CardTitle></CardHeader><CardContent className="divide-y">
    {(data||[]).map(p=> <div key={p.id} className="flex items-center justify-between py-3"><div><p className="font-medium text-sm">{p.title.en}</p><p className="text-xs text-muted-foreground">/{p.slug} • {p.category} • {p.published_at? new Date(p.published_at).toLocaleDateString('id-ID'):'—'}</p></div><Badge variant={p.status==='PUBLISHED'?'secondary': p.status==='DRAFT'?'outline':'destructive'}>{p.status}</Badge></div>)}
  </CardContent></Card>
  </div>)
}
