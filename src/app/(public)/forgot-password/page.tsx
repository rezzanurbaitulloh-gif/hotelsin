'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const site = window.location.origin
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${site}/reset-password`,
    })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setDone(true)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <p className="text-xs tracking-[0.35em] text-brand-accent uppercase">HotelsIn</p>
          <CardTitle className="font-display text-2xl font-light">Lupa Kata Sandi</CardTitle>
          <CardDescription>Masukkan email — kami kirim link reset password.</CardDescription>
        </CardHeader>
        <CardContent>
          {done ? (
            <div className="text-center space-y-4">
              <p className="text-sm bg-emerald-50 text-emerald-800 p-4 rounded-lg">Link reset terkirim ke <strong>{email}</strong>. Cek inbox/spam Anda.</p>
              <Link href="/login" className="text-xs tracking-widest text-brand-accent underline">KEMBALI KE LOGIN</Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="nama@email.com" />
              </div>
              {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full bg-brand-foreground text-brand-background h-11 tracking-[0.15em] text-xs">
                {loading ? 'MENGIRIM...' : 'KIRIM LINK RESET'}
              </Button>
              <p className="text-xs text-center text-muted-foreground"><Link href="/login" className="underline">Kembali ke login</Link></p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
