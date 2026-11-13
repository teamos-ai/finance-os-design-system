/**
 * MarketEvidenceSection — the brand's market-research graphs, as a design-system pattern.
 * Ports positioning section 02 ("Who you are for") graph vocabulary: a readiness RingStat, a
 * customer-snapshot stat cluster, and AXL's Australian search-demand RankedBarChart + SplitTrack,
 * each paired with its source disclosure and the full keyword table. Every graph fills / counts
 * up on scroll (the brand's premium reveal), composed from the same tokens + motion as the rest
 * of the system, so the DS and the gated brand page read as one.
 *
 * Honesty is part of the data, not decoration: every figure is reported, not verified — the
 * `unverified` flags and the source / method strings render WITH the figures (brand rule 09;
 * audit-instrument rules). These AXL / MFAA research figures only belong here because the DS is
 * login-gated like the brand page. Blue owns all data; no amber, no second hue.
 */
import { Section, Demo } from '@/showcase/Section'
import { Card } from '@/components/ui/card'
import { Disclosure } from '@/components/ui/disclosure'
import { MonoLabel } from '@/components/ui/mono-label'
import { RingStat, RankedBarChart, SplitTrack } from '@/components/dashboards/charts'
import { CountUp, FadeIn, Stagger, StaggerItem } from '@/lib/motion'
import type { InspectData } from '@/components/ui/inspectable'
import { marketEvidence as M } from '@/data/positioning'

/** Reported-not-verified flag — a quiet neutral pill (never amber; honesty, not status). */
function Flag() {
  return (
    <span className="ml-1 inline-flex items-center rounded-xs bg-elevated px-1.5 py-0.5 align-middle font-mono text-mono-2xs uppercase tracking-wider text-fg-subtle">
      unverified
    </span>
  )
}

const READINESS_INSPECT: InspectData = {
  name: 'RingStat',
  explain:
    'A single-value radial gauge: one Atlas Blue arc sweeps to the percentage on scroll while the figure counts up over it. Not a multi-segment donut — the readiness/“N of M” shape. The sibling tile is a bare count-up figure.',
  token: [
    'ring    svg 120² · r 52 · C=2πr · track stroke-inset',
    'arc     stroke-current (accent) · strokeDashoffset C→C·(1−pct) · rotate(-90)',
    'figure  font-display · tabular-nums · CountUp on view · slash in fg-subtle',
    'reveal  arc 0.9s ease-out · reduced-motion → static at final',
  ].join('\n'),
  code: [
    '<RingStat pct={100} value={10} slash="/10" centerSub="decided"',
    '  ariaLabel="All 10 positioning sections decided" />',
  ].join('\n'),
}

const STATS_INSPECT: InspectData = {
  name: 'Stat cluster + source disclosure',
  explain:
    'A customer-snapshot grid of count-up stat tiles. Each figure is reported, not verified: the three hypothesis figures carry an inline “unverified” flag, and a disclosure holds the sources and what is not yet measured. The flag is a neutral pill, never amber — amber is status only.',
  token: [
    'tile    Card · MonoLabel eyebrow · font-display figure (CountUp) · caption',
    'flag    bg-elevated · font-mono text-mono-2xs uppercase · text-fg-subtle',
    'reveal  Stagger → StaggerItem (fade + rise, 0.07s apart)',
    'source  <Disclosure> — sources + not-yet-measured, verbatim',
  ].join('\n'),
  code: [
    "{stats.map((s) => <Card>…<CountUp to={s.value} /> {s.unverified && <Flag/>}</Card>)}",
    '<Disclosure title="Sources & what’s not yet measured">…</Disclosure>',
  ].join('\n'),
}

const SEARCH_INSPECT: InspectData = {
  name: 'RankedBarChart + SplitTrack + table',
  explain:
    'AXL’s Australian search sample as three paired views: a ranked horizontal bar chart (bars fill left→right on scroll, values count up), a two-segment AU/NZ split track, and the full keyword table behind a disclosure. One accent, the top row pulled forward; a method-and-source disclosure carries the caveats.',
  token: [
    'bars    rank · label · track bg-inset · fill bg-accent (top: accent-press) · CountUp value',
    'fill    width 0→value/max% · staggered 0.08s · reduced-motion → static',
    'split   segments bg-accent stepped by opacity · swept on view · % legend',
    'table   overflow-x-auto · mono heads · hairline rows · tabular-nums · “—” = no value',
  ].join('\n'),
  code: [
    '<RankedBarChart data={searchDemand} ariaLabel="Top AU themes by monthly searches" />',
    '<SplitTrack segments={split} ariaLabel="Australia vs New Zealand keywords" />',
    '<Disclosure title="Australia · 24 keywords · full table"><table>…</table></Disclosure>',
  ].join('\n'),
}

const TH = 'whitespace-nowrap border-b border-border-strong px-4 py-3 text-left font-mono text-mono-xs uppercase tracking-wider text-fg-subtle'

export function MarketEvidenceSection() {
  return (
    <Section
      id="market-evidence"
      eyebrow="Market Evidence"
      title="What the research says"
      lead="The brand-positioning research, visualised — readiness, the customer snapshot, and AXL’s Australian search sample. Every graph fills and counts up as it scrolls into view. Every figure is reported, not verified: the flags and sources travel with the numbers."
    >
      <div className="flex flex-col gap-8">
        {/* Band 1 — readiness: the RingStat + a bare count-up figure */}
        <Demo label="Positioning readiness — ring + count-up" inspect={READINESS_INSPECT}>
          <Stagger className="grid gap-4 sm:grid-cols-2">
            <StaggerItem>
              <Card interactive className="flex h-full flex-col gap-4">
                <MonoLabel tone="subtle">Positioning decided</MonoLabel>
                <RingStat
                  pct={M.readiness.pct}
                  value={M.readiness.value}
                  slash={M.readiness.slash}
                  centerSub={M.readiness.sub}
                  ariaLabel={`All ${M.readiness.value} positioning sections decided`}
                />
                <p className="font-body text-caption text-fg-muted">{M.readiness.caption}</p>
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card interactive className="flex h-full flex-col gap-4">
                <MonoLabel tone="subtle">Founder questions</MonoLabel>
                <div className="flex flex-1 items-center justify-center">
                  <span className="font-display text-display-lg leading-none tabular-nums text-fg">
                    <CountUp to={M.founderQuestions.value} />
                  </span>
                </div>
                <p className="font-body text-caption text-fg-muted">{M.founderQuestions.caption}</p>
              </Card>
            </StaggerItem>
          </Stagger>
        </Demo>

        {/* Band 2 — customer snapshot: stat tiles (with unverified flags) + source disclosure */}
        <Demo label="Customer snapshot — reported, not verified" inspect={STATS_INSPECT}>
          <div className="flex flex-col gap-4">
            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {M.stats.map((s) => (
                <StaggerItem key={s.eyebrow}>
                  <Card className="flex h-full flex-col gap-2">
                    <p className="font-mono text-mono-xs uppercase tracking-wider text-fg-subtle">{s.eyebrow}</p>
                    <p className="font-display text-title-lg leading-tight tabular-nums text-fg">
                      {s.display ?? (
                        <CountUp to={s.value ?? 0} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} group={s.group} />
                      )}
                    </p>
                    <p className="font-body text-caption leading-relaxed text-fg-muted">
                      {s.context}
                      {s.unverified && <Flag />}
                    </p>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
            <FadeIn>
              <Disclosure title="Sources & what’s not yet measured">
                <div className="flex flex-col gap-3">
                  <p>
                    <span className="font-semibold text-fg">Sources. </span>
                    {M.statsSources}
                  </p>
                  <p>
                    <span className="font-semibold text-fg">Not yet measured. </span>
                    {M.statsNotMeasured}
                  </p>
                </div>
              </Disclosure>
            </FadeIn>
          </div>
        </Demo>

        {/* Band 3 — search demand: ranked bars + AU/NZ split + full table + method */}
        <Demo label="Search demand · AXL Media research" inspect={SEARCH_INSPECT}>
          <div className="flex flex-col gap-6">
            <FadeIn>
              <p className="mx-auto max-w-2xl text-center font-body text-body-md leading-relaxed text-fg-muted">
                {M.searchLead}
              </p>
            </FadeIn>
            <p className="text-center font-mono text-mono-xs uppercase tracking-wider text-fg-subtle">
              Top themes by estimated monthly searches · Australia
            </p>
            <RankedBarChart
              data={M.searchDemand}
              ariaLabel="Top Australian themes by estimated monthly searches"
              className="mx-auto w-full max-w-2xl"
            />
            <SplitTrack
              segments={M.split}
              ariaLabel="Keyword coverage: Australia versus New Zealand"
              className="mx-auto w-full max-w-md pt-2"
            />

            <Disclosure title="Australia · 24 keywords · full table">
              <div className="-mx-1 overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse">
                  <thead>
                    <tr>
                      <th scope="col" className={TH}>Keyword</th>
                      <th scope="col" className={`${TH} text-right`}>Monthly searches</th>
                      <th scope="col" className={`${TH} text-right`}>CPC (AUD)</th>
                      <th scope="col" className={TH}>Competition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {M.keywords.map((k, i) => (
                      <tr key={k.kw} className="transition-colors hover:bg-canvas-muted">
                        <th
                          scope="row"
                          className={cnRow(i, 'px-4 py-2.5 text-left align-middle font-body text-body-sm font-normal text-fg')}
                        >
                          {k.kw}
                        </th>
                        <td className={cnRow(i, 'px-4 py-2.5 text-right align-middle font-body text-body-sm tabular-nums text-fg-muted')}>
                          {k.searches}
                        </td>
                        <td className={cnRow(i, 'px-4 py-2.5 text-right align-middle font-body text-body-sm tabular-nums text-fg-muted')}>
                          {k.cpc}
                        </td>
                        <td className={cnRow(i, 'px-4 py-2.5 text-left align-middle font-body text-body-sm text-fg-muted')}>
                          {k.competition}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Disclosure>

            <Disclosure title="Method & source">
              <div className="flex flex-col gap-3">
                <p>{M.searchMethod}</p>
                <p className="font-mono text-caption text-fg-subtle">{M.searchSourceCredit}</p>
              </div>
            </Disclosure>
          </div>
        </Demo>
      </div>
    </Section>
  )
}

/** Hairline between rows, none under the last — matches the Tables family. */
function cnRow(i: number, base: string) {
  return i < M.keywords.length - 1 ? `${base} border-b border-border` : base
}
