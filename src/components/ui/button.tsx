/* -------------------------------------------------------------------------- */
/*  Button.tsx – CTA principal con gradiente de marca y micro-interacciones  */
/* -------------------------------------------------------------------------- */
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ---------- Variantes base ---------- */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center font-semibold',
    'transition-all duration-300 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00FFC3]',
    'disabled:opacity-50 disabled:pointer-events-none',
    'shadow-xl',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-[#00C6FF] to-[#00FFAA] text-white',
        secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/15',
        ghost: 'bg-transparent text-white hover:bg-white/10',
      },
      size: {
        sm: 'h-9 px-4 rounded-full text-sm',
        md: 'h-12 px-6 rounded-full',
        lg: 'h-14 px-8 rounded-full text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      /* ---------- ESTILO + MICRO-ANIMACIONES ---------- */
      className={cn(
        buttonVariants({ variant, size }),
        'hover:brightness-110 hover:scale-[1.03] active:scale-95',
        'animate-in fade-in',
        className
      )}
      {...props}
    />
  )
)
Button.displayName = 'Button'