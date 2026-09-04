'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterPage(){
  const router = useRouter()
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [firstName,setFirstName]=useState('')
  const [lastName,setLastName]=useState('')
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState<string|null>(null)
  const [success,setSuccess]=useState(false)
  const [showPassword,setShowPassword]=useState(false)

  const handleRegister = async (e:React.FormEvent)=>{
    e.preventDefault(); setLoading(true); setError(null)
    const supabase=createClient()
    const { error } = await supabase.auth.signUp({ email, password, options:{ data:{ first_name:firstName, last_name:lastName } } })
    if(error){ setError(error.message); setLoading(false); return }
    setSuccess(true); setLoading(false)
    setTimeout(()=> router.push('/login'), 1500)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <p className="text-xs tracking-[0.35em] text-brand-accent uppercase">HotelsIn</p>
          <CardTitle className="font-display text-2xl font-light">Buat Akun</CardTitle>
          <CardDescription>Daftar untuk kelola reservasi Anda</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg text-sm text-center">Akun dibuat! Cek email untuk konfirmasi, lalu <Link href="/login" className="underline">Masuk</Link></div> : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nama Depan</Label><Input value={firstName} onChange={e=>setFirstName(e.target.value)} required/></div>
              <div className="space-y-2"><Label>Nama Belakang</Label><Input value={lastName} onChange={e=>setLastName(e.target.value)} required/></div>
            </div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
            <div className="space-y-2"><Label>Kata Sandi</Label><div className="relative"><Input type={showPassword ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} className="pr-10"/><button type="button" onClick={()=> setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}</button></div><p className="text-xs text-muted-foreground">Minimal 6 karakter — untuk demo gunakan 121212 • klik mata untuk lihat</p></div>
            {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-brand-foreground text-brand-background h-11 tracking-[0.15em] text-xs">{loading?'Memuat...':'DAFTAR'}</Button>
            <p className="text-xs text-center text-muted-foreground">Sudah punya akun? <Link href="/login" className="text-foreground underline">Masuk</Link></p>
          </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
