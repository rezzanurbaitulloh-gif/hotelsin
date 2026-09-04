import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function UsersAdminPage(){
  const supabase=await createClient()
  const {data: {user}} = await supabase.auth.getUser()
  const {data} = await supabase.from('users').select('id,email,first_name,last_name,role,is_active,created_at').order('created_at')
  const currentEmail = user?.email
  return (<div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-light">Users</h1><p className="text-sm text-muted-foreground">{data?.length||0} staff • HOTEL_ADMIN can CRUD except SUPER_ADMIN • current: {currentEmail}</p></div><button className="h-9 px-4 bg-brand-foreground text-brand-background text-xs tracking-widest">+ NEW USER</button></div>
  <Card><CardHeader><CardTitle className="text-sm">All Staff</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full text-sm"><thead className="text-xs tracking-widest text-muted-foreground uppercase border-b"><tr><th className="text-left py-3">Name</th><th className="text-left">Email</th><th className="text-left">Role</th><th className="text-left">Active</th><th className="text-right">Actions</th></tr></thead>
  <tbody>{(data||[]).map(u=> <tr key={u.id} className={"border-b last:border-0 hover:bg-muted/30 "+(u.email===currentEmail?'bg-brand-accent/10':'')}><td className="py-3 font-medium">{u.first_name} {u.last_name} {u.email===currentEmail&&<span className="text-[10px] bg-brand-accent text-white px-1 rounded">YOU</span>}</td><td className="text-xs font-mono">{u.email}</td><td><Badge variant={u.role==='SUPER_ADMIN'?'destructive': u.role==='HOTEL_ADMIN'?'default':'secondary'}>{u.role}</Badge></td><td><Badge variant={u.is_active?'secondary':'outline'}>{u.is_active?'Active':'Inactive'}</Badge></td><td className="text-right flex justify-end gap-2"><button className="h-7 px-3 border border-border text-xs">EDIT</button><button className="h-7 px-3 border border-border text-xs text-destructive" disabled={u.email===currentEmail}>DELETE</button></td></tr>)}</tbody></table></CardContent></Card>
  <Card><CardContent className="py-4 text-xs text-muted-foreground">Rule: SUPER_ADMIN can manage all. HOTEL_ADMIN can manage all except SUPER_ADMIN (server will block). Password demo for all: 121212.</CardContent></Card>
  </div>)
}
