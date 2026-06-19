/**
 * Interactive templates — lead magnets with real state + motion:
 * Swipe File (SwipeDeck), Checklist (tick), Quiz (tick + score), Calculator + Scorecard (count-up).
 */
import * as React from 'react'
import { Layers, ListChecks, HelpCircle, Calculator as CalcIcon, Gauge, ArrowRight, RotateCcw } from 'lucide-react'
import { SwipeDeck, Checklist, AnimatedCheck } from '@/components/lead-magnets/primitives'
import { LeadMagnetFrame } from '@/components/lead-magnets/Frame'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CountUp } from '@/lib/motion'
import { cn } from '@/lib/cn'

/* ── Swipe File ────────────────────────────────────────────────────────────── */
const HOOKS = [
  { id: 1, tag: 'SMS · new enquiry', copy: "Hi {name}, it's {broker} — got your enquiry. Quick q so I can help fast: buying or refinancing?" },
  { id: 2, tag: 'Email · subject line', copy: 'The 3-minute pre-approval check most brokers skip' },
  { id: 3, tag: 'Reactivation', copy: "{name}, rates moved this week — want me to run the numbers on your loan? No obligation." },
  { id: 4, tag: 'Review request', copy: 'Settled and smiling? A 20-second review helps three more families find us 🙏' },
  { id: 5, tag: 'Social hook', copy: "Your bank says no. Here's what a broker says next." },
]

export function SwipeFileTemplate() {
  const items = HOOKS.map((h) => ({
    id: h.id,
    content: (
      <div className="flex h-full flex-col p-5">
        <Badge variant="amber" size="sm">
          {h.tag}
        </Badge>
        <p className="mt-4 flex-1 font-display text-title-md leading-snug text-fg">“{h.copy}”</p>
        <p className="font-mono text-caption text-fg-subtle">Drag → keep · ← skip</p>
      </div>
    ),
  }))
  return (
    <LeadMagnetFrame
      meta={{ kind: 'Swipe File', title: 'High-converting hooks', format: 'Interactive · 5 of 40', Icon: Layers, motion: 'Swipe' }}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-caption text-fg-subtle">40 proven scripts</span>
          <Button variant="primary" size="sm">
            Save the full file
          </Button>
        </div>
      }
    >
      <SwipeDeck items={items} />
    </LeadMagnetFrame>
  )
}

/* ── Checklist ─────────────────────────────────────────────────────────────── */
export function ChecklistTemplate() {
  const items = [
    { id: 'a', label: 'Confirm identity & ID documents', done: true },
    { id: 'b', label: 'Verify income & employment', done: true },
    { id: 'c', label: 'Order property valuation' },
    { id: 'd', label: 'Lodge the formal application' },
    { id: 'e', label: 'Review loan offer with client' },
    { id: 'f', label: 'Book the settlement date' },
  ]
  return (
    <LeadMagnetFrame
      meta={{ kind: 'Checklist', title: 'Pre-settlement checklist', format: 'Interactive · 6 steps', Icon: ListChecks, motion: 'Checkbox tick' }}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-caption text-fg-subtle">Tick as you go — progress saves the lead</span>
          <Button variant="secondary" size="sm">
            Download printable
          </Button>
        </div>
      }
    >
      <Checklist items={items} />
    </LeadMagnetFrame>
  )
}

/* ── Quiz ──────────────────────────────────────────────────────────────────── */
const QUIZ = [
  { q: 'How fast do you reply to a new enquiry?', options: [{ label: 'Within minutes', s: 3 }, { label: 'Same day', s: 2 }, { label: 'When I can', s: 0 }] },
  { q: 'How do past clients hear from you?', options: [{ label: 'Automated nurture', s: 3 }, { label: 'Ad-hoc', s: 1 }, { label: "They don't", s: 0 }] },
  { q: 'Can you forecast next month’s settlements?', options: [{ label: 'To the dollar', s: 3 }, { label: 'Roughly', s: 1 }, { label: 'No idea', s: 0 }] },
]

export function QuizTemplate() {
  const [step, setStep] = React.useState(0)
  const [picked, setPicked] = React.useState<number | null>(null)
  const [score, setScore] = React.useState(0)
  const done = step >= QUIZ.length
  const max = QUIZ.length * 3

  const next = () => {
    if (picked === null) return
    setScore((s) => s + QUIZ[step].options[picked].s)
    setPicked(null)
    setStep((s) => s + 1)
  }
  const restart = () => {
    setStep(0)
    setPicked(null)
    setScore(0)
  }
  const band = score >= max * 0.7 ? 'Dialled-in operator' : score >= max * 0.4 ? 'Solid, with gaps' : 'Leaving deals on the table'

  return (
    <LeadMagnetFrame
      meta={{ kind: 'Quiz', title: 'Is your pipeline leaking?', format: 'Interactive · 3 questions', Icon: HelpCircle, motion: 'Checkbox tick' }}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-caption text-fg-subtle">Personalised result · email to save</span>
          {done && (
            <Button variant="ghost" size="sm" leadingIcon={<RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />} onClick={restart}>
              Retake
            </Button>
          )}
        </div>
      }
    >
      {!done ? (
        <div className="flex flex-col">
          <div className="mb-3 flex items-center justify-between font-mono text-caption text-fg-subtle">
            <span>
              Question {step + 1} / {QUIZ.length}
            </span>
            <span className="tabular-nums text-accent-text">{Math.round((step / QUIZ.length) * 100)}%</span>
          </div>
          <p className="font-display text-title-md text-fg">{QUIZ[step].q}</p>
          <div className="mt-4 flex flex-col gap-2">
            {QUIZ[step].options.map((o, i) => (
              <button
                key={o.label}
                type="button"
                onClick={() => setPicked(i)}
                className={cn(
                  'flex items-center gap-3 rounded-md border px-4 py-3 text-left font-body text-body-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  picked === i ? 'border-accent bg-accent-soft text-fg' : 'border-border text-fg-muted hover:border-border-strong',
                )}
              >
                <span className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-sm border', picked === i ? 'border-accent bg-accent text-accent-fg' : 'border-border-strong text-transparent')}>
                  {picked === i && <AnimatedCheck className="h-3.5 w-3.5" />}
                </span>
                {o.label}
              </button>
            ))}
          </div>
          <Button variant="primary" size="md" className="mt-5 w-full" disabled={picked === null} onClick={next}>
            {step === QUIZ.length - 1 ? 'See my result' : 'Next'}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center py-4 text-center">
          <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-md bg-accent-soft text-accent-text">
            <Gauge className="h-6 w-6" strokeWidth={1.5} />
          </span>
          <p className="font-mono text-caption uppercase tracking-[0.12em] text-accent-text">Your score</p>
          <p className="font-display text-display-md leading-none text-fg">
            <CountUp to={score} />
            <span className="text-fg-subtle">/{max}</span>
          </p>
          <p className="mt-3 font-display text-title-md text-fg">{band}</p>
          <p className="mt-1 max-w-sm font-body text-body-sm text-fg-muted">
            Enter your email to get the 3 fixes that move your score the most.
          </p>
        </div>
      )}
    </LeadMagnetFrame>
  )
}

/* ── Calculator ────────────────────────────────────────────────────────────── */
export function CalculatorTemplate() {
  const [leads, setLeads] = React.useState(40)
  const [rate, setRate] = React.useState(25)
  const [comm, setComm] = React.useState(4200)
  const settlements = (leads * rate) / 100
  const revenue = settlements * comm

  const num = (v: string, set: (n: number) => void) => set(v === '' ? 0 : Math.max(0, Number(v)))

  return (
    <LeadMagnetFrame
      meta={{ kind: 'Calculator', title: 'Pipeline revenue calculator', format: 'Interactive', Icon: CalcIcon, motion: 'Count-up' }}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-caption text-fg-subtle">Email me my projection</span>
          <Button variant="primary" size="sm" leadingIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />}>
            Send it
          </Button>
        </div>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Input type="number" label="Leads / month" value={String(leads)} onChange={(e) => num(e.target.value, setLeads)} />
          <Input type="number" label="Close rate (%)" value={String(rate)} onChange={(e) => num(e.target.value, setRate)} />
          <Input type="number" label="Avg commission ($)" value={String(comm)} onChange={(e) => num(e.target.value, setComm)} />
        </div>
        <div className="flex flex-col justify-center gap-4 rounded-md border border-border-strong bg-accent-soft p-5">
          <div>
            <p className="font-mono text-caption uppercase tracking-[0.12em] text-accent-text">Monthly revenue</p>
            <p className="font-display text-display-md leading-none text-fg">
              <CountUp to={revenue} prefix="$" />
            </p>
          </div>
          <div className="border-t border-border-strong/40 pt-3">
            <p className="font-display text-title-lg text-fg">
              <CountUp to={settlements} decimals={1} /> settlements
            </p>
            <p className="font-mono text-caption text-fg-muted">projected each month</p>
          </div>
        </div>
      </div>
    </LeadMagnetFrame>
  )
}

/* ── Assessment / Scorecard ────────────────────────────────────────────────── */
export function ScorecardTemplate() {
  const rows = [
    { label: 'Lead capture', score: 82 },
    { label: 'Follow-up speed', score: 64 },
    { label: 'Nurture', score: 48 },
    { label: 'Forecasting', score: 71 },
  ]
  const overall = Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length)
  return (
    <LeadMagnetFrame
      meta={{ kind: 'Assessment / Scorecard', title: 'Brokerage health scorecard', format: 'Interactive', Icon: Gauge, motion: 'Count-up' }}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-caption text-fg-subtle">Benchmarked vs 500+ brokerages</span>
          <Button variant="secondary" size="sm">
            Get the full report
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 sm:grid-cols-[140px_1fr]">
        <div className="flex flex-col items-center justify-center rounded-md border border-border-strong bg-accent-soft p-4 text-center">
          <p className="font-display text-display-lg leading-none text-fg">
            <CountUp to={overall} />
          </p>
          <p className="font-mono text-caption text-accent-text">/ 100 overall</p>
          <Badge variant="amber" size="sm" >
            Top 30%
          </Badge>
        </div>
        <div className="flex flex-col justify-center gap-3.5">
          {rows.map((r) => (
            <div key={r.label}>
              <div className="mb-1 flex items-center justify-between font-mono text-caption text-fg-muted">
                <span>{r.label}</span>
                <span className="tabular-nums text-fg">{r.score}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-sm bg-inset">
                <div className="h-full rounded-sm bg-accent" style={{ width: `${r.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </LeadMagnetFrame>
  )
}
