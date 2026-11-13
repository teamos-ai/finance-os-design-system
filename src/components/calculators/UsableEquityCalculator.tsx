/**
 * UsableEquityCalculator — total equity vs the slice a lender will actually lend against (most go
 * to 80% of value before mortgage insurance). Mirrors the website's Usable equity tool. Validated
 * against the site's example ($900k value · $450k owing · 80% → $270k usable, $180k locked, 50% LVR,
 * ~$1.35m purchase price). Maths in finance.ts.
 */
import * as React from 'react'
import { Landmark, DollarSign, Percent, AlertTriangle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CalcShell, ResultHeadline, MetricRow, CompareBars } from '@/components/calculators/CalcLayout'
import { aud0, pct1, toNum } from '@/components/calculators/finance'

const DEFAULTS = { value: 900000, owing: 450000, lend: 80 }

export function UsableEquityCalculator() {
  const [value, setValue] = React.useState(DEFAULTS.value)
  const [owing, setOwing] = React.useState(DEFAULTS.owing)
  const [lend, setLend] = React.useState(DEFAULTS.lend)

  const usable = Math.max(0, (value * lend) / 100 - owing)
  const totalEquity = Math.max(0, value - owing)
  const notUsable = Math.max(0, totalEquity - usable)
  const lvr = value > 0 ? (owing / value) * 100 : 0
  const purchasePrice = usable / 0.2

  const reset = () => {
    setValue(DEFAULTS.value)
    setOwing(DEFAULTS.owing)
    setLend(DEFAULTS.lend)
  }

  return (
    <CalcShell
      Icon={Landmark}
      title="Usable equity"
      subtitle="The equity a lender will actually lend against."
      onReset={reset}
      note="Access still depends on serviceability — having usable equity and being approved to draw it are separate questions."
      inputs={
        <>
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Property value" value={String(value)} onChange={(e) => setValue(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Still owing" value={String(owing)} onChange={(e) => setOwing(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} step={1} icon={Percent} label="Lend up to" value={String(lend)} onChange={(e) => setLend(toNum(e.target.value, 100))} hint="Above 80% mortgage insurance normally applies." />
          {lend > 80 && (
            <Badge variant="amber" size="sm">
              <AlertTriangle className="h-3 w-3" strokeWidth={2.25} aria-hidden />
              Above 80% — LMI territory
            </Badge>
          )}
        </>
      }
      result={
        <>
          <ResultHeadline label="Usable equity" value={usable} />
          <MetricRow label="Total equity" figure={aud0(totalEquity)} />
          <MetricRow label="Current loan to value ratio" figure={pct1(lvr)} />
          <MetricRow label="Deposit this could form at 20%" figure={aud0(usable)} hint={`Roughly ${aud0(purchasePrice)} of purchase price before costs, if a lender accepts it.`} />
          <CompareBars
            a={{ label: 'Locked in the property', value: notUsable, format: aud0 }}
            b={{ label: 'Usable', value: usable, format: aud0 }}
          />
        </>
      }
    />
  )
}
