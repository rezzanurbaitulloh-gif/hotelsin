import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
export const dynamic='force-dynamic'
export default async function NewAmenityPage(){
  async function create(formData: FormData){
    'use server'
    const supabase=await createClient()
    await supabase.from('amenities').insert({
      name: {en: formData.get('name_en') as string, id: formData.get('name_en') as string},
      icon: formData.get('icon') as string || 'star',
      category: formData.get('category') as string || 'general'
    })
    redirect('/admin/amenities')
  }
  return (<div className="max-w-2xl mx-auto space-y-6"><Link href="/admin/amenities" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI</Link><Card><CardHeader><CardTitle>Tambah Amenity — Real DB</CardTitle></CardHeader><CardContent><form action={create} className="space-y-4"><div className="space-y-2"><Label>Nama (EN) *</Label><Input name="name_en" required /></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Icon</Label><Input name="icon" placeholder="star" /></div><div className="space-y-2"><Label>Category</Label><Input name="category" placeholder="general" /></div></div><Button type="submit" className="w-full bg-brand-foreground text-brand-background h-11 tracking-widest text-xs">SIMPAN KE DATABASE</Button></form></CardContent></Card></div>)
}
