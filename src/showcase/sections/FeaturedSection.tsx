/**
 * FeaturedSection — the Featured family. Calm, high-intent spotlight blocks that put ONE
 * capability in front of a brokerage: a split layout pairing the promise with a live pipeline
 * dashboard mock, a full-width banner that closes on a single blue highlight + CTA pair, and a
 * reversed split with an on-token blue wash visual. Blue owns every highlight; emphasis comes
 * from elevation and a full border — no ribbons, no glass, 8px squircles.
 */
import { Check, ChevronUp } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MonoLabel } from '@/components/ui/mono-label'

/** One benefit bullet — a bold display lead-in with a quiet body line. */
interface Bullet {
  title: string
  body: string
}

const PIPELINE_BULLETS: Bullet[] = [
  {
    title: 'Every enquiry captured',
    body: 'Web forms, referral partners and aggregator feeds land on the one board the moment they arrive.',
  },
  {
    title: 'Pre-approval to unconditional, tracked',
    body: 'Nothing stalls between lender and client — each stage shows where a deal is waiting.',
  },
  {
    title: 'Numbers your BDM actually opens',
    body: 'Show-up rate and settlement value sit on the dashboard, not in a monthly export.',
  },
]

const ONBOARDING_BULLETS: Bullet[] = [
  {
    title: 'Guided setup',
    body: 'Lender panel, aggregator links and compliance templates ready on day one.',
  },
  {
    title: 'Shared playbook',
    body: 'The same enquiry-to-settlement process every broker in the firm follows.',
  },
  {
    title: 'Visible from the first deal',
    body: 'Their pipeline, show-up rate and notes feed the same dashboard the principal reviews.',
  },
]

/** Pipeline stages for the dashboard mock — value doubles as the bar width and the readout. */
const PIPELINE_ROWS: { label: string; value: number }[] = [
  { label: 'Pre-approval', value: 68 },
  { label: 'Valuation', value: 41 },
  { label: 'Unconditional', value: 23 },
]

/** The check-well + copy bullet list shared by both split layouts. */
function FeatureBullets({ items }: { items: Bullet[] }) {
  return (
    <ul className="mt-1 flex flex-col gap-3.5">
      {items.map((b) => (
        <li key={b.title} className="grid grid-cols-[24px_1fr] items-start gap-3">
          <span className="grid h-6 w-6 place-items-center rounded-sm bg-accent-soft text-accent">
            <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
          </span>
          <span className="font-body text-body-sm leading-relaxed text-fg-muted">
            <b className="mb-0.5 block font-display text-title-sm text-fg">{b.title}</b>
            {b.body}
          </span>
        </li>
      ))}
    </ul>
  )
}

/** The live pipeline dashboard mock — figure, sparkline, stage bars and a footer stat.
 *  A plain (non-interactive) Card: its calm resting shadow IS the emphasis. */
function PipelineDash() {
  return (
    <Card className="flex flex-col gap-4">
      {/* head — section label + period chip */}
      <div className="flex items-center justify-between gap-2.5">
        <span className="font-mono text-caption font-bold text-fg-muted">Settlement pipeline</span>
        <Badge variant="neutral" size="sm">
          FY25 · Q2
        </Badge>
      </div>

      {/* headline figure + positive delta */}
      <div className="flex items-baseline gap-3">
        <span className="font-display text-display-md tabular-nums text-fg">$4.82M</span>
        <span className="inline-flex items-center gap-1 font-mono text-caption font-bold tabular-nums text-success">
          <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          12.4%
        </span>
      </div>

      {/* sparkline — blue area + stroke derived from one accent currentColor */}
      <svg
        viewBox="0 0 320 56"
        preserveAspectRatio="none"
        aria-hidden
        className="block h-14 w-full text-accent"
      >
        <defs>
          <linearGradient id="featured-spark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.24" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 44 L40 40 L80 42 L120 30 L160 33 L200 22 L240 24 L280 13 L320 9 L320 56 L0 56 Z"
          fill="url(#featured-spark)"
        />
        <path
          d="M0 44 L40 40 L80 42 L120 30 L160 33 L200 22 L240 24 L280 13 L320 9"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* stage bars */}
      <div className="flex flex-col gap-2.5">
        {PIPELINE_ROWS.map((r) => (
          <div key={r.label} className="grid grid-cols-[96px_1fr_32px] items-center gap-3">
            <span className="font-body text-body-sm text-fg-subtle">{r.label}</span>
            <span className="h-2 overflow-hidden rounded-xs bg-inset">
              <span
                className="block h-full rounded-xs bg-gradient-accent"
                style={{ width: `${r.value}%` }}
              />
            </span>
            <span className="text-right font-body text-body-sm tabular-nums text-fg">{r.value}</span>
          </div>
        ))}
      </div>

      {/* footer stat */}
      <div className="flex items-center justify-between gap-2.5 border-t border-border pt-3.5">
        <span className="font-body text-body-sm text-fg-muted">Appointment show-up rate</span>
        <span className="font-display text-title-sm tabular-nums text-accent-text">86%</span>
      </div>
    </Card>
  )
}

export function FeaturedSection() {
  return (
    <Section
      id="featured"
      eyebrow="14 - Featured"
      title="Featured"
      lead="Feature spotlights — the calm, high-intent blocks that put one capability in front of a brokerage. A split layout pairs the promise with a working pipeline view, and a full-width banner closes on a single clear call to action. One blue highlight, never more."
    >
      <div className="flex flex-col gap-8">
        {/* Split feature — copy + live dashboard */}
        <Demo label="Split feature — benefit bullets beside a live pipeline dashboard">
          <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-12">
            <div className="flex flex-col gap-4">
              <MonoLabel dot>Pipeline</MonoLabel>
              <h3 className="font-display text-display-sm text-fg">
                See every deal from enquiry to settlement
              </h3>
              <p className="font-body text-body-md leading-relaxed text-fg-muted">
                Finance OS gives your brokerage one grounded view of the pipeline — built for
                mortgage and asset-finance teams working across more than one aggregator.
              </p>
              <FeatureBullets items={PIPELINE_BULLETS} />
              <div className="mt-1.5 flex flex-wrap gap-3">
                <Button variant="primary">Book a walkthrough</Button>
                <Button variant="ghost">See the pipeline</Button>
              </div>
            </div>
            <PipelineDash />
          </div>
        </Demo>

        {/* Featured banner — one blue highlight, primary + ghost CTA */}
        <Demo label="Featured banner — one blue highlight, primary + ghost CTA">
          <Card
            interactive
            padding="lg"
            className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-7"
          >
            <div>
              <MonoLabel dot>Platform</MonoLabel>
              <h3 className="mb-3 mt-2 max-w-[24ch] font-display text-display-sm text-fg">
                Bring your whole brokerage onto one calm,{' '}
                <span className="text-highlight">settlement-ready</span> view.
              </h3>
              <p className="max-w-[54ch] font-body text-body-md leading-relaxed text-fg-muted">
                From first enquiry to funds disbursed, Finance OS keeps brokers, processors and your
                aggregator reporting in step — without another spreadsheet to reconcile.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2.5 md:flex-col">
              <Button variant="primary">Book a walkthrough</Button>
              <Button variant="ghost">Talk to the team</Button>
            </div>
          </Card>
        </Demo>

        {/* Split feature, reversed — blue wash visual beside the copy */}
        <Demo label="Split feature, reversed — blue wash visual beside the copy">
          <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-12">
            <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-lg border border-border bg-wash-tint">
              <svg
                viewBox="0 0 48 48"
                aria-hidden
                className="w-2/5 max-w-[160px] text-accent opacity-90"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 40V22M18 40V14M28 40V26M38 40V10" />
                <path d="M6 40h36" />
                <circle cx="8" cy="18" r="2.4" />
                <circle cx="18" cy="10" r="2.4" />
                <circle cx="28" cy="22" r="2.4" />
                <circle cx="38" cy="6" r="2.4" />
                <path d="M8 18l10-8 10 12 10-16" />
              </svg>
              <span className="absolute bottom-3.5 left-3.5 rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-mono-xs uppercase tracking-[0.08em] text-accent-text">
                Onboarding
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <MonoLabel dot>Onboarding</MonoLabel>
              <h3 className="font-display text-display-sm text-fg">
                Get a new broker productive in their first week
              </h3>
              <p className="font-body text-body-md leading-relaxed text-fg-muted">
                A structured start so a new adviser knows the lenders, the steps and where each deal
                lives — before they take a single enquiry.
              </p>
              <FeatureBullets items={ONBOARDING_BULLETS} />
              <div className="mt-1.5 flex flex-wrap gap-3">
                <Button variant="primary">See the onboarding flow</Button>
              </div>
            </div>
          </div>
        </Demo>
      </div>
    </Section>
  )
}
