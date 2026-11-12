/**
 * Dashboard charts — tokenised inline-SVG primitives for the broker dashboards.
 * Bar · Line · Donut, drawn from scratch (no charting library — the preserveSymlinks
 * React-dedup risk rules one out, and inline SVG stays on the token system anyway).
 *
 * ONE accent owns the data: Atlas Blue via `currentColor`. Depth comes from OPACITY
 * STEPS of that one colour — never a second hue, never amber (amber is status only).
 * Baselines and gridlines are border tokens; figures are tabular-nums. Each chart has
 * a single, motivated in-view draw-in (bars grow, line draws, donut settles) with a
 * static reduced-motion fallback, and an accessible role/aria-label.
 */
import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

export interface ChartDatum {
  label: string
  value: number
}

/** Opacity steps for multi-segment data — all one accent, stepped by lightness. */
const STEP = [1, 0.74, 0.52, 0.36, 0.22]
const stepAt = (i: number) => STEP[i] ?? 0.22

/* ── BarChart — vertical bars, faint gridlines, one highlighted column ───────── */
export interface BarChartProps {
  data: ChartDatum[]
  /** index of the column to pull forward (deeper accent + a value flag) */
  highlightIndex?: number
  valuePrefix?: string
  valueSuffix?: string
  ariaLabel: string
  className?: string
  /** false renders statically (no in-view draw-in) — for hosts that remount on a repeatable control */
  animateIn?: boolean
}

export function BarChart({ data, highlightIndex, valuePrefix = '', valueSuffix = '', ariaLabel, className, animateIn = true }: BarChartProps) {
  const reduced = useReducedMotion()
  const W = 300
  const H = 150
  const top = 24
  const baseline = 140
  const plotH = baseline - top
  const max = Math.max(...data.map((d) => d.value), 1)
  const slot = W / data.length
  const barW = Math.min(slot * 0.5, 34)

  return (
    <div className={cn('w-full', className)}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel} className="block h-auto w-full font-mono text-accent">
        {/* gridlines — faint, in the subtle border token */}
        {[0, 0.5, 1].map((g) => (
          <line
            key={g}
            x1={0}
            x2={W}
            y1={top + plotH * g}
            y2={top + plotH * g}
            className="stroke-border-subtle"
            strokeWidth={1}
          />
        ))}
        {/* baseline */}
        <line x1={0} x2={W} y1={baseline} y2={baseline} className="stroke-border-strong" strokeWidth={1} />
        {data.map((d, i) => {
          const h = (d.value / max) * plotH
          const x = i * slot + (slot - barW) / 2
          const y = baseline - h
          const cls = i === highlightIndex ? 'fill-accent-press' : 'fill-accent'
          return reduced || !animateIn ? (
            <rect key={d.label} x={x} y={y} width={barW} height={h} rx={3} className={cls} />
          ) : (
            <motion.rect
              key={d.label}
              x={x}
              width={barW}
              rx={3}
              className={cls}
              initial={{ height: 0, y: baseline }}
              whileInView={{ height: h, y }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.05 }}
            />
          )
        })}
        {/* value flag on the highlighted column only — keeps the field calm */}
        {highlightIndex != null && data[highlightIndex] && (
          <text
            x={highlightIndex * slot + slot / 2}
            y={baseline - (data[highlightIndex].value / max) * plotH - 8}
            textAnchor="middle"
            className="fill-accent-press text-mono-xs tabular-nums"
          >
            {valuePrefix}
            {data[highlightIndex].value}
            {valueSuffix}
          </text>
        )}
      </svg>
      {/* x labels — HTML for crisp type, equal columns */}
      <div className="mt-2 grid" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
        {data.map((d, i) => (
          <span
            key={d.label}
            className={cn(
              'text-center font-mono text-mono-2xs uppercase tabular-nums',
              i === highlightIndex ? 'text-accent-text' : 'text-fg-subtle',
            )}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── LineChart — area + line trend, faint gridlines, a marked end point ──────── */
export interface LineChartProps {
  data: ChartDatum[]
  ariaLabel: string
  className?: string
  /** false renders statically (no in-view draw-in) — for hosts that remount on a repeatable control */
  animateIn?: boolean
}

export function LineChart({ data, ariaLabel, className, animateIn = true }: LineChartProps) {
  const reduced = useReducedMotion()
  const gid = React.useId()
  const W = 300
  const H = 150
  const top = 16
  const bottom = 132
  const left = 6
  const right = W - 6
  const values = data.map((d) => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const pad = span * 0.12
  const lo = min - pad
  const hi = max + pad
  const xAt = (i: number) => left + (i / (data.length - 1)) * (right - left)
  const yAt = (v: number) => bottom - ((v - lo) / (hi - lo)) * (bottom - top)
  const pts = data.map((d, i) => [xAt(i), yAt(d.value)] as const)
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${right},${bottom} L${left},${bottom} Z`
  const end = pts[pts.length - 1]

  return (
    <div className={cn('w-full', className)}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel} className="block h-auto w-full text-accent">
        <defs>
          <linearGradient id={`${gid}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.2" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((g) => (
          <line
            key={g}
            x1={left}
            x2={right}
            y1={top + (bottom - top) * g}
            y2={top + (bottom - top) * g}
            className="stroke-border-subtle"
            strokeWidth={1}
          />
        ))}
        {reduced || !animateIn ? (
          <>
            <path d={area} fill={`url(#${gid}-fill)`} />
            <path d={line} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : (
          <>
            <motion.path
              d={area}
              fill={`url(#${gid}-fill)`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.2 }}
            />
            <motion.path
              d={line}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
            />
          </>
        )}
        <circle cx={end[0]} cy={end[1]} r={4} className="fill-accent stroke-surface" strokeWidth={2.5} />
      </svg>
      <div className="mt-2 flex justify-between">
        {data.map((d) => (
          <span key={d.label} className="font-mono text-mono-2xs uppercase tabular-nums text-fg-subtle">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── DonutChart — stepped-opacity segments + an interactive, focus-highlightable
      legend. Center shows the total. No gradient, no second hue. ─────────────── */
export interface DonutChartProps {
  data: ChartDatum[]
  centerValue: string
  centerLabel: string
  /** formats each legend row's value (e.g. a $ figure) */
  formatValue?: (v: number) => string
  ariaLabel: string
  className?: string
  /** false renders statically (no in-view draw-in) — for hosts that remount on a repeatable control */
  animateIn?: boolean
}

export function DonutChart({ data, centerValue, centerLabel, formatValue, ariaLabel, className, animateIn = true }: DonutChartProps) {
  const reduced = useReducedMotion()
  const [active, setActive] = React.useState<number | null>(null)
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const r = 52
  const C = 2 * Math.PI * r
  const gap = 2
  let acc = 0
  const segs = data.map((d) => {
    const frac = d.value / total
    const len = frac * C
    const seg = { len: Math.max(len - gap, 0), offset: -acc, pct: Math.round(frac * 100) }
    acc += len
    return seg
  })

  return (
    <div className={cn('flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6', className)}>
      <motion.div
        className="relative h-[150px] w-[150px] shrink-0"
        initial={reduced || !animateIn ? false : { opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
      >
        <svg viewBox="0 0 120 120" role="img" aria-label={ariaLabel} className="h-full w-full -rotate-90 text-accent">
          <circle cx={60} cy={60} r={r} fill="none" strokeWidth={14} className="stroke-inset" />
          {segs.map((s, i) => (
            <circle
              key={data[i].label}
              cx={60}
              cy={60}
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth={active === i ? 16 : 14}
              strokeLinecap="butt"
              strokeDasharray={`${s.len} ${C - s.len}`}
              strokeDashoffset={s.offset}
              strokeOpacity={active == null ? stepAt(i) : active === i ? 1 : 0.18}
              className="transition-[stroke-opacity,stroke-width] duration-base ease-out"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="font-display text-title-lg leading-none tabular-nums text-fg">{centerValue}</span>
          <span className="font-mono text-mono-2xs uppercase tracking-wider text-fg-subtle">{centerLabel}</span>
        </div>
      </motion.div>

      {/* legend — each row is a control that pulls its slice forward on hover/focus */}
      <ul className="flex w-full flex-col gap-1">
        {data.map((d, i) => (
          <li key={d.label}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              aria-label={`${d.label}: ${formatValue ? formatValue(d.value) : d.value}, ${segs[i].pct} percent`}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-left transition-[background-color,transform] duration-fast ease-out',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.96]',
                active === i ? 'bg-canvas-muted' : 'hover:bg-canvas-muted',
              )}
            >
              <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-xs bg-accent" style={{ opacity: stepAt(i) }} />
              <span className="min-w-0 flex-1 truncate font-body text-body-sm text-fg">{d.label}</span>
              <span className="font-body text-body-sm tabular-nums text-fg-muted">
                {formatValue ? formatValue(d.value) : d.value}
              </span>
              <span className="w-9 text-right font-mono text-mono-2xs tabular-nums text-fg-subtle">{segs[i].pct}%</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
