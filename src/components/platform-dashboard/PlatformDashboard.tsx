/**
 * PlatformDashboard — the "platform in motion" app-shell mock (FRONT) and a plain-language
 * overview (BACK) for the flip card.
 *
 * FRONT (PlatformAppShell): a broker operating-system window — left sidebar nav, top stat
 * tiles with tokenised sparklines, an enquiries bar chart, a workspace card, an interactive
 * task checklist and a new-enquiries list. BACK (PlatformOverview): what the platform does,
 * drawn from the brand positioning (the From→To "to" lines + the hero line and signoff).
 *
 * Composed entirely from Finance OS tokens and kit components. Blue (Atlas Blue via
 * currentColor) owns all data; green marks one movement; amber marks exactly ONE at-risk
 * moment (the single overdue task · status only). Hairline borders + layered shadows, 8px-max
 * squircles, no glass, no ribbons. Figures are tabular-nums and count up once on view.
 *
 * The figures, tasks and names are illustrative sample data from src/data/positioning.ts —
 * broker vocabulary is from the positioning; the numbers and people are not real records.
 */
import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard, GitBranch, UserPlus, Users, Calendar, ListChecks, Wallet, BarChart3, Settings,
  Search, Command, ChevronRight, Bell, TrendingUp, Sparkles, Check, AlertTriangle, Clock, ArrowRight, Play, RotateCw,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MonoLabel } from '@/components/ui/mono-label'
import { LogoMark } from '@/components/brand/Logo'
import { BarChart } from '@/components/dashboards/charts'
import { CountUp } from '@/lib/motion'
import { dashboard, hero, transformations, type DashboardStat } from '@/data/positioning'
import { cn } from '@/lib/cn'

/* ── helpers ──────────────────────────────────────────────────────────────────── */

/** "A. Nguyen" → "AN". Two initials, for the tokenised avatar well (no stock photos). */
const initials = (name: string) =>
  name
    .split(/[.\s]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')

/** 540000 → "$540k". Compact loan figure, tabular-nums at the call site. */
const kAud = (v: number) => `$${Math.round(v / 1000)}k`

/** Decorative micro-trend geometry for the stat-tile sparklines (not data — chrome). */
const SPARKS: number[][] = [
  [4, 6, 5, 8, 7, 10, 12],
  [8, 7, 9, 8, 11, 10, 13],
  [3, 4, 4, 5, 6, 7, 7],
  [5, 6, 7, 7, 9, 11, 14],
]

/** Broker CRM nav — app-shell chrome (broker vocabulary), Dashboard is the active row. */
const NAV: { label: string; Icon: LucideIcon; active?: boolean }[] = [
  { label: 'Dashboard', Icon: LayoutDashboard, active: true },
  { label: 'Pipeline', Icon: GitBranch },
  { label: 'Enquiries', Icon: UserPlus },
  { label: 'Clients', Icon: Users },
  { label: 'Calendar', Icon: Calendar },
  { label: 'Tasks', Icon: ListChecks },
  { label: 'Settlements', Icon: Wallet },
  { label: 'Reports', Icon: BarChart3 },
  { label: 'Settings', Icon: Settings },
]

/** Pipeline stage → a non-amber badge tone (amber is reserved for the one overdue task). */
const STAGE_VARIANT: Record<string, BadgeProps['variant']> = {
  'New enquiry': 'info',
  Qualifying: 'neutral',
  Application: 'blue',
  Approved: 'success',
  Settled: 'success',
}

/* ── sparkline — tokenised inline SVG, one accent via currentColor ──────────────── */
function Sparkline({ data }: { data: number[] }) {
  const gid = React.useId()
  const w = 120
  const h = 32
  const max = Math.max(...data)
  const min = Math.min(...data)
  const span = max - min || 1
  const step = w / (data.length - 1)
  const pts = data.map((v, i) => [i * step, h - 3 - ((v - min) / span) * (h - 6)] as const)
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${w},${h} L0,${h} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden className="block h-8 w-full">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── stat tile — label · count-up figure · sparkline. Last tile is the accent moment ─ */
function StatTile({ stat, spark, featured }: { stat: DashboardStat; spark: number[]; featured?: boolean }) {
  const decimals = Number.isInteger(stat.value) ? 0 : 1
  return (
    <Card
      interactive
      padding="none"
      className={cn(
        'flex flex-col justify-between gap-3 overflow-hidden p-4',
        featured && 'border-transparent bg-gradient-accent text-accent-fg shadow-md',
      )}
    >
      <div className="flex flex-col gap-1.5">
        <span
          className={cn(
            'font-mono text-mono-2xs font-bold uppercase tracking-[0.1em]',
            featured ? 'text-accent-fg' : 'text-fg-subtle',
          )}
        >
          {stat.label}
        </span>
        <CountUp
          to={stat.value}
          decimals={decimals}
          prefix={stat.prefix ?? ''}
          suffix={stat.suffix ?? ''}
          className={cn('font-display text-display-sm leading-none', featured ? 'text-accent-fg' : 'text-fg')}
        />
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className={cn('font-body text-caption', featured ? 'text-accent-fg' : 'text-fg-subtle')}>
          {stat.caption}
        </span>
        <span className={cn('w-16 shrink-0', featured ? 'text-accent-fg' : 'text-accent')}>
          <Sparkline data={spark} />
        </span>
      </div>
    </Card>
  )
}

/* ── sidebar — logo · search · nav (desktop only) ───────────────────────────────── */
function Sidebar() {
  return (
    <aside className="hidden flex-col gap-3 rounded-lg border border-border bg-surface p-3 shadow-sm lg:flex">
      <div className="flex items-center gap-2.5 px-1 py-0.5">
        <LogoMark size="sm" />
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate font-display text-title-sm text-fg">Finance OS</span>
          <span className="font-mono text-mono-2xs uppercase tracking-[0.12em] text-fg-subtle">Workspace</span>
        </span>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-subtle" strokeWidth={1.75} aria-hidden />
        <input
          readOnly
          aria-label="Search the workspace"
          placeholder="Search clients, deals, tasks"
          className="h-9 w-full rounded-md border border-border bg-inset pl-8 pr-14 font-mono text-mono-2xs text-fg-muted placeholder:text-fg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <span className="pointer-events-none absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-sm border border-border bg-surface px-1.5 py-0.5 font-mono text-mono-2xs text-fg-subtle">
          <Command className="h-3 w-3" strokeWidth={2} aria-hidden />K
        </span>
      </div>

      <nav className="flex flex-col gap-0.5">
        {NAV.map(({ label, Icon, active }) => (
          <span
            key={label}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-2.5 rounded-md px-2.5 py-2 font-body text-body-sm transition-colors',
              active ? 'bg-selected font-semibold text-accent-text' : 'text-fg-muted hover:bg-canvas-muted hover:text-fg',
            )}
          >
            <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-accent' : 'text-fg-subtle')} strokeWidth={1.75} aria-hidden />
            <span className="truncate">{label}</span>
            {active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-accent" strokeWidth={2} aria-hidden />}
          </span>
        ))}
      </nav>
    </aside>
  )
}

/* ── enquiries bar chart (reuses the kit BarChart, driven by positioning data) ──── */
function PipelineCard() {
  const pts = dashboard.pipeline.points
  const last = pts.length - 1
  const delta = pts[last].value - pts[0].value
  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <MonoLabel tone="subtle">{dashboard.pipeline.label}</MonoLabel>
          <span className="flex items-baseline gap-2">
            <span className="font-display text-display-sm tabular-nums text-fg">{pts[last].value}</span>
            <span className="font-body text-body-sm text-fg-subtle">this week</span>
          </span>
        </div>
        <Badge variant="success" size="sm">
          <TrendingUp className="h-3 w-3" strokeWidth={2.25} aria-hidden />
          <span className="tabular-nums">+{delta}</span>
        </Badge>
      </div>
      <div className="flex flex-1 items-center">
        <BarChart
          data={pts}
          highlightIndex={last}
          ariaLabel={`${dashboard.pipeline.label}, rising to ${pts[last].value} in the latest week`}
        />
      </div>
    </Card>
  )
}

/* ── workspace card — the brokerage identity (logo mark, not a stock person) ─────── */
function WorkspaceCard() {
  const mini = dashboard.stats.slice(0, 3)
  return (
    <Card className="flex h-full flex-col items-center gap-4 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-lg border border-border bg-inset">
        <LogoMark size="md" />
      </div>
      <div className="flex flex-col gap-1.5">
        <h4 className="font-display text-title-lg text-fg">{dashboard.title}</h4>
        <span className="inline-flex items-center justify-center gap-1.5 font-mono text-caption text-fg-subtle">
          <Sparkles className="h-3.5 w-3.5 text-accent" strokeWidth={1.75} aria-hidden />
          Mortgage &amp; asset finance
        </span>
      </div>
      <div className="grid w-full grid-cols-3 overflow-hidden rounded-md border border-border">
        {mini.map((s, i) => (
          <div key={s.label} className={cn('flex flex-col items-center gap-1 px-2 py-3', i > 0 && 'border-l border-border')}>
            <span className="font-display text-title-md tabular-nums text-fg">
              {s.prefix ?? ''}
              {s.value}
              {s.suffix ?? ''}
            </span>
            <span className="font-mono text-mono-2xs uppercase tracking-[0.06em] text-fg-subtle">{s.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

/* ── task checklist — interactive; the one overdue row is the single amber moment ── */
function TasksCard() {
  const [done, setDone] = React.useState<Record<number, boolean>>({})
  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-accent-fg">
            <ListChecks className="h-4 w-4" strokeWidth={2} aria-hidden />
          </span>
          <h4 className="font-display text-title-sm text-fg">Tasks</h4>
        </div>
        <span className="font-mono text-mono-2xs uppercase tracking-[0.1em] text-fg-subtle tabular-nums">
          {dashboard.tasks.length} open
        </span>
      </div>
      <ul className="flex flex-col gap-0.5">
        {dashboard.tasks.map((t, i) => {
          const checked = !!done[i]
          const overdue = t.status === 'overdue'
          return (
            <li key={t.title}>
              <button
                type="button"
                onClick={() => setDone((d) => ({ ...d, [i]: !d[i] }))}
                aria-pressed={checked}
                className="flex w-full items-center gap-3 rounded-md px-1.5 py-2 text-left transition-colors hover:bg-canvas-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99]"
              >
                <span
                  className={cn(
                    'grid h-5 w-5 shrink-0 place-items-center rounded-sm border transition-colors',
                    checked ? 'border-accent bg-accent text-accent-fg' : 'border-border-strong text-transparent',
                  )}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                </span>
                <span className={cn('min-w-0 flex-1 truncate font-body text-body-sm', checked ? 'text-fg-subtle line-through' : 'text-fg')}>
                  {t.title}
                </span>
                {overdue ? (
                  <Badge variant="amber" size="sm">
                    <AlertTriangle className="h-3 w-3" strokeWidth={2.25} aria-hidden />
                    {t.due}
                  </Badge>
                ) : (
                  <span
                    className={cn(
                      'inline-flex shrink-0 items-center gap-1 font-mono text-mono-2xs uppercase tracking-[0.06em]',
                      t.status === 'due' ? 'text-accent-text' : 'text-fg-subtle',
                    )}
                  >
                    <Clock className="h-3 w-3" strokeWidth={1.75} aria-hidden />
                    {t.due}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

/* ── new-enquiries list — initials wells, stage badges, compact loan figures ─────── */
function CustomersCard() {
  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-display text-title-sm text-fg">New enquiries</h4>
        <span className="inline-flex items-center gap-1 font-mono text-mono-2xs uppercase tracking-[0.1em] text-accent-text">
          View all
          <ArrowRight className="h-3 w-3" strokeWidth={2} aria-hidden />
        </span>
      </div>
      <ul className="flex flex-col">
        {dashboard.customers.map((c, i) => (
          <li key={c.name} className={cn('flex items-center gap-3 py-2.5', i > 0 && 'border-t border-border')}>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-accent-soft font-mono text-mono-xs font-bold text-accent-text">
              {initials(c.name)}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="truncate font-body text-body-sm font-semibold text-fg">{c.name}</span>
              <Badge variant={STAGE_VARIANT[c.stage] ?? 'neutral'} size="sm" className="w-fit">
                {c.stage}
              </Badge>
            </span>
            <span className="shrink-0 font-body text-body-sm tabular-nums text-fg">{kAud(c.value)}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

/* ── small helper — hero line with the single Atlas-Blue type highlight ──────────── */
function Highlighted({ text, phrase }: { text: string; phrase: string }) {
  const i = text.indexOf(phrase)
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <span className="text-highlight">{phrase}</span>
      {text.slice(i + phrase.length)}
    </>
  )
}

/* ── FRONT FACE — the assembled broker app shell ────────────────────────────────── */
export function PlatformAppShell() {
  return (
    <div className="rounded-lg border border-border bg-canvas-muted p-3 sm:p-4">
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[13rem_1fr]">
        <Sidebar />

        <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
          {/* top bar */}
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 lg:hidden">
              <LogoMark size="sm" />
              <span className="font-display text-title-sm text-fg">Finance OS</span>
            </span>
            <span className="hidden lg:inline-flex">
              <MonoLabel dot>Live preview</MonoLabel>
            </span>
            <span className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-2 py-1.5 shadow-sm">
              <span className="grid h-6 w-6 place-items-center rounded-sm bg-accent-soft text-accent-text">
                <Users className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="hidden font-body text-caption text-fg-muted sm:inline">Workspace</span>
              <Bell className="h-3.5 w-3.5 text-fg-subtle" strokeWidth={1.75} aria-hidden />
            </span>
          </div>

          {/* stat tiles */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {dashboard.stats.map((s, i) => (
              <StatTile key={s.label} stat={s} spark={SPARKS[i % SPARKS.length]} featured={i === dashboard.stats.length - 1} />
            ))}
          </div>

          {/* main grid */}
          <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PipelineCard />
            </div>
            <div className="lg:col-span-1">
              <WorkspaceCard />
            </div>
            <div className="lg:col-span-1">
              <TasksCard />
            </div>
            <div className="lg:col-span-2">
              <CustomersCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── BACK FACE — the plain-language overview, from the brand positioning ─────────── */
export function PlatformOverview({ onWatch, onFlip }: { onWatch: () => void; onFlip: () => void }) {
  return (
    <Card tone="soft" className="flex h-full flex-col justify-center gap-6 p-6 sm:p-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <MonoLabel dot>Platform in motion</MonoLabel>
        <h3 className="max-w-[28ch] font-display text-display-sm text-fg">
          <Highlighted text={hero.headline} phrase={hero.highlight} />
        </h3>
        <p className="max-w-[54ch] font-body text-body-md leading-relaxed text-fg-muted">
          The same records, pipeline and follow-ups you just saw — connected end to end, so nothing slips between
          enquiry and settlement.
        </p>
      </div>

      <ul className="mx-auto grid w-full max-w-xl gap-x-6 gap-y-2.5 sm:grid-cols-2">
        {transformations.map((t) => (
          <li key={t.to} className="grid grid-cols-[20px_1fr] items-start gap-2.5">
            <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-sm bg-accent-soft text-accent">
              <Check className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
            </span>
            <span className="font-body text-body-sm leading-snug text-fg-muted">{t.to}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" onClick={onWatch} leadingIcon={<Play className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />}>
            Watch the demo video
          </Button>
          <Button variant="ghost" onClick={onFlip} leadingIcon={<RotateCw className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />}>
            Back to the dashboard
          </Button>
        </div>
        <span className="font-mono text-mono-xs uppercase tracking-[0.14em] text-accent-text">{hero.signoff}</span>
      </div>
    </Card>
  )
}
