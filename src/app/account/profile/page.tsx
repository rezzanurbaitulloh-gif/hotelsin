import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AvatarUpload } from '@/components/avatar-upload'
import { redirect } from 'next/navigation'
export const dynamic = 'force-dynamic'
export default async function ProfilePage(){
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: pubUser } = await supabase.from('users').select('role').eq('email', user.email!).single()
  const { data: guest } = await supabase.from('guests').select('id,first_name,last_name,email,city,country,phone').eq('email', user.email!).single()
  const avatarUrl = (user.user_metadata as any)?.avatar_url as string | undefined
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">Profil <Badge variant="secondary">{pubUser?.role || 'GUEST'}</Badge></CardTitle>
          <CardDescription>Kelola foto profil, data, dan preferensi — sinkron dengan header dan Supabase Auth</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <AvatarUpload initialUrl={avatarUrl} email={user.email!} />
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div><p className="text-xs tracking-widest text-muted-foreground uppercase">Email</p><p className="font-mono">{user.email}</p></div>
            <div><p className="text-xs tracking-widest text-muted-foreground uppercase">User ID</p><p className="font-mono text-xs">{user.id.slice(0,16)}…</p></div>
            <div><p className="text-xs tracking-widest text-muted-foreground uppercase">Nama</p><p>{(user.user_metadata as any)?.first_name || guest?.first_name || '—'} {(user.user_metadata as any)?.last_name || guest?.last_name || ''}</p></div>
            <div><p className="text-xs tracking-widest text-muted-foreground uppercase">Lokasi</p><p>{guest?.city || '—'}, {guest?.country || '—'}</p></div>
            <div><p className="text-xs tracking-widest text-muted-foreground uppercase">Telepon</p><p>{(user.user_metadata as any)?.phone || guest?.phone || '—'}</p></div>
            <div><p className="text-xs tracking-widest text-muted-foreground uppercase">Role</p><p className="font-mono text-xs">{pubUser?.role || 'GUEST (tamu biasa)'}</p></div>
          </div>
          <div className="pt-4 border-t border-border flex gap-2">
            <form action={async ()=> {
              'use server'
              const { createClient } = await import('@/lib/supabase/server')
              const { redirect } = await import('next/navigation')
              const supabase = await createClient()
              await supabase.auth.signOut()
              redirect('/')
            }}>
              <button className="h-9 px-4 border border-border text-xs tracking-widest hover:bg-muted">LOGOUT</button>
            </form>
            <a href="/account/reservations" className="h-9 px-4 bg-brand-foreground text-brand-background grid place-items-center text-xs tracking-widest">RESERVASI SAYA</a>
            {pubUser?.role && ['SUPER_ADMIN','HOTEL_ADMIN','FRONT_DESK','HOUSEKEEPING','REVENUE_MANAGER','CONTENT_MANAGER'].includes(pubUser.role) && (
              <a href="/admin" className="h-9 px-4 bg-brand-accent text-white grid place-items-center text-xs tracking-widest">DASHBOARD</a>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Foto profil Anda langsung tampil di header setelah diunggah.</p>
        </CardContent>
      </Card>
    </div>
  )
}
