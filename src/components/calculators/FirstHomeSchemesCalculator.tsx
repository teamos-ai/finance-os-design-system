/**
 * FirstHomeSchemesCalculator — reports whether a purchase sits under the First Home Guarantee (5%
 * Deposit Scheme) price cap, and the first-home stamp-duty saving. Mirrors the website's First home
 * scheme check. It reports; it does not decide eligibility. Validated against the site's example
 * (NSW · $700k → under the $1.5m cap, first-home duty $0 vs general $25,687). finance.ts.
 */
import * as React from 'react'
import { KeyRound, DollarSign } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { SegmentedControl } from '@/components/ui/segmented'
import { CalcShell, ResultHeadline, MetricRow } from '@/components/calculators/CalcLayout'
import { FHG_CAPS, firstHomeDuty, stampDuty, STATES, aud0, toNum, type StateCode } from '@/components/calculators/finance'

const STATE_OPTIONS = STATES.map((s) => ({ value: s, label: s }))
const REGION_OPTIONS = [
  { value: 'city', label: 'Capital / regional centre' },
  { value: 'rest', label: 'Rest of state' },
]
const STATUS: Record<string, string> = {
  exempt: 'Full first-home exemption at this price.',
  concession: 'A concession applies in this band — indicative; confirm the amount.',
  general: 'Above the concession threshold — general rate applies.',
  none: 'No first-home duty relief for established homes in this state.',
}

export function FirstHomeSchemesCalculator() {
  const [price, setPrice] = React.useState(700000)
  const [state, setState] = React.useState<StateCode>('NSW')
  const [region, setRegion] = React.useState('city')

  const cap = region === 'city' ? FHG_CAPS[state].city : FHG_CAPS[state].rest
  const underCap = price <= cap
  const fh = firstHomeDuty(state, price)
  const general = stampDuty(state, price).duty
  const saving = Math.max(0, general - fh.duty)

  const reset = () => {
    setPrice(700000)
    setState('NSW')
    setRegion('city')
  }

  return (
    <CalcShell
      Icon={KeyRound}
      title="First home scheme check"
      subtitle="Price cap and first-home duty — this reports, it doesn't decide."
      onReset={reset}
      note="Eligibility also turns on residency, whether either buyer has owned property before, and living in the home. Since 1 Oct 2025 the scheme has no income test and no place limit. This cannot tell anyone they are eligible."
      inputs={
        <>
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Property price" value={String(price)} onChange={(e) => setPrice(toNum(e.target.value))} />
          <div className="flex flex-col gap-1.5">
            <span className="font-body text-caption text-fg-muted">State or territory</span>
            <div className="overflow-x-auto">
              <SegmentedControl size="sm" aria-label="State or territory" options={STATE_OPTIONS} value={state} onValueChange={(v) => setState(v as StateCode)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-body text-caption text-fg-muted">Location</span>
            <div className="overflow-x-auto">
              <SegmentedControl size="sm" aria-label="Location within the state" options={REGION_OPTIONS} value={region} onValueChange={(v) => setRegion(v)} />
            </div>
          </div>
        </>
      }
      result={
        <>
          <ResultHeadline label="5% Deposit Scheme" display={`${underCap ? 'Under' : 'Over'} the ${aud0(cap)} cap`} />
          <MetricRow label="Price cap here" figure={aud0(cap)} hint={region === 'city' ? 'Capital city / regional centre.' : 'Everywhere else in the state.'} />
          <MetricRow label="Stamp duty, first home" figure={aud0(fh.duty)} hint={STATUS[fh.status]} />
          <MetricRow label="Stamp duty, general rate" figure={aud0(general)} />
          <MetricRow label="First-home duty saving" figure={saving > 0 ? aud0(saving) : '—'} />
        </>
      }
    />
  )
}
