'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Eye, EyeOff } from 'lucide-react'

function ResetInner() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase sends recovery via hash; client picks up session automatically
    const supabase = createClient()
    supabase.auth.getSession().then(() => setReady(true))
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('Minimal 6 karakter')
      return
    }
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setDone(true)
    setTimeout(() => router.push('/login'), 2000)
  }

  if (!ready) return <p className="text-center text-sm text-muted-foreground py-8">Memuat...</p>

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <p className="text-xs tracking-[0.35em] text-brand-accent uppercase">HotelsIn</p>
          <CardTitle className="font-display text-2xl font-light">Password Baru</CardTitle>
          <CardDescription>Masukkan kata sandi baru Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          {done ? (
            <div className="text-center space-y-4">
              <p className="text-sm bg-emerald-50 text-emerald-800 p-4 rounded-lg">Password berhasil diubah. Mengalihkan ke login...</p>
              <Link href="/login" className="text-xs tracking-widest text-brand-accent underline">LOGIN SEKARANG</Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label>Kata Sandi Baru</Label>
                <div className="relative">
                  <Input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="pr-10" />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center text-muted-foreground">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full bg-brand-foreground text-brand-background h-11 tracking-[0.15em] text-xs">
                {loading ? 'MENYIMPAN...' : 'SIMPAN PASSWORD'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-muted-foreground">Memuat...</div>}>
      <ResetInner />
    </Suspense>
  )
}
