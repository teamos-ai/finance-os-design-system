/**
 * Document templates — designed, downloadable lead magnets:
 * Cheat Sheet, Guide, Workbook (fillable), Case Study, Whitepaper / Report.
 */
import { FileText, Compass, NotebookPen, Trophy, BarChart3, Quote, Check, ArrowRight } from 'lucide-react'
import { LeadMagnetFrame, TemplateKicker } from '@/components/lead-magnets/Frame'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { CountUp } from '@/lib/motion'

/* ── Cheat Sheet ───────────────────────────────────────────────────────────── */
export function CheatSheetTemplate() {
  const groups = [
    { h: 'Speed-to-lead', rows: ['Reply < 5 min', 'Call twice, then SMS', 'Log every touch'] },
    { h: 'Serviceability', rows: ['Buffer +3%', 'HEM by postcode', 'Shade casual income'] },
    { h: 'Documents', rows: ['2 payslips', '90-day statements', 'ID x2 forms'] },
    { h: 'Follow-up', rows: ['Day 1 · 3 · 7', 'Monthly nurture', 'Quarterly review'] },
  ]
  return (
    <LeadMagnetFrame
      meta={{ kind: 'Cheat Sheet', title: 'The broker quick-reference', format: 'PDF · 1 page', Icon: FileText }}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-caption text-fg-subtle">Print &amp; pin it by your desk</span>
          <Button variant="primary" size="sm">
            Download
          </Button>
        </div>
      }
    >
      <TemplateKicker>Everything on one page</TemplateKicker>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {groups.map((g) => (
          <div key={g.h} className="rounded-md border border-border bg-canvas-muted p-4">
            <p className="font-display text-title-sm text-fg">{g.h}</p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {g.rows.map((r) => (
                <li key={r} className="flex items-center gap-2 font-body text-body-sm text-fg-muted">
                  <Check className="h-3.5 w-3.5 shrink-0 text-accent-text" strokeWidth={2.5} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </LeadMagnetFrame>
  )
}

/* ── Guide ─────────────────────────────────────────────────────────────────── */
export function GuideTemplate() {
  const steps = [
    { t: 'Map your current funnel', d: 'List every touchpoint from enquiry to settlement.' },
    { t: 'Find the leaks', d: 'Mark where leads stall, go cold, or fall through.' },
    { t: 'Automate the chase', d: 'Set the sequences that fire while you sleep.' },
    { t: 'Measure & refine', d: 'Watch speed-to-lead and conversion climb.' },
  ]
  return (
    <LeadMagnetFrame
      meta={{ kind: 'Guide', title: 'The complete follow-up guide', format: 'PDF · 18 pages', Icon: Compass }}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-caption text-fg-subtle">A step-by-step playbook</span>
          <Button variant="primary" size="sm" leadingIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />}>
            Read the guide
          </Button>
        </div>
      }
    >
      <TemplateKicker>Four steps</TemplateKicker>
      <ol className="mt-4 flex flex-col gap-4">
        {steps.map((s, i) => (
          <li key={s.t} className="flex gap-4">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent text-accent-fg font-display text-title-sm">
              {i + 1}
            </span>
            <div>
              <p className="font-display text-title-sm text-fg">{s.t}</p>
              <p className="font-body text-body-sm leading-relaxed text-fg-muted">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </LeadMagnetFrame>
  )
}

/* ── Workbook (fillable) ───────────────────────────────────────────────────── */
export function WorkbookTemplate() {
  const prompts = ['My #1 source of leads is…', 'The follow-up I always skip is…', 'This month I will automate…']
  return (
    <LeadMagnetFrame
      meta={{ kind: 'Workbook', title: 'The 30-day growth workbook', format: 'Fillable PDF', Icon: NotebookPen }}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-caption text-fg-subtle">Fill it in · we save your answers</span>
          <Button variant="secondary" size="sm">
            Start the workbook
          </Button>
        </div>
      }
    >
      <TemplateKicker>Week 1 · diagnose</TemplateKicker>
      <div className="mt-4 flex flex-col gap-4">
        {prompts.map((p, i) => (
          <div key={p}>
            <label className="font-body text-body-sm text-fg">
              {i + 1}. {p}
            </label>
            <Input className="mt-1.5" placeholder="Type your answer…" />
          </div>
        ))}
      </div>
    </LeadMagnetFrame>
  )
}

/* ── Case Study ────────────────────────────────────────────────────────────── */
export function CaseStudyTemplate() {
  return (
    <LeadMagnetFrame
      meta={{ kind: 'Case Study', title: 'How Meridian doubled settlements', format: 'PDF · 6 pages', Icon: Trophy }}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-caption text-fg-subtle">Real numbers · real brokerage</span>
          <Button variant="primary" size="sm">
            Read the story
          </Button>
        </div>
      }
    >
      <div className="flex items-center gap-2">
        <Badge variant="blue" size="sm">
          Refinance team · Melbourne
        </Badge>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { v: 2.1, suf: '×', l: 'settlements' },
          { v: 71, suf: '%', l: 'faster reply' },
          { v: 18, suf: 'h', l: 'saved / week' },
        ].map((m) => (
          <div key={m.l} className="rounded-md border border-border bg-canvas-muted p-3 text-center">
            <p className="font-display text-title-lg leading-none text-fg">
              <CountUp to={m.v} decimals={m.suf === '×' ? 1 : 0} suffix={m.suf} />
            </p>
            <p className="mt-1 font-mono text-caption text-fg-muted">{m.l}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-md border-l-2 border-accent bg-canvas-muted p-4">
        <Quote className="h-5 w-5 text-accent-text" strokeWidth={1.5} />
        <p className="mt-2 font-body text-body-sm italic leading-relaxed text-fg">
          “We stopped losing the 9pm enquiries. That alone changed the quarter.”
        </p>
      </div>
    </LeadMagnetFrame>
  )
}

/* ── Whitepaper / Report ───────────────────────────────────────────────────── */
export function ReportTemplate() {
  const findings = ['58% of enquiries now arrive on mobile', 'First-reply brokers win 8 in 10 deals', 'Nurtured past clients refinance 3× more']
  return (
    <LeadMagnetFrame
      meta={{ kind: 'Whitepaper / Report', title: '2026 Broker Benchmark Report', format: 'PDF · 32 pages', Icon: BarChart3 }}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-caption text-fg-subtle">Survey of 500+ brokerages</span>
          <Button variant="secondary" size="sm">
            Get the report
          </Button>
        </div>
      }
    >
      <div className="grid gap-5 sm:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col justify-center rounded-md border border-border-strong bg-accent-soft p-5">
          <p className="font-mono text-caption uppercase tracking-[0.12em] text-accent-text">Headline figure</p>
          <p className="font-display text-display-md leading-none text-fg">
            <CountUp to={3.4} decimals={1} suffix="×" />
          </p>
          <p className="mt-1 font-body text-body-sm text-fg-muted">ROI from automating follow-up</p>
        </div>
        <div>
          <TemplateKicker>Key findings</TemplateKicker>
          <ul className="mt-3 flex flex-col gap-2.5">
            {findings.map((f) => (
              <li key={f} className="flex items-start gap-2 font-body text-body-sm text-fg-muted">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-text" strokeWidth={2.5} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </LeadMagnetFrame>
  )
}
