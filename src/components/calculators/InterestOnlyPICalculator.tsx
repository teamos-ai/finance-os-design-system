/**
 * InterestOnlyPICalculator — interest-only for a period, then the jump when it reverts to
 * principal and interest. Mirrors the website's tool: the repayment during IO, the reverted
 * repayment, the step up, and the total-cost comparison. Validated against the site's example
 * ($600k · 6.25% · 30yr · 5yr IO → IO $3,125.00, reverts to $3,958.02, step $833.02 (~27%),
 * P&I throughout $3,694.30, total IO-first ~$1.375m vs ~$1.330m). Maths in finance.ts.
 */
import * as React from 'react'
import { Scale, DollarSign, Percent, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CalcShell, ResultHeadline, MetricRow, CompareBars } from '@/components/calculators/CalcLayout'
import { periodicRepayment, aud0, aud2, toNum } from '@/components/calculators/finance'

const DEFAULTS = { loan: 600000, rate: 6.25, term: 30, io: 5 }

export function InterestOnlyPICalculator() {
  const [loan, setLoan] = React.useState(DEFAULTS.loan)
  const [rate, setRate] = React.useState(DEFAULTS.rate)
  const [term, setTerm] = React.useState(DEFAULTS.term)
  const [io, setIo] = React.useState(DEFAULTS.io)

  const ioYears = Math.min(io, Math.max(0, term - 1))
  const ioPayment = (loan * (rate / 100)) / 12
  const remaining = Math.max(1, term - ioYears)
  const revert = periodicRepayment(loan, rate, remaining, 'monthly')
  const step = Math.max(0, revert - ioPayment)
  const stepPct = ioPayment > 0 ? Math.round((step / ioPayment) * 100) : 0
  const pi = periodicRepayment(loan, rate, term, 'monthly')
  const totalIO = ioPayment * ioYears * 12 + revert * remaining * 12
  const totalPI = pi * term * 12
  const extra = Math.max(0, totalIO - totalPI)

  const reset = () => {
    setLoan(DEFAULTS.loan)
    setRate(DEFAULTS.rate)
    setTerm(DEFAULTS.term)
    setIo(DEFAULTS.io)
  }

  return (
    <CalcShell
      Icon={Scale}
      title="Interest only vs principal & interest"
      subtitle="The lower repayment now, against the cost over the term."
      onReset={reset}
      note="It says nothing about the tax treatment of an investment loan, often the main reason for interest-only."
      inputs={
        <>
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Loan amount" value={String(loan)} onChange={(e) => setLoan(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} step={0.01} icon={Percent} label="Interest rate (p.a.)" value={String(rate)} onChange={(e) => setRate(toNum(e.target.value, 100))} />
          <Input type="number" inputMode="decimal" min={0} icon={Clock} label="Loan term (years)" value={String(term)} onChange={(e) => setTerm(toNum(e.target.value, 40))} />
          <Input type="number" inputMode="decimal" min={0} icon={Clock} label="Interest-only period (years)" value={String(io)} onChange={(e) => setIo(toNum(e.target.value, 15))} />
        </>
      }
      result={
        <>
          <ResultHeadline label="The step up when it reverts" display={aud2(step)} suffix="/ month" />
          <MetricRow label="That is a rise of" figure={`${stepPct}%`} hint="On one day, when the interest-only period ends." />
          <MetricRow label="Repayment during interest only" figure={aud2(ioPayment)} />
          <MetricRow label="Repayment once it reverts" figure={aud2(revert)} />
          <MetricRow label="P&I throughout instead" figure={aud2(pi)} />
          <CompareBars
            a={{ label: 'Total, P&I throughout', value: totalPI, format: aud0 }}
            b={{ label: 'Total, IO then P&I', value: totalIO, format: aud0 }}
          />
          <MetricRow label="Extra paid for the interest-only period" figure={aud0(extra)} />
        </>
      }
    />
  )
}
