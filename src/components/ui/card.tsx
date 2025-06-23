/* ---------------------------------- Card.tsx ----------------------------------- */
import * as React from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        [
          'rounded-3xl border border-white/15',
          'bg-white/10 backdrop-blur-xl text-white',
          'shadow-[0_10px_40px_rgba(0,0,0,0.25)] p-10',
        ].join(' '),
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('pb-6', className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-4xl font-extrabold text-center tracking-wide', className)} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('pt-0 space-y-6', className)} {...props} />
}