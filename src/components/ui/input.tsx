import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'w-full h-12 px-4 py-2',
        'rounded-[0.75rem]', // esquinas suaves pro
        'bg-white/10 backdrop-blur-md',
        'border border-white/10',
        'text-white placeholder-white/50',
        'shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]',
        'transition-all duration-300 ease-out',
        'hover:border-white/20',
        'focus:outline-none focus:ring-2 focus:ring-[#FF6600]/50',
        'focus:border-[#FF6600]/40',
        'animate-in fade-in',
        className
      )}
      {...props}
    />
  )
)

Input.displayName = 'Input'