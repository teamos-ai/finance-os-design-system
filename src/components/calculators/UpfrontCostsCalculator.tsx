/**
 * UpfrontCostsCalculator — the cash due at settlement beyond the deposit. Mirrors the website's
 * Upfront purchase costs. Validated against its example (NSW · $750k · $150k dep, not first-home →
 * cash beyond deposit $31,287, stamp duty $27,937, LMI $0 at 80%, total cash $181,287). finance.ts.
 */
import * as React from 'react'
import { Receipt, DollarSign } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { SegmentedControl } from '@/components/ui/segmented'
import { CalcShell, ResultHeadline, MetricRow } from '@/components/calculators/CalcLayout'
import { stampDuty, firstHomeDuty, lmiPremium, STATES, aud0, toNum, type StateCode } from '@/components/calculators/finance'

const STATE_OPTIONS = STATES.map((s) => ({ value: s, label: s }))
const FHB_OPTIONS = [
  { value: 'no', label: 'No' },
  { value: 'yes', label: 'Yes' },
]
const CONVEYANCING = 2200
const INSPECTION = 800
const REGISTRATION = 350

export function UpfrontCostsCalculator() {
  const [price, setPrice] = React.useState(750000)
  const [deposit, setDeposit] = React.useState(150000)
  const [state, setState] = React.useState<StateCode>('NSW')
  const [firstHome, setFirstHome] = React.useState('no')

  const loan = Math.max(0, price - deposit)
  const duty = firstHome === 'yes' ? firstHomeDuty(state, price).duty : stampDuty(state, price).duty
  const lmi = lmiPremium(price, deposit).premium
  const cashBeyond = duty + lmi + CONVEYANCING + INSPECTION + REGISTRATION
  const totalCash = deposit + cashBeyond

  const reset = () => {
    setPrice(750000); setDeposit(150000); setState('NSW'); setFirstHome('no')
  }

  return (
    <CalcShell
      Icon={Receipt}
      title="Upfront purchase costs"
      subtitle="The cash due at settlement, beyond the deposit."
      onReset={reset}
      note="It excludes foreign-purchaser surcharges, off-the-plan and pensioner concessions, strata disbursements, and any lender fee."
      inputs={
        <>
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Property price" value={String(price)} onChange={(e) => setPrice(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Deposit" value={String(deposit)} onChange={(e) => setDeposit(toNum(e.target.value))} hint={`Loan ${aud0(loan)}`} />
          <div className="flex flex-col gap-1.5">
            <span className="font-body text-caption text-fg-muted">State or territory</span>
            <div className="overflow-x-auto">
              <SegmentedControl size="sm" aria-label="State or territory" options={STATE_OPTIONS} value={state} onValueChange={(v) => setState(v as StateCode)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-body text-caption text-fg-muted">First home buyer</span>
            <SegmentedControl size="sm" aria-label="First home buyer" options={FHB_OPTIONS} value={firstHome} onValueChange={(v) => setFirstHome(v)} />
          </div>
        </>
      }
      result={
        <>
          <ResultHeadline label="Cash needed beyond the deposit" value={cashBeyond} />
          <MetricRow label="Stamp duty" figure={aud0(duty)} />
          <MetricRow label="Lender's mortgage insurance, indicative" figure={aud0(lmi)} hint={lmi <= 0 ? 'At or below 80% of value, so none applies.' : 'Indicative band — not a quote.'} />
          <MetricRow label="Conveyancing and legals" figure={aud0(CONVEYANCING)} />
          <MetricRow label="Building and pest inspection" figure={aud0(INSPECTION)} />
          <MetricRow label="Transfer registration" figure={aud0(REGISTRATION)} />
          <MetricRow label="Loan required" figure={aud0(loan)} />
          <MetricRow label="Total cash at settlement" figure={aud0(totalCash)} />
        </>
      }
    />
  )
}
