/**
 * LvrCalculator — loan-to-value ratio, the number a lender looks at first (it sets whether LMI
 * applies and often the rate). Mirrors the website's LVR tool. Validated against its example
 * ($750k · $150k → 80.0% LVR, $600k loan, 20% deposit share). Maths in finance.ts.
 */
import * as React from 'react'
import { Percent, DollarSign, AlertTriangle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CalcShell, ResultHeadline, MetricRow } from '@/components/calculators/CalcLayout'
import { aud0, pct1, toNum } from '@/components/calculators/finance'

const DEFAULTS = { value: 750000, deposit: 150000 }

export function LvrCalculator() {
  const [value, setValue] = React.useState(DEFAULTS.value)
  const [deposit, setDeposit] = React.useState(DEFAULTS.deposit)

  const loan = Math.max(0, value - deposit)
  const lvr = value > 0 ? (loan / value) * 100 : 0
  const depositShare = value > 0 ? (deposit / value) * 100 : 0
  const depositFor80 = value * 0.2
  const diff = Math.max(0, depositFor80 - deposit)

  const reset = () => {
    setValue(DEFAULTS.value)
    setDeposit(DEFAULTS.deposit)
  }

  return (
    <CalcShell
      Icon={Percent}
      title="Loan to value ratio"
      subtitle="The number a lender looks at first."
      onReset={reset}
      note="It excludes any mortgage-insurance premium added to the balance, which pushes the real LVR higher."
      inputs={
        <>
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Property value" value={String(value)} onChange={(e) => setValue(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Deposit" value={String(deposit)} onChange={(e) => setDeposit(toNum(e.target.value))} />
          {lvr > 80 ? (
            <Badge variant="amber" size="sm">
              <AlertTriangle className="h-3 w-3" strokeWidth={2.25} aria-hidden />
              Above 80% — LMI with most lenders
            </Badge>
          ) : (
            <Badge variant="success" size="sm">At or under 80% — no LMI with most lenders</Badge>
          )}
        </>
      }
      result={
        <>
          <ResultHeadline label="Loan to value ratio" display={pct1(lvr)} />
          <MetricRow label="Loan amount" figure={aud0(loan)} />
          <MetricRow label="Deposit as a share of value" figure={pct1(depositShare)} />
          <MetricRow label="Deposit needed for 80%" figure={aud0(depositFor80)} />
          <MetricRow label="Difference" figure={diff > 0 ? aud0(diff) : '—'} hint={diff > 0 ? 'More deposit to avoid mortgage insurance.' : 'Already at or under 80%.'} />
        </>
      }
    />
  )
}
