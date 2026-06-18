/**
 * CommandBar — the command-palette search input that anchors the hero.
 * Leading Search icon, mono placeholder ("type / for commands"), a trailing
 * ⌘K kbd hint. Flat hairline + soft shadow, amber focus ring, zero glass.
 *
 * `size="hero"` is the large hero variant; `size="md"` is the in-nav search.
 * It's a real, focusable input — wire `value`/`onChange` if you need it live.
 */
import * as React from 'react'
import { Search } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const bar = cva(
  'group flex items-center gap-3 rounded-lg border border-border bg-surface ' +
    'transition-all duration-base ease-out shadow-sm ' +
    'focus-within:border-border-strong focus-within:shadow-md focus-within:ring-2 focus-within:ring-ring',
  {
    variants: {
      size: {
        hero: 'px-5 py-4',
        md: 'px-4 py-2.5',
      },
    },
    defaultVariants: { size: 'hero' },
  }
)

export interface CommandBarProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof bar> {
  /** show the trailing ⌘K hint (default true) */
  shortcut?: boolean
  containerClassName?: string
}

export const CommandBar = React.forwardRef<HTMLInputElement, CommandBarProps>(
  (
    {
      size,
      shortcut = true,
      className,
      containerClassName,
      placeholder = 'Search the platform — type / for commands',
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const iconSize = size === 'md' ? 18 : 22
    return (
      <div className={cn(bar({ size }), containerClassName)}>
        <Search
          className="shrink-0 text-fg-subtle transition-colors group-focus-within:text-accent-text"
          width={iconSize}
          height={iconSize}
          strokeWidth={1.5}
          aria-hidden
        />
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          aria-label={ariaLabel ?? 'Search the platform'}
          className={cn(
            'w-full bg-transparent font-mono text-fg placeholder:text-fg-subtle focus:outline-none',
            size === 'md' ? 'text-body-sm' : 'text-body-md',
            className
          )}
          {...props}
        />
        {shortcut && (
          <kbd
            className={cn(
              'hidden shrink-0 items-center gap-0.5 rounded-md border border-border bg-inset',
              'px-2 py-1 font-mono text-caption text-fg-muted sm:inline-flex'
            )}
          >
            ⌘K
          </kbd>
        )}
      </div>
    )
  }
)
CommandBar.displayName = 'CommandBar'
