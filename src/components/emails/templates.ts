/**
 * Client email templates — the transactional and relationship emails a broker sends a borrower
 * through Finance OS, distinct from the sending-domain warm-up sequence. Four client moments:
 * pre-approval confirmation, settlement, the annual-review / rate-change nudge, and a review ask.
 *
 * Content is data. Both the plain-text and the standalone HTML body render from the same `blocks`
 * (`./render`), so the two can never drift. Every client-specific figure is a merge field, never a
 * literal: the email states only what the lender or client has reported, resolved from the record
 * at send time — never a Finance OS figure, result or guarantee. Voice per CLAUDE.md, Ruler 70 /
 * Sage 30: calm, clear, grounded, authoritative, never hyped. Australian spelling throughout.
 *
 * Sender entity is ONESTAAACK A.I PTY LTD (Finance OS is its product). The footer identifies the
 * sender and names the credit licensee, and no template asserts an outcome or offers an inducement.
 */

/**
 * The email palette: Finance OS semantic tokens resolved to hex. Email has no CSS variables, so
 * this is the one place a token may be a literal — re-derive from `src/styles/tokens.css` LAYER 2,
 * never hand-tune. The status tints are the soft tokens composited over white to a solid hex, so
 * they survive the mail clients that drop rgba().
 */
export const MAIL = {
  ground: '#F6F7F9', // --c-canvas-muted   off-white rhythm ground
  surface: '#FFFFFF', // --c-canvas         the card
  well: '#F6F7F9', // --c-inset          summary / quoted rows
  line: '#E6E8EC', // --c-border         hairline
  fg: '#14161B', // --c-fg             headlines
  body: '#474E5C', // --c-fg-muted       body copy
  meta: '#646C7D', // --c-fg-subtle      eyebrow, footer
  accent: '#33488F', // --c-accent         Atlas Blue: links + the one filled CTA
  accentFg: '#FFFFFF', // --c-accent-fg      white label on the blue fill
  // status tints — amber is attention/pending only, success is a functional signal, blue informs
  amberSoft: '#F9EFE0', // --c-amber-soft over white
  amberText: '#8A5A0F', // --c-amber-text   AA on the amber tint
  successSoft: '#E2F1EC', // --c-success-soft over white
  successText: '#0E6B49', // --p-green-700
  blueSoft: '#E7E9F2', // --c-accent-soft over white
} as const

/**
 * Merge fields, with the plain-English gloss the showcase shows beside each. GHL resolves them in
 * both bodies at send time. `{{contact.*}}` is the borrower's record; `{{user.*}}` is the assigned
 * broker. No figure, date or name is ever written into a template — it is always one of these.
 */
export const MERGE_GLOSS: Record<string, string> = {
  '{{contact.first_name}}': 'Client first name',
  '{{contact.lender}}': 'Lender on the application',
  '{{contact.loan_amount}}': 'Approved / loan amount',
  '{{contact.property_address}}': 'Security property address',
  '{{contact.preapproval_expiry}}': 'Date the pre-approval holds until',
  '{{contact.first_repayment_date}}': 'First repayment date',
  '{{contact.settlement_date}}': 'Settlement date',
  '{{contact.fixed_expiry}}': 'Fixed-term end date',
  '{{contact.manage_link}}': 'Manage-email-preferences link',
  '{{user.name}}': 'Assigned broker name',
  '{{user.phone}}': 'Broker direct number',
  '{{user.calendar_link}}': 'Broker booking link',
  '{{user.review_link}}': 'Review / listing link',
  '{{user.vcard_link}}': 'Save-contact (vCard) link',
  '{{user.licensee}}': 'Credit licensee name',
  '{{user.acl_number}}': 'Australian Credit Licence number',
}

/**
 * The sender block. The Spam Act 2003 requires a commercial message to identify its sender with
 * current contact details; this block does that. The entity and PO Box match the warm-up section.
 */
export const SENDER = {
  legal: 'Finance OS is a product of ONESTAAACK A.I PTY LTD.',
  address: 'PO Box 8439, Tarneit VIC 3029',
  email: 'hello@financeos.au',
} as const

/** Status tones — only `amber` is attention/pending, and only one template uses it. */
export type StatusTone = 'amber' | 'success' | 'blue' | 'neutral'
export interface Status {
  label: string
  tone: StatusTone
}

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'h'; text: string }
  | { kind: 'summary'; title: string; rows: { label: string; value: string }[] }
  | { kind: 'cta'; label: string; url: string; trust: string }

export interface ClientEmail {
  n: number
  slug: string
  /** short noun for the client moment this serves — the tile title and header label */
  moment: string
  /** one short line for the overview tile */
  sends: string
  /** the longer "when this sends" note inside the template */
  trigger: string
  status: Status
  subject: string
  preheader: string
  blocks: Block[]
  signoff: string[]
  /** the general-information + licensee line in the footer — merge-field based, routes to the licensee */
  compliance: string
}

const p = (text: string): Block => ({ kind: 'p', text })
const h = (text: string): Block => ({ kind: 'h', text })

/** Shared across every template — general information, no advice asserted, licensee named. */
const COMPLIANCE =
  'This email is general information, not credit advice. Any recommendation follows a full assessment of your circumstances. {{user.name}} is a credit representative of {{user.licensee}} (Australian Credit Licence {{user.acl_number}}).'

const SIGN = ['{{user.name}}', 'Finance OS · {{user.phone}}']

export const TEMPLATES: ClientEmail[] = [
  {
    n: 1,
    slug: 'pre-approval',
    moment: 'Pre-approval',
    sends: 'Sent when a conditional pre-approval lands.',
    trigger:
      'Fires when a lender returns a conditional pre-approval. It confirms the decision in writing, shows what is and is not locked in, and names the next two steps — without implying the finance is final.',
    status: { label: 'Conditional', tone: 'amber' },
    subject: 'Your pre-approval has come through',
    preheader: 'What is locked in, what is still conditional, and the next two steps.',
    blocks: [
      p('Hi {{contact.first_name}},'),
      p(
        'Good news — {{contact.lender}} has issued a conditional pre-approval on your application. In plain terms, they have looked at your position and indicated how much they are prepared to lend, subject to a few final checks.',
      ),
      {
        kind: 'summary',
        title: 'Your pre-approval',
        rows: [
          { label: 'Lender', value: '{{contact.lender}}' },
          { label: 'Approved amount', value: '{{contact.loan_amount}}' },
          { label: 'Held until', value: '{{contact.preapproval_expiry}}' },
        ],
      },
      h('What this does, and does not, mean'),
      p(
        'Conditional means the lender still needs to value the property and confirm the details on file before anything is formal. It is a strong signal, not a guarantee — so keep your deposit and paperwork where they are, and hold off on any new credit or large purchases until we settle.',
      ),
      h('The next two steps'),
      p(
        'Send through anything still outstanding from your document list, and tell me the moment you are close to making an offer. I take it to full approval from there.',
      ),
      {
        kind: 'cta',
        label: 'Talk through your options',
        url: '{{user.calendar_link}}',
        trust: 'A quick call if you want to walk through what to offer.',
      },
    ],
    signoff: SIGN,
    compliance: COMPLIANCE,
  },
  {
    n: 2,
    slug: 'settlement',
    moment: 'Settlement',
    sends: 'Sent the day the loan settles.',
    trigger:
      'Fires on the settlement date. It confirms the loan is active, explains the first repayment, and positions the broker — not the bank — as the client’s first call from here.',
    status: { label: 'Settled', tone: 'success' },
    subject: 'Settled — the loan is now active',
    preheader: 'What happens with your first repayment, and who to call.',
    blocks: [
      p('Hi {{contact.first_name}},'),
      p(
        'It is done. {{contact.lender}} settled your loan today, which means {{contact.property_address}} is formally yours. Congratulations — this is the part worth pausing on.',
      ),
      {
        kind: 'summary',
        title: 'Your loan',
        rows: [
          { label: 'Lender', value: '{{contact.lender}}' },
          { label: 'Loan amount', value: '{{contact.loan_amount}}' },
          { label: 'First repayment', value: '{{contact.first_repayment_date}}' },
        ],
      },
      h('What happens next'),
      p(
        'Your first repayment comes out on the date above, and your lender will send your account details and opening statement directly. You do not need to set any of that up — it is already in place.',
      ),
      p(
        'Keep this email. If a statement ever looks off, or your situation changes, I am the person to call before you call the bank.',
      ),
      {
        kind: 'cta',
        label: 'Save my details',
        url: '{{user.vcard_link}}',
        trust: 'One tap to keep my number in your phone.',
      },
    ],
    signoff: SIGN,
    compliance: COMPLIANCE,
  },
  {
    n: 3,
    slug: 'annual-review',
    moment: 'Annual review',
    sends: 'Sent around the loan anniversary.',
    trigger:
      'Scheduled around the loan anniversary, or as a fixed term nears its end. It invites a review as a check, not a sales push — a change is only suggested where the client’s own numbers support one.',
    status: { label: 'Annual review', tone: 'blue' },
    subject: 'Time for your annual loan review',
    preheader: 'Fifteen minutes to check the loan still fits. No obligation to change a thing.',
    blocks: [
      p('Hi {{contact.first_name}},'),
      p(
        'It has been about a year since your loan settled with {{contact.lender}}, and a year is long enough for things to move — your income, your plans, and the rates and policies lenders are offering.',
      ),
      p(
        'A review is simply a check that the loan you have is still the right one. Sometimes the answer is to leave it exactly as it is. Sometimes there is a better structure available. I will only suggest a change if the numbers for your situation actually support one.',
      ),
      {
        kind: 'summary',
        title: 'On file for your review',
        rows: [
          { label: 'Current lender', value: '{{contact.lender}}' },
          { label: 'Settled', value: '{{contact.settlement_date}}' },
          { label: 'Fixed term ends', value: '{{contact.fixed_expiry}}' },
        ],
      },
      p(
        'If your fixed term is coming to an end, this is the right time to look. The window before it rolls to a variable rate is when the options are widest.',
      ),
      {
        kind: 'cta',
        label: 'Book your review',
        url: '{{user.calendar_link}}',
        trust: 'Fifteen minutes. No obligation to change anything.',
      },
    ],
    signoff: SIGN,
    compliance: COMPLIANCE,
  },
  {
    n: 4,
    slug: 'review-request',
    moment: 'Review request',
    sends: 'Sent a little after settlement.',
    trigger:
      'Sent a little after settlement, once things have settled down. It asks for a short review, offers nothing in return, and makes it easy to decline.',
    status: { label: 'Thank you', tone: 'neutral' },
    subject: 'Would you mind sharing how it went?',
    preheader: 'A short review helps the next person find a broker they can trust. Entirely optional.',
    blocks: [
      p('Hi {{contact.first_name}},'),
      p('Now that everything has settled, I have one small ask — and it is genuinely optional.'),
      p(
        'Most people find a broker through someone they trust. If the process felt clear and you would be comfortable recommending it, a short review is the most useful thing you can do for the next person weighing it up.',
      ),
      p(
        'It takes a minute, and there is no need to be elaborate — a line or two about how it felt to work through is plenty. If now is not the time, that is completely fine; you can ignore this.',
      ),
      {
        kind: 'cta',
        label: 'Leave a review',
        url: '{{user.review_link}}',
        trust: 'A minute, and only if it was a good experience.',
      },
    ],
    signoff: SIGN,
    compliance: COMPLIANCE,
  },
]

export interface ComplianceRule {
  title: string
  text: string
}

/** The discipline every client template keeps — the DS-side documentation of why these are safe. */
export const COMPLIANCE_RULES: ReadonlyArray<ComplianceRule> = [
  {
    title: 'Every figure is a merge field',
    text: 'No amount, rate or date is written into a template. Each resolves from the client record at send, so the email states only what the lender or client has reported — never a Finance OS figure or result.',
  },
  {
    title: 'No outcome is guaranteed',
    text: 'Pre-approval is shown as conditional and subject to valuation. A review is framed as a check, not a promised saving. Nothing here commits the lender or quantifies a benefit.',
  },
  {
    title: 'Advice follows assessment',
    text: 'The templates carry general information. Any recommendation is made only after assessing the client’s circumstances, and the footer names the credit licensee the broker operates under.',
  },
  {
    title: 'The sender is identified',
    text: 'Every send carries the ONESTAAACK A.I PTY LTD sender block and a working preferences link, so the Spam Act is satisfied without stripping the footer to make a send look cleaner.',
  },
  {
    title: 'No inducement for a review',
    text: 'The review ask offers nothing in return and is explicitly optional. It invites honesty rather than a rating, which keeps it clear of the rules on incentivised reviews.',
  },
  {
    title: 'The broker owns the relationship',
    text: 'Each template routes the client back to their broker, not to a bank queue or a generic inbox — the settlement note makes the broker the first call, which is the point of the sequence.',
  },
]
