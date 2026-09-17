import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LocalizedText, T } from '@/components/localized'
import { Price } from '@/components/price'
import { getI18nFromCookies, getTranslationServer } from '@/lib/i18n/server'
export const dynamic='force-dynamic'
export default async function WellnessPage(){
  const supabase=await createClient()
  const { locale } = await getI18nFromCookies()
  const tr = (k: string) => getTranslationServer(locale, k)
  const {data}=await supabase.from('spa_services').select('id,name,description,price,duration_minutes,category,images').eq('is_active',true).order('sort_order').limit(12)
  if(!data?.length) return <div className="container mx-auto px-6 py-24 text-center text-muted-foreground">{tr('common.empty_spa')}</div>
  return (<div className="container mx-auto px-6 py-12"><p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-2"><T k="nav.wellness" /></p><h1 className="font-display text-4xl font-light mb-8">{tr('page.wellness_title')}</h1><div className="grid md:grid-cols-3 gap-6">{data.map(s=> <Link key={s.id} href={"/wellness/"+s.id} className="border border-border rounded-lg overflow-hidden hover:shadow-lg group"><div className="aspect-[4/3] bg-muted overflow-hidden"><img src={s.images?.[0]||'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80'} alt={(s.name as any)?.en} className="h-full w-full object-cover group-hover:scale-105 duration-700"/></div><div className="p-4"><h3 className="font-medium group-hover:text-brand-accent"><LocalizedText value={s.name as any} /></h3><p className="text-xs text-muted-foreground">{s.category} • {s.duration_minutes} {tr('common.minutes')} • <Price amount={s.price} /></p><p className="text-xs text-muted-foreground line-clamp-2 mt-2"><LocalizedText value={s.description as any} /></p></div></Link>)}</div></div>)
}
