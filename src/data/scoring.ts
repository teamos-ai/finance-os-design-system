/**
 * THE SCORING SYSTEM — five criteria, five goats each, and one honest note.
 *
 * WHY IT IS BUILT THIS WAY
 *
 * The old sheet had seven criteria on a 10-point scale, applied identically
 * to all 26 categories. That meant "aggregator integration" was weighted 9/10
 * while ranking a social scheduler, which is not a fair comparison, it is a
 * template. Worse, three different versions of it existed: seven criteria in
 * the database, five invented ones in the Compare mega menu at percentages
 * that matched nothing, and a methodology page promising a published sheet
 * per category that had never been written. This file is the single source
 * that replaces all three.
 *
 * FIVE CRITERIA, because five is the number a reader can hold. Each is scored
 * 1–5. They are deliberately orthogonal — a product can be excellent at its
 * job and still fail on cost, and both facts are useful on their own.
 *
 * GOATS, because a number out of ten implies a precision a week of hands-on
 * testing cannot defend. A 7.4 against a 7.2 is an argument with a vendor
 * waiting to happen. Five discrete steps with named meanings is a judgement
 * we can stand behind and a reader can disagree with cleanly.
 *
 * GOATED is the top designation and it is deliberately hard: every criterion
 * at 4 or better AND 22 of 25 overall. A product cannot buy it with one
 * outstanding dimension, which is exactly how most software wins awards.
 *
 * THE FRICTION NOTE IS MANDATORY. `frictionNote` is required on every review,
 * including the one ranked first, and including Finance OS. A reviewer who
 * never finds a flaw is not reviewing — and on a site that ranks its own
 * product, the note about our own product is the most load-bearing sentence
 * on the page. `collections/Apps.ts` enforces it in the review floor; do not
 * relax that to get a review out the door.
 */

export type GoatScore = 1 | 2 | 3 | 4 | 5

export type ScoringCriterion = {
  id: 'australian-fit' | 'core-job' | 'fits-the-stack' | 'worth-the-money' | 'still-improving'
  /** Short name. Used as a column header, so it has to survive being narrow. */
  name: string
  /** The question the criterion actually answers, in a broker's words. */
  question: string
  /** What testing looks at. Concrete, so a reader can hold us to it. */
  looksAt: readonly string[]
  /**
   * What EVERY score means for this criterion, one to five.
   *
   * Not just the top and bottom. A reader deciding whether their own tool is
   * a three or a four is the person this page is actually for, and telling
   * them only what perfect and terrible look like leaves the whole middle —
   * where nearly every product lives — to guesswork.
   */
  levels: Record<GoatScore, string>
}

export const CRITERIA: readonly ScoringCriterion[] = [
  {
    id: 'australian-fit',
    name: 'Built for Australia',
    question: 'Was this built for Australian broking, adapted to it, or indifferent to it?',
    looksAt: [
      'Whether the language is settlements and lenders, or closings and vendors',
      'NCCP and Best Interests Duty awareness in templates, records and workflow',
      'Where client data is stored, and whether that is stated or buried',
      'Pricing quoted in AUD rather than converted at checkout',
      'Support hours that overlap an Australian working day',
    ],
    levels: {
      5: 'Built here or rebuilt for here. An Australian broker could hand it to a new team member without a translation.',
      4: 'Clearly adapted for Australia — AUD pricing, local support hours, the right vocabulary. A few screens still read as imported.',
      3: 'Works here. You will meet American spelling, a US date format or a compliance concept that does not apply, and you will route around them.',
      2: 'Usable in Australia with effort. Key parts assume another market and the workarounds are yours to maintain.',
      1: 'A global product with an AU flag on the pricing page. Everything else is someone else’s market.',
    },
  },
  {
    id: 'core-job',
    name: 'Does the job',
    question: 'Does it do the one thing this category exists for, properly?',
    looksAt: [
      'The category’s actual job — a serviceability tool’s accuracy and lender coverage, a CRM’s pipeline, a document tool’s chase and sign',
      'Whether it holds up on the fourth day, not the first hour',
      'What happens on the unhappy path: a failed sync, a declined file, a client who goes quiet',
      'Whether the feature list and the working product are the same product',
    ],
    levels: {
      5: 'Does the core job better than anything else we have run in the category, including on the days it goes wrong.',
      4: 'Does the job properly. There is a weak spot and you will find it in month two rather than week one.',
      3: 'Does the job. Expect to keep a manual step or a spreadsheet alongside it for one part of the workflow.',
      2: 'Does part of the job. The gap is large enough that a second tool has to cover it.',
      1: 'Demonstrates the job rather than doing it. Falls over somewhere a broker cannot route around.',
    },
  },
  {
    id: 'fits-the-stack',
    name: 'Fits the stack',
    question: 'Does it talk to everything else, or does it become another island?',
    looksAt: [
      'Integrations that exist, work, and are still maintained — not a logo wall',
      'How much re-keying it creates between this and the aggregator',
      'Whether your data comes back out in a form you can use',
      'Whether a broken automation announces itself or fails silently',
    ],
    levels: {
      5: 'Slots into a real broker stack and reduces the number of places the same fact has to be typed.',
      4: 'Connects to what matters and the connections hold. One or two handoffs still need a person.',
      3: 'Has integrations. They work, they are shallow, and you will re-key more than you expected to.',
      2: 'Connects to little, and what it does connect to breaks quietly rather than loudly.',
      1: 'A silo. Data goes in by hand and does not come out.',
    },
  },
  {
    id: 'worth-the-money',
    name: 'Worth the money',
    question: 'Against what it actually replaces, is this a fair price?',
    looksAt: [
      'Total monthly cost at a realistic seat count, not the headline tier',
      'Metered extras — SMS, calls, AI usage, storage — and what a normal month costs',
      'Onboarding and setup fees, and what they buy',
      'What it genuinely lets you cancel',
    ],
    levels: {
      5: 'Costs less than the things it removes, and the bill in month six looks like the quote in month one.',
      4: 'Fairly priced for what it does, and the metered extras are visible before you commit to them.',
      3: 'Priced about right, with a jump waiting at the seat count or usage tier a growing brokerage will hit.',
      2: 'Expensive for what you get, or the real cost only appears once onboarding is behind you.',
      1: 'Priced for a market that is not broking, or the true cost only lands after the seats and the metering do.',
    },
  },
  {
    id: 'still-improving',
    name: 'Still improving',
    question: 'Is this getting better, and will someone answer when it breaks?',
    looksAt: [
      'What actually shipped in the last twelve months, not what was announced',
      'How long support took to answer, and whether the answer was any good',
      'Whether the roadmap describes work or describes marketing',
      'Whether the vendor is stable enough to still be here at your next fixed-rate roll-off',
    ],
    levels: {
      5: 'Ships real improvements on a visible cadence and answers support like people who use the product themselves.',
      4: 'Shipping steadily, support answers inside a working day, and the roadmap is mostly kept.',
      3: 'Maintained rather than developed. Support answers eventually and the answer is usually a link.',
      2: 'Little has shipped and support is slow enough to change how you plan your week around it.',
      1: 'Nothing meaningful has shipped in a year and support is a form that goes nowhere.',
    },
  },
]

export type GoatTier = {
  score: GoatScore
  label: string
  meaning: string
}

/**
 * The scale. Named steps rather than bare numbers, so "3" always means the
 * same thing to us and to a reader, in every category.
 */
export const GOAT_SCALE: readonly GoatTier[] = [
  {
    score: 5,
    label: 'Exceptional',
    meaning: 'Best we have run in this category. We would move a brokerage onto it.',
  },
  {
    score: 4,
    label: 'Strong',
    meaning: 'Does this well. Friction exists, and none of it would stop us recommending it.',
  },
  {
    score: 3,
    label: 'Capable',
    meaning: 'Works. You get the job done, and occasionally wish you had chosen otherwise.',
  },
  {
    score: 2,
    label: 'Limited',
    meaning: 'Real gaps. Worth it only when something outside the software forces the choice.',
  },
  {
    score: 1,
    label: 'Deficient',
    meaning: 'Does not do the job. We would not put a client file through it.',
  },
]

export function tierFor(score: GoatScore): GoatTier {
  return GOAT_SCALE.find((t) => t.score === score) ?? GOAT_SCALE[GOAT_SCALE.length - 1]
}

/**
 * How much AMBER a score is worth, mixed into the neutral border — five carries full amber, one is
 * barely warm, so a wall of scorecards ranks itself at a glance. (The site grades in gold; the DS has
 * no gold and reserves amber for exactly this — a score, and nothing else.)
 */
export const AMBER_RAMP: Record<GoatScore, number> = { 5: 88, 4: 62, 3: 40, 2: 24, 1: 12 }

/** The graded border for a score, as a CSS colour (amber mixed into the neutral border). */
export function scoreBorder(score: GoatScore): string {
  return `color-mix(in srgb, var(--c-amber) ${AMBER_RAMP[score]}%, var(--c-border))`
}

export type ScoreCard = Record<ScoringCriterion['id'], GoatScore>

/** Out of 25. */
export function totalScore(card: ScoreCard): number {
  return CRITERIA.reduce((sum, c) => sum + card[c.id], 0)
}

/** The lowest goat awarded — the number that decides Goated. */
export function weakestScore(card: ScoreCard): GoatScore {
  return CRITERIA.reduce<GoatScore>((low, c) => (card[c.id] < low ? card[c.id] : low), 5)
}

/**
 * GOATED — 22 of 25, and nothing below 4.
 *
 * Both halves matter. The total alone would let a product win on three
 * perfect scores and two poor ones, which is how a tool that is brilliant at
 * one job and hostile to your stack ends up recommended. The floor is what
 * makes it mean "good everywhere" rather than "great somewhere".
 */
/**
 * ONE GOAT SUMMARISING FIVE, for a list row where the full card does not fit.
 *
 * The rounded average, and nothing cleverer. It exists because a bare number
 * beside a product name — "71" — answers nothing on its own: out of what,
 * against whom? A goat's face carries its own scale.
 *
 * IT IS A SUMMARY, NEVER THE VERDICT. Averaging hides the shape, and shape
 * is what the five criteria are for: a product at 5-5-5-5-1 and one at
 * 4-4-4-4-4 both round to four, and they are not the same product. Any
 * surface with room shows the card, not this. Never use it to decide Goated
 * — `isGoated` reads the floor as well as the total, for exactly this reason.
 */
export function overallScore(card: ScoreCard): GoatScore {
  const avg = totalScore(card) / CRITERIA.length
  return Math.min(5, Math.max(1, Math.round(avg))) as GoatScore
}

export const GOATED_TOTAL = 22
export const GOATED_FLOOR = 4

export function isGoated(card: ScoreCard): boolean {
  return totalScore(card) >= GOATED_TOTAL && weakestScore(card) >= GOATED_FLOOR
}

/** The one-line summary of the rule, rendered wherever Goated is explained. */
export const GOATED_RULE = `${GOATED_TOTAL} goats out of ${CRITERIA.length * 5}, and never below ${GOATED_FLOOR} in any single criterion.`

/* ── Gates ──────────────────────────────────────────────────────────────── */

/**
 * Some findings are not a low score, they are a disqualification. Scoring a
 * product 2/5 on "Built for Australia" when it stores broker client data in a
 * jurisdiction the broker cannot name implies the rest of the scorecard is
 * still worth reading. It is not.
 *
 * A product that fails a gate is listed with the gate it failed and no
 * scorecard at all.
 */
export type Gate = {
  id: string
  name: string
  detail: string
  /** Categories the gate applies to. Empty means all of them. */
  appliesTo?: readonly string[]
}

export const GATES: readonly Gate[] = [
  {
    id: 'data-location',
    name: 'You can find out where the data lives',
    detail:
      'A broker holds some of the most sensitive records a client will ever hand over. A vendor that cannot or will not say which jurisdiction that sits in does not get scored.',
  },
  {
    id: 'aud-pricing',
    name: 'A real Australian price',
    detail:
      'Published pricing an Australian buyer can actually act on, in AUD or clearly convertible. "Contact us" for the base tier is a gate, not a low score on value.',
  },
  {
    id: 'still-shipping',
    name: 'Still being built',
    detail:
      'Something meaningful shipped in the last twelve months. Abandoned software is a risk to a brokerage regardless of how good it was when it was maintained.',
  },
  {
    id: 'cdr-accreditation',
    name: 'Accredited where accreditation is required',
    detail:
      'A tool that retrieves bank data is either accredited under the Consumer Data Right or it is asking your client for their banking password. Those are not two grades of the same thing.',
    appliesTo: ['open-banking-bank-data', 'credit-id-verification'],
  },
]
