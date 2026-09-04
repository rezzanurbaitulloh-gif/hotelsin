'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Eye, EyeOff, KeyRound } from 'lucide-react'

export function ChangePasswordDialog({ email, role, disabled, disabledReason }: { email: string, role: string, disabled?: boolean, disabledReason?: string }) {
  const [open, setOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('121212')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string|null>(null)
  const [err, setErr] = useState<string|null>(null)

  const handleChange = async () => {
    setLoading(true); setMsg(null); setErr(null)
    const res = await fetch('/api/admin/users/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetEmail: email, newPassword })
    })
    const data = await res.json()
    if (!res.ok) { setErr(data.error || 'Gagal'); setLoading(false); return }
    setMsg(data.message || 'Berhasil')
    setLoading(false)
    setTimeout(()=> setOpen(false), 1200)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled} title={disabledReason || ''} className="h-7 text-xs">
          <KeyRound className="mr-1 h-3 w-3"/>Ganti Password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><KeyRound className="h-4 w-4"/>Ganti Password — {email}</DialogTitle>
          <DialogDescription className="text-xs">
            Role: {role} • Password tidak bisa dilihat plain (hash), hanya bisa di-reset. Demo semua `121212`. Admin bisa lihat ter-enskripsi dan ubah.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted p-3 rounded-lg text-xs">
            <p className="font-medium">Info keamanan:</p>
            <p className="text-muted-foreground">Password disimpan hash di Supabase Auth, tidak bisa di-decrypt. Yang tampil di sini adalah status: untuk demo password adalah <code className="bg-white px-1 rounded">121212</code>. Admin hanya bisa <b>mengubah</b>, bukan melihat plain lama.</p>
          </div>
          <div className="space-y-2">
            <Label>Password Baru</Label>
            <div className="relative">
              <Input type={show ? 'text' : 'password'} value={newPassword} onChange={e=> setNewPassword(e.target.value)} minLength={6} className="pr-10"/>
              <button type="button" onClick={()=> setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center text-muted-foreground hover:text-foreground">
                {show ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground">Klik mata untuk lihat • min 6 karakter</p>
          </div>
          {err && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{err}</p>}
          {msg && <p className="text-sm text-emerald-700 bg-emerald-50 p-2 rounded">{msg}</p>}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={()=> setOpen(false)}>Batal</Button>
            <Button onClick={handleChange} disabled={loading || newPassword.length<6} className="bg-brand-foreground text-brand-background">
              {loading ? 'Menyimpan...' : 'Simpan Password'}
            </Button>
          </div>
          {disabled && <p className="text-xs text-destructive">{disabledReason}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
