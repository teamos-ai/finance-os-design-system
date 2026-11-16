/**
 * TablesSection — the Tables family, rebuilt on WHITE surfaces (17 Nov design review). Binary
 * comparison cells use the shared StatusIcon (green check · red cross · amber warning, each with an
 * accessible label); software ratings use the goat <GoatRating> / <GoatScorecard>; and the set covers
 * the patterns a broker page needs: a detailed scorecard, a software-ratings table, a side-by-side
 * comparison, plan inclusions, a plain data table (no status icons), and expandable rows.
 *
 * Real <table> semantics, hairline token borders, horizontal row rules only — no vertical rails, 8px
 * squircles, zero glass. Resting surfaces are white; grey appears only as a transient hover. Every
 * score is a clearly-labelled SAMPLE — the DS asserts nothing about real products.
 */
import { Fragment, useState } from 'react'
import { BarChart3, ChevronDown } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { Badge } from '@/components/ui/badge'
import { TokenTag } from '@/components/ui/token-tag'
import { StatusIcon } from '@/components/ui/status-icon'
import { GoatRating, GoatedBadge } from '@/components/scoring/GoatRating'
import { GoatScorecard } from '@/components/scoring/GoatScorecard'
import { overallScore, type ScoreCard } from '@/data/scoring'
import { cn } from '@/lib/cn'

/* ── Sample data (clearly illustrative — not real product reviews) ──────────────── */

/** A Goated sample — 23/25, nothing below 4. */
const SAMPLE_GOATED: ScoreCard = { 'australian-fit': 5, 'core-job': 5, 'fits-the-stack': 4, 'worth-the-money': 4, 'still-improving': 5 }

const RATINGS: { name: string; category: string; card: ScoreCard }[] = [
  { name: 'Sample CRM A', category: 'Broker CRM', card: SAMPLE_GOATED },
  { name: 'Sample CRM B', category: 'Broker CRM', card: { 'australian-fit': 4, 'core-job': 3, 'fits-the-stack': 3, 'worth-the-money': 3, 'still-improving': 4 } },
  { name: 'Sample Tool C', category: 'Serviceability', card: { 'australian-fit': 3, 'core-job': 2, 'fits-the-stack': 2, 'worth-the-money': 3, 'still-improving': 2 } },
]

type Status = 'yes' | 'no' | 'warn'
const COMPARE: { feature: string; a: Status; b: Status; note?: string }[] = [
  { feature: 'Built for Australian broking', a: 'yes', b: 'warn' },
  { feature: 'Aggregator panel sync', a: 'yes', b: 'no' },
  { feature: 'Serviceability + lender coverage', a: 'yes', b: 'yes' },
  { feature: 'Automated client nurture', a: 'yes', b: 'warn' },
  { feature: 'Published AUD pricing', a: 'yes', b: 'no' },
  { feature: 'CDR-accredited bank data', a: 'warn', b: 'no' },
]

/* Plan inclusions — cells map to [Essentials, Professional, Enterprise] */
type Cell = 'yes' | 'no' | 'metered'
const MATRIX: { group: string; rows: { feature: string; cells: [Cell, Cell, Cell] }[] }[] = [
  {
    group: 'Discovery',
    rows: [
      { feature: 'Lead source tracking', cells: ['yes', 'yes', 'yes'] },
      { feature: 'Enquiry response SLA board', cells: ['no', 'yes', 'yes'] },
      { feature: 'Aggregator panel sync', cells: ['no', 'metered', 'yes'] },
    ],
  },
  {
    group: 'Pipeline & conversion',
    rows: [
      { feature: 'Settlement pipeline', cells: ['yes', 'yes', 'yes'] },
      { feature: 'Show-up rate dashboard', cells: ['no', 'yes', 'yes'] },
      { feature: 'Automated client nurture', cells: ['no', 'metered', 'yes'] },
    ],
  },
  {
    group: 'Reporting',
    rows: [
      { feature: 'Monthly settlement report', cells: ['yes', 'yes', 'yes'] },
      { feature: 'Benchmark vs panel', cells: ['no', 'no', 'yes'] },
      { feature: 'Compliance flag routing', cells: ['no', 'yes', 'yes'] },
    ],
  },
]

/* Plain data table */
type TrendTone = 'up' | 'flat' | 'down'
const TREND_TONE: Record<TrendTone, string> = { up: 'text-success', flat: 'text-fg-subtle', down: 'text-danger' }
const DATA: { source: string; reviews: string; rating: string; verified: string; reported?: boolean; trend: { points: string; delta: string; tone: TrendTone } }[] = [
  { source: 'Google Business Profile', reviews: '1,284', rating: '4.8', verified: '312', trend: { points: '2,16 13,14 24,15 35,9 46,10 62,3', delta: '+6.2%', tone: 'up' } },
  { source: 'ProductReview.com.au', reviews: '642', rating: '4.7', verified: '198', trend: { points: '2,15 13,13 24,13 35,11 46,9 62,6', delta: '+3.1%', tone: 'up' } },
  { source: 'Broker directory', reviews: '410', rating: '4.6', verified: '221', trend: { points: '2,11 13,10 24,11 35,10 46,11 62,10', delta: '+0.4%', tone: 'flat' } },
  { source: 'Client exit survey', reviews: '289', rating: '4.5', verified: '176', reported: true, trend: { points: '2,7 13,9 24,8 35,12 46,13 62,16', delta: '−2.0%', tone: 'down' } },
]

/* Expandable rows — supporting detail revealed on demand */
const INTEGRATIONS: { name: string; status: Status; summary: string; detail: string }[] = [
  { name: 'Aggregator panel', status: 'yes', summary: 'Two-way sync', detail: 'Deals, lenders and commission records sync both ways on a 15-minute cadence; a failed sync surfaces on the SLA board rather than failing silently.' },
  { name: 'Open banking (CDR)', status: 'warn', summary: 'Add-on', detail: 'Available on Professional and above, through an accredited data recipient. On Essentials the client uploads statements instead — never a banking password.' },
  { name: 'E-signing', status: 'yes', summary: 'Included', detail: 'Documents are sent, chased and countersigned in-app; the audit trail is kept against the deal record.' },
  { name: 'Accounting export', status: 'no', summary: 'Not yet', detail: 'A CSV export is available today; a native ledger integration is on the roadmap but has not shipped, so it is marked honestly as absent.' },
]

/** Tiny inline sparkline — colour inherited from the trend tone via currentColor. */
function Spark({ points }: { points: string }) {
  return (
    <svg viewBox="0 0 64 20" className="h-[18px] w-[52px]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points={points} />
    </svg>
  )
}

/** A metered-allowance cell marker (plan matrix) — a centred outline badge, never a ribbon. */
function MeteredCell() {
  return (
    <Badge variant="outline" size="sm" className="bg-surface text-accent-text">
      Metered
    </Badge>
  )
}

const TH_OVERLINE = 'font-mono text-mono-xs uppercase tracking-wider text-fg-subtle'
const TH_DISPLAY = 'font-display text-body-sm font-semibold'
const SAMPLE_NOTE = 'Scores and figures are illustrative samples, not real product reviews, and are shown as reported, not independently verified.'

export function TablesSection() {
  const [open, setOpen] = useState<string | null>(INTEGRATIONS[0].name)

  return (
    <Section
      id="tables"
      eyebrow="Tables"
      title="Tables"
      lead="Broker-grade tables on white surfaces. Binary cells use a green check, red cross or amber warning (each with an accessible label); software ratings use the goats. A detailed scorecard, a ratings table, a side-by-side comparison, plan inclusions, a plain data table and expandable rows — every score a clearly-labelled sample."
    >
      <div className="flex flex-col gap-8">
        {/* (a) SOFTWARE SCORECARD — the detailed per-criterion goat rating */}
        <Demo
          label="Software scorecard — the five-criterion goat rating (sample)"
          action={<TokenTag>{'<GoatScorecard card>'}</TokenTag>}
        >
          <GoatScorecard card={SAMPLE_GOATED} title="Sample CRM A — scorecard" />
          <p className="mt-2.5 font-body text-caption leading-relaxed text-fg-subtle">{SAMPLE_NOTE}</p>
        </Demo>

        {/* (b) SOFTWARE RATINGS — a table of products with an overall goat score */}
        <Demo
          label="Software ratings — overall goat score per product (sample)"
          action={
            <div className="flex flex-wrap items-center gap-1.5">
              <TokenTag>{'<GoatRating score>'}</TokenTag>
              <TokenTag>{'<GoatedBadge>'}</TokenTag>
            </div>
          }
        >
          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr>
                  <th scope="col" className={cn('border-b border-border-strong px-5 py-3.5 text-left', TH_OVERLINE)}>Software</th>
                  <th scope="col" className={cn('border-b border-border-strong px-5 py-3.5 text-left', TH_OVERLINE)}>Category</th>
                  <th scope="col" className={cn('border-b border-border-strong px-5 py-3.5 text-left', TH_OVERLINE)}>Overall</th>
                </tr>
              </thead>
              <tbody>
                {RATINGS.map((r, i) => {
                  const rule = i < RATINGS.length - 1 ? 'border-b border-border' : ''
                  const score = overallScore(r.card)
                  return (
                    <tr key={r.name} className="transition-colors hover:bg-canvas-muted">
                      <th scope="row" className={cn('px-5 py-4 text-left align-middle', rule)}>
                        <span className="flex items-center gap-2.5 font-body text-body-sm font-semibold text-fg">
                          {r.name}
                          {score === 5 ? <GoatedBadge /> : null}
                        </span>
                      </th>
                      <td className={cn('px-5 py-4 align-middle font-body text-body-sm text-fg-muted', rule)}>{r.category}</td>
                      <td className={cn('px-5 py-4 align-middle', rule)}>
                        <GoatRating score={score} size={40} showLabel />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2.5 font-body text-caption leading-relaxed text-fg-subtle">{SAMPLE_NOTE}</p>
        </Demo>

        {/* (c) SIDE-BY-SIDE — two products across capabilities, StatusIcon cells */}
        <Demo
          label="Side-by-side — two products, green check / red cross / amber warning"
          action={<TokenTag>{'<StatusIcon variant>'}</TokenTag>}
        >
          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr>
                  <th scope="col" className={cn('w-1/2 border-b border-border-strong px-5 py-3.5 text-left', TH_OVERLINE)}>Capability</th>
                  <th scope="col" className={cn('border-b border-border-strong px-5 py-3.5 text-center text-fg', TH_DISPLAY)}>Sample CRM A</th>
                  <th scope="col" className={cn('border-b border-border-strong px-5 py-3.5 text-center text-fg', TH_DISPLAY)}>Sample CRM B</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => {
                  const rule = i < COMPARE.length - 1 ? 'border-b border-border' : ''
                  return (
                    <tr key={row.feature} className="transition-colors hover:bg-canvas-muted">
                      <th scope="row" className={cn('px-5 py-3.5 text-left font-body text-body-sm font-normal text-fg', rule)}>{row.feature}</th>
                      <td className={cn('px-5 py-3.5 text-center', rule)}>
                        <span className="inline-flex justify-center"><StatusIcon variant={row.a} /></span>
                      </td>
                      <td className={cn('px-5 py-3.5 text-center', rule)}>
                        <span className="inline-flex justify-center"><StatusIcon variant={row.b} /></span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2.5 font-body text-caption leading-relaxed text-fg-subtle">
            Each cell carries an accessible label (Yes / No / Partial) for screen readers; the shape, not only the
            colour, carries the meaning. {SAMPLE_NOTE}
          </p>
        </Demo>

        {/* (d) PLAN INCLUSIONS — matrix, sticky first column, StatusIcon cells */}
        <Demo
          label="Plan inclusions — capabilities by plan, sticky first column"
          action={
            <div className="flex flex-wrap items-center gap-1.5">
              <TokenTag title="frozen column">sticky left-0</TokenTag>
              <TokenTag title="highlighted plan">bg-accent-soft</TokenTag>
            </div>
          }
        >
          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr>
                  <th scope="col" className={cn('sticky left-0 z-20 border-b border-border-strong bg-surface px-5 py-3.5 text-left', TH_OVERLINE)}>Capability</th>
                  <th scope="col" className={cn('border-b border-border-strong px-5 py-3.5 text-center text-fg', TH_DISPLAY)}>Essentials</th>
                  <th scope="col" className={cn('border-b border-border-strong bg-accent-soft px-5 py-3.5 text-center text-fg', TH_DISPLAY)}>
                    <span className="flex flex-col items-center gap-1.5">
                      <Badge variant="blue" size="sm" className="bg-accent text-accent-fg">Most chosen</Badge>
                      <span>Professional</span>
                    </span>
                  </th>
                  <th scope="col" className={cn('border-b border-border-strong px-5 py-3.5 text-center text-fg', TH_DISPLAY)}>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((section) => (
                  <Fragment key={section.group}>
                    <tr>
                      <th scope="colgroup" colSpan={4} className="sticky left-0 border-b border-border bg-surface px-5 py-2.5 text-left font-mono text-mono-xs uppercase tracking-wider text-accent-text">
                        {section.group}
                      </th>
                    </tr>
                    {section.rows.map((row) => (
                      <tr key={row.feature} className="group">
                        <th scope="row" className="sticky left-0 z-10 border-b border-border bg-surface px-5 py-3 text-left font-body text-body-sm font-normal text-fg transition-colors group-hover:bg-canvas-muted">
                          {row.feature}
                        </th>
                        {row.cells.map((cell, ci) => (
                          <td key={ci} className={cn('border-b border-border px-5 py-3 text-center align-middle transition-colors group-hover:bg-canvas-muted', ci === 1 && 'bg-accent-soft')}>
                            <span className="inline-flex justify-center">
                              {cell === 'metered' ? <MeteredCell /> : <StatusIcon variant={cell} />}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2.5 font-body text-caption leading-relaxed text-fg-subtle">
            Metered capabilities draw on a monthly allowance; compliance flags route to your own licensee, never an
            assertion of breach.
          </p>
        </Demo>

        {/* (e) PLAIN DATA TABLE — figures + sparklines, no status icons */}
        <Demo
          label="Plain data table — figures, tabular-nums, no status icons"
          action={
            <div className="flex flex-wrap items-center gap-1.5">
              <TokenTag title="aligned figures">tabular-nums</TokenTag>
              <TokenTag>{'<Badge variant="amber">'}</TokenTag>
            </div>
          }
        >
          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th scope="col" className={cn('whitespace-nowrap border-b border-border-strong px-5 py-3.5 text-left', TH_OVERLINE)}>Source</th>
                  <th scope="col" className={cn('whitespace-nowrap border-b border-border-strong px-5 py-3.5 text-right', TH_OVERLINE)}>Reviews</th>
                  <th scope="col" className={cn('whitespace-nowrap border-b border-border-strong px-5 py-3.5 text-right', TH_OVERLINE)}>Avg rating</th>
                  <th scope="col" className={cn('whitespace-nowrap border-b border-border-strong px-5 py-3.5 text-right', TH_OVERLINE)}>Verified settlements</th>
                  <th scope="col" className={cn('whitespace-nowrap border-b border-border-strong px-5 py-3.5 text-left', TH_OVERLINE)}>6-month trend</th>
                </tr>
              </thead>
              <tbody>
                {DATA.map((row, i) => {
                  const rule = i < DATA.length - 1 ? 'border-b border-border' : ''
                  return (
                    <tr key={row.source} className="transition-colors hover:bg-canvas-muted">
                      <td className={cn('px-5 py-3.5', rule)}>
                        <span className="flex items-center gap-3 font-body text-body-sm font-semibold text-fg">
                          <span aria-hidden className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-sm bg-wash-tint text-accent">
                            <BarChart3 className="h-4 w-4" strokeWidth={1.8} />
                          </span>
                          {row.source}
                        </span>
                      </td>
                      <td className={cn('px-5 py-3.5 text-right font-body text-body-sm tabular-nums text-fg-muted', rule)}>{row.reviews}</td>
                      <td className={cn('px-5 py-3.5 text-right tabular-nums', rule)}>
                        <span className="font-display text-body-sm font-semibold text-fg">
                          {row.rating}
                          <span className="font-body text-caption font-normal text-fg-subtle">/5</span>
                        </span>
                      </td>
                      <td className={cn('px-5 py-3.5 text-right font-body text-body-sm tabular-nums text-fg-muted', rule)}>
                        <span className="inline-flex items-center justify-end gap-2">
                          {row.reported && <Badge variant="amber" size="sm">Reported</Badge>}
                          {row.verified}
                        </span>
                      </td>
                      <td className={cn('px-5 py-3.5', rule)}>
                        <span className={cn('inline-flex items-center gap-2 font-body text-body-sm font-semibold tabular-nums', TREND_TONE[row.trend.tone])}>
                          <Spark points={row.trend.points} />
                          {row.trend.delta}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2.5 font-body text-caption leading-relaxed text-fg-subtle">
            Settlement counts flagged <Badge variant="amber" size="sm">Reported</Badge> are supplied by the broker and shown as reported, not independently verified.
          </p>
        </Demo>

        {/* (f) EXPANDABLE ROWS — supporting detail on demand */}
        <Demo
          label="Expandable rows — a row opens to its supporting detail"
          action={<TokenTag title="disclosure">aria-expanded</TokenTag>}
        >
          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th scope="col" className={cn('border-b border-border-strong px-5 py-3.5 text-left', TH_OVERLINE)}>Integration</th>
                  <th scope="col" className={cn('border-b border-border-strong px-5 py-3.5 text-left', TH_OVERLINE)}>Status</th>
                  <th scope="col" className={cn('border-b border-border-strong px-5 py-3.5 text-right', TH_OVERLINE)}>Detail</th>
                </tr>
              </thead>
              <tbody>
                {INTEGRATIONS.map((row, i) => {
                  const isOpen = open === row.name
                  const rule = i < INTEGRATIONS.length - 1 || isOpen ? 'border-b border-border' : ''
                  const labels: Record<Status, string> = { yes: 'Included', no: 'Not yet', warn: 'Add-on' }
                  return (
                    <Fragment key={row.name}>
                      <tr className="transition-colors hover:bg-canvas-muted">
                        <th scope="row" className={cn('px-5 py-3.5 text-left font-body text-body-sm font-semibold text-fg', rule)}>{row.name}</th>
                        <td className={cn('px-5 py-3.5 text-left', rule)}>
                          <span className="inline-flex items-center gap-2 font-body text-body-sm text-fg-muted">
                            <StatusIcon variant={row.status} label={labels[row.status]} size="sm" />
                            {row.summary}
                          </span>
                        </td>
                        <td className={cn('px-5 py-2.5 text-right', rule)}>
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-label={`${isOpen ? 'Hide' : 'Show'} detail for ${row.name}`}
                            onClick={() => setOpen(isOpen ? null : row.name)}
                            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 font-mono text-mono-2xs uppercase tracking-[0.08em] text-fg-muted transition-calm duration-fast ease-out hover:border-border-strong hover:text-fg active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                          >
                            {isOpen ? 'Hide' : 'Detail'}
                            <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-base ease-out', isOpen && 'rotate-180')} strokeWidth={2} aria-hidden />
                          </button>
                        </td>
                      </tr>
                      {isOpen ? (
                        <tr>
                          <td colSpan={3} className={cn('bg-surface px-5 pb-4 pt-0', i < INTEGRATIONS.length - 1 && 'border-b border-border')}>
                            <p className="max-w-3xl font-body text-body-sm leading-relaxed text-fg-muted">{row.detail}</p>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2.5 font-body text-caption leading-relaxed text-fg-subtle">
            One row open at a time; the control is keyboard-accessible and labelled, and the chevron gives a static
            cue so the state never depends on motion.
          </p>
        </Demo>
      </div>
    </Section>
  )
}
