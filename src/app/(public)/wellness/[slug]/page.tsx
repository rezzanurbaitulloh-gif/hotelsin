import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
export const dynamic='force-dynamic'
export default async function WellnessDetail({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params
  const supabase=await createClient()
  const {data}=await supabase.from('spa_services').select('id,name,description,price,duration_minutes,category,images').eq('id',slug).single()
  if(!data) return notFound()
  return (<div className="container mx-auto px-6 py-12"><Link href="/wellness" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI</Link><div className="grid lg:grid-cols-2 gap-12 mt-8"><div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden"><img src={data.images?.[0]||'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80'} alt={data.name.en} className="h-full w-full object-cover"/></div><div><p className="text-xs tracking-[0.35em] text-brand-accent uppercase">{data.category}</p><h1 className="font-display text-4xl font-light mt-2">{data.name.en}</h1><p className="text-sm text-muted-foreground mt-2">{data.duration_minutes} menit • ${data.price}</p><p className="text-muted-foreground leading-relaxed mt-6">{data.description.en}</p></div></div></div>)
}
