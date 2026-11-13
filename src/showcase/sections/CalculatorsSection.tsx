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
import { RefinanceSavingsCalculator } from '@/components/calculators/RefinanceSavingsCalculator'
import { CompareTwoLoansCalculator } from '@/components/calculators/CompareTwoLoansCalculator'
import { FixedVsVariableCalculator } from '@/components/calculators/FixedVsVariableCalculator'
import { SplitLoanCalculator } from '@/components/calculators/SplitLoanCalculator'
import { RentVsBuyCalculator } from '@/components/calculators/RentVsBuyCalculator'
import { UsableEquityCalculator } from '@/components/calculators/UsableEquityCalculator'
import { InvestmentCashflowCalculator } from '@/components/calculators/InvestmentCashflowCalculator'
import { LvrCalculator } from '@/components/calculators/LvrCalculator'
import { LmiEstimateCalculator } from '@/components/calculators/LmiEstimateCalculator'
import { FirstHomeSchemesCalculator } from '@/components/calculators/FirstHomeSchemesCalculator'
import { DepositSavingsGoalCalculator } from '@/components/calculators/DepositSavingsGoalCalculator'
import { UpfrontCostsCalculator } from '@/components/calculators/UpfrontCostsCalculator'
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
  'Indicative AU transfer duty for six states (NSW · VIC · QLD · WA · SA · TAS) using current general bracket rates, comparing them at the current price. ACT and NT are pending. Verification routes to the state revenue office.',
  '<StampDutyCalculator />\n// stampDuty(state, value) — bracket tables in finance.ts',
)
const REFI_INSPECT = insp(
  'Refinance savings',
  'A lower rate netted off against the cost of switching — the monthly saving, break-even on the switch cost, the saving over the remaining term, and what keeping the old repayment would do.',
  '<RefinanceSavingsCalculator />\n// periodicRepayment at each rate + amortise() for "stays the same"',
)
const COMPARE_INSPECT = insp(
  'Compare two loans',
  'Two loans against the same balance and term, annual fees folded in — the cheaper loan over the term, each repayment and total cost. The cheaper rate is not always the cheaper loan.',
  '<CompareTwoLoansCalculator />\n// total = payment × n + annualFee × years',
)
const FV_INSPECT = insp(
  'Fixed vs variable',
  'Interest over the fixed period each way, the repayments, and the average variable rate at which fixing breaks even. It cannot forecast rates — only the break-even.',
  '<FixedVsVariableCalculator />\n// interestOverPeriods() for the fixed window',
)
const SPLIT_INSPECT = insp(
  'Split loan',
  'A part-fixed, part-variable blend: the total repayment, the blended rate, and what a one-point rate rise does to the variable portion only.',
  '<SplitLoanCalculator />\n// periodicRepayment on each portion; blended by share',
)
const RENTBUY_INSPECT = insp(
  'Rent vs buy',
  'The two financial paths over a period: buying (equity net of repayments and holding costs) vs renting (rent paid, deposit invested instead). Swings hard on the growth and return assumptions.',
  '<RentVsBuyCalculator />\n// equity − costs − depositInvested + rentPaid',
)
const USABLE_INSPECT = insp(
  'Usable equity',
  'Total equity vs the slice a lender will lend against — most go to 80% of value before mortgage insurance. Shows the usable amount, what is locked, and the deposit it could form.',
  '<UsableEquityCalculator />\n// usable = value × lend% − owing',
)
const CASHFLOW_INSPECT = insp(
  'Investment property cashflow',
  'What an investment costs a week, before and after the tax deduction — rent after vacancy, repayments, costs, the cash position, the taxable loss and gross yield. Negative gearing, laid out.',
  '<InvestmentCashflowCalculator />\n// interest (deductible) via interestOverPeriods(); principal is not',
)
const DEPOSIT_INSPECT = insp(
  'Deposit savings goal',
  'How long to save the deposit plus the costs on top (stamp duty, conveyancing), with savings growing at the return each month. Covers 6 states.',
  '<DepositSavingsGoalCalculator />\n// stampDuty(state, price) + month-by-month growth to target',
)
const UPFRONT_INSPECT = insp(
  'Upfront purchase costs',
  'The cash due at settlement beyond the deposit — stamp duty (first-home aware), indicative LMI, conveyancing, inspection, registration. Covers 6 states.',
  '<UpfrontCostsCalculator />\n// stampDuty / firstHomeDuty + lmiPremium + fixed allowances',
)
const LMI_INSPECT = insp(
  'Lender’s mortgage insurance',
  'An INDICATIVE LMI band calibrated to published reference points (no outside tool can quote the real premium). Shows the premium, LVR, the deposit to reach 80%, and the 85/90/95 curve.',
  '<LmiEstimateCalculator />\n// lmiPremium(value, deposit) — indicative % -of-loan bands',
)
const FHS_INSPECT = insp(
  'First home scheme check',
  'Whether a purchase sits under the First Home Guarantee price cap, and the first-home stamp-duty saving. It reports; it does not decide eligibility. Covers 6 states.',
  '<FirstHomeSchemesCalculator />\n// FHG_CAPS[state] + firstHomeDuty(state, price) vs general',
)
const LVR_INSPECT = insp(
  'Loan to value ratio',
  'The number a lender looks at first — the LVR, the loan, the deposit share, and the deposit needed to reach 80%, with a status chip above/below the LMI line.',
  '<LvrCalculator />\n// lvr = (value − deposit) / value',
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
      lead="The broker calculator family, mirrored from the Finance OS website and grouped as it is there — all 20, from repayments to investment cashflow. Real inputs drive live figures; every result is an indicative estimate, never a quote or an approval. Stamp duty covers six states (ACT and NT pending)."
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

        <CalcGroup label="Buying" hint="7 of 7">
          <FadeIn>
            <Demo label="Borrowing power — serviceability from monthly surplus" inspect={BORROWING_INSPECT}>
              <BorrowingPowerCalculator />
            </Demo>
          </FadeIn>
          <FadeIn>
            <Demo label="Deposit savings goal — time to save the deposit + costs" inspect={DEPOSIT_INSPECT}>
              <DepositSavingsGoalCalculator />
            </Demo>
          </FadeIn>
          <FadeIn>
            <Demo label="Upfront purchase costs — cash at settlement" inspect={UPFRONT_INSPECT}>
              <UpfrontCostsCalculator />
            </Demo>
          </FadeIn>
          <FadeIn>
            <Demo label="Stamp duty — AU transfer duty by state" inspect={STAMP_INSPECT}>
              <StampDutyCalculator />
            </Demo>
          </FadeIn>
          <FadeIn>
            <Demo label="Lender's mortgage insurance — an indicative band" inspect={LMI_INSPECT}>
              <LmiEstimateCalculator />
            </Demo>
          </FadeIn>
          <FadeIn>
            <Demo label="First home scheme check — cap + first-home duty" inspect={FHS_INSPECT}>
              <FirstHomeSchemesCalculator />
            </Demo>
          </FadeIn>
          <FadeIn>
            <Demo label="Loan to value ratio — the number lenders look at first" inspect={LVR_INSPECT}>
              <LvrCalculator />
            </Demo>
          </FadeIn>
        </CalcGroup>

        <CalcGroup label="Comparing & switching" hint="5 of 5">
          <FadeIn>
            <Demo label="Refinance savings — a lower rate, net of switching costs" inspect={REFI_INSPECT}>
              <RefinanceSavingsCalculator />
            </Demo>
          </FadeIn>
          <FadeIn>
            <Demo label="Compare two loans — rate + fees over the term" inspect={COMPARE_INSPECT}>
              <CompareTwoLoansCalculator />
            </Demo>
          </FadeIn>
          <FadeIn>
            <Demo label="Fixed vs variable — the break-even rate" inspect={FV_INSPECT}>
              <FixedVsVariableCalculator />
            </Demo>
          </FadeIn>
          <FadeIn>
            <Demo label="Split loan — the blend and the risk" inspect={SPLIT_INSPECT}>
              <SplitLoanCalculator />
            </Demo>
          </FadeIn>
          <FadeIn>
            <Demo label="Rent vs buy — two paths over a period" inspect={RENTBUY_INSPECT}>
              <RentVsBuyCalculator />
            </Demo>
          </FadeIn>
        </CalcGroup>

        <CalcGroup label="Property & equity" hint="2 of 2">
          <FadeIn>
            <Demo label="Usable equity — what a lender will lend against" inspect={USABLE_INSPECT}>
              <UsableEquityCalculator />
            </Demo>
          </FadeIn>
          <FadeIn>
            <Demo label="Investment property cashflow — cost a week, after tax" inspect={CASHFLOW_INSPECT}>
              <InvestmentCashflowCalculator />
            </Demo>
          </FadeIn>
        </CalcGroup>
      </div>
    </Section>
  )
}
