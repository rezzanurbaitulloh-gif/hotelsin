import { createClient } from '@/lib/supabase/server'
import { LocalizedText, T } from '@/components/localized'
import { getI18nFromCookies, getTranslationServer } from '@/lib/i18n/server'
export const dynamic='force-dynamic'
export default async function GalleryPage(){
  const supabase=await createClient()
  const { locale } = await getI18nFromCookies()
  const tr = (k: string) => getTranslationServer(locale, k)
  const {data}=await supabase.from('gallery_items').select('id,image_url,caption,category').eq('is_active',true).order('sort_order').limit(30)
  if(!data?.length) return <div className="container mx-auto px-6 py-24 text-center text-muted-foreground">{tr('common.empty_gallery')}</div>
  return (<div className="container mx-auto px-6 py-12"><p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-2"><T k="admin.gallery" /></p><h1 className="font-display text-4xl font-light mb-8">{tr('page.gallery_title')}</h1><div className="columns-1 md:columns-3 gap-4 space-y-4">{data.map(g=> <div key={g.id} className="break-inside-avoid overflow-hidden rounded-lg bg-muted"><img src={g.image_url} alt={(g.caption as any)?.en||g.category} className="w-full object-cover"/><div className="p-3"><p className="text-xs text-muted-foreground">{g.category} • <LocalizedText value={g.caption as any} /></p></div></div>)}</div></div>)
}
