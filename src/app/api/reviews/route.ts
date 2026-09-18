import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

// GET /api/reviews — approved reviews (public)
export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reviews')
    .select('id,guest_name,rating,title,comment,created_at')
    .eq('status', 'APPROVED')
    .order('created_at', { ascending: false })
    .limit(12)
  return NextResponse.json({ ok: true, reviews: data || [] })
}

// POST /api/reviews — submit review (public, moderated)
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      reservation_id?: string | null
      guest_name?: string
      rating?: number
      title?: string
      comment?: string
    }
    const rating = Number(body.rating)
    if (!body.guest_name || !body.comment || !(rating >= 1 && rating <= 5)) {
      return NextResponse.json({ error: 'Nama, ulasan, dan rating 1–5 wajib diisi' }, { status: 400 })
    }
    if (String(body.comment).length > 2000) {
      return NextResponse.json({ error: 'Ulasan maksimal 2000 karakter' }, { status: 400 })
    }
    const supabase = await createClient()
    const service = createServiceClient()
    const { data: props } = await service.from('properties').select('id').limit(1).single()
    const propId = (props as any)?.id
    if (!propId) return NextResponse.json({ error: 'Property belum di-setup' }, { status: 500 })

    // Anti-spam: tolak duplikat identik 24 jam terakhir
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data: dup } = await service
      .from('reviews')
      .select('id')
      .eq('property_id', propId)
      .eq('guest_name', String(body.guest_name).slice(0, 200))
      .eq('comment', String(body.comment))
      .gte('created_at', dayAgo)
      .limit(1)
      .maybeSingle()
    if ((dup as any)?.id) {
      return NextResponse.json({ error: 'Ulasan serupa sudah dikirim. Tunggu moderasi.' }, { status: 429 })
    }

    // Link guest if logged in
    const { data: { user } } = await supabase.auth.getUser()
    let guestId: string | null = null
    if (user?.email) {
      const { data: g } = await service.from('guests').select('id').eq('email', user.email).maybeSingle()
      guestId = (g as any)?.id || null
    }

    const { error } = await service.from('reviews').insert({
      property_id: propId,
      reservation_id: body.reservation_id || null,
      guest_id: guestId,
      guest_name: String(body.guest_name).slice(0, 200),
      rating,
      title: String(body.title || '').slice(0, 255),
      comment: String(body.comment),
      status: 'PENDING',
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, message: 'Ulasan diterima, menunggu moderasi' })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Gagal' }, { status: 500 })
  }
}
