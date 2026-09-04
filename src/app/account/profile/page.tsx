import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { redirect } from 'next/navigation'
export const dynamic = 'force-dynamic'
export default async function ProfilePage(){
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: pubUser } = await supabase.from('users').select('role').eq('email', user.email!).single()
  const { data: guest } = await supabase.from('guests').select('id,first_name,last_name,email,city,country,phone').eq('email', user.email!).single()
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">Profil <Badge variant="secondary">{pubUser?.role || 'GUEST'}</Badge></CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div><p className="text-xs tracking-widest text-muted-foreground uppercase">Email</p><p className="font-mono">{user.email}</p></div>
            <div><p className="text-xs tracking-widest text-muted-foreground uppercase">User ID</p><p className="font-mono text-xs">{user.id.slice(0,16)}…</p></div>
            <div><p className="text-xs tracking-widest text-muted-foreground uppercase">Nama</p><p>{user.user_metadata?.first_name || guest?.first_name || '—'} {user.user_metadata?.last_name || guest?.last_name || ''}</p></div>
            <div><p className="text-xs tracking-widest text-muted-foreground uppercase">Lokasi</p><p>{guest?.city || '—'}, {guest?.country || '—'}</p></div>
          </div>
          <div className="pt-4 border-t border-border flex gap-2">
            <form action={async ()=> {
              'use server'
              const { createClient } = await import('@/lib/supabase/server')
              const supabase = await createClient()
              await supabase.auth.signOut()
            }}>
              <button className="h-9 px-4 border border-border text-xs tracking-widest hover:bg-muted">LOGOUT</button>
            </form>
            <a href="/account/reservations" className="h-9 px-4 bg-brand-foreground text-brand-background grid place-items-center text-xs tracking-widest">RESERVASI SAYA</a>
          </div>
          <p className="text-xs text-muted-foreground">Edit profil via Supabase Auth — field first_name/last_name tersimpan di user_metadata. Untuk demo, data tamu juga terhubung via guests.email.</p>
        </CardContent>
      </Card>
    </div>
  )
}
