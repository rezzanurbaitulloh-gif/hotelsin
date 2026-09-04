import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default function LocalizationPage(){
  const keys = ['nav.stay','hero.headline','rooms.from','booking.guest_details','admin.dashboard','common.save']
  return (<div className="space-y-6"><div><h1 className="font-display text-2xl font-light">Localization</h1><p className="text-sm text-muted-foreground">English ↔ Indonesian • default id • affects navigation/hero/rooms/offers/journal/forms</p></div>
  <Card><CardHeader><CardTitle className="text-sm">Translation Coverage</CardTitle></CardHeader><CardContent className="divide-y">
    {keys.map(k=> <div key={k} className="grid grid-cols-3 gap-4 py-3 text-sm"><span className="font-mono text-xs">{k}</span><span>EN value…</span><span>ID value…</span></div>)}
  </CardContent></Card>
  <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">Admin can edit both en/id for room_types.name, restaurants.name, offers.name, journal.title etc. Switch language in public header to verify.</CardContent></Card>
  </div>)
}
