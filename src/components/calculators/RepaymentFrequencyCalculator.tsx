/**
 * RepaymentFrequencyCalculator — why paying half the monthly repayment every fortnight clears a
 * loan years early (26 fortnights = 13 monthly repayments a year). Mirrors the website's tool:
 * interest saved, the fortnightly amount, and the new payoff time. Validated against the site's
 * example ($600k · 6.25% · 30yr → fortnightly $1,847.15, clears ~24y 4m, ~$162k saved). finance.ts.
 */
import * as React from 'react'
import { CalendarClock, DollarSign, Percent, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CalcShell, ResultHeadline, MetricRow } from '@/components/calculators/CalcLayout'
import { periodicRepayment, amortise, totalInterest, durationLabel, aud0, aud2, toNum } from '@/components/calculators/finance'

const DEFAULTS = { loan: 600000, rate: 6.25, term: 30 }

export function RepaymentFrequencyCalculator() {
  const [loan, setLoan] = React.useState(DEFAULTS.loan)
  const [rate, setRate] = React.useState(DEFAULTS.rate)
  const [term, setTerm] = React.useState(DEFAULTS.term)

  const monthly = periodicRepayment(loan, rate, term, 'monthly')
  const monthlyInterest = totalInterest(loan, rate, term, 'monthly')
  const fortnightly = monthly / 2
  const fort = amortise(loan, rate, fortnightly, 26)
  const saved = Math.max(0, monthlyInterest - fort.totalInterest)

  const reset = () => {
    setLoan(DEFAULTS.loan)
    setRate(DEFAULTS.rate)
    setTerm(DEFAULTS.term)
  }

  return (
    <CalcShell
      Icon={CalendarClock}
      title="Repayment frequency"
      subtitle="Why fortnightly clears a loan earlier than monthly."
      onReset={reset}
      note="It only works where the lender applies each payment on receipt — some hold and apply monthly."
      inputs={
        <>
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Loan amount" value={String(loan)} onChange={(e) => setLoan(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} step={0.01} icon={Percent} label="Interest rate (p.a.)" value={String(rate)} onChange={(e) => setRate(toNum(e.target.value, 100))} />
          <Input type="number" inputMode="decimal" min={0} icon={Clock} label="Loan term (years)" value={String(term)} onChange={(e) => setTerm(toNum(e.target.value, 40))} />
        </>
      }
      result={
        <>
          <ResultHeadline label="Interest saved by paying fortnightly" value={saved} />
          <MetricRow label="Monthly repayment" figure={aud2(monthly)} />
          <MetricRow label="Half that, paid fortnightly" figure={aud2(fortnightly)} />
          <MetricRow label="Loan clears in" figure={durationLabel(fort.periods, 26)} hint={`Instead of ${durationLabel(term * 12, 12)}.`} />
          <MetricRow label="Extra paid each year" figure={aud0(monthly)} hint="One additional monthly repayment a year." />
        </>
      }
    />
  )
}
