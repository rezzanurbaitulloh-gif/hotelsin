import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
export const dynamic='force-dynamic'
export default async function ExperiencesPage(){
  const supabase=await createClient()
  const {data}=await supabase.from('experiences').select('id,name,description,price,category,images').eq('is_active',true).order('sort_order')
  if(!data?.length) return <div className="container mx-auto px-6 py-24 text-center text-muted-foreground">Belum ada pengalaman</div>
  return (<div className="container mx-auto px-6 py-12"><p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-2">Experiences</p><h1 className="font-display text-4xl font-light mb-8">Dirancang oleh tempat</h1><div className="grid md:grid-cols-3 gap-6">{data.map(e=> <Link key={e.id} href={"/experiences/"+e.id} className="border border-border rounded-lg overflow-hidden hover:shadow-lg group"><div className="aspect-[4/3] bg-muted overflow-hidden"><img src={e.images?.[0]||'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80'} alt={e.name.en} className="h-full w-full object-cover group-hover:scale-105 duration-700"/></div><div className="p-4"><h3 className="font-medium group-hover:text-brand-accent">{e.name.en}</h3><p className="text-xs text-muted-foreground">{e.category} • ${e.price}</p><p className="text-xs text-muted-foreground line-clamp-2 mt-2">{e.description.en}</p></div></Link>)}</div></div>)
}
