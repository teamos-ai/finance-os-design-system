/**
 * Stat — a big outcome figure with a calm label. Uses CountUp (reduced-motion safe).
 * For an outcome band like "8 systems → 1 · 12 hrs returned · live in 30 days".
 * Pass a non-numeric `display` (e.g. "30 days") when the figure isn't a clean count.
 */
import { CountUp } from '@/lib/motion'
import { cn } from '@/lib/cn'

export interface StatProps {
  /** numeric value to count up to (ignored if `display` is set) */
  value?: number
  /** static display string used instead of a count-up, e.g. "6–8 → 1" */
  display?: string
  label: string
  prefix?: string
  suffix?: string
  decimals?: number
  align?: 'left' | 'center'
  className?: string
}

export const Stat = ({
  value,
  display,
  label,
  prefix = '',
  suffix = '',
  decimals = 0,
  align = 'left',
  className,
}: StatProps) => (
  <div className={cn('flex flex-col gap-1.5', align === 'center' && 'items-center text-center', className)}>
    <span className="font-display text-display-lg leading-none text-fg">
      {display ?? <CountUp to={value ?? 0} prefix={prefix} suffix={suffix} decimals={decimals} />}
    </span>
    <span className="font-mono text-body-sm text-fg-muted">{label}</span>
  </div>
)
