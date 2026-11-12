/**
 * BorrowingPowerCalculator — an indicative serviceability estimate. Monthly surplus
 * (income less living expenses and other commitments) is solved back through the
 * amortisation formula at an assessment rate (actual rate + APRA-style buffer) over 30
 * years to a maximum loan. A tokenised stacked bar shows where the income goes.
 *
 * It asserts nothing about approval — the copy keeps it an estimate and points serviceability
 * back to the lender. Blue + neutral only; no amber here (attention stays reserved).
 */
import * as React from 'react'
import { Wallet, DollarSign, Percent, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { SegmentedControl } from '@/components/ui/segmented'
import { AnimatedCurrency } from '@/components/calculators/AnimatedCurrency'
import { loanFromRepayment, aud0, pct1, toNum } from '@/components/calculators/finance'
import { cn } from '@/lib/cn'

const DEFAULTS = { income: 11500, expenses: 4200, other: 650, rate: 6.15, buffer: 3.0 }
const TERM_YEARS = 30

const BUFFER_OPTIONS = [
  { value: '2.5', label: '+2.5%' },
  { value: '3.0', label: '+3.0%' },
]

/** One legend row for the income split. */
function LegendRow({ swatch, label, figure }: { swatch: string; label: string; figure: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span aria-hidden className={cn('h-2.5 w-2.5 shrink-0 rounded-xs', swatch)} />
      <span className="flex-1 font-body text-body-sm text-fg-muted">{label}</span>
      <span className="font-display text-title-sm tabular-nums text-fg">{figure}</span>
    </div>
  )
}

export function BorrowingPowerCalculator() {
  const [income, setIncome] = React.useState(DEFAULTS.income)
  const [expenses, setExpenses] = React.useState(DEFAULTS.expenses)
  const [other, setOther] = React.useState(DEFAULTS.other)
  const [rate, setRate] = React.useState(DEFAULTS.rate)
  const [buffer, setBuffer] = React.useState(DEFAULTS.buffer)

  const surplus = Math.max(0, income - expenses - other)
  const assessRate = rate + buffer
  const maxLoan = loanFromRepayment(surplus, assessRate, TERM_YEARS, 'monthly')

  const span = income > 0 ? income : 1
  const w = (n: number) => `${Math.min(100, (n / span) * 100)}%`

  const reset = () => {
    setIncome(DEFAULTS.income)
    setExpenses(DEFAULTS.expenses)
    setOther(DEFAULTS.other)
    setRate(DEFAULTS.rate)
    setBuffer(DEFAULTS.buffer)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent-soft text-accent-text">
            <Wallet className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <div>
            <h3 className="font-display text-title-md text-fg">Borrowing power</h3>
            <p className="font-body text-body-sm text-fg-subtle">Serviceability from monthly surplus.</p>
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
            label="Net monthly income (combined)"
            value={String(income)}
            onChange={(e) => setIncome(toNum(e.target.value))}
          />
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            icon={DollarSign}
            label="Living expenses (monthly)"
            value={String(expenses)}
            onChange={(e) => setExpenses(toNum(e.target.value))}
          />
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            icon={DollarSign}
            label="Other repayments (monthly)"
            value={String(other)}
            onChange={(e) => setOther(toNum(e.target.value))}
            hint="Cards, personal and car loans"
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
            <span className="font-body text-caption text-fg-muted">Assessment buffer</span>
            <div className="overflow-x-auto">
              <SegmentedControl
                size="sm"
                aria-label="Serviceability assessment buffer"
                options={BUFFER_OPTIONS}
                value={buffer.toFixed(1)}
                onValueChange={(v) => setBuffer(Number(v))}
              />
            </div>
          </div>
        </div>

        {/* result */}
        <div className="flex flex-col gap-4 rounded-md border border-border-strong bg-accent-soft p-5">
          <div>
            <p className="font-mono text-caption uppercase tracking-[0.12em] text-accent-text">Estimated borrowing power</p>
            <AnimatedCurrency value={maxLoan} className="font-display text-display-md leading-none text-fg" />
            <p className="mt-1.5 font-body text-body-sm text-fg-muted">
              Assessed at <span className="tabular-nums text-fg">{pct1(assessRate)}</span> over {TERM_YEARS} years
            </p>
          </div>

          <div className="border-t border-border-strong/40 pt-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-caption uppercase tracking-[0.12em] text-fg-subtle">Monthly income</span>
              <span className="font-display text-title-sm tabular-nums text-fg">{aud0(income)}</span>
            </div>
            <div
              className="flex h-3 w-full overflow-hidden rounded-xs bg-surface"
              role="img"
              aria-label={`Of ${aud0(income)} income, ${aud0(expenses)} expenses, ${aud0(other)} other repayments, ${aud0(surplus)} surplus`}
            >
              <div
                className="h-full bg-border-strong transition-[width] duration-base ease-out motion-reduce:transition-none"
                style={{ width: w(expenses) }}
              />
              <div
                className="h-full bg-fg-subtle transition-[width] duration-base ease-out motion-reduce:transition-none"
                style={{ width: w(other) }}
              />
              <div
                className="h-full bg-accent transition-[width] duration-base ease-out motion-reduce:transition-none"
                style={{ width: w(surplus) }}
              />
            </div>
            <div className="mt-3.5 flex flex-col gap-2.5">
              <LegendRow swatch="bg-border-strong" label="Living expenses" figure={aud0(expenses)} />
              <LegendRow swatch="bg-fg-subtle" label="Other repayments" figure={aud0(other)} />
              <LegendRow swatch="bg-accent" label="Surplus for repayments" figure={aud0(surplus)} />
            </div>
          </div>
        </div>
      </div>

      <p className="font-body text-caption leading-relaxed text-fg-subtle">
        Indicative only — not a credit assessment or pre-approval. Your lender sets serviceability,
        buffers and acceptable expenses.
      </p>
    </div>
  )
}
