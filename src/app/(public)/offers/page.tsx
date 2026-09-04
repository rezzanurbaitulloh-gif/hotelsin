import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
export const dynamic='force-dynamic'
export default async function OffersPage(){
  const supabase=await createClient()
  const {data}=await supabase.from('offers').select('id,name,description,discount_type,discount_value,valid_from,valid_to,is_active,image_url').eq('is_active',true).order('valid_to')
  if(!data?.length) return <div className="container mx-auto px-6 py-24 text-center text-muted-foreground">Belum ada penawaran</div>
  return (<div className="container mx-auto px-6 py-12"><p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-2">Offers</p><h1 className="font-display text-4xl font-light mb-8">Perjalanan terkurasi</h1><div className="grid md:grid-cols-2 gap-8">{data.map(o=> <Link key={o.id} href={"/offers/"+o.id} className="border border-border rounded-lg overflow-hidden hover:shadow-lg group"><div className="aspect-[16/9] bg-muted overflow-hidden"><img src={o.image_url||'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80'} alt={o.name.en} className="h-full w-full object-cover group-hover:scale-105 duration-700"/></div><div className="p-6"><h3 className="font-medium group-hover:text-brand-accent">{o.name.en}</h3><p className="text-sm text-muted-foreground line-clamp-2 mt-1">{o.description.en}</p><div className="flex items-center gap-2 mt-3"><Badge variant="secondary">{o.discount_type==='percentage'? o.discount_value+'%': '$'+o.discount_value} off</Badge><span className="text-xs text-muted-foreground">{o.valid_from} → {o.valid_to}</span></div></div></Link>)}</div></div>)
}
