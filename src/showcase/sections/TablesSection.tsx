/**
 * TablesSection — the Tables family. Three broker-grade table patterns rebuilt on the
 * token system: a two-column COMPARISON (generic review sites vs the Finance OS accent
 * column), a plan FEATURE MATRIX (sticky first column, a centred "Most chosen" tier badge,
 * tick / dash / metered cells) and a clean DATA TABLE (tabular-nums figures, zebra-on-hover,
 * inline sparklines and the amber "Reported" provenance flag). Real <table> semantics,
 * hairline token borders, horizontal row rules only — no vertical rails, 8px squircles,
 * zero glass. Each variation sits in its own Demo frame and carries a reported-not-verified note.
 */
import { Fragment, type ReactNode } from 'react'
import { BarChart3, Check, Minus, X } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/cn'

/** Inline blue highlight chip — blue owns every typographic highlight. */
function Hl({ children }: { children: ReactNode }) {
  return (
    <span className="whitespace-nowrap rounded-sm border border-border bg-surface px-1.5 font-semibold text-accent-text">
      {children}
    </span>
  )
}

type MarkKind = 'tick' | 'cross' | 'dash'

/** tick / cross / dash status glyphs — squircle tiles, never circles (success · inset · hairline). */
function Mark({ kind }: { kind: MarkKind }) {
  if (kind === 'dash') {
    return <Minus className="inline-block h-4 w-4 text-border-strong" strokeWidth={2.2} aria-hidden />
  }
  const isTick = kind === 'tick'
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm',
        isTick ? 'bg-success-soft text-success' : 'bg-inset text-fg-subtle',
      )}
    >
      {isTick ? <Check className="h-3 w-3" strokeWidth={2.2} /> : <X className="h-3 w-3" strokeWidth={2.2} />}
    </span>
  )
}

/** Tiny inline sparkline — colour is inherited from the trend tone via currentColor. */
function Spark({ points }: { points: string }) {
  return (
    <svg
      viewBox="0 0 64 20"
      className="h-[18px] w-[52px]"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points={points} />
    </svg>
  )
}

type TrendTone = 'up' | 'flat' | 'down'
const TREND_TONE: Record<TrendTone, string> = {
  up: 'text-success',
  flat: 'text-fg-subtle',
  down: 'text-danger',
}

/* ---- (a) COMPARISON ---- */
const COMPARISON: { criterion: string; generic: string; fos: ReactNode }[] = [
  {
    criterion: 'How rankings are set',
    generic: 'Brokers buy a higher spot with an ad budget.',
    fos: <>Ordered on <Hl>settlement volume</Hl> — no paid placement.</>,
  },
  {
    criterion: 'What actually gets measured',
    generic: 'A star rating with no method shown.',
    fos: <>Enquiry-to-settlement and <Hl>show-up rate</Hl>.</>,
  },
  {
    criterion: 'Who is allowed to appear',
    generic: 'Any broker who pays to list.',
    fos: <>Licensed under an <Hl>ACL</Hl> or as a credit representative.</>,
  },
  {
    criterion: 'How the numbers are checked',
    generic: 'Reviews posted without any verification.',
    fos: <>Every figure marked <Hl>reported, not verified</Hl>.</>,
  },
  {
    criterion: 'Conflicts of interest',
    generic: 'Aggregator ties left undisclosed.',
    fos: <><Hl>Aggregator</Hl> and lender panel disclosed up front.</>,
  },
]

/* ---- (b) FEATURE MATRIX — cells map to [Essentials, Professional, Enterprise] ---- */
type MatrixCell = 'tick' | 'dash' | 'metered'
const MATRIX: {
  group: string
  rows: { feature: string; cells: [MatrixCell, MatrixCell, MatrixCell] }[]
}[] = [
  {
    group: 'Discovery',
    rows: [
      { feature: 'Lead source tracking', cells: ['tick', 'tick', 'tick'] },
      { feature: 'Enquiry response SLA board', cells: ['dash', 'tick', 'tick'] },
      { feature: 'Aggregator panel sync', cells: ['dash', 'metered', 'tick'] },
    ],
  },
  {
    group: 'Pipeline & conversion',
    rows: [
      { feature: 'Settlement pipeline', cells: ['tick', 'tick', 'tick'] },
      { feature: 'Show-up rate dashboard', cells: ['dash', 'tick', 'tick'] },
      { feature: 'Automated client nurture', cells: ['dash', 'metered', 'tick'] },
    ],
  },
  {
    group: 'Reporting',
    rows: [
      { feature: 'Monthly settlement report', cells: ['tick', 'tick', 'tick'] },
      { feature: 'Benchmark vs panel', cells: ['dash', 'dash', 'tick'] },
      { feature: 'Compliance flag routing', cells: ['dash', 'tick', 'tick'] },
    ],
  },
]

/* ---- (c) DATA TABLE ---- */
const DATA: {
  source: string
  reviews: string
  rating: string
  verified: string
  reported?: boolean
  trend: { points: string; delta: string; tone: TrendTone }
}[] = [
  { source: 'Google Business Profile', reviews: '1,284', rating: '4.8', verified: '312', trend: { points: '2,16 13,14 24,15 35,9 46,10 62,3', delta: '+6.2%', tone: 'up' } },
  { source: 'ProductReview.com.au', reviews: '642', rating: '4.7', verified: '198', trend: { points: '2,15 13,13 24,13 35,11 46,9 62,6', delta: '+3.1%', tone: 'up' } },
  { source: 'Broker directory', reviews: '410', rating: '4.6', verified: '221', trend: { points: '2,11 13,10 24,11 35,10 46,11 62,10', delta: '+0.4%', tone: 'flat' } },
  { source: 'Aggregator panel', reviews: '356', rating: '4.9', verified: '540', trend: { points: '2,17 13,15 24,12 35,11 46,7 62,2', delta: '+8.7%', tone: 'up' } },
  { source: 'Client exit survey', reviews: '289', rating: '4.5', verified: '176', reported: true, trend: { points: '2,7 13,9 24,8 35,12 46,13 62,16', delta: '−2.0%', tone: 'down' } },
]

/** Shared header treatments — the small mono overline and the 13px display label. */
const TH_OVERLINE = 'font-mono text-mono-xs uppercase tracking-wider text-fg-subtle'
const TH_DISPLAY = 'font-display text-body-sm font-semibold'

export function TablesSection() {
  return (
    <Section
      id="tables"
      eyebrow="16 - Tables"
      title="Tables"
      lead="Three table patterns tuned for broker-grade claims — a comparison, a capability matrix and a clean data table. Measured, sourced, and honest about what is reported versus verified."
    >
      <div className="flex flex-col gap-8">
        {/* (a) COMPARISON — generic review sites vs the Finance OS accent column */}
        <Demo label="Comparison — why a Finance OS ranking reads differently from a review site">
          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th scope="col" className={cn('w-[26%] border-b border-border px-5 py-4 text-left align-bottom', TH_OVERLINE)}>
                    What&rsquo;s being compared
                  </th>
                  <th scope="col" className={cn('border-b border-border px-5 py-4 text-left align-bottom text-fg-muted', TH_DISPLAY)}>
                    Most review sites
                  </th>
                  <th scope="col" className={cn('border-b border-accent bg-accent px-5 py-4 text-left align-bottom text-accent-fg', TH_DISPLAY)}>
                    Finance OS research
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => {
                  const rule = i < COMPARISON.length - 1 ? 'border-b border-border' : ''
                  return (
                    <tr key={row.criterion}>
                      <th scope="row" className={cn('px-5 py-4 text-left align-top font-body text-body-sm font-semibold text-fg', rule)}>
                        {row.criterion}
                      </th>
                      <td className={cn('px-5 py-4 align-top', rule)}>
                        <span className="flex items-start gap-3 font-body text-body-sm leading-relaxed text-fg-muted">
                          <Mark kind="cross" />
                          <span>{row.generic}</span>
                        </span>
                      </td>
                      <td className={cn('bg-accent-soft px-5 py-4 align-top', rule)}>
                        <span className="flex items-start gap-3 font-body text-body-sm leading-relaxed text-fg">
                          <Mark kind="tick" />
                          <span>{row.fos}</span>
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2.5 font-body text-caption leading-relaxed text-fg-subtle">
            Figures are self-reported by brokers and have not been independently verified by Finance OS.
          </p>
        </Demo>

        {/* (b) FEATURE MATRIX — sticky first column, accent Professional column, grouped rows */}
        <Demo label="Feature matrix — capabilities by plan, with a sticky first column">
          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr>
                  <th scope="col" className={cn('sticky left-0 z-20 border-b border-border-strong bg-surface px-5 py-3.5 text-left', TH_OVERLINE)}>
                    Capability
                  </th>
                  <th scope="col" className={cn('border-b border-border-strong px-5 py-3.5 text-center text-fg', TH_DISPLAY)}>
                    Essentials
                  </th>
                  <th scope="col" className={cn('border-b border-border-strong bg-accent-soft px-5 py-3.5 text-center text-fg', TH_DISPLAY)}>
                    {/* "Most chosen" marker — CENTERED top badge only, never a ribbon */}
                    <span className="flex flex-col items-center gap-1.5">
                      <Badge variant="blue" size="sm" className="bg-accent text-accent-fg">
                        Most chosen
                      </Badge>
                      <span>Professional</span>
                    </span>
                  </th>
                  <th scope="col" className={cn('border-b border-border-strong px-5 py-3.5 text-center text-fg', TH_DISPLAY)}>
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((section) => (
                  <Fragment key={section.group}>
                    <tr>
                      <th
                        scope="colgroup"
                        colSpan={4}
                        className="sticky left-0 border-b border-border bg-canvas-muted px-5 py-2.5 text-left font-mono text-mono-xs uppercase tracking-wider text-fg-muted"
                      >
                        {section.group}
                      </th>
                    </tr>
                    {section.rows.map((row) => (
                      <tr key={row.feature} className="group">
                        <th
                          scope="row"
                          className="sticky left-0 z-10 border-b border-border bg-surface px-5 py-3 text-left font-body text-body-sm font-normal text-fg transition-colors group-hover:bg-canvas-muted"
                        >
                          {row.feature}
                        </th>
                        {row.cells.map((cell, ci) => (
                          <td
                            key={ci}
                            className={cn(
                              'border-b border-border px-5 py-3 text-center align-middle transition-colors group-hover:bg-canvas-muted',
                              ci === 1 && 'bg-accent-soft',
                            )}
                          >
                            {cell === 'metered' ? (
                              <Badge variant="outline" size="sm" className="bg-surface text-accent-text">
                                Metered
                              </Badge>
                            ) : (
                              <Mark kind={cell} />
                            )}
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

        {/* (c) DATA TABLE — tabular figures, hover rows, sparklines, amber "Reported" flag */}
        <Demo label="Data table — review scores by source, tabular figures, zebra-on-hover">
          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th scope="col" className={cn('whitespace-nowrap border-b border-border-strong px-5 py-3.5 text-left', TH_OVERLINE)}>
                    Source
                  </th>
                  <th scope="col" className={cn('whitespace-nowrap border-b border-border-strong px-5 py-3.5 text-right', TH_OVERLINE)}>
                    Reviews
                  </th>
                  <th scope="col" className={cn('whitespace-nowrap border-b border-border-strong px-5 py-3.5 text-right', TH_OVERLINE)}>
                    Avg rating
                  </th>
                  <th scope="col" className={cn('whitespace-nowrap border-b border-border-strong px-5 py-3.5 text-right', TH_OVERLINE)}>
                    Verified settlements
                  </th>
                  <th scope="col" className={cn('whitespace-nowrap border-b border-border-strong px-5 py-3.5 text-left', TH_OVERLINE)}>
                    6-month trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {DATA.map((row, i) => {
                  const rule = i < DATA.length - 1 ? 'border-b border-border' : ''
                  return (
                    <tr key={row.source} className="transition-colors hover:bg-canvas-muted">
                      <td className={cn('px-5 py-3.5', rule)}>
                        <span className="flex items-center gap-3 font-body text-body-sm font-semibold text-fg">
                          <span
                            aria-hidden
                            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-sm bg-wash-tint text-accent"
                          >
                            <BarChart3 className="h-4 w-4" strokeWidth={1.8} />
                          </span>
                          {row.source}
                        </span>
                      </td>
                      <td className={cn('px-5 py-3.5 text-right font-body text-body-sm tabular-nums text-fg-muted', rule)}>
                        {row.reviews}
                      </td>
                      <td className={cn('px-5 py-3.5 text-right tabular-nums', rule)}>
                        <span className="font-display text-body-sm font-semibold text-fg">
                          {row.rating}
                          <span className="font-body text-caption font-normal text-fg-subtle">/5</span>
                        </span>
                      </td>
                      <td className={cn('px-5 py-3.5 text-right font-body text-body-sm tabular-nums text-fg-muted', rule)}>
                        <span className="inline-flex items-center justify-end gap-2">
                          {row.reported && (
                            <Badge variant="amber" size="sm">
                              Reported
                            </Badge>
                          )}
                          {row.verified}
                        </span>
                      </td>
                      <td className={cn('px-5 py-3.5', rule)}>
                        <span
                          className={cn(
                            'inline-flex items-center gap-2 font-body text-body-sm font-semibold tabular-nums',
                            TREND_TONE[row.trend.tone],
                          )}
                        >
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
            Settlement counts flagged{' '}
            <Badge variant="amber" size="sm">
              Reported
            </Badge>{' '}
            are supplied by the broker and shown as reported, not independently verified.
          </p>
        </Demo>
      </div>
    </Section>
  )
}
