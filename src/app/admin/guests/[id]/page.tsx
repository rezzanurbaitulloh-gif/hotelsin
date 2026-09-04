import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function EditGuestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: guest } = await supabase.from('guests').select('id,first_name,last_name,email,phone,city,country,vip_status').eq('id', id).single()
  if (!guest) return notFound()

  async function updateGuest(formData: FormData) {
    'use server'
    const supabase = await createClient()
    await supabase.from('guests').update({
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      city: formData.get('city') as string,
      country: formData.get('country') as string,
      vip_status: formData.get('vip_status') === 'on',
    }).eq('id', id)
    redirect('/admin/guests')
  }

  async function deleteGuest() {
    'use server'
    const supabase = await createClient()
    await supabase.from('guests').delete().eq('id', id)
    redirect('/admin/guests')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/admin/guests" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI</Link>
      <Card>
        <CardHeader><CardTitle>Edit Tamu — {guest.email}</CardTitle></CardHeader>
        <CardContent>
          <form action={updateGuest} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nama Depan</Label><Input name="first_name" defaultValue={guest.first_name} required /></div>
              <div className="space-y-2"><Label>Nama Belakang</Label><Input name="last_name" defaultValue={guest.last_name} required /></div>
            </div>
            <div className="space-y-2"><Label>Email</Label><Input name="email" type="email" defaultValue={guest.email} required /></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Telepon</Label><Input name="phone" defaultValue={guest.phone || ''} /></div>
              <div className="space-y-2"><Label className="flex items-center gap-2"><input type="checkbox" name="vip_status" defaultChecked={guest.vip_status} /> VIP</Label></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Kota</Label><Input name="city" defaultValue={guest.city || ''} /></div>
              <div className="space-y-2"><Label>Negara</Label><Input name="country" defaultValue={guest.country || ''} /></div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-brand-foreground text-brand-background h-11 tracking-widest text-xs">SIMPAN PERUBAHAN</Button>
              <Link href="/admin/guests" className="h-11 px-6 border border-border grid place-items-center text-xs tracking-widest">BATAL</Link>
            </div>
          </form>
          <form action={deleteGuest} className="mt-6 border-t border-border pt-4">
            <Button variant="destructive" className="w-full h-10 text-xs tracking-widest">HAPUS TAMU</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
