/**
 * The Finance OS sending-domain warm-up sequence: six emails over 24 days, written to earn a new
 * sub-domain a reputation rather than to sell anything.
 *
 * One source per email: `blocks` render BOTH the plain-text and the HTML body
 * (`src/lib/warmup-render.ts`), so the two can never drift.
 *
 * Copy is grounded in the Finance OS business plan (Drive
 * 1qdm2MYUAmChOJQNWiY1D1bXKVJXc7rAbUTsok3fH3XM, modified 2026-01-18): the three customer problems
 * in the plan's own order of priority, the three solution kits, and the "Remembered. Referred.
 * Respected." positioning. Voice per CLAUDE.md: Ruler 70 / Sage 30, calm, clear, grounded,
 * authoritative, never hyped.
 *
 * Nothing in the plan's metrics section is publishable. The MRR goal, the traffic figure, the
 * cost per lead and the conversion counts are internal targets, not results, and no Finance OS
 * client outcome is recorded anywhere. Every argument below is structural for that reason.
 */

/**
 * The email palette: Finance OS semantic tokens resolved to hex. Email has no CSS variables, so
 * this is the one place in the repo a token may be a literal. Re-derive from
 * `src/styles/tokens.css` LAYER 2, never hand-tune.
 */
export const MAIL = {
  ground: '#F6F7F9', // --c-canvas-muted   the off-white rhythm ground
  surface: '#FFFFFF', // --c-canvas         the card
  well: '#F6F7F9', // --c-inset          quoted / tool rows
  line: '#E6E8EC', // --c-border         hairline
  fg: '#14161B', // --c-fg             headlines
  body: '#474E5C', // --c-fg-muted       body copy
  meta: '#646C7D', // --c-fg-subtle      eyebrow, footer
  accent: '#33488F', // --c-accent         Atlas Blue: links and the one filled CTA
  accentFg: '#FFFFFF', // --c-accent-fg      white label on the blue fill
  gold: '#EEBA2B', // --p-gold-300       Signal Gold: the wordmark rule only
} as const

/** GHL merge fields. LC Email resolves these in both bodies. */
export const MERGE = {
  firstName: '{{contact.first_name}}',
  unsubscribe: '{{unsubscribe_link}}',
} as const

/**
 * The sender block. The Spam Act 2003 requires a commercial message to identify its sender with
 * current contact details; this block is what satisfies it. The PO Box is the business's own,
 * confirmed by the owner on 18 September 2026.
 */
export const SENDER = {
  legal: 'Finance OS is a product of Team OS Pty Ltd.',
  address: 'PO Box 8439, Tarneit VIC 3029',
  email: 'hello@financeos.au',
} as const

/** Destinations. Every URL below returned 200 on 18 September 2026 — none is a placeholder. */
export const LINKS = {
  demo: 'https://www.financeos.au/demo',
  calculators: 'https://www.financeos.au/discover/assets/calculators',
  funnels: 'https://www.financeos.au/discover/assets/funnels',
  quiz: 'https://www.financeos.au/quiz',
} as const

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'h'; text: string }
  | { kind: 'tool'; name: string; url: string; text: string }
  | { kind: 'cta'; label: string; url: string; trust: string }

export interface WarmupEmail {
  n: number
  /** Days after the sequence starts. */
  day: number
  slug: string
  subject: string
  /** Alternates to A/B once the domain is warm. Never on the first two sends. */
  altSubjects: string[]
  preheader: string
  /** The job this send does for the domain, not for the reader. */
  role: string
  /** Links in the body. Held at zero until day 18. */
  links: number
  blocks: Block[]
  /** Truthfully completes "You are receiving this because …". */
  reason: string
  signoff: string[]
}

const p = (text: string): Block => ({ kind: 'p', text })

const SIGN = ['Ariki', 'Finance OS']

export const WARMUP: WarmupEmail[] = [
  {
    n: 1,
    day: 0,
    slug: 'new-address',
    subject: 'A new address, and what it is for',
    altSubjects: ['Hello from a new address', 'Finance OS, first note'],
    preheader: 'Nothing to click. Thirty seconds, and a question at the end.',
    role: 'Lands from the new sub-domain and asks for a reply. No link, no image, no offer. A reply is the strongest signal a young sending domain can earn, and the cheapest one to ask for.',
    links: 0,
    reason: 'you gave us your address and asked to hear from Finance OS',
    blocks: [
      p(`Hi ${MERGE.firstName},`),
      p('Short one, and there is nothing to click.'),
      p('This is the first message from a new address. Finance OS builds the marketing, operations and retention systems Australian brokers run their businesses on.'),
      p('It is going out on its own, ahead of anything else, so the address arrives before the content does. A new sending address with no history behind it tends to land in the wrong tab, and once it is there it stays.'),
      p('Five more follow over the next few weeks. They cover the three things that cap a broking business: leads that arrive unevenly, admin that eats the week, and the client relationships that quietly end at settlement.'),
      p('If you have thirty seconds, reply and tell me which of those three costs you most at the moment. I read all of them.'),
    ],
    signoff: SIGN,
  },
  {
    n: 2,
    day: 4,
    slug: 'lead-flow',
    subject: 'The month the enquiries stop',
    altSubjects: ['Referrals are not a pipeline', 'Where next month’s settlements come from'],
    preheader: 'The first problem, and the one the business plan says to fix first.',
    role: 'Problem one. Still zero links, so the body earns the read time instead of spending it.',
    links: 0,
    reason: 'you gave us your address and asked to hear from Finance OS',
    blocks: [
      p(`Hi ${MERGE.firstName},`),
      p('Most broking businesses do not have a lead problem. They have a lead rhythm problem.'),
      p('The work arrives through referrals, a past client, an agent who liked the last settlement. All of it real, none of it scheduled. A strong month is followed by a thin one, and the thin one is not a signal about the market. It is a signal that nothing was running while you were busy.'),
      p('The uncomfortable part is that the fix is unglamorous. It is not a new channel. It is one route in that works the same way every week, whether or not you are at the desk that day.'),
      p('Everything else in a broking business is downstream of that. Capacity planning, hiring, whether you can take a fortnight off. All of it assumes you know roughly what next month looks like.'),
      p('Reply with how you get most of your enquiries now. I will tell you what I would put underneath it.'),
    ],
    signoff: SIGN,
  },
  {
    n: 3,
    day: 8,
    slug: 'admin-load',
    subject: 'The hours that do not show up on a settlement',
    altSubjects: ['Where the week actually goes', 'Admin is not the job'],
    preheader: 'The second problem. Not the volume of work. The kind of it.',
    role: 'Problem two. Structural argument only: the business plan carries no measured time saving, so none is claimed.',
    links: 0,
    reason: 'you gave us your address and asked to hear from Finance OS',
    blocks: [
      p(`Hi ${MERGE.firstName},`),
      p('Chasing a document. Re-keying the same client detail into a third system. Writing the follow-up you have written four hundred times. Reminding someone about the thing you reminded them about on Tuesday.'),
      p('None of it is hard. That is exactly the problem. Work that is not hard does not feel worth systematising, so it never gets systematised, and it takes the hours that the high-value work needed.'),
      p('The test is straightforward. Look at yesterday and mark every task that only you could have done. Most brokers find the marked list is short, and the unmarked list took the day.'),
      p('I am not going to tell you how many hours that is. Your number is not mine, and you can count yours more accurately than I can guess it.'),
      p('Reply with the one task you would hand over first if handing it over were free.'),
    ],
    signoff: SIGN,
  },
  {
    n: 4,
    day: 13,
    slug: 'after-settlement',
    subject: 'What happens after settlement',
    altSubjects: ['The relationship that ends at the wrong moment', 'Remembered, referred, respected'],
    preheader: 'The third problem, and the one almost everyone leaves alone.',
    role: 'Problem three, and the last send before the domain has enough history to carry links. By now four clean sends sit behind it.',
    links: 0,
    reason: 'you gave us your address and asked to hear from Finance OS',
    blocks: [
      p(`Hi ${MERGE.firstName},`),
      p('A loan settles. The client is delighted. You are already on the next file.'),
      p('Then nothing, for four years, until they refinance with whoever emailed them in the meantime.'),
      p('This is the third problem and it is the one most broking businesses never get to, because it is the only one that is not urgent. Nobody rings to complain that you did not stay in touch. They simply go somewhere else, and it reads as bad luck rather than as a gap in the system.'),
      p('The mechanism is dull and it works: a small number of messages that arrive at the moments that matter to the borrower rather than to you. Settlement anniversary. A rate movement that changes their position. A fixed term coming to an end.'),
      p('Remembered, referred, respected. That is the order it happens in, and it starts with being remembered.'),
      p('Reply and tell me what you currently send a client in the year after settlement. If the honest answer is nothing, that is the most common one.'),
    ],
    signoff: SIGN,
  },
  {
    n: 5,
    day: 18,
    slug: 'three-tools',
    subject: 'Three things you can use without talking to us',
    altSubjects: ['Tools, not a pitch', 'Useful whether or not you ever reply'],
    preheader: 'First links in eighteen days. All three are free and need no account.',
    role: 'First multi-link send. By day 18 the domain has four clean sends of history behind it, which is what makes three links survivable. Every destination was verified live before it was written in.',
    links: 3,
    reason: 'you gave us your address and asked to hear from Finance OS',
    blocks: [
      p(`Hi ${MERGE.firstName},`),
      p('Four emails without a link. Here are three, and all of them are useful whether or not you ever reply to me.'),
      {
        kind: 'tool',
        name: 'The calculator set',
        url: LINKS.calculators,
        text: 'Repayments, borrowing power, offset, stamp duty, LMI, upfront costs, first-home schemes. Twelve of them, built for Australian conditions. Send a client a link instead of a screenshot of a spreadsheet.',
      },
      {
        kind: 'tool',
        name: 'The funnel library',
        url: LINKS.funnels,
        text: 'The capture pages and follow-up flows behind the lead-rhythm problem in the second email. Take the structure even if you never use the software.',
      },
      {
        kind: 'tool',
        name: 'The fit quiz',
        url: LINKS.quiz,
        text: 'Six minutes, and it tells you which of the three problems to fix first in your business specifically. It will tell you to fix something other than software if that is the honest answer.',
      },
      p('No account, no card, nothing gated. If one of them is useful, that is the entire purpose of this email.'),
    ],
    signoff: SIGN,
  },
  {
    n: 6,
    day: 24,
    slug: 'open-door',
    subject: 'Open door',
    altSubjects: ['Thirty minutes, if it is useful', 'The one ask'],
    preheader: 'Six emails, and this is the only one that asks for anything.',
    role: 'The one ask. Carries the sequence’s only filled CTA and an explicit way to decline without unsubscribing, which protects the list the next campaign runs on.',
    links: 1,
    reason: 'you gave us your address and asked to hear from Finance OS',
    blocks: [
      p(`Hi ${MERGE.firstName},`),
      p('Last one in this series, and it is the only one that asks for anything.'),
      p('If the lead rhythm, the admin load or the silence after settlement described your business, a walkthrough is the fastest way to find out whether there is anything here worth your time. Thirty minutes. We look at how your business runs now, and I tell you which of the three I would fix first and why.'),
      p('If it is not a fit I will say so on the call. A bad fit costs me more than it costs you.'),
      {
        kind: 'cta',
        label: 'Book a walkthrough',
        url: LINKS.demo,
        trust: 'Thirty minutes. No deck, no obligation.',
      },
      p('If the timing is wrong, reply with "not now" and it goes quiet until you say otherwise. You do not have to unsubscribe to stop hearing from me.'),
    ],
    signoff: SIGN,
  },
]

export interface PlanRow {
  window: string
  sends: string
  segment: string
  cap: string
}

/** The ramp. Volume, not copy, is what actually warms a domain. */
export const PLAN: PlanRow[] = [
  { window: 'Days 1–4', sends: 'Email 1', segment: 'Replied to a person here in the last 90 days', cap: '50 / day' },
  { window: 'Days 5–11', sends: 'Emails 1–2', segment: 'Add: opened or clicked in the last 180 days', cap: '150 / day' },
  { window: 'Days 12–17', sends: 'Emails 2–3', segment: 'Add: engaged in the last 365 days', cap: '400 / day' },
  { window: 'Days 18–24', sends: 'Emails 4–5', segment: 'Add: clients and past clients, any date', cap: '800 / day' },
  { window: 'Day 25 on', sends: 'Email 6, then normal broadcasts', segment: 'Everything left that is not suppressed', cap: '1,500 / day' },
]

/** Pre-flight and in-flight rules. Each one is a thing that sinks a new sending domain. */
export const RULES: ReadonlyArray<{ title: string; text: string }> = [
  {
    title: 'Authenticate before the first send',
    text: 'SPF, DKIM and a custom return-path on the sending sub-domain, plus a DMARC record at p=none on the root. Send nothing until all three verify green in the LC Email domain panel.',
  },
  {
    title: 'The footer is not optional',
    text: 'Every send carries the sender block (Team OS Pty Ltd, PO Box 8439 Tarneit, hello@financeos.au), a working unsubscribe, and a reason line that is true of the person reading it. The Spam Act wants the sender identified and the exit working; the footer this section renders does both, so never strip it to make a send look cleaner.',
  },
  {
    title: 'Suppress before you segment',
    text: 'Remove hard bounces, role addresses (info@, admin@, accounts@, reception@), anything that has not engaged in two years, and every address that came from a list you did not collect yourself. An aggregator directory is not a list you collected.',
  },
  {
    title: 'Warmest first, always',
    text: 'The ramp is ordered by engagement recency, not by import date and not alphabetically. The first sends go to the people most likely to open and reply: past clients and brokers who have actually corresponded with someone here.',
  },
  {
    title: 'Hold the links',
    text: 'Emails 1 to 4 carry no link in the body at all, and email 6 carries exactly one. Link-heavy mail from a domain with no history is the fastest way into the spam folder.',
  },
  {
    title: 'No figure, no result, no proof',
    text: 'The business plan’s MRR goal, traffic figure and cost per lead are internal targets, not results, and no client outcome is recorded. Nothing here quantifies a saving or a gain. Every argument is structural, which also happens to read better.',
  },
  {
    title: 'Never name a competitor',
    text: 'A sentence about how long a rival takes to set up is a claim about someone else’s business with no dated evidence behind it. The plan names three competitors for positioning; none of them belongs in outbound mail.',
  },
  {
    title: 'No credit or financial advice',
    text: 'Finance OS sells systems to brokers. It does not advise on credit, and nothing in a warm-up send should read as guidance on a loan, a rate or a borrower’s position. The calculators are the broker’s tool to hand on, not our recommendation.',
  },
]
