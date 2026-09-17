'use client'
import { useI18n } from '@/lib/i18n'

export function T({ k, fallback }: { k: string, fallback?: string }) {
  const { t } = useI18n()
  const val = t(k)
  return <>{val === k ? (fallback || k) : val}</>
}
