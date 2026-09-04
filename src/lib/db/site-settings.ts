import { createClient } from '@/lib/supabase/server'
export async function getSiteSettings(key: string) {
  const supabase = await createClient()
  const { data: props } = await supabase.from('properties').select('id').limit(1)
  if (!props?.[0]) return null
  const { data } = await supabase.from('property_settings').select('value').eq('property_id', props[0].id).eq('key', key).single()
  return data?.value ?? null
}
export async function getAllSiteSettings() {
  const supabase = await createClient()
  const { data: props } = await supabase.from('properties').select('id').limit(1)
  if (!props?.[0]) return {}
  const { data } = await supabase.from('property_settings').select('key,value').eq('property_id', props[0].id)
  return Object.fromEntries((data||[]).map((d:any)=>[d.key, d.value]))
}
