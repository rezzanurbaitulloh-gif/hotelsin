import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
export const dynamic='force-dynamic'
export default async function NewUserPage(){
  async function create(formData: FormData){
    'use server'
    const email=formData.get('email') as string
    const password=formData.get('password') as string || '121212'
    const first_name=formData.get('first_name') as string
    const last_name=formData.get('last_name') as string
    const role=formData.get('role') as string
    const supabase=await createClient()
    const {data:props}=await supabase.from('properties').select('id').limit(1)
    const service=createServiceClient()
    const { error: authErr } = await service.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { role } })
    if(authErr) throw new Error(authErr.message)
    await supabase.from('users').insert({ property_id: props?.[0]?.id, email, first_name, last_name, role, is_active: true } as any)
    redirect('/admin/administration/users')
  }
  return (<div className="max-w-2xl mx-auto space-y-6"><Link href="/admin/administration/users" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI</Link><Card><CardHeader><CardTitle>Tambah User — Real DB + Auth</CardTitle></CardHeader><CardContent><form action={create} className="space-y-4"><div className="grid md:grid-cols-2 gap-4"><div className="space-y-2"><Label>Nama Depan</Label><Input name="first_name" required /></div><div className="space-y-2"><Label>Nama Belakang</Label><Input name="last_name" required /></div></div><div className="space-y-2"><Label>Email *</Label><Input name="email" type="email" required /></div><div className="space-y-2"><Label>Password (min 6)</Label><Input name="password" type="password" defaultValue="121212" required /></div><div className="space-y-2"><Label>Role</Label><select name="role" className="h-10 w-full border border-input px-3 rounded-lg"><option>SUPER_ADMIN</option><option>HOTEL_ADMIN</option><option>FRONT_DESK</option><option>HOUSEKEEPING</option><option>REVENUE_MANAGER</option><option>CONTENT_MANAGER</option></select></div><Button type="submit" className="w-full bg-brand-foreground text-brand-background h-11 tracking-widest text-xs">BUAT AKUN</Button><p className="text-[10px] text-muted-foreground">Akan buat auth.users + public.users — real DB.</p></form></CardContent></Card></div>)
}
