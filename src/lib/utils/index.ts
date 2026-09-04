import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number,
  currency: 'USD' | 'IDR' = 'USD',
  locale: 'en' | 'id' = 'en'
) {
  return new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'IDR' ? 0 : 2,
    maximumFractionDigits: currency === 'IDR' ? 0 : 2,
  }).format(amount)
}

export function formatDate(
  date: string | Date,
  locale: 'en' | 'id' = 'en',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
) {
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', options).format(
    new Date(date)
  )
}

export function formatDateTime(
  date: string | Date,
  locale: 'en' | 'id' = 'en'
) {
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function calculateTotal(
  roomRate: number,
  nights: number,
  taxRate: number = 0.11,
  feeAmount: number = 0,
  discount: number = 0
): { subtotal: number; tax: number; fees: number; discount: number; total: number } {
  const subtotal = roomRate * nights
  const tax = subtotal * taxRate
  const fees = feeAmount
  const total = subtotal + tax + fees - discount
  return { subtotal, tax, fees, discount, total }
}

export const EXCHANGE_RATE = 16000 // 1 USD = 16000 IDR (approximate)

export function convertCurrency(
  amount: number,
  from: 'USD' | 'IDR',
  to: 'USD' | 'IDR'
): number {
  if (from === to) return amount
  if (from === 'USD' && to === 'IDR') return amount * EXCHANGE_RATE
  if (from === 'IDR' && to === 'USD') return amount / EXCHANGE_RATE
  return amount
}