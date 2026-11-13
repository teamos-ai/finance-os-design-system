/**
 * FixedVsVariableCalculator — nobody can forecast rates, but the break-even can be worked out.
 * Mirrors the website's Fixed vs variable tool: interest over the fixed period each way, the
 * repayments, and the average variable rate at which fixing breaks even. Maths in finance.ts.
 */
import * as React from 'react'
import { Lock, DollarSign, Percent, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CalcShell, ResultHeadline, MetricRow, CompareBars } from '@/components/calculators/CalcLayout'
import { periodicRepayment, interestOverPeriods, aud0, aud2, pct1, toNum } from '@/components/calculators/finance'

const DEFAULTS = { loan: 600000, term: 30, fixed: 5.89, fixedFor: 3, variable: 6.29 }

export function FixedVsVariableCalculator() {
  const [loan, setLoan] = React.useState(DEFAULTS.loan)
  const [term, setTerm] = React.useState(DEFAULTS.term)
  const [fixed, setFixed] = React.useState(DEFAULTS.fixed)
  const [fixedFor, setFixedFor] = React.useState(DEFAULTS.fixedFor)
  const [variable, setVariable] = React.useState(DEFAULTS.variable)

  const fixedPay = periodicRepayment(loan, fixed, term, 'monthly')
  const varPay = periodicRepayment(loan, variable, term, 'monthly')
  const periods = Math.round(fixedFor * 12)
  const fixedInterest = interestOverPeriods(loan, fixed, fixedPay, 12, periods)
  const varInterest = interestOverPeriods(loan, variable, varPay, 12, periods)
  const saves = varInterest - fixedInterest
  const monthlyDiff = varPay - fixedPay

  const reset = () => {
    setLoan(DEFAULTS.loan); setTerm(DEFAULTS.term); setFixed(DEFAULTS.fixed); setFixedFor(DEFAULTS.fixedFor); setVariable(DEFAULTS.variable)
  }

  return (
    <CalcShell
      Icon={Lock}
      title="Fixed vs variable"
      subtitle="The break-even, over the fixed period."
      onReset={reset}
      note="It cannot forecast rates, and it does not price the break cost, the extra-repayment cap or the loss of a full offset."
      inputs={
        <>
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Loan amount" value={String(loan)} onChange={(e) => setLoan(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} icon={Clock} label="Loan term (years)" value={String(term)} onChange={(e) => setTerm(toNum(e.target.value, 40))} />
          <Input type="number" inputMode="decimal" min={0} step={0.01} icon={Percent} label="Fixed rate (p.a.)" value={String(fixed)} onChange={(e) => setFixed(toNum(e.target.value, 100))} />
          <Input type="number" inputMode="decimal" min={0} icon={Clock} label="Fixed for (years)" value={String(fixedFor)} onChange={(e) => setFixedFor(toNum(e.target.value, 15))} />
          <Input type="number" inputMode="decimal" min={0} step={0.01} icon={Percent} label="Variable rate today (p.a.)" value={String(variable)} onChange={(e) => setVariable(toNum(e.target.value, 100))} />
        </>
      }
      result={
        <>
          <ResultHeadline
            label={`Over the ${fixedFor}-year fixed period`}
            display={saves >= 0 ? `Fixing saves ${aud0(saves)}` : `Variable saves ${aud0(-saves)}`}
          />
          <MetricRow label="Fixed repayment" figure={aud2(fixedPay)} />
          <MetricRow label="Variable repayment today" figure={aud2(varPay)} hint={`${aud2(Math.abs(monthlyDiff))} a month ${monthlyDiff >= 0 ? 'more' : 'less'}.`} />
          <MetricRow label="Break-even average variable rate" figure={pct1(fixed)} hint="If the variable rate averages above this across the period, fixing was cheaper." />
          <MetricRow label="Rate gap today" figure={pct1(variable - fixed)} />
          <CompareBars
            a={{ label: 'Interest, variable at today’s rate', value: varInterest, format: aud0 }}
            b={{ label: 'Interest, fixed', value: fixedInterest, format: aud0 }}
          />
        </>
      }
    />
  )
}
