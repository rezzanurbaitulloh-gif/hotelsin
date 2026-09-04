import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
export const dynamic='force-dynamic'
export default async function NewRatePage(){
  async function create(formData: FormData){
    'use server'
    const supabase=await createClient()
    const {data:props}=await supabase.from('properties').select('id').limit(1)
    const {data:types}=await supabase.from('room_types').select('id').limit(1)
    await supabase.from('rate_plans').insert({
      property_id: props?.[0]?.id,
      room_type_id: types?.[0]?.id,
      name: {en: formData.get('name_en') as string, id: formData.get('name_en') as string},
      description: {en: 'Rate plan baru', id: 'Rate plan baru'},
      base_price: Number(formData.get('price') as string) || 100,
      cancellation_policy: {en: 'Flexible', id: 'Fleksibel'},
      is_active: true
    } as any)
    redirect('/admin/rates')
  }
  return (<div className="max-w-2xl mx-auto space-y-6"><Link href="/admin/rates" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI</Link><Card><CardHeader><CardTitle>Tambah Rate Plan — Real DB</CardTitle></CardHeader><CardContent><form action={create} className="space-y-4"><div className="space-y-2"><Label>Nama Rate (EN) *</Label><Input name="name_en" required /></div><div className="space-y-2"><Label>Harga USD</Label><Input name="price" type="number" defaultValue={100} /></div><Button type="submit" className="w-full bg-brand-foreground text-brand-background h-11 tracking-widest text-xs">SIMPAN KE DATABASE</Button></form></CardContent></Card></div>)
}
