import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function SettingsPage(){
  const supabase=await createClient()
  const {data: settings}=await supabase.from('property_settings').select('key,value').limit(20)
  const {data: props}=await supabase.from('properties').select('id,name,phone,email').limit(1)
  return (<div className="space-y-6"><div><h1 className="font-display text-2xl font-light">Settings</h1><p className="text-sm text-muted-foreground">Property + system settings • social/maps/wa/theme stored in site_settings / property_settings</p></div>
  <div className="grid gap-4 md:grid-cols-2">
    <Card><CardHeader><CardTitle className="text-sm">Property</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">
      <div className="flex justify-between"><span>Name</span><span className="font-medium">{props?.[0]?.name.en}</span></div>
      <div className="flex justify-between"><span>Phone</span><span className="font-mono text-xs">{props?.[0]?.phone}</span></div>
      <div className="flex justify-between"><span>Email</span><span className="text-xs">{props?.[0]?.email}</span></div>
      <Badge variant="secondary">Editable via CMS</Badge>
    </CardContent></Card>
    <Card><CardHeader><CardTitle className="text-sm">Site Settings Keys • {settings?.length||0}</CardTitle></CardHeader><CardContent className="divide-y text-sm">
      {(settings||[]).map(s=> <div key={s.key} className="flex justify-between py-2"><span className="font-mono text-xs">{s.key}</span><Badge variant="outline" className="text-[10px]">JSON</Badge></div>)}
      {!settings?.length && <p className="py-8 text-center text-muted-foreground">No property_settings yet — site_settings for social/maps/wa use separate table (will appear after seed 005).</p>}
    </CardContent></Card>
  </div>
  <Card><CardHeader><CardTitle className="text-sm">Editable Targets (Admin-only)</CardTitle></CardHeader><CardContent className="grid gap-2 md:grid-cols-3 text-sm">
    <div className="border border-border rounded-lg p-3"><p className="font-medium">Social Links</p><p className="text-xs text-muted-foreground">18 platforms, drag order, toggle</p><Badge className="mt-2" variant="secondary">3 roles can edit</Badge></div>
    <div className="border border-border rounded-lg p-3"><p className="font-medium">Floating WA</p><p className="text-xs text-muted-foreground">phone, message, side, position</p><Badge className="mt-2" variant="secondary">SUPER/HOTEL/CONTENT</Badge></div>
    <div className="border border-border rounded-lg p-3"><p className="font-medium">Live Maps</p><p className="text-xs text-muted-foreground">lat/lng/zoom, Leaflet OSM</p><Badge className="mt-2" variant="outline">Admin</Badge></div>
  </CardContent></Card>
  </div>)
}
