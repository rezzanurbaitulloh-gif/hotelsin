import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function NewRoomPage() {
  const supabase = await createClient()
  const { data: types } = await supabase.from('room_types').select('id,name').eq('is_active', true).order('sort_order')
  const { data: props } = await supabase.from('properties').select('id').limit(1)
  const propId = props?.[0]?.id

  async function createRoom(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const room_number = formData.get('room_number') as string
    const room_type_id = formData.get('room_type_id') as string
    const floor = Number(formData.get('floor'))
    const status = formData.get('status') as string
    const { data: props } = await supabase.from('properties').select('id').limit(1)
    const { error } = await supabase.from('rooms').insert({
      property_id: props?.[0]?.id,
      room_type_id,
      room_number,
      floor,
      status,
    })
    if (!error) redirect('/admin/rooms')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/admin/rooms" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI KE ROOMS</Link>
      <Card>
        <CardHeader><CardTitle>Tambah Kamar Baru — Real DB</CardTitle></CardHeader>
        <CardContent>
          <form action={createRoom} className="space-y-4">
            <div className="space-y-2"><Label>Nomor Kamar *</Label><Input name="room_number" placeholder="e.g. GV-207" required /></div>
            <div className="space-y-2"><Label>Tipe Kamar *</Label>
              <select name="room_type_id" required className="h-10 w-full border border-input bg-background px-3 rounded-lg text-sm">
                <option value="">Pilih tipe</option>
                {(types||[]).map(t=> <option key={t.id} value={t.id}>{t.name.en}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Lantai</Label><Input name="floor" type="number" defaultValue={1} /></div>
              <div className="space-y-2"><Label>Status</Label>
                <select name="status" defaultValue="AVAILABLE" className="h-10 w-full border border-input bg-background px-3 rounded-lg text-sm">
                  <option>AVAILABLE</option><option>OCCUPIED</option><option>RESERVED</option><option>CLEANING</option><option>DIRTY</option><option>MAINTENANCE</option><option>OUT_OF_SERVICE</option>
                </select>
              </div>
            </div>
            <Button type="submit" className="w-full bg-brand-foreground text-brand-background h-11 tracking-widest text-xs">SIMPAN KE DATABASE</Button>
            <p className="text-[10px] text-muted-foreground">Akan INSERT ke <code className="bg-muted px-1 rounded">rooms</code> — refresh /admin/rooms untuk lihat.</p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
