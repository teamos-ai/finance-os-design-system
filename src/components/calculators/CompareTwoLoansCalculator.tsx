/**
 * CompareTwoLoansCalculator — two loans against the same balance and term, annual fees included.
 * Mirrors the website's Compare two loans tool: the cheaper loan over the term, each repayment and
 * total cost, and the difference. The cheaper rate is not always the cheaper loan. Maths in finance.ts.
 */
import * as React from 'react'
import { GitCompare, DollarSign, Percent, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CalcShell, ResultHeadline, MetricRow, CompareBars } from '@/components/calculators/CalcLayout'
import { periodicRepayment, aud0, aud2, toNum } from '@/components/calculators/finance'

const DEFAULTS = { loan: 600000, term: 30, rateA: 6.0, feeA: 395, rateB: 6.15, feeB: 0 }

export function CompareTwoLoansCalculator() {
  const [loan, setLoan] = React.useState(DEFAULTS.loan)
  const [term, setTerm] = React.useState(DEFAULTS.term)
  const [rateA, setRateA] = React.useState(DEFAULTS.rateA)
  const [feeA, setFeeA] = React.useState(DEFAULTS.feeA)
  const [rateB, setRateB] = React.useState(DEFAULTS.rateB)
  const [feeB, setFeeB] = React.useState(DEFAULTS.feeB)

  const payA = periodicRepayment(loan, rateA, term, 'monthly')
  const payB = periodicRepayment(loan, rateB, term, 'monthly')
  const totalA = payA * term * 12 + feeA * term
  const totalB = payB * term * 12 + feeB * term
  const cheaper = totalA <= totalB ? 'A' : 'B'
  const diff = Math.abs(totalA - totalB)

  const reset = () => {
    setLoan(DEFAULTS.loan); setTerm(DEFAULTS.term); setRateA(DEFAULTS.rateA); setFeeA(DEFAULTS.feeA); setRateB(DEFAULTS.rateB); setFeeB(DEFAULTS.feeB)
  }

  return (
    <CalcShell
      Icon={GitCompare}
      title="Compare two loans"
      subtitle="The cheaper rate is not always the cheaper loan."
      onReset={reset}
      note="It ignores features that carry real value — a genuine offset, free redraw, portability — and any upfront or discharge cost."
      inputs={
        <>
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Loan amount" value={String(loan)} onChange={(e) => setLoan(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} icon={Clock} label="Loan term (years)" value={String(term)} onChange={(e) => setTerm(toNum(e.target.value, 40))} />
          <Input type="number" inputMode="decimal" min={0} step={0.01} icon={Percent} label="Loan A rate (p.a.)" value={String(rateA)} onChange={(e) => setRateA(toNum(e.target.value, 100))} />
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Loan A annual fee" value={String(feeA)} onChange={(e) => setFeeA(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} step={0.01} icon={Percent} label="Loan B rate (p.a.)" value={String(rateB)} onChange={(e) => setRateB(toNum(e.target.value, 100))} />
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Loan B annual fee" value={String(feeB)} onChange={(e) => setFeeB(toNum(e.target.value))} />
        </>
      }
      result={
        <>
          <ResultHeadline label={`Cheaper over ${term} years`} display={`Loan ${cheaper}, by ${aud0(diff)}`} />
          <MetricRow label="Loan A repayment" figure={aud2(payA)} hint={feeA > 0 ? `Plus ${aud0(feeA)} a year in fees.` : 'No annual fee.'} />
          <MetricRow label="Loan B repayment" figure={aud2(payB)} hint={feeB > 0 ? `Plus ${aud0(feeB)} a year in fees.` : 'No annual fee.'} />
          <MetricRow label="Difference in repayment" figure={aud2(Math.abs(payA - payB))} />
          <CompareBars
            a={{ label: 'Loan A total cost', value: totalA, format: aud0 }}
            b={{ label: 'Loan B total cost', value: totalB, format: aud0 }}
          />
        </>
      }
    />
  )
}
