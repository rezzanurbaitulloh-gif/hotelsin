import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
export const dynamic='force-dynamic'
export default async function JournalDetail({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params
  const supabase=await createClient()
  const {data}=await supabase.from('journal_posts').select('id,title,excerpt,content,cover_image_url,category,author,published_at').eq('slug',slug).eq('status','PUBLISHED').single()
  if(!data) return notFound()
  return (<div className="container mx-auto px-6 py-12 max-w-3xl"><Link href="/journal" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI</Link><p className="text-xs tracking-[0.35em] text-brand-accent uppercase mt-8">{data.category} • {data.author}</p><h1 className="font-display text-4xl font-light mt-2">{data.title.en}</h1><p className="text-muted-foreground mt-4">{data.excerpt.en}</p><div className="aspect-[16/9] bg-muted rounded-lg overflow-hidden my-8"><img src={data.cover_image_url||'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1200&q=80'} alt={data.title.en} className="h-full w-full object-cover"/></div><div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed"><p>{data.content.en}</p></div></div>)
}
