/**
 * RepaymentCalculator — home-loan repayments from property value, deposit, rate, term
 * and frequency. The headline repayment and a tokenised principal / interest donut update
 * live; a single amber attention chip surfaces when the LVR runs above 80% (LMI territory).
 * Pure maths lives in finance.ts; this file is just state + the on-brand layout.
 *
 * Motion is motivated: the headline counts up on reveal (AnimatedCurrency), the donut arc
 * eases to its share, and every change leaves a static figure behind. Reduced-motion safe.
 */
import * as React from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Home, DollarSign, Percent, AlertTriangle, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { SegmentedControl } from '@/components/ui/segmented'
import { AnimatedCurrency } from '@/components/calculators/AnimatedCurrency'
import {
  periodicRepayment,
  PERIODS_PER_YEAR,
  FREQUENCY_NOUN,
  aud0,
  pct1,
  toNum,
  type Frequency,
} from '@/components/calculators/finance'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

const DEFAULTS = { value: 820000, deposit: 98000, rate: 6.15, term: 30, freq: 'monthly' as Frequency }

const TERM_OPTIONS = [
  { value: '20', label: '20 yr' },
  { value: '25', label: '25 yr' },
  { value: '30', label: '30 yr' },
]
const FREQUENCY_OPTIONS: { value: Frequency; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'fortnightly', label: 'Fortnightly' },
  { value: 'monthly', label: 'Monthly' },
]

/** Principal / interest donut — one eased arc over a neutral track, figure centred. */
function PrincipalDonut({ frac }: { frac: number }) {
  const reduced = useReducedMotion()
  const ref = React.useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const C = 2 * Math.PI * 52
  const shown = reduced ? frac : inView ? frac : 0
  const label = Math.round(frac * 100)
  return (
    <div className="relative h-[104px] w-[104px] shrink-0">
      <svg
        ref={ref}
        viewBox="0 0 120 120"
        role="img"
        aria-label={`${label}% of total repayments go to principal`}
        className="h-full w-full -rotate-90 text-accent"
      >
        <circle cx="60" cy="60" r="52" fill="none" strokeWidth="12" className="stroke-border-strong" />
        <motion.circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          strokeWidth="12"
          strokeLinecap="round"
          className="stroke-current"
          strokeDasharray={C}
          initial={false}
          animate={{ strokeDashoffset: C * (1 - shown) }}
          transition={reduced ? { duration: 0 } : { duration: 0.7, ease: EASE_OUT }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-title-lg leading-none tabular-nums text-fg">{label}%</span>
        <span className="font-body text-caption text-fg-subtle">principal</span>
      </div>
    </div>
  )
}

/** One legend row — tone dot, label, right-aligned figure. */
function LegendRow({ tone, label, figure }: { tone: 'accent' | 'neutral'; label: string; figure: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden
        className={cn('h-2.5 w-2.5 shrink-0 rounded-xs', tone === 'accent' ? 'bg-accent' : 'bg-border-strong')}
      />
      <span className="flex-1 font-body text-body-sm text-fg-muted">{label}</span>
      <span className="font-display text-title-sm tabular-nums text-fg">{figure}</span>
    </div>
  )
}

export function RepaymentCalculator() {
  const [value, setValue] = React.useState(DEFAULTS.value)
  const [deposit, setDeposit] = React.useState(DEFAULTS.deposit)
  const [rate, setRate] = React.useState(DEFAULTS.rate)
  const [term, setTerm] = React.useState(DEFAULTS.term)
  const [freq, setFreq] = React.useState<Frequency>(DEFAULTS.freq)

  const loan = Math.max(0, value - deposit)
  const lvr = value > 0 ? (loan / value) * 100 : 0
  const payment = periodicRepayment(loan, rate, term, freq)
  const periods = PERIODS_PER_YEAR[freq] * term
  const totalRepaid = payment * periods
  const totalInterest = Math.max(0, totalRepaid - loan)
  const principalFrac = totalRepaid > 0 ? loan / totalRepaid : 0

  const reset = () => {
    setValue(DEFAULTS.value)
    setDeposit(DEFAULTS.deposit)
    setRate(DEFAULTS.rate)
    setTerm(DEFAULTS.term)
    setFreq(DEFAULTS.freq)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* header — identity + reset */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent-soft text-accent-text">
            <Home className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <div>
            <h3 className="font-display text-title-md text-fg">Home loan repayments</h3>
            <p className="font-body text-body-sm text-fg-subtle">Property value, deposit, rate and term.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={reset}
          className="relative inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-mono-xs text-fg-subtle transition-colors duration-fast ease-out hover:text-fg active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring before:absolute before:-inset-y-[7px] before:inset-x-0 before:content-['']"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          Reset
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* inputs */}
        <div className="flex flex-col gap-4">
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            icon={DollarSign}
            label="Property value"
            value={String(value)}
            onChange={(e) => setValue(toNum(e.target.value))}
          />
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            icon={DollarSign}
            label="Deposit"
            value={String(deposit)}
            onChange={(e) => setDeposit(toNum(e.target.value))}
            hint={loan > 0 ? `Loan amount ${aud0(loan)}` : 'Deposit covers the full price'}
          />
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            step={0.01}
            icon={Percent}
            label="Interest rate (p.a.)"
            value={String(rate)}
            onChange={(e) => setRate(toNum(e.target.value, 100))}
          />
          <div className="flex flex-col gap-1.5">
            <span className="font-body text-caption text-fg-muted">Loan term</span>
            <div className="overflow-x-auto">
              <SegmentedControl
                size="sm"
                aria-label="Loan term in years"
                options={TERM_OPTIONS}
                value={String(term)}
                onValueChange={(v) => setTerm(Number(v))}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-body text-caption text-fg-muted">Repayment frequency</span>
            <div className="overflow-x-auto">
              <SegmentedControl
                size="sm"
                aria-label="Repayment frequency"
                options={FREQUENCY_OPTIONS}
                value={freq}
                onValueChange={(v) => setFreq(v)}
              />
            </div>
          </div>
        </div>

        {/* result */}
        <div className="flex flex-col gap-4 rounded-md border border-border-strong bg-accent-soft p-5">
          <div>
            <p className="font-mono text-caption uppercase tracking-[0.12em] text-accent-text">Estimated repayment</p>
            <p className="flex items-baseline gap-1.5">
              <AnimatedCurrency value={payment} className="font-display text-display-md leading-none text-fg" />
              <span className="font-body text-body-sm text-fg-muted">/ {FREQUENCY_NOUN[freq]}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border-strong/40 pt-3.5">
            <span className="font-body text-body-sm text-fg-muted">
              Loan <span className="tabular-nums text-fg">{aud0(loan)}</span> · LVR{' '}
              <span className="tabular-nums text-fg">{pct1(lvr)}</span>
            </span>
            {lvr > 80 && (
              <Badge variant="amber" size="sm">
                <AlertTriangle className="h-3 w-3" strokeWidth={2.25} aria-hidden />
                LMI may apply
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-5 border-t border-border-strong/40 pt-4">
            <PrincipalDonut frac={principalFrac} />
            <div className="flex flex-1 flex-col gap-2.5">
              <LegendRow tone="accent" label="Principal" figure={aud0(loan)} />
              <LegendRow tone="neutral" label="Interest" figure={aud0(totalInterest)} />
              <div className="flex items-center justify-between gap-2.5 border-t border-border-strong/40 pt-2.5">
                <span className="font-body text-body-sm text-fg-muted">Total repaid</span>
                <span className="font-display text-title-sm tabular-nums text-fg">{aud0(totalRepaid)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="font-body text-caption leading-relaxed text-fg-subtle">
        Indicative estimate only — not a loan offer, approval or quote. Rates, fees and serviceability
        are set by the lender.
      </p>
    </div>
  )
}
