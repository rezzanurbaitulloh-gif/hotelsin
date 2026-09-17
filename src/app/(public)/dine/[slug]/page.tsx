import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LocalizedText } from '@/components/localized'
export const dynamic='force-dynamic'
export default async function DineDetail({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params
  const supabase=await createClient()
  const {data}=await supabase.from('restaurants').select('id,name,description,cuisine,atmosphere,hours,images').eq('id',slug).single()
  if(!data) return notFound()
  return (<div className="container mx-auto px-6 py-12"><Link href="/dine" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI</Link><div className="grid lg:grid-cols-2 gap-12 mt-8"><div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden"><img src={data.images?.[0]||'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'} alt={(data.name as any)?.en} className="h-full w-full object-cover"/></div><div><p className="text-xs tracking-[0.35em] text-brand-accent uppercase"><LocalizedText value={data.cuisine as any} /></p><h1 className="font-display text-4xl font-light mt-2"><LocalizedText value={data.name as any} /></h1><p className="text-sm text-muted-foreground mt-2"><LocalizedText value={data.atmosphere as any} /></p><p className="text-muted-foreground leading-relaxed mt-6"><LocalizedText value={data.description as any} /></p><p className="text-sm mt-6"><span className="font-medium">Jam:</span> <LocalizedText value={data.hours as any} /></p></div></div></div>)
}
