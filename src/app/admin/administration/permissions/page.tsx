import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
const perms=[
  'rooms.read','rooms.create','rooms.update','rooms.delete',
  'reservations.read','reservations.create','reservations.update','reservations.cancel',
  'guests.read','guests.create','guests.update','guests.delete',
  'content.read','content.create','content.update','content.delete','content.publish',
  'users.read','users.create','users.update','users.delete',
  'revenue.read','revenue.manage','housekeeping.read','housekeeping.manage','maintenance.read','maintenance.manage','settings.read','settings.manage'
]
export default function PermissionsPage(){
  return (<div className="space-y-6"><div><h1 className="font-display text-2xl font-light">Permissions</h1><p className="text-sm text-muted-foreground">Granular • server-side enforced in middleware + lib/rbac.ts</p></div>
  <Card><CardHeader><CardTitle className="text-sm">All Permissions • {perms.length}</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2">
    {perms.map(p=> <Badge key={p} variant="outline" className="font-mono text-xs">{p}</Badge>)}
  </CardContent></Card>
  <Card><CardContent className="py-4 text-xs text-muted-foreground">Check middleware.ts + rbac.ts → hasPermission(role, perm). SUPER always true. HOTEL inherits all lower.</CardContent></Card>
  </div>)
}
