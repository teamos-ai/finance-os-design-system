/**
 * Counters — a composed family of count up / down figures for the outcome and
 * scarcity moments (seats, memberships, tickets sold, a live countdown).
 *
 * Everything honours `prefers-reduced-motion` (numbers snap to their final
 * value, bars skip their grow) and animates only once it scrolls into view
 * (Framer's `useInView`, mirroring the lib CountUp). The live Countdown ticks
 * on a single setInterval that is cleared on unmount.
 *
 * Tokens only: font-display figures, font-mono labels, success (up) / amber
 * (warm, down) deltas — both AA on the page ground. Flat, 8px-max squircle
 * bars, neutral shadows, no glass.
 *
 * Exports: Counter · StatTrend · SeatsRemaining · TicketsSold · MembersCount · Countdown
 */
import * as React from 'react'
import { motion, useReducedMotion, useInView } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { ACCENTS, type Accent } from '@/lib/accents'
import { EASE_OUT } from '@/lib/motion'

/* ── useCountTo — shared rAF counter (up OR down), in-view + reduced-motion safe ──
   Animates from `from` to `to` once the bound element scrolls into view. */
function useCountTo(
  to: number,
  { from = 0, duration = 1.4 }: { from?: number; duration?: number } = {},
): { ref: React.RefObject<HTMLSpanElement>; value: number } {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduced = useReducedMotion()
  const [value, setValue] = React.useState(from)

  React.useEffect(() => {
    if (!inView) return
    if (reduced) {
      setValue(to)
      return
    }
    let raf = 0
    let start = 0
    const ms = Math.max(1, duration * 1000)
    const step = (ts: number) => {
      if (!start) start = ts
      const t = Math.min(1, (ts - start) / ms)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setValue(from + (to - from) * eased)
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, to, from, duration])

  return { ref, value }
}

/* ── Counter — counts up OR down to a target ──
   Direction is inferred from `from` → `to` (override with `direction`). */
export interface CounterProps {
  to: number
  /** starting figure; defaults to 0 for an up-count — pass `from` for a
   *  down-count, e.g. from={200} to={0}. */
  from?: number
  /** force a direction; when set, `from` is derived if not supplied */
  direction?: 'up' | 'down'
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}
export const Counter = ({
  to,
  from,
  direction,
  duration = 1.4,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}: CounterProps) => {
  // Resolve a sensible start when only a direction is given.
  const start =
    from ?? (direction === 'down' ? Math.max(to * 2, to + 100) : 0)
  const { ref, value } = useCountTo(to, { from: start, duration })
  return (
    <span ref={ref} className={cn('font-display tabular-nums', className)}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  )
}

/* ── StatTrend — a figure with a percentage delta + directional arrow ──
   Success (up) / amber (warm, down) — both AA on the page ground. */
export interface StatTrendProps {
  /** the headline figure */
  value: number
  /** signed percentage delta, e.g. 12.4 or -3.1 (sign drives colour + arrow) */
  delta: number
  label?: string
  prefix?: string
  suffix?: string
  decimals?: number
  /** decimals on the delta percentage */
  deltaDecimals?: number
  duration?: number
  align?: 'left' | 'center'
  className?: string
}
export const StatTrend = ({
  value,
  delta,
  label,
  prefix = '',
  suffix = '',
  decimals = 0,
  deltaDecimals = 1,
  duration = 1.4,
  align = 'left',
  className,
}: StatTrendProps) => {
  const up = delta >= 0
  const Arrow = up ? ArrowUpRight : ArrowDownRight
  const { ref, value: shown } = useCountTo(value, { duration })
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <div className="flex items-baseline gap-2">
        <span
          ref={ref}
          className="font-display text-display-lg leading-none text-fg tabular-nums"
        >
          {prefix}
          {shown.toFixed(decimals)}
          {suffix}
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-0.5 rounded-sm px-1.5 py-0.5 font-mono text-caption font-bold tabular-nums',
            up ? 'bg-success-soft text-success' : 'bg-amber-soft text-amber-text',
          )}
        >
          <Arrow className="h-3 w-3" strokeWidth={1.5} aria-hidden />
          {Math.abs(delta).toFixed(deltaDecimals)}%
        </span>
      </div>
      {label && <span className="font-mono text-body-sm text-fg-muted">{label}</span>}
    </div>
  )
}

/* ── SeatsRemaining — "128 / 200 seats" with a slim animated progress bar ──
   Counts the taken figure and grows the fill once in view. `count` chooses
   which number animates ('taken' default, or 'remaining'). */
export interface SeatsRemainingProps {
  taken: number
  total: number
  /** noun shown after the figures */
  noun?: string
  /** which number to count up — the filled (taken) seats or the remaining */
  count?: 'taken' | 'remaining'
  accent?: Accent
  duration?: number
  className?: string
}
export const SeatsRemaining = ({
  taken,
  total,
  noun = 'seats',
  count = 'taken',
  accent = 'gold',
  duration = 1.4,
  className,
}: SeatsRemainingProps) => {
  const reduced = useReducedMotion()
  const barRef = React.useRef<HTMLDivElement>(null)
  const inView = useInView(barRef, { once: true, amount: 0.4 })
  const safeTotal = Math.max(1, total)
  const pct = Math.min(100, Math.max(0, (taken / safeTotal) * 100))
  const remaining = Math.max(0, total - taken)
  const headline = count === 'remaining' ? remaining : taken
  const { ref: numRef, value } = useCountTo(headline, { duration })

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-display text-title-lg leading-none text-fg tabular-nums">
          <span ref={numRef}>{Math.round(value)}</span>
          <span className="text-fg-subtle"> / {total}</span>
        </span>
        <span className="font-mono text-caption uppercase tracking-wide text-fg-subtle">
          {noun}
        </span>
      </div>
      <div ref={barRef} className="h-2 w-full overflow-hidden rounded-md bg-elevated">
        <motion.div
          className={cn('h-full rounded-md', ACCENTS[accent].dot)}
          initial={reduced ? false : { width: 0 }}
          animate={inView ? { width: `${pct}%` } : reduced ? { width: `${pct}%` } : undefined}
          transition={{ duration, ease: EASE_OUT }}
          style={reduced ? { width: `${pct}%` } : undefined}
        />
      </div>
    </div>
  )
}

/* ── BigCount — the shared Stat look (font-display figure + mono label) ──
   The base for TicketsSold / MembersCount; not exported (compose those instead). */
const BigCount = ({
  value,
  label,
  prefix = '',
  suffix = '',
  decimals = 0,
  align = 'left',
  className,
}: {
  value: number
  label: string
  prefix?: string
  suffix?: string
  decimals?: number
  align?: 'left' | 'center'
  className?: string
}) => {
  const { ref, value: shown } = useCountTo(value, { duration: 1.6 })
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <span
        ref={ref}
        className="font-display text-display-lg leading-none text-fg tabular-nums"
      >
        {prefix}
        {shown.toFixed(decimals)}
        {suffix}
      </span>
      <span className="font-mono text-body-sm text-fg-muted">{label}</span>
    </div>
  )
}

/* ── TicketsSold — big count-up with a calm label ── */
export interface TicketsSoldProps {
  value: number
  label?: string
  align?: 'left' | 'center'
  className?: string
}
export const TicketsSold = ({
  value,
  label = 'tickets sold',
  align = 'left',
  className,
}: TicketsSoldProps) => (
  <BigCount value={value} label={label} align={align} className={className} />
)

/* ── MembersCount — big count-up of active members ── */
export interface MembersCountProps {
  value: number
  label?: string
  align?: 'left' | 'center'
  className?: string
}
export const MembersCount = ({
  value,
  label = 'active members',
  align = 'left',
  className,
}: MembersCountProps) => (
  <BigCount value={value} label={label} align={align} className={className} />
)

/* ── Countdown — live count DOWN to a target Date ──
   Ticks on one setInterval (cleared on unmount). `compact` shows days only. */
export interface CountdownProps {
  /** target moment — Date, timestamp or parseable date string */
  to: Date | string | number
  /** days-only chip mode */
  compact?: boolean
  /** hide the unit captions under each number */
  hideLabels?: boolean
  align?: 'left' | 'center'
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

function diff(target: number): TimeLeft {
  const ms = Math.max(0, target - Date.now())
  const totalSeconds = Math.floor(ms / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    done: ms <= 0,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

export const Countdown = ({
  to,
  compact = false,
  hideLabels = false,
  align = 'left',
  className,
}: CountdownProps) => {
  const target = React.useMemo(() => new Date(to).getTime(), [to])
  const [left, setLeft] = React.useState<TimeLeft>(() => diff(target))

  React.useEffect(() => {
    setLeft(diff(target))
    const id = window.setInterval(() => {
      const next = diff(target)
      setLeft(next)
      if (next.done) window.clearInterval(id)
    }, 1000)
    return () => window.clearInterval(id)
  }, [target])

  if (compact) {
    return (
      <span
        className={cn(
          'inline-flex items-baseline gap-1.5 rounded-sm bg-elevated px-2.5 py-1',
          className,
        )}
      >
        <span className="font-display text-title-lg leading-none text-fg tabular-nums">
          {left.days}
        </span>
        <span className="font-mono text-caption uppercase tracking-wide text-fg-subtle">
          {left.days === 1 ? 'day' : 'days'} left
        </span>
      </span>
    )
  }

  const units: { value: number; label: string }[] = [
    { value: left.days, label: 'days' },
    { value: left.hours, label: 'hours' },
    { value: left.minutes, label: 'mins' },
    { value: left.seconds, label: 'secs' },
  ]

  return (
    <div
      className={cn('flex items-stretch gap-2', align === 'center' && 'justify-center', className)}
      role="timer"
      aria-live="off"
    >
      {units.map((u, i) => (
        <React.Fragment key={u.label}>
          <div className="flex min-w-[3.25rem] flex-col items-center gap-1 rounded-md border border-border bg-surface px-3 py-2.5 shadow-sm">
            <span className="font-display text-display-sm leading-none text-fg tabular-nums">
              {u.label === 'days' ? u.value : pad(u.value)}
            </span>
            {!hideLabels && (
              <span className="font-mono text-mono-xs uppercase tracking-wide text-fg-subtle">
                {u.label}
              </span>
            )}
          </div>
          {i < units.length - 1 && (
            <span className="self-center font-display text-title-lg text-fg-subtle" aria-hidden>
              :
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
