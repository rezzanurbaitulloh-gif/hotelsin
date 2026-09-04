'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const AspectRatio = React.forwardRef<
  React.ElementRef<'div'>,
  React.HTMLAttributes<HTMLDivElement> & { ratio?: number }
>(({ className, ratio = 16 / 9, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('relative w-full', className)}
    style={{ position: 'relative', width: '100%' }}
    {...props}
  >
    <div style={{ paddingTop: `${100 / ratio}%` }} />
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      {children}
    </div>
  </div>
))
AspectRatio.displayName = 'AspectRatio'

export { AspectRatio }