/**
 * OffsetCalculator — what an average offset balance saves over the life of the loan. Mirrors the
 * website's Offset account tool: interest saved, time off, first-year saving, and the equivalent
 * after-tax return. Validated against the site's example ($600k · 6.25% · 30yr · $40k offset →
 * ~$181.8k saved, ~4y 1m, first year $2,500, equivalent 6.25%). Maths in finance.ts.
 */
import * as React from 'react'
import { PiggyBank, DollarSign, Percent, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CalcShell, ResultHeadline, MetricRow, CompareBars } from '@/components/calculators/CalcLayout'
import { periodicRepayment, amortise, totalInterest, durationLabel, aud0, pct1, toNum } from '@/components/calculators/finance'

const DEFAULTS = { loan: 600000, rate: 6.25, term: 30, offset: 40000 }

export function OffsetCalculator() {
  const [loan, setLoan] = React.useState(DEFAULTS.loan)
  const [rate, setRate] = React.useState(DEFAULTS.rate)
  const [term, setTerm] = React.useState(DEFAULTS.term)
  const [offset, setOffset] = React.useState(DEFAULTS.offset)

  const base = periodicRepayment(loan, rate, term, 'monthly')
  const baseInterest = totalInterest(loan, rate, term, 'monthly')
  const withOffset = amortise(loan, rate, base, 12, { offset })
  const saved = Math.max(0, baseInterest - withOffset.totalInterest)
  const monthsOff = Math.max(0, term * 12 - withOffset.periods)
  const firstYearSaved = (offset * rate) / 100

  const reset = () => {
    setLoan(DEFAULTS.loan)
    setRate(DEFAULTS.rate)
    setTerm(DEFAULTS.term)
    setOffset(DEFAULTS.offset)
  }

  return (
    <CalcShell
      Icon={PiggyBank}
      title="Offset account"
      subtitle="What a balance sitting in offset is worth."
      onReset={reset}
      note="It does not account for the package or account fee most offset products carry."
      inputs={
        <>
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Loan amount" value={String(loan)} onChange={(e) => setLoan(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} step={0.01} icon={Percent} label="Interest rate (p.a.)" value={String(rate)} onChange={(e) => setRate(toNum(e.target.value, 100))} />
          <Input type="number" inputMode="decimal" min={0} icon={Clock} label="Loan term (years)" value={String(term)} onChange={(e) => setTerm(toNum(e.target.value, 40))} />
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Average offset balance" value={String(offset)} onChange={(e) => setOffset(toNum(e.target.value))} />
        </>
      }
      result={
        <>
          <ResultHeadline label="Interest saved" value={saved} />
          <MetricRow label="Time taken off the loan" figure={durationLabel(monthsOff, 12)} />
          <MetricRow label="First-year interest saved" figure={aud0(firstYearSaved)} />
          <MetricRow label="Equivalent after-tax return" figure={pct1(rate)} hint="The offset saving is not taxed — an investment must beat this after tax to win." />
          <CompareBars
            a={{ label: 'Interest, no offset', value: baseInterest, format: aud0 }}
            b={{ label: 'Interest, with offset', value: withOffset.totalInterest, format: aud0 }}
          />
        </>
      }
    />
  )
}
