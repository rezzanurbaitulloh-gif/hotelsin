'use client'
import { useI18n } from '@/lib/i18n'
import { formatCurrency, convertCurrency } from '@/lib/utils'

export function Price({ amount, originalCurrency = 'USD', showRate = false, className }: { amount: number, originalCurrency?: 'USD'|'IDR', showRate?: boolean, className?: string }) {
  const { currency, locale } = useI18n()
  const converted = convertCurrency(amount, originalCurrency, currency)
  const formatted = formatCurrency(converted, currency, locale)
  return <span className={className}>{formatted}{showRate ? ` ${locale === 'id' ? '/ malam' : '/ night'}` : ''}</span>
}

export function PriceFrom({ amount, originalCurrency = 'USD' }: { amount: number, originalCurrency?: 'USD'|'IDR' }) {
  const { t } = useI18n()
  return <span>{t('rooms.from')} <Price amount={amount} originalCurrency={originalCurrency} showRate /></span>
}

// For server-like usage where you have already converted value and just want formatting, also reactive
export function PriceInline({ amount, currency: forcedCurrency }: { amount: number; currency?: 'USD'|'IDR' }) {
  const { currency: ctxCurrency, locale } = useI18n()
  const cur = forcedCurrency ?? ctxCurrency
  return <span>{formatCurrency(convertCurrency(amount, 'USD', cur), cur, locale)}</span>
}
