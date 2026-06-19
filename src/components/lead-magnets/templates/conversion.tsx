/**
 * Conversion templates — opt-in & utility lead magnets:
 * Newsletter, Email Course, Webinar, Toolkit, Resource List, Planner, Coupon.
 */
import { Mail, GraduationCap, Video, Clock, Package, Library, CalendarDays, Ticket, Check, Download, ExternalLink } from 'lucide-react'
import { LeadMagnetFrame, TemplateKicker } from '@/components/lead-magnets/Frame'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

/* ── Newsletter ────────────────────────────────────────────────────────────── */
export function NewsletterTemplate() {
  return (
    <LeadMagnetFrame meta={{ kind: 'Newsletter', title: 'The Broker Brief', format: 'Weekly email', Icon: Mail }}>
      <TemplateKicker>A calmer pipeline, weekly</TemplateKicker>
      <p className="mt-3 font-body text-body-sm leading-relaxed text-fg-muted">
        One short note each week on follow-up, automation and settling more deals with less admin. No fluff,
        unsubscribe anytime.
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Input className="flex-1" type="email" placeholder="you@brokerage.com.au" icon={Mail} />
        <Button variant="primary" size="md" className="shrink-0">
          Subscribe
        </Button>
      </div>
    </LeadMagnetFrame>
  )
}

/* ── Email Course (drip) ───────────────────────────────────────────────────── */
export function EmailCourseTemplate() {
  const lessons = ['Audit your funnel', 'Fix speed-to-lead', 'Build the nurture', 'Reactivate past clients', 'Forecast & scale']
  return (
    <LeadMagnetFrame meta={{ kind: 'Email Course', title: '5 days to a tighter pipeline', format: '5-day course', Icon: GraduationCap }}>
      <TemplateKicker>One lesson a day</TemplateKicker>
      <ol className="mt-4 flex flex-col gap-2">
        {lessons.map((l, i) => (
          <li key={l} className="flex items-center gap-3 rounded-md border border-border bg-canvas-muted px-3 py-2.5">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-sm bg-accent-soft font-mono text-caption text-accent-text">
              D{i + 1}
            </span>
            <span className="font-body text-body-sm text-fg">{l}</span>
            {i === 0 && (
              <span className="ml-auto font-mono text-caption text-accent-text">free now</span>
            )}
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Input className="flex-1" type="email" placeholder="Where should we send Day 1?" icon={Mail} />
        <Button variant="primary" size="md" className="shrink-0">
          Start the course
        </Button>
      </div>
    </LeadMagnetFrame>
  )
}

/* ── Webinar / Masterclass ─────────────────────────────────────────────────── */
export function WebinarTemplate() {
  return (
    <LeadMagnetFrame meta={{ kind: 'Webinar', title: 'The 30-minute broker workday', format: 'Live · 45 min', Icon: Video }}>
      <div className="flex items-center gap-2">
        <Badge variant="danger" size="sm" dot>
          Live
        </Badge>
        <span className="font-mono text-caption text-fg-subtle">Thu 24 Jul · 12:00 AEST</span>
      </div>
      <h4 className="mt-3 font-display text-title-md text-fg">What you'll walk away with</h4>
      <ul className="mt-3 flex flex-col gap-2">
        {['The exact follow-up sequence we use', 'A live build of an auto-router', 'Q&A with a top-10 broker'].map((p) => (
          <li key={p} className="flex items-start gap-2 font-body text-body-sm text-fg-muted">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-text" strokeWidth={2.5} />
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-center justify-between rounded-md border border-border bg-canvas-muted px-4 py-3">
        <span className="flex items-center gap-2 font-mono text-caption text-fg-muted">
          <Clock className="h-3.5 w-3.5" strokeWidth={1.75} /> 318 registered
        </span>
        <Button variant="primary" size="sm">
          Save my seat
        </Button>
      </div>
    </LeadMagnetFrame>
  )
}

/* ── Toolkit / Resource Kit ────────────────────────────────────────────────── */
export function ToolkitTemplate() {
  const files = ['Follow-up SMS scripts', 'Serviceability spreadsheet', 'Email signature kit', 'Review-request templates']
  return (
    <LeadMagnetFrame
      meta={{ kind: 'Toolkit', title: "The broker's starter kit", format: 'ZIP · 6 files', Icon: Package }}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-caption text-fg-subtle">Everything in one download</span>
          <Button variant="primary" size="sm" leadingIcon={<Download className="h-3.5 w-3.5" strokeWidth={1.75} />}>
            Get the kit
          </Button>
        </div>
      }
    >
      <TemplateKicker>What's in the box</TemplateKicker>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {files.map((f) => (
          <div key={f} className="flex items-center gap-3 rounded-md border border-border bg-canvas-muted p-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent-soft text-accent-text">
              <Download className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="font-body text-body-sm text-fg">{f}</span>
          </div>
        ))}
      </div>
    </LeadMagnetFrame>
  )
}

/* ── Resource List / Directory ─────────────────────────────────────────────── */
export function ResourceListTemplate() {
  const items = [
    { t: 'Lender turnaround tracker', m: 'Updated weekly' },
    { t: 'First-home buyer grants by state', m: '8 states' },
    { t: 'Compliance checklist library', m: '24 docs' },
    { t: 'Rate-change alert feeds', m: 'RSS + email' },
  ]
  return (
    <LeadMagnetFrame
      meta={{ kind: 'Resource List', title: 'The broker resource vault', format: 'Curated · 25 links', Icon: Library }}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-caption text-fg-subtle">Bookmark-worthy, all in one place</span>
          <Button variant="secondary" size="sm">
            Unlock the vault
          </Button>
        </div>
      }
    >
      <TemplateKicker>Hand-picked</TemplateKicker>
      <ul className="mt-3 divide-y divide-border-subtle">
        {items.map((r) => (
          <li key={r.t} className="flex items-center justify-between gap-3 py-2.5">
            <div>
              <p className="font-body text-body-sm text-fg">{r.t}</p>
              <p className="font-mono text-caption text-fg-subtle">{r.m}</p>
            </div>
            <ExternalLink className="h-4 w-4 shrink-0 text-accent-text" strokeWidth={1.75} />
          </li>
        ))}
      </ul>
    </LeadMagnetFrame>
  )
}

/* ── Planner / Calendar ────────────────────────────────────────────────────── */
export function PlannerTemplate() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const blocks = [
    { d: 0, t: 'Lead power-hour', tone: 'bg-accent text-accent-fg' },
    { d: 2, t: 'Nurture review', tone: 'bg-accent-soft text-accent-text' },
    { d: 4, t: 'Pipeline forecast', tone: 'bg-accent-soft text-accent-text' },
  ]
  return (
    <LeadMagnetFrame
      meta={{ kind: 'Planner', title: 'The broker week planner', format: 'Printable PDF', Icon: CalendarDays }}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-caption text-fg-subtle">A repeatable rhythm for the week</span>
          <Button variant="primary" size="sm">
            Download planner
          </Button>
        </div>
      }
    >
      <TemplateKicker>Your default week</TemplateKicker>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {days.map((d, i) => (
          <div key={d} className="flex flex-col gap-2">
            <p className="text-center font-mono text-caption uppercase text-fg-subtle">{d}</p>
            <div className="flex min-h-[88px] flex-col gap-1.5 rounded-md border border-border bg-canvas-muted p-1.5">
              {blocks
                .filter((b) => b.d === i)
                .map((b) => (
                  <span key={b.t} className={`rounded-sm px-1.5 py-1 text-center font-mono text-[0.6rem] leading-tight ${b.tone}`}>
                    {b.t}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </LeadMagnetFrame>
  )
}

/* ── Coupon / Discount ─────────────────────────────────────────────────────── */
export function CouponTemplate() {
  return (
    <LeadMagnetFrame meta={{ kind: 'Coupon', title: 'Founding-broker offer', format: 'Limited', Icon: Ticket }}>
      <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-accent-text bg-accent-soft p-6 text-center">
        <span aria-hidden className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-sm bg-canvas" />
        <span aria-hidden className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-sm bg-canvas" />
        <p className="font-mono text-caption uppercase tracking-[0.14em] text-accent-text">First 3 months</p>
        <p className="mt-1 font-display text-display-md leading-none text-fg">50% off</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-border-strong bg-canvas px-3 py-2">
          <Ticket className="h-4 w-4 text-accent-text" strokeWidth={1.75} />
          <span className="font-mono text-body-sm font-bold tracking-[0.18em] text-fg">FOUNDER50</span>
        </div>
        <p className="mt-3 font-mono text-caption text-fg-subtle">Expires 31 Jul 2026</p>
      </div>
      <Button variant="primary" size="md" className="mt-4 w-full">
        Claim the offer
      </Button>
    </LeadMagnetFrame>
  )
}
