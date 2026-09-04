import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
export const dynamic='force-dynamic'
export default async function NewOfferPage(){
  async function create(formData: FormData){
    'use server'
    const supabase=await createClient()
    const {data:props}=await supabase.from('properties').select('id').limit(1)
    const propId=props?.[0]?.id
    const nameEn = formData.get('name_en') as string
    const discountVal = Number(formData.get('discount_value') as string) || 10
    await supabase.from('offers').insert({
      property_id: propId,
      name: { en: nameEn || 'New Offer', id: nameEn || 'New Offer' },
      description: { en: 'Penawaran baru dari admin', id: 'Penawaran baru dari admin' },
      discount_type: 'percentage',
      discount_value: discountVal,
      valid_from: new Date().toISOString().split('T')[0],
      valid_to: new Date(Date.now()+30*86400000).toISOString().split('T')[0],
      is_active: true,
      terms: { en: 'Syarat dan ketentuan', id: 'Syarat dan ketentuan' },
    } as any)
    redirect('/admin/offers')
  }
  return (<div className="max-w-2xl mx-auto space-y-6"><Link href="/admin/offers" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI</Link><Card><CardHeader><CardTitle>Tambah Offer — Real DB</CardTitle></CardHeader><CardContent><form action={create} className="space-y-4">
    <div className="space-y-2"><Label>Nama Offer (EN) *</Label><Input name="name_en" placeholder="Romantic Escape" required /></div>
    <div className="space-y-2"><Label>Diskon %</Label><Input name="discount_value" type="number" defaultValue={10} required /></div>
    <Button type="submit" className="w-full bg-brand-foreground text-brand-background h-11 tracking-widest text-xs">SIMPAN KE DATABASE</Button>
    <p className="text-[10px] text-muted-foreground">INSERT ke offers (name JSONB, discount, valid_from/to) — real DB, bukan hardcode. Refresh /admin/offers untuk lihat.</p>
  </form></CardContent></Card></div>)
}
