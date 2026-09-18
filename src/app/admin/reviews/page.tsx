import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ReviewStars } from '@/components/review-form'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ReviewsAdminPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const sp = await searchParams
  const supabase = await createClient()
  let query = supabase.from('reviews').select('id,guest_name,rating,title,comment,status,created_at').order('created_at', { ascending: false }).limit(50)
  if (sp.status && sp.status !== 'all') query = query.eq('status', sp.status)
  const { data } = await query

  async function moderate(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const status = formData.get('status') as string
    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) return
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const service = createServiceClient()
    await service.from('reviews').update({ status }).eq('id', id)
    const { auditLog } = await import('@/lib/email')
    const { data: prop } = await service.from('properties').select('id').limit(1).single()
    await auditLog(service as any, {
      property_id: (prop as any)?.id || null,
      actor_email: user?.email || null,
      action: `review.${status.toLowerCase()}`,
      entity: 'reviews',
      entity_id: id,
    })
    redirect('/admin/reviews')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-light">Guest Reviews</h1>
          <p className="text-sm text-muted-foreground">{(data || []).length} ulasan • moderasi sebelum tampil di website</p>
        </div>
        <div className="flex gap-2">
          <a href="/admin/reviews" className="h-8 px-3 border border-border inline-flex items-center text-xs">Semua</a>
          <a href="/admin/reviews?status=PENDING" className="h-8 px-3 border border-border inline-flex items-center text-xs">Pending</a>
          <a href="/admin/reviews?status=APPROVED" className="h-8 px-3 border border-border inline-flex items-center text-xs">Approved</a>
        </div>
      </div>
      <div className="grid gap-4">
        {(data || []).map((r: any) => (
          <Card key={r.id}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm">
                <span>{r.guest_name} {r.title ? `— ${r.title}` : ''}</span>
                <Badge variant={r.status === 'APPROVED' ? 'secondary' : r.status === 'REJECTED' ? 'destructive' : 'outline'}>{r.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ReviewStars rating={r.rating} />
              <p className="text-sm">{r.comment}</p>
              <p className="text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleString('id-ID')}</p>
              <form action={moderate} className="flex gap-2">
                <input type="hidden" name="id" value={r.id} />
                <Button name="status" value="APPROVED" size="sm" className="h-8 text-xs bg-brand-foreground text-brand-background">APPROVE</Button>
                <Button name="status" value="REJECTED" size="sm" variant="outline" className="h-8 text-xs">REJECT</Button>
              </form>
            </CardContent>
          </Card>
        ))}
        {(!data || data.length === 0) && (
          <Card><CardContent className="py-12 text-center text-muted-foreground">Belum ada ulasan.</CardContent></Card>
        )}
      </div>
    </div>
  )
}
