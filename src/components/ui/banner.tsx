/**
 * Banner — alert / announcement strips for websites, funnels, countdowns and timers.
 *
 * FIXED brand set (theme-independent — identical in dark, light AND paper):
 *   black · orange (amber gradient) · blue (Atlas-blue gradient) · paper (ivory) · white.
 * Plus theme-semantic variants: `gradient` (theme accent), `dark`, `soft`, `info`.
 * Optional leading icon, trailing action, dismiss. `Ticker` = scrolling marquee.
 * Token-only; reduced-motion safe.
 */
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

/* The five fixed brand surfaces draw from theme-independent --banner-* tokens, so a
   "blue banner" stays blue in every mode. Gradients need background-image, so colour
   is applied via inline style referencing the tokens (still zero rogue hex). */
const FIXED_STYLE = {
  black: { background: 'var(--banner-black-bg)', color: 'var(--banner-black-fg)', borderColor: 'var(--banner-black-bd)' },
  orange: { background: 'var(--banner-orange-bg)', color: 'var(--banner-orange-fg)' },
  blue: { background: 'var(--banner-blue-bg)', color: 'var(--banner-blue-fg)' },
  paper: { background: 'var(--banner-paper-bg)', color: 'var(--banner-paper-fg)', borderColor: 'var(--banner-paper-bd)' },
  white: { background: 'var(--banner-white-bg)', color: 'var(--banner-white-fg)', borderColor: 'var(--banner-white-bd)' },
} as const

type FixedVariant = keyof typeof FIXED_STYLE
const isFixed = (v: string | null | undefined): v is FixedVariant =>
  v === 'black' || v === 'orange' || v === 'blue' || v === 'paper' || v === 'white'

const banner = cva('flex items-center gap-3 px-4 py-3 font-mono text-body-sm', {
  variants: {
    variant: {
      black: 'border-y',
      orange: '',
      blue: '',
      paper: 'border-y',
      white: 'border-y',
      gradient: 'bg-gradient-accent text-accent-fg',
      dark: 'bg-inverse text-inverse-fg',
      soft: 'bg-amber-soft text-amber-text border-y border-border',
      info: 'bg-brand-soft text-brand border-y border-border',
    },
    align: { left: 'justify-start text-left', center: 'justify-center text-center' },
  },
  defaultVariants: { variant: 'orange', align: 'center' },
})

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof banner> {
  icon?: LucideIcon
  action?: React.ReactNode
  onDismiss?: () => void
}

export const Banner = ({ variant, align, icon: Icon, action, onDismiss, className, style, children, ...props }: BannerProps) => (
  <div
    role="status"
    className={cn(banner({ variant, align }), className)}
    style={isFixed(variant) ? { ...FIXED_STYLE[variant], ...style } : style}
    {...props}
  >
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
  variant?: FixedVariant | 'gradient' | 'dark'
  /** seconds per loop (lower = faster) */
  speed?: number
  reverse?: boolean
  className?: string
}

/* CSS-driven marquee (renders two copies, translates -50%) — pauses on hover and
   freezes under prefers-reduced-motion via the global guard. */
export const Ticker = ({ items, variant = 'dark', speed = 40, reverse = false, className }: TickerProps) => {
  const toneClass =
    variant === 'gradient' ? 'bg-gradient-accent text-accent-fg' : variant === 'dark' ? 'bg-inverse text-inverse-fg' : ''
  return (
    <div
      className={cn('group w-full overflow-hidden py-2.5', toneClass, isFixed(variant) ? 'border-y' : '', className)}
      style={isFixed(variant) ? FIXED_STYLE[variant] : undefined}
    >
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
