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
export type StateCode = 'NSW' | 'VIC' | 'QLD'

export const STATES: StateCode[] = ['NSW', 'VIC', 'QLD']

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
  NSW: [
    { upTo: 16000, base: 0, rate: 1.25, over: 0 },
    { upTo: 35000, base: 200, rate: 1.5, over: 16000 },
    { upTo: 93000, base: 485, rate: 1.75, over: 35000 },
    { upTo: 351000, base: 1500, rate: 3.5, over: 93000 },
    { upTo: 1168000, base: 10530, rate: 4.5, over: 351000 },
    { upTo: null, base: 47295, rate: 5.5, over: 1168000 },
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

/** Parse a form field into a clamped, non-negative number ('' → 0). */
export function toNum(v: string, max = 1_000_000_000): number {
  if (v === '') return 0
  const n = Number(v)
  if (!Number.isFinite(n)) return 0
  return Math.min(max, Math.max(0, n))
}
