/**
 * SplitLoanCalculator — a part-fixed, part-variable blend: the total repayment, the blended rate,
 * and what a rate rise does to the variable portion only. Mirrors the website's Split loan tool.
 * Maths in finance.ts.
 */
import * as React from 'react'
import { Split, DollarSign, Percent, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CalcShell, ResultHeadline, MetricRow, CompareBars } from '@/components/calculators/CalcLayout'
import { periodicRepayment, aud0, aud2, pct1, pct2, toNum } from '@/components/calculators/finance'

const DEFAULTS = { loan: 600000, term: 30, shareFixed: 50, fixed: 5.89, variable: 6.29 }

export function SplitLoanCalculator() {
  const [loan, setLoan] = React.useState(DEFAULTS.loan)
  const [term, setTerm] = React.useState(DEFAULTS.term)
  const [shareFixed, setShareFixed] = React.useState(DEFAULTS.shareFixed)
  const [fixed, setFixed] = React.useState(DEFAULTS.fixed)
  const [variable, setVariable] = React.useState(DEFAULTS.variable)

  const fixedAmt = (loan * shareFixed) / 100
  const varAmt = Math.max(0, loan - fixedAmt)
  const fixedPay = periodicRepayment(fixedAmt, fixed, term, 'monthly')
  const varPay = periodicRepayment(varAmt, variable, term, 'monthly')
  const total = fixedPay + varPay
  const blended = loan > 0 ? (fixed * fixedAmt + variable * varAmt) / loan : 0
  const stress = fixedPay + periodicRepayment(varAmt, variable + 1, term, 'monthly')

  const reset = () => {
    setLoan(DEFAULTS.loan); setTerm(DEFAULTS.term); setShareFixed(DEFAULTS.shareFixed); setFixed(DEFAULTS.fixed); setVariable(DEFAULTS.variable)
  }

  return (
    <CalcShell
      Icon={Split}
      title="Split loan"
      subtitle="Part fixed, part variable — the blend and the risk."
      onReset={reset}
      note="It does not model the revert rate at the end of the fixed period, and offset usually attaches only to the variable portion."
      inputs={
        <>
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Loan amount" value={String(loan)} onChange={(e) => setLoan(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} icon={Clock} label="Loan term (years)" value={String(term)} onChange={(e) => setTerm(toNum(e.target.value, 40))} />
          <Input type="number" inputMode="decimal" min={0} step={1} icon={Percent} label="Share fixed" value={String(shareFixed)} onChange={(e) => setShareFixed(toNum(e.target.value, 100))} />
          <Input type="number" inputMode="decimal" min={0} step={0.01} icon={Percent} label="Fixed rate (p.a.)" value={String(fixed)} onChange={(e) => setFixed(toNum(e.target.value, 100))} />
          <Input type="number" inputMode="decimal" min={0} step={0.01} icon={Percent} label="Variable rate (p.a.)" value={String(variable)} onChange={(e) => setVariable(toNum(e.target.value, 100))} />
        </>
      }
      result={
        <>
          <ResultHeadline label="Total repayment" display={aud2(total)} suffix="/ month" />
          <MetricRow label="Fixed portion" figure={aud0(fixedAmt)} hint={`${aud2(fixedPay)} a month at ${pct1(fixed)}.`} />
          <MetricRow label="Variable portion" figure={aud0(varAmt)} hint={`${aud2(varPay)} a month at ${pct1(variable)}.`} />
          <MetricRow label="Blended rate" figure={pct2(blended)} />
          <MetricRow label="If rates rise one percentage point" figure={aud2(stress)} hint="Only the variable portion moves." />
          <CompareBars
            a={{ label: 'Fixed', value: fixedAmt, format: aud0 }}
            b={{ label: 'Variable', value: varAmt, format: aud0 }}
          />
        </>
      }
    />
  )
}
