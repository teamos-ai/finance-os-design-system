/**
 * MonoLabel — the uppercase Anonymous Pro overline used across the system.
 * A mono kicker with optional leading number + dot. Token-only colours.
 */
import * as React from 'react'
import { cn } from '@/lib/cn'

export type MonoTone = 'fg' | 'accent' | 'amber' | 'brand' | 'success' | 'subtle'

const TONE: Record<MonoTone, { text: string; mark: string }> = {
  fg: { text: 'text-fg-muted', mark: 'bg-fg-subtle' },
  accent: { text: 'text-accent-text', mark: 'bg-accent' },
  amber: { text: 'text-amber-text', mark: 'bg-amber' },
  brand: { text: 'text-brand', mark: 'bg-brand' },
  success: { text: 'text-success', mark: 'bg-success' },
  subtle: { text: 'text-fg-subtle', mark: 'bg-fg-subtle' },
}

export interface MonoLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: MonoTone
  /** small leading index, e.g. "05" */
  number?: string
  /** show a leading dot in the tone colour */
  dot?: boolean
  /** trailing node (e.g. a count) */
  trailing?: React.ReactNode
  size?: 'sm' | 'md'
}

export const MonoLabel = ({
  tone = 'accent',
  number,
  dot = false,
  trailing,
  size = 'md',
  className,
  children,
  ...props
}: MonoLabelProps) => {
  const t = TONE[tone]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-mono font-bold uppercase',
        size === 'sm' ? 'text-[0.625rem] tracking-[0.14em]' : 'text-mono-xs',
        t.text,
        className,
      )}
      {...props}
    >
      {dot && <span aria-hidden className={cn('h-1.5 w-1.5 rounded-full', t.mark)} />}
      {number && <span className="tabular-nums opacity-70">{number}</span>}
      {children}
      {trailing && <span className="opacity-70">{trailing}</span>}
    </span>
  )
}
