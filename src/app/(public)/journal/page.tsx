import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LocalizedText, T } from '@/components/localized'
import { getI18nFromCookies, getTranslationServer } from '@/lib/i18n/server'
export const dynamic='force-dynamic'
export default async function JournalPage(){
  const supabase=await createClient()
  const { locale } = await getI18nFromCookies()
  const tr = (k: string) => getTranslationServer(locale, k)
  const {data}=await supabase.from('journal_posts').select('id,slug,title,excerpt,cover_image_url,category,published_at').eq('status','PUBLISHED').order('published_at',{ascending:false})
  if(!data?.length) return <div className="container mx-auto px-6 py-24 text-center text-muted-foreground">{tr('common.empty_journal')}</div>
  return (<div className="container mx-auto px-6 py-12"><p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-2"><T k="nav.journal" /></p><h1 className="font-display text-4xl font-light mb-8">{tr('page.journal_title')}</h1><div className="grid md:grid-cols-3 gap-8">{data.map(j=> <Link key={j.id} href={"/journal/"+j.slug} className="group"><div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden mb-3"><img src={j.cover_image_url||'https://images.unsplash.com/photo-1528164344705-47542687000d?w=700&q=80'} alt={(j.title as any)?.en} className="h-full w-full object-cover group-hover:scale-105 duration-700"/></div><p className="text-[10px] tracking-widest text-brand-accent uppercase">{j.category}</p><h3 className="font-medium group-hover:text-brand-accent"><LocalizedText value={j.title as any} /></h3><p className="text-xs text-muted-foreground line-clamp-2 mt-1"><LocalizedText value={j.excerpt as any} /></p></Link>)}</div></div>)
}
