/**
 * CommandChip — the `/command` pill. Card surface, hairline border,
 * Anonymous Pro, the leading "/" picked out in gold. Sits beneath the command bar as
 * a quick-action suggestion. Renders a button; pass `onClick` to wire it.
 */
import * as React from 'react'
import { cn } from '@/lib/cn'

export interface CommandChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** the command text WITHOUT the leading slash, e.g. "set up online booking" */
  command: string
}

export const CommandChip = React.forwardRef<HTMLButtonElement, CommandChipProps>(
  ({ command, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'group inline-flex items-center gap-1.5 rounded-full border border-border bg-surface',
        'px-3.5 py-2 font-body text-body-sm text-fg-muted',
        'transition-all duration-fast ease-out hover:border-border-strong hover:text-fg hover:shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
        className
      )}
      {...props}
    >
      <span className="font-bold text-accent-text">/</span>
      <span>{command}</span>
    </button>
  )
)
CommandChip.displayName = 'CommandChip'
