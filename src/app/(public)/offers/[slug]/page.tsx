import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function OfferDetail({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params
  const supabase=await createClient()
  const {data}=await supabase.from('offers').select('id,name,description,discount_type,discount_value,valid_from,valid_to,terms,image_url').eq('id',slug).single()
  if(!data) return notFound()
  return (<div className="container mx-auto px-6 py-12"><Link href="/offers" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI</Link><div className="grid lg:grid-cols-2 gap-12 mt-8"><div className="aspect-[16/9] bg-muted rounded-lg overflow-hidden"><img src={data.image_url||'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80'} alt={data.name.en} className="h-full w-full object-cover"/></div><div><h1 className="font-display text-4xl font-light">{data.name.en}</h1><p className="text-muted-foreground mt-4">{data.description.en}</p><div className="mt-6 flex items-center gap-2"><Badge>{data.discount_type==='percentage'? data.discount_value+'%': '$'+data.discount_value} off</Badge><span className="text-xs text-muted-foreground">{data.valid_from} → {data.valid_to}</span></div><p className="text-xs text-muted-foreground mt-6">Syarat: {data.terms?.en || '-'}</p></div></div></div>)
}
