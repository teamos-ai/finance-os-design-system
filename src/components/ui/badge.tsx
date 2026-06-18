/**
 * Badge — small mono pill. Token-only tonal recipes. `rounded-pill` is one of the two
 * intentional exceptions to the 8px-squircle rule (the other is ThemeToggle).
 */
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const badge = cva(
  'inline-flex items-center gap-1.5 rounded-pill font-mono font-bold uppercase whitespace-nowrap',
  {
    variants: {
      variant: {
        neutral: 'bg-elevated text-fg-muted',
        gold: 'bg-accent-soft text-accent-text',
        amber: 'bg-amber-soft text-amber-text',
        blue: 'bg-brand-soft text-brand',
        success: 'bg-success-soft text-success',
        warn: 'bg-warning-soft text-warning',
        danger: 'bg-danger-soft text-danger',
        info: 'bg-info-soft text-info',
        outline: 'border border-border-strong text-fg-muted',
      },
      size: {
        sm: 'text-[0.625rem] tracking-[0.1em] px-2 py-0.5',
        md: 'text-mono-xs px-2.5 py-1',
      },
    },
    defaultVariants: { variant: 'neutral', size: 'md' },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badge> {
  dot?: boolean
  emoji?: string
}

export const Badge = ({ className, variant, size, dot, emoji, children, ...props }: BadgeProps) => (
  <span className={cn(badge({ variant, size }), className)} {...props}>
    {dot && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />}
    {emoji && <span aria-hidden>{emoji}</span>}
    {children}
  </span>
)

export { badge as badgeVariants }
