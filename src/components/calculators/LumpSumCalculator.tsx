/**
 * LumpSumCalculator — the effect of a one-off payment partway through the loan. Mirrors the
 * website's Lump sum tool: interest saved, time off, the balance just before and after the
 * payment, and the per-dollar efficiency. Validated against the site's example ($600k · 6.25% ·
 * 30yr · $25k after 2yr → ~$105.8k saved, ~3yr off, balance ~$585.5k → $560.5k). Maths in finance.ts.
 */
import * as React from 'react'
import { Coins, DollarSign, Percent, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CalcShell, ResultHeadline, MetricRow } from '@/components/calculators/CalcLayout'
import { periodicRepayment, amortise, balanceAfter, totalInterest, durationLabel, aud0, aud2, toNum } from '@/components/calculators/finance'

const DEFAULTS = { loan: 600000, rate: 6.25, term: 30, lump: 25000, after: 2 }

export function LumpSumCalculator() {
  const [loan, setLoan] = React.useState(DEFAULTS.loan)
  const [rate, setRate] = React.useState(DEFAULTS.rate)
  const [term, setTerm] = React.useState(DEFAULTS.term)
  const [lump, setLump] = React.useState(DEFAULTS.lump)
  const [after, setAfter] = React.useState(DEFAULTS.after)

  const base = periodicRepayment(loan, rate, term, 'monthly')
  const baseInterest = totalInterest(loan, rate, term, 'monthly')
  const afterPeriods = Math.round(after * 12)
  const withLump = amortise(loan, rate, base, 12, { lumpAmount: lump, lumpAfterPeriods: afterPeriods })
  const saved = Math.max(0, baseInterest - withLump.totalInterest)
  const monthsOff = Math.max(0, term * 12 - withLump.periods)
  const balBefore = balanceAfter(loan, rate, base, 12, afterPeriods)
  const balAfterLump = Math.max(0, balBefore - lump)
  const perDollar = lump > 0 ? saved / lump : 0

  const reset = () => {
    setLoan(DEFAULTS.loan)
    setRate(DEFAULTS.rate)
    setTerm(DEFAULTS.term)
    setLump(DEFAULTS.lump)
    setAfter(DEFAULTS.after)
  }

  return (
    <CalcShell
      Icon={Coins}
      title="Lump sum payment"
      subtitle="What a one-off payment does to the loan."
      onReset={reset}
      note="It does not consider whether the money is better in an offset, in super, or against higher-rate debt."
      inputs={
        <>
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Loan amount" value={String(loan)} onChange={(e) => setLoan(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} step={0.01} icon={Percent} label="Interest rate (p.a.)" value={String(rate)} onChange={(e) => setRate(toNum(e.target.value, 100))} />
          <Input type="number" inputMode="decimal" min={0} icon={Clock} label="Loan term (years)" value={String(term)} onChange={(e) => setTerm(toNum(e.target.value, 40))} />
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Lump sum" value={String(lump)} onChange={(e) => setLump(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} icon={Clock} label="Paid after (years)" value={String(after)} onChange={(e) => setAfter(toNum(e.target.value, 40))} hint="How far into the loan the payment is made." />
        </>
      }
      result={
        <>
          <ResultHeadline label="Interest saved" value={saved} />
          <MetricRow label="Time taken off the loan" figure={durationLabel(monthsOff, 12)} />
          <MetricRow label="Balance just before the payment" figure={aud0(balBefore)} />
          <MetricRow label="Balance just after" figure={aud0(balAfterLump)} />
          <MetricRow label="Loan now clears in" figure={durationLabel(withLump.periods, 12)} hint={`About ${aud2(perDollar)} saved in interest per dollar paid.`} />
        </>
      }
    />
  )
}
