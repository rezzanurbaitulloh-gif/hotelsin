import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function EditRoomTypePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: rt } = await supabase.from('room_types').select('id,name,description,short_description,base_price,max_occupancy,size_sqm,bed_type,images,is_active').eq('id', id).single()
  if (!rt) return notFound()

  async function updateRoomType(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const imageUrl = formData.get('image_url') as string
    await supabase.from('room_types').update({
      name: { en: formData.get('name_en') as string, id: (formData.get('name_id') as string) || (formData.get('name_en') as string) },
      description: { en: formData.get('desc_en') as string, id: (formData.get('desc_id') as string) || (formData.get('desc_en') as string) },
      short_description: { en: formData.get('short_en') as string, id: (formData.get('short_id') as string) || (formData.get('short_en') as string) },
      base_price: Number(formData.get('base_price')),
      max_occupancy: Number(formData.get('max_occupancy')),
      size_sqm: Number(formData.get('size_sqm')),
      bed_type: { en: formData.get('bed_en') as string, id: (formData.get('bed_id') as string) || (formData.get('bed_en') as string) },
      images: [imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'],
      is_active: formData.get('is_active') === 'on',
    }).eq('id', id)
    redirect('/admin/room-types')
  }

  async function deleteRoomType() {
    'use server'
    const supabase = await createClient()
    await supabase.from('room_types').delete().eq('id', id)
    redirect('/admin/room-types')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/admin/room-types" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI</Link>
      <Card>
        <CardHeader><CardTitle>Edit Tipe Kamar — {rt.name.en}</CardTitle></CardHeader>
        <CardContent>
          <form action={updateRoomType} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nama EN</Label><Input name="name_en" defaultValue={rt.name.en} required /></div>
              <div className="space-y-2"><Label>Nama ID</Label><Input name="name_id" defaultValue={rt.name.id} /></div>
            </div>
            <div className="space-y-2"><Label>Deskripsi EN</Label><Input name="desc_en" defaultValue={rt.description.en} required /></div>
            <div className="space-y-2"><Label>Deskripsi ID</Label><Input name="desc_id" defaultValue={rt.description.id} /></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Short EN</Label><Input name="short_en" defaultValue={rt.short_description?.en || ''} /></div>
              <div className="space-y-2"><Label>Short ID</Label><Input name="short_id" defaultValue={rt.short_description?.id || ''} /></div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Harga</Label><Input name="base_price" type="number" defaultValue={rt.base_price} required /></div>
              <div className="space-y-2"><Label>Max Tamu</Label><Input name="max_occupancy" type="number" defaultValue={rt.max_occupancy} /></div>
              <div className="space-y-2"><Label>Size m²</Label><Input name="size_sqm" type="number" defaultValue={rt.size_sqm} /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Bed EN</Label><Input name="bed_en" defaultValue={rt.bed_type.en} /></div>
              <div className="space-y-2"><Label>Bed ID</Label><Input name="bed_id" defaultValue={rt.bed_type.id} /></div>
            </div>
            <div className="space-y-2"><Label>Image URL</Label><Input name="image_url" defaultValue={rt.images?.[0] || ''} /></div>
            <div className="space-y-2"><Label className="flex items-center gap-2"><input type="checkbox" name="is_active" defaultChecked={rt.is_active} /> Aktif</Label></div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-brand-foreground text-brand-background h-11 tracking-widest text-xs">SIMPAN PERUBAHAN</Button>
              <Link href="/admin/room-types" className="h-11 px-6 border border-border grid place-items-center text-xs tracking-widest">BATAL</Link>
            </div>
          </form>
          <form action={deleteRoomType} className="mt-6 border-t border-border pt-4">
            <Button variant="destructive" className="w-full h-10 text-xs tracking-widest">HAPUS TIPE KAMAR</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
