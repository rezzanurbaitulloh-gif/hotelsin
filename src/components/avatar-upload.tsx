'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Upload, Eye } from 'lucide-react'

export function AvatarUpload({ initialUrl, email }: { initialUrl?: string | null, email: string }) {
  const [url, setUrl] = useState(initialUrl || '')
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(initialUrl || null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Maksimal 5MB'); return }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setError('Hanya JPG/PNG/WEBP'); return }
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload/avatar', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Upload gagal')
      setPreview(data.url)
      setUrl(data.url)
      window.location.reload()
    } catch (err: any) {
      setError(err?.message || 'Upload gagal')
      setUploading(false)
    }
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
        {error && <p className="text-xs text-destructive bg-destructive/10 p-2 rounded">{error}</p>}
        <p className="text-[10px] text-muted-foreground">JPG/PNG/WEBP, maks 5MB. Foto profil langsung tampil di header.</p>
        {url && <a href={url} target="_blank" className="text-xs text-brand-accent hover:underline flex items-center gap-1"><Eye className="h-3 w-3"/>Lihat foto</a>}
        <p className="text-xs text-muted-foreground">Email: {email}</p>
      </div>
    </div>
  )
}
