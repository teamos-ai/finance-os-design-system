/**
 * CalcLayout — shared chrome for the broker calculators, so all of them read as one family:
 * the icon + title + Reset header, the two-column inputs | result grid, the accent-soft result
 * panel, and the indicative disclaimer. Each calculator supplies its own inputs and result nodes;
 * the maths lives in finance.ts. Matches the hand-built RepaymentCalculator exactly.
 */
import * as React from 'react'
import { RotateCcw } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { AnimatedCurrency } from './AnimatedCurrency'
import { cn } from '@/lib/cn'

export function CalcShell({
  Icon,
  title,
  subtitle,
  onReset,
  inputs,
  result,
  note,
}: {
  Icon: LucideIcon
  title: string
  subtitle: string
  onReset: () => void
  inputs: React.ReactNode
  result: React.ReactNode
  /** extra disclaimer clause appended after the shared indicative line */
  note?: string
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent-soft text-accent-text">
            <Icon className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <div>
            <h3 className="font-display text-title-md text-fg">{title}</h3>
            <p className="font-body text-body-sm text-fg-subtle">{subtitle}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="relative inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-mono-xs text-fg-subtle transition-colors duration-fast ease-out hover:text-fg active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring before:absolute before:-inset-y-[7px] before:inset-x-0 before:content-['']"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          Reset
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="flex flex-col gap-4">{inputs}</div>
        <div className="flex flex-col gap-4 rounded-md border border-border-strong bg-accent-soft p-5">{result}</div>
      </div>

      <p className="font-body text-caption leading-relaxed text-fg-subtle">
        Indicative estimate only — not a loan offer, approval or quote.{note ? ` ${note}` : ''}
      </p>
    </div>
  )
}

/** The result panel's hero figure — a mono label over a big count-up currency value, or `display`
 *  text for a non-currency headline (e.g. "5 years 6 months"). */
export function ResultHeadline({
  label,
  value,
  display,
  suffix,
}: {
  label: string
  value?: number
  display?: string
  suffix?: string
}) {
  return (
    <div>
      <p className="font-mono text-caption uppercase tracking-[0.12em] text-accent-text">{label}</p>
      <p className="flex items-baseline gap-1.5">
        {display !== undefined ? (
          <span className="font-display text-display-md leading-none text-fg">{display}</span>
        ) : (
          <AnimatedCurrency value={value ?? 0} className="font-display text-display-md leading-none text-fg" />
        )}
        {suffix && <span className="font-body text-body-sm text-fg-muted">{suffix}</span>}
      </p>
    </div>
  )
}

/** A breakdown row inside the result panel — label left, figure right, optional sub-hint. */
export function MetricRow({ label, figure, hint }: { label: string; figure: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-t border-border-strong/40 pt-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-body text-body-sm text-fg-muted">{label}</span>
        <span className="font-display text-title-sm tabular-nums text-fg">{figure}</span>
      </div>
      {hint && <span className="font-body text-caption text-fg-subtle">{hint}</span>}
    </div>
  )
}

/** A two-value comparison — two proportional bars with labels and figures (e.g. interest
 *  as-is vs with extra). The smaller bar carries the accent, the baseline is neutral. */
export function CompareBars({
  a,
  b,
}: {
  a: { label: string; value: number; format: (n: number) => string }
  b: { label: string; value: number; format: (n: number) => string }
}) {
  const max = Math.max(a.value, b.value, 1)
  const rows = [
    { ...a, tone: 'neutral' as const },
    { ...b, tone: 'accent' as const },
  ]
  return (
    <div className="flex flex-col gap-3 border-t border-border-strong/40 pt-4">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-body text-caption text-fg-muted">{row.label}</span>
            <span className="font-display text-title-sm tabular-nums text-fg">{row.format(row.value)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-xs bg-surface">
            <div
              className={cn('h-full rounded-xs transition-[width] duration-base ease-out', row.tone === 'accent' ? 'bg-accent' : 'bg-border-strong')}
              style={{ width: `${Math.round((row.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
