/**
 * NotionSection — a Notion-style document template rendered on-system. A believable
 * broker SOP ("New enquiry → first contact") composed from on-brand inline blocks:
 * Callout (info / warn / success), Toggle (Disclosure), a hairline Table, a CodeBlock,
 * and database-style status Cards. The showcase IS the documentation — each block is
 * annotated with its token recipe in a MonoLabel above the live document.
 */
import * as React from 'react'
import {
  Info, AlertTriangle, CheckCircle2, FileText, Hash, Clock,
  CircleDot, Circle, type LucideIcon,
} from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { Disclosure } from '@/components/ui/disclosure'
import { MonoLabel } from '@/components/ui/mono-label'
import { cn } from '@/lib/cn'

/* ── Callout ─────────────────────────────────────────────────────────────────
   A tinted aside: icon + soft well + body copy. Three intents map to the state
   tokens (info / warning / success). Tinted background, hairline, no glass. */
type CalloutTone = 'info' | 'warn' | 'success'

const CALLOUT: Record<CalloutTone, { well: string; icon: string; Icon: LucideIcon }> = {
  info: { well: 'bg-info-soft', icon: 'text-info', Icon: Info },
  warn: { well: 'bg-warning-soft', icon: 'text-warning', Icon: AlertTriangle },
  success: { well: 'bg-success-soft', icon: 'text-success', Icon: CheckCircle2 },
}

function Callout({ tone, children }: { tone: CalloutTone; children: React.ReactNode }) {
  const c = CALLOUT[tone]
  return (
    <div className={cn('flex items-start gap-3 rounded-md p-4', c.well)}>
      <c.Icon className={cn('mt-0.5 h-4 w-4 shrink-0', c.icon)} strokeWidth={1.5} aria-hidden />
      <p className="font-body text-body-sm leading-relaxed text-fg-muted">{children}</p>
    </div>
  )
}

/* ── Table ───────────────────────────────────────────────────────────────────
   Hairline borders, mono header row over bg-surface, calm zebra-free body. */
const STAGE_ROWS: { stage: string; owner: string; sla: string; tone: CalloutTone }[] = [
  { stage: 'New enquiry', owner: 'Automation', sla: 'Instant', tone: 'success' },
  { stage: 'First contact', owner: 'Broker', sla: '15 min', tone: 'info' },
  { stage: 'Fact-find booked', owner: 'Broker', sla: '24 hrs', tone: 'info' },
  { stage: 'No response', owner: 'Nurture', sla: '3 days', tone: 'warn' },
]

function StageTable() {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-surface">
            {['Stage', 'Owner', 'Target SLA', 'Status'].map((h) => (
              <th
                key={h}
                className="border-b border-border px-4 py-2.5 font-mono text-mono-xs uppercase text-fg-subtle"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STAGE_ROWS.map((r) => (
            <tr key={r.stage} className="border-b border-subtle last:border-0">
              <td className="px-4 py-3 font-body text-body-sm text-fg">{r.stage}</td>
              <td className="px-4 py-3 font-body text-body-sm text-fg-muted">{r.owner}</td>
              <td className="px-4 py-3 font-mono text-caption text-fg-muted">{r.sla}</td>
              <td className="px-4 py-3">
                <StatusPill tone={r.tone} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── CodeBlock ─────────────────────────────────────────────────────────────── */
function CodeBlock({ filename, children }: { filename: string; children: string }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-inset">
      <div className="flex items-center gap-2 border-b border-subtle px-4 py-2">
        <Hash className="h-3.5 w-3.5 text-fg-subtle" strokeWidth={1.5} aria-hidden />
        <span className="font-mono text-caption text-fg-subtle">{filename}</span>
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-body-sm leading-relaxed text-fg-muted">
        <code>{children}</code>
      </pre>
    </div>
  )
}

/* ── Status pill + database cards ─────────────────────────────────────────────
   A small property pill reused in the table and the database row of cards. */
const STATUS_META: Record<CalloutTone, { label: string; dot: string; text: string }> = {
  success: { label: 'Auto', dot: 'bg-success', text: 'text-success' },
  info: { label: 'Active', dot: 'bg-info', text: 'text-info' },
  warn: { label: 'At risk', dot: 'bg-warning', text: 'text-warning' },
}

function StatusPill({ tone }: { tone: CalloutTone }) {
  const s = STATUS_META[tone]
  return (
    <span className={cn('inline-flex items-center gap-1.5 font-mono text-mono-xs uppercase', s.text)}>
      <span aria-hidden className={cn('h-1.5 w-1.5 rounded-full', s.dot)} />
      {s.label}
    </span>
  )
}

const DB_CARDS: { name: string; value: string; sub: string; tone: CalloutTone; Icon: LucideIcon }[] = [
  { name: 'Active enquiries', value: '24', sub: 'In first-contact window', tone: 'info', Icon: CircleDot },
  { name: 'Booked this week', value: '11', sub: 'Fact-find scheduled', tone: 'success', Icon: CheckCircle2 },
  { name: 'Awaiting reply', value: '06', sub: 'Moved to nurture', tone: 'warn', Icon: Circle },
]

function DatabaseCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {DB_CARDS.map((card) => (
        <div key={card.name} className="rounded-md border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <card.Icon className="h-4 w-4 text-fg-subtle" strokeWidth={1.5} aria-hidden />
            <StatusPill tone={card.tone} />
          </div>
          <p className="mt-3 font-display text-display-sm text-fg">{card.value}</p>
          <p className="mt-1 font-body text-body-sm text-fg">{card.name}</p>
          <p className="mt-0.5 font-mono text-caption text-fg-subtle">{card.sub}</p>
        </div>
      ))}
    </div>
  )
}

export function NotionSection() {
  return (
    <Section
      id="notion"
      eyebrow="18 - Notion"
      title="Notion"
      lead="A Notion-style document template on-system — callouts, toggles, a hairline table and code blocks, composed into a believable broker SOP."
    >
      <Demo label="document — broker SOP" padded={false}>
        {/* Page frame: a centred document column on the canvas, like a Notion page */}
        <div className="bg-canvas px-5 py-8 md:px-10 md:py-12">
          <article className="mx-auto max-w-2xl">
            {/* Doc meta */}
            <div className="flex items-center gap-2 font-mono text-caption text-fg-subtle">
              <FileText className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              <span>Playbooks</span>
              <span aria-hidden>/</span>
              <span className="text-fg-muted">Lead handling</span>
            </div>

            {/* Title block */}
            <h3 className="mt-4 font-display text-display-sm text-fg">New enquiry → first contact</h3>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-caption text-fg-subtle">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                Updated 18 Jun
              </span>
              <span>Owner · Operations</span>
              <span>v2.1</span>
            </div>

            <p className="mt-6 font-body text-body-md leading-relaxed text-fg-muted">
              Every enquiry that lands in the pipeline runs the same path. The system handles
              capture and the first touch automatically; the broker owns the conversation from
              there. This page is the source of truth — keep it current.
            </p>

            <Callout tone="info">
              <span className="font-bold text-fg">Speed-to-lead is the whole game.</span>{' '}
              An enquiry contacted inside 15 minutes is far more likely to convert. The automation
              buys that window — don&apos;t spend it.
            </Callout>

            {/* Heading 2 */}
            <h4 className="mt-9 font-display text-title-lg text-fg">The pipeline stages</h4>
            <p className="mt-2 font-body text-body-md leading-relaxed text-fg-muted">
              Each stage has one owner and one target SLA. If a stage stalls past its SLA, the lead
              moves to nurture automatically — nothing is dropped.
            </p>

            <div className="mt-4">
              <StageTable />
            </div>

            <Callout tone="warn">
              <span className="font-bold text-fg">Never leave a lead in “New enquiry”.</span>{' '}
              If you can&apos;t make first contact, reassign rather than letting the SLA lapse.
            </Callout>

            {/* Heading 2 */}
            <h4 className="mt-9 font-display text-title-lg text-fg">Pipeline today</h4>
            <p className="mt-2 font-body text-body-md leading-relaxed text-fg-muted">
              A linked database view — each card is a saved filter on the enquiries table.
            </p>

            <div className="mt-4">
              <DatabaseCards />
            </div>

            {/* Heading 2 + toggle */}
            <h4 className="mt-9 font-display text-title-lg text-fg">Reference</h4>
            <div className="mt-4 space-y-3">
              <Disclosure title="The automated follow-up sequence" defaultOpen>
                <div className="space-y-4">
                  <p>
                    On a new enquiry the system fires an SMS, then an email, then logs a task for the
                    owning broker. The trigger payload is below — read-only, edited in Workflows.
                  </p>
                  <CodeBlock filename="workflow · new-enquiry.json">
{`{
  "trigger": "enquiry.created",
  "steps": [
    { "wait": "0m",  "action": "sms.send",   "template": "welcome" },
    { "wait": "2m",  "action": "email.send", "template": "intro" },
    { "wait": "15m", "action": "task.create", "owner": "broker" }
  ]
}`}
                  </CodeBlock>
                </div>
              </Disclosure>

              <Disclosure title="Escalation rules">
                <p>
                  No reply after three touches over three days routes the lead to the nurture
                  campaign and flags it “at risk”. The broker keeps ownership; the system keeps it
                  warm until they re-engage.
                </p>
              </Disclosure>
            </div>

            <Callout tone="success">
              <span className="font-bold text-fg">Done right, this runs itself.</span>{' '}
              Capture, first touch and follow-up are automated — your time goes to the conversation,
              not the admin.
            </Callout>
          </article>
        </div>
      </Demo>

      {/* Block index — the documentation half of "the showcase IS the docs" */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Callout', note: 'icon + soft state well + body', tone: 'info' as const },
          { label: 'Toggle', note: 'Disclosure, smooth expand', tone: 'success' as const },
          { label: 'Table', note: 'hairline border-subtle rows', tone: 'amber' as const },
          { label: 'Code block', note: 'pre · font-mono · bg-inset', tone: 'subtle' as const },
        ].map((b) => (
          <div key={b.label} className="rounded-md border border-border bg-surface p-4">
            <MonoLabel tone={b.tone}>{b.label}</MonoLabel>
            <p className="mt-2 font-body text-body-sm text-fg-muted">{b.note}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
