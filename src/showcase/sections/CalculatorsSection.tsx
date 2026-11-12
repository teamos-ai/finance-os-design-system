/**
 * CalculatorsSection — the broker calculator family. Three working instruments — home-loan
 * repayments, borrowing power and AU stamp duty — each with real state, live figures and a
 * tokenised inline-SVG / bar breakdown. Flat hairline surfaces, blue-mono data, one amber
 * attention moment (high-LVR → LMI), 8px squircles, zero glass.
 *
 * Content composes from the calculators in src/components/calculators/ so the maths stays
 * in one place; this section is layout, copy and the inspect payloads.
 */
import { Section, Demo } from '@/showcase/Section'
import { RepaymentCalculator } from '@/components/calculators/RepaymentCalculator'
import { BorrowingPowerCalculator } from '@/components/calculators/BorrowingPowerCalculator'
import { StampDutyCalculator } from '@/components/calculators/StampDutyCalculator'
import type { InspectData } from '@/components/ui/inspectable'
import { FadeIn } from '@/lib/motion'

const REPAYMENT_INSPECT: InspectData = {
  name: 'Repayment calculator',
  explain:
    'Home-loan repayments from property value, deposit, rate, term and frequency. The headline and the principal / interest donut update live; an amber LVR chip appears above 80% — the one place amber earns its keep as an attention signal.',
  token:
    'result panel → border-border-strong · bg-accent-soft\nfigures → tabular-nums · font-display\ndonut arc → stroke-current (text-accent) over stroke-border-strong\nLVR status → <Badge variant="amber">',
  code: '<RepaymentCalculator />\n// maths: periodicRepayment(loan, rate, years, freq) — src/components/calculators/finance.ts',
}

const BORROWING_INSPECT: InspectData = {
  name: 'Borrowing power calculator',
  explain:
    'An indicative serviceability estimate — monthly surplus solved back to a maximum loan at an assessment rate (actual rate + APRA-style buffer) over 30 years. The stacked bar shows where the income goes. It states nothing about approval.',
  token:
    'income split → bg-border-strong · bg-fg-subtle · bg-accent\nbar motion → transition-[width] duration-base (motion-reduce:none)\nfigures → tabular-nums',
  code: '<BorrowingPowerCalculator />\n// maths: loanFromRepayment(surplus, rate + buffer, 30, "monthly")',
}

const STAMP_INSPECT: InspectData = {
  name: 'Stamp duty calculator',
  explain:
    'Indicative AU transfer duty for NSW, VIC and QLD using general bracket rates. The duty-by-state bar compares all three at the current price and highlights the selected state. Verification routes to the state revenue office.',
  token:
    'state bars → bg-accent (selected) · bg-border-strong\nselector → <SegmentedControl>\nfigures → tabular-nums',
  code: '<StampDutyCalculator />\n// maths: stampDuty(state, value) — bracket tables in finance.ts',
}

export function CalculatorsSection() {
  return (
    <Section
      id="calculators"
      eyebrow="Calculators"
      title="Calculators"
      lead="Three working broker calculators — home-loan repayments, borrowing power and AU stamp duty. Real inputs drive live figures and tokenised inline-SVG breakdowns. Every result is an indicative estimate, never a quote or an approval."
    >
      <div className="flex flex-col gap-8">
        <FadeIn>
          <Demo label="Repayments — value, deposit, rate, term, frequency" inspect={REPAYMENT_INSPECT}>
            <RepaymentCalculator />
          </Demo>
        </FadeIn>

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
      </div>
    </Section>
  )
}
