/**
 * ExtraRepaymentsCalculator — what paying a little more each month does to a loan. Mirrors the
 * website's Extra repayments tool: interest saved, time taken off, and a before/after interest
 * comparison. Validated against the site's example ($600k · 6.25% · 30yr · $300 extra →
 * ~$157k saved, 24y 6m, interest with extra ~$572.5k). Maths in finance.ts.
 */
import * as React from 'react'
import { TrendingDown, DollarSign, Percent, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CalcShell, ResultHeadline, MetricRow, CompareBars } from '@/components/calculators/CalcLayout'
import { periodicRepayment, amortise, totalInterest, durationLabel, aud0, toNum } from '@/components/calculators/finance'

const DEFAULTS = { loan: 600000, rate: 6.25, term: 30, extra: 300 }

export function ExtraRepaymentsCalculator() {
  const [loan, setLoan] = React.useState(DEFAULTS.loan)
  const [rate, setRate] = React.useState(DEFAULTS.rate)
  const [term, setTerm] = React.useState(DEFAULTS.term)
  const [extra, setExtra] = React.useState(DEFAULTS.extra)

  const base = periodicRepayment(loan, rate, term, 'monthly')
  const baseInterest = totalInterest(loan, rate, term, 'monthly')
  const withExtra = amortise(loan, rate, base, 12, { extra })
  const saved = Math.max(0, baseInterest - withExtra.totalInterest)
  const monthsOff = Math.max(0, term * 12 - withExtra.periods)

  const reset = () => {
    setLoan(DEFAULTS.loan)
    setRate(DEFAULTS.rate)
    setTerm(DEFAULTS.term)
    setExtra(DEFAULTS.extra)
  }

  return (
    <CalcShell
      Icon={TrendingDown}
      title="Extra repayments"
      subtitle="What paying a little more each month saves."
      onReset={reset}
      note="It does not check whether your loan allows extra repayments."
      inputs={
        <>
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Loan amount" value={String(loan)} onChange={(e) => setLoan(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} step={0.01} icon={Percent} label="Interest rate (p.a.)" value={String(rate)} onChange={(e) => setRate(toNum(e.target.value, 100))} />
          <Input type="number" inputMode="decimal" min={0} icon={Clock} label="Loan term (years)" value={String(term)} onChange={(e) => setTerm(toNum(e.target.value, 40))} />
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Extra per month" value={String(extra)} onChange={(e) => setExtra(toNum(e.target.value))} hint="On top of the usual repayment." />
        </>
      }
      result={
        <>
          <ResultHeadline label="Interest saved" value={saved} />
          <MetricRow label="Time taken off the loan" figure={durationLabel(monthsOff, 12)} />
          <MetricRow label="Paid off in" figure={durationLabel(withExtra.periods, 12)} hint={`Instead of ${durationLabel(term * 12, 12)}.`} />
          <CompareBars
            a={{ label: 'Interest, as is', value: baseInterest, format: aud0 }}
            b={{ label: 'Interest, with the extra', value: withExtra.totalInterest, format: aud0 }}
          />
        </>
      }
    />
  )
}
