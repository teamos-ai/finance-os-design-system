/**
 * DemosSection — proof the system dresses real Finance OS surfaces end to end.
 *
 * Two full applied screens, each inside a Demo frame, assembled ONLY from tokens
 * and components:
 *   1. "Landing — dark"  — a marketing page: a hero band (LogoMark + headline +
 *      two Buttons over a Glow), a feature grid (FEATURES via FeatureCard), a
 *      gradient CTA banner, and the TESTIMONIAL.
 *   2. "CRM dashboard — light" — the product surface: a top bar, a row of Stat
 *      cards, a deals table (borrower / amount / stage Badge), and an inbox /
 *      activity list. Scoped to the light theme with a `data-theme="light"`
 *      wrapper — every token class inside resolves to light values, no rewiring.
 *
 * Self-contained: small in-file helpers, decorative on-brand data. Voice stays
 * calm and grounded; zero rogue hex (the only rgba lives in the documented Glow).
 */
import {
  Bell,
  Search,
  Plus,
  ArrowUpRight,
  Mail,
  MessageSquare,
  CalendarCheck,
  Quote,
} from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Stat } from '@/components/ui/stat'
import { FeatureCard } from '@/components/ui/feature-card'
import { MonoLabel } from '@/components/ui/mono-label'
import { LogoMark } from '@/components/brand/Logo'
import { FadeIn, Glow, BreathingDot } from '@/lib/motion'
import { FEATURES, STATS, TESTIMONIAL } from '@/data/system'
import { cn } from '@/lib/cn'

/* -------------------------------------------------------------------------- */
/* Decorative data for the CRM screen                                          */
/* -------------------------------------------------------------------------- */

type Stage =
  | { label: string; variant: 'gold' }
  | { label: string; variant: 'blue' }
  | { label: string; variant: 'amber' }
  | { label: string; variant: 'success' }

interface Deal {
  borrower: string
  product: string
  amount: string
  stage: Stage
}

const DEALS: Deal[] = [
  { borrower: 'Harper & Vale', product: 'Owner-occupier refinance', amount: '$840,000', stage: { label: 'Application', variant: 'blue' } },
  { borrower: 'M. Okonkwo', product: 'First home buyer', amount: '$520,000', stage: { label: 'Pre-approval', variant: 'amber' } },
  { borrower: 'Sandhu Holdings', product: 'Commercial term loan', amount: '$1,250,000', stage: { label: 'Assessment', variant: 'gold' } },
  { borrower: 'R. Delacroix', product: 'Investment property', amount: '$675,000', stage: { label: 'Settled', variant: 'success' } },
]

interface Activity {
  who: string
  what: string
  when: string
  icon: typeof Mail
  accent: 'gold' | 'blue' | 'amber'
}

const INBOX: Activity[] = [
  { who: 'Maya Robinson', what: 'replied to your follow-up', when: '4m', icon: Mail, accent: 'gold' },
  { who: 'James Patel', what: 'booked a discovery call', when: '21m', icon: CalendarCheck, accent: 'blue' },
  { who: 'Sana Kaur', what: 'sent two documents', when: '1h', icon: MessageSquare, accent: 'amber' },
  { who: 'Leo Marsh', what: 'opened your rate review', when: '3h', icon: Mail, accent: 'gold' },
]

const ACCENT_WELL: Record<'gold' | 'blue' | 'amber', string> = {
  gold: 'bg-accent-soft text-accent-text',
  blue: 'bg-brand-soft text-brand',
  amber: 'bg-amber-soft text-amber-text',
}

const initials = (name: string): string =>
  name
    .replace(/&|\./g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

/* -------------------------------------------------------------------------- */
/* Screen 1 — marketing landing (dark)                                         */
/* -------------------------------------------------------------------------- */

const Landing = () => (
  <div className="bg-canvas">
    {/* Hero band */}
    <header className="relative isolate overflow-hidden px-6 py-16 text-center md:px-10 md:py-20">
      <Glow />
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <LogoMark size="lg" />
        <MonoLabel className="mt-6" dot>
          For mortgage &amp; finance brokers
        </MonoLabel>
        <h1 className="mt-4 font-display text-display-lg leading-tight text-fg">
          Predictable pipeline.<br />
          <span className="text-accent-text">More settlements.</span> Less admin.
        </h1>
        <p className="mt-5 max-w-xl font-body text-body-lg leading-relaxed text-fg-muted">
          Finance OS captures, follows up, and nurtures every enquiry automatically — so no
          lead goes cold and no hour goes to manual admin.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button variant="gradient" size="lg">
            Book a walkthrough
          </Button>
          <Button variant="secondary" size="lg">
            See the platform
          </Button>
        </div>
      </div>
    </header>

    {/* Feature grid */}
    <section className="border-t border-border-subtle px-6 py-14 md:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <MonoLabel tone="subtle" number="01">
            One platform
          </MonoLabel>
          <h2 className="mt-3 font-display text-display-sm text-fg">Everything a broker runs on</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.slice(0, 6).map((f, i) => (
            <FeatureCard
              key={f.title}
              icon={f.Icon}
              title={f.title}
              description={f.tagline}
              accent={f.accent}
              number={String(i + 1).padStart(2, '0')}
            />
          ))}
        </div>
      </div>
    </section>

    {/* Gradient CTA banner */}
    <section className="px-6 pb-14 md:px-10">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-lg bg-gradient-accent px-8 py-12 text-center shadow-glow">
        <h2 className="font-display text-display-sm leading-tight text-accent-fg">
          Replace eight tools with one calm system.
        </h2>
        <p className="mx-auto mt-3 max-w-xl font-body text-body-md leading-relaxed text-accent-fg/80">
          CRM, follow-up, nurture, funnels, booking and insights — built for the way brokers
          actually work.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button variant="dark" size="lg" className="shadow-md">
            Start your build
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="text-accent-fg hover:bg-black/10"
          >
            Talk to the team
          </Button>
        </div>
      </div>
    </section>

    {/* Testimonial */}
    <section className="border-t border-border-subtle px-6 py-14 md:px-10">
      <figure className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Quote className="h-7 w-7 text-accent-text" strokeWidth={1.5} aria-hidden />
        <blockquote className="mt-5 font-display text-title-lg leading-relaxed text-fg">
          &ldquo;{TESTIMONIAL.quote}&rdquo;
        </blockquote>
        <figcaption className="mt-5 font-mono text-caption uppercase tracking-[0.12em] text-fg-subtle">
          {TESTIMONIAL.author}
        </figcaption>
      </figure>
    </section>
  </div>
)

/* -------------------------------------------------------------------------- */
/* Screen 2 — CRM dashboard (light)                                            */
/* -------------------------------------------------------------------------- */

const Dashboard = () => (
  <div data-theme="light" className="bg-canvas text-fg">
    {/* Top bar */}
    <div className="flex items-center justify-between gap-4 border-b border-border bg-surface px-5 py-3.5">
      <div className="flex items-center gap-3">
        <LogoMark size="sm" />
        <span className="hidden font-display text-title-sm font-semibold text-fg sm:inline">
          Pipeline
        </span>
        <Badge variant="success" size="sm" dot>
          Live
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-md border border-border bg-canvas px-3 py-2 sm:flex">
          <Search className="h-4 w-4 text-fg-subtle" strokeWidth={1.5} aria-hidden />
          <span className="font-mono text-caption text-fg-subtle">Search deals</span>
        </div>
        <span
          className="relative grid h-9 w-9 place-items-center rounded-md border border-border bg-canvas text-fg-muted"
          aria-hidden
        >
          <Bell className="h-4 w-4" strokeWidth={1.5} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
        <Button variant="primary" size="sm" leadingIcon={<Plus className="h-3.5 w-3.5" />}>
          New deal
        </Button>
      </div>
    </div>

    <div className="flex flex-col gap-6 p-5 md:p-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
            <Stat
              value={s.value}
              prefix={s.prefix}
              suffix={s.suffix}
              label={s.label}
              className="[&>span:first-child]:text-display-sm"
            />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Deals table */}
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <MonoLabel tone="subtle">Active deals</MonoLabel>
            <Badge variant="outline" size="sm">
              {DEALS.length} open
            </Badge>
          </div>

          {/* Column header */}
          <div className="hidden grid-cols-[1.4fr_1fr_auto] gap-4 border-b border-border-subtle px-5 py-2.5 sm:grid">
            <span className="font-mono text-caption uppercase tracking-[0.12em] text-fg-subtle">Borrower</span>
            <span className="font-mono text-caption uppercase tracking-[0.12em] text-fg-subtle">Amount</span>
            <span className="font-mono text-caption uppercase tracking-[0.12em] text-fg-subtle">Stage</span>
          </div>

          <ul>
            {DEALS.map((d) => (
              <li
                key={d.borrower}
                className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-border-subtle px-5 py-3.5 last:border-b-0 sm:grid-cols-[1.4fr_1fr_auto] sm:gap-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-accent-soft font-mono text-caption font-bold text-accent-text"
                    aria-hidden
                  >
                    {initials(d.borrower)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-body-md text-fg">{d.borrower}</span>
                    <span className="block truncate font-body text-caption text-fg-muted">{d.product}</span>
                  </span>
                </div>
                <span className="hidden font-mono text-body-sm tabular-nums text-fg sm:block">{d.amount}</span>
                <Badge variant={d.stage.variant} size="sm">
                  {d.stage.label}
                </Badge>
              </li>
            ))}
          </ul>
        </div>

        {/* Inbox / activity */}
        <div className="rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <MonoLabel tone="subtle">Inbox</MonoLabel>
            <span className="inline-flex items-center gap-1.5">
              <BreathingDot />
              <span className="font-mono text-caption text-fg-subtle">updating</span>
            </span>
          </div>
          <ul className="flex flex-col">
            {INBOX.map((a) => {
              const Icon = a.icon
              return (
                <li
                  key={a.who}
                  className="flex items-start gap-3 border-b border-border-subtle px-5 py-3.5 last:border-b-0"
                >
                  <span
                    className={cn(
                      'grid h-8 w-8 shrink-0 place-items-center rounded-md',
                      ACCENT_WELL[a.accent],
                    )}
                    aria-hidden
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-body text-body-sm leading-snug text-fg-muted">
                      <span className="font-medium text-fg">{a.who}</span> {a.what}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-caption text-fg-subtle">{a.when}</span>
                </li>
              )
            })}
          </ul>
          <div className="px-5 py-3.5">
            <Button variant="ghost" size="sm" className="w-full justify-center">
              Open all conversations
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
)

/* -------------------------------------------------------------------------- */

export function DemosSection() {
  return (
    <Section
      id="demos"
      eyebrow="20 - Live Demo Pages"
      title="Live Demo Pages"
      lead="Two full applied screens — a dark marketing landing and a light CRM dashboard — assembled only from the tokens and components above. Same system, two themes, no bespoke styling."
    >
      <div className="flex flex-col gap-10">
        <FadeIn>
          <Demo label="Landing — dark" padded={false}>
            <Landing />
          </Demo>
        </FadeIn>

        <FadeIn>
          <Demo label="CRM dashboard — light" padded={false}>
            <Dashboard />
          </Demo>
        </FadeIn>
      </div>
    </Section>
  )
}
