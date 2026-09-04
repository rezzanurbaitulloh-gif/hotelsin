'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Eye, EyeOff } from 'lucide-react'


function LoginForm(){
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/account/profile'
  const [email, setEmail] = useState('admin@hotelsin.com')
  const [password, setPassword] = useState('121212')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent)=>{
    e.preventDefault()
    setLoading(true); setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    // Verifikasi role inti vs guest
    const { data: pub } = await supabase.from('users').select('role').eq('email', email).single()
    const role = pub?.role || null
    const isCore = ['SUPER_ADMIN','HOTEL_ADMIN','FRONT_DESK','HOUSEKEEPING','REVENUE_MANAGER','CONTENT_MANAGER'].includes(role||'')
    // Jika core role dan next masih default, arahkan ke dashboard
    const target = (isCore && next === '/account/profile') ? '/admin' : next
    // Jika guest coba akses admin, akan di-block middleware → redirect ke / dengan error
    router.push(target)
    router.refresh()
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={e=> setEmail(e.target.value)} required placeholder="admin@hotelsin.com"/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Kata Sandi</Label>
        <div className="relative">
          <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e=> setPassword(e.target.value)} required placeholder="••••••••" className="pr-10"/>
          <button type="button" onClick={()=> setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center text-muted-foreground hover:text-foreground" aria-label={showPassword ? 'Sembunyikan' : 'Lihat'}>
            {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">Demo: admin@hotelsin.com / 121212 (atau manager@, frontdesk@, housekeeping@, revenue@, content@ — semua 121212) • klik ikon mata untuk lihat</p>
      </div>
      {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full bg-brand-foreground text-brand-background hover:bg-brand-foreground/90 h-11 tracking-[0.15em] text-xs">
        {loading ? 'Memuat...' : 'MASUK'}
      </Button>
      <div className="flex items-center justify-between text-xs">
        <Link href="/register" className="text-muted-foreground hover:text-foreground">Belum punya akun? Daftar</Link>
        <Link href="#" className="text-muted-foreground hover:text-foreground">Lupa kata sandi?</Link>
      </div>
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">Role demo:</p>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <button type="button" onClick={()=> {setEmail('manager@hotelsin.com'); setPassword('121212')}} className="border border-border p-2 rounded hover:bg-muted text-left">manager@<br/>HOTEL_ADMIN</button>
          <button type="button" onClick={()=> {setEmail('frontdesk@hotelsin.com'); setPassword('121212')}} className="border border-border p-2 rounded hover:bg-muted text-left">frontdesk@<br/>FRONT_DESK</button>
          <button type="button" onClick={()=> {setEmail('housekeeping@hotelsin.com'); setPassword('121212')}} className="border border-border p-2 rounded hover:bg-muted text-left">housekeeping@<br/>HOUSEKEEPING</button>
          <button type="button" onClick={()=> {setEmail('content@hotelsin.com'); setPassword('121212')}} className="border border-border p-2 rounded hover:bg-muted text-left">content@<br/>CONTENT</button>
        </div>
        <div className="mt-4 flex gap-2">
          <Link href="/" className="flex-1 h-9 grid place-items-center bg-muted text-xs tracking-widest">HOME</Link>
          <Link href="/register" className="flex-1 h-9 grid place-items-center border border-border text-xs tracking-widest hover:bg-muted">DAFTAR</Link>
        </div>
      </div>
    </form>
  )
}

export default function LoginPage(){
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <p className="text-xs tracking-[0.35em] text-brand-accent uppercase">HotelsIn</p>
          <CardTitle className="font-display text-2xl font-light">Selamat Datang Kembali</CardTitle>
          <CardDescription>Masuk untuk kelola reservasi & preferensi Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Memuat...</div>}>
            <LoginForm/>
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
