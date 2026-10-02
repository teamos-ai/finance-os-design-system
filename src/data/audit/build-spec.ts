/**
 * The build the audit measures against.
 *
 * The audit is not an open-ended chat. It compares a brokerage to a specific, built
 * configuration — the client-facing broker pipeline set that exists in the Finance OS
 * agency account: six pipelines, forty-four stages, built 2026-09-18.
 *
 * Every stage name here is verbatim from `db-finance-os/11-operations/pipelines-and-stages.md`
 * (object 1, the built one — not the owner-supplied template, not the benchmark export, not
 * the proposal). Do not paraphrase them: the point of showing this on the opening screen is
 * that the auditor and the client are looking at the same thing.
 */

export interface BenchmarkPipeline {
  /** the pipeline's own number in the built set */
  number: string
  name: string
  stages: string[]
  /** what this pipeline is for, in a line the auditor can say out loud */
  purpose: string
}

export const BENCHMARK_PIPELINES: BenchmarkPipeline[] = [
  {
    number: '0',
    name: 'Lead Gen & Qualification',
    purpose: 'Everything before a deal is a deal — capture, tag, book, qualify, or park.',
    stages: [
      'New Enquiry',
      'Lead Captured & Tagged',
      'Qualification Call Booked',
      'Discovery Completed',
      'Warm Nurture',
      'Cold Archive',
    ],
  },
  {
    number: '1',
    name: 'Pre-Submission',
    purpose: 'From first real conversation to a deal that qualifies. The credit guide sits here.',
    stages: [
      'New Lead',
      'Credit Guide Sent',
      'Initial Conversation',
      'Fact Find',
      'Document Collection',
      'Servicing',
      'Deal Qualifies',
    ],
  },
  {
    number: '2',
    name: 'Approval — Settlements',
    purpose: 'Submitted through to settled, with the lender milestones the client asks about.',
    stages: [
      'Submitted',
      'Conditional Approval',
      'Formal Approval',
      'Docs Issued',
      'Settlement Booked',
      'Settled',
    ],
  },
  {
    number: '3',
    name: 'Construction Loans',
    purpose: 'The progress-claim schedule, which most brokerages run out of a spreadsheet or a memory.',
    stages: [
      'Settled Construction Not Started',
      'Deposit/Pool Stage',
      'Progress Claim 1 Base',
      'Progress Claim 2 Frame',
      'Progress Claim 3 Enclosed',
      'Progress Claim 4 Fixing',
      'Progress Claim 5 Practical',
      'Landscaping Payments',
      'Final Hand Over',
    ],
  },
  {
    number: '4',
    name: 'Complex Deals',
    purpose: 'Commercial, self-employed and anything that will not fit the standard path.',
    stages: [
      'New Complex Deal',
      'Requirements & Strategy',
      'Documents & Information',
      'Deal Assessment',
      'Lender / Funder Discussion',
      'Finalise Proposal',
      'Ready for Submission',
    ],
  },
  {
    number: '5',
    name: 'Client Care & Advocacy',
    purpose: 'Everything after settlement — the part almost nobody runs, and where the trail book lives.',
    stages: [
      '30-Day Post-Settlement Check-In',
      'Testimonial',
      'Annual Review / Check-Ins',
      'Rate Watch Signal',
      'Fixed Rate Expiry',
      'Life Event',
      'Advocate & Referral Loop',
      'Needs Attention',
      'Refinanced Away',
      'Win-Back',
    ],
  },
]

/**
 * Derived from the stage names above, not asserted.
 *
 * NOTE — the source contradicts itself, and this is deliberate rather than a transcription
 * error on our side. `11-operations/pipelines-and-stages.md` states "Stage totals per
 * pipeline are 6, 7, 6, 9, 7 and 9, which is 44", but its own table lists TEN stages for
 * `5 | Client Care & Advocacy` (30-Day Post-Settlement Check-In · Testimonial · Annual
 * Review / Check-Ins · Rate Watch Signal · Fixed Rate Expiry · Life Event · Advocate &
 * Referral Loop · Needs Attention · Refinanced Away · Win-Back), which totals 45.
 *
 * The named stages are the stronger evidence — they are verified against the Asana build
 * record — so the count is derived from them. Do not hardcode either figure: if the source
 * is corrected, the names change and this follows. The discrepancy is logged for the
 * database owner; only a fresh read of the account settles which is right.
 */
export const BENCHMARK_STAGE_COUNT = BENCHMARK_PIPELINES.reduce(
  (n, p) => n + p.stages.length,
  0,
)

/** What the source asserts, kept beside the derived figure so the gap stays visible. */
export const BENCHMARK_STAGE_COUNT_AS_STATED = 44

/** The two stages that are regulatory touchpoints, and the caveat that governs both. */
export const REGULATORY_TOUCHPOINTS = [
  {
    stage: 'Credit Guide Sent',
    pipeline: '1 | Pre-Submission',
    what: 'The NCCP s 113 touch. The trigger is a likelihood test, so it fires before any product is named.',
  },
  {
    stage: 'Options presented',
    pipeline: 'Where best-interests-duty evidence belongs',
    what: 'RG 273. The record of what was compared and why, not just that a card moved.',
  },
] as const

/** Stated on the opening screen so it is never implied that the build does the compliance. */
export const TOUCHPOINT_CAVEAT =
  'A stage transition is not evidence. It proves a card moved — not that a guide arrived, or that ' +
  'options were compared. Those obligations stay with the licensee.'

/** What the product does not do. Verbatim positions from the published boundary table. */
export const BOUNDARY: { subject: string; position: string }[] = [
  {
    subject: 'Your aggregator',
    position: 'Stays exactly as it is. Finance OS sits beside it and does not replace, connect to or write into it.',
  },
  {
    subject: 'Lodgement',
    position: "Not included. Loans are lodged through your aggregator's software, as they are now.",
  },
  {
    subject: 'Serviceability and credit assessment',
    position:
      "Not included. Nothing in Finance OS calculates borrowing capacity for credit purposes or assesses a client's credit position.",
  },
  {
    subject: 'Compliance responsibility',
    position:
      'Yours. The platform can hold records and prompt for steps; your NCCP, Best Interests Duty and licensing obligations remain yours, and no configuration transfers them.',
  },
  {
    subject: 'Metered usage',
    position:
      'SMS, phone calls and some AI usage are charged on top of the subscription, at cost. Usage depends on your volume, so it is not included in the monthly figure.',
  },
]

/** The four things onboarding cannot start without. */
export const ONBOARDING_INPUTS = [
  'Branding',
  'A domain or subdomain',
  'Account access',
  'A decision on the phone number and sending address',
] as const

/* ── The instrument's own shape ──────────────────────────────────────────────
   Stated here rather than derived, so the showcase can document the audit without
   importing 435 questions into the main bundle. `npm run check:audit` fails if these
   drift from the real question bank, so they cannot go stale silently. */

export const AUDIT_SHAPE = {
  parts: 3,
  modules: 21,
  blocks: 82,
  questions: 424,
} as const

/** One line per part, for the showcase card row. */
export const AUDIT_PART_SUMMARY = [
  {
    id: 'discovery',
    kicker: 'Part one',
    title: 'Discovery',
    summary:
      'The business as it stands — who holds the licence, what the numbers actually are, where the work comes from, and what a client experiences end to end.',
    modules: 7,
    questions: 140,
  },
  {
    id: 'diagnosis',
    kicker: 'Part two',
    title: 'Diagnosis',
    summary:
      'The machine, measured against the built configuration — database, pipelines, capture, follow-up, conversation, lifecycle, compliance posture and what they can see.',
    modules: 10,
    questions: 219,
  },
  {
    id: 'handoff',
    kicker: 'Part three',
    title: 'Handoff',
    summary:
      'Scope, the four things onboarding cannot start without, the access pack for the hands-on pass, and the record of what was and was not agreed.',
    modules: 4,
    questions: 65,
  },
] as const
