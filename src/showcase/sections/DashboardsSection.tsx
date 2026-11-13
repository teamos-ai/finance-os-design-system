/**
 * DashboardsSection — assembled broker dashboards. One live surface with a segmented
 * view switch (Pipeline · Settlements · Commission); each view composes a KPI stat row,
 * one tokenised inline-SVG chart (bar / line / donut) and a compact status table, from
 * the same vocabulary as the Dashboard Widgets. Blue-mono data; green marks movement;
 * amber marks exactly ONE at-risk moment per view (status only). A second demo documents
 * the three chart primitives on their own. Flat hairline Cards, 8px squircles, no glass,
 * no ribbons. The view switch is motivated motion with the filled segment as its static cue.
 */
import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Section, Demo, ComposedFrom } from '@/showcase/Section'
import { Card } from '@/components/ui/card'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { MonoLabel } from '@/components/ui/mono-label'
import { SegmentedControl } from '@/components/ui/segmented'
import { BarChart, LineChart, DonutChart, type ChartDatum } from '@/components/dashboards/charts'
import { EASE_OUT } from '@/lib/motion'
import type { InspectData } from '@/components/ui/inspectable'
import { cn } from '@/lib/cn'

type View = 'pipeline' | 'settlements' | 'commission'

/* ── chart datasets — illustrative broker sample data ───────────────────────── */
const DEALS_BY_MONTH: ChartDatum[] = [
  { label: 'Jun', value: 38 },
  { label: 'Jul', value: 42 },
  { label: 'Aug', value: 47 },
  { label: 'Sep', value: 44 },
  { label: 'Oct', value: 52 },
  { label: 'Nov', value: 58 },
]
const SETTLEMENT_TREND: ChartDatum[] = [
  { label: 'Apr', value: 5.1 },
  { label: 'May', value: 5.8 },
  { label: 'Jun', value: 6.2 },
  { label: 'Jul', value: 6.0 },
  { label: 'Aug', value: 6.9 },
  { label: 'Sep', value: 7.4 },
  { label: 'Oct', value: 7.1 },
  { label: 'Nov', value: 8.4 },
]
const COMMISSION_BY_LENDER: ChartDatum[] = [
  { label: 'CBA', value: 28.4 },
  { label: 'Macquarie', value: 19.2 },
  { label: 'ANZ', value: 14.6 },
  { label: 'NAB', value: 12.3 },
  { label: 'Others', value: 9.7 },
]
const aud = (v: number) => `$${v.toFixed(1)}k`

/* ── small helpers ──────────────────────────────────────────────────────────── */
interface DeltaSpec {
  dir: 'up' | 'down'
  text: string
}
/** Movement chip — green is reserved for movement; the arrow is the static direction cue. */
function Delta({ dir, text }: DeltaSpec) {
  const Icon = dir === 'up' ? TrendingUp : TrendingDown
  return (
    <Badge variant="success" size="sm">
      <Icon className="h-3 w-3" strokeWidth={2.25} aria-hidden />
      <span className="tabular-nums">{text}</span>
    </Badge>
  )
}

interface KpiSpec {
  label: string
  value: string
  delta?: DeltaSpec
  caption: string
}
function KpiTile({ label, value, delta, caption }: KpiSpec) {
  return (
    <Card interactive className="flex flex-col gap-2.5">
      <MonoLabel tone="subtle">{label}</MonoLabel>
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-display-sm leading-none tabular-nums text-fg">{value}</span>
        {delta && <Delta {...delta} />}
      </div>
      <span className="font-body text-caption text-fg-subtle">{caption}</span>
    </Card>
  )
}

interface MiniRow {
  title: string
  sub: string
  value: string
  chip: string
  variant: BadgeProps['variant']
}
/** Compact status table — hairline row rules only, tabular figures, no vertical rails. */
function MiniTable({ caption, rows }: { caption: string; rows: MiniRow[] }) {
  return (
    <table className="w-full border-collapse">
      <caption className="sr-only">{caption}</caption>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.title} className={cn(i > 0 && 'border-t border-border')}>
            <td className="py-2.5 pr-3 align-top">
              <span className="block font-body text-body-sm font-semibold text-fg">{r.title}</span>
              <span className="block font-body text-caption text-fg-subtle">{r.sub}</span>
            </td>
            <td className="whitespace-nowrap px-3 py-2.5 text-right align-top font-body text-body-sm tabular-nums text-fg">
              {r.value}
            </td>
            <td className="py-2.5 pl-3 text-right align-top">
              <Badge variant={r.variant} size="sm">
                {r.chip}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ── per-view configuration ─────────────────────────────────────────────────── */
interface ViewConfig {
  title: string
  period: string
  kpis: KpiSpec[]
  chartLabel: string
  chart: React.ReactNode
  tableLabel: string
  rows: MiniRow[]
}

const VIEWS: Record<View, ViewConfig> = {
  pipeline: {
    title: 'Pipeline overview',
    period: 'FY25 · November',
    kpis: [
      { label: 'Active deals', value: '128', delta: { dir: 'up', text: '+8' }, caption: 'In the pipeline this week' },
      { label: 'Pipeline value', value: '$42.6M', delta: { dir: 'up', text: '+5.1%' }, caption: 'Across all stages' },
      { label: 'Settled MTD', value: '$8.4M', delta: { dir: 'up', text: '+12.4%' }, caption: 'November to date' },
      { label: 'Conversion', value: '61%', caption: 'Enquiry to settlement' },
    ],
    chartLabel: 'New deals / month',
    chart: (
      <BarChart
        data={DEALS_BY_MONTH}
        highlightIndex={5}
        animateIn={false}
        ariaLabel="New deals by month, June to November, trending up to 58 in November"
      />
    ),
    tableLabel: 'Active deals',
    rows: [
      { title: 'The Nguyens', sub: 'Pre-approval · CBA', value: '$620k', chip: 'Awaiting docs', variant: 'amber' },
      { title: 'Harper & Lee', sub: 'Application · Macquarie', value: '$540k', chip: 'In review', variant: 'info' },
      { title: 'K. Patel', sub: 'Unconditional · ANZ', value: '$880k', chip: 'Cleared', variant: 'success' },
      { title: 'The Costas', sub: 'Valuation · NAB', value: '$460k', chip: 'On track', variant: 'blue' },
    ],
  },
  settlements: {
    title: 'Settlements',
    period: 'Rolling 8 months',
    kpis: [
      { label: 'Settled MTD', value: '$8.4M', delta: { dir: 'up', text: '+12.4%' }, caption: 'November to date' },
      { label: 'Settlements', value: '23', delta: { dir: 'up', text: '+3' }, caption: 'Loans funded this month' },
      { label: 'Avg loan size', value: '$612k', delta: { dir: 'up', text: '+2.1%' }, caption: 'Per settled loan' },
      { label: 'Time to settle', value: '32 days', delta: { dir: 'down', text: '4 days' }, caption: 'Unconditional to funded' },
    ],
    chartLabel: 'Settlement value · $M',
    chart: <LineChart data={SETTLEMENT_TREND} animateIn={false} ariaLabel="Settlement value in millions, rolling eight months, trending up to 8.4 in November" />,
    tableLabel: 'Recent settlements',
    rows: [
      { title: 'The Costas', sub: 'Macquarie · 8 Nov', value: '$640k', chip: 'Settled', variant: 'success' },
      { title: 'Alvarez', sub: 'ANZ · 6 Nov', value: '$720k', chip: 'Settled', variant: 'success' },
      { title: 'Whitfield', sub: 'CBA · 5 Nov', value: '$545k', chip: 'Pending disbursement', variant: 'amber' },
      { title: 'O’Connor', sub: 'Westpac · 1 Nov', value: '$498k', chip: 'Settled', variant: 'success' },
    ],
  },
  commission: {
    title: 'Commission',
    period: 'FY25 · November',
    kpis: [
      { label: 'Commission MTD', value: '$84.2k', delta: { dir: 'up', text: '+9.3%' }, caption: 'November to date' },
      { label: 'Upfront YTD', value: '$612k', delta: { dir: 'up', text: '+6.8%' }, caption: 'Financial year to date' },
      { label: 'Trail (monthly)', value: '$38.4k', delta: { dir: 'up', text: '+1.2%' }, caption: 'Recurring book income' },
      { label: 'Avg / settlement', value: '$3.9k', caption: 'Commission per loan' },
    ],
    chartLabel: 'Commission by lender',
    chart: (
      <DonutChart
        data={COMMISSION_BY_LENDER}
        centerValue="$84.2k"
        centerLabel="MTD"
        formatValue={aud}
        animateIn={false}
        ariaLabel="Commission by lender this month, CBA the largest share at 28.4 thousand dollars"
      />
    ),
    tableLabel: 'Upcoming commission',
    rows: [
      { title: 'Macquarie', sub: 'Upfront · due 18 Nov', value: '$4.2k', chip: 'Scheduled', variant: 'success' },
      { title: 'CBA', sub: 'Trail · due 28 Nov', value: '$1.1k', chip: 'Scheduled', variant: 'success' },
      { title: 'ANZ', sub: 'Upfront · due 22 Nov', value: '$3.6k', chip: 'Under review', variant: 'amber' },
      { title: 'NAB', sub: 'Upfront · due 30 Nov', value: '$2.9k', chip: 'Submitted', variant: 'info' },
    ],
  },
}

const VIEW_OPTIONS: { value: View; label: string }[] = [
  { value: 'pipeline', label: 'Pipeline' },
  { value: 'settlements', label: 'Settlements' },
  { value: 'commission', label: 'Commission' },
]

/* ── inspect payloads ───────────────────────────────────────────────────────── */
const DASH_INSPECT: InspectData = {
  name: 'Assembled dashboard',
  explain:
    'A broker dashboard composed from the kit: a KPI stat row, one tokenised chart and a compact status table, inside flat hairline Cards. Green marks movement; amber marks exactly one at-risk moment per view. Switching views is motivated motion — the filled segment is the static cue, and it is reduced-motion safe.',
  token: [
    'surface   bg-surface · border-border · rounded-lg (8px)',
    'figure    font-display text-display-sm · tabular-nums · text-fg',
    'delta     Badge variant="success"   (green = movement)',
    'at-risk   Badge variant="amber"     (one per view · status only)',
    'chart     text-accent               (Atlas Blue, blue-mono data)',
    'rows      border-t border-border    (hairline rules, no rails)',
  ].join('\n'),
  code: [
    '<div className="grid gap-4 lg:grid-cols-12">',
    '  <Card className="lg:col-span-7">',
    '    <MonoLabel tone="subtle">New deals / month</MonoLabel>',
    '    <BarChart data={deals} highlightIndex={5} ariaLabel="…" />',
    '  </Card>',
    '  <Card className="lg:col-span-5">',
    '    <MonoLabel tone="subtle">Active deals</MonoLabel>',
    '    <MiniTable rows={rows} />   {/* one amber row = the at-risk moment */}',
    '  </Card>',
    '</div>',
  ].join('\n'),
  download: {
    filename: 'dashboard.tsx',
    content: [
      "import { Card } from '@/components/ui/card'",
      "import { MonoLabel } from '@/components/ui/mono-label'",
      "import { BarChart } from '@/components/dashboards/charts'",
      '',
      'export function PipelineView() {',
      '  return (',
      '    <div className="grid gap-4 lg:grid-cols-12">',
      '      <Card className="lg:col-span-7 flex flex-col gap-4">',
      '        <MonoLabel tone="subtle">New deals / month</MonoLabel>',
      '        <BarChart data={deals} highlightIndex={5} ariaLabel="New deals by month" />',
      '      </Card>',
      '    </div>',
      '  )',
      '}',
    ].join('\n'),
  },
}

const CHARTS_INSPECT: InspectData = {
  name: 'Dashboard charts',
  explain:
    'Bar, line and donut drawn as tokenised inline SVG — no charting library. One accent (Atlas Blue) owns the data via currentColor; depth is opacity steps of that one hue, never a second colour and never amber. Baselines and gridlines are border tokens; each chart draws in once on view with a static reduced-motion fallback.',
  token: [
    'data colour  text-accent            (Atlas Blue via currentColor)',
    'depth        opacity 1 / .74 / .52 / .36 / .22   (one hue)',
    'highlight    fill-accent-press      (the deep-blue column)',
    'grid + base  stroke-border-subtle / stroke-border-strong / stroke-inset',
    'figures      tabular-nums · font-mono labels',
    'motion       in-view draw-in → reduced-motion static',
  ].join('\n'),
  code: [
    '<BarChart  data={deals}      highlightIndex={5} ariaLabel="…" />',
    '<LineChart data={months}     ariaLabel="…" />',
    '<DonutChart',
    '  data={byLender}',
    '  centerValue="$84.2k"',
    '  centerLabel="MTD"',
    '  formatValue={(v) => `$${v.toFixed(1)}k`}',
    '  ariaLabel="…"',
    '/>',
  ].join('\n'),
  download: {
    filename: 'dashboard-charts-usage.tsx',
    content: [
      "import { BarChart, LineChart, DonutChart } from '@/components/dashboards/charts'",
      '',
      'const deals = [',
      "  { label: 'Oct', value: 52 },",
      "  { label: 'Nov', value: 58 },",
      ']',
      '',
      'export const Demo = () => <BarChart data={deals} highlightIndex={1} ariaLabel="New deals by month" />',
    ].join('\n'),
  },
}

/* ── the assembled dashboard (interactive view switch) ──────────────────────── */
function DashboardSurface() {
  const [view, setView] = React.useState<View>('pipeline')
  const reduced = useReducedMotion()
  const cfg = VIEWS[view]

  return (
    <div className="flex flex-col gap-5">
      {/* dashboard chrome — title + period, with the view switch as the one control */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <MonoLabel dot>Broker dashboard</MonoLabel>
          <h3 className="font-display text-title-lg text-fg">{cfg.title}</h3>
          <span className="font-mono text-caption text-fg-subtle">{cfg.period}</span>
        </div>
        <SegmentedControl
          options={VIEW_OPTIONS}
          value={view}
          onValueChange={(v) => setView(v as View)}
          size="sm"
          aria-label="Dashboard view"
        />
      </div>

      {/* active view — re-keyed for one container fade per switch; the charts render
          statically here (animateIn=false) so this repeatable control never replays a
          staged draw-in — that entrance is reserved for the chart kit below, which mounts once */}
      <motion.div
        key={view}
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        className="flex flex-col gap-4"
      >
        {/* KPI stat row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cfg.kpis.map((k) => (
            <KpiTile key={k.label} {...k} />
          ))}
        </div>

        {/* chart + compact table */}
        <div className="grid gap-4 lg:grid-cols-12">
          <Card className="flex flex-col gap-4 lg:col-span-7">
            <div className="flex items-center justify-between gap-2.5">
              <MonoLabel tone="subtle">{cfg.chartLabel}</MonoLabel>
              <Badge variant="neutral" size="sm">
                {cfg.period}
              </Badge>
            </div>
            <div className="flex flex-1 items-center">{cfg.chart}</div>
          </Card>
          <Card className="flex flex-col gap-3 lg:col-span-5">
            <MonoLabel tone="subtle">{cfg.tableLabel}</MonoLabel>
            <MiniTable caption={`${cfg.title} — ${cfg.tableLabel}`} rows={cfg.rows} />
          </Card>
        </div>
      </motion.div>

      <p className="font-body text-caption leading-relaxed text-fg-subtle">
        Sample data — illustrative broker figures shown to demonstrate the layout, not a Finance OS performance claim.
      </p>
    </div>
  )
}

export function DashboardsSection() {
  return (
    <Section
      id="dashboards"
      eyebrow="Dashboard Layouts"
      title="Dashboard Layouts"
      lead="Assembled broker dashboards — a KPI stat row, one tokenised chart and a compact status table, switched across Pipeline, Settlements and Commission. Blue-mono data, green only for movement, one amber at-risk moment per view, every chart drawn as inline SVG."
    >
      <ComposedFrom
        items={[
          { label: 'Dashboard Widgets', href: '#widgets' },
          { label: 'Charts', href: '#charts' },
          { label: 'Tables', href: '#tables' },
        ]}
      />
      <div className="flex flex-col gap-8">
        {/* The live, assembled dashboard */}
        <Demo label="Broker dashboard — switch the view" inspect={DASH_INSPECT}>
          <DashboardSurface />
        </Demo>

        {/* The three tokenised chart primitives, documented on their own */}
        <Demo label="Chart kit — tokenised inline SVG (bar · line · donut)" inspect={CHARTS_INSPECT}>
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="flex flex-col gap-4">
              <MonoLabel tone="subtle">Bar · new deals / month</MonoLabel>
              <div className="flex flex-1 items-center">
                <BarChart
                  data={DEALS_BY_MONTH}
                  highlightIndex={5}
                  ariaLabel="New deals by month, June to November, trending up to 58 in November"
                />
              </div>
              <p className="font-body text-caption text-fg-subtle">One highlighted column in deep accent.</p>
            </Card>

            <Card className="flex flex-col gap-4">
              <MonoLabel tone="subtle">Line · settlement value</MonoLabel>
              <div className="flex flex-1 items-center">
                <LineChart
                  data={SETTLEMENT_TREND}
                  ariaLabel="Settlement value in millions, rolling eight months, trending up"
                />
              </div>
              <p className="font-body text-caption text-fg-subtle">Area + line draw in on view.</p>
            </Card>

            <Card className="flex flex-col gap-4">
              <MonoLabel tone="subtle">Donut · commission split</MonoLabel>
              <div className="flex flex-1 items-center">
                <DonutChart
                  data={COMMISSION_BY_LENDER}
                  centerValue="$84.2k"
                  centerLabel="MTD"
                  formatValue={aud}
                  ariaLabel="Commission by lender this month, CBA the largest share"
                />
              </div>
              <p className="font-body text-caption text-fg-subtle">Hover or focus a lender to pull its slice forward.</p>
            </Card>
          </div>
        </Demo>
      </div>
    </Section>
  )
}
