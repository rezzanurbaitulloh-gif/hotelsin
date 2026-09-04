import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
export const dynamic='force-dynamic'
export default async function NewDiningPage(){
  async function create(formData: FormData){
    'use server'
    const supabase=await createClient()
    const {data:props}=await supabase.from('properties').select('id').limit(1)
    const nameEn=formData.get('name_en') as string
    await supabase.from('restaurants').insert({
      property_id: props?.[0]?.id,
      name: {en: nameEn || 'New Restaurant', id: nameEn || 'New Restaurant'},
      description: {en: 'Deskripsi restoran baru', id: 'Deskripsi restoran baru'},
      cuisine: {en: 'Contemporary', id: 'Kontemporer'},
      atmosphere: {en: 'Cozy', id: 'Nyaman'},
      hours: {en: '18:00-22:00', id: '18:00-22:00'},
      images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'],
      is_active: true,
      sort_order: 99
    } as any)
    redirect('/admin/dining')
  }
  return (<div className="max-w-2xl mx-auto space-y-6"><Link href="/admin/dining" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI</Link><Card><CardHeader><CardTitle>Tambah Restaurant — Real DB</CardTitle></CardHeader><CardContent><form action={create} className="space-y-4"><div className="space-y-2"><Label>Nama Restaurant (EN) *</Label><Input name="name_en" placeholder="Sayan Terrace" required /></div><Button type="submit" className="w-full bg-brand-foreground text-brand-background h-11 tracking-widest text-xs">SIMPAN KE DATABASE</Button><p className="text-[10px] text-muted-foreground">INSERT ke restaurants — real DB.</p></form></CardContent></Card></div>)
}
