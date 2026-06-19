/**
 * Button — Finance OS.
 *
 * Primary CTA = `variant="primary"` (amber fill, dark label — AA). The signature
 * gradient CTA = `variant="gradient"` with an amber glow (use sparingly). The dark
 * luxury pill = `variant="dark"` (fixed near-black, same on every theme).
 *
 * 8px squircle by default (the global maximum), never a full pill. Glow only on the
 * gradient CTA; neutral variants use soft shadows. Focus ring = the amber --c-ring.
 * Active scale 0.98. Don't stack two primary CTAs. Token-only — zero rogue hex.
 */
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const button = cva(
  'inline-flex items-center justify-center gap-2 rounded-md font-display font-medium select-none ' +
    'transition-all duration-fast ease-out ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
    'focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ' +
    'disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-accent-fg hover:bg-accent-hover',
        secondary: 'bg-brand-solid text-brand-fg hover:brightness-110',
        ghost: 'bg-transparent text-fg hover:bg-accent-soft',
        dark: 'bg-inverse text-inverse-fg hover:brightness-110',
        gradient: 'bg-gradient-accent text-accent-fg hover:brightness-[1.04] shadow-glow',
        link: 'bg-transparent text-accent-text hover:opacity-80 underline underline-offset-4 decoration-1 p-0 rounded-none',
        danger: 'bg-danger-solid text-danger-fg hover:brightness-95',
        soft: 'bg-accent-soft text-accent-text hover:brightness-105',
        outline: 'bg-transparent text-fg border border-border-strong hover:bg-fg hover:text-canvas',
      },
      size: {
        sm: 'text-body-sm py-2 px-4',
        md: 'text-body-md py-2.5 px-6',
        lg: 'text-body-md py-3.5 px-8',
      },
    },
    compoundVariants: [{ variant: 'link', className: 'py-0 px-0 active:scale-100' }],
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  as?: React.ElementType
  /** small chip rendered before the label (e.g. a play badge) */
  leadingIcon?: React.ReactNode
  /** anchor props — valid when `as="a"` */
  href?: string
  target?: string
  rel?: string
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, as: Comp = 'button', leadingIcon, children, ...props }, ref) => {
    const onAccent = variant === 'primary' || variant === 'gradient'
    return (
      <Comp ref={ref} className={cn(button({ variant, size }), className)} {...props}>
        {leadingIcon != null && (
          <span
            aria-hidden
            className={cn(
              'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm',
              onAccent ? 'bg-black/15 text-current' : 'bg-accent-soft text-current',
            )}
          >
            {leadingIcon}
          </span>
        )}
        {children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { button as buttonVariants }
