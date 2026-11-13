/**
 * CalculatorsSection — the broker calculator family, mirrored from the Finance OS website and
 * grouped as it is there (Paying it off · Buying · …). Each instrument has real state, live figures
 * and a tokenised breakdown; the maths lives in src/components/calculators/finance.ts so it stays in
 * one place. Every result is an indicative estimate, never a quote or approval (brand + site rule).
 *
 * The website lists 20 calculators; they are being brought across in this assets pass.
 */
import * as React from 'react'
import { Section, Demo } from '@/showcase/Section'
import { RepaymentCalculator } from '@/components/calculators/RepaymentCalculator'
import { ExtraRepaymentsCalculator } from '@/components/calculators/ExtraRepaymentsCalculator'
import { LumpSumCalculator } from '@/components/calculators/LumpSumCalculator'
import { OffsetCalculator } from '@/components/calculators/OffsetCalculator'
import { InterestOnlyPICalculator } from '@/components/calculators/InterestOnlyPICalculator'
import { RepaymentFrequencyCalculator } from '@/components/calculators/RepaymentFrequencyCalculator'
import { BorrowingPowerCalculator } from '@/components/calculators/BorrowingPowerCalculator'
import { StampDutyCalculator } from '@/components/calculators/StampDutyCalculator'
import type { InspectData } from '@/components/ui/inspectable'
import { FadeIn } from '@/lib/motion'

const insp = (name: string, explain: string, code: string): InspectData => ({
  name,
  explain,
  token:
    'result panel → border-border-strong · bg-accent-soft\nheadline → AnimatedCurrency · font-display · tabular-nums\nbars → bg-accent (with) · bg-border-strong (baseline)\nchrome → <CalcShell> (shared header · inputs | result grid · indicative note)',
  code,
})

const REPAYMENT_INSPECT = insp(
  'Repayment calculator',
  'Home-loan repayments from value, deposit, rate, term and frequency. The headline and principal/interest donut update live; an amber LVR chip appears above 80% — the one place amber earns its keep.',
  '<RepaymentCalculator />\n// periodicRepayment(loan, rate, years, freq)',
)
const EXTRA_INSPECT = insp(
  'Extra repayments',
  'What a recurring extra payment does — interest saved and years off the loan, with a before/after interest comparison. Compounding, working backwards.',
  '<ExtraRepaymentsCalculator />\n// amortise(loan, rate, payment, 12, { extra })',
)
const LUMP_INSPECT = insp(
  'Lump sum payment',
  'A one-off payment partway through the loan — interest saved, the balance just before and after, and the per-dollar efficiency.',
  '<LumpSumCalculator />\n// amortise(loan, rate, payment, 12, { lumpAmount, lumpAfterPeriods })',
)
const OFFSET_INSPECT = insp(
  'Offset account',
  'What an average offset balance saves over the life of the loan, and the equivalent after-tax return — interest is charged only on balance − offset.',
  '<OffsetCalculator />\n// amortise(loan, rate, payment, 12, { offset })',
)
const IO_INSPECT = insp(
  'Interest only vs P&I',
  'The lower repayment during the interest-only period, the step up when it reverts to principal and interest, and the total-cost comparison.',
  '<InterestOnlyPICalculator />\n// periodicRepayment over the reverted term vs throughout',
)
const FREQ_INSPECT = insp(
  'Repayment frequency',
  'Why paying half the monthly repayment every fortnight clears a loan years early — 26 fortnights make 13 monthly repayments a year.',
  '<RepaymentFrequencyCalculator />\n// amortise(loan, rate, monthly/2, 26)',
)
const BORROWING_INSPECT = insp(
  'Borrowing power',
  'An indicative serviceability estimate — monthly surplus solved back to a maximum loan at an assessment rate (actual rate + buffer). It states nothing about approval.',
  '<BorrowingPowerCalculator />\n// loanFromRepayment(surplus, rate + buffer, 30, "monthly")',
)
const STAMP_INSPECT = insp(
  'Stamp duty',
  'Indicative AU transfer duty for NSW, VIC and QLD using general bracket rates, comparing all three at the current price. Verification routes to the state revenue office.',
  '<StampDutyCalculator />\n// stampDuty(state, value) — bracket tables in finance.ts',
)

/** A small group heading inside the section — mirrors the website's calculator categories. */
function CalcGroup({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-2">
        <p className="font-mono text-mono-xs font-bold uppercase tracking-[0.16em] text-fg-muted">{label}</p>
        {hint && <p className="font-mono text-mono-2xs uppercase tracking-wider text-fg-subtle">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

export function CalculatorsSection() {
  return (
    <Section
      id="calculators"
      eyebrow="Finance Calculators"
      title="Finance Calculators"
      lead="The broker calculator family, mirrored from the Finance OS website and grouped as it is there. Real inputs drive live figures; every result is an indicative estimate, never a quote or an approval. 8 of the website's 20 are built so far — the rest land in this pass."
    >
      <div className="flex flex-col gap-12">
        <CalcGroup label="Paying it off" hint="6 of 6">
          <FadeIn>
            <Demo label="Repayments — value, deposit, rate, term, frequency" inspect={REPAYMENT_INSPECT}>
              <RepaymentCalculator />
            </Demo>
          </FadeIn>
          <FadeIn>
            <Demo label="Extra repayments — interest saved, time off" inspect={EXTRA_INSPECT}>
              <ExtraRepaymentsCalculator />
            </Demo>
          </FadeIn>
          <FadeIn>
            <Demo label="Lump sum — a one-off payment partway through" inspect={LUMP_INSPECT}>
              <LumpSumCalculator />
            </Demo>
          </FadeIn>
          <FadeIn>
            <Demo label="Offset account — lifetime saving + equivalent return" inspect={OFFSET_INSPECT}>
              <OffsetCalculator />
            </Demo>
          </FadeIn>
          <FadeIn>
            <Demo label="Interest only vs P&I — the step up when it reverts" inspect={IO_INSPECT}>
              <InterestOnlyPICalculator />
            </Demo>
          </FadeIn>
          <FadeIn>
            <Demo label="Repayment frequency — fortnightly vs monthly" inspect={FREQ_INSPECT}>
              <RepaymentFrequencyCalculator />
            </Demo>
          </FadeIn>
        </CalcGroup>

        <CalcGroup label="Buying" hint="2 of 7 · more in this pass">
          <FadeIn>
            <Demo label="Borrowing power — serviceability from monthly surplus" inspect={BORROWING_INSPECT}>
              <BorrowingPowerCalculator />
            </Demo>
          </FadeIn>
          <FadeIn>
            <Demo label="Stamp duty — AU transfer duty by state" inspect={STAMP_INSPECT}>
              <StampDutyCalculator />
            </Demo>
          </FadeIn>
        </CalcGroup>
      </div>
    </Section>
  )
}
