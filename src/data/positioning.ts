/**
 * Finance OS positioning data — the real brand-positioning wording the Phase 2 positioning
 * surfaces compose from. One typed source so the hero, the ten section "folders", the landscape
 * table, the From→To transformations, the voice this-vs-that, the brand rules and the platform
 * dashboard can never drift from the signed-off document.
 *
 * Source: Finance OS Brand Positioning (brand-positioning.json), founder-approved internal
 * edition v1.1, signed off by Tumai 9–10 November 2026. Wording is lifted verbatim where the
 * document supplies it (apostrophe glyphs preserved as written — straight in the voice lines,
 * typographic in the landscape lines). Voice per CLAUDE.md: Ruler 70 / Sage 30 — calm, clear,
 * grounded, authoritative, never hyped.
 *
 * Deliberately left out — not rendered by these seven surfaces, or not publishable:
 *   · Internal / founder-reported metrics and targets — the current-customer count and channel
 *     split, the MFAA and AXL demographic and search figures, and the qualified-call
 *     progression-rate baseline and target.
 *   · Deferred or blank blocks — option scoring scores (null), the supporting-proof list (blank),
 *     the measurement-setup table (empty), open questions (none).
 *   · Partner-pack legal / entity and commercial draft lines — the legal entity, template and
 *     prepared-by credits, and the AR Digital Solutions / Get360 competitor-pricing reference.
 *   · Confidential voice-of-customer material — the real client names and verbatim quotes from
 *     live delivery and onboarding calls; private data, not for a showcase surface.
 *   · Out of these surfaces' scope — the plan / pricing tables, the comparison scoring method,
 *     the audit-example client data, the website sitemap and the implementation task list.
 *
 * The dashboard figures, task list and customer names are invented for the showcase demo and are
 * marked illustrative — broker vocabulary comes from the positioning, the numbers and people do
 * not. Never present them as measured results or real customers (brand rule, section 09).
 */

/** Hero — the background hero with the fuzzy search bar. Headline + highlight are the approved
 *  positioning line (section 05); signoff is the brand-wide signature (section 09). Placeholder
 *  is search-bar chrome; the tags are the four real positioning options (section 05). */
export interface Hero {
  overline: string
  headline: string
  /** The phrase inside `headline` that takes the Atlas Blue type highlight. */
  highlight: string
  signoff: string
  searchPlaceholder: string
  searchTags: string[]
}

export const hero: Hero = {
  overline: 'Finance OS · Brand Positioning',
  headline: 'Set up your CRM around how your brokerage actually works.',
  highlight: 'how your brokerage actually works',
  signoff: 'Remembered. Referred. Respected.',
  searchPlaceholder: 'Search the positioning — audience, landscape, voice…',
  searchTags: [
    'Control of client relationships',
    'Built for broking',
    'Alongside the aggregator',
    'Campaigns and new enquiries',
  ],
}

/** The ten positioning sections, rendered as the folders. `status` maps the document's per-section
 *  state: a fully-decided section is `decided`; a section still carrying deferred or illustrative
 *  sub-blocks is `open` (the document is founder-signed-off overall, with no open questions). */
export type SectionStatus = 'decided' | 'open'

export interface PositioningSection {
  n: string
  title: string
  status: SectionStatus
}

export const sections: PositioningSection[] = [
  { n: '01', title: 'Your business', status: 'decided' },
  { n: '02', title: 'Who you are for', status: 'decided' },
  { n: '03', title: 'The landscape', status: 'open' },
  { n: '04', title: 'Brand transformations', status: 'decided' },
  { n: '05', title: 'Positioning options', status: 'open' },
  { n: '06', title: 'Values and personality', status: 'decided' },
  { n: '07', title: 'Voice and tone', status: 'decided' },
  { n: '08', title: 'Existing equity audit', status: 'open' },
  { n: '09', title: 'Brand rules', status: 'open' },
  { n: '10', title: 'How we will know it is working', status: 'open' },
]

/** The landscape — arena one, the sale (section 03). The competitor rows for the this-vs-that
 *  table; each line is what the buyer weighs the alternative against, not a claim about us. */
export interface Competitor {
  who: string
  line: string
  goodAt: string
  weakAt: string
}

export const landscape: Competitor[] = [
  {
    who: 'HubSpot',
    line: 'General-purpose CRM',
    goodAt: 'Contact management and sales pipelines.',
    weakAt: 'Compare the work required to configure the brokerage campaign workflow.',
  },
  {
    who: 'Salesforce',
    line: 'General-purpose CRM',
    goodAt: 'Sales pipeline management and reporting.',
    weakAt: 'Compare the work required to configure the brokerage campaign workflow.',
  },
  {
    who: 'Asana',
    line: 'Work management used as an enquiry tracker',
    goodAt: 'Organises tasks, ownership and stages on project boards.',
    weakAt: 'Compare the team’s existing setup with a CRM that connects campaign capture to its pipeline.',
  },
  {
    who: 'ClickUp',
    line: 'Work management used as an enquiry tracker',
    goodAt: 'Organises tasks and projects across the team.',
    weakAt: 'Compare how the brokerage links campaign enquiries to its pipeline.',
  },
  {
    who: 'monday.com',
    line: 'Work Management boards used as an enquiry tracker',
    goodAt: 'Flexible boards. monday.com also offers a separate CRM product.',
    weakAt: 'Distinguish the brokerage’s actual board setup from monday CRM when comparing.',
  },
]

/** Source line for the landscape table — reported, not verified (section 03). */
export const landscapeFootnote =
  'Founder-identified alternatives, 9 November 2026. Product categories checked against vendor documentation. This is a buying-context hypothesis, with no measured adoption or comparative outcome claimed.'

/** Brand transformations — the shifts the brand makes, as from and to (section 04). */
export interface Transformation {
  from: string
  to: string
}

export const transformations: Transformation[] = [
  { from: 'A lead-generation headline on its own', to: 'Campaigns, enquiry capture and the pipeline that follows' },
  { from: 'Generic software description', to: 'Configured for broking' },
  { from: 'Unclear aggregator relationship', to: 'Fits alongside it' },
  { from: 'Different audiences for the plans', to: 'Three plan choices for the priority brokerage team' },
  { from: 'Feature lists', to: 'Search-led education and workflow demonstrations' },
  { from: 'Outcome assumptions', to: 'Documented evidence' },
  { from: 'General software enquiries', to: 'Informed brokerage buyers' },
  { from: 'Tools without implementation', to: 'A working brokerage process' },
]

/** Voice — what it sounds like, and what it never sounds like (section 07). The this-vs-that pair. */
export interface Voice {
  soundsLike: string[]
  doesNot: string[]
}

export const voice: Voice = {
  soundsLike: [
    'See where each enquiry stands.',
    'Take your client records with you.',
    'Keep your existing aggregator in place.',
    'We\'ll walk through what\'s included in setup.',
  ],
  doesNot: [
    'Transform your entire business overnight.',
    'Own the whole platform.',
    'Replace everything in one click.',
    'Get guaranteed results from day one.',
  ],
}

/** Brand rules — what we always do, and the lines we do not cross (section 09). */
export interface Rules {
  alwaysDo: string[]
  doNotCross: string[]
}

export const rules: Rules = {
  alwaysDo: [
    'Name the audience and offer.',
    'Describe the actual workflow.',
    'State what stays with the aggregator.',
    'Describe data portability precisely.',
    'Verify plan terms before publishing.',
    'Use dated evidence for claims.',
    'Ask before using identifiable client material.',
    'Disclose the product and editorial relationship where relevant.',
  ],
  doNotCross: [
    'Use unsupported rankings.',
    'Promise more leads or faster results without proof.',
    'Imply an aggregator integration.',
    'Imply credit or compliance responsibility transfers.',
    'Identify clients in examples shared in general terms.',
    'Present proposed AI features or new markets as available.',
    'Present stock or generated people as real customers.',
  ],
}

/** The platform dashboard — the flip-card demo. Broker vocabulary (enquiry, deal, settlement,
 *  follow-up) and pipeline stages are from the positioning and the eight platform pillars; every
 *  figure, task and customer below is invented sample data for the showcase, not a real record. */
export type TaskStatus = 'scheduled' | 'due' | 'overdue'

export interface DashboardStat {
  label: string
  value: number
  prefix?: string
  suffix?: string
  caption: string
}

export interface DashboardPoint {
  label: string
  value: number
}

export interface DashboardTask {
  title: string
  due: string
  /** Exactly one `overdue` row — the single amber attention moment this view is allowed. */
  status: TaskStatus
}

export interface DashboardCustomer {
  name: string
  stage: string
  value: number
}

export interface Dashboard {
  note: string
  title: string
  stats: DashboardStat[]
  pipeline: { label: string; points: DashboardPoint[] }
  tasks: DashboardTask[]
  customers: DashboardCustomer[]
}

export const dashboard: Dashboard = {
  note: 'Illustrative sample figures for the platform dashboard demo — broker vocabulary from the positioning; the numbers, tasks and customer names are invented for the showcase, not measured data or real clients.',
  title: 'Your brokerage, this month',
  stats: [
    { label: 'New enquiries', value: 24, caption: 'Captured this month' },
    { label: 'Active deals', value: 18, caption: 'Across the pipeline' },
    { label: 'Settlements', value: 7, caption: 'Settled this month' },
    { label: 'Pipeline value', value: 6.4, prefix: '$', suffix: 'M', caption: 'In active deals' },
  ],
  pipeline: {
    label: 'Enquiries · last 8 weeks',
    points: [
      { label: 'W1', value: 12 },
      { label: 'W2', value: 16 },
      { label: 'W3', value: 14 },
      { label: 'W4', value: 19 },
      { label: 'W5', value: 17 },
      { label: 'W6', value: 22 },
      { label: 'W7', value: 20 },
      { label: 'W8', value: 24 },
    ],
  },
  tasks: [
    { title: '30-day check-in call', due: 'Today', status: 'due' },
    { title: 'Chase outstanding documents', due: 'Overdue · 2 days', status: 'overdue' },
    { title: 'Send fact find', due: 'Tomorrow', status: 'scheduled' },
    { title: 'Fixed-rate expiry review', due: 'In 3 days', status: 'scheduled' },
    { title: 'Review invitation', due: 'This week', status: 'scheduled' },
  ],
  customers: [
    { name: 'A. Nguyen', stage: 'Application', value: 540000 },
    { name: 'M. Patel', stage: 'Approved', value: 720000 },
    { name: 'S. Brooks', stage: 'Qualifying', value: 410000 },
    { name: 'L. Chen', stage: 'New enquiry', value: 380000 },
    { name: 'J. Williams', stage: 'Settled', value: 615000 },
  ],
}
