'use client'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

export function PrintButton({ label = 'CETAK INVOICE' }: { label?: string }) {
  return (
    <Button onClick={() => window.print()} variant="outline" className="h-9 text-xs">
      <Printer className="mr-2 h-3 w-3" />{label}
    </Button>
  )
}
