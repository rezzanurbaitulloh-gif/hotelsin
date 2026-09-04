import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChangePasswordDialog } from '@/components/admin/change-password-dialog'
export const dynamic='force-dynamic'
export default async function UsersAdminPage(){
  const supabase=await createClient()
  const {data: {user}} = await supabase.auth.getUser()
  const {data: me} = user?.email ? await supabase.from('users').select('role').eq('email', user.email).single() : { data: null }
  const myRole = (me?.role as string) || 'GUEST'
  const {data} = await supabase.from('users').select('id,email,first_name,last_name,role,is_active,created_at').order('created_at')
  const currentEmail = user?.email
  const canManage = (targetRole: string) => {
    if (myRole === 'SUPER_ADMIN') return true
    if (targetRole === 'SUPER_ADMIN') return false
    return myRole === 'HOTEL_ADMIN'
  }
  return (<div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-light">Users</h1><p className="text-sm text-muted-foreground">{data?.length||0} staff • {myRole} • HOTEL_ADMIN can CRUD except SUPER_ADMIN • current: {currentEmail}</p></div><button className="h-9 px-4 bg-brand-foreground text-brand-background text-xs tracking-widest">+ NEW USER</button></div>
  <Card><CardHeader><CardTitle className="text-sm">All Staff — Password Management</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full text-sm"><thead className="text-xs tracking-widest text-muted-foreground uppercase border-b"><tr><th className="text-left py-3">Name</th><th className="text-left">Email</th><th className="text-left">Role</th><th className="text-left">Password</th><th className="text-right">Actions</th></tr></thead>
  <tbody>{(data||[]).map(u=> {
    const disabled = !canManage(u.role)
    const isMe = u.email===currentEmail
    return <tr key={u.id} className={"border-b last:border-0 hover:bg-muted/30 "+(isMe?'bg-brand-accent/10':'')}><td className="py-3 font-medium">{u.first_name} {u.last_name} {isMe&&<span className="text-[10px] bg-brand-accent text-white px-1 rounded">YOU</span>}</td><td className="text-xs font-mono">{u.email}</td><td><Badge variant={u.role==='SUPER_ADMIN'?'destructive': u.role==='HOTEL_ADMIN'?'default':'secondary'}>{u.role}</Badge></td><td className="text-xs font-mono">•••••••• <span className="text-[10px] text-muted-foreground">(demo: 121212)</span></td><td className="text-right flex justify-end gap-2 items-center"><ChangePasswordDialog email={u.email} role={u.role} disabled={disabled} disabledReason={disabled ? `Tidak boleh ubah ${u.role} sebagai ${myRole}` : undefined} /><button className="h-7 px-3 border border-border text-xs" disabled={disabled}>EDIT</button><button className="h-7 px-3 border border-border text-xs text-destructive" disabled={isMe || disabled}>DELETE</button></td></tr>
  })}</tbody></table></CardContent></Card>
  <Card><CardContent className="py-4 text-xs text-muted-foreground">SUPER_ADMIN full. HOTEL_ADMIN bisa CRUD semua kecuali SUPER_ADMIN (server block via canManageRole). Password hash, hanya bisa di-reset — demo semua 121212, klik Ganti Password untuk lihat/ubah (eye toggle).</CardContent></Card>
  </div>)
}
