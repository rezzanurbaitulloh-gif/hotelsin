import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
export const dynamic='force-dynamic'
export default async function NewJournalPage(){
  async function create(formData: FormData){
    'use server'
    const supabase=await createClient()
    const {data:props}=await supabase.from('properties').select('id').limit(1)
    const titleEn=formData.get('title_en') as string
    const slug=titleEn.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,40)
    await supabase.from('journal_posts').insert({
      property_id: props?.[0]?.id,
      slug,
      title: {en: titleEn, id: titleEn},
      excerpt: {en: formData.get('excerpt_en') as string || '', id: formData.get('excerpt_en') as string || ''},
      content: {en: formData.get('content_en') as string || '', id: formData.get('content_en') as string || ''},
      cover_image_url: formData.get('cover_url') as string || 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80',
      author: 'Admin',
      category: formData.get('category') as string || 'Culture',
      status: 'DRAFT'
    } as any)
    redirect('/admin/website/journal')
  }
  return (<div className="max-w-2xl mx-auto space-y-6"><Link href="/admin/website/journal" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI</Link><Card><CardHeader><CardTitle>Tulis Journal — Real DB</CardTitle></CardHeader><CardContent><form action={create} className="space-y-4"><div className="space-y-2"><Label>Judul EN *</Label><Input name="title_en" required /></div><div className="space-y-2"><Label>Excerpt EN</Label><Input name="excerpt_en" /></div><div className="space-y-2"><Label>Konten EN</Label><Input name="content_en" /></div><div className="space-y-2"><Label>Cover URL</Label><Input name="cover_url" /></div><div className="space-y-2"><Label>Category</Label><Input name="category" placeholder="Culture" /></div><Button type="submit" className="w-full bg-brand-foreground text-brand-background h-11 tracking-widest text-xs">SIMPAN SEBAGAI DRAFT</Button></form></CardContent></Card></div>)
}
