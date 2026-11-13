/**
 * LmiEstimateCalculator — an indicative lender's-mortgage-insurance band. LMI is priced by the
 * insurer against a confidential matrix, so no outside calculator can quote it; this is a band for
 * comparison, calibrated to published reference points. Mirrors the website's LMI tool. Validated
 * against its example ($750k · $75k dep → 90% LVR, ~$14,216; curve 85→$5,750, 95→$28,486). finance.ts.
 */
import * as React from 'react'
import { Umbrella, DollarSign } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CalcShell, ResultHeadline, MetricRow } from '@/components/calculators/CalcLayout'
import { lmiPremium, aud0, pct1, toNum } from '@/components/calculators/finance'

const DEFAULTS = { value: 750000, deposit: 75000 }

export function LmiEstimateCalculator() {
  const [value, setValue] = React.useState(DEFAULTS.value)
  const [deposit, setDeposit] = React.useState(DEFAULTS.deposit)

  const r = lmiPremium(value, deposit)

  const reset = () => {
    setValue(DEFAULTS.value)
    setDeposit(DEFAULTS.deposit)
  }

  return (
    <CalcShell
      Icon={Umbrella}
      title="Lender's mortgage insurance"
      subtitle="An indicative band — never a quote."
      onReset={reset}
      note="LMI is priced by the insurer against a confidential matrix. Some lenders self-insure, some waive it for particular professions, and some price it into the rate. The real premium can differ substantially."
      inputs={
        <>
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Property value" value={String(value)} onChange={(e) => setValue(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Deposit" value={String(deposit)} onChange={(e) => setDeposit(toNum(e.target.value))} hint={`Loan ${aud0(r.loan)} · LVR ${pct1(r.lvr)}`} />
        </>
      }
      result={
        <>
          <ResultHeadline label="Indicative premium" value={r.premium} />
          <MetricRow label="Loan to value ratio" figure={pct1(r.lvr)} />
          <MetricRow label="Loan amount" figure={aud0(r.loan)} />
          <MetricRow
            label="Extra deposit to reach 80%"
            figure={r.extraDepositFor80 > 0 ? aud0(r.extraDepositFor80) : '—'}
            hint={r.extraDepositFor80 > 0 ? 'At 80% most lenders charge no premium.' : 'Already at or under 80% — none applies.'}
          />
          <div className="flex flex-col gap-2 border-t border-border-strong/40 pt-3">
            <span className="font-mono text-caption uppercase tracking-[0.12em] text-fg-subtle">Indicative band</span>
            {r.curve.map((p) => (
              <div key={p.lvr} className="flex items-baseline justify-between gap-3">
                <span className="font-body text-body-sm text-fg-muted">At {p.lvr}% LVR</span>
                <span className="font-display text-title-sm tabular-nums text-fg">{aud0(p.premium)}</span>
              </div>
            ))}
          </div>
        </>
      }
    />
  )
}
