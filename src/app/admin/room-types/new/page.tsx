import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function NewRoomTypePage() {
  async function createRoomType(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: props } = await supabase.from('properties').select('id').limit(1)
    const nameEn = formData.get('name_en') as string
    const nameId = formData.get('name_id') as string || nameEn
    const descEn = formData.get('desc_en') as string
    const descId = formData.get('desc_id') as string || descEn
    const shortEn = formData.get('short_en') as string
    const shortId = formData.get('short_id') as string || shortEn
    const bedEn = formData.get('bed_en') as string
    const bedId = formData.get('bed_id') as string || bedEn

    await supabase.from('room_types').insert({
      property_id: props?.[0]?.id,
      name: { en: nameEn, id: nameId },
      description: { en: descEn, id: descId },
      short_description: { en: shortEn, id: shortId },
      base_price: Number(formData.get('base_price')),
      max_occupancy: Number(formData.get('max_occupancy')),
      size_sqm: Number(formData.get('size_sqm')),
      bed_type: { en: bedEn, id: bedId },
      images: [(formData.get('image_url') as string) || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'],
      is_active: formData.get('is_active') === 'on',
      sort_order: 99,
    })
    redirect('/admin/room-types')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/admin/room-types" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI</Link>
      <Card>
        <CardHeader><CardTitle>Tambah Tipe Kamar — Real DB</CardTitle></CardHeader>
        <CardContent>
          <form action={createRoomType} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nama (EN) *</Label><Input name="name_en" placeholder="Ocean Residence" required /></div>
              <div className="space-y-2"><Label>Nama (ID)</Label><Input name="name_id" placeholder="Ocean Residence" /></div>
            </div>
            <div className="space-y-2"><Label>Deskripsi EN *</Label><Input name="desc_en" required /></div>
            <div className="space-y-2"><Label>Deskripsi ID</Label><Input name="desc_id" /></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Short EN</Label><Input name="short_en" /></div>
              <div className="space-y-2"><Label>Short ID</Label><Input name="short_id" /></div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Harga/malam *</Label><Input name="base_price" type="number" required /></div>
              <div className="space-y-2"><Label>Max Tamu</Label><Input name="max_occupancy" type="number" defaultValue={2} /></div>
              <div className="space-y-2"><Label>Ukuran m²</Label><Input name="size_sqm" type="number" /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Bed EN</Label><Input name="bed_en" placeholder="1 King Bed" /></div>
              <div className="space-y-2"><Label>Bed ID</Label><Input name="bed_id" placeholder="1 King Bed" /></div>
            </div>
            <div className="space-y-2"><Label>Image URL</Label><Input name="image_url" placeholder="https://..." /></div>
            <div className="space-y-2"><Label className="flex items-center gap-2"><input type="checkbox" name="is_active" defaultChecked /> Aktif</Label></div>
            <Button type="submit" className="w-full bg-brand-foreground text-brand-background h-11 tracking-widest text-xs">SIMPAN KE DATABASE</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
