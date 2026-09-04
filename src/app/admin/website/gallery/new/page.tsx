import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
export const dynamic='force-dynamic'
export default async function NewGalleryPage(){
  async function create(formData: FormData){
    'use server'
    const supabase=await createClient()
    const {data:props}=await supabase.from('properties').select('id').limit(1)
    await supabase.from('gallery_items').insert({
      property_id: props?.[0]?.id,
      image_url: formData.get('image_url') as string || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
      alt_text: {en: formData.get('alt_en') as string || 'Gallery', id: formData.get('alt_en') as string || 'Galeri'},
      caption: {en: formData.get('caption_en') as string || '', id: formData.get('caption_en') as string || ''},
      category: formData.get('category') as string || 'general',
      sort_order: 99,
      is_active: true
    } as any)
    redirect('/admin/website/gallery')
  }
  return (<div className="max-w-2xl mx-auto space-y-6"><Link href="/admin/website/gallery" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI</Link><Card><CardHeader><CardTitle>Upload Gallery — Real DB + Storage</CardTitle></CardHeader><CardContent><form action={create} className="space-y-4"><div className="space-y-2"><Label>Image URL *</Label><Input name="image_url" placeholder="https://..." required /></div><div className="space-y-2"><Label>Alt Text EN</Label><Input name="alt_en" /></div><div className="space-y-2"><Label>Caption EN</Label><Input name="caption_en" /></div><div className="space-y-2"><Label>Category</Label><Input name="category" placeholder="architecture" /></div><Button type="submit" className="w-full bg-brand-foreground text-brand-background h-11 tracking-widest text-xs">SIMPAN KE DATABASE</Button></form></CardContent></Card></div>)
}
