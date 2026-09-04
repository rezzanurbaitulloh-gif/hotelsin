'use client'
import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { I18nProvider } from '@/lib/i18n'
import { Toaster } from '@/components/ui/toaster'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <I18nProvider>
        {children}
        <Toaster />
      </I18nProvider>
    </ThemeProvider>
  )
}
