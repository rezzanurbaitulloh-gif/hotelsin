import { cookies } from 'next/headers'
import { Locale, Currency } from '@/types'
import { APP_CONFIG } from '@/config'
import { translations } from './translations'

export async function getLocaleFromCookies(): Promise<Locale> {
  const c = await cookies()
  const v = c.get('locale')?.value as Locale | undefined
  if (v && (APP_CONFIG.supportedLocales as readonly string[]).includes(v)) return v
  return APP_CONFIG.defaultLocale as Locale
}

export async function getCurrencyFromCookies(): Promise<Currency> {
  const c = await cookies()
  const v = c.get('currency')?.value as Currency | undefined
  if (v && (APP_CONFIG.supportedCurrencies as readonly string[]).includes(v)) return v
  // infer from locale if currency not set — id => IDR, en => USD
  const localeVal = c.get('locale')?.value as Locale | undefined
  if (localeVal === 'id') return 'IDR'
  if (localeVal === 'en') return 'USD'
  // fallback to locale default
  const locale = await getLocaleFromCookies()
  if (locale === 'id') return 'IDR'
  return APP_CONFIG.defaultCurrency as Currency
}

export async function getI18nFromCookies(): Promise<{ locale: Locale; currency: Currency }> {
  const locale = await getLocaleFromCookies()
  const currency = await getCurrencyFromCookies()
  return { locale, currency }
}

export function getTranslationServer(locale: Locale, key: string, params?: Record<string, string | number>) {
  let t = translations[locale]?.[key] ?? translations[APP_CONFIG.defaultLocale as Locale]?.[key] ?? key
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      t = t.replace(new RegExp(`{{${k}}}`, 'g'), String(v))
    })
  }
  return t
}

export function pickLocalized<T extends { en: string; id: string }>(value: T | null | undefined, locale: Locale): string {
  if (!value) return ''
  return (value as any)[locale] ?? value.en ?? ''
}
