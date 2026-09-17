'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Locale, Currency } from '@/types'
import { APP_CONFIG } from '@/config'
import { translations } from './translations'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return m ? decodeURIComponent(m[1]) : null
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return
  const maxAge = days * 24 * 60 * 60
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

export { translations }

interface I18nContextType {
  locale: Locale
  currency: Currency
  setLocale: (locale: Locale) => void
  setCurrency: (currency: Currency) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({
  children,
  initialLocale = APP_CONFIG.defaultLocale,
  initialCurrency = APP_CONFIG.defaultCurrency,
}: {
  children: ReactNode
  initialLocale?: Locale
  initialCurrency?: Currency
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const [currency, setCurrencyState] = useState<Currency>(initialCurrency)
  const router = useRouter()

  // Sync from cookie + localStorage on mount (cookies are source of truth for SSR)
  useEffect(() => {
    const cookieLocale = getCookie('locale') as Locale | null
    const cookieCurrency = getCookie('currency') as Currency | null
    const lsLocale = typeof window !== 'undefined' ? (localStorage.getItem('locale') as Locale | null) : null
    const lsCurrency = typeof window !== 'undefined' ? (localStorage.getItem('currency') as Currency | null) : null

    const effectiveLocale = (cookieLocale && (APP_CONFIG.supportedLocales as readonly string[]).includes(cookieLocale) ? cookieLocale : null)
      || (lsLocale && (APP_CONFIG.supportedLocales as readonly string[]).includes(lsLocale) ? lsLocale : null)
      || initialLocale
    let effectiveCurrency: Currency | null = (cookieCurrency && (APP_CONFIG.supportedCurrencies as readonly string[]).includes(cookieCurrency) ? cookieCurrency : null)
      || (lsCurrency && (APP_CONFIG.supportedCurrencies as readonly string[]).includes(lsCurrency) ? lsCurrency : null)
      || initialCurrency
    // if currency was not explicitly stored but locale indicates, infer IDR for id
    if (!cookieCurrency && !lsCurrency && effectiveLocale === 'id' && effectiveCurrency === 'USD' && initialCurrency === 'USD') {
      effectiveCurrency = 'IDR'
    }

    if (effectiveLocale !== locale) setLocaleState(effectiveLocale)
    if (effectiveCurrency !== currency) setCurrencyState(effectiveCurrency)

    // keep cookie & storage in sync, and html lang
    setCookie('locale', effectiveLocale)
    setCookie('currency', effectiveCurrency)
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', effectiveLocale)
      localStorage.setItem('currency', effectiveCurrency)
      document.documentElement.lang = effectiveLocale
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // keep html lang synced on change
  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = locale
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    // Couple bahasa -> mata uang otomatis: id => IDR, en => USD
    const autoCurrency: Currency = newLocale === 'id' ? 'IDR' : 'USD'
    setLocaleState(newLocale)
    setCurrencyState(autoCurrency)
    setCookie('locale', newLocale)
    setCookie('currency', autoCurrency)
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale)
      localStorage.setItem('currency', autoCurrency)
      document.documentElement.lang = newLocale
    }
    // trigger server revalidation so server components re-render with new locale
    router.refresh()
  }

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    setCookie('currency', newCurrency)
    if (typeof window !== 'undefined') {
      localStorage.setItem('currency', newCurrency)
    }
    router.refresh()
  }

  const t = (key: string, params?: Record<string, string | number>) => {
    let translation = translations[locale][key] || translations[APP_CONFIG.defaultLocale][key] || key
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        translation = translation.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
      })
    }
    return translation
  }

  return (
    <I18nContext.Provider value={{ locale, currency, setLocale, setCurrency, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

export function getTranslation(locale: Locale, key: string, params?: Record<string, string | number>) {
  let translation = translations[locale][key] || translations[APP_CONFIG.defaultLocale][key] || key
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      translation = translation.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
    })
  }
  return translation
}