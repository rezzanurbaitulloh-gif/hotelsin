'use client'
import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { I18nProvider } from '@/lib/i18n'
import { Toaster } from '@/components/ui/toaster'
import { Locale, Currency } from '@/types'

export function Providers({ children, initialLocale, initialCurrency }: { children: ReactNode, initialLocale?: Locale, initialCurrency?: Currency }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <I18nProvider initialLocale={initialLocale} initialCurrency={initialCurrency}>
        {children}
        <Toaster />
      </I18nProvider>
    </ThemeProvider>
  )
}
