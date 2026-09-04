import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
export const dynamic='force-dynamic'
export default async function NewExpPage(){
  async function create(formData: FormData){
    'use server'
    const supabase=await createClient()
    const {data:props}=await supabase.from('properties').select('id').limit(1)
    const nameEn=formData.get('name_en') as string
    await supabase.from('experiences').insert({
      property_id: props?.[0]?.id,
      name: {en: nameEn || 'New Experience', id: nameEn || 'New Experience'},
      description: {en: 'Deskripsi pengalaman baru', id: 'Deskripsi pengalaman baru'},
      duration: {en: '3 hours', id: '3 jam'},
      price: Number(formData.get('price') as string) || 100,
      category: 'Culture',
      images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80'],
      is_active: true,
      sort_order: 99
    } as any)
    redirect('/admin/experiences')
  }
  return (<div className="max-w-2xl mx-auto space-y-6"><Link href="/admin/experiences" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI</Link><Card><CardHeader><CardTitle>Tambah Experience — Real DB</CardTitle></CardHeader><CardContent><form action={create} className="space-y-4"><div className="space-y-2"><Label>Nama Experience (EN) *</Label><Input name="name_en" required /></div><div className="space-y-2"><Label>Harga USD</Label><Input name="price" type="number" defaultValue={100} /></div><Button type="submit" className="w-full bg-brand-foreground text-brand-background h-11 tracking-widest text-xs">SIMPAN KE DATABASE</Button></form></CardContent></Card></div>)
}
