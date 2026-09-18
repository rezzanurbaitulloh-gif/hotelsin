import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { canManageRole } from '@/lib/rbac'

export async function POST(req: Request) {
  try {
    const { targetEmail, newPassword } = await req.json()
    if (!targetEmail || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'Email dan password baru (min 6) wajib' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: actor } = await supabase.from('users').select('role').eq('email', user.email).single()
    const actorRole = actor?.role as any
    if (!actorRole) return NextResponse.json({ error: 'Role tidak ditemukan' }, { status: 403 })

    const { data: target } = await supabase.from('users').select('role').eq('email', targetEmail).single()
    if (!target) return NextResponse.json({ error: 'Target user tidak ditemukan' }, { status: 404 })
    const targetRole = target.role as any

    if (!canManageRole(actorRole, targetRole)) {
      return NextResponse.json({ error: `Tidak boleh ubah password ${targetRole} sebagai ${actorRole}. Hanya SUPER_ADMIN boleh ubah SUPER_ADMIN.` }, { status: 403 })
    }

    // Get auth user id by email via listUsers (service)
    const service = createServiceClient()
    const { data: list } = await service.auth.admin.listUsers()
    const authUser = list.users.find(u => u.email === targetEmail)
    if (!authUser) return NextResponse.json({ error: 'Auth user tidak ditemukan' }, { status: 404 })

    const { error: updErr } = await service.auth.admin.updateUserById(authUser.id, { password: newPassword })
    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 })

    const { auditLog } = await import('@/lib/email')
    const { data: prop } = await service.from('properties').select('id').limit(1).single()
    await auditLog(service as any, { property_id: (prop as any)?.id || null, actor_email: user.email, actor_role: actorRole, action: 'user.change_password', entity: 'users', entity_id: targetEmail })

    return NextResponse.json({ success: true, message: `Password ${targetEmail} diubah` })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 })
  }
}
