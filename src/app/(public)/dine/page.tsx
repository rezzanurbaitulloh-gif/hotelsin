import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LocalizedText, T } from '@/components/localized'
import { getI18nFromCookies, getTranslationServer } from '@/lib/i18n/server'
export const dynamic='force-dynamic'
export default async function DinePage(){
  const supabase=await createClient()
  const { locale } = await getI18nFromCookies()
  const tr = (k: string) => getTranslationServer(locale, k)
  const { data, error } = await supabase.from('restaurants').select('id,name,description,cuisine,hours,images,is_active').eq('is_active',true).order('sort_order')
  if(error) return <div className="container mx-auto px-6 py-12 text-destructive">Error: {error.message}</div>
  if(!data?.length) return <div className="container mx-auto px-6 py-24 text-center"><p className="text-muted-foreground">{tr('common.empty_restaurant')}</p></div>
  return (<div className="container mx-auto px-6 py-12"><p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-2"><T k="nav.dine" /></p><h1 className="font-display text-4xl font-light mb-8">{tr('page.dine_title')}</h1><div className="grid md:grid-cols-2 gap-8">{data.map(r=> <Link key={r.id} href={"/dine/"+r.id} className="group border border-border rounded-lg overflow-hidden hover:shadow-lg"><div className="aspect-[16/9] bg-muted overflow-hidden"><img src={r.images?.[0]||'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'} alt={(r.name as any)?.en} className="h-full w-full object-cover group-hover:scale-105 duration-700"/></div><div className="p-6"><h3 className="font-display text-xl mb-1 group-hover:text-brand-accent"><LocalizedText value={r.name as any} /></h3><p className="text-xs tracking-widest text-muted-foreground uppercase mb-2"><LocalizedText value={r.cuisine as any} /></p><p className="text-sm text-muted-foreground line-clamp-2"><LocalizedText value={r.description as any} /></p><p className="text-xs text-muted-foreground mt-2"><LocalizedText value={r.hours as any} /></p></div></Link>)}</div></div>)
}
