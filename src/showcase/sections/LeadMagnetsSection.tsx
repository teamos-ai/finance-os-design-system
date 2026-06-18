/**
 * LeadMagnetsSection — the conversion surfaces a broker drops at the bottom of a funnel.
 *
 * Three working lead-magnet patterns, all on Finance OS tokens:
 *   1. Tech-stack savings calculator — number Inputs for current monthly spend across a
 *      few tools, summed live (useState), compared to Finance OS at $297/mo. Monthly +
 *      annual savings count up (CountUp) inside an on-brand amber result card.
 *   2. Gated download card — a lead magnet (PDF) behind a single email field with a
 *      success / thank-you state (useState).
 *   3. Newsletter opt-in — email Input + Button with its own thank-you state.
 *
 * Real React state throughout, accessible labels, token-only, 8px radius ceiling.
 */
import * as React from 'react'
import { Calculator, Check, Download, FileText, Mail, RotateCcw, TrendingDown } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MonoLabel } from '@/components/ui/mono-label'
import { CountUp } from '@/lib/motion'
import { PRICING } from '@/data/system'
import { cn } from '@/lib/cn'

/* ── Savings calculator ──────────────────────────────────────────────────────
   Each line is one tool a broker pays for today. Defaults reflect a typical
   stack; the broker overwrites with their own monthly spend. */
interface SpendLine {
  key: string
  label: string
  hint: string
  initial: number
}

const SPEND_LINES: SpendLine[] = [
  { key: 'crm', label: 'CRM & pipeline', hint: 'e.g. HubSpot, Pipedrive', initial: 99 },
  { key: 'email', label: 'Email marketing', hint: 'e.g. Mailchimp, ActiveCampaign', initial: 79 },
  { key: 'sms', label: 'SMS platform', hint: 'e.g. Twilio, SimpleTexting', initial: 49 },
  { key: 'funnels', label: 'Funnels & landing pages', hint: 'e.g. ClickFunnels', initial: 97 },
  { key: 'booking', label: 'Booking & scheduling', hint: 'e.g. Calendly', initial: 29 },
  { key: 'automation', label: 'Automation & connectors', hint: 'e.g. Zapier', initial: 69 },
]

type SpendState = Record<string, number>

const initialSpend: SpendState = SPEND_LINES.reduce<SpendState>((acc, line) => {
  acc[line.key] = line.initial
  return acc
}, {})

const currency = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

function SavingsCalculator() {
  const [spend, setSpend] = React.useState<SpendState>(initialSpend)

  const currentTotal = React.useMemo(
    () => Object.values(spend).reduce((sum, v) => sum + (Number.isFinite(v) ? v : 0), 0),
    [spend],
  )

  const monthlySaving = Math.max(0, currentTotal - PRICING.financeOs)
  const annualSaving = monthlySaving * 12
  const isSaving = currentTotal > PRICING.financeOs

  const update = (key: string, raw: string) => {
    const next = raw === '' ? 0 : Math.max(0, Number(raw))
    setSpend((prev) => ({ ...prev, [key]: Number.isFinite(next) ? next : 0 }))
  }

  const reset = () => setSpend(initialSpend)

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      {/* Inputs — current tool spend */}
      <div className="rounded-md border border-border bg-surface p-6">
        <div className="flex items-center justify-between gap-3">
          <MonoLabel number="01" tone="accent">
            Your current stack
          </MonoLabel>
          <Button
            variant="ghost"
            size="sm"
            leadingIcon={<RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />}
            onClick={reset}
          >
            Reset
          </Button>
        </div>
        <p className="mt-2 font-body text-body-sm text-fg-subtle">
          Enter what you pay each month for the tools Finance OS replaces.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {SPEND_LINES.map((line) => (
            <Input
              key={line.key}
              type="number"
              inputMode="numeric"
              min={0}
              label={line.label}
              hint={line.hint}
              value={spend[line.key] === 0 ? '' : String(spend[line.key])}
              placeholder="0"
              onChange={(e) => update(line.key, e.target.value)}
            />
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-border-subtle pt-4">
          <span className="font-mono text-caption uppercase tracking-[0.1em] text-fg-subtle">
            Current monthly spend
          </span>
          <span className="font-display text-title-md tabular-nums text-fg">{currency(currentTotal)}</span>
        </div>
      </div>

      {/* Result — on-brand amber card */}
      <div
        className={cn(
          'relative flex flex-col overflow-hidden rounded-md border p-6',
          isSaving ? 'border-border-strong bg-accent-soft' : 'border-border bg-elevated',
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <MonoLabel number="02" tone={isSaving ? 'accent' : 'subtle'}>
            With Finance OS
          </MonoLabel>
          <Badge variant="amber" size="sm">
            {currency(PRICING.financeOs)}/mo
          </Badge>
        </div>

        {isSaving ? (
          <>
            <div className="mt-6">
              <span className="font-mono text-caption uppercase tracking-[0.12em] text-accent-text">
                You save every month
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <TrendingDown className="h-6 w-6 text-accent-text" strokeWidth={1.5} aria-hidden />
                <span className="font-display text-display-lg leading-none text-fg">
                  <CountUp to={monthlySaving} prefix="$" />
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border-strong/40 pt-5">
              <div className="flex flex-col gap-1">
                <span className="font-display text-title-lg leading-none text-fg">
                  <CountUp to={annualSaving} prefix="$" />
                </span>
                <span className="font-mono text-caption text-fg-muted">saved per year</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-display text-title-lg leading-none text-fg">
                  <CountUp to={currentTotal > 0 ? (monthlySaving / currentTotal) * 100 : 0} suffix="%" />
                </span>
                <span className="font-mono text-caption text-fg-muted">lower run-rate</span>
              </div>
            </div>

            <p className="mt-auto pt-6 font-body text-body-sm leading-relaxed text-fg-muted">
              One platform replaces the stack above — CRM, marketing, messaging, funnels and booking.
            </p>
            <Button variant="gradient" size="md" className="mt-5 w-full">
              See your savings plan
            </Button>
          </>
        ) : (
          <div className="mt-6 flex flex-1 flex-col">
            <p className="font-body text-body-md leading-relaxed text-fg-muted">
              Your stack already runs lean. Add the tools you pay for above and we'll show the
              monthly and annual difference against Finance OS.
            </p>
            <span className="mt-auto pt-6 font-mono text-caption text-fg-subtle">
              Finance OS is a flat {currency(PRICING.financeOs)}/mo — no per-tool add-ons.
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Gated download — email unlock with a thank-you state ─────────────────── */
function GatedDownload() {
  const [email, setEmail] = React.useState('')
  const [unlocked, setUnlocked] = React.useState(false)
  const [error, setError] = React.useState<string | undefined>(undefined)
  const id = React.useId()

  const validEmail = (v: string) => /.+@.+\..+/.test(v.trim())

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validEmail(email)) {
      setError('Enter a valid email to unlock the download.')
      return
    }
    setError(undefined)
    setUnlocked(true)
  }

  return (
    <div className="flex flex-col rounded-md border border-border bg-surface p-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft text-accent-text">
          <FileText className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </span>
        <div>
          <MonoLabel tone="subtle" size="sm">
            Free guide
          </MonoLabel>
          <h3 className="font-display text-title-md text-fg">The Broker Stack Audit</h3>
        </div>
      </div>
      <p className="mt-3 font-body text-body-sm leading-relaxed text-fg-muted">
        A 12-page walkthrough for mapping every tool in your pipeline and finding the overlap —
        delivered to your inbox.
      </p>

      {unlocked ? (
        <div
          role="status"
          aria-live="polite"
          className="mt-5 flex flex-1 flex-col justify-center rounded-md border border-border-subtle bg-elevated p-5 text-center"
        >
          <span className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-success-soft text-success">
            <Check className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </span>
          <p className="font-display text-body-lg text-fg">Check your inbox.</p>
          <p className="mt-1 font-body text-body-sm text-fg-muted">
            The guide is on its way to <span className="text-fg">{email}</span>.
          </p>
          <Button
            variant="secondary"
            size="sm"
            leadingIcon={<Download className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />}
            className="mx-auto mt-4"
          >
            Download now
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 flex flex-col gap-3" noValidate>
          <Input
            id={`${id}-email`}
            type="email"
            label="Work email"
            placeholder="you@brokerage.com.au"
            icon={Mail}
            autoComplete="email"
            value={email}
            error={error}
            onChange={(e) => {
              setEmail(e.target.value)
              if (error) setError(undefined)
            }}
          />
          <Button type="submit" variant="primary" size="md" className="w-full">
            Unlock the download
          </Button>
          <p className="font-mono text-caption text-fg-subtle">No spam. Unsubscribe anytime.</p>
        </form>
      )}
    </div>
  )
}

/* ── Newsletter opt-in — email + button with thank-you state ──────────────── */
function OptInForm() {
  const [email, setEmail] = React.useState('')
  const [subscribed, setSubscribed] = React.useState(false)
  const [error, setError] = React.useState<string | undefined>(undefined)
  const id = React.useId()

  const validEmail = (v: string) => /.+@.+\..+/.test(v.trim())

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError(undefined)
    setSubscribed(true)
  }

  return (
    <div className="flex h-full flex-col rounded-md border border-border bg-surface p-6">
      <MonoLabel tone="accent" dot>
        The broker brief
      </MonoLabel>
      <h3 className="mt-3 font-display text-title-md text-fg">A calmer pipeline, weekly.</h3>
      <p className="mt-2 font-body text-body-sm leading-relaxed text-fg-muted">
        One short note each week on follow-up, automation and settling more deals with less admin.
      </p>

      {subscribed ? (
        <div
          role="status"
          aria-live="polite"
          className="mt-5 flex items-center gap-3 rounded-md border border-border-subtle bg-success-soft px-4 py-3.5"
        >
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-success text-inverse-fg">
            <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
          </span>
          <p className="font-body text-body-sm text-fg">
            You're in. The next brief lands in your inbox.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row sm:items-start" noValidate>
          <div className="flex-1">
            <label htmlFor={`${id}-email`} className="sr-only">
              Email address
            </label>
            <Input
              id={`${id}-email`}
              type="email"
              placeholder="you@brokerage.com.au"
              icon={Mail}
              autoComplete="email"
              value={email}
              error={error}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError(undefined)
              }}
            />
          </div>
          <Button type="submit" variant="primary" size="md" className="shrink-0">
            Subscribe
          </Button>
        </form>
      )}
    </div>
  )
}

export function LeadMagnetsSection() {
  return (
    <Section
      id="leadmagnets"
      eyebrow="16 - Lead Magnets"
      title="Lead Magnets"
      lead="Conversion surfaces with real state — a working tech-stack savings calculator, a gated download, and an opt-in form. Calm copy, accessible labels, token-only."
    >
      <div className="flex flex-col gap-8">
        <Demo
          label="Tech-stack savings calculator"
          action={
            <Badge variant="outline" size="sm">
              <Calculator className="h-3 w-3" strokeWidth={1.5} aria-hidden />
              Live
            </Badge>
          }
        >
          <SavingsCalculator />
        </Demo>

        <Demo label="Gated download & opt-in">
          <div className="grid gap-6 lg:grid-cols-2">
            <GatedDownload />
            <OptInForm />
          </div>
        </Demo>
      </div>
    </Section>
  )
}
