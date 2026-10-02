/**
 * Discovery, modules five to seven: the stack, the people, and the ambition.
 *
 * These three chapters close part one. The first counts what the brokerage runs and what it
 * costs, because a tool count is only usable when it is the client's own, counted with them
 * and dated. The second finds where the hours actually go and what is written down, because a
 * build can only encode a process that someone can describe. The third asks what the next
 * twelve months is meant to look like, who can say yes, and what has already been tried and
 * abandoned.
 *
 * Nothing here asserts anything about Finance OS: no price, no turnaround, no outcome, no
 * currency and no compliance position. Every flag describes what the client said and names the
 * next thing to ask out loud.
 */
import { Layers, Users, Target } from 'lucide-react'
import type { Module } from '@/audit/types'

/* ── 05 · The stack and the spend ──────────────────────────────────────────── */

export const MODULE_STACK: Module = {
  id: 'd5',
  number: '05',
  title: 'The stack and the spend',
  purpose: 'Count what they run, what it costs, and who holds the keys to it.',
  Icon: Layers,
  blocks: [
    {
      id: 'd5.inventory',
      title: 'What is actually running',
      intro:
        'I want to build a picture of every system that touches a client. Not to judge it, just to know what is there before anyone looks under the bonnet.',
      questions: [
        {
          id: 'd5.crm',
          prompt: 'Where does the client record and the live deal actually sit today?',
          kind: 'multi',
          why: 'Decides whether we would be sitting beside the system of record or near it.',
          hint: 'Tick everything that holds a client or a deal, even partly.',
          followUp: 'Which of those would you call the real one if two of them disagreed?',
          source: 'db-finance-os/06-competitors-and-market/competitors/brokerengine.md',
          choices: [
            { value: 'brokerengine-classic', label: 'BrokerEngine (Classic)' },
            { value: 'brokerengine-plus', label: 'BrokerEngine Plus', hint: 'The aggregator-owned tier' },
            { value: 'salestrekker-2', label: 'Salestrekker 2.0' },
            { value: 'salestrekker-1', label: 'Salestrekker 1.0' },
            { value: 'effi', label: 'Effi' },
            { value: 'suite360', label: 'Suite360 (AFG)' },
            { value: 'mycrm', label: 'MyCRM (LMG)' },
            { value: 'lending-toolkit', label: 'Lending Toolkit (Mortgage Choice)' },
            { value: 'hubspot', label: 'HubSpot' },
            { value: 'zoho', label: 'Zoho' },
            { value: 'pipedrive', label: 'Pipedrive' },
            { value: 'gohighlevel-direct', label: 'GoHighLevel, direct' },
            { value: 'tekmatix', label: 'Tekmatix' },
            { value: 'get360', label: 'Get360' },
            {
              value: 'agency-built',
              label: 'A CRM an agency built for me',
              flag: 'watch',
              flagNote:
                'The people who can change it may sit outside the business. Find out who can edit it today and whether anything is documented.',
            },
            {
              value: 'spreadsheets-inbox',
              label: 'Spreadsheets and my inbox',
              flag: 'watch',
              flagNote:
                'There is no system of record, so the first job is agreeing what one row means before any of it is moved.',
            },
          ],
        },
        {
          id: 'd5.sending',
          prompt: 'What sends your email and your SMS today?',
          kind: 'multi',
          why: 'Names what could be consolidated and what could not, and who holds the sending identity.',
          followUp: 'And who physically presses send?',
          source: 'db-finance-os/06-competitors-and-market/competitors/activecampaign.md',
          choices: [
            { value: 'activecampaign', label: 'ActiveCampaign' },
            { value: 'hubspot-marketing', label: 'HubSpot' },
            { value: 'ghl-direct-sending', label: 'GoHighLevel, direct' },
            { value: 'tekmatix-sending', label: 'Tekmatix' },
            { value: 'get360-sending', label: 'Get360' },
            { value: 'mailchimp', label: 'Mailchimp' },
            { value: 'crm-native', label: 'The CRM’s own email', hint: 'BrokerEngine, Salestrekker or Effi' },
            { value: 'aggregator-platform', label: 'An aggregator marketing platform' },
            {
              value: 'agency-sends',
              label: 'My agency sends it for me',
              flag: 'risk',
              flagNote:
                'A third party holds the list, the sending domain and the send history. Ask who the domain is authenticated to and who could switch it off.',
            },
            {
              value: 'outlook-gmail',
              label: 'Outlook or Gmail, one at a time',
              flag: 'watch',
              flagNote:
                'Every send is a manual act, so nothing about it is repeatable and none of it is recorded against the client.',
            },
            {
              value: 'nothing-goes-out',
              label: 'Nothing goes out',
              flag: 'opportunity',
              flagNote:
                'Nothing to migrate and no bad habits to unpick. Ask what they would want said first, and to whom.',
            },
          ],
        },
        {
          id: 'd5.pointtools',
          prompt:
            'What do you use for serviceability, and what do you lodge through?',
          kind: 'multi',
          why: 'Marks the lane we do not enter, out loud and early. Record it and leave it alone.',
          hint: 'This is their credit work. Capture it, price it, and do not build towards it.',
          followUp: 'How many times a week does that get opened?',
          source: 'db-finance-os/06-competitors-and-market/not-our-lane.md',
          choices: [
            { value: 'quickli', label: 'Quickli' },
            { value: 'lender-calculators', label: 'Each lender’s own calculator' },
            { value: 'aggregator-calculators', label: 'The aggregator’s calculators' },
            { value: 'crm-calculators', label: 'The CRM’s built-in calculators' },
            { value: 'applyonline', label: 'ApplyOnline' },
            { value: 'aggregator-lodgement', label: 'The aggregator’s own lodgement path' },
            { value: 'serviceability-spreadsheets', label: 'Spreadsheets' },
          ],
        },
        {
          id: 'd5.substrate',
          prompt:
            'Are you already on GoHighLevel, or on something built on it, whether directly, through an agency or under another brand?',
          kind: 'multi',
          why: 'Decides whether the conversation is about software at all, or only about configuration.',
          followUp: 'Who built it, when, and is any of it written down?',
          source: 'db-finance-os/06-competitors-and-market/competitors/gohighlevel.md',
          choices: [
            { value: 'ghl-own-account', label: 'GoHighLevel, my own account' },
            { value: 'tekmatix-substrate', label: 'Tekmatix' },
            { value: 'get360-substrate', label: 'Get360' },
            {
              value: 'agency-sub-account',
              label: 'A sub-account an agency gave me',
              flag: 'risk',
              flagNote:
                'The tenancy may belong to the agency rather than to the broker. Ask whose name is on the account and what it would take to move it.',
            },
            {
              value: 'white-label-brand',
              label: 'A white-labelled platform under someone else’s brand',
              flag: 'watch',
              flagNote:
                'They may be paying for the same substrate twice without knowing it. Get the invoice before drawing any comparison.',
            },
            { value: 'pitched-not-on-it', label: 'Not on it, but I have been pitched it' },
            {
              value: 'no-idea',
              label: 'No idea what it is built on',
              flag: 'watch',
              flagNote:
                'Worth resolving before the hands-on pass, because it changes what that pass is looking at.',
            },
          ],
        },
        {
          id: 'd5.supporting',
          prompt: 'What else is in the monthly bill that touches a client?',
          kind: 'multi',
          why: 'Finds the small subscriptions that never make it onto a stack list.',
          source: 'db-finance-os/02-offer-and-pricing/what-we-replace.md',
          choices: [
            { value: 'esign', label: 'E-signature', hint: 'DocuSign, Annature, or the aggregator’s own' },
            { value: 'doc-collection', label: 'Document collection' },
            { value: 'booking', label: 'Calendar and booking', hint: 'Calendly or similar' },
            { value: 'phone', label: 'Phone, call tracking or a diverted number' },
            { value: 'reviews', label: 'Reviews and reputation' },
            { value: 'social', label: 'Social scheduling' },
            { value: 'website', label: 'Website or funnel builder', hint: 'WordPress, Squarespace, Wix, Webflow' },
            { value: 'course-community', label: 'Course or community platform' },
            { value: 'forms', label: 'Forms and surveys' },
            { value: 'task-tracker', label: 'Task or project tracker', hint: 'Asana, Trello, Notion, Monday' },
            { value: 'design', label: 'Design', hint: 'Canva or similar' },
            { value: 'accounting', label: 'Accounting and invoicing', hint: 'Xero or similar' },
            { value: 'automation-glue', label: 'Automation glue', hint: 'Zapier, Make or similar' },
          ],
        },
        {
          id: 'd5.bridge',
          prompt:
            'How much of that talks to the rest of it, and what is the job somebody does by hand to bridge the gap?',
          kind: 'long',
          why: 'The manual bridge is the mechanism half of the consolidation case and needs no figure.',
          placeholder:
            'e.g. enquiry gets typed into the CRM by hand, then again into the aggregator at fact find',
          source: 'db-finance-os/02-offer-and-pricing/what-we-replace.md',
        },
      ],
    },
    {
      id: 'd5.spend',
      title: 'What it costs, and what earns it',
      intro:
        'Let us do this line by line. I would rather have your numbers with their basis than a round figure we both half believe.',
      questions: [
        {
          id: 'd5.ledger',
          prompt:
            'Every subscription, one row each: what it is, what it does, what it costs a month, whose login it is, and when the contract ends.',
          kind: 'table',
          why: 'This table is the scope document for the hands-on pass and the base of every later number.',
          hint: 'Record the role that owns the login, not a personal mobile, personal email or home address.',
          source: 'db-finance-os/06-competitors-and-market/pricing-evidence.md',
          columns: [
            { key: 'tool', label: 'Tool', kind: 'short', width: 'md' },
            { key: 'does', label: 'What it does', kind: 'short', width: 'lg' },
            { key: 'cost', label: 'Monthly cost', kind: 'currency', width: 'sm' },
            { key: 'owner', label: 'Who owns the login', kind: 'short', width: 'md' },
            { key: 'ends', label: 'Contract ends', kind: 'short', width: 'sm' },
          ],
        },
        {
          id: 'd5.total',
          prompt: 'Adding all of that up, what is the total going out a month on software?',
          kind: 'currency',
          unit: 'per month',
          why: 'Their counted figure, dated, and theirs to state. We never supply one.',
          source: 'db-finance-os/06-competitors-and-market/pricing-evidence.md',
          flags: [
            {
              op: 'gt',
              value: 2000,
              level: 'opportunity',
              title: 'Software spend above two thousand a month',
              note:
                'A stack this size is worth walking line by line rather than summarising. The count is theirs and it is dated today.',
              action: 'Ask which three lines they would defend and which three they would not miss.',
            },
            {
              op: 'lt',
              value: 100,
              level: 'watch',
              title: 'Very little is being paid for',
              note:
                'There may be little to consolidate here. The work would be building something that does not exist rather than tidying something that does.',
              action: 'Ask what they do instead of the tools they are not paying for.',
            },
          ],
        },
        {
          id: 'd5.gst',
          prompt: 'Is that figure GST inclusive or exclusive?',
          kind: 'single',
          why: 'A mixed basis moves a total by about ten per cent, which is more than most decisions turn on.',
          source: 'db-finance-os/06-competitors-and-market/pricing-evidence.md',
          choices: [
            { value: 'inclusive', label: 'Inclusive' },
            { value: 'exclusive', label: 'Exclusive' },
            {
              value: 'mixed',
              label: 'A mix, depending on the vendor',
              flag: 'watch',
              flagNote:
                'The total cannot be compared with anything until each line is put on one basis. Do that off the invoices, not on the call.',
            },
            {
              value: 'not-sure-gst',
              label: 'Not sure',
              flag: 'watch',
              flagNote: 'Resolve it from the invoices before any figure is repeated back to them.',
            },
          ],
        },
        {
          id: 'd5.currency',
          prompt: 'Is anything on that list billed in something other than Australian dollars?',
          kind: 'single',
          why: 'A foreign-currency line makes a monthly total an estimate until the invoice is read.',
          source: 'db-finance-os/06-competitors-and-market/pricing-evidence.md',
          choices: [
            { value: 'all-aud', label: 'All AUD' },
            {
              value: 'usd-line',
              label: 'At least one line is billed in US dollars',
              flag: 'watch',
              flagNote:
                'That line moves with the exchange rate and often with usage as well, so the monthly figure is a range, not a number.',
            },
            { value: 'other-currency', label: 'Something else' },
            { value: 'not-sure-currency', label: 'Not sure' },
          ],
        },
        {
          id: 'd5.annual',
          prompt: 'What comes out annually that we would miss looking at one month?',
          kind: 'currency',
          unit: 'per year',
          why: 'At least one tool in this market is priced per year, so a monthly column overstates it twelvefold.',
          source: 'db-finance-os/06-competitors-and-market/competitors/quickli.md',
        },
        {
          id: 'd5.used',
          prompt: 'Of everything we have just listed, what did you actually open this week?',
          kind: 'multi',
          why: 'Separates the stack they pay for from the stack they use.',
          followUp: 'And which one does your support person live in all day?',
          source: 'db-finance-os/06-competitors-and-market/competitors/quickli.md',
          choices: [
            { value: 'used-crm', label: 'The CRM' },
            { value: 'used-serviceability', label: 'The serviceability tool' },
            { value: 'used-email', label: 'The email or SMS tool' },
            { value: 'used-lodgement', label: 'The lodgement system' },
            { value: 'used-marketing', label: 'The marketing platform' },
            { value: 'used-portal', label: 'The client portal' },
            { value: 'used-phone', label: 'The phone system' },
            {
              value: 'used-none',
              label: 'None of them, it has been a settlement week',
              flag: 'watch',
              flagNote:
                'Ask what a normal week looks like instead, then come back to this. A settlement week is not the baseline.',
            },
          ],
        },
        {
          id: 'd5.unused',
          prompt: 'Which of those are you paying for and not using?',
          kind: 'long',
          why: 'The tools nobody opens are the ones that can go without an argument.',
          followUp: 'What stopped it, the tool or the time it needed?',
          source: 'db-finance-os/02-offer-and-pricing/what-we-replace.md',
        },
      ],
    },
    {
      id: 'd5.control',
      title: 'Contracts, keys and the door out',
      intro:
        'Last part on the stack, and it is the part nobody has on hand: what you are locked into, who else can get in, and whether you could walk out with your own data.',
      questions: [
        {
          id: 'd5.renewals',
          prompt:
            'For each subscription, when does it renew, what notice do you have to give, and have you prepaid anything?',
          kind: 'table',
          why: 'The renewal calendar is the build calendar. A date two weeks out is worth more than any feature argument.',
          followUp: 'Which of those renews in the next ninety days?',
          source: 'db-finance-os/06-competitors-and-market/competitors/effi.md',
          columns: [
            { key: 'tool', label: 'Tool', kind: 'short', width: 'md' },
            { key: 'term', label: 'Monthly or annual', kind: 'short', width: 'sm' },
            { key: 'renews', label: 'Renews', kind: 'short', width: 'sm' },
            { key: 'notice', label: 'Notice required', kind: 'short', width: 'sm' },
            { key: 'prepaid', label: 'Prepaid', kind: 'currency', width: 'sm' },
          ],
        },
        {
          id: 'd5.aggregator-terms',
          prompt:
            'Does your aggregator agreement say anything about the marketing tools or platforms you are allowed to run?',
          kind: 'single',
          why: 'Their agreement, their advice. We record the answer and go no further than that.',
          hint:
            'Do not interpret the agreement on the call and do not offer a view on what it permits.',
          source: 'db-finance-os/02-offer-and-pricing/boundaries.md',
          choices: [
            { value: 'no-restriction', label: 'Nothing that restricts it' },
            {
              value: 'there-are-restrictions',
              label: 'Yes, there are conditions',
              flag: 'risk',
              flagNote:
                'Record what they say and stop there. This is a matter for their own reading of their own agreement, and for their own advice. Do not build a plan on top of an unresolved answer.',
            },
            {
              value: 'never-read-it',
              label: 'I have never read that part',
              flag: 'watch',
              flagNote:
                'Ask them to check it before anything is scheduled. It is the question most likely to come back later.',
            },
            { value: 'need-to-check', label: 'I would need to check' },
          ],
        },
        {
          id: 'd5.agency',
          prompt:
            'Who does marketing or systems work for you from outside the business?',
          kind: 'multi',
          why: 'An audit is a political act. Every outside party is either an ally or an obstacle.',
          followUp: 'What are they actually contracted to deliver, and until when?',
          source: 'db-finance-os/06-competitors-and-market/README.md',
          choices: [
            { value: 'ozimedia', label: 'ozimedia' },
            { value: 'basic-solutions', label: 'Basic Solutions' },
            { value: 'lightfield-digital', label: 'Lightfield Digital' },
            { value: 'ar-digital-get360', label: 'AR Digital Solutions or Get360' },
            { value: 'another-agency', label: 'Another agency, name it in the notes' },
            { value: 'freelancer-va', label: 'A freelancer or VA' },
            {
              value: 'past-consultant',
              label: 'Someone who is no longer engaged',
              flag: 'risk',
              flagNote:
                'A login held by someone no longer engaged is a live access finding as well as a relationship one. Ask what they can still see and still change.',
            },
            { value: 'nobody-outside', label: 'Nobody outside the business' },
          ],
        },
        {
          id: 'd5.admins',
          prompt:
            'Who else has admin access to any of this, and is each of them still engaged?',
          kind: 'table',
          why: 'The hands-on pass stalls without a named grantor per system, and surprises turn incumbents into opponents.',
          hint: 'Role and business only. No personal mobile, no personal email, no home address.',
          followUp: 'Is anyone on that list no longer working with you but still has the login?',
          source: 'db-finance-os/06-competitors-and-market/README.md',
          columns: [
            { key: 'role', label: 'Role', kind: 'short', width: 'md' },
            { key: 'business', label: 'Business', kind: 'short', width: 'md' },
            { key: 'systems', label: 'Which systems', kind: 'short', width: 'lg' },
            { key: 'level', label: 'Access level', kind: 'short', width: 'sm' },
            { key: 'engaged', label: 'Still engaged', kind: 'short', width: 'sm' },
          ],
        },
        {
          id: 'd5.export',
          prompt:
            'Could you export your whole client database yourself today, without asking anyone?',
          kind: 'single',
          why: 'The ownership question in its most concrete form, and the first test of migration feasibility.',
          followUp: 'Have you ever actually run that export?',
          source: 'db-finance-os/06-competitors-and-market/competitors/afg.md',
          choices: [
            { value: 'yes-myself', label: 'Yes, I could do it right now' },
            {
              value: 'only-aggregator-or-agency',
              label: 'Only my aggregator or agency can',
              flag: 'risk',
              flagNote:
                'In operational terms the database is not theirs to move, whatever the agreement says. Everything downstream starts with getting it out.',
            },
            {
              value: 'would-have-to-ask',
              label: 'I would have to ask, and I am not sure they would',
              flag: 'risk',
              flagNote:
                'Treat the export as an unproven step, not an assumption. Ask them to test it before any date is discussed.',
            },
            {
              value: 'no-clean-database',
              label: 'There is not one clean database',
              flag: 'watch',
              flagNote:
                'The first piece of work is deciding what one record is. Find out how many places a client currently exists in.',
            },
          ],
        },
      ],
    },
  ],
}

/* ── 06 · The people and the hours ─────────────────────────────────────────── */

export const MODULE_PEOPLE: Module = {
  id: 'd6',
  number: '06',
  title: 'The people and the hours',
  purpose: 'Find where capacity actually goes, and what only exists in someone’s head.',
  Icon: Users,
  blocks: [
    {
      id: 'd6.roster',
      title: 'Who is in the business',
      intro:
        'Now the people. I am after where the hours go rather than an org chart, so roles are enough.',
      questions: [
        {
          id: 'd6.headcount',
          prompt: 'Take me through who works in the business and what each of them does.',
          kind: 'table',
          why: 'Sets the user model, the permissions and who the build has to be handed to.',
          hint: 'Roles only. No personal mobile, personal email or home address.',
          source: 'db-finance-os/03-audience-and-icp/segments.md',
          columns: [
            { key: 'role', label: 'Role', kind: 'short', width: 'md' },
            { key: 'basis', label: 'Employed or contracted', kind: 'short', width: 'sm' },
            { key: 'hours', label: 'Hours a week', kind: 'number', width: 'sm' },
            { key: 'only', label: 'The thing only they can do', kind: 'short', width: 'lg' },
          ],
        },
        {
          id: 'd6.principal-hours',
          prompt: 'How many hours a week do you personally work, honestly?',
          kind: 'number',
          unit: 'hours per week',
          why: 'The capacity ceiling in one number, and the thing every later answer is measured against.',
          min: 0,
          max: 120,
          source: 'db-finance-os/03-audience-and-icp/buyer-psychology.md',
          flags: [
            {
              op: 'gt',
              value: 55,
              level: 'watch',
              title: 'The principal is at or past their own ceiling',
              note:
                'Anything that needs more of their hours will not get them. That constrains the build and the rollout, not just the diary.',
              action: 'Ask which of those hours they would give up first if they could.',
            },
          ],
        },
        {
          id: 'd6.split',
          prompt:
            'Split a normal week for me: admin, client contact, lodgement and lender follow-up, marketing, chasing old leads, running the team.',
          kind: 'table',
          why: 'Turns a feeling about being busy into hours that can be argued with.',
          hint: 'One row per activity. If two people do it, split the rows.',
          followUp: 'Which of those lines would you have guessed wrong before we wrote it down?',
          source: 'db-finance-os/06-competitors-and-market/market-context.md',
          columns: [
            { key: 'activity', label: 'Activity', kind: 'short', width: 'lg' },
            { key: 'hours', label: 'Hours a week', kind: 'number', width: 'sm' },
            { key: 'who', label: 'Who does it', kind: 'short', width: 'md' },
          ],
        },
        {
          id: 'd6.admin-share',
          prompt: 'Of your own week, what share goes on admin rather than in front of a client?',
          kind: 'percent',
          why: 'Their own figure. There is no market number we are allowed to put beside it.',
          min: 0,
          max: 100,
          source: 'db-finance-os/06-competitors-and-market/market-context.md',
          flags: [
            {
              op: 'gt',
              value: 50,
              level: 'watch',
              title: 'More than half the principal’s week is admin',
              note:
                'The business is paying broker hours for processing work. That is the number to come back to when scope is being argued.',
              action: 'Ask which parts of that admin only they can legally or practically do.',
            },
          ],
        },
        {
          id: 'd6.support',
          prompt: 'Who takes work off you today?',
          kind: 'single',
          why: 'Decides whether the build has anyone to hand to, or lands back on the principal.',
          source: 'db-finance-os/03-audience-and-icp/segments.md',
          choices: [
            {
              value: 'nobody',
              label: 'Nobody, it is all me',
              flag: 'watch',
              flagNote:
                'Every hour the build needs comes out of the same week we just counted. Say that out loud now rather than in week three.',
            },
            { value: 'part-time-admin', label: 'A part-time admin' },
            { value: 'full-time-admin', label: 'A full-time admin or loan processor' },
            { value: 'offshore-va', label: 'An offshore VA' },
            { value: 'processing-service', label: 'A contracted processing service' },
            { value: 'partner', label: 'A business partner' },
            { value: 'team', label: 'A team of three or more' },
          ],
        },
        {
          id: 'd6.hire',
          prompt: 'Have you tried to hire for any of this, and what happened?',
          kind: 'long',
          why: 'A failed hire is the cheapest evidence you will get about what the work actually requires.',
          placeholder: 'e.g. hired an admin, spent six weeks training, they left, never replaced',
          followUp: 'What did that cost you, in time and in money?',
          source: 'db-finance-os/03-audience-and-icp/buyer-psychology.md',
        },
      ],
    },
    {
      id: 'd6.knowledge',
      title: 'What only exists in someone’s head',
      intro:
        'This is the part that decides whether anything can be built at all, because a system can only hold a process somebody can describe.',
      questions: [
        {
          id: 'd6.two-weeks',
          prompt:
            'If you took two weeks off starting Monday and did not look at your phone, what breaks first?',
          kind: 'long',
          why: 'The single best test of where the business actually depends on one person.',
          followUp: 'And who would be ringing you anyway?',
          source: 'db-finance-os/03-audience-and-icp/buyer-psychology.md',
        },
        {
          id: 'd6.documented',
          prompt: 'How much of how this business runs is written down anywhere?',
          kind: 'scale',
          why: 'Your read, not theirs. It sets how much of the call has to be spent drawing out process.',
          scaleLabels: ['Nothing written down', 'Written, current and followed'],
          source: 'db-finance-os/11-operations/workflows.md',
          flags: [
            {
              op: 'lt',
              value: 3,
              level: 'risk',
              title: 'Almost nothing is documented',
              note:
                'There is no process to encode, only people to interview. That is work that has to be scoped as work rather than absorbed.',
              action: 'Ask them to walk one recent deal end to end, out loud, and write it as they speak.',
            },
          ],
        },
        {
          id: 'd6.written',
          prompt: 'Which of these actually exist in writing today?',
          kind: 'multi',
          why: 'Separates what they believe is documented from what a new starter could follow.',
          source: 'db-finance-os/11-operations/workflows.md',
          choices: [
            { value: 'enquiry-process', label: 'What happens when a new enquiry lands' },
            { value: 'fact-find-checklist', label: 'A fact find checklist' },
            { value: 'doc-list', label: 'A document collection list' },
            { value: 'submission-checklist', label: 'A pre-submission checklist' },
            { value: 'post-settlement', label: 'A post-settlement and annual review process' },
            { value: 'email-templates', label: 'Templates for the emails you send most' },
            { value: 'task-list-per-deal', label: 'A task list that runs per deal' },
            { value: 'induction', label: 'An induction for a new staff member' },
            {
              value: 'nothing-written',
              label: 'None of it is written down',
              flag: 'risk',
              flagNote:
                'Everything here is carried by the people currently doing it. Name who each process would have to be extracted from.',
            },
          ],
        },
        {
          id: 'd6.first-replace',
          prompt: 'If one person walked out tomorrow, who would you have to replace first?',
          kind: 'short',
          why: 'Names the single point of failure, which is usually not the highest paid person.',
          followUp: 'What do they know that is not written down anywhere?',
          source: 'db-finance-os/03-audience-and-icp/voice-of-customer.md',
        },
        {
          id: 'd6.shouldnt',
          prompt: 'What are you doing personally that you should not be doing?',
          kind: 'long',
          why: 'They usually answer this in one sentence and it is the sentence the whole build gets judged on.',
          source: 'db-finance-os/03-audience-and-icp/buyer-psychology.md',
        },
        {
          id: 'd6.wont-hand-over',
          prompt: 'And what is the part of the job you would never hand over?',
          kind: 'long',
          why: 'A build spec and a fear at the same time. Record it as theirs, not as a finding.',
          hint: 'Do not argue with the answer. It is the boundary any automation has to respect.',
          source: 'db-finance-os/03-audience-and-icp/voice-of-customer.md',
        },
      ],
    },
    {
      id: 'd6.leaks',
      title: 'Where the hours leak',
      intro:
        'Last few on people. I want the specific incidents rather than the general feeling, because those are the ones we can test against later.',
      questions: [
        {
          id: 'd6.missed-lead',
          prompt: 'When is the last time a lead or a deal got missed, and what happened?',
          kind: 'long',
          why: 'A named incident gives the build a defined first job and a checkable before.',
          placeholder: 'e.g. an enquiry sat in a shared inbox over a long weekend and went elsewhere',
          source: 'db-finance-os/03-audience-and-icp/voice-of-customer.md',
        },
        {
          id: 'd6.missed-cause',
          prompt: 'What was the actual cause?',
          kind: 'single',
          why: 'Separates a capture problem from a follow-up problem, which are different builds.',
          source: 'db-finance-os/11-operations/workflows.md',
          choices: [
            { value: 'nobody-saw-it', label: 'Nobody saw it' },
            { value: 'saw-it-too-late', label: 'Someone saw it too late' },
            { value: 'wrong-inbox', label: 'It sat in someone else’s inbox' },
            { value: 'fell-between-systems', label: 'It fell between two systems' },
            { value: 'followed-up-once', label: 'We followed up once and stopped' },
            {
              value: 'dont-know',
              label: 'We do not know',
              flag: 'watch',
              flagNote:
                'Nothing recorded the loss, so there is no baseline to improve against and no way to show later that anything changed.',
            },
          ],
        },
        {
          id: 'd6.rekeying',
          prompt: 'What gets typed twice in a normal week?',
          kind: 'long',
          why: 'Rekeying is the clearest, cheapest thing to count and the easiest to verify later.',
          followUp: 'Roughly how long does that take, per deal?',
          source: 'db-finance-os/02-offer-and-pricing/what-we-replace.md',
        },
        {
          id: 'd6.capacity-deals',
          prompt:
            'With the people you have now, how many deals a month could you handle before something gives?',
          kind: 'number',
          unit: 'deals per month',
          why: 'The ceiling as a number, which is what the twelve-month ambition gets tested against next.',
          min: 0,
          source: 'db-finance-os/03-audience-and-icp/buyer-psychology.md',
        },
        {
          id: 'd6.doubled',
          prompt: 'If enquiry doubled next month, what falls over first?',
          kind: 'long',
          why: 'Tells you whether this is a volume buyer or a capacity buyer, which changes the whole conversation.',
          source: 'db-finance-os/03-audience-and-icp/voice-of-customer.md',
        },
        {
          id: 'd6.stopped',
          prompt:
            'Is there anything you used to do for clients that you have quietly stopped, because there is no time for it?',
          kind: 'long',
          why: 'Usually where the past-client and post-settlement work went. Asked plainly, it answers itself.',
          hint: 'Client care, not marketing channels. Those were covered earlier.',
          source: 'db-finance-os/03-audience-and-icp/persona-broker-ben-construct.md',
        },
      ],
    },
  ],
}

/* ── 07 · Ambition and constraint ──────────────────────────────────────────── */

export const MODULE_AMBITION: Module = {
  id: 'd7',
  number: '07',
  title: 'Ambition and constraint',
  purpose: 'The twelve month picture, the decision unit, and the money.',
  Icon: Target,
  blocks: [
    {
      id: 'd7.picture',
      title: 'Twelve months out',
      intro:
        'Let us finish part one looking forward. Twelve months, in your words first and then in numbers.',
      questions: [
        {
          id: 'd7.twelve-months',
          prompt:
            'Twelve months from today, what does this business look like if it has gone the way you want?',
          kind: 'long',
          why: 'Their words, kept verbatim. Everything later gets tested against this sentence.',
          followUp: 'And what is different about your own week in that picture?',
          source: 'db-finance-os/03-audience-and-icp/buyer-psychology.md',
        },
        {
          id: 'd7.numbers',
          prompt: 'Now the same thing in numbers. Where are you today and where do you want to be?',
          kind: 'table',
          why: 'A picture with no number in it cannot be passed or failed later.',
          hint: 'Settlements a month, deals a month, clients on the book, hours a week, per broker if there is more than one.',
          source: 'db-finance-os/03-audience-and-icp/segments.md',
          columns: [
            { key: 'measure', label: 'Measure', kind: 'short', width: 'lg' },
            { key: 'today', label: 'Today', kind: 'number', width: 'sm' },
            { key: 'target', label: 'In twelve months', kind: 'number', width: 'sm' },
          ],
        },
        {
          id: 'd7.growth-source',
          prompt: 'Where does that growth come from?',
          kind: 'multi',
          why: 'Decides whether there is a book to work or an audience to build, which are different jobs.',
          source: 'db-finance-os/03-audience-and-icp/disqualifiers.md',
          choices: [
            { value: 'existing-database', label: 'The people already in my database' },
            { value: 'repeat-refinance', label: 'Repeat business and refinances' },
            {
              value: 'referral-partners',
              label: 'Referral partners',
              hint: 'Accountants, agents, planners, past clients',
            },
            { value: 'new-marketing', label: 'New enquiry from marketing' },
            { value: 'brokers-under-me', label: 'Other brokers working under me' },
            {
              value: 'early-no-database',
              label: 'I am early, there is not much of a database yet',
              flag: 'risk',
              flagNote:
                'There is no book to organise or follow up yet, so most of what an install does has nothing to act on. Decline it on the call and name the reason, or agree a much narrower first job with them.',
            },
            {
              value: 'consumer-calculator-traffic',
              label: 'People using our calculators or tools',
              flag: 'watch',
              flagNote:
                'Useful traffic, but a borrower using a calculator is not pipeline. Counting it as pipeline distorts their own reporting.',
            },
            {
              value: 'clients-outside-australia',
              label: 'Clients outside Australia',
              flag: 'watch',
              flagNote:
                'Not a screen and must not be used as one. Record it, because nothing we hold is built for that setting.',
            },
            {
              value: 'work-outside-broking',
              label: 'A separate business outside broking',
              flag: 'risk',
              flagNote:
                'Outside what this instrument is built for. Scope it as its own engagement or decline it, and say which on the call.',
            },
          ],
        },
        {
          id: 'd7.stop-doing',
          prompt: 'What would you have to stop doing to get there?',
          kind: 'long',
          why: 'Ambition with nothing given up is a wish. This is where the trade shows.',
          source: 'db-finance-os/03-audience-and-icp/buyer-psychology.md',
        },
        {
          id: 'd7.success-test',
          prompt:
            'Ninety days in, what has to be true for you to say this was worth doing?',
          kind: 'long',
          why: 'The acceptance test, in their words, captured before any money moves.',
          hint:
            'Do not correct the answer with a claim. Write it down, then ask the follow-up.',
          followUp: 'And what would make you say it has not worked?',
          source: 'db-finance-os/03-audience-and-icp/disqualifiers.md',
        },
        {
          id: 'd7.own-vs-rent',
          prompt:
            'In twelve months, do you want to own the platform outright, or have access to something that is run for you?',
          kind: 'single',
          why: 'Not a screen. A conversation to have early rather than one to discover later.',
          source: 'db-finance-os/02-offer-and-pricing/boundaries.md',
          choices: [
            {
              value: 'own-outright',
              label: 'Own it outright',
              flag: 'watch',
              flagNote:
                'Have the boundary conversation now, plainly, before anything else is discussed. It is not a decline and it is not something to leave until the end.',
            },
            { value: 'rent-access', label: 'Access to something run for me' },
            { value: 'no-strong-view', label: 'No strong view either way' },
            { value: 'not-sure-own', label: 'Have not thought about it' },
          ],
        },
      ],
    },
    {
      id: 'd7.history',
      title: 'What has already been tried, and why now',
      intro:
        'Before we talk about anything new, I want to know what has already been tried here. This is the most useful five minutes of the call.',
      questions: [
        {
          id: 'd7.graveyard',
          prompt: 'What have you already paid for, or built, that you have since stopped using?',
          kind: 'long',
          why: 'The graveyard question. What your work will be compared against, whether or not anyone says so.',
          placeholder: 'e.g. a CRM built out on another broker’s recommendation, a course platform, an agency retainer',
          followUp: 'What specifically went wrong: the tool, the setup, or the time it needed from you?',
          source: 'db-finance-os/03-audience-and-icp/buyer-psychology.md',
        },
        {
          id: 'd7.graveyard-cause',
          prompt: 'Which of these was it, closest to the truth?',
          kind: 'multi',
          why: 'Names the failure mode that will repeat unless the build is shaped around it.',
          source: 'db-finance-os/03-audience-and-icp/buyer-psychology.md',
          choices: [
            { value: 'never-set-up', label: 'It was never set up properly' },
            {
              value: 'needed-more-of-me',
              label: 'It needed more of my time than I had',
              flag: 'watch',
              flagNote:
                'That constraint has not changed. Agree what their side can actually give before any date is agreed.',
            },
            { value: 'nobody-ran-it', label: 'Nobody in the business ran it' },
            {
              value: 'builder-left',
              label: 'The person who built it left',
              flag: 'watch',
              flagNote:
                'Handover is the requirement here, not features. Ask who would hold it this time.',
            },
            { value: 'didnt-fit', label: 'It did not fit how we actually work' },
            { value: 'data-never-clean', label: 'The data was never clean enough' },
            {
              value: 'oversold',
              label: 'It was sold as something it turned out not to be',
              flag: 'watch',
              flagNote:
                'Every expectation on this call has to be stated at its plainest. Do not fill a silence with a claim, a turnaround or a figure.',
            },
            {
              value: 'never-found-out',
              label: 'We never really found out why',
              flag: 'watch',
              flagNote:
                'Nothing was measured, so nothing can be shown to have improved. Agree what gets measured this time, before the build.',
            },
          ],
        },
        {
          id: 'd7.graveyard-spend',
          prompt:
            'Across the last twelve months, what have you spent on systems, agencies or marketing altogether?',
          kind: 'currency',
          unit: 'in the last 12 months',
          why: 'The reference point any number you quote later gets judged against.',
          followUp: 'And what did you get for it?',
          source: 'db-finance-os/03-audience-and-icp/buyer-psychology.md',
          flags: [
            {
              op: 'gt',
              value: 10000,
              level: 'watch',
              title: 'Significant spend already made',
              note:
                'Money already spent with little to show for it is the strongest thing shaping how they hear the rest of this. Deal with it directly rather than around it.',
              action: 'Ask what they would have wanted done differently with that money.',
            },
          ],
        },
        {
          id: 'd7.urgency',
          prompt: 'If you did nothing about any of this for twelve months, what happens?',
          kind: 'single',
          why: 'The urgency gate. Without a named consequence there is no test the work can pass.',
          source: 'db-finance-os/03-audience-and-icp/disqualifiers.md',
          choices: [
            {
              value: 'nothing-much',
              label: 'Honestly, not much, we would cope',
              flag: 'risk',
              flagNote:
                'No named problem and no urgency. Say so on the call and name what they should do instead, even if that is nothing yet. Taking money here is how a dispute starts.',
            },
            { value: 'same-work-lost', label: 'We keep losing the same work' },
            { value: 'stall-at-volume', label: 'We stall at the volume we are at now' },
            { value: 'go-backwards', label: 'We go backwards' },
            { value: 'breaks-by-date', label: 'Something specific breaks by a specific date' },
          ],
        },
        {
          id: 'd7.why-now',
          prompt: 'Why now? What changed in the last month or two?',
          kind: 'long',
          why: 'The highest-value new intel on this call. Nothing on file records what starts a broker looking.',
          source: 'db-finance-os/03-audience-and-icp/buyer-psychology.md',
        },
        {
          id: 'd7.when-live',
          prompt: 'When would you want this live, and is anything in the way?',
          kind: 'single',
          why: 'The readiness gate and the expectation check in one answer.',
          hint:
            'Their date is their requirement. It is recorded as theirs. Do not confirm a turnaround, because none is published.',
          source: 'db-finance-os/02-offer-and-pricing/onboarding-and-delivery.md',
          choices: [
            {
              value: 'inside-two-weeks',
              label: 'Inside two weeks',
              flag: 'risk',
              flagNote:
                'Correct this now, plainly: how fast it moves depends on how quickly access, branding and content come back from their side. No turnaround may be stated. Agree what their side will supply and by when.',
            },
            { value: 'inside-a-month', label: 'Inside a month' },
            { value: 'one-to-three-months', label: 'One to three months' },
            {
              value: 'later-than-three',
              label: 'Later than three months',
              flag: 'watch',
              flagNote:
                'Outside the readiness window this qualification is built around. Ask what has to happen first, and whether this conversation should be later too.',
            },
            {
              value: 'blocked-capacity',
              label: 'Blocked: we have no capacity right now',
              flag: 'watch',
              flagNote: 'The install needs some of their hours. Name how many and whose before a date is set.',
            },
            {
              value: 'blocked-another-project',
              label: 'Blocked: another project is running',
              flag: 'watch',
              flagNote: 'Ask when that one finishes and whether it touches the same systems.',
            },
            {
              value: 'blocked-someone-else',
              label: 'Blocked: waiting on someone else',
              flag: 'watch',
              flagNote: 'Name the person and what they have to decide. That is the real next step.',
            },
            {
              value: 'blocked-money',
              label: 'Blocked: waiting on money',
              flag: 'risk',
              flagNote:
                'Ask what has to happen for that to change and by when. Do not discount, and do not invent a payment shape to bridge it.',
            },
            {
              value: 'no-date',
              label: 'No date in mind',
              flag: 'risk',
              flagNote:
                'No timeline and usually no trigger. Pair this with the urgency answer before going any further.',
            },
          ],
        },
      ],
    },
    {
      id: 'd7.decision',
      title: 'Who decides, and what it is worth',
      intro:
        'Last block. I would rather ask these plainly now than guess at them afterwards.',
      questions: [
        {
          id: 'd7.decision-unit',
          prompt:
            'If you decided to go ahead, who signs, who pays, and can we get them on a call?',
          kind: 'single',
          why: 'The authority gate. The test is whether a decision can be reached, not whether this person makes it alone.',
          hint:
            'More than one person is the normal shape. Do not treat a second name as a problem.',
          followUp: 'And who in the business will have an opinion about this whether or not you ask for it?',
          source: 'db-finance-os/03-audience-and-icp/disqualifiers.md',
          choices: [
            { value: 'you-alone', label: 'Me, on my own' },
            { value: 'partner-both-across', label: 'Me and a partner or director, both across it' },
            { value: 'director-reachable', label: 'A director or owner we can get on a call' },
            {
              value: 'director-unreachable',
              label: 'Someone I probably cannot get in front of you',
              flag: 'risk',
              flagNote:
                'Nothing can be installed without somebody who can say yes. Ask what it would take to reach them, and if the answer is nothing, say so on the call.',
            },
            {
              value: 'external-party',
              label: 'An external party',
              hint: 'Aggregator, franchisor, accountant',
              flag: 'watch',
              flagNote:
                'The approval chain sits outside the business, which is a scheduling risk against any date discussed today.',
            },
            {
              value: 'not-sure-who',
              label: 'Not sure, honestly',
              flag: 'watch',
              flagNote:
                'Resolve this before the next call. An unnamed decision-maker is the commonest reason a scoped build never starts.',
            },
          ],
        },
        {
          id: 'd7.money-source',
          prompt: 'If this went ahead, where would the money come from?',
          kind: 'single',
          why: 'Displacing a spend and having a budget are two different conversations.',
          source: 'db-finance-os/03-audience-and-icp/disqualifiers.md',
          choices: [
            { value: 'existing-budget', label: 'An existing marketing or systems budget' },
            { value: 'cashflow', label: 'Business cashflow' },
            { value: 'displace-spend', label: 'It would have to displace something we already pay for' },
            {
              value: 'needs-discount',
              label: 'Only if there were a discount or a free period',
              flag: 'risk',
              flagNote:
                'The fee buys configuration work by people, and a discount reduces what that work is worth rather than how much of it there is. The fee buys configuration work by people, and a discount reduces what that work is worth rather than how much of it there is. Waivability is unsettled: do not offer one, do not rule one out.',
            },
            { value: 'not-sure-money', label: 'Not sure yet' },
          ],
        },
        {
          id: 'd7.first-invoice',
          prompt:
            'Set the monthly aside for a moment. Set the monthly aside for a moment. On the done-for-you tiers there is a one-off setup before any of it runs. Is that shape workable for you? Is that shape workable for you?',
          kind: 'yesno',
          why: 'Tests the first invoice rather than the subscription, which is the gate that matters.',
          hint: 'Describe what the setup buys. Do not describe what would not be refunded, and do not quote a figure here.',
          source: 'db-finance-os/02-offer-and-pricing/pricing-and-tiers.md',
          flags: [
            {
              op: 'eq',
              value: 'no',
              level: 'risk',
              title: 'A one-off setup does not work for them',
              note:
                'The shape of the first invoice is the thing being declined, not the monthly. Find out whether it is the amount, the timing or the principle.',
              action: 'Ask what shape would work, and record it. Do not agree to one on the call.',
            },
            {
              op: 'eq',
              value: 'unsure',
              level: 'watch',
              title: 'Unsure about a one-off setup',
              note: 'Usually means it has not been discussed with whoever else has to agree.',
              action: 'Ask who they would need to check that with.',
            },
          ],
        },
        {
          id: 'd7.monthly-feel',
          prompt: 'What feels right to you as a monthly number for something like this?',
          kind: 'currency',
          unit: 'per month',
          why: 'Their number first. Anchoring them to ours before they say theirs loses the most useful answer on the call.',
          followUp: 'What is that based on? Something you pay now, or something you were quoted?',
          source: 'db-finance-os/02-offer-and-pricing/what-we-replace.md',
          flags: [
            {
              op: 'lt',
              value: 100,
              level: 'watch',
              title: 'The monthly number they name is very low',
              note:
                'Usually means they have priced software and not the work around it. That gap is the conversation, not an objection.',
              action: 'Ask what they are comparing it against, and what that thing includes.',
            },
          ],
        },
        {
          id: 'd7.trial',
          prompt: 'Are you expecting a trial, or a money-back window?',
          kind: 'yesno',
          why: 'There is neither. Finding out now is cheaper than finding out after an invoice.',
          hint:
            'Answer it straight. What does hold is no lock-in, no minimum term and cancel any time. Never offer a guarantee, a trial or a turnaround to save a moment.',
          source: 'db-finance-os/02-offer-and-pricing/guarantees-and-refunds.md',
          flags: [
            {
              op: 'eq',
              value: 'yes',
              level: 'risk',
              title: 'They are expecting a trial or a refund window',
              note:
                'Correct it on the call, in plain words. An expectation left standing here becomes a dispute later, and the honest position is the stronger one.',
              action: 'Ask what they would want to see live before committing, and show them that instead.',
            },
          ],
        },
        {
          id: 'd7.no',
          prompt: 'Last one. What would make you say no to this?',
          kind: 'long',
          why: 'Surfaces the objection while there is still time to answer it honestly.',
          hint: 'Let the silence sit. The second sentence is usually the real one.',
          source: 'db-finance-os/02-offer-and-pricing/guarantees-and-refunds.md',
        },
      ],
    },
  ],
}
