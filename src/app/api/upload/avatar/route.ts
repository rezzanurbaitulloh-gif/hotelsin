import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

// POST /api/upload/avatar (FormData: file) — requires login.
// Uploads via service role (storage RLS has no public policies by design).
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Harus login' }, { status: 401 })

  let file: File | null = null
  try {
    const fd = await req.formData()
    file = fd.get('file') as File | null
  } catch {
    return NextResponse.json({ error: 'Form tidak valid' }, { status: 400 })
  }
  if (!file || file.size === 0) return NextResponse.json({ error: 'File kosong' }, { status: 400 })
  if (file.size > MAX_SIZE) return NextResponse.json({ error: 'Maksimal 5MB' }, { status: 400 })
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: 'Hanya JPG/PNG/WEBP' }, { status: 400 })

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const path = `avatars/${user.id}-${Date.now()}.${ext}`
  const service = createServiceClient()
  const buf = Buffer.from(await file.arrayBuffer())
  const { error: upErr } = await service.storage.from('hotel-images').upload(path, buf, {
    contentType: file.type,
    upsert: true,
  })
  if (upErr) return NextResponse.json({ error: 'Upload gagal: ' + upErr.message }, { status: 500 })

  const { data: { publicUrl } } = service.storage.from('hotel-images').getPublicUrl(path)
  const { error: updErr } = await service.auth.admin.updateUserById(user.id, {
    user_metadata: { ...(user.user_metadata || {}), avatar_url: publicUrl },
  })
  if (updErr) return NextResponse.json({ error: 'Gagal update profil' }, { status: 500 })

  return NextResponse.json({ ok: true, url: publicUrl })
}
