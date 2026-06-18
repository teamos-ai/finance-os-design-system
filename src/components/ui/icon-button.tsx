/**
 * IconButton — Finance OS.
 *
 * Square, icon-only. Dark-luxury pill by default — the solid play button. Fixed box
 * dimensions per size (h/w) so the target is predictable regardless of the icon child.
 * `aria-label` is required, since there is no visible text.
 *
 * 8px squircle, gold focus ring, active scale, reduced-motion safe (no JS motion).
 * The `accent` variant is the gold CTA fill, mirroring Button's primary tokens.
 */
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const iconButton = cva(
  'inline-flex shrink-0 items-center justify-center rounded-md ' +
    'transition-all duration-fast ease-out active:scale-[0.96] ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
    'focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ' +
    'disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        dark: 'bg-inverse text-inverse-fg hover:brightness-110',
        outline: 'border border-border-strong text-fg hover:bg-fg hover:text-canvas',
        soft: 'bg-accent-soft text-accent-text hover:brightness-105',
        ghost: 'text-fg hover:bg-accent-soft',
        accent: 'bg-accent text-accent-fg hover:bg-accent-hover',
      },
      size: { sm: 'h-9 w-9', md: 'h-11 w-11', lg: 'h-12 w-12' },
    },
    defaultVariants: { variant: 'dark', size: 'md' },
  },
)

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>,
    VariantProps<typeof iconButton> {
  as?: React.ElementType
  /** Accessible name — icon-only buttons have no text, so this is required. */
  'aria-label': string
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, as: Comp = 'button', ...props }, ref) => (
    <Comp ref={ref} className={cn(iconButton({ variant, size }), className)} {...props} />
  ),
)
IconButton.displayName = 'IconButton'

export { iconButton as iconButtonVariants }
