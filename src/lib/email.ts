import type { SupabaseClient } from '@supabase/supabase-js'

// Email abstraction: uses Resend when RESEND_API_KEY is set,
// otherwise logs (dev fallback) so booking never crashes.

interface SendEmailOpts {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(opts: SendEmailOpts): Promise<{ ok: boolean; id?: string; skipped?: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || 'HotelsIn <reservations@hotelsin.com>'
  if (!apiKey) {
    console.log(`[email:skipped] to=${opts.to} subject=${opts.subject}`)
    return { ok: true, skipped: true }
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: opts.to, subject: opts.subject, html: opts.html, text: opts.text }),
    })
    const data = (await res.json().catch(() => ({}))) as any
    if (!res.ok) return { ok: false, error: data?.message || 'Resend error' }
    return { ok: true, id: data?.id }
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Email failed' }
  }
}

export function bookingConfirmationEmail(opts: {
  guestName: string
  confirmationCode: string
  roomName: string
  checkIn: string
  checkOut: string
  nights: number
  total: string
  siteUrl: string
  manageUrl: string
}): { subject: string; html: string; text: string } {
  const subject = `Booking Confirmed — ${opts.confirmationCode} | HotelsIn`
  const html = `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a18">
    <h1 style="font-weight:400">HotelsIn</h1>
    <p>Dear ${opts.guestName},</p>
    <p>Your reservation is <strong>confirmed</strong>. We look forward to welcoming you.</p>
    <div style="border:1px solid #e8e4dc;border-radius:8px;padding:16px;margin:16px 0">
      <p style="font-size:22px;letter-spacing:4px;font-family:monospace">${opts.confirmationCode}</p>
      <p><strong>${opts.roomName}</strong></p>
      <p>${opts.checkIn} → ${opts.checkOut} • ${opts.nights} night(s)</p>
      <p><strong>Total: ${opts.total}</strong></p>
    </div>
    <p><a href="${opts.manageUrl}">View / manage your reservation</a></p>
    <p style="color:#6b6b65;font-size:12px">Jalan Raya Ubud No. 88, Sayan, Ubud, Bali • +62 361 975 888</p>
  </div>`
  const text = `HotelsIn — Booking Confirmed ${opts.confirmationCode}\n${opts.roomName}\n${opts.checkIn} -> ${opts.checkOut} (${opts.nights} nights)\nTotal: ${opts.total}\nManage: ${opts.manageUrl}`
  return { subject, html, text }
}

/** Persist an audit log row (best-effort, never throws). */
export async function auditLog(
  supabase: SupabaseClient,
  entry: { property_id?: string | null; actor_email?: string | null; actor_role?: string | null; action: string; entity?: string; entity_id?: string; detail?: any }
): Promise<void> {
  try {
    await supabase.from('audit_logs').insert({
      property_id: entry.property_id || null,
      actor_email: entry.actor_email || null,
      actor_role: entry.actor_role || null,
      action: entry.action,
      entity: entry.entity || null,
      entity_id: entry.entity_id || null,
      detail: entry.detail || {},
    })
  } catch {
    // best effort only
  }
}

/** WhatsApp deep links (no gateway key needed): guest chat + admin notify-to-send link. */
export function waLink(phone: string, message: string): string {
  const clean = phone.replace(/[^0-9]/g, '')
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}
