import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function GuestPage({ searchParams }: { searchParams: Promise<{ room_type?: string, check_in?: string, check_out?: string, guests?: string, nights?: string, rate?: string }> }) {
  const sp = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!sp.room_type || !sp.check_in || !sp.check_out) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <p className="text-muted-foreground">Parameter tidak lengkap — silakan pilih kamar dulu.</p>
        <Link href="/reserve/availability" className="inline-block mt-4 h-9 px-6 bg-brand-foreground text-brand-background inline-flex items-center text-xs tracking-widest">KEMBALI KE AVAILABILITY</Link>
      </div>
    )
  }

  // If not logged in, show login prompt but allow guest form (spec says AUTHENTICATION step)
  const { data: roomType } = await supabase.from('room_types').select('id,name,base_price').eq('id', sp.room_type).single()
  const { data: guest } = user?.email ? await supabase.from('guests').select('first_name,last_name,email,phone,city,country').eq('email', user.email).single() : { data: null }

  const nights = Number(sp.nights || 1)
  const rate = Number(sp.rate || roomType?.base_price || 0)
  const subtotal = rate * nights

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-2">Guest Details</p>
      <h1 className="font-display text-3xl font-light mb-2">Detail Tamu</h1>
      <p className="text-sm text-muted-foreground mb-8">Kamar: {roomType?.name?.en || 'Kamar Pilihan'} • {sp.check_in} → {sp.check_out} • {sp.guests} tamu • ${rate}/malam • Subtotal ${subtotal}</p>

      {!user && (
        <div className="mb-6 p-4 border border-amber-200 bg-amber-50 rounded-lg">
          <p className="text-sm font-medium">Belum login?</p>
          <p className="text-xs text-muted-foreground">Anda bisa lanjut sebagai tamu, atau <Link href={`/login?next=/reserve/guest?room_type=${sp.room_type}&check_in=${sp.check_in}&check_out=${sp.check_out}&guests=${sp.guests}&nights=${sp.nights}&rate=${sp.rate}`} className="text-brand-accent underline">Masuk</Link> / <Link href={`/register?next=/reserve/guest?room_type=${sp.room_type}&check_in=${sp.check_in}&check_out=${sp.check_out}&guests=${sp.guests}&nights=${sp.nights}&rate=${sp.rate}`} className="text-brand-accent underline">Daftar</Link> untuk simpan reservasi ke akun.</p>
        </div>
      )}

      <Card>
        <CardHeader><CardTitle className="text-sm">Form Tamu</CardTitle></CardHeader>
        <CardContent>
          <form action={`/reserve/review?room_type=${sp.room_type}&check_in=${sp.check_in}&check_out=${sp.check_out}&guests=${sp.guests}&nights=${sp.nights}&rate=${sp.rate}`} method="GET" className="space-y-4">
            <input type="hidden" name="room_type" value={sp.room_type} />
            <input type="hidden" name="check_in" value={sp.check_in!} />
            <input type="hidden" name="check_out" value={sp.check_out!} />
            <input type="hidden" name="guests" value={sp.guests!} />
            <input type="hidden" name="nights" value={String(nights)} />
            <input type="hidden" name="rate" value={String(rate)} />
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nama Depan *</Label><Input name="first_name" defaultValue={guest?.first_name || (user?.user_metadata as any)?.first_name || ''} required /></div>
              <div className="space-y-2"><Label>Nama Belakang *</Label><Input name="last_name" defaultValue={guest?.last_name || (user?.user_metadata as any)?.last_name || ''} required /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Email *</Label><Input name="email" type="email" defaultValue={guest?.email || user?.email || ''} required /></div>
              <div className="space-y-2"><Label>Telepon</Label><Input name="phone" defaultValue={guest?.phone || ''} /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Kota</Label><Input name="city" defaultValue={guest?.city || ''} /></div>
              <div className="space-y-2"><Label>Negara</Label><Input name="country" defaultValue={guest?.country || ''} /></div>
            </div>
            <div className="space-y-2"><Label>Permintaan Khusus</Label><Input name="special_requests" placeholder="Mis: late check-in, alergi, anniversary" /></div>
            <div className="flex gap-3 pt-4">
              <Link href={`/reserve/availability?check_in=${sp.check_in}&check_out=${sp.check_out}&guests=${sp.guests}`} className="h-10 px-6 border border-border inline-flex items-center text-xs tracking-widest">KEMBALI</Link>
              <Button type="submit" className="flex-1 bg-brand-foreground text-brand-background h-10 tracking-widest text-xs">LANJUT KE REVIEW →</Button>
            </div>
            <p className="text-[10px] text-muted-foreground">Data Anda aman dan akan digunakan untuk konfirmasi reservasi.</p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
