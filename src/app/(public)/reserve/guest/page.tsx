import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Price } from '@/components/price'
import { LocalizedText, T } from '@/components/localized'
import { getI18nFromCookies, getTranslationServer } from '@/lib/i18n/server'
import { convertCurrency } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function GuestPage({ searchParams }: { searchParams: Promise<{ room_type?: string, check_in?: string, check_out?: string, guests?: string, nights?: string, rate?: string, promo?: string }> }) {
  const sp = await searchParams
  const supabase = await createClient()
  const { locale, currency } = await getI18nFromCookies()
  const tr = (k: string) => getTranslationServer(locale, k)
  const { data: { user } } = await supabase.auth.getUser()

  if (!sp.room_type || !sp.check_in || !sp.check_out) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <p className="text-muted-foreground">Parameter tidak lengkap — silakan pilih kamar dulu.</p>
        <Link href="/reserve/availability" className="inline-block mt-4 h-9 px-6 bg-brand-foreground text-brand-background inline-flex items-center text-xs tracking-widest">KEMBALI KE AVAILABILITY</Link>
      </div>
    )
  }

  const { data: roomType } = await supabase.from('room_types').select('id,name,base_price').eq('id', sp.room_type).single()
  const { data: guest } = user?.email ? await supabase.from('guests').select('first_name,last_name,email,phone,city,country').eq('email', user.email).single() : { data: null }
  const { data: ratePlans } = await supabase.from('rate_plans').select('id,name,description,base_price,cancellation_policy,min_stay').eq('room_type_id', sp.room_type).eq('is_active', true).order('base_price')
  const { data: addons } = await supabase.from('addons').select('id,name,description,price,price_unit,category').eq('is_active', true).order('sort_order')

  const nights = Number(sp.nights || 1)
  const guests = Number(sp.guests || 2)
  const baseRate = Number(roomType?.base_price || 0)

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <p className="text-xs tracking-[0.35em] text-brand-accent uppercase mb-2"><T k="booking.guest_details" /></p>
      <h1 className="font-display text-3xl font-light mb-2">{tr('booking.guest_details')}</h1>
      <p className="text-sm text-muted-foreground mb-8">Kamar: <LocalizedText value={(roomType as any)?.name as any} fallback="Kamar Pilihan" /> • {sp.check_in} → {sp.check_out} • {sp.guests} tamu • <Price amount={baseRate} showRate /></p>

      {!user && (
        <div className="mb-6 p-4 border border-amber-200 bg-amber-50 rounded-lg">
          <p className="text-sm font-medium">Belum login?</p>
          <p className="text-xs text-muted-foreground">Anda bisa lanjut sebagai tamu, atau <Link href={`/login?next=/reserve/guest?room_type=${sp.room_type}&check_in=${sp.check_in}&check_out=${sp.check_out}&guests=${sp.guests}&nights=${sp.nights}`} className="text-brand-accent underline">Masuk</Link> / <Link href={`/register?next=/reserve/guest?room_type=${sp.room_type}&check_in=${sp.check_in}&check_out=${sp.check_out}&guests=${sp.guests}&nights=${sp.nights}`} className="text-brand-accent underline">Daftar</Link> untuk simpan reservasi ke akun.</p>
        </div>
      )}

      <form action="/reserve/review" method="GET" className="space-y-6">
        <input type="hidden" name="room_type" value={sp.room_type} />
        <input type="hidden" name="check_in" value={sp.check_in!} />
        <input type="hidden" name="check_out" value={sp.check_out!} />
        <input type="hidden" name="guests" value={sp.guests!} />
        <input type="hidden" name="nights" value={String(nights)} />

        <Card>
          <CardHeader><CardTitle className="text-sm">{tr('booking.rate_plan')}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-start gap-3 border border-border rounded-lg p-4 cursor-pointer hover:border-brand-accent has-checked:border-brand-accent has-checked:bg-brand-accent/5">
              <input type="radio" name="rate_plan" value="" defaultChecked className="mt-1" />
              <span className="flex-1">
                <span className="flex items-center justify-between">
                  <strong className="text-sm">{tr('booking.rate_flexible')}</strong>
                  <Price amount={baseRate} showRate />
                </span>
                <span className="block text-xs text-muted-foreground mt-1">{locale === 'id' ? 'Pembatalan gratis hingga H-3, bayar saat reservasi.' : 'Free cancellation until 3 days before, pay at reservation.'}</span>
              </span>
            </label>
            {(ratePlans || []).map((rp: any) => (
              <label key={rp.id} className="flex items-start gap-3 border border-border rounded-lg p-4 cursor-pointer hover:border-brand-accent has-checked:border-brand-accent has-checked:bg-brand-accent/5">
                <input type="radio" name="rate_plan" value={rp.id} className="mt-1" />
                <span className="flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <strong className="text-sm"><LocalizedText value={rp.name} /></strong>
                    <Price amount={Number(rp.base_price)} showRate />
                  </span>
                  <span className="block text-xs text-muted-foreground mt-1"><LocalizedText value={rp.description} /></span>
                  {rp.cancellation_policy && (
                    <span className="block text-xs text-muted-foreground mt-1">✕ <LocalizedText value={rp.cancellation_policy} /></span>
                  )}
                </span>
              </label>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{tr('booking.addons')}</CardTitle>
            <p className="text-xs text-muted-foreground">{tr('booking.addons_hint')}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {(addons || []).map((a: any) => (
              <label key={a.id} className="flex items-start gap-3 border border-border rounded-lg p-4 cursor-pointer hover:border-brand-accent has-checked:border-brand-accent has-checked:bg-brand-accent/5">
                <input type="checkbox" name="addon" value={a.id} className="mt-1" />
                <span className="flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <strong className="text-sm"><LocalizedText value={a.name} /></strong>
                    <Price amount={currency === 'IDR' ? Math.round(convertCurrency(Number(a.price), 'USD', 'IDR')) : Number(a.price)} />
                  </span>
                  <span className="block text-xs text-muted-foreground mt-1"><LocalizedText value={a.description} /></span>
                  <Badge variant="outline" className="mt-2 text-[10px]">
                    {a.price_unit === 'per_night' ? (locale === 'id' ? '/ malam' : '/ night') : a.price_unit === 'per_person' ? (locale === 'id' ? '/ orang' : '/ person') : a.price_unit === 'per_person_night' ? (locale === 'id' ? '/ orang / malam' : '/ person / night') : (locale === 'id' ? '/ reservasi' : '/ stay')}
                  </Badge>
                </span>
              </label>
            ))}
            {(!addons || addons.length === 0) && <p className="text-xs text-muted-foreground">—</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Form Tamu</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{tr('booking.first_name')} *</Label><Input name="first_name" defaultValue={(guest as any)?.first_name || (user?.user_metadata as any)?.first_name || ''} required /></div>
              <div className="space-y-2"><Label>{tr('booking.last_name')} *</Label><Input name="last_name" defaultValue={(guest as any)?.last_name || (user?.user_metadata as any)?.last_name || ''} required /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{tr('booking.email')} *</Label><Input name="email" type="email" defaultValue={(guest as any)?.email || user?.email || ''} required /></div>
              <div className="space-y-2"><Label>{tr('booking.phone')}</Label><Input name="phone" defaultValue={(guest as any)?.phone || ''} /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{tr('booking.city')}</Label><Input name="city" defaultValue={(guest as any)?.city || ''} /></div>
              <div className="space-y-2"><Label>{tr('booking.country')}</Label><Input name="country" defaultValue={(guest as any)?.country || ''} /></div>
            </div>
            <div className="space-y-2"><Label>{tr('booking.special_requests')}</Label><Input name="special_requests" placeholder="Mis: late check-in, alergi, anniversary" /></div>
            <div className="space-y-2">
              <Label>{tr('booking.promo_label')}</Label>
              <Input name="promo" defaultValue={sp.promo || ''} placeholder={tr('booking.promo_placeholder')} />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Link href={`/reserve/availability?check_in=${sp.check_in}&check_out=${sp.check_out}&guests=${sp.guests}`} className="h-10 px-6 border border-border inline-flex items-center text-xs tracking-widest">KEMBALI</Link>
          <Button type="submit" className="flex-1 bg-brand-foreground text-brand-background h-10 tracking-widest text-xs">{tr('booking.review')} →</Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center">{tr('booking.loyalty_hint')}</p>
      </form>
    </div>
  )
}
