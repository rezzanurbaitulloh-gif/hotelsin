import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function PagesCMSPage(){
  const supabase=await createClient()
  const {data}=await supabase.from('page_sections').select('id,page_id,section_key,is_active').order('page_id').limit(30)
  const grouped: Record<string, any[]> = (data||[]).reduce((acc:any,s:any)=>{ (acc[s.page_id]=acc[s.page_id]||[]).push(s); return acc;},{} as any)
  return (<div className="space-y-6"><div><h1 className="font-display text-2xl font-light">Pages CMS</h1><p className="text-sm text-muted-foreground">{data?.length||0} sections across {Object.keys(grouped).length} pages</p></div>
  {Object.entries(grouped).map(([page, secs])=> <Card key={page}><CardHeader><CardTitle className="text-sm capitalize">{page} • {(secs as any[]).length} sections</CardTitle></CardHeader><CardContent className="divide-y">{(secs as any[]).map((s:any)=> <div key={s.id} className="flex justify-between py-2 text-sm"><span className="font-mono text-xs">{s.section_key}</span><Badge variant={s.is_active?'secondary':'outline'}>{s.is_active?'Active':'Hidden'}</Badge></div>)}</CardContent></Card>)}
  {!data?.length && <Card><CardContent className="py-12 text-center text-muted-foreground">No page sections</CardContent></Card>}
  </div>)
}
