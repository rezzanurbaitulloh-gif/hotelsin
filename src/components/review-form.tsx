'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Star } from 'lucide-react'

export function ReviewForm({ reservationId }: { reservationId?: string }) {
  const [rating, setRating] = useState(5)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservation_id: reservationId || null,
          guest_name: fd.get('guest_name'),
          rating,
          title: fd.get('title'),
          comment: fd.get('comment'),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Gagal')
      setDone(true)
    } catch (err: any) {
      setError(err?.message || 'Gagal mengirim ulasan')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="p-6 border border-border rounded-lg bg-muted/30 text-center">
        <p className="font-medium">Terima kasih atas ulasan Anda!</p>
        <p className="text-xs text-muted-foreground mt-1">Ulasan akan tampil setelah dimoderasi tim kami.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4 border border-border rounded-lg p-6">
      <div className="space-y-2">
        <Label>Rating *</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} bintang`} className="p-1">
              <Star className={`h-6 w-6 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
            </button>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Nama *</Label><Input name="guest_name" required placeholder="Nama Anda" /></div>
        <div className="space-y-2"><Label>Judul</Label><Input name="title" placeholder="Ringkasan singkat" /></div>
      </div>
      <div className="space-y-2"><Label>Ulasan *</Label><textarea name="comment" required rows={4} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Ceritakan pengalaman menginap Anda..." /></div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading} className="bg-brand-foreground text-brand-background h-10 tracking-widest text-xs w-full">
        {loading ? 'MENGIRIM...' : 'KIRIM ULASAN'}
      </Button>
    </form>
  )
}

export function ReviewStars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${className || ''}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`h-3 w-3 ${n <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
      ))}
    </span>
  )
}
