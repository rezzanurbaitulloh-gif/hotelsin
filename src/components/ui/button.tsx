import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-foreground/20 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-brand-foreground text-brand-background hover:bg-brand-foreground/90 h-10 px-4 py-2':
              variant === 'default',
            'bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2':
              variant === 'destructive',
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2':
              variant === 'outline',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2':
              variant === 'secondary',
            'hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2': variant === 'ghost',
            'text-primary underline-offset-4 hover:underline h-10 px-4 py-2': variant === 'link',
            'h-9 rounded-md px-3 text-xs': size === 'sm',
            'h-11 rounded-lg px-8 text-base': size === 'lg',
            'h-12 rounded-lg px-10 text-lg': size === 'xl',
            'h-10 w-10': size === 'icon',
          }
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }