/**
 * FunnelsSection — the funnel & landing-page library (Library → Marketing & Content → Funnels).
 * The website publishes ten funnel types (built on the brand during onboarding, not a self-serve
 * template set), so this is a browsable CATALOGUE: each type's purpose, its flow, and the design-
 * system parts it is assembled from (linked). The team reads it to know what to build and from what.
 * Source: financeos.au/discover/assets/funnels.
 */
import { Section, Demo } from '@/showcase/Section'
import { Card } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import type { InspectData } from '@/components/ui/inspectable'

interface Funnel {
  n: string
  name: string
  purpose: string
  flow: string[]
  /** design-system parts it composes from, as [label, anchor] */
  parts: [string, string][]
}

const FUNNELS: Funnel[] = [
  { n: '01', name: 'Lead magnet / newsletter', purpose: 'A borrower guide or rate update in exchange for an email — the top of everything else.', flow: ['Opt-in', 'Deliver', 'Nurture'], parts: [['Lead Magnets', '#leadmagnets'], ['Forms & Inputs', '#forms'], ['Client Emails', '#client-emails']] },
  { n: '02', name: 'Registration opt-in', purpose: 'Webinar or seminar sign-up, with a reminder sequence attached.', flow: ['Register', 'Confirm', 'Remind', 'Attend'], parts: [['Heroes', '#heroes'], ['Forms & Inputs', '#forms'], ['Client Emails', '#client-emails']] },
  { n: '03', name: 'Training opt-in', purpose: 'A gated video or masterclass — first-home, investment structuring, refinancing.', flow: ['Opt-in', 'Watch', 'Follow up'], parts: [['Heroes', '#heroes'], ['Forms & Inputs', '#forms'], ['Live Demo Pages', '#demos']] },
  { n: '04', name: 'Short sales page', purpose: 'One offer, one action — the page a paid ad should land on.', flow: ['Ad', 'Offer', 'Book'], parts: [['Heroes', '#heroes'], ['Pricing', '#pricing'], ['Forms & Inputs', '#forms']] },
  { n: '05', name: 'Sales page', purpose: 'The full case for a service, with the fact-find as the call to action.', flow: ['Hook', 'Proof', 'Fact-find'], parts: [['Featured Sections', '#featured'], ['Testimonials', '#testimonials'], ['Forms & Inputs', '#forms']] },
  { n: '06', name: 'Long sales page', purpose: 'For considered decisions — commercial, SMSF, development finance.', flow: ['Story', 'Evidence', 'Compare', 'CTA'], parts: [['Featured Sections', '#featured'], ['Comparisons', '#landscape-table'], ['Pricing', '#pricing']] },
  { n: '07', name: 'Course & community', purpose: 'A borrower-education track, gated and drip-fed.', flow: ['Enrol', 'Drip', 'Community'], parts: [['Pricing', '#pricing'], ['Forms & Inputs', '#forms'], ['Client Emails', '#client-emails']] },
  { n: '08', name: '1-page personal brand', purpose: 'The broker rather than the brokerage — what a referral partner sends someone to.', flow: ['Intro', 'Proof', 'Contact'], parts: [['Heroes', '#heroes'], ['Testimonials', '#testimonials'], ['Email Signatures', '#email-signature']] },
  { n: '09', name: '1-page business website', purpose: 'A complete site in one page for a solo broker.', flow: ['Hero', 'Services', 'Proof', 'Contact'], parts: [['Heroes', '#heroes'], ['Bento Box', '#bento'], ['Featured Sections', '#featured'], ['Pricing', '#pricing']] },
  { n: '10', name: 'Challenge funnel', purpose: 'A multi-day sequence — a deposit challenge or a rate-review week.', flow: ['Register', 'Daily email', 'Offer'], parts: [['Forms & Inputs', '#forms'], ['Client Emails', '#client-emails'], ['Pricing', '#pricing']] },
]

const INSPECT: InspectData = {
  name: 'Funnel catalogue',
  explain:
    'The ten funnel / landing-page types from the website, as a reference catalogue. On the site these are built on the brand during onboarding (not self-serve templates), so the design-system value is knowing each type’s flow and the parts it is assembled from — every card links to those parts in this library.',
  token: [
    'card    <Card> hairline · num in accent-text · flow as chips with ArrowRight',
    'parts   in-page anchor links → the components/sections each funnel composes from',
    'grid    1 col · lg:2 — browsable',
  ].join('\n'),
  code: 'FUNNELS.map((f) => <Card>… flow + Built from: {f.parts.map(([label, href]) => <a href={href}>)} …</Card>)',
}

export function FunnelsSection() {
  return (
    <Section
      id="funnels"
      eyebrow="Funnels"
      title="Funnels"
      lead="The ten funnel and landing-page types, as a catalogue — each with its flow and the parts in this library it is assembled from. On the website these are configured on the brand during onboarding; here they map to the reusable sections, cards and forms that build them."
    >
      <Demo label="Funnel & landing-page library — 10 types" inspect={INSPECT}>
        <div className="grid gap-4 lg:grid-cols-2">
          {FUNNELS.map((f) => (
            <Card key={f.n} className="flex flex-col gap-3">
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono text-mono-xs tabular-nums text-accent-text">{f.n}</span>
                <h3 className="font-display text-title-sm text-fg">{f.name}</h3>
              </div>
              <p className="font-body text-body-sm leading-relaxed text-fg-muted">{f.purpose}</p>

              <div className="flex flex-wrap items-center gap-1.5">
                {f.flow.map((step, i) => (
                  <span key={step} className="inline-flex items-center gap-1.5">
                    <span className="rounded-sm bg-inset px-2 py-0.5 font-mono text-mono-2xs uppercase tracking-wider text-fg-muted">{step}</span>
                    {i < f.flow.length - 1 && <ArrowRight className="h-3 w-3 text-fg-subtle" strokeWidth={2} aria-hidden />}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border pt-3 font-mono text-mono-2xs uppercase tracking-wider text-fg-subtle">
                <span>Built from</span>
                {f.parts.map(([label, href], i) => (
                  <span key={href} className="inline-flex items-center gap-2">
                    <a href={href} className="text-accent-text underline-offset-4 hover:underline">{label}</a>
                    {i < f.parts.length - 1 && <span aria-hidden className="opacity-50">·</span>}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Demo>
    </Section>
  )
}
