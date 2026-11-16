/**
 * StatusIcon — the shared semantic status glyph: yes (green check), no (red cross), warn (amber).
 *
 * One standard icon stroke (1.75), tokenised status colours (`text-success` / `text-danger` /
 * `text-amber-text`), a recognisable shape per state (so it never relies on colour alone), and an
 * accessible label. Used both in the Icons showcase and in the comparison Tables, so a check means the
 * same thing — and reads the same to a screen reader — everywhere it appears.
 */
import { Check, X, AlertTriangle, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export type StatusVariant = 'yes' | 'no' | 'warn'

const MAP: Record<StatusVariant, { Icon: LucideIcon; cls: string; label: string }> = {
  yes: { Icon: Check, cls: 'text-success', label: 'Yes' },
  no: { Icon: X, cls: 'text-danger', label: 'No' },
  warn: { Icon: AlertTriangle, cls: 'text-amber-text', label: 'Partial' },
}

export function StatusIcon({
  variant,
  label,
  size = 'md',
  className,
}: {
  variant: StatusVariant
  /** Accessible label — defaults to Yes / No / Partial. */
  label?: string
  size?: 'sm' | 'md'
  className?: string
}) {
  const { Icon, cls, label: fallback } = MAP[variant]
  const dim = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  return (
    <span role="img" aria-label={label ?? fallback} className={cn('inline-flex', cls, className)}>
      <Icon className={dim} strokeWidth={1.75} aria-hidden />
    </span>
  )
}
