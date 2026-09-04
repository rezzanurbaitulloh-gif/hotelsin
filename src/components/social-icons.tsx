import { Globe, Mail, MessageCircle, Send, Music, MapPin, Bookmark, AtSign, Aperture, PenTool, Share2 } from 'lucide-react'
const iconMap: Record<string, any> = {
  instagram: Aperture,
  facebook: Share2,
  x: AtSign,
  twitter: AtSign,
  youtube: Music,
  tiktok: Music,
  linkedin: Bookmark,
  pinterest: Bookmark,
  tripadvisor: MapPin,
  booking: Bookmark,
  whatsapp: MessageCircle,
  telegram: Send,
  threads: AtSign,
  snapchat: Aperture,
  spotify: Music,
  behance: PenTool,
  dribbble: Aperture,
  medium: PenTool,
  email: Mail,
}
export function SocialIcons({ links, className }: { links: {platform:string, url:string, enabled:boolean}[], className?: string }) {
  return (
    <div className={"flex flex-wrap gap-3 "+(className||'')}>
      {links.filter((l:any)=> l.enabled).map((l:any)=>{
        const Icon = iconMap[l.platform] || Globe
        return (
          <a key={l.platform} href={l.url} target="_blank" rel="noopener noreferrer" aria-label={l.platform} className="h-9 w-9 rounded-full border border-border bg-card grid place-items-center hover:bg-brand-foreground hover:text-brand-background hover:border-brand-foreground transition-colors">
            <Icon className="h-4 w-4"/>
          </a>
        )
      })}
    </div>
  )
}
