/**
 * Discovery, modules 01 and 02 — the shape of the brokerage, then its numbers.
 *
 * These two open the call because everything downstream is priced off them. Module 01
 * establishes who holds the credit licence, who sits under it and where the clients
 * physically are, which decides the user model, the approval chain and whether a send
 * window can be set on one clock. Module 02 is the commercial machine, and it is asked in
 * figures on purpose: the database carries no current-state size band for any rung, so the
 * numbers captured here are net-new every time. Where a figure cannot be produced, that is
 * the finding, and the instrument records it as one rather than moving on.
 *
 * Nothing here asserts anything about Finance OS. No tier is named, no threshold is stated
 * and no settlement band is routed on.
 */
import { Building2, TrendingUp } from 'lucide-react'
import type { Module } from '@/audit/types'

export const MODULE_BUSINESS: Module = {
  id: 'd1',
  number: '01',
  title: 'The business and the licence',
  purpose:
    'Establish the shape of the brokerage and the regulatory perimeter it operates inside.',
  Icon: Building2,
  blocks: [
    {
      id: 'd1.licence',
      title: 'The licence and who sits under it',
      intro:
        'Before anything else, I want the shape of the business straight in my head. Who holds what, and who answers to whom.',
      questions: [
        {
          id: 'd1.licence-shape',
          prompt:
            'Take me through the shape of the business. Who holds the credit licence, and who sits underneath it?',
          kind: 'long',
          why: 'Decides the user model, the permission structure, and whether per person reporting is needed at all.',
          placeholder:
            'Entity, licence holder, who writes under it, who supports them.',
          followUp: 'And if someone left tomorrow, whose clients are they on paper?',
          source: '03-audience-and-icp/lexicon-industry-terms.md',
        },
        {
          id: 'd1.licence-basis',
          prompt:
            'Are you the licensee in your own right, a credit representative under an aggregator’s licence, or a credit representative under another broker’s?',
          kind: 'single',
          why: 'Changes who signs off on marketing and where the client data legally sits.',
          source: '03-audience-and-icp/voice-of-customer.md',
          choices: [
            {
              value: 'own-licence',
              label: 'Own Australian credit licence',
              hint: 'The business holds it directly.',
            },
            {
              value: 'cr-aggregator',
              label: 'Credit representative under an aggregator’s licence',
            },
            {
              value: 'cr-other-broker',
              label: 'Credit representative under another broker’s licence',
              flag: 'watch',
              flagNote:
                'The approval chain and the client data both sit with somebody who is not on this call. Find out who that person is and whether they need to be.',
            },
            {
              value: 'not-sure',
              label: 'Not sure, needs checking',
              flag: 'risk',
              flagNote:
                'The perimeter is unknown, so nothing about permissions, data or marketing sign off can be designed yet. Ask them to confirm it with their licensee before scope is agreed.',
            },
          ],
        },
        {
          id: 'd1.credit-guide-timing',
          prompt:
            'At what point does the credit guide have to be issued and signed in your world?',
          kind: 'single',
          why: 'Sets where the credit guide step sits in the booking flow. It varies by licensee, so it is asked every time.',
          hint: 'This is their rule, not ours. Record it, do not correct it.',
          source: '07-compliance-and-guardrails/layer-c/bid-by-construction.md',
          followUp:
            'Who sends it today, and is there any record of it going out other than the sent folder?',
          choices: [
            {
              value: 'first-interaction',
              label: 'At the very first interaction',
              hint: 'Before any further conversation can happen.',
              flag: 'opportunity',
              flagNote:
                'A booking flow with no credit guide step in it would not fit this business. Design the step in from the start rather than adding it later.',
            },
            { value: 'before-fact-find', label: 'Before the fact find' },
            { value: 'before-submission', label: 'Before submission' },
            {
              value: 'will-confirm',
              label: 'Not certain, will confirm with the licensee',
              flag: 'watch',
              flagNote:
                'Get the answer in writing from their licensee before any client facing sequence is designed. Do not supply a view on the timing.',
            },
          ],
        },
        {
          id: 'd1.marketing-signoff',
          prompt: 'Who signs off on your marketing before it goes out?',
          kind: 'single',
          why: 'Decides whether every template and sequence has an approval bottleneck sitting outside this business.',
          source: '03-audience-and-icp/disqualifiers.md',
          followUp:
            'How long does that usually take, and has anything ever come back knocked on the head?',
          allowOther: true,
          choices: [
            { value: 'me', label: 'Me' },
            {
              value: 'aggregator-compliance',
              label: 'The aggregator’s review team',
              flag: 'watch',
              flagNote:
                'Every client facing asset has a reviewer outside the business. Get the turnaround and the submission format before scope is agreed.',
            },
            { value: 'in-house-licensee', label: 'In house, or the licensee' },
            {
              value: 'nobody-formal',
              label: 'Nobody formally',
              flag: 'watch',
              flagNote:
                'There is no named approver, so there is nobody to hand a template to. Ask who they would want it to be.',
            },
          ],
        },
      ],
    },
    {
      id: 'd1.people',
      title: 'Who is aggregated, and who is in the room',
      intro:
        'Now the people. I want to know who does what day to day, because that is what the build has to fit around.',
      questions: [
        {
          id: 'd1.aggregator',
          prompt: 'Who are you aggregated through?',
          kind: 'short',
          why: 'Sets the data portability picture and the marketing approval chain. Captured as free text on purpose.',
          placeholder: 'Whatever name they give.',
          source: '03-audience-and-icp/voice-of-customer.md',
          followUp: 'And how long have you been with them?',
        },
        {
          id: 'd1.ownership-model',
          prompt: 'Are you independent, a franchise, or owned or branded by your aggregator?',
          kind: 'single',
          why: 'Decides who controls the brand, the domain and the approvals. No franchise or aggregator owned buyer is described anywhere, so this answer is net new.',
          source: '03-audience-and-icp/segments.md',
          followUp: 'Who owns the brand and the domain, you or them?',
          choices: [
            { value: 'independent', label: 'Independent' },
            {
              value: 'franchise',
              label: 'Franchise',
              flag: 'watch',
              flagNote:
                'The brand, the domain and the marketing rules may all sit with the franchisor. Establish what this business is actually allowed to change before scoping anything.',
            },
            {
              value: 'aggregator-owned',
              label: 'Aggregator owned or aggregator branded',
              flag: 'watch',
              flagNote:
                'Same question, different owner. Find out what is theirs to change and what is not.',
            },
            { value: 'mixed', label: 'Mixed, or something else' },
          ],
        },
        {
          id: 'd1.headcount',
          prompt:
            'How many people are in the business, and what does each of them actually do day to day?',
          kind: 'table',
          why: 'Headcount is where the written audience and the market numbers disagree, and it decides the user and permission model.',
          hint: 'One row per person, including the principal. Initials are enough, and no personal mobile, personal email or home address. Contractors and offshore support count.',
          source: '03-audience-and-icp/persona-broker-ben-construct.md',
          followUp:
            'Of those, who would actually log in every day, and who only needs to be told something happened?',
          columns: [
            { key: 'person', label: 'Initials', kind: 'short', width: 'sm' },
            { key: 'role', label: 'Role', kind: 'short', width: 'md' },
            { key: 'daily', label: 'What they do day to day', kind: 'short', width: 'lg' },
            { key: 'writes', label: 'Writes loans?', kind: 'short', width: 'sm' },
          ],
        },
        {
          id: 'd1.brokers-writing',
          prompt: 'How many of those are writing loans under the licence?',
          kind: 'number',
          unit: 'brokers',
          why: 'Separates writers from support. It is the number the reporting has to break down by.',
          min: 0,
          source: '03-audience-and-icp/lexicon-industry-terms.md',
          flags: [
            {
              op: 'gt',
              value: 1,
              level: 'opportunity',
              title: 'More than one writer under the licence',
              note: 'Reporting has to work per broker as well as in total, and the pipeline has to show whose deal is whose.',
              action: 'Ask whether they want results broken out per broker, as a group, or both.',
            },
          ],
        },
        {
          id: 'd1.mentoring',
          prompt: 'How many newer brokers are you bringing up under your licence right now?',
          kind: 'number',
          unit: 'brokers',
          why: 'Mentoring drives per broker reporting and, usually, a separate view of the pipeline.',
          hint: 'Zero is a real answer. Ask it plainly.',
          min: 0,
          source: '03-audience-and-icp/lexicon-industry-terms.md',
          followUp: 'How is that tracked and paid at the moment?',
          flags: [
            {
              op: 'gt',
              value: 0,
              level: 'opportunity',
              title: 'Mentoring brokers under the licence',
              note: 'There is a second population inside the business with its own reporting and its own progression. It is scope, and it is usually invisible until asked about.',
              action: 'Ask how a mentee’s deals are counted, and who sees what.',
            },
          ],
        },
        {
          id: 'd1.broker-codes',
          prompt: 'How many broker codes does the business report against?',
          kind: 'number',
          unit: 'codes',
          why: 'Broker codes are the per person identifiers results get split by. This decides the reporting architecture.',
          min: 0,
          source: '03-audience-and-icp/lexicon-industry-terms.md',
        },
      ],
    },
    {
      id: 'd1.footprint',
      title: 'Footprint, entity and name in market',
      intro:
        'Last part of this chapter. Where you write, what the entity is, and what you call yourself when someone asks.',
      questions: [
        {
          id: 'd1.years-broking',
          prompt:
            'How long have you been broking?',
          kind: 'number',
          unit: 'years broking',
          why: 'A soft read only. The real test is the size of the book, which is the next module.',
          min: 0,
          source: '03-audience-and-icp/disqualifiers.md',
          followUp: 'And the business in its current shape, how long is that?',
          flags: [
            {
              op: 'lt',
              value: 2,
              level: 'watch',
              title: 'Early in the trading history',
              note: 'Tenure on its own decides nothing and is not a reason to decline. It only tells you which way to lean into the book and database questions in module 02.',
              action: 'Go carefully at the settled volume and the client count, and take the answers at face value.',
            },
          ],
        },
        {
          id: 'd1.states',
          prompt: 'Which states and territories do you actually write in?',
          kind: 'multi',
          why: 'More than one clock in the client base changes how message timing has to be set, and it makes state a required field on the contact.',
          hint: 'Where the clients physically sit, not where the office is.',
          source: '11-operations/send-windows-and-rate-rules.md',
          allowOther: true,
          choices: [
            { value: 'nsw', label: 'New South Wales' },
            { value: 'vic', label: 'Victoria' },
            { value: 'qld', label: 'Queensland' },
            { value: 'wa', label: 'Western Australia' },
            { value: 'sa', label: 'South Australia' },
            { value: 'tas', label: 'Tasmania' },
            { value: 'act', label: 'Australian Capital Territory' },
            { value: 'nt', label: 'Northern Territory' },
          ],
          flags: [
            {
              op: 'includes',
              value: 'wa',
              level: 'watch',
              title: 'Clients on a western clock',
              note: 'Messages timed on an eastern clock land two to three hours earlier for these clients. Timing has to be set against the recipient’s own local time, which means the state has to be captured on every contact.',
              action: 'Ask whether the state is recorded today, and where.',
            },
            {
              op: 'includes',
              value: 'qld',
              level: 'watch',
              title: 'Queensland in the mix',
              note: 'Queensland does not move for daylight saving, so a send time that works all year in one state drifts by an hour in the other for half of it.',
              action: 'Confirm the contact record can hold a state or a timezone at all.',
            },
          ],
        },
        {
          id: 'd1.entity',
          prompt: 'What is the entity that trades, and its ABN?',
          kind: 'short',
          why: 'Needed for the sending identity and for anything that carries a business name.',
          placeholder: 'Entity name and ABN.',
          source: '07-compliance-and-guardrails/layer-c/sender-identity-and-opt-out.md',
        },
        {
          id: 'd1.trading-names',
          prompt: 'How many trading names or brands sit over the top of that entity?',
          kind: 'number',
          unit: 'brands',
          why: 'Decides the account structure, the sending domains, and whether reporting has to roll up across brands.',
          min: 1,
          source: '03-audience-and-icp/voice-of-customer.md',
          flags: [
            {
              op: 'gt',
              value: 1,
              level: 'watch',
              title: 'More than one brand over one entity',
              note: 'Each brand needs its own sending identity and its own templates, and somebody has to decide whether the reporting is per brand or combined.',
              action: 'Ask which brand is the one that matters, and whether the others are being kept or wound back.',
            },
          ],
        },
        {
          id: 'd1.market-description',
          prompt: 'When someone asks what you do, what do you say?',
          kind: 'long',
          why: 'Their words, verbatim. Everything client facing is written from this, not from our language.',
          placeholder: 'Write it down the way they say it, not the way it reads well.',
          source: '04-voice-and-messaging/brand-voice.md',
          followUp: 'And is that what it says on the website?',
        },
      ],
    },
  ],
}

export const MODULE_NUMBERS: Module = {
  id: 'd2',
  number: '02',
  title: 'The numbers',
  purpose:
    'Get the commercial machine in figures: what settles, what it earns, what it leaks and what it costs to feed.',
  Icon: TrendingUp,
  blocks: [
    {
      id: 'd2.volume',
      title: 'What you settle',
      intro:
        'This is the part I need in numbers rather than adjectives. Rough is fine, and say so when it is rough.',
      questions: [
        {
          id: 'd2.settled-month',
          prompt: 'What are you settling a month at the moment?',
          kind: 'currency',
          unit: 'per month',
          why: 'The figure nothing in the estate carries. Record it. Do not name a tier off it and do not state a threshold.',
          min: 0,
          source: '03-audience-and-icp/segments.md',
        },
        {
          id: 'd2.settled-count',
          prompt: 'And how many loans is that?',
          kind: 'number',
          unit: 'loans per month',
          why: 'Volume on its own hides the shape of the book. The two numbers are tracked separately by the brokers on file.',
          min: 0,
          source: '03-audience-and-icp/voice-of-customer.md',
        },
        {
          id: 'd2.avg-loan',
          prompt: 'What is your average loan size?',
          kind: 'currency',
          why: 'A cross check. If it does not reconcile against the volume and the count, one of the three is a guess.',
          min: 0,
          source: '03-audience-and-icp/voice-of-customer.md',
          followUp:
            'Do the maths out loud. If it does not line up, say so and ask which of the three they trust.',
        },
        {
          id: 'd2.figure-source',
          prompt: 'Where do those three figures come from?',
          kind: 'single',
          why: 'Decides whether there is a source of truth to report against, or whether the baseline has to be built before anything can be measured.',
          source: '03-audience-and-icp/disqualifiers.md',
          allowOther: true,
          choices: [
            {
              value: 'settled-report',
              label: 'A settled report I can pull whenever I want',
              flag: 'opportunity',
              flagNote:
                'There is a baseline. Ask for a copy so the reporting is built against the same definitions they already use.',
            },
            { value: 'aggregator-portal', label: 'The aggregator’s portal' },
            {
              value: 'own-spreadsheet',
              label: 'A spreadsheet I keep myself',
              flag: 'watch',
              flagNote:
                'The source of truth is one file on one machine. Ask who else can open it and what happens when they are away.',
            },
            {
              value: 'from-memory',
              label: 'Off the top of my head',
              flag: 'risk',
              flagNote:
                'There is no baseline, so there is no before to measure anything against. Slow the call down and get one built before scope or price is discussed.',
            },
          ],
        },
        {
          id: 'd2.last-two-years',
          prompt: 'Give me the last two financial years side by side.',
          kind: 'table',
          why: 'Qualification figure and reporting specification in one. It is what award submissions ask for, so it is a real requirement rather than a nice to have.',
          hint: 'One row per financial year. Two rows is enough.',
          source: '03-audience-and-icp/voice-of-customer.md',
          columns: [
            { key: 'fy', label: 'Financial year', kind: 'short', width: 'sm' },
            { key: 'volume', label: 'Settled volume', kind: 'currency', width: 'md' },
            { key: 'loans', label: 'Loans settled', kind: 'number', width: 'sm' },
            { key: 'note', label: 'What moved it', kind: 'short', width: 'lg' },
          ],
      seedRows: [{ fy: 'Last FY' }, { fy: 'The FY before' }],
        },
        {
          id: 'd2.split',
          prompt: 'Break that volume up by loan type for me.',
          kind: 'table',
          why: 'Tells you whether loan type has to be a first class field from day one, and which client segments the content has to serve.',
          hint: 'Owner occupier, investment, first home buyer, construction, commercial, asset and equipment, refinance. Add whatever else they write.',
          source: '03-audience-and-icp/lexicon-industry-terms.md',
          columns: [
            { key: 'type', label: 'Loan type', kind: 'short', width: 'md' },
            { key: 'share', label: 'Share of volume', kind: 'percent', width: 'sm' },
            { key: 'loans', label: 'Loans per month', kind: 'number', width: 'sm' },
            { key: 'avgsize', label: 'Average size', kind: 'currency', width: 'md' },
          ],
          followUp:
            'Which of those is growing, and which one would you drop tomorrow if you could?',
        },
        {
          id: 'd2.split-reporting',
          prompt: 'Do those need to be counted separately in your reporting, by loan type?',
          kind: 'yesno',
          why: 'If yes, loan type is a required field from day one rather than something bolted on later.',
          source: '03-audience-and-icp/lexicon-industry-terms.md',
          flags: [
            {
              op: 'eq',
              value: 'yes',
              level: 'opportunity',
              title: 'Loan type has to be reportable',
              note: 'The data model needs loan type on the deal from the start, and the pipeline has to carry it through to settlement.',
              action: 'Ask which cuts they would actually look at, and how often.',
            },
          ],
        },
      ],
    },
    {
      id: 'd2.commission',
      title: 'Commission, the trail book and clawback',
      intro:
        'Now the economics. I want to know what a settled dollar is actually worth to you, and what it costs you when one goes backwards.',
      questions: [
        {
          id: 'd2.upfront-basis',
          prompt:
            'How is your upfront paid? On the drawn amount, on the limit, net of offset, or does it change by lender?',
          kind: 'single',
          why: 'Decides whether settled volume can be turned into revenue at all, and how far off a back of envelope estimate would be.',
          source: '03-audience-and-icp/lexicon-industry-terms.md',
          choices: [
            { value: 'drawn', label: 'On the drawn amount' },
            { value: 'limit', label: 'On the approved limit' },
            { value: 'net-of-offset', label: 'Net of offset' },
            { value: 'varies', label: 'It changes by lender' },
            {
              value: 'not-sure',
              label: 'Not sure',
              flag: 'watch',
              flagNote:
                'The basis is on the aggregator statement. Ask them to send one page of it rather than guessing at the number on the call.',
            },
          ],
        },
        {
          id: 'd2.upfront-rate',
          prompt: 'What is your effective upfront rate across the book, after the aggregator’s share?',
          kind: 'percent',
          unit: 'of the loan amount',
          why: 'With the volume figure, this is the only way to size the upfront side of the business.',
          hint: 'A range is fine. Note it if it is a guess.',
          min: 0,
          max: 5,
          source: '03-audience-and-icp/lexicon-industry-terms.md',
        },
        {
          id: 'd2.trail-rate',
          prompt: 'And trail, per annum on the balance?',
          kind: 'percent',
          unit: 'per annum on balance',
          why: 'The other half of the same sum. The figure that matters is what lands after the aggregator’s share, not the rate printed on the lender schedule.',
          min: 0,
          max: 1,
          source: '03-audience-and-icp/lexicon-industry-terms.md',
        },
        {
          id: 'd2.rate-confidence',
          prompt:
            'Have you ever sat down and worked out your effective rate across the whole book, upfront and trail together?',
          kind: 'single',
          why: 'Not knowing is the finding. It means no figure captured today can be turned into revenue by anyone, including them.',
          source: '03-audience-and-icp/lexicon-industry-terms.md',
          choices: [
            {
              value: 'yes-current',
              label: 'Yes, and it is current',
              flag: 'opportunity',
              flagNote:
                'Ask for the working. It is the cleanest input the reporting will get, and it means they can already tell a good month from a big one.',
            },
            {
              value: 'yes-old',
              label: 'Yes, but it is a while ago',
              flag: 'watch',
              flagNote:
                'Lender mix and the aggregator’s share both move. Treat the number as indicative and ask when it was last checked.',
            },
            {
              value: 'never',
              label: 'Never worked it out',
              flag: 'risk',
              flagNote:
                'They cannot say what a settled dollar is worth to them, so no volume figure in this audit converts to revenue. Ask what the aggregator statement actually shows, and ask for the summary page with client details removed.',
            },
          ],
        },
        {
          id: 'd2.trail-book',
          prompt: 'What is the trail book, as a loan balance still paying you?',
          kind: 'currency',
          why: 'The asset the business is actually building, and the strongest buying motive on file.',
          min: 0,
          source: '03-audience-and-icp/buyer-psychology.md',
          followUp: 'And when did you last see that number, rather than estimate it?',
        },
        {
          id: 'd2.trail-monthly',
          prompt: 'What does the trail book pay you in a month?',
          kind: 'currency',
          unit: 'per month',
          why: 'The recurring line. It is also what keeps the lights on in a quiet settlement month, so it frames every cost conversation later.',
          min: 0,
          source: '03-audience-and-icp/lexicon-industry-terms.md',
        },
        {
          id: 'd2.trail-loans',
          prompt: 'How many loans are paying trail right now?',
          kind: 'number',
          unit: 'loans',
          why: 'The closest thing to a real client count, and the most reliable thing to build a client database from.',
          min: 0,
          source: '03-audience-and-icp/voice-of-customer.md',
          followUp:
            'Has anyone ever built your client list off the trail statements? How current is it?',
          flags: [
            {
              op: 'lt',
              value: 1,
              level: 'risk',
              title: 'No loans paying trail',
              note: 'There is no settled client base to organise or follow up yet. Say so plainly on the call, name the reason, and give them one specific next step rather than a scope.',
              action: 'Ask what they do have: enquiries, a list, deals in progress. Then decide honestly whether this is the right time.',
            },
          ],
        },
        {
          id: 'd2.clawback-window',
          prompt: 'What is your clawback window, and on what terms?',
          kind: 'short',
          why: 'Decides whether contact in the first two years after settlement is a retention job or a revenue protection one.',
          placeholder: 'e.g. full inside 12 months, half in year two.',
          source: '03-audience-and-icp/lexicon-industry-terms.md',
        },
        {
          id: 'd2.clawback-cost',
          prompt: 'What have clawbacks cost you in the last twelve months?',
          kind: 'currency',
          unit: 'last 12 months',
          why: 'Puts a dollar figure on loans leaving early. It is usually the first number in the call that makes post settlement contact feel worth doing.',
          min: 0,
          source: '03-audience-and-icp/lexicon-industry-terms.md',
          followUp:
            'Which ones were they, and did they have anything in common? Refinanced away, or deals that were always going to move?',
          flags: [
            {
              op: 'gt',
              value: 0,
              level: 'watch',
              title: 'Clawback is a live cost',
              note: 'Money has already gone back out the door. Whether anything can be done about it is a separate question, and it is worth asking whether they know which loans went and why.',
              action: 'Ask whether they hear about a refinance before or after it settles elsewhere.',
            },
          ],
        },
      ],
    },
    {
      id: 'd2.funnel',
      title: 'Enquiry through to settlement',
      intro:
        'Four numbers and how long it all takes. If you have not got them to hand, tell me and we will note that instead.',
      questions: [
        {
          id: 'd2.enquiries',
          prompt: 'How many enquiries land in a month, across every route in?',
          kind: 'number',
          unit: 'per month',
          why: 'The top of the funnel. Without it none of the conversion figures below mean anything.',
          min: 0,
          source: '11-operations/pipelines-and-stages.md',
        },
        {
          id: 'd2.funnel-table',
          prompt:
            'Walk me down the funnel. Enquiry, fact find, submission, settlement. How many at each step, and what share gets through?',
          kind: 'table',
          why: 'Locates the actual leak. It also shows which stages exist as a real step today and which are only in their head.',
          hint: 'One row per step. Note where a number is counted and where it is estimated.',
          source: '11-operations/pipelines-and-stages.md',
          columns: [
            { key: 'stage', label: 'Step', kind: 'short', width: 'md' },
            { key: 'permonth', label: 'Per month', kind: 'number', width: 'sm' },
            { key: 'rate', label: 'Through to next', kind: 'percent', width: 'sm' },
            { key: 'basis', label: 'Counted or estimated, and where from', kind: 'short', width: 'lg' },
          ],
      seedRows: [{ stage: 'Enquiry' }, { stage: 'Fact find' }, { stage: 'Submission' }, { stage: 'Settlement' }],
          followUp: 'Which of those steps loses the most, and do you know why?',
        },
        {
          id: 'd2.funnel-confidence',
          prompt:
            'Which of those numbers could you produce from a system today, without counting by hand?',
          kind: 'single',
          why: 'Separates a business with a measurable baseline from one where success after the build becomes a matter of opinion.',
          source: '03-audience-and-icp/disqualifiers.md',
          choices: [
            {
              value: 'all',
              label: 'All of them',
              flag: 'opportunity',
              flagNote:
                'There is a working baseline. Ask to see the report and build the reporting to the same definitions.',
            },
            {
              value: 'some',
              label: 'Some of them',
              flag: 'watch',
              flagNote:
                'Note precisely which steps are measured and which are not. The unmeasured ones are where the disagreement will happen later.',
            },
            {
              value: 'none',
              label: 'None of them',
              flag: 'risk',
              flagNote:
                'There is no baseline at all, so there is no test anything can pass or fail afterwards. Getting one on paper comes before scope, not after it.',
            },
          ],
        },
        {
          id: 'd2.cycle-time',
          prompt: 'How long does a deal take, first contact through to settlement?',
          kind: 'number',
          unit: 'days',
          why: 'Sets the length of every follow up sequence and shows where a deal goes quiet.',
          min: 0,
          source: '11-operations/pipelines-and-stages.md',
          followUp:
            'And the ones that go sideways, how long do they take? Construction and complex deals separately if they run them.',
        },
        {
          id: 'd2.repeat-share',
          prompt:
            'What share of your volume is repeat or referral, against genuinely new people who have never dealt with you?',
          kind: 'percent',
          unit: 'of volume',
          why: 'Referral is the only arrival route this business can evidence. Where it is absent, there is no proven starting point to build on.',
          min: 0,
          max: 100,
          source: '03-audience-and-icp/buyer-psychology.md',
          followUp: 'Who sends you the most, and when did you last speak to them?',
          flags: [
            {
              op: 'lt',
              value: 20,
              level: 'watch',
              title: 'Little repeat or referral volume',
              note: 'Almost everything is coming from people with no prior relationship. Find out what the actual route in is before assuming anything about it.',
              action: 'Ask when they last went back through the old database properly.',
            },
            {
              op: 'gt',
              value: 70,
              level: 'opportunity',
              title: 'The book is carrying the business',
              note: 'Most volume comes from people already known to them, which makes the client record and the post settlement contact the highest value part of any build.',
              action: 'Ask what happens today at thirty days after settlement, and at the annual review.',
            },
          ],
        },
      ],
    },
    {
      id: 'd2.money',
      title: 'Revenue, drawings and what marketing costs',
      intro:
        'Last few, and they are the blunt ones. Nothing here goes anywhere but this document.',
      questions: [
        {
          id: 'd2.revenue-year',
          prompt: 'What did the business turn over last financial year?',
          kind: 'currency',
          unit: 'last financial year',
          why: 'The commission figures above should reconcile to roughly this. If they do not, one side is wrong.',
          min: 0,
          source: '03-audience-and-icp/segments.md',
          followUp: 'And what is it running at this year?',
        },
        {
          id: 'd2.drawings',
          prompt: 'What do you draw out of it a month?',
          kind: 'currency',
          unit: 'per month',
          why: 'Separates a business that can fund a build from one where every dollar is already committed.',
          hint: 'A range is fine. Do not push if they would rather not.',
          min: 0,
          source: '03-audience-and-icp/disqualifiers.md',
        },
        {
          id: 'd2.marketing-spend',
          prompt: 'What do you spend on marketing in a month, all in?',
          kind: 'currency',
          unit: 'per month',
          why: 'Their number, recorded. It is also the figure the first invoice will be measured against in their head.',
          hint: 'Include tools, ads, contractors and anyone on retainer. Set the scope before they answer, not after.',
          min: 0,
          source: '03-audience-and-icp/buyer-psychology.md',
          followUp:
            'What is inside that number, and what is sitting outside it? Time, retainers, sponsorships, coffee with agents.',
        },
        {
          id: 'd2.marketing-return',
          prompt: 'Can you say what that spend returned last year?',
          kind: 'single',
          why: 'Money already spent for nothing is the most likely thing your work gets compared against. Find out now.',
          source: '03-audience-and-icp/buyer-psychology.md',
          followUp:
            'What specifically went wrong: the tool, the setup, or the time it needed from you?',
          choices: [
            {
              value: 'to-the-dollar',
              label: 'Yes, I can attribute it',
              flag: 'opportunity',
              flagNote:
                'Attribution already exists in some form. Ask what it is and whether it survives a lead arriving by phone.',
            },
            {
              value: 'roughly',
              label: 'Roughly, by feel',
              flag: 'watch',
              flagNote:
                'The spend is judged on impression. Any later disagreement about whether something worked will be an argument about feel, so agree now what would count.',
            },
            {
              value: 'no',
              label: 'No, and some of it went nowhere',
              flag: 'risk',
              flagNote:
                'There is spend on file that returned nothing they can point to. Ask what it was and what they concluded from it, because that conclusion is the lens on everything proposed next.',
            },
          ],
        },
      ],
    },
  ],
}
