import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
export const dynamic='force-dynamic'
export default async function NewWellnessPage(){
  async function create(formData: FormData){
    'use server'
    const supabase=await createClient()
    const {data:props}=await supabase.from('properties').select('id').limit(1)
    const nameEn=formData.get('name_en') as string
    await supabase.from('spa_services').insert({
      property_id: props?.[0]?.id,
      name: {en: nameEn || 'New Spa', id: nameEn || 'New Spa'},
      description: {en: 'Deskripsi spa baru', id: 'Deskripsi spa baru'},
      duration_minutes: Number(formData.get('duration') as string) || 60,
      price: Number(formData.get('price') as string) || 100,
      category: 'Wellness',
      images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80'],
      is_active: true,
      sort_order: 99
    } as any)
    redirect('/admin/wellness')
  }
  return (<div className="max-w-2xl mx-auto space-y-6"><Link href="/admin/wellness" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI</Link><Card><CardHeader><CardTitle>Tambah Spa Service — Real DB</CardTitle></CardHeader><CardContent><form action={create} className="space-y-4"><div className="space-y-2"><Label>Nama Service (EN) *</Label><Input name="name_en" required /></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Durasi menit</Label><Input name="duration" type="number" defaultValue={60} /></div><div className="space-y-2"><Label>Harga USD</Label><Input name="price" type="number" defaultValue={100} /></div></div><Button type="submit" className="w-full bg-brand-foreground text-brand-background h-11 tracking-widest text-xs">SIMPAN KE DATABASE</Button></form></CardContent></Card></div>)
}
