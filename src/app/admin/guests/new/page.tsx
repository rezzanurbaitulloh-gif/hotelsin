import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function NewGuestPage() {
  async function createGuest(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: props } = await supabase.from('properties').select('id').limit(1)
    await supabase.from('guests').insert({
      property_id: props?.[0]?.id,
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      city: formData.get('city') as string,
      country: formData.get('country') as string,
      vip_status: formData.get('vip_status') === 'on',
    })
    redirect('/admin/guests')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/admin/guests" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI</Link>
      <Card>
        <CardHeader><CardTitle>Tambah Tamu Baru — Real DB</CardTitle></CardHeader>
        <CardContent>
          <form action={createGuest} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nama Depan *</Label><Input name="first_name" required /></div>
              <div className="space-y-2"><Label>Nama Belakang *</Label><Input name="last_name" required /></div>
            </div>
            <div className="space-y-2"><Label>Email *</Label><Input name="email" type="email" required /></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Telepon</Label><Input name="phone" /></div>
              <div className="space-y-2"><Label className="flex items-center gap-2"><input type="checkbox" name="vip_status" /> VIP</Label></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Kota</Label><Input name="city" /></div>
              <div className="space-y-2"><Label>Negara</Label><Input name="country" /></div>
            </div>
            <Button type="submit" className="w-full bg-brand-foreground text-brand-background h-11 tracking-widest text-xs">SIMPAN KE DATABASE</Button>
            <p className="text-[10px] text-muted-foreground">INSERT ke guests — refresh /admin/guests untuk lihat.</p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
