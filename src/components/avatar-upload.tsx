'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Upload, Eye } from 'lucide-react'

export function AvatarUpload({ initialUrl, email }: { initialUrl?: string | null, email: string }) {
  const [url, setUrl] = useState(initialUrl || '')
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(initialUrl || null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Maks 5MB'); return }
    setUploading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { alert('Harus login'); setUploading(false); return }
    const ext = file.name.split('.').pop()
    const path = `avatars/${user.id}-${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from('hotel-images').upload(path, file, { upsert: true })
    if (upErr) { alert('Upload gagal: ' + upErr.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('hotel-images').getPublicUrl(path)
    const { error: updErr } = await supabase.auth.updateUser({ data: { avatar_url: publicUrl } })
    if (updErr) { alert('Gagal update profile: ' + updErr.message); setUploading(false); return }
    setPreview(publicUrl)
    setUrl(publicUrl)
    setUploading(false)
    window.location.reload()
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {preview ? (
          <img src={preview} alt="avatar" className="h-24 w-24 rounded-full object-cover border-2 border-border" />
        ) : (
          <div className="h-24 w-24 rounded-full bg-muted grid place-items-center border-2 border-border">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        {preview && <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full">BARU</span>}
      </div>
      <div className="w-full space-y-2">
        <label className="text-xs tracking-widest text-muted-foreground uppercase">Foto Profil</label>
        <div className="flex gap-2">
          <Input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="flex-1" />
          <Button variant="outline" size="sm" disabled={uploading} className="whitespace-nowrap">
            <Upload className="mr-2 h-4 w-4"/>{uploading ? '...' : 'Upload'}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground">JPG/PNG/WEBP, maks 5MB. Tersimpan di Supabase Storage `hotel-images/avatars/` dan `auth.user_metadata.avatar_url`. Header akan langsung pakai avatar.</p>
        {url && <a href={url} target="_blank" className="text-xs text-brand-accent hover:underline flex items-center gap-1"><Eye className="h-3 w-3"/>Lihat foto</a>}
        <p className="text-xs text-muted-foreground">Email: {email}</p>
      </div>
    </div>
  )
}
