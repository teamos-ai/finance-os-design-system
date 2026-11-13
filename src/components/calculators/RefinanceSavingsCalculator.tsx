/**
 * RefinanceSavingsCalculator — a rate difference netted off against the cost of switching. Mirrors
 * the website's Refinance savings tool: monthly saving, break-even on the switching cost, saving
 * over the remaining term, and what keeping the old repayment would do. Maths in finance.ts.
 */
import * as React from 'react'
import { RefreshCw, DollarSign, Percent, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CalcShell, ResultHeadline, MetricRow } from '@/components/calculators/CalcLayout'
import { periodicRepayment, amortise, durationLabel, aud0, aud2, toNum } from '@/components/calculators/finance'

const DEFAULTS = { balance: 550000, current: 6.75, next: 6.0, years: 25, cost: 1200 }

export function RefinanceSavingsCalculator() {
  const [balance, setBalance] = React.useState(DEFAULTS.balance)
  const [current, setCurrent] = React.useState(DEFAULTS.current)
  const [next, setNext] = React.useState(DEFAULTS.next)
  const [years, setYears] = React.useState(DEFAULTS.years)
  const [cost, setCost] = React.useState(DEFAULTS.cost)

  const curPay = periodicRepayment(balance, current, years, 'monthly')
  const newPay = periodicRepayment(balance, next, years, 'monthly')
  const monthlySaving = Math.max(0, curPay - newPay)
  const breakEven = monthlySaving > 0 ? Math.ceil(cost / monthlySaving) : 0
  const savedOverTerm = monthlySaving * years * 12 - cost
  const staySame = amortise(balance, next, curPay, 12)
  const staySameOff = Math.max(0, years * 12 - staySame.periods)

  const reset = () => {
    setBalance(DEFAULTS.balance); setCurrent(DEFAULTS.current); setNext(DEFAULTS.next); setYears(DEFAULTS.years); setCost(DEFAULTS.cost)
  }

  return (
    <CalcShell
      Icon={RefreshCw}
      title="Refinance savings"
      subtitle="A lower rate, net of the cost of switching."
      onReset={reset}
      note="It does not model a cashback, an introductory rate that reverts, or the ongoing package fee. Compare like for like."
      inputs={
        <>
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Current balance" value={String(balance)} onChange={(e) => setBalance(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} step={0.01} icon={Percent} label="Current rate (p.a.)" value={String(current)} onChange={(e) => setCurrent(toNum(e.target.value, 100))} />
          <Input type="number" inputMode="decimal" min={0} step={0.01} icon={Percent} label="New rate (p.a.)" value={String(next)} onChange={(e) => setNext(toNum(e.target.value, 100))} />
          <Input type="number" inputMode="decimal" min={0} icon={Clock} label="Years remaining" value={String(years)} onChange={(e) => setYears(toNum(e.target.value, 40))} />
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Cost of switching" value={String(cost)} onChange={(e) => setCost(toNum(e.target.value))} hint="Discharge, application, valuation and registration." />
        </>
      }
      result={
        <>
          <ResultHeadline label="Saved each month" value={monthlySaving} />
          <MetricRow label="Current repayment" figure={aud2(curPay)} />
          <MetricRow label="New repayment" figure={aud2(newPay)} />
          <MetricRow label="Break-even on the switching costs" figure={breakEven > 0 ? durationLabel(breakEven, 12) : '—'} />
          <MetricRow label="Saved over the remaining term, after costs" figure={aud0(savedOverTerm)} />
          <MetricRow label="If the repayment stays the same" figure={durationLabel(staySameOff, 12)} hint="Keeping the old repayment against the new rate takes this off the loan." />
        </>
      }
    />
  )
}
