import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: room } = await supabase.from('rooms').select('id,room_number,floor,status,room_type_id').eq('id', id).single()
  if (!room) return notFound()
  const { data: types } = await supabase.from('room_types').select('id,name').eq('is_active', true)

  async function updateRoom(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const room_number = formData.get('room_number') as string
    const room_type_id = formData.get('room_type_id') as string
    const floor = Number(formData.get('floor'))
    const status = formData.get('status') as string
    await supabase.from('rooms').update({ room_number, room_type_id, floor, status }).eq('id', id)
    redirect('/admin/rooms')
  }

  async function deleteRoom() {
    'use server'
    const supabase = await createClient()
    await supabase.from('rooms').delete().eq('id', id)
    redirect('/admin/rooms')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/admin/rooms" className="text-xs tracking-widest hover:text-brand-accent">← KEMBALI</Link>
      <Card>
        <CardHeader><CardTitle>Edit Kamar {room.room_number} — ID {room.id.slice(0,8)}</CardTitle></CardHeader>
        <CardContent>
          <form action={updateRoom} className="space-y-4">
            <div className="space-y-2"><Label>Nomor Kamar</Label><Input name="room_number" defaultValue={room.room_number} required /></div>
            <div className="space-y-2"><Label>Tipe</Label>
              <select name="room_type_id" defaultValue={room.room_type_id} className="h-10 w-full border border-input bg-background px-3 rounded-lg text-sm">
                {(types||[]).map(t=> <option key={t.id} value={t.id}>{t.name.en}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Lantai</Label><Input name="floor" type="number" defaultValue={room.floor} /></div>
              <div className="space-y-2"><Label>Status</Label>
                <select name="status" defaultValue={room.status} className="h-10 w-full border border-input bg-background px-3 rounded-lg text-sm">
                  <option>AVAILABLE</option><option>OCCUPIED</option><option>RESERVED</option><option>CLEANING</option><option>DIRTY</option><option>MAINTENANCE</option><option>OUT_OF_SERVICE</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-brand-foreground text-brand-background h-11 tracking-widest text-xs">SIMPAN PERUBAHAN</Button>
              <Link href="/admin/rooms" className="h-11 px-6 border border-border grid place-items-center text-xs tracking-widest">BATAL</Link>
            </div>
          </form>
          <form action={deleteRoom} className="mt-6 border-t border-border pt-4">
            <Button variant="destructive" className="w-full h-10 text-xs tracking-widest">HAPUS KAMAR (DELETE FROM DB)</Button>
            <p className="text-[10px] text-muted-foreground mt-2">Akan DELETE FROM rooms WHERE id = {room.id.slice(0,8)} — refresh /admin/rooms untuk verifikasi hilang.</p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
