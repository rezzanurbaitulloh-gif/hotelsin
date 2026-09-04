import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
const roles=[
  {role:'SUPER_ADMIN', desc:'Full access tanpa kecuali', count:1, perms:'*'},
  {role:'HOTEL_ADMIN', desc:'Warisi semua role bawah, kelola users kecuali SUPER_ADMIN', count:1, perms:'rooms, reservations, housekeeping, revenue, content, users(!super)'},
  {role:'FRONT_DESK', desc:'Reservations, guests, arrivals/departures', count:1, perms:'reservations, guests'},
  {role:'HOUSEKEEPING', desc:'Rooms status + housekeeping kanban', count:1, perms:'housekeeping'},
  {role:'REVENUE_MANAGER', desc:'Rates, offers, transactions, reports', count:1, perms:'revenue'},
  {role:'CONTENT_MANAGER', desc:'Website CMS + floating WA phone', count:1, perms:'content, wa.phone'},
]
export default function RolesPage(){
  return (<div className="space-y-6"><div><h1 className="font-display text-2xl font-light">Roles</h1><p className="text-sm text-muted-foreground">6 roles • hierarchy SUPER {' > '} HOTEL {' > '} others • inheritance active</p></div>
  <div className="grid gap-4 md:grid-cols-2">{roles.map(r=> <Card key={r.role}><CardHeader><CardTitle className="flex items-center justify-between"><span className="text-sm">{r.role}</span><Badge>{r.count} user</Badge></CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><p className="text-muted-foreground">{r.desc}</p><p className="text-xs font-mono bg-muted p-2 rounded">{r.perms}</p></CardContent></Card>)}</div>
  </div>)
}
