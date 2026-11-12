/**
 * StampDutyCalculator — indicative AU transfer (stamp) duty for NSW / VIC / QLD. Duty is
 * inherently state-specific, so the state selector is core, not decoration. The headline duty
 * and effective rate update live, and a tokenised "duty by state" bar compares the three at
 * the current price, highlighting the selected one in Atlas Blue.
 *
 * General rates only (owner-occupier, non first-home). The copy routes verification to the
 * state revenue office rather than asserting a figure. No amber — attention stays reserved.
 */
import * as React from 'react'
import { Landmark, DollarSign, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { SegmentedControl } from '@/components/ui/segmented'
import { AnimatedCurrency } from '@/components/calculators/AnimatedCurrency'
import { stampDuty, STATES, aud0, pct1, toNum, type StateCode } from '@/components/calculators/finance'
import { cn } from '@/lib/cn'

const DEFAULTS = { state: 'NSW' as StateCode, value: 820000 }

const STATE_OPTIONS = STATES.map((s) => ({ value: s, label: s }))

export function StampDutyCalculator() {
  const [state, setState] = React.useState<StateCode>(DEFAULTS.state)
  const [value, setValue] = React.useState(DEFAULTS.value)

  const { duty, detail } = stampDuty(state, value)
  const effectiveRate = value > 0 ? (duty / value) * 100 : 0
  const byState = STATES.map((s) => ({ state: s, duty: stampDuty(s, value).duty }))
  const max = Math.max(1, ...byState.map((r) => r.duty))

  const reset = () => {
    setState(DEFAULTS.state)
    setValue(DEFAULTS.value)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent-soft text-accent-text">
            <Landmark className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <div>
            <h3 className="font-display text-title-md text-fg">Stamp duty (AU)</h3>
            <p className="font-body text-body-sm text-fg-subtle">Transfer duty by state and price.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={reset}
          className="relative inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-mono-xs text-fg-subtle transition-colors duration-fast ease-out hover:text-fg active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring before:absolute before:-inset-y-[7px] before:inset-x-0 before:content-['']"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          Reset
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* inputs */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="font-body text-caption text-fg-muted">State or territory</span>
            <div className="overflow-x-auto">
              <SegmentedControl
                aria-label="State or territory"
                options={STATE_OPTIONS}
                value={state}
                onValueChange={(v) => setState(v)}
              />
            </div>
          </div>
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            icon={DollarSign}
            label="Property value"
            value={String(value)}
            onChange={(e) => setValue(toNum(e.target.value))}
          />
          <p className="font-body text-body-sm leading-relaxed text-fg-subtle">
            General transfer-duty rates. Excludes first-home, pensioner and foreign-purchaser
            adjustments, which can change the figure materially.
          </p>
        </div>

        {/* result */}
        <div className="flex flex-col gap-4 rounded-md border border-border-strong bg-accent-soft p-5">
          <div>
            <p className="font-mono text-caption uppercase tracking-[0.12em] text-accent-text">
              Estimated transfer duty · {state}
            </p>
            <AnimatedCurrency value={duty} className="font-display text-display-md leading-none text-fg" />
            <p className="mt-1.5 font-body text-body-sm text-fg-muted">
              <span className="tabular-nums text-fg">{pct1(effectiveRate)}</span> of price · {detail}
            </p>
          </div>

          <div className="border-t border-border-strong/40 pt-4">
            <p className="mb-3 font-mono text-caption uppercase tracking-[0.12em] text-fg-subtle">Duty by state</p>
            <div className="flex flex-col gap-2.5">
              {byState.map((r) => (
                <div key={r.state} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3">
                  <span className="font-mono text-mono-xs text-fg-muted">{r.state}</span>
                  <span className="h-2 overflow-hidden rounded-xs bg-surface">
                    <span
                      className={cn(
                        'block h-full rounded-xs transition-[width] duration-base ease-out motion-reduce:transition-none',
                        r.state === state ? 'bg-accent' : 'bg-border-strong',
                      )}
                      style={{ width: `${(r.duty / max) * 100}%` }}
                    />
                  </span>
                  <span className="text-right font-display text-title-sm tabular-nums text-fg">{aud0(r.duty)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="font-body text-caption leading-relaxed text-fg-subtle">
        Indicative estimate only. Confirm the current figure and any concessions with the relevant
        state revenue office before relying on it.
      </p>
    </div>
  )
}
