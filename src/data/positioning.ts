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
 * Deliberately left out — not rendered by these surfaces, or not publishable:
 *   · Internal / founder-reported metrics and targets — the current-customer count and channel
 *     split, and the qualified-call progression-rate baseline and target.
 *     (The MFAA demographic and AXL search-demand figures ARE now rendered — by the gated Market
 *     Evidence surface (`marketEvidence` below), every figure carried through reported-not-verified
 *     with the `unverified` flags and the source/method disclosures intact, exactly as the gated
 *     brand page shows them. Admissible because ds.financeos.au is now login-gated like the brand
 *     page; never surface these on a public build.)
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

/* ── Market evidence (section 02 · "Who you are for") ──────────────────────────────
   The brand-research graphs the showcase visualises: positioning readiness, the customer
   snapshot, and AXL's Australian search-demand sample. EVERY figure here is reported, not
   verified — the `unverified` flags and the source/method strings are part of the data and
   must render with it (brand rule 09; audit-instrument honesty rules). These are founder /
   third-party research figures, admissible only because the DS is login-gated like the brand
   page. Sources: Finance OS partner pack · MFAA research · AXL Media SEO & Video Strategy
   Report, 8 October 2026. Verbatim where the document supplies wording. */

/** A customer-snapshot stat tile. `unverified` appends the reported-not-verified flag. */
export interface MarketStat {
  eyebrow: string
  /** count-up target; omit when `display` carries a non-numeric figure */
  value?: number
  display?: string
  prefix?: string
  suffix?: string
  decimals?: number
  /** group the figure's thousands (e.g. $126,941) */
  group?: boolean
  context: string
  unverified?: boolean
}

/** One row of AXL's keyword table. A dash (`—`) means the report supplied no value. */
export interface KeywordRow {
  kw: string
  searches: number
  cpc: string
  competition: string
}

export interface MarketEvidence {
  /** positioning-readiness ring: an accent arc fills to `pct`, figure counts to `value` */
  readiness: { pct: number; value: number; slash: string; sub: string; caption: string }
  founderQuestions: { value: number; caption: string }
  stats: MarketStat[]
  statsSources: string
  statsNotMeasured: string
  searchLead: string
  /** top AU themes by estimated monthly searches — the ranked bar chart */
  searchDemand: { label: string; value: number }[]
  /** AU vs NZ keyword counts — the split track */
  split: { label: string; value: number }[]
  keywords: KeywordRow[]
  searchMethod: string
  searchSourceCredit: string
}

export const marketEvidence: MarketEvidence = {
  readiness: {
    pct: 100,
    value: 10,
    slash: '/10',
    sub: 'decided',
    caption: 'Every positioning section decided and signed off.',
  },
  founderQuestions: { value: 0, caption: 'None outstanding · signed off 9 Nov 2026' },
  stats: [
    {
      eyebrow: 'Broker age · assumed',
      display: '35–50',
      context:
        'The Broker Ben construct’s assumed age, in a major Australian metro. Broker Ben is a hypothesis with no research sample behind it, so this is not measured customer data — actual age and location are',
      unverified: true,
    },
    {
      eyebrow: 'Sole operators · 2025',
      value: 43.2,
      decimals: 1,
      suffix: '%',
      context: 'of reported brokers were sole operators in calendar 2025 (vs 47.1% in 2024).',
    },
    {
      eyebrow: 'Median gross revenue · 2025',
      value: 126941,
      prefix: '$',
      group: true,
      context: 'median gross broker revenue in calendar 2025, before business costs. Personal income',
      unverified: true,
    },
    {
      eyebrow: 'Recommended start',
      display: 'A$297/mo + A$997',
      context:
        'Partner is the recommended starting point (monthly subscription and onboarding, incl. GST). Actual plan mix and spend',
      unverified: true,
    },
  ],
  statsSources:
    'Finance OS partner pack (Broker Ben — an internal construct and working hypothesis, not research; Market Context; Pricing and Tiers). MFAA research: mfaa.com.au/policy-and-advocacy/research',
  statsNotMeasured:
    'The age and metro profile come from the Broker Ben construct, a working hypothesis with no research sample behind it — not a measured customer profile. The MFAA figures are industry context. Australian mortgage and finance brokerage teams are the approved primary audience; actual customer demographics and segment sizes have yet to be measured. Australia is the launch market; New Zealand is an intended expansion market, with no launch date or localised readiness approved, and its keyword data is retained as research context only.',
  searchLead:
    'In AXL’s Australian sample, mortgage broker marketing and lead generation had the highest volumes. Broker software and CRM terms give the Compare pages more specific topics to address.',
  searchDemand: [
    { label: 'mortgage broker marketing', value: 170 },
    { label: 'mortgage lead generation', value: 110 },
    { label: 'mortgage broker software', value: 70 },
    { label: 'mortgage broker training', value: 70 },
    { label: 'mortgage technology', value: 30 },
  ],
  split: [
    { label: 'Australia · 24 keywords', value: 24 },
    { label: 'New Zealand · 20 keywords', value: 20 },
  ],
  keywords: [
    { kw: 'mortgage broker marketing', searches: 170, cpc: '$16.81', competition: 'Medium' },
    { kw: 'mortgage lead generation', searches: 110, cpc: '$11.14', competition: 'Medium' },
    { kw: 'mortgage broker software', searches: 70, cpc: '$20.83', competition: 'Medium' },
    { kw: 'mortgage broker training', searches: 70, cpc: '$7.55', competition: 'Medium' },
    { kw: 'mortgage technology', searches: 30, cpc: '—', competition: 'Low' },
    { kw: 'mortgage broker CRM', searches: 30, cpc: '$17.09', competition: 'Medium' },
    { kw: 'CRM for mortgage brokers', searches: 30, cpc: '$17.09', competition: 'Medium' },
    { kw: 'loan origination software', searches: 30, cpc: '$35.87', competition: 'Low' },
    { kw: 'AI for mortgage brokers', searches: 20, cpc: '$4.03', competition: 'Medium' },
    { kw: 'mortgage broker lead generation', searches: 20, cpc: '$19.48', competition: 'Medium' },
    { kw: 'mortgage broker social media', searches: 20, cpc: '—', competition: 'Low' },
    { kw: 'mortgage CRM software', searches: 10, cpc: '—', competition: 'Low' },
    { kw: 'finance broker CRM', searches: 10, cpc: '—', competition: '—' },
    { kw: 'CRM for finance brokers', searches: 10, cpc: '—', competition: '—' },
    { kw: 'best CRM for mortgage brokers', searches: 10, cpc: '$36.78', competition: 'High' },
    { kw: 'broker CRM software', searches: 10, cpc: '$81.44 *', competition: 'Medium' },
    { kw: 'finance CRM software', searches: 10, cpc: '—', competition: 'Low' },
    { kw: 'lending CRM', searches: 10, cpc: '—', competition: 'Low' },
    { kw: 'mortgage broker tools', searches: 10, cpc: '$5.72', competition: 'Medium' },
    { kw: 'aggregator CRM', searches: 10, cpc: '—', competition: 'Low' },
    { kw: 'finance broker software Australia', searches: 10, cpc: '$28.39', competition: 'Medium' },
    { kw: 'mortgage broker digital marketing', searches: 10, cpc: '$14.24', competition: 'High' },
    { kw: 'mortgage automation software', searches: 10, cpc: '—', competition: '—' },
    { kw: 'loan officer CRM', searches: 10, cpc: '$11.27', competition: 'Medium' },
  ],
  searchMethod:
    'Historical monthly search estimates from DataForSEO and Google Ads Keyword Planner, as reported by AXL Media. CPC is a paid-search estimate in local currency; the starred A$81.44 is a high bid; a dash means the report supplied no value. Related terms can overlap. These figures describe search behaviour and do not establish customer demand, ranking potential or Finance OS outcomes. New Zealand is retained as research context.',
  searchSourceCredit: 'AXL Media · Mortgage CRM SEO & Video Strategy Report · 8 October 2026',
}
