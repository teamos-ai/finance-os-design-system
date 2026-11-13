/**
 * ChartsSection — the reusable chart primitives, on their own (Components → Charts). These are the
 * token-only inline-SVG/div charts the dashboards and the Evidence Layouts compose from: one accent
 * (Atlas Blue), depth by opacity step, a single in-view draw-in, reduced-motion safe, each with a
 * required aria-label. Drawn from scratch — no charting library (the preserveSymlinks React-dedup
 * risk rules one out, and inline SVG stays on the token system anyway).
 *
 * Every figure below is illustrative sample data, not a measured result (brand rule 09).
 */
import { Section, Demo } from '@/showcase/Section'
import { Badge } from '@/components/ui/badge'
import {
  BarChart,
  LineChart,
  DonutChart,
  RingStat,
  RankedBarChart,
  SplitTrack,
  FillBar,
} from '@/components/dashboards/charts'
import type { InspectData } from '@/components/ui/inspectable'

const BAR_DATA = [
  { label: 'W1', value: 12 },
  { label: 'W2', value: 18 },
  { label: 'W3', value: 15 },
  { label: 'W4', value: 24 },
  { label: 'W5', value: 21 },
]
const LINE_DATA = [
  { label: 'Jan', value: 42 },
  { label: 'Feb', value: 48 },
  { label: 'Mar', value: 45 },
  { label: 'Apr', value: 57 },
  { label: 'May', value: 61 },
  { label: 'Jun', value: 72 },
]
const DONUT_DATA = [
  { label: 'Refinance', value: 42 },
  { label: 'First home', value: 28 },
  { label: 'Investment', value: 18 },
  { label: 'Construction', value: 12 },
]
const RANKED_DATA = [
  { label: 'Referrals & repeat', value: 48 },
  { label: 'Aggregator', value: 31 },
  { label: 'Website & ads', value: 19 },
  { label: 'Social', value: 12 },
]

const BAR_INSPECT: InspectData = {
  name: 'BarChart · LineChart',
  explain:
    'Vertical bars with one pulled-forward column, and an area+line trend with a marked end point. Both draw in on scroll (bars grow, line draws) and fall back to static when motion is reduced. Gridlines are border tokens; one column/point carries the accent-press emphasis.',
  token: [
    'bars   fill-accent · highlight → fill-accent-press · grid stroke-border-subtle',
    'line   stroke currentColor (accent) · area linearGradient 0.2→0 · end dot fill-accent',
    'labels font-mono · text-mono-2xs · tabular-nums',
    'draw   whileInView · EASE_OUT · reduced-motion → static',
  ].join('\n'),
  code: [
    '<BarChart data={data} highlightIndex={3} ariaLabel="Enquiries by week" />',
    '<LineChart data={data} ariaLabel="Settlements trend" />',
  ].join('\n'),
}

const RADIAL_INSPECT: InspectData = {
  name: 'DonutChart · RingStat',
  explain:
    'A multi-segment donut with an interactive, focus-highlightable legend and a total in the centre; and a single-value radial gauge whose arc sweeps to a percentage while the figure counts up. Both are one accent stepped by opacity — never a second hue.',
  token: [
    'donut  segments stroke currentColor · opacity steps 1·.74·.52·.36·.22 · track stroke-inset',
    'ring   arc stroke-current · strokeDashoffset C→C·(1−pct) · figure font-display CountUp',
    'legend row button · active bg-canvas-muted · % in text-fg-subtle',
  ].join('\n'),
  code: [
    '<DonutChart data={data} centerValue="100%" centerLabel="book" ariaLabel="Loan book mix" />',
    '<RingStat pct={68} value={68} suffix="%" centerSub="of target" ariaLabel="68% of target" />',
  ].join('\n'),
}

const BARS_INSPECT: InspectData = {
  name: 'RankedBarChart · SplitTrack · FillBar',
  explain:
    'A ranked horizontal list whose bars fill left→right (values count up, top row pulled forward); a proportional split track with a swatch legend; and the bare FillBar progress primitive the capacity meters and leaderboards use. All reduced-motion safe.',
  token: [
    'ranked  rank text-accent-text · track bg-inset · fill bg-accent / top bg-accent-press',
    'split   segments bg-accent stepped by opacity · % legend',
    'fillbar track bg-inset · fill bg-accent · width 0→pct on view · optional delay (stagger)',
  ].join('\n'),
  code: [
    '<RankedBarChart data={data} ariaLabel="Enquiry sources" />',
    '<SplitTrack segments={[{label:"AU",value:24},{label:"NZ",value:20}]} ariaLabel="AU vs NZ" />',
    '<FillBar pct={64} className="h-2.5" ariaLabel="64% of capacity" />',
  ].join('\n'),
}

export function ChartsSection() {
  return (
    <Section
      id="charts"
      eyebrow="Charts"
      title="Charts"
      lead="The reusable chart primitives the dashboards and evidence layouts are built from — one Atlas-Blue accent, depth by opacity, a single in-view draw-in, drawn as inline SVG on the token system. Compose them; never reach for a charting library."
    >
      <div className="flex flex-col gap-8">
        <Demo label="Bar & line — comparison and trend" inspect={BAR_INSPECT}>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <p className="font-mono text-mono-xs uppercase tracking-wider text-fg-subtle">BarChart</p>
              <BarChart data={BAR_DATA} highlightIndex={3} ariaLabel="Enquiries by week, week four highest" />
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-mono text-mono-xs uppercase tracking-wider text-fg-subtle">LineChart</p>
              <LineChart data={LINE_DATA} ariaLabel="Settlements trend over six months, rising" />
            </div>
          </div>
        </Demo>

        <Demo label="Donut & ring — composition and a single value" inspect={RADIAL_INSPECT}>
          <div className="grid items-center gap-8 sm:grid-cols-2">
            <DonutChart
              data={DONUT_DATA}
              centerValue="100%"
              centerLabel="loan book"
              formatValue={(v) => `${v}%`}
              ariaLabel="Loan book mix by purpose"
            />
            <div className="mx-auto flex flex-col items-center gap-3">
              <p className="font-mono text-mono-xs uppercase tracking-wider text-fg-subtle">RingStat</p>
              <RingStat pct={68} value={68} suffix="%" centerSub="of FY target" ariaLabel="68 percent of the financial-year target" />
            </div>
          </div>
        </Demo>

        <Demo label="Ranked bars, split track & fill" inspect={BARS_INSPECT}>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <p className="font-mono text-mono-xs uppercase tracking-wider text-fg-subtle">RankedBarChart</p>
              <RankedBarChart data={RANKED_DATA} valueSuffix="%" ariaLabel="New business by source" className="max-w-2xl" />
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="flex flex-col gap-3">
                <p className="font-mono text-mono-xs uppercase tracking-wider text-fg-subtle">SplitTrack</p>
                <SplitTrack
                  segments={[
                    { label: 'Owner-occupier', value: 62 },
                    { label: 'Investor', value: 38 },
                  ]}
                  ariaLabel="Owner-occupier versus investor split"
                />
              </div>
              <div className="flex flex-col gap-3">
                <p className="font-mono text-mono-xs uppercase tracking-wider text-fg-subtle">FillBar</p>
                <div className="flex flex-col gap-2.5">
                  <FillBar pct={82} className="h-2.5" ariaLabel="Capacity 82 percent" />
                  <FillBar pct={54} className="h-2.5" delay={0.08} ariaLabel="Capacity 54 percent" />
                  <FillBar pct={31} className="h-2.5" delay={0.16} ariaLabel="Capacity 31 percent" />
                </div>
              </div>
            </div>
          </div>
        </Demo>

        <div className="flex justify-center">
          <Badge variant="outline" size="sm">
            Illustrative sample data · not measured results
          </Badge>
        </div>
      </div>
    </Section>
  )
}
