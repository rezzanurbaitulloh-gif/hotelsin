'use client'
import { useEffect, useState, useRef } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export function FloatingWhatsApp({ phone, message, side, position }: { phone: string, message: string, side: 'left'|'right', position: 'bottom'|'top' }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{x:number,y:number} | null>(null)
  const [dragging, setDragging] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useI18n()

  useEffect(()=>{
    const saved = localStorage.getItem('wa_pos')
    if (saved) try { setPos(JSON.parse(saved)) } catch {}
  }, [])

  const cleanPhone = phone.replace(/[^0-9]/g,'')
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true)
    const startX = e.clientX
    const startY = e.clientY
    const rect = ref.current?.getBoundingClientRect()
    const origX = rect?.left || 0
    const origY = rect?.top || 0
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      const newPos = { x: origX + dx, y: origY + dy }
      // snap to side
      const snapThreshold = 80
      const winW = window.innerWidth
      if (newPos.x < snapThreshold) newPos.x = 20
      else if (newPos.x > winW - snapThreshold - 56) newPos.x = winW - 76
      setPos(newPos)
    }
    const onUp = () => {
      setDragging(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      if (ref.current) {
        const r = ref.current.getBoundingClientRect()
        localStorage.setItem('wa_pos', JSON.stringify({x:r.left, y:r.top}))
      }
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const style: React.CSSProperties = pos
    ? { position:'fixed', left: pos.x, top: pos.y, zIndex: 50, cursor: dragging?'grabbing':'grab' }
    : { position:'fixed', [side]: 20, [position]: 20, zIndex: 50 } as any

  return (
    <div ref={ref} style={style} className="select-none">
      {open && (
        <div className="mb-3 w-72 rounded-xl border border-border bg-card shadow-xl overflow-hidden animate-slide-up">
          <div className="bg-[#25D366] text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2"><div className="h-8 w-8 rounded-full bg-white/20 grid place-items-center"><MessageCircle className="h-4 w-4"/></div><div><p className="text-sm font-medium">HotelsIn</p><p className="text-xs opacity-80">Biasanya balas dalam menit</p></div></div>
            <button onClick={()=> setOpen(false)} className="h-8 w-8 grid place-items-center hover:bg-white/20 rounded-full"><X className="h-4 w-4"/></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="bg-muted rounded-lg p-3 text-sm">Halo! Ada yang bisa kami bantu? 👋<br/><span className="text-xs text-muted-foreground">Klik untuk chat via WhatsApp</span></div>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 h-10 bg-[#25D366] text-white rounded-lg text-sm font-medium hover:bg-[#1da851] transition-colors">
              <MessageCircle className="h-4 w-4"/> Buka WhatsApp
            </a>
            <p className="text-[10px] text-muted-foreground text-center">Drag ikon untuk pindah posisi • snap ke samping</p>
          </div>
        </div>
      )}
      <button
        onMouseDown={handleMouseDown}
        onClick={()=> !dragging && setOpen(!open)}
        className="h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg grid place-items-center hover:scale-105 transition-transform"
        aria-label="Chat WhatsApp"
      >
        {open ? <X className="h-6 w-6"/> : <MessageCircle className="h-6 w-6"/>}
      </button>
    </div>
  )
}
