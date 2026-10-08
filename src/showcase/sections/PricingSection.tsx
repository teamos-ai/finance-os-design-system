/**
 * PricingSection — the pricing family. Two variations ported from the kit:
 *   1. Plan cards — three tiers (Launch · Scale · Dominate) with a monthly/annual
 *      billing toggle (React useState). The recommended tier (Scale) is marked by a
 *      CENTERED TOP badge + a full 2px accent border and deeper elevation — never a
 *      corner ribbon or side-rail. Annual billing reveals a blue "2 months free" tag.
 *   2. Compare plans — the same tiers as columns with per-feature rows, the Scale
 *      column flagged in accent, included/excluded marks and a neutral "Metered" chip.
 *
 * Figures use tabular-nums. Token-only colours, 8px-max squircles, one calm hover lift.
 * The kit's amber "save" tag is rendered blue here: the brand is blue-only and amber is
 * reserved for functional status, not a promotional savings callout.
 */
import { useState, type ReactNode } from 'react'
import { Check, Clock, UserRound, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { Card } from '@/components/ui/card'
import { Button, type ButtonProps } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MonoLabel } from '@/components/ui/mono-label'
import { cn } from '@/lib/cn'

type Billing = 'monthly' | 'annual'

interface Tier {
  name: string
  /** price shown for monthly billing, e.g. "97" */
  monthly: string
  /** full-year price shown for annual billing, e.g. "970" (10× monthly — 2 months free) */
  annual: string
  mode: { icon: LucideIcon; label: string }
  features: string[]
  cta: string
  ctaVariant: ButtonProps['variant']
  recommended?: boolean
}

const TIERS: Tier[] = [
  {
    name: 'Launch',
    monthly: '97',
    annual: '970',
    mode: { icon: Clock, label: 'Self-serve setup' },
    features: [
      'Up to 150 active enquiries',
      'Pipeline board with six settlement stages',
      'Email & SMS enquiry capture',
      'Show-up rate dashboard',
      'One aggregator connection',
    ],
    cta: 'Start on Launch',
    ctaVariant: 'secondary',
  },
  {
    name: 'Scale',
    monthly: '297',
    annual: '2,970',
    mode: { icon: Clock, label: 'Self-serve setup' },
    features: [
      'Up to 600 active enquiries',
      'Automated enquiry routing & nurture',
      'Commission & trail reconciliation',
      'Multi-broker team pipeline',
      'Two aggregator connections',
      'Compliance note templates',
    ],
    cta: 'Choose Scale',
    ctaVariant: 'primary',
    recommended: true,
  },
  {
    name: 'Dominate',
    monthly: '497',
    annual: '4,970',
    mode: { icon: UserRound, label: 'Done for you' },
    features: [
      'Unlimited active enquiries',
      'Dedicated onboarding specialist',
      'Done-for-you campaign build',
      'Advanced settlement forecasting',
      'All aggregator connections',
      'Priority support queue',
    ],
    cta: 'Talk to the team',
    ctaVariant: 'secondary',
  },
]

/* ── Compare-plans table — content as data, instrument below ─────────────────── */
type Cell =
  | { t: 'val'; v: string; num?: boolean }
  | { t: 'yes' }
  | { t: 'no' }
  | { t: 'metered' }

interface CompareRow {
  feature: string
  cells: [Cell, Cell, Cell]
}

const yes: Cell = { t: 'yes' }
const no: Cell = { t: 'no' }
const metered: Cell = { t: 'metered' }
const val = (v: string, num = false): Cell => ({ t: 'val', v, num })

const COMPARE: CompareRow[] = [
  { feature: 'Active enquiries', cells: [val('150', true), val('600', true), val('Unlimited')] },
  { feature: 'Aggregator connections', cells: [val('1', true), val('2', true), val('All')] },
  { feature: 'Automated enquiry nurture', cells: [no, yes, yes] },
  { feature: 'Commission reconciliation', cells: [no, yes, yes] },
  { feature: 'Done-for-you campaign build', cells: [no, metered, yes] },
  { feature: 'Priority support queue', cells: [no, no, yes] },
]

function renderCell(c: Cell): ReactNode {
  switch (c.t) {
    case 'yes':
      return (
        <>
          <Check aria-hidden className="mx-auto h-4 w-4 text-accent-text" strokeWidth={2.5} />
          <span className="sr-only">Included</span>
        </>
      )
    case 'no':
      return (
        <>
          <span aria-hidden className="text-fg-subtle">
            &ndash;
          </span>
          <span className="sr-only">Not included</span>
        </>
      )
    case 'metered':
      return (
        <Badge variant="outline" size="sm">
          Metered
        </Badge>
      )
    case 'val':
      return <span className={cn('font-semibold text-fg', c.num && 'tabular-nums')}>{c.v}</span>
  }
}

export function PricingSection() {
  const [billing, setBilling] = useState<Billing>('monthly')
  const per = billing === 'monthly' ? '/mo' : '/yr'
  const note = billing === 'monthly' ? 'per month, billed monthly' : 'per year, billed annually'

  return (
    <Section
      id="pricing"
      eyebrow="17 - Pricing"
      title="Pricing"
      lead="Plans for every stage of the book — from a solo broker working their first hundred enquiries to a multi-broker team forecasting settlements. One instrument, priced to the size of the pipeline."
    >
      <div className="flex flex-col gap-8">
        {/* Variation 1 — plan cards with monthly/annual toggle, Scale recommended */}
        <Demo label="Plan cards — three tiers, monthly/annual toggle, Scale recommended">
          {/* Billing toggle — segmented control + blue "2 months free" on annual */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
            <div
              role="group"
              aria-label="Billing period"
              className="inline-flex gap-1 rounded-lg border border-border bg-inset p-1"
            >
              {(['monthly', 'annual'] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setBilling(period)}
                  aria-pressed={billing === period}
                  className={cn(
                    'rounded-md px-4 py-1.5 font-body text-body-sm font-semibold capitalize transition-colors duration-fast',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
                    billing === period
                      ? 'bg-surface text-accent-text shadow-sm'
                      : 'text-fg-muted hover:text-fg',
                  )}
                >
                  {period}
                </button>
              ))}
            </div>
            <span aria-live="polite">
              {billing === 'annual' && (
                <Badge variant="blue" size="md">
                  <Sparkles aria-hidden className="h-3 w-3" strokeWidth={2} />
                  2 months free
                </Badge>
              )}
            </span>
          </div>

          <div className="grid gap-6 sm:gap-5 md:grid-cols-3">
            {TIERS.map((tier) => {
              const amount = billing === 'monthly' ? tier.monthly : tier.annual
              return (
                <Card
                  key={tier.name}
                  padding="lg"
                  interactive={!tier.recommended}
                  className={cn(
                    'flex flex-col',
                    tier.recommended &&
                      'border-2 border-accent shadow-lg hover:-translate-y-1 hover:shadow-lg',
                  )}
                >
                  {/* Recommended marker — CENTERED top badge only, never a ribbon */}
                  {tier.recommended && (
                    <div className="pointer-events-none absolute -top-3 left-0 right-0 flex justify-center">
                      <Badge variant="blue" size="sm" className="bg-accent text-accent-fg shadow-sm">
                        Recommended
                      </Badge>
                    </div>
                  )}

                  <MonoLabel tone={tier.recommended ? 'accent' : 'fg'}>{tier.name}</MonoLabel>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="font-display text-display-sm text-fg">$</span>
                    <span className="font-display text-display-lg tracking-tight text-fg tabular-nums">
                      {amount}
                    </span>
                    <span className="font-body text-body-md text-fg-subtle">{per}</span>
                  </div>
                  <p className="mt-2 font-body text-body-sm text-fg-subtle">{note}</p>

                  <div className="mt-4 inline-flex items-center gap-2 font-body text-body-sm font-semibold text-fg-muted">
                    <tier.mode.icon
                      aria-hidden
                      className="h-3.5 w-3.5 shrink-0 text-accent-text"
                      strokeWidth={1.5}
                    />
                    {tier.mode.label}
                  </div>

                  <ul className="mt-5 flex flex-1 flex-col gap-2.5 border-t border-border pt-5">
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 font-body text-body-sm text-fg-muted"
                      >
                        <Check
                          aria-hidden
                          className="mt-0.5 h-4 w-4 shrink-0 text-accent-text"
                          strokeWidth={2.5}
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button variant={tier.ctaVariant} size="md" className="mt-6 w-full">
                    {tier.cta}
                  </Button>
                </Card>
              )
            })}
          </div>
        </Demo>

        {/* Variation 2 — compare plans, tiers as columns */}
        <Demo label="Compare plans — tiers as columns, feature rows">
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[520px] border-collapse">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="border-b border-border bg-canvas-muted px-4 py-3 text-left font-display text-body-sm font-bold text-fg"
                  >
                    Feature
                  </th>
                  <th
                    scope="col"
                    className="border-b border-border bg-canvas-muted px-4 py-3 text-center font-display text-body-sm font-bold text-fg"
                  >
                    Launch
                  </th>
                  <th
                    scope="col"
                    className="border-b border-border bg-canvas-muted px-4 py-3 text-center font-display text-body-sm font-bold text-accent-text"
                  >
                    Scale
                  </th>
                  <th
                    scope="col"
                    className="border-b border-border bg-canvas-muted px-4 py-3 text-center font-display text-body-sm font-bold text-fg"
                  >
                    Dominate
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => {
                  const border = i === COMPARE.length - 1 ? '' : 'border-b border-border'
                  return (
                    <tr key={row.feature} className="transition-colors hover:bg-selected">
                      <th
                        scope="row"
                        className={cn(
                          'px-4 py-3 text-left font-body text-body-sm font-semibold text-fg',
                          border,
                        )}
                      >
                        {row.feature}
                      </th>
                      {row.cells.map((c, j) => (
                        <td
                          key={j}
                          className={cn(
                            'px-4 py-3 text-center align-middle font-body text-body-sm text-fg-muted',
                            border,
                          )}
                        >
                          {renderCell(c)}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Demo>
      </div>
    </Section>
  )
}
