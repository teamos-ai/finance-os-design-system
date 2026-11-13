/**
 * finance.ts — pure, framework-free maths for the broker calculators.
 *
 * Standard amortisation (repayment + the reverse serviceability solve) and AU
 * transfer-duty bracket tables for NSW / VIC / QLD. No React, no tokens — just
 * numbers and formatters, so the calculator UIs stay thin. Every published figure
 * is an INDICATIVE estimate: general rates, owner-occupier, no first-home or
 * foreign-purchaser adjustments. Confirm with the lender or state revenue office.
 */

/* ── Repayment frequency ─────────────────────────────────────────────────────── */
export type Frequency = 'weekly' | 'fortnightly' | 'monthly'

export const PERIODS_PER_YEAR: Record<Frequency, number> = {
  weekly: 52,
  fortnightly: 26,
  monthly: 12,
}

export const FREQUENCY_NOUN: Record<Frequency, string> = {
  weekly: 'week',
  fortnightly: 'fortnight',
  monthly: 'month',
}

/**
 * Amortised repayment for ONE period — P·r(1+r)^n / ((1+r)^n − 1). The period's own
 * rate and count are used, so weekly / fortnightly are solved directly, not scaled
 * from a monthly figure.
 */
export function periodicRepayment(
  principal: number,
  annualRatePct: number,
  years: number,
  freq: Frequency,
): number {
  const m = PERIODS_PER_YEAR[freq]
  const n = years * m
  if (principal <= 0 || n <= 0) return 0
  const r = annualRatePct / 100 / m
  if (r === 0) return principal / n
  const f = Math.pow(1 + r, n)
  return (principal * r * f) / (f - 1)
}

/** Balance remaining after `n` periods of a fixed `payment` — the closed-form amortised balance. */
export function balanceAfter(
  principal: number,
  annualRatePct: number,
  payment: number,
  periodsPerYear: number,
  n: number,
): number {
  if (principal <= 0 || n <= 0) return Math.max(0, principal)
  const r = annualRatePct / 100 / periodsPerYear
  if (r === 0) return Math.max(0, principal - payment * n)
  const f = Math.pow(1 + r, n)
  return Math.max(0, principal * f - payment * ((f - 1) / r))
}

/**
 * Period-by-period amortisation — returns how many periods the loan takes to clear and the
 * total interest paid getting there. Options model the levers the calculators need: a constant
 * `offset` balance (interest charged only on balance − offset), a recurring `extra` payment, and
 * a one-off `lumpAmount` applied at the end of period `lumpAfterPeriods`. Period-agnostic, so
 * monthly (12) and fortnightly (26) are both solved directly.
 */
export function amortise(
  principal: number,
  annualRatePct: number,
  payment: number,
  periodsPerYear: number,
  opts: { offset?: number; extra?: number; lumpAmount?: number; lumpAfterPeriods?: number; maxPeriods?: number } = {},
): { periods: number; totalInterest: number } {
  const { offset = 0, extra = 0, lumpAmount = 0, lumpAfterPeriods = 0, maxPeriods = 100 * periodsPerYear } = opts
  if (principal <= 0 || payment <= 0) return { periods: 0, totalInterest: 0 }
  const r = annualRatePct / 100 / periodsPerYear
  const pay = payment + extra
  let balance = principal
  let totalInterest = 0
  let periods = 0
  while (balance > 0.005 && periods < maxPeriods) {
    periods++
    const interest = Math.max(0, balance - offset) * r
    totalInterest += interest
    balance = balance + interest - pay
    if (lumpAmount > 0 && periods === lumpAfterPeriods) balance -= lumpAmount
  }
  return { periods, totalInterest }
}

/** Total interest over the full scheduled term at the amortising repayment. */
export function totalInterest(principal: number, annualRatePct: number, years: number, freq: Frequency): number {
  const payment = periodicRepayment(principal, annualRatePct, years, freq)
  return Math.max(0, payment * PERIODS_PER_YEAR[freq] * years - principal)
}

/** Interest paid over the first `n` periods — payment·n minus the principal actually repaid. */
export function interestOverPeriods(
  principal: number,
  annualRatePct: number,
  payment: number,
  periodsPerYear: number,
  n: number,
): number {
  const principalRepaid = principal - balanceAfter(principal, annualRatePct, payment, periodsPerYear, n)
  return Math.max(0, payment * n - principalRepaid)
}

/** "24 years 4 months" from a raw period count — rounds to the nearest whole month. */
export function durationLabel(totalPeriods: number, periodsPerYear: number): string {
  const months = Math.max(0, Math.round((totalPeriods / periodsPerYear) * 12))
  const y = Math.floor(months / 12)
  const m = months % 12
  const yp = y === 1 ? '1 year' : `${y} years`
  const mp = m === 1 ? '1 month' : `${m} months`
  if (y === 0) return mp
  if (m === 0) return yp
  return `${yp} ${mp}`
}

/** The largest loan a given per-period repayment can service — the reverse solve. */
export function loanFromRepayment(
  payment: number,
  annualRatePct: number,
  years: number,
  freq: Frequency,
): number {
  const m = PERIODS_PER_YEAR[freq]
  const n = years * m
  if (payment <= 0 || n <= 0) return 0
  const r = annualRatePct / 100 / m
  if (r === 0) return payment * n
  const f = Math.pow(1 + r, n)
  return (payment * (f - 1)) / (r * f)
}

/* ── AU transfer duty (general rates) ────────────────────────────────────────── */
export type StateCode = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS'

export const STATES: StateCode[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS']

interface Bracket {
  /** top of this bracket (inclusive); null = no ceiling */
  upTo: number | null
  base: number
  /** marginal rate %, or the flat rate % when `flat` is set */
  rate: number
  /** threshold the marginal rate applies above */
  over: number
  /** rate applies to the WHOLE value, not just the slice above `over` (VIC premium band) */
  flat?: boolean
}

/** General / standard transfer-duty schedules (indicative). Owner-occupier, non-FHB. */
const DUTY: Record<StateCode, Bracket[]> = {
  // NSW — revenue.nsw.gov.au standard transfer duty, updated Oct 2026. $750k → $27,937.
  NSW: [
    { upTo: 18000, base: 0, rate: 1.25, over: 0 },
    { upTo: 38000, base: 225, rate: 1.5, over: 18000 },
    { upTo: 103000, base: 525, rate: 1.75, over: 38000 },
    { upTo: 387000, base: 1662, rate: 3.5, over: 103000 },
    { upTo: 1290000, base: 11602, rate: 4.5, over: 387000 },
    { upTo: null, base: 52237, rate: 5.5, over: 1290000 },
  ],
  VIC: [
    { upTo: 25000, base: 0, rate: 1.4, over: 0 },
    { upTo: 130000, base: 350, rate: 2.4, over: 25000 },
    { upTo: 960000, base: 2870, rate: 6.0, over: 130000 },
    { upTo: 2000000, base: 0, rate: 5.5, over: 0, flat: true },
    { upTo: null, base: 110000, rate: 6.5, over: 2000000 },
  ],
  QLD: [
    { upTo: 5000, base: 0, rate: 0, over: 0 },
    { upTo: 75000, base: 0, rate: 1.5, over: 5000 },
    { upTo: 540000, base: 1050, rate: 3.5, over: 75000 },
    { upTo: 1000000, base: 17325, rate: 4.5, over: 540000 },
    { upTo: null, base: 38025, rate: 5.75, over: 1000000 },
  ],
  // WA — wa.gov.au transfer duty (general rate), last updated 30 Jul 2026. $750k → $29,741.
  WA: [
    { upTo: 120000, base: 0, rate: 1.9, over: 0 },
    { upTo: 150000, base: 2280, rate: 2.85, over: 120000 },
    { upTo: 360000, base: 3135, rate: 3.8, over: 150000 },
    { upTo: 725000, base: 11115, rate: 4.75, over: 360000 },
    { upTo: null, base: 28453, rate: 5.15, over: 725000 },
  ],
  // SA — revenuesa.sa.gov.au rate of stamp duty. $750k → $35,080.
  SA: [
    { upTo: 12000, base: 0, rate: 1.0, over: 0 },
    { upTo: 30000, base: 120, rate: 2.0, over: 12000 },
    { upTo: 50000, base: 480, rate: 3.0, over: 30000 },
    { upTo: 100000, base: 1080, rate: 3.5, over: 50000 },
    { upTo: 200000, base: 2830, rate: 4.0, over: 100000 },
    { upTo: 250000, base: 6830, rate: 4.25, over: 200000 },
    { upTo: 300000, base: 8955, rate: 4.75, over: 250000 },
    { upTo: 500000, base: 11330, rate: 5.0, over: 300000 },
    { upTo: null, base: 21330, rate: 5.5, over: 500000 },
  ],
  // TAS — sro.tas.gov.au rates of duty (on/after 21 Oct 2013). $750k → $28,935.
  TAS: [
    { upTo: 3000, base: 50, rate: 0, over: 0 },
    { upTo: 25000, base: 50, rate: 1.75, over: 3000 },
    { upTo: 75000, base: 435, rate: 2.25, over: 25000 },
    { upTo: 200000, base: 1560, rate: 3.5, over: 75000 },
    { upTo: 375000, base: 5935, rate: 4.0, over: 200000 },
    { upTo: 725000, base: 12935, rate: 4.25, over: 375000 },
    { upTo: null, base: 27810, rate: 4.5, over: 725000 },
  ],
}

export interface DutyResult {
  duty: number
  /** the applied bracket, spelled out — e.g. "$10,530 + 4.5% over $351,000" */
  detail: string
}

export function stampDuty(state: StateCode, value: number): DutyResult {
  if (value <= 0) return { duty: 0, detail: '—' }
  const table = DUTY[state]
  const b = table.find((x) => x.upTo === null || value <= x.upTo) ?? table[table.length - 1]
  if (b.flat) return { duty: (b.rate / 100) * value, detail: `${b.rate}% of property value` }
  const duty = b.base + (b.rate / 100) * (value - b.over)
  const detail =
    b.over === 0 ? `${b.rate}% of property value` : `${aud0(b.base)} + ${b.rate}% over ${aud0(b.over)}`
  return { duty, detail }
}

/* ── First-home duty relief (indicative thresholds) ──────────────────────────── */
/** Full-exemption price and the upper price where the first-home concession phases out to the
 *  general rate. SA/TAS carry no established-home first-home DUTY relief at present → exempt 0. */
export const FHB_DUTY: Record<StateCode, { exempt: number; phaseOut: number }> = {
  NSW: { exempt: 800000, phaseOut: 1000000 },
  VIC: { exempt: 600000, phaseOut: 750000 },
  QLD: { exempt: 700000, phaseOut: 800000 },
  WA: { exempt: 600000, phaseOut: 800000 },
  SA: { exempt: 0, phaseOut: 0 },
  TAS: { exempt: 0, phaseOut: 0 },
}

export type FhbStatus = 'exempt' | 'concession' | 'general' | 'none'

/** Indicative first-home transfer duty. The exact concession taper is state-specific; the
 *  concession band here is a linear approximation — confirm the amount with the revenue office. */
export function firstHomeDuty(state: StateCode, value: number): { duty: number; status: FhbStatus } {
  const general = stampDuty(state, value).duty
  const b = FHB_DUTY[state]
  if (b.exempt === 0) return { duty: general, status: 'none' }
  if (value <= b.exempt) return { duty: 0, status: 'exempt' }
  if (value <= b.phaseOut) return { duty: general * ((value - b.exempt) / (b.phaseOut - b.exempt)), status: 'concession' }
  return { duty: general, status: 'general' }
}

/* ── First Home Guarantee (5% Deposit Scheme) price caps ─────────────────────────
   firsthomebuyers.gov.au property price caps (Housing Australia). `city` = capital city /
   regional centre; `rest` = everywhere else in the state. */
export const FHG_CAPS: Record<StateCode, { city: number; rest: number }> = {
  NSW: { city: 1500000, rest: 800000 },
  VIC: { city: 950000, rest: 650000 },
  QLD: { city: 1000000, rest: 700000 },
  WA: { city: 850000, rest: 600000 },
  SA: { city: 900000, rest: 500000 },
  TAS: { city: 700000, rest: 550000 },
}

/* ── Lender's mortgage insurance (indicative) ─────────────────────────────────────
   LMI is priced by the insurer against a confidential matrix, so this is an INDICATIVE band
   only, calibrated to published reference points (85% ≈ 0.90% of loan · 90% ≈ 2.11% · 95% ≈
   4.00%). At or below 80% most lenders charge nothing. Never a quote. */
const LMI_BANDS: { maxLvr: number; rate: number }[] = [
  { maxLvr: 80, rate: 0 },
  { maxLvr: 85, rate: 0.902 },
  { maxLvr: 90, rate: 2.106 },
  { maxLvr: 95, rate: 3.998 },
]

export interface LmiResult {
  premium: number
  lvr: number
  loan: number
  /** deposit needed to reach 80% LVR, where LMI typically falls away */
  extraDepositFor80: number
  /** indicative premium at the 85 / 90 / 95 bands for the same property value */
  curve: { lvr: number; premium: number }[]
}

export function lmiPremium(value: number, deposit: number): LmiResult {
  const loan = Math.max(0, value - deposit)
  const lvr = value > 0 ? (loan / value) * 100 : 0
  const rateFor = (l: number) => (LMI_BANDS.find((b) => l <= b.maxLvr) ?? LMI_BANDS[LMI_BANDS.length - 1]).rate
  const premium = (loan * rateFor(lvr)) / 100
  const extraDepositFor80 = Math.max(0, loan - value * 0.8)
  const curve = [85, 90, 95].map((p) => {
    const l = value * (p / 100)
    return { lvr: p, premium: (l * rateFor(p)) / 100 }
  })
  return { premium, lvr, loan, extraDepositFor80, curve }
}

/* ── Formatting + parsing ─────────────────────────────────────────────────────── */
const AUD0 = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
})
const AUD2 = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Whole-dollar AUD, grouped — "$650,000". NaN / ∞ guard returns "$0". */
export function aud0(n: number): string {
  return AUD0.format(Number.isFinite(n) ? n : 0)
}

/** AUD with cents — "$3,942.18". */
export function aud2(n: number): string {
  return AUD2.format(Number.isFinite(n) ? n : 0)
}

/** Percentage to one decimal — "88.0%". */
export function pct1(n: number): string {
  return `${(Number.isFinite(n) ? n : 0).toFixed(1)}%`
}

/** Percentage to two decimals — "4.96%". For yields / blended rates that read finer. */
export function pct2(n: number): string {
  return `${(Number.isFinite(n) ? n : 0).toFixed(2)}%`
}

/** Parse a form field into a clamped, non-negative number ('' → 0). */
export function toNum(v: string, max = 1_000_000_000): number {
  if (v === '') return 0
  const n = Number(v)
  if (!Number.isFinite(n)) return 0
  return Math.min(max, Math.max(0, n))
}
