import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LocalizedText } from '@/components/localized'
import { Price } from '@/components/price'
export const dynamic='force-dynamic'
export default async function ExperienceDetail({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params
  const supabase=await createClient()
  const {data}=await supabase.from('experiences').select('id,name,description,duration,price,category,images').eq('id',slug).single()
  if(!data) return notFound()
  return (<div className="container mx-auto px-6 py-12"><Link href="/experiences" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI</Link><div className="grid lg:grid-cols-2 gap-12 mt-8"><div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden"><img src={data.images?.[0]||'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80'} alt={(data.name as any)?.en} className="h-full w-full object-cover"/></div><div><p className="text-xs tracking-[0.35em] text-brand-accent uppercase">{data.category}</p><h1 className="font-display text-4xl font-light mt-2"><LocalizedText value={data.name as any} /></h1><p className="text-sm text-muted-foreground mt-2"><LocalizedText value={data.duration as any} /> • <Price amount={data.price} /></p><p className="text-muted-foreground leading-relaxed mt-6"><LocalizedText value={data.description as any} /></p></div></div></div>)
}
