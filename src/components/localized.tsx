'use client'
import { useI18n } from '@/lib/i18n'
import { LocalizedString } from '@/types'

export function LocalizedText({ value, fallback }: { value?: LocalizedString | null; fallback?: string }) {
  const { locale } = useI18n()
  if (!value) return <>{fallback ?? ''}</>
  return <>{(value as any)[locale] ?? value.en ?? fallback ?? ''}</>
}

export function LocalizedInline({ en, id }: { en: string; id: string }) {
  const { locale } = useI18n()
  return <>{locale === 'id' ? id : en}</>
}

export function T({ k, params }: { k: string; params?: Record<string, string | number> }) {
  const { t } = useI18n()
  return <>{t(k, params)}</>
}

// For dates that must react to locale changes
export function FormattedDate({ value, options }: { value: string | Date; options?: Intl.DateTimeFormatOptions }) {
  const { locale } = useI18n()
  const d = new Date(value)
  if (isNaN(d.getTime())) return <>{String(value)}</>
  const fmt = new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', options ?? { year: 'numeric', month: 'long', day: 'numeric' })
  return <>{fmt.format(d)}</>
}

export function FormattedDateTime({ value }: { value: string | Date }) {
  const { locale } = useI18n()
  const d = new Date(value)
  if (isNaN(d.getTime())) return <>{String(value)}</>
  const fmt = new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
  return <>{fmt.format(d)}</>
}
