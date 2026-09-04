import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
export const dynamic='force-dynamic'
export default async function NewHKPage(){
  async function create(formData: FormData){
    'use server'
    const supabase=await createClient()
    const {data:props}=await supabase.from('properties').select('id').limit(1)
    const {data:rooms}=await supabase.from('rooms').select('id').limit(1)
    await supabase.from('housekeeping_tasks').insert({
      property_id: props?.[0]?.id,
      room_id: rooms?.[0]?.id,
      status: 'PENDING',
      priority: (formData.get('priority') as string) || 'NORMAL',
      notes: formData.get('notes') as string || 'New task from admin'
    } as any)
    redirect('/admin/housekeeping')
  }
  return (<div className="max-w-2xl mx-auto space-y-6"><Link href="/admin/housekeeping" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI</Link><Card><CardHeader><CardTitle>Tambah Housekeeping Task — Real DB</CardTitle></CardHeader><CardContent><form action={create} className="space-y-4"><div className="space-y-2"><Label>Catatan</Label><Input name="notes" placeholder="Bersihkan villa" required /></div><div className="space-y-2"><Label>Priority</Label><select name="priority" className="h-10 w-full border border-input px-3 rounded-lg"><option>NORMAL</option><option>HIGH</option><option>URGENT</option><option>LOW</option></select></div><Button type="submit" className="w-full bg-brand-foreground text-brand-background h-11 tracking-widest text-xs">SIMPAN KE DATABASE</Button></form></CardContent></Card></div>)
}
