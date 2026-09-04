import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
const nav = [
  {label:'STAY', href:'/stay', order:1, visible:true},
  {label:'DINE', href:'/dine', order:2, visible:true},
  {label:'WELLNESS', href:'/wellness', order:3, visible:true},
  {label:'EXPERIENCES', href:'/experiences', order:4, visible:true},
  {label:'PROPERTY', href:'/property', order:5, visible:true},
  {label:'OFFERS', href:'/offers', order:6, visible:true},
  {label:'JOURNAL', href:'/journal', order:7, visible:true},
]
export default function NavigationCMSPage(){
  return (<div className="space-y-6"><div><h1 className="font-display text-2xl font-light">Navigation CMS</h1><p className="text-sm text-muted-foreground">Labels, ordering, visibility • {nav.length} items • stored in site_settings key navigation</p></div>
  <Card><CardHeader><CardTitle className="text-sm">Public Navigation</CardTitle></CardHeader><CardContent className="divide-y">
    {nav.map(n=> <div key={n.href} className="flex items-center justify-between py-3"><div className="flex items-center gap-3"><span className="text-xs font-mono bg-muted px-2 py-1 rounded">#{n.order}</span><span className="font-medium text-sm">{n.label}</span><span className="text-xs text-muted-foreground">{n.href}</span></div><Badge variant={n.visible?'secondary':'outline'}>{n.visible?'Visible':'Hidden'}</Badge></div>)}
  </CardContent></Card>
  <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">Drag to reorder (coming) • toggle visibility persists to DB (site_settings). Refresh public header to verify.</CardContent></Card>
  </div>)
}
