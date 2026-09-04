import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
export const dynamic='force-dynamic'
export default async function NewMaintPage(){
  async function create(formData: FormData){
    'use server'
    const supabase=await createClient()
    const {data:props}=await supabase.from('properties').select('id').limit(1)
    await supabase.from('maintenance_tasks').insert({
      property_id: props?.[0]?.id,
      title: formData.get('title') as string || 'New Issue',
      description: formData.get('description') as string || '',
      priority: (formData.get('priority') as string) || 'NORMAL',
      status: 'OPEN'
    } as any)
    redirect('/admin/maintenance')
  }
  return (<div className="max-w-2xl mx-auto space-y-6"><Link href="/admin/maintenance" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI</Link><Card><CardHeader><CardTitle>Lapor Maintenance — Real DB</CardTitle></CardHeader><CardContent><form action={create} className="space-y-4"><div className="space-y-2"><Label>Judul *</Label><Input name="title" required /></div><div className="space-y-2"><Label>Deskripsi</Label><Input name="description" /></div><div className="space-y-2"><Label>Priority</Label><select name="priority" className="h-10 w-full border border-input px-3 rounded-lg"><option>NORMAL</option><option>HIGH</option><option>URGENT</option></select></div><Button type="submit" className="w-full bg-brand-foreground text-brand-background h-11 tracking-widest text-xs">SIMPAN KE DATABASE</Button></form></CardContent></Card></div>)
}
