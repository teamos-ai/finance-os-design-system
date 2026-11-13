/**
 * DepositSavingsGoalCalculator — how long to save the deposit plus the costs on top (stamp duty,
 * conveyancing). Mirrors the website's Deposit savings goal. Validated against its example (NSW ·
 * $750k · 20% · $40k saved · $2k/mo → deposit $150k, duty $27,937, total to save $180,937, loan
 * $600k). Maths in finance.ts; the time-to-save grows savings at the return each month.
 */
import * as React from 'react'
import { Target, DollarSign, Percent } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { SegmentedControl } from '@/components/ui/segmented'
import { CalcShell, ResultHeadline, MetricRow } from '@/components/calculators/CalcLayout'
import { stampDuty, STATES, durationLabel, aud0, toNum, type StateCode } from '@/components/calculators/finance'

const STATE_OPTIONS = STATES.map((s) => ({ value: s, label: s }))
const CONVEYANCING = 3000

/** Months to grow `saved` (plus `perMonth` contributions) to `target` at an annual return. */
function monthsToSave(saved: number, perMonth: number, annualReturnPct: number, target: number): number {
  if (saved >= target) return 0
  const r = annualReturnPct / 100 / 12
  let balance = saved
  let m = 0
  while (balance < target && m < 1200) {
    balance = balance * (1 + r) + perMonth
    m++
    if (perMonth <= 0 && r <= 0) break
  }
  return m
}

export function DepositSavingsGoalCalculator() {
  const [price, setPrice] = React.useState(750000)
  const [depositPct, setDepositPct] = React.useState(20)
  const [saved, setSaved] = React.useState(40000)
  const [perMonth, setPerMonth] = React.useState(2000)
  const [returnPct, setReturnPct] = React.useState(4)
  const [state, setState] = React.useState<StateCode>('NSW')

  const depositTarget = (price * depositPct) / 100
  const duty = stampDuty(state, price).duty
  const totalToSave = depositTarget + duty + CONVEYANCING
  const stillToGo = Math.max(0, totalToSave - saved)
  const loan = Math.max(0, price - depositTarget)
  const months = monthsToSave(saved, perMonth, returnPct, totalToSave)

  const reset = () => {
    setPrice(750000); setDepositPct(20); setSaved(40000); setPerMonth(2000); setReturnPct(4); setState('NSW')
  }

  return (
    <CalcShell
      Icon={Target}
      title="Deposit savings goal"
      subtitle="Time to the deposit, plus the costs on top."
      onReset={reset}
      note="It does not model a first-home concession, a grant, a guarantor or a gift."
      inputs={
        <>
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Target property price" value={String(price)} onChange={(e) => setPrice(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} step={1} icon={Percent} label="Deposit target" value={String(depositPct)} onChange={(e) => setDepositPct(toNum(e.target.value, 100))} hint="20% avoids LMI with most lenders." />
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Saved so far" value={String(saved)} onChange={(e) => setSaved(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Saving each month" value={String(perMonth)} onChange={(e) => setPerMonth(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} step={0.1} icon={Percent} label="Return on savings (p.a.)" value={String(returnPct)} onChange={(e) => setReturnPct(toNum(e.target.value, 100))} />
          <div className="flex flex-col gap-1.5">
            <span className="font-body text-caption text-fg-muted">State or territory</span>
            <div className="overflow-x-auto">
              <SegmentedControl size="sm" aria-label="State or territory" options={STATE_OPTIONS} value={state} onValueChange={(v) => setState(v as StateCode)} />
            </div>
          </div>
        </>
      }
      result={
        <>
          <ResultHeadline label="Time to the full amount" display={months > 0 ? durationLabel(months, 12) : 'Saved'} />
          <MetricRow label="Deposit target" figure={aud0(depositTarget)} />
          <MetricRow label="Stamp duty, general rate" figure={aud0(duty)} />
          <MetricRow label="Allowance for conveyancing and searches" figure={aud0(CONVEYANCING)} />
          <MetricRow label="Total to save" figure={aud0(totalToSave)} />
          <MetricRow label="Still to go" figure={aud0(stillToGo)} />
          <MetricRow label="Loan you would then need" figure={aud0(loan)} />
        </>
      }
    />
  )
}
