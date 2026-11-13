/**
 * WidgetsSection — the dashboard-widget family. Six self-contained broker-cockpit tiles
 * across two bands: PERFORMANCE (completion ring · capacity meter · 7-day sparkline) and
 * ACTIVITY (settlements leaderboard · day agenda · satisfaction gauge). Every ring, bar,
 * spark and gauge is drawn as inline SVG / divs bound to the accent token — blue-mono data,
 * green reserved for movement, amber reserved for a pending status chip. Flat hairline
 * Card surfaces, 8px squircles, zero glass.
 *
 * Premium scroll-load (mirrors the brand page): figures count up, bars/rings/gauge fill on
 * view, the spark draws in — via the shared RingStat / FillBar / CountUp vocabulary, all
 * reduced-motion safe (they snap to their final state).
 */
import { TrendingUp } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Section, Demo } from '@/showcase/Section'
import { Card } from '@/components/ui/card'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { MonoLabel } from '@/components/ui/mono-label'
import { RingStat, FillBar } from '@/components/dashboards/charts'
import { CountUp, EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

/** Settlements leaderboard — initials, name, share-of-top bar, quarter value. */
const SETTLEMENTS: { initials: string; name: string; value: string; pct: number }[] = [
  { initials: 'PS', name: 'Priya Sharma', value: '$8.4M', pct: 100 },
  { initials: 'DO', name: 'Daniel O’Brien', value: '$7.1M', pct: 85 },
  { initials: 'MT', name: 'Mei Lin Tan', value: '$6.3M', pct: 75 },
  { initials: 'JT', name: 'Jack Thompson', value: '$5.2M', pct: 62 },
  { initials: 'SR', name: 'Sofia Russo', value: '$4.1M', pct: 49 },
]

/** Today's agenda — time, what, context, and a status chip: confirmed (success),
 *  tentative/pending (amber status), new enquiry (blue informational). */
const AGENDA: { time: string; title: string; sub: string; chip: string; variant: BadgeProps['variant'] }[] = [
  { time: '8:30', title: 'Rate review — the Nguyens', sub: 'Refinance · CBA', chip: 'Confirmed', variant: 'success' },
  { time: '10:00', title: 'Pre-approval — Harper & Lee', sub: 'First home buyer', chip: 'Tentative', variant: 'amber' },
  { time: '13:15', title: 'Enquiry — K. Patel', sub: 'Investment · via aggregator', chip: 'New', variant: 'blue' },
  { time: '15:45', title: 'Settlement — the Costas', sub: '$640k · Macquarie', chip: 'Confirmed', variant: 'success' },
]

/** 7-day enquiry spark — line then the closed area beneath it. */
const SPARK_LINE = 'M8,57.7 L45.7,51.9 L83.4,60.6 L121.1,47.8 L158.9,43.2 L196.6,49 L234.3,36.2 L272,27'
const SPARK_AREA = `${SPARK_LINE} L272,85 L8,85 Z`

export function WidgetsSection() {
  const reduced = useReducedMotion()
  return (
    <Section
      id="widgets"
      eyebrow="Dashboard Widgets"
      title="Dashboard Widgets"
      lead="Self-contained tiles for the broker cockpit — progress, capacity, trend, people, schedule and sentiment. Blue-mono data, green only for movement, every ring and gauge drawn as inline SVG."
    >
      <div className="flex flex-col gap-8">
        {/* Band 1 — performance: completion ring, capacity meter, trend sparkline */}
        <Demo label="Performance — ring, capacity and trend at a glance">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Completion ring — arc sweeps to 68% on view, figure counts up (RingStat) */}
            <Card interactive className="flex flex-col gap-4">
              <MonoLabel tone="subtle">Annual settlements</MonoLabel>
              <RingStat
                pct={68}
                value={68}
                suffix="%"
                centerSub="of annual target"
                figureClass="text-display-md"
                ariaLabel="68 percent of annual target"
                className="mt-1"
              />
              <p className="font-body text-caption tabular-nums text-fg-muted">$61.2M of $90M FY settled</p>
            </Card>

            {/* Capacity meter — big figure, horizontal bar, split foot */}
            <Card interactive className="flex flex-col gap-4">
              <MonoLabel tone="subtle">Loan files in progress</MonoLabel>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-display-md leading-none tabular-nums text-fg">
                  <CountUp to={128} />
                </span>
                <span className="font-body text-body-sm tabular-nums text-fg-muted">/ 200 files</span>
              </div>
              <FillBar pct={64} className="h-2.5" ariaLabel="64 percent of capacity" />
              <div className="flex justify-between font-body text-caption text-fg-muted">
                <span className="tabular-nums">64% of capacity</span>
                <span className="tabular-nums text-fg-subtle">72 files headroom</span>
              </div>
            </Card>

            {/* Trend sparkline — delta chip (green = movement), figure, SVG spark */}
            <Card interactive className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2.5">
                <MonoLabel tone="subtle">Enquiries this week</MonoLabel>
                <Badge variant="success" size="sm">
                  <TrendingUp className="h-3 w-3" strokeWidth={2.25} aria-hidden />
                  <span className="tabular-nums">12.4%</span>
                </Badge>
              </div>
              <span className="font-display text-display-md leading-none tabular-nums text-fg">
                <CountUp to={342} />
              </span>
              <svg
                viewBox="0 0 280 90"
                role="img"
                aria-label="Seven day enquiry trend, rising"
                className="block h-auto w-full text-accent"
              >
                <defs>
                  <linearGradient id="fw-spark-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="currentColor" stopOpacity="0.22" />
                    <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {reduced ? (
                  <>
                    <path d={SPARK_AREA} fill="url(#fw-spark-fill)" />
                    <path d={SPARK_LINE} fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-current" />
                  </>
                ) : (
                  <>
                    <motion.path
                      d={SPARK_AREA}
                      fill="url(#fw-spark-fill)"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.25 }}
                    />
                    <motion.path
                      d={SPARK_LINE}
                      fill="none"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="stroke-current"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.7, ease: EASE_OUT }}
                    />
                  </>
                )}
                <circle cx="272" cy="27" r="4" strokeWidth="2.5" className="fill-current stroke-surface" />
              </svg>
              <p className="font-body text-caption text-fg-muted">7-day volume · aggregator + direct</p>
            </Card>
          </div>
        </Demo>

        {/* Band 2 — activity: leaderboard, day agenda, sentiment gauge */}
        <Demo label="Activity — people, schedule and sentiment">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Settlements leaderboard — avatar · name + bar · value */}
            <Card interactive className="flex flex-col gap-4">
              <MonoLabel tone="subtle">Settlements this quarter</MonoLabel>
              <div className="flex flex-col gap-3">
                {SETTLEMENTS.map((p, i) => (
                  <div key={p.initials} className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="grid h-9 w-9 flex-none place-items-center rounded-full bg-accent-soft font-mono text-mono-xs text-accent-text"
                    >
                      {p.initials}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <span className="truncate font-body text-body-sm font-semibold text-fg">{p.name}</span>
                      <FillBar pct={p.pct} className="h-1.5" delay={i * 0.08} ariaLabel={`${p.name}: ${p.value}`} />
                    </div>
                    <span className="flex-none font-display text-title-sm tabular-nums text-fg">{p.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Day agenda — time · what + context · status chip, hairline between rows */}
            <Card interactive className="flex flex-col gap-4">
              <MonoLabel tone="subtle">Today’s agenda</MonoLabel>
              <div className="flex flex-col">
                {AGENDA.map((a, i) => (
                  <div
                    key={a.time}
                    className={cn(
                      'flex gap-3.5 py-3',
                      i === 0 ? 'pt-0.5' : 'border-t border-border',
                      i === AGENDA.length - 1 && 'pb-0',
                    )}
                  >
                    <span className="w-12 flex-none pt-px font-body text-caption font-semibold tabular-nums text-fg-muted">
                      {a.time}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="font-body text-body-sm font-semibold text-fg">{a.title}</span>
                      <span className="font-body text-caption text-fg-subtle">{a.sub}</span>
                    </div>
                    <Badge variant={a.variant} size="sm" className="flex-none self-start">
                      {a.chip}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Sentiment gauge — semicircle arc, score centred, 1–5 ends */}
            <Card interactive className="flex flex-col gap-4">
              <MonoLabel tone="subtle">Client satisfaction</MonoLabel>
              <div className="relative mx-auto mt-0.5 w-full max-w-[216px]">
                <svg
                  viewBox="0 0 200 118"
                  role="img"
                  aria-label="Client satisfaction 4.8 out of 5"
                  className="block h-auto w-full text-accent"
                >
                  <path d="M20,100 A80,80 0 0 1 180,100" fill="none" strokeWidth="14" strokeLinecap="round" className="stroke-inset" />
                  {reduced ? (
                    <path
                      d="M20,100 A80,80 0 0 1 180,100"
                      fill="none"
                      strokeWidth="14"
                      strokeLinecap="round"
                      pathLength={100}
                      strokeDasharray="100"
                      strokeDashoffset="4"
                      className="stroke-current"
                    />
                  ) : (
                    <motion.path
                      d="M20,100 A80,80 0 0 1 180,100"
                      fill="none"
                      strokeWidth="14"
                      strokeLinecap="round"
                      pathLength={100}
                      strokeDasharray="100"
                      className="stroke-current"
                      initial={{ strokeDashoffset: 100 }}
                      whileInView={{ strokeDashoffset: 4 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 }}
                    />
                  )}
                </svg>
                <div className="absolute inset-x-0 bottom-1 text-center">
                  <span className="block font-display text-display-md leading-none tabular-nums text-fg">
                    <CountUp to={4.8} decimals={1} />
                  </span>
                  <span className="mt-1 block font-body text-caption text-fg-subtle">mean review score · 90 days</span>
                </div>
              </div>
              <div className="mx-auto flex w-full max-w-[216px] justify-between px-0.5 font-body text-caption text-fg-subtle">
                <span className="tabular-nums">1</span>
                <span className="tabular-nums">5</span>
              </div>
            </Card>
          </div>
        </Demo>
      </div>
    </Section>
  )
}
