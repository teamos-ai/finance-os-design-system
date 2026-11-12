/**
 * Blue-surface viz primitives for the Scroll Blue Band — the on-blue twins of the
 * broker dashboard charts. The same token discipline as dashboards/charts.tsx, retuned
 * for a deep Atlas Blue surface: data is drawn in WHITE via `currentColor` (the on-accent
 * foreground), depth comes from OPACITY STEPS of that one white — never a second hue,
 * never amber. Figures are tabular-nums and count up (reduced-motion safe). Translucent
 * white surfaces (`bg-white/…`) and hairlines (`border-white/…`) keep AA on #33488F.
 *
 * Used only by ScrollBlueSection; kept out of the section file so the white-on-blue chart
 * and stat tile read as reusable primitives, the way the white-canvas charts live in
 * dashboards/charts.tsx.
 */
import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { CountUp, EASE_OUT } from '@/lib/motion'
import type { DashboardPoint, DashboardStat } from '@/data/positioning'
import { cn } from '@/lib/cn'

/* ── BlueStatTile — one figure + label on a translucent white tile ───────────── */
export function BlueStatTile({ stat, delay = 0 }: { stat: DashboardStat; delay?: number }) {
  const decimals = Number.isInteger(stat.value) ? 0 : 1
  return (
    <div className="rounded-md border border-white/15 bg-white/10 p-4">
      <span className="block font-display text-title-lg leading-none tabular-nums text-white">
        <CountUp
          to={stat.value}
          prefix={stat.prefix ?? ''}
          suffix={stat.suffix ?? ''}
          decimals={decimals}
          duration={1.2 + delay}
        />
      </span>
      <span className="mt-2 block font-mono text-mono-2xs uppercase tracking-wider text-white/75">
        {stat.label}
      </span>
    </div>
  )
}

/* ── BlueAreaChart — white area + line trend on blue, one in-view draw ────────── */
export function BlueAreaChart({
  data,
  ariaLabel,
  className,
}: {
  data: DashboardPoint[]
  ariaLabel: string
  className?: string
}) {
  const reduced = useReducedMotion()
  const gid = React.useId()
  const W = 300
  const H = 116
  const top = 14
  const bottom = 94
  const left = 6
  const right = W - 6
  const values = data.map((d) => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const pad = span * 0.14
  const lo = min - pad
  const hi = max + pad
  const xAt = (i: number) => left + (i / (data.length - 1)) * (right - left)
  const yAt = (v: number) => bottom - ((v - lo) / (hi - lo)) * (bottom - top)
  const pts = data.map((d, i) => [xAt(i), yAt(d.value)] as const)
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${right},${bottom} L${left},${bottom} Z`
  const end = pts[pts.length - 1]

  return (
    <div className={cn('w-full text-white', className)}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel} className="block h-auto w-full">
        <defs>
          <linearGradient id={`${gid}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.28" />
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
            stroke="currentColor"
            strokeOpacity={0.16}
            strokeWidth={1}
          />
        ))}
        {reduced ? (
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
              transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.25 }}
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
              transition={{ duration: 0.7, ease: EASE_OUT }}
            />
          </>
        )}
        <circle cx={end[0]} cy={end[1]} r={3.5} fill="currentColor" />
      </svg>
      <div className="mt-2 flex justify-between">
        {data.map((d) => (
          <span key={d.label} className="font-mono text-mono-2xs uppercase tabular-nums text-white/70">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}
