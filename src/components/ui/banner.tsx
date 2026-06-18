/**
 * Banner — alert / announcement strips for websites, funnels, countdowns and timers.
 * Three brand surfaces (modeled on the Health OS banner set): a colourful gradient bar,
 * a dark luxury bar, and a warm paper bar — plus soft tonal variants. Optional leading
 * icon, trailing action, and dismiss. `Ticker` is the scrolling marquee variant.
 * Token-only; reduced-motion safe.
 */
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

const banner = cva('flex items-center gap-3 px-4 py-3 font-mono text-body-sm', {
  variants: {
    variant: {
      gradient: 'bg-gradient-accent text-accent-fg',
      dark: 'bg-inverse text-inverse-fg',
      paper: 'bg-canvas-muted text-fg border-y border-border',
      soft: 'bg-amber-soft text-amber-text border-y border-border',
      info: 'bg-brand-soft text-brand border-y border-border',
    },
    align: { left: 'justify-start text-left', center: 'justify-center text-center' },
  },
  defaultVariants: { variant: 'gradient', align: 'center' },
})

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof banner> {
  icon?: LucideIcon
  action?: React.ReactNode
  onDismiss?: () => void
}

export const Banner = ({ variant, align, icon: Icon, action, onDismiss, className, children, ...props }: BannerProps) => (
  <div role="status" className={cn(banner({ variant, align }), className)} {...props}>
    {Icon && <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />}
    <span className="min-w-0">{children}</span>
    {action && <span className="ml-1 shrink-0">{action}</span>}
    {onDismiss && (
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onDismiss}
        className="ml-2 shrink-0 rounded-sm p-1 opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      </button>
    )}
  </div>
)

export interface TickerProps {
  items: { Icon: LucideIcon; text: string }[]
  variant?: 'gradient' | 'dark' | 'paper'
  /** seconds per loop (lower = faster) */
  speed?: number
  reverse?: boolean
  className?: string
}

/* CSS-driven marquee (renders two copies, translates -50%) — pauses on hover and
   freezes under prefers-reduced-motion via the global guard. */
export const Ticker = ({ items, variant = 'dark', speed = 40, reverse = false, className }: TickerProps) => {
  const tone =
    variant === 'gradient'
      ? 'bg-gradient-accent text-accent-fg'
      : variant === 'dark'
        ? 'bg-inverse text-inverse-fg'
        : 'bg-canvas-muted text-fg border-y border-border'
  return (
    <div className={cn('group w-full overflow-hidden py-2.5', tone, className)}>
      <div
        className="flex w-max animate-marquee gap-12 group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-12" aria-hidden={copy === 1}>
            {items.map((it, i) => (
              <span key={i} className="flex items-center gap-2 whitespace-nowrap font-mono text-mono-xs uppercase">
                <it.Icon className="h-3 w-3 shrink-0" strokeWidth={1.5} aria-hidden />
                {it.text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export { banner as bannerVariants }
