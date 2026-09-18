import type { SupabaseClient } from '@supabase/supabase-js'
import { convertCurrency } from '@/lib/utils'

export interface PriceBreakdown {
  rate: number
  nights: number
  subtotal: number
  addonsTotal: number
  discount: number
  appliedOfferId: string | null
  appliedOfferName: string | null
  loyaltyDiscount: number
  isLoyaltyMember: boolean
  tax: number
  fee: number
  total: number
  currency: 'USD' | 'IDR'
  ratePlanId: string | null
  ratePlanName: string | null
}

export interface AddonSelection {
  addonId: string
  qty: number
}

/** Validate promo code against offers table. Returns discount in room currency. */
export async function validatePromo(
  supabase: SupabaseClient,
  promoCode: string,
  roomTypeId: string,
  nights: number,
  subtotal: number,
  checkIn: string
): Promise<{ discount: number; offerId: string | null; offerName: string | null }> {
  const none = { discount: 0, offerId: null, offerName: null }
  const code = (promoCode || '').trim().toUpperCase()
  if (!code) return none
  const today = checkIn || new Date().toISOString().split('T')[0]
  const { data: offer } = await supabase
    .from('offers')
    .select('id,name,discount_type,discount_value,min_nights,applicable_room_type_ids,valid_from,valid_to,is_active')
    .eq('is_active', true)
    .ilike('promo_code', code)
    .lte('valid_from', today)
    .gte('valid_to', today)
    .maybeSingle()
  if (!offer) return none
  if (nights < (offer.min_nights || 1)) return none
  const applicable = (offer.applicable_room_type_ids as string[] | null) || []
  if (applicable.length > 0 && !applicable.includes(roomTypeId)) return none
  let discount = 0
  if (offer.discount_type === 'percentage') {
    discount = Math.round((subtotal * Number(offer.discount_value)) / 100)
  } else {
    discount = Math.round(Number(offer.discount_value))
  }
  discount = Math.min(discount, subtotal)
  const name = (offer.name as any)?.en || (offer.name as any)?.id || code
  return { discount, offerId: offer.id, offerName: name }
}

/** Loyalty: guest with >=2 completed stays gets 5% member discount. */
export async function loyaltyDiscount(
  supabase: SupabaseClient,
  guestId: string | null,
  subtotal: number
): Promise<{ discount: number; isMember: boolean }> {
  if (!guestId) return { discount: 0, isMember: false }
  const { count } = await supabase
    .from('reservations')
    .select('id', { count: 'exact', head: true })
    .eq('guest_id', guestId)
    .eq('status', 'CHECKED_OUT')
  const isMember = (count || 0) >= 2
  return { discount: isMember ? Math.round(subtotal * 0.05) : 0, isMember }
}

/** Compute add-ons total. qty for per_person = guests, per_night *= nights. */
export async function addonsTotal(
  supabase: SupabaseClient,
  selections: AddonSelection[],
  nights: number,
  guests: number,
  currency: 'USD' | 'IDR' = 'USD'
): Promise<{ total: number; lines: Array<{ addonId: string; name: string; qty: number; unitPrice: number; total: number }> }> {
  if (!selections.length) return { total: 0, lines: [] }
  const ids = [...new Set(selections.map((s) => s.addonId))]
  const { data: addons } = await supabase
    .from('addons')
    .select('id,name,price,price_unit')
    .in('id', ids)
    .eq('is_active', true)
  const map = new Map((addons || []).map((a: any) => [a.id, a]))
  let total = 0
  const lines: Array<{ addonId: string; name: string; qty: number; unitPrice: number; total: number }> = []
  for (const sel of selections) {
    const a = map.get(sel.addonId) as any
    if (!a) continue
    let price = Number(a.price) // stored in USD
    if (currency === 'IDR') price = Math.round(convertCurrency(price, 'USD', 'IDR'))
    let qty = Math.max(1, sel.qty || 1)
    let lineTotal = price * qty
    if (a.price_unit === 'per_night') lineTotal = price * qty * nights
    else if (a.price_unit === 'per_person') lineTotal = price * guests
    else if (a.price_unit === 'per_person_night') lineTotal = price * guests * nights
    total += lineTotal
    const name = (a.name as any)?.en || (a.name as any)?.id || 'Add-on'
    lines.push({ addonId: a.id, name, qty, unitPrice: price, total: lineTotal })
  }
  return { total: Math.round(total), lines }
}

/** Full server-side price computation. Never trust browser amounts. */
export async function computeBookingPrice(
  supabase: SupabaseClient,
  opts: {
    roomTypeId: string
    nights: number
    guests: number
    currency: 'USD' | 'IDR'
    promoCode?: string
    checkIn?: string
    guestId?: string | null
    addons?: AddonSelection[]
    ratePlanId?: string
  }
): Promise<PriceBreakdown> {
  const { data: rt } = await supabase
    .from('room_types')
    .select('id,base_price')
    .eq('id', opts.roomTypeId)
    .single()
  let rate = Number((rt as any)?.base_price || 0)
  let ratePlanId: string | null = null
  let ratePlanName: string | null = null

  // Rate plan override (DB wins; must belong to this room type & be active)
  if (opts.ratePlanId) {
    const { data: rp } = await supabase
      .from('rate_plans')
      .select('id,name,base_price,room_type_id,is_active,min_stay')
      .eq('id', opts.ratePlanId)
      .eq('is_active', true)
      .single()
    if (rp && (rp as any).room_type_id === opts.roomTypeId && opts.nights >= Number((rp as any).min_stay || 1)) {
      rate = Number((rp as any).base_price)
      ratePlanId = (rp as any).id
      const nm = (rp as any).name
      ratePlanName = nm?.en || nm?.id || 'Rate plan'
    }
  }
  if (opts.currency === 'IDR') rate = Math.round(convertCurrency(rate, 'USD', 'IDR'))

  const subtotal = rate * opts.nights
  const addons = await addonsTotal(supabase, opts.addons || [], opts.nights, opts.guests, opts.currency)
  const promo = await validatePromo(
    supabase, opts.promoCode || '', opts.roomTypeId, opts.nights, subtotal, opts.checkIn || ''
  )
  const loyalty = await loyaltyDiscount(supabase, opts.guestId || null, subtotal - promo.discount)
  const discount = promo.discount + loyalty.discount
  const taxable = Math.max(0, subtotal + addons.total - discount)
  const tax = Math.round(taxable * 0.11)
  const fee = Math.round(taxable * 0.05)
  const total = taxable + tax + fee

  return {
    rate, nights: opts.nights, subtotal,
    addonsTotal: addons.total,
    discount,
    appliedOfferId: promo.offerId,
    appliedOfferName: promo.offerName,
    loyaltyDiscount: loyalty.discount,
    isLoyaltyMember: loyalty.isMember,
    tax, fee, total,
    currency: opts.currency,
    ratePlanId, ratePlanName,
  }
}

/** Parse addon selections from query params: addon=<id> (qty 1) or addon_<id>=<qty>. */
export function parseAddons(sp: Record<string, string | string[]>): AddonSelection[] {
  const out: AddonSelection[] = []
  const raw = sp.addon
  const list = Array.isArray(raw) ? raw : raw ? [raw] : []
  for (const id of list) {
    if (typeof id === 'string' && id) {
      const qkey = `addon_qty_${id}`
      const qraw = sp[qkey]
      const qty = Math.max(1, Number(Array.isArray(qraw) ? qraw[0] : qraw) || 1)
      out.push({ addonId: id, qty })
    }
  }
  return out
}
