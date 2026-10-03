/**
 * Capture and intake · Follow-up and nurture · The conversation layer. The three Diagnosis
 * chapters that walk an enquiry from the moment it arrives to the moment somebody answers it.
 *
 * These three modules ask one question in three places: what happens when nobody decides to make
 * it happen. Capture establishes the routes in and the first five minutes. Follow-up establishes
 * what runs on its own afterwards, and on what consent basis. The conversation layer establishes
 * who, or what, is answering. Every compliance-adjacent question names in `why` what it affects,
 * and every flag routes the client to their own advice rather than diagnosing a breach.
 */
import { Inbox, MessagesSquare, Repeat } from 'lucide-react'
import type { Module } from '@/audit/types'

/* ─────────────────────────────────────────────────────────────────────────────
   03 · Capture and intake
   ───────────────────────────────────────────────────────────────────────────── */

export const MODULE_CAPTURE: Module = {
  id: 'x3',
  number: '03',
  title: 'Capture and intake',
  purpose:
    'Every route an enquiry can take to reach them, and what actually happens in the first five minutes.',
  Icon: Inbox,
  blocks: [
    {
      id: 'x3.web',
      title: 'The website and who controls it',
      intro:
        "Let's start at the front door. I want to know what your site runs on and, just as much, who can get into it.",
      questions: [
        {
          id: 'x3.site-platform',
          prompt: "What's your website built on, and who can change a page on it today?",
          kind: 'short',
          why: 'Decides whether the site moves, stays where it is with forms embedded, or gets rebuilt.',
          placeholder: 'e.g. WordPress, built by an agency in 2023',
          followUp:
            'And if you needed a new page live this week, who would you be ringing?',
          source: '02-offer-and-pricing/onboarding-and-delivery.md',
        },
        {
          id: 'x3.access-holder',
          prompt: 'Who holds the logins: the domain, the hosting and the site admin?',
          kind: 'single',
          why: 'Decides whether any site work needs a third party to cooperate before it can start.',
          choices: [
            { value: 'broker-all', label: 'You hold all three' },
            {
              value: 'broker-some',
              label: 'You hold some of them',
              flag: 'watch',
              flagNote:
                'Find out which one is missing before anything is scheduled. The domain is usually the one nobody can locate.',
            },
            {
              value: 'developer',
              label: 'Your developer or agency holds them',
              flag: 'watch',
              flagNote:
                'A third party sits on the critical path. Ask how responsive they are and whether the relationship is current.',
            },
            {
              value: 'aggregator',
              label: 'The aggregator holds them',
              flag: 'watch',
              flagNote:
                'Ask what they are permitted to change themselves, and what has to be requested.',
            },
            {
              value: 'unsure',
              label: 'Not sure',
              flag: 'risk',
              flagNote:
                'Not knowing who holds the domain is its own finding. Put locating it on the access pack before anything else.',
            },
          ],
          source: '02-offer-and-pricing/onboarding-and-delivery.md',
        },
        {
          id: 'x3.funnels',
          prompt:
            "List every landing page or funnel you've got live right now, and tell me what each one is meant to do.",
          kind: 'table',
          why: 'The migration inventory. What each page is built in decides whether it imports or gets rebuilt.',
          hint: 'One row per page. If they cannot name what a page is for, write that down verbatim.',
          columns: [
            { key: 'page', label: 'Page or funnel', kind: 'short', width: 'lg' },
            { key: 'job', label: 'What it is meant to do', kind: 'short', width: 'lg' },
            { key: 'platform', label: 'Built in', kind: 'short', width: 'md' },
            { key: 'enquiries', label: 'Enquiries / mo', kind: 'number', width: 'sm' },
          ],
          followUp:
            'Are any of those built in ClickFunnels? Onboarding step 6.2 limits funnel import to that one platform, so anything else is a rebuild rather than an import.',
          source: '99-source-material/snapshot/docs/12-wiring-map.md',
        },
        {
          id: 'x3.footer',
          prompt:
            'Do those pages carry your legal entity, your ABN and a link to your privacy and terms?',
          kind: 'yesno',
          why: 'Affects every page that collects personal information. Cheapest defect to find, most tedious to fix at scale.',
          flags: [
            {
              op: 'eq',
              value: 'no',
              level: 'risk',
              title: 'Pages collecting details with no entity or policy link',
              note: 'A page that takes personal information and names no entity is exposed on its face. This is their obligation and it belongs with their own advice.',
              action:
                'Ask which pages, and whether the entity name on file matches the one on their credit guide.',
            },
            {
              op: 'eq',
              value: 'unsure',
              level: 'watch',
              title: 'Footer state unknown',
              note: 'Worth checking on the hands-on pass rather than settling here.',
            },
          ],
          source: '01-company/production-layer.md',
        },
      ],
    },
    {
      id: 'x3.capture',
      title: 'Forms, magnets and what they capture',
      intro:
        'Now the capture layer. Every form, where each one goes, and what it asks for.',
      questions: [
        {
          id: 'x3.form-inventory',
          prompt:
            'Take me through every form you have. Where it sits, and where the submission actually goes.',
          kind: 'table',
          why: 'Establishes the real intake map. Most brokerages have more forms live than they remember.',
          columns: [
            { key: 'form', label: 'Form', kind: 'short', width: 'md' },
            { key: 'where', label: 'Where it sits', kind: 'short', width: 'md' },
            { key: 'goes', label: 'Where the submission goes', kind: 'short', width: 'lg' },
            { key: 'permonth', label: 'Submissions / mo', kind: 'number', width: 'sm' },
          ],
          source: '11-operations/calendars-forms-and-links.md',
        },
        {
          id: 'x3.form-to-record',
          prompt:
            'When somebody submits one of those, does a contact record get created on its own, or does it land in an inbox?',
          kind: 'single',
          why: 'Decides whether follow-up can be triggered at all. An inbox is not a record.',
          choices: [
            { value: 'creates-record', label: 'A record is created automatically' },
            {
              value: 'emails-inbox',
              label: 'It emails an inbox',
              flag: 'risk',
              flagNote:
                'Nothing downstream can fire from an email. No tag, no sequence, no attribution, and no way to tell later whether anyone replied.',
            },
            { value: 'both', label: 'Both happen' },
            {
              value: 'unsure',
              label: 'Not sure',
              flag: 'watch',
              flagNote: 'Worth submitting a test form together on the hands-on pass.',
            },
          ],
          source: '99-source-material/snapshot/docs/05-automation-map.md',
        },
        {
          id: 'x3.form-fields',
          prompt: 'What do those forms capture, field by field?',
          kind: 'long',
          why: 'Form field schemas do not come back in a platform export, so this only comes from the conversation.',
          placeholder: 'Name, mobile, email, loan purpose, consent tickbox wording…',
          flags: [
            {
              op: 'empty',
              level: 'watch',
              title: 'Form fields not established',
              note: 'Without the field list, no custom-field mapping can be scoped.',
              action: 'Ask them to open one form on screen and read the fields out.',
            },
          ],
          source: '11-operations/generated/benchmark-capture-layer.md',
        },
        {
          id: 'x3.consent-capture',
          prompt:
            'Does a form submission record what the person agreed to, when they agreed, and how?',
          kind: 'yesno',
          why: 'Affects whether their existing contacts can be messaged later. The sender carries the evidential burden for consent.',
          flags: [
            {
              op: 'eq',
              value: 'no',
              level: 'risk',
              title: 'No consent record captured at the form',
              note: 'Contacts arriving with no consent source, date, mechanism or wording cannot be shown to have agreed to anything. That exposure is theirs and it needs their own advice.',
              action:
                'Ask what the tickbox on the form actually says today, word for word.',
            },
            {
              op: 'eq',
              value: 'unsure',
              level: 'watch',
              title: 'Consent capture unverified',
              note: 'Put it on the hands-on list. It is a two-minute check against a live form.',
            },
          ],
          source: '07-compliance-and-guardrails/layer-c/sender-identity-and-opt-out.md',
        },
        {
          id: 'x3.magnet',
          prompt: 'What do you give somebody in exchange for their details?',
          kind: 'single',
          why: 'Establishes whether an opt-in layer exists at all, and what the nurture would hang off.',
          allowOther: true,
          choices: [
            { value: 'gated', label: 'A guide or checklist, gated behind a form' },
            {
              value: 'ungated',
              label: 'A download anyone can take without a form',
              flag: 'watch',
              flagNote:
                'An ungated asset produces no contact record. This is the commonest reason a brokerage believes it has a magnet and has no list.',
            },
            { value: 'quiz', label: 'A quiz, scorecard or calculator' },
            { value: 'both', label: 'Both a gated asset and a quiz' },
            {
              value: 'nothing',
              label: 'Nothing',
              flag: 'opportunity',
              flagNote:
                'There is no opt-in layer to migrate. Worth noting what they would want to offer rather than what they have.',
            },
          ],
          source: '99-source-material/snapshot/docs/04-forms-surveys-calendars.md',
        },
        {
          id: 'x3.optins',
          prompt: 'How many people opted in last month?',
          kind: 'number',
          unit: 'per month',
          why: 'Their own dated baseline. The only honest comparison available later is their number against their number.',
          min: 0,
          followUp: 'And over the last twelve months, how many of those became a deal?',
          source: '05-proof-and-evidence/what-we-cannot-claim.md',
        },
        {
          id: 'x3.magnet-recommends',
          prompt:
            'Does anything in that guide, quiz or scorecard result tell the reader what loan or lender would suit them?',
          kind: 'yesno',
          why: 'Affects the credit assistance boundary. A product match produced by software carries no licensee, no credit guide and no assessment behind it.',
          flags: [
            {
              op: 'eq',
              value: 'yes',
              level: 'risk',
              title: 'An automated result that names a product or a lender',
              note: 'A recommendation, match, ranking or best-fit output inside an automated result looks like credit assistance given in their name. This sits inside their licensed perimeter and needs their own compliance advice before it stays live.',
              action:
                'Ask them to read out the exact wording of the highest-scoring result.',
            },
            {
              op: 'eq',
              value: 'unsure',
              level: 'watch',
              title: 'Automated result wording unknown',
              note: 'Get the wording in front of somebody before the quiz carries any more traffic.',
            },
          ],
          source: '07-compliance-and-guardrails/layer-c/template-compliance-gate.md',
        },
        {
          id: 'x3.factfind',
          prompt: 'How does your fact find get done today?',
          kind: 'single',
          why: 'Decides how much of intake is re-keyed by hand, and where the client data first becomes structured.',
          choices: [
            {
              value: 'paper',
              label: 'On paper, in the meeting',
              flag: 'watch',
              flagNote: 'Everything after this point is somebody typing it up again.',
            },
            {
              value: 'pdf',
              label: 'A PDF emailed back and forth',
              flag: 'watch',
              flagNote:
                'A returned PDF is not data. Ask who re-keys it and how long that takes per deal.',
            },
            { value: 'digital-form', label: 'A digital form the client fills in' },
            { value: 'aggregator', label: "In the aggregator's own portal" },
            {
              value: 'verbal',
              label: 'Verbally, then typed up afterwards',
              flag: 'watch',
              flagNote:
                'Ask what gets lost between the call and the typing, and who notices.',
            },
          ],
          source: '11-operations/generated/benchmark-capture-layer.md',
        },
        {
          id: 'x3.docs-arrival',
          prompt: 'How do client documents actually reach you?',
          kind: 'multi',
          why: 'Sets what the document chaser has to cover and where the completion signal comes from.',
          allowOther: true,
          choices: [
            { value: 'email-attachment', label: 'Email attachments' },
            {
              value: 'text-photo',
              label: 'Photos by text message',
              flag: 'watch',
              flagNote:
                'Ask where those images end up afterwards and who can see them. Where they hold identity documents, that is a question for their own privacy advice.',
            },
            { value: 'drive-link', label: 'A Drive or Dropbox link' },
            { value: 'aggregator-portal', label: "The aggregator's portal" },
            { value: 'secure-upload', label: 'A secure upload link' },
            { value: 'in-person', label: 'Handed over in person' },
          ],
          followUp:
            'Which documents differ between a PAYG client and a self-employed one?',
          source: '99-source-material/snapshot/docs/12-wiring-map.md',
        },
      ],
    },
    {
      id: 'x3.first-five',
      title: 'The first five minutes',
      intro:
        'This part is about the gap between an enquiry landing and a person being on the other end of it.',
      questions: [
        {
          id: 'x3.monthly-enquiries',
          prompt: 'Across every route in, how many enquiries came to you last month?',
          kind: 'number',
          unit: 'per month',
          why: 'The denominator for everything else in this module.',
          min: 0,
          source: '05-proof-and-evidence/what-we-cannot-claim.md',
        },
        {
          id: 'x3.booked',
          prompt: 'And how many of those became a booked appointment?',
          kind: 'number',
          unit: 'per month',
          why: 'Their own enquiry-to-appointment number, dated. No benchmark of ours may be quoted against it.',
          min: 0,
          source: '05-proof-and-evidence/what-we-cannot-claim.md',
        },
        {
          id: 'x3.speed-to-lead',
          prompt:
            'In business hours, how long between an enquiry landing and a person making contact?',
          kind: 'number',
          unit: 'minutes',
          why: 'The headline number of this module. Ask for minutes, not a feel.',
          hint: 'If they give a range, record the slower end. If they say "pretty quick", ask for the last one they can remember.',
          min: 0,
          flags: [
            {
              op: 'gt',
              value: 60,
              level: 'watch',
              title: 'Over an hour to first contact',
              note: 'Worth establishing whether that is the norm or the exception, and what the fast ones have in common.',
              action: 'Ask what happens differently on the enquiries answered quickly.',
            },
            {
              op: 'gt',
              value: 240,
              level: 'risk',
              title: 'Over four hours to first contact',
              note: 'At this distance the enquiry is competing with whoever else they contacted the same morning.',
              action:
                'Ask how many of the slow ones they can name that never got answered at all.',
            },
          ],
          source: '11-operations/sequence-architecture.md',
        },
        {
          id: 'x3.speed-measured',
          prompt: 'Is that measured somewhere, or is it a feel?',
          kind: 'single',
          why: 'Decides whether the number above is evidence or an estimate, which changes how it can be used later.',
          choices: [
            { value: 'measured', label: 'Measured in a system' },
            {
              value: 'estimated',
              label: 'An estimate',
              flag: 'watch',
              flagNote: 'Record it as their estimate, and label it that way in the notes.',
            },
            {
              value: 'not-tracked',
              label: 'Not tracked at all',
              flag: 'risk',
              flagNote:
                'Nothing in the business can tell them whether response time is getting better or worse.',
            },
          ],
          source: '99-source-material/snapshot/docs/12-wiring-map.md',
        },
        {
          id: 'x3.after-hours',
          prompt: 'After six, and at weekends, who responds?',
          kind: 'single',
          why: 'Sets the real coverage window, which every automated acknowledgement has to be honest about.',
          choices: [
            {
              value: 'nobody',
              label: 'Nobody until the next business day',
              flag: 'watch',
              flagNote:
                'Not a defect on its own. It becomes one if anything on the site promises faster.',
            },
            { value: 'rotation', label: 'Somebody on rotation' },
            { value: 'answering-service', label: 'An answering service' },
            {
              value: 'auto-reply',
              label: 'An automated reply only',
              flag: 'watch',
              flagNote:
                'Ask what the automated reply says, and whether it commits them to a time.',
            },
            { value: 'unsure', label: 'Not sure', flag: 'watch', flagNote: 'Worth confirming with whoever is on the phones.' },
          ],
          source: '11-operations/sequence-architecture.md',
        },
        {
          id: 'x3.missed-call',
          prompt: 'What happens to a call nobody picks up?',
          kind: 'single',
          why: 'The single cheapest gap to demonstrate, and it comes from their own phone records.',
          allowOther: true,
          choices: [
            {
              value: 'rings-out',
              label: 'It rings out',
              flag: 'risk',
              flagNote:
                'There is no record that the call happened, so nobody can follow it up and nobody can count it.',
            },
            {
              value: 'voicemail-unchecked',
              label: 'Voicemail nobody really checks',
              flag: 'risk',
              flagNote: 'Ask when the mailbox was last emptied.',
            },
            { value: 'voicemail-checked', label: 'Voicemail, checked daily' },
            { value: 'diverts', label: 'It diverts to a mobile' },
            { value: 'text-back', label: 'An automatic text goes back' },
            { value: 'answering-service', label: 'An answering service takes it' },
          ],
          source: '11-operations/sequence-architecture.md',
        },
        {
          id: 'x3.lost-detection',
          prompt: 'If an enquiry got missed today, how would you find out?',
          kind: 'single',
          why: 'Separates a business that can see its own gaps from one that finds out from the client.',
          choices: [
            { value: 'report', label: 'A report or an alert would flag it' },
            { value: 'someone-notices', label: 'Somebody would notice' },
            {
              value: 'client-chases',
              label: 'The client would chase us',
              flag: 'watch',
              flagNote: 'The detection mechanism is the client being persistent.',
            },
            {
              value: 'we-would-not',
              label: 'We would not find out',
              flag: 'risk',
              flagNote:
                'Nothing in the business can distinguish a quiet month from a missed one.',
            },
          ],
          followUp:
            'When was the last time you found an enquiry weeks later that nobody had answered?',
          source: '03-audience-and-icp/voice-of-customer.md',
        },
        {
          id: 'x3.intake-read',
          prompt: 'Auditor read: how much of their intake runs without somebody remembering it?',
          kind: 'scale',
          why: 'Your own read, recorded at the end of the block. Not asked out loud.',
          hint: 'Score what you heard, not what they said about themselves.',
          min: 1,
          max: 5,
          scaleLabels: ['Every step is somebody remembering', 'Every step runs on its own'],
          source: '11-operations/current-build-state.md',
        },
      ],
    },
  ],
}

/* ─────────────────────────────────────────────────────────────────────────────
   04 · Follow-up and nurture
   ───────────────────────────────────────────────────────────────────────────── */

export const MODULE_FOLLOWUP: Module = {
  id: 'x4',
  number: '04',
  title: 'Follow-up and nurture',
  purpose:
    'What happens to an enquiry without a human deciding to make it happen, and on what consent basis it happens at all.',
  Icon: Repeat,
  blocks: [
    {
      id: 'x4.automatic',
      title: 'What runs without a person',
      intro:
        'I want to separate two things here: what your team does, and what happens whether or not anybody remembers.',
      questions: [
        {
          id: 'x4.automated-today',
          prompt:
            'Which of these happen today without somebody deciding to make them happen?',
          kind: 'multi',
          why: 'The inventory of what is genuinely automated. Everything unticked is a person remembering.',
          allowOther: true,
          choices: [
            { value: 'enquiry-ack', label: 'An acknowledgement when an enquiry arrives' },
            { value: 'appt-confirm', label: 'An appointment confirmation' },
            { value: 'appt-reminder', label: 'Appointment reminders' },
            { value: 'doc-chase', label: 'Document chasing' },
            { value: 'post-settlement', label: 'A post-settlement check-in' },
            { value: 'annual-review', label: 'An annual review or check-in' },
            { value: 'fixed-expiry', label: 'A note when a fixed term is coming up' },
            { value: 'review-request', label: 'A review or testimonial request' },
            {
              value: 'nothing',
              label: 'None of it. It is all manual',
              flag: 'opportunity',
              flagNote:
                'Record what they currently do by hand, in their words. That list is the scope conversation.',
            },
          ],
          followUp:
            'For the ones you ticked, who set them up and when were they last looked at?',
          source: '99-source-material/snapshot/docs/05-automation-map.md',
        },
        {
          id: 'x4.stop-conditions',
          prompt:
            'When somebody books, or replies, does whatever is running stop on its own?',
          kind: 'single',
          why: 'Stop conditions are the part that gets skipped. A sequence still sending after a booking is the worst failure in the channel.',
          choices: [
            { value: 'stops', label: 'It stops automatically' },
            {
              value: 'manual-removal',
              label: 'Somebody takes them off it',
              flag: 'watch',
              flagNote:
                'Ask what happens when that person is on leave. Manual exits are the ones that get missed.',
            },
            {
              value: 'keeps-sending',
              label: 'It keeps sending',
              flag: 'risk',
              flagNote:
                'A client who has already booked is still being chased to book. This is visible to them and it is the fastest complaint in the channel.',
            },
            {
              value: 'unsure',
              label: 'Not sure',
              flag: 'watch',
              flagNote: 'Worth testing against a real contact on the hands-on pass.',
            },
          ],
          source: '11-operations/sequence-architecture.md',
        },
        {
          id: 'x4.touch-count',
          prompt:
            'If somebody enquires and does not convert, how many times do they hear from you before you stop?',
          kind: 'number',
          unit: 'touches',
          why: 'Their number, not ours. It also surfaces whether anybody has ever decided what the number should be.',
          min: 0,
          followUp: 'Over how many days is that, and what stops it?',
          flags: [
            {
              op: 'lt',
              value: 2,
              level: 'watch',
              title: 'One touch or none',
              note: 'Worth asking what happens to the enquiries that do not answer the first time.',
              action: "Ask how many of last month's enquiries got exactly one contact.",
            },
          ],
          source: '11-operations/sequence-architecture.md',
        },
        {
          id: 'x4.nurture-state',
          prompt: 'Is there a nurture sequence at all?',
          kind: 'single',
          why: 'Decides whether this is a migration of something written, or a build from nothing.',
          choices: [
            { value: 'running', label: 'Written and running' },
            {
              value: 'built-not-live',
              label: 'Written, never turned on',
              flag: 'watch',
              flagNote: 'Ask what stopped it going live. The answer is usually the real constraint.',
            },
            {
              value: 'ad-hoc',
              label: 'Ad hoc, whenever somebody gets to it',
              flag: 'watch',
              flagNote: 'Record who that somebody is, and what happens when they are busy.',
            },
            { value: 'none', label: 'Nothing at all' },
          ],
          source: '11-operations/sequence-architecture.md',
        },
        {
          id: 'x4.nurture-content',
          prompt: 'What does it actually say, message by message?',
          kind: 'long',
          why: 'Affects the credit assistance boundary. Post-settlement and rate-related copy is where a keeping-in-touch message becomes something else.',
          hint: 'Listen for anything that characterises a rate, a lender or an existing loan, or suggests the reader stay put.',
          placeholder:
            'Message 1, day 0: … Message 2, day 3: …',
          flags: [
            {
              op: 'notEmpty',
              level: 'watch',
              title: 'Nurture copy captured. Read it against the boundary',
              note: 'Anything that reassures a reader about their current rate, or implies staying put is the right move, sits inside their licensed perimeter rather than outside it.',
              action:
                'Ask whether anyone with a credit licence has read this copy, and when.',
            },
          ],
          source: '07-compliance-and-guardrails/layer-b/nccp-credit-activity-and-assistance.md',
        },
        {
          id: 'x4.newsletter-cadence',
          prompt: 'Do you send a newsletter, and how often?',
          kind: 'single',
          why: 'Usually the only asset with a real cadence behind it, and the one with a standing obligation attached.',
          choices: [
            { value: 'weekly', label: 'Weekly' },
            { value: 'fortnightly', label: 'Fortnightly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'quarterly', label: 'Quarterly' },
            {
              value: 'ad-hoc',
              label: 'When there is something to say',
              flag: 'watch',
              flagNote: 'Ask when the last one actually went out.',
            },
            { value: 'none', label: 'No newsletter' },
          ],
          source: '08-channels-and-playbooks/newsletter.md',
        },
        {
          id: 'x4.newsletter-open',
          prompt: 'What was the open rate on the last one?',
          kind: 'percent',
          why: 'Their figure, dated. It is also the cheapest early read on whether their mail is arriving at all.',
          min: 0,
          max: 100,
          followUp: 'And when did that one go out?',
          source: '08-channels-and-playbooks/email.md',
        },
      ],
    },
    {
      id: 'x4.list',
      title: 'The list and the sending setup',
      intro:
        'Now the database itself, and the plumbing it goes out through. These two decide what can be migrated and mailed.',
      questions: [
        {
          id: 'x4.list-origin',
          prompt: 'Where did each part of that list come from?',
          kind: 'multi',
          why: 'Affects whether a segment can be messaged at all. The sender carries the evidential burden for consent.',
          allowOther: true,
          choices: [
            { value: 'site-forms', label: 'Forms on your own site' },
            { value: 'phone-enquiries', label: 'Phone enquiries you typed in' },
            { value: 'referrals', label: 'Referral introductions' },
            { value: 'past-clients', label: 'Past clients' },
            {
              value: 'previous-business',
              label: 'Brought from a previous business or aggregator',
              flag: 'risk',
              flagNote:
                'Ask whether that segment can still be identified in the system today. A segment that can no longer be separated cannot be treated differently later. This is one for their own advice.',
            },
            {
              value: 'purchased-scraped',
              label: 'Bought, or built from published addresses',
              flag: 'risk',
              flagNote:
                'Consent is not inferable from the fact that an address has been published. This segment needs quarantining rather than merging, and it needs their own advice before anything goes to it.',
            },
            {
              value: 'unknown-spreadsheet',
              label: 'A spreadsheet nobody can account for',
              flag: 'risk',
              flagNote: 'Ask who owned it before them, and whether anyone has ever mailed it.',
            },
          ],
          followUp: 'For each of those: what did the person actually agree to, and when?',
          source: '07-compliance-and-guardrails/layer-a/spam-act-and-dnc.md',
        },
        {
          id: 'x4.reactivation-last',
          prompt: 'When did you last message the whole database?',
          kind: 'single',
          why: 'Decides whether a first send is routine or an event. A long silence changes the order of the work.',
          choices: [
            { value: 'within-3', label: 'Within the last three months' },
            { value: 'three-to-twelve', label: 'Three to twelve months ago' },
            {
              value: 'over-a-year',
              label: 'Over a year ago',
              flag: 'risk',
              flagNote:
                'A long-silent list mailed all at once is a deliverability event as well as a consent one. Small batches with a clean exit, not the whole list.',
            },
            {
              value: 'never',
              label: 'Never',
              flag: 'risk',
              flagNote:
                'The list exists and nothing has ever been sent to it. The first send is the highest-risk send they will ever make.',
            },
          ],
          followUp: 'What came back from it, and did anything go wrong?',
          source: '11-operations/sequence-architecture.md',
        },
        {
          id: 'x4.sending-setup',
          prompt:
            'What are you sending email from today, and what address does it come from?',
          kind: 'short',
          why: 'Establishes the sender block that has to be reproduced or corrected: from-name, from-address and reply-to.',
          placeholder: 'e.g. Mailchimp, from hello@…',
          followUp:
            'Does the reply-to land in a mailbox somebody actually reads, or does it bounce?',
          flags: [
            {
              op: 'empty',
              level: 'watch',
              title: 'Sending setup not established',
              note: 'Nothing about deliverability or identity can be assessed without it.',
            },
          ],
          source: '07-compliance-and-guardrails/layer-c/sender-identity-and-opt-out.md',
        },
        {
          id: 'x4.reply-to',
          prompt: 'Is the address people see a real mailbox, or a no-reply?',
          kind: 'single',
          why: 'Affects sender identification. A no-reply or a bouncing address defeats the requirement that contact details stay valid.',
          choices: [
            { value: 'monitored', label: 'A real mailbox somebody reads' },
            {
              value: 'noreply',
              label: 'A no-reply address',
              flag: 'risk',
              flagNote:
                'Replies to their marketing go nowhere. This affects both deliverability and the contact details their messages are required to carry, and it belongs with their own advice.',
            },
            {
              value: 'bounces',
              label: 'It bounces',
              flag: 'risk',
              flagNote: 'Worse than a no-reply, because it looks live until somebody writes back.',
            },
            { value: 'unsure', label: 'Not sure', flag: 'watch', flagNote: 'Two-minute test on the hands-on pass.' },
          ],
          source: '07-compliance-and-guardrails/layer-c/sender-identity-and-opt-out.md',
        },
        {
          id: 'x4.auth-state',
          prompt:
            'Are you sending from your main domain or a sending subdomain, and do you know your SPF, DKIM and DMARC state?',
          kind: 'single',
          why: 'Not a legal question. Without it the message does not arrive, and every other piece of work on the channel is wasted.',
          choices: [
            { value: 'all-three', label: 'All three set and verified' },
            {
              value: 'some',
              label: 'Some of them',
              flag: 'watch',
              flagNote: 'Ask which, and who set them up.',
            },
            {
              value: 'none',
              label: 'None of them',
              flag: 'risk',
              flagNote:
                'Ask what proportion of their last send was opened. The number usually tells the story before the DNS does.',
            },
            {
              value: 'dont-know',
              label: 'No idea',
              flag: 'watch',
              flagNote: 'Normal answer. Put the DNS records on the access pack.',
            },
          ],
          followUp: 'Who has access to your DNS records today?',
          source: '01-company/production-layer.md',
        },
        {
          id: 'x4.deliverability',
          prompt:
            'Any spam complaints, blocklistings, or a drop in opens you could not explain, in the last twelve months?',
          kind: 'long',
          why: 'A prior complaint means somebody has already looked. It changes the order of the work: remediation before expansion.',
          placeholder: 'What happened, when, and what was done about it…',
          source: '07-compliance-and-guardrails/layer-a/spam-act-and-dnc.md',
        },
        {
          id: 'x4.bounce-handling',
          prompt: 'What happens to an address that hard bounces?',
          kind: 'single',
          why: 'Affects sender reputation and the prohibition on sending to an address that does not exist.',
          allowOther: true,
          choices: [
            { value: 'suppressed', label: 'Permanently suppressed' },
            {
              value: 'retried',
              label: 'It goes back in the queue',
              flag: 'risk',
              flagNote:
                'A retry queue on hard bounces is how a sending reputation dies quietly, and it keeps sending to addresses that do not exist.',
            },
            {
              value: 'stays',
              label: 'Nothing. It stays on the list',
              flag: 'risk',
              flagNote: 'Same effect as a retry queue, arriving more slowly.',
            },
            { value: 'dont-know', label: 'No idea', flag: 'watch', flagNote: 'Check it against the last campaign report.' },
          ],
          source: '07-compliance-and-guardrails/layer-c/sender-identity-and-opt-out.md',
        },
      ],
    },
    {
      id: 'x4.consent',
      title: 'Timing, consent and getting out',
      intro:
        'Last part of this chapter: when things go out, on what basis, and how somebody stops them.',
      questions: [
        {
          id: 'x4.sms-use',
          prompt: 'What do you use text messages for?',
          kind: 'multi',
          why: 'Separates transactional use from marketing use. The two carry different obligations and different volumes.',
          allowOther: true,
          choices: [
            { value: 'appt-reminders', label: 'Appointment reminders' },
            { value: 'doc-chasing', label: 'Chasing documents' },
            { value: 'missed-call', label: 'Replying to a missed call' },
            { value: 'one-to-one', label: 'Ordinary back and forth with clients' },
            {
              value: 'broadcasts',
              label: 'Marketing broadcasts to a list',
              flag: 'watch',
              flagNote:
                'Marketing SMS carries the consent and opt-out obligations in full. Check the next two answers carefully.',
            },
            {
              value: 'rates-or-lenders',
              label: 'Anything quoting a rate or naming a lender',
              flag: 'risk',
              flagNote:
                'A rate needs its comparison rate and its warning no less prominent in the same view, which a text message cannot carry. The fix is not a shorter disclaimer. This needs their own advice.',
            },
            { value: 'not-used', label: 'We do not text' },
          ],
          followUp: 'Roughly how many go out a month, and what do they cost you?',
          source: '07-compliance-and-guardrails/layer-b/rg234-advertising.md',
        },
        {
          id: 'x4.unsub-propagation',
          prompt:
            'When somebody opts out of email, does that carry across to everything else that could message them?',
          kind: 'yesno',
          why: 'A suppression that lives in one tool is not a suppression. Decides how many systems the migration has to reconcile.',
          flags: [
            {
              op: 'eq',
              value: 'no',
              level: 'risk',
              title: 'Opt-outs do not propagate',
              note: 'Somebody who has asked to be left alone can still be texted, or mailed from the other tool. That is the version of this failure a client actually notices.',
              action: 'Ask how many separate tools could send to a contact today.',
            },
            {
              op: 'eq',
              value: 'unsure',
              level: 'watch',
              title: 'Opt-out propagation unverified',
              note: 'List the tools that can send, then check one suppressed contact against each.',
            },
          ],
          source: '11-operations/tags-and-segments.md',
        },
      ],
    },
  ],
}

/* ─────────────────────────────────────────────────────────────────────────────
   05 · The conversation layer
   ───────────────────────────────────────────────────────────────────────────── */

export const MODULE_CONVERSATION: Module = {
  id: 'x5',
  number: '05',
  title: 'The conversation layer',
  purpose:
    'The phone, the inbox, and anything that answers a client before a person has read it.',
  Icon: MessagesSquare,
  blocks: [
    {
      id: 'x5.phone',
      title: 'The phone',
      intro:
        'Start with the number. What people ring, who picks it up, and what happens when nobody does.',
      questions: [
        {
          id: 'x5.business-number',
          prompt: 'What number do clients ring?',
          kind: 'single',
          why: 'Decides whether the number can be ported, recorded against a record, or handed to anybody else.',
          allowOther: true,
          choices: [
            { value: 'business-line', label: 'A business landline or VoIP number' },
            { value: 'platform-number', label: 'A virtual number inside a platform' },
            {
              value: 'personal-mobile',
              label: 'A personal mobile',
              flag: 'risk',
              flagNote:
                'A personal mobile cannot be handed over, cannot be shared across a team, and leaves no record anybody else can see. It is also the hardest thing to change later.',
            },
            {
              value: 'several',
              label: 'Several numbers, depending who they got it from',
              flag: 'watch',
              flagNote: 'Ask which one is on the website, and which one is on the email signature.',
            },
            { value: 'none-published', label: 'No number published' },
          ],
          source: '01-company/production-layer.md',
        },
        {
          id: 'x5.call-answering',
          prompt: 'In business hours, who picks up?',
          kind: 'single',
          why: 'Sets the real answering capacity, which everything about response times depends on.',
          choices: [
            { value: 'named-person', label: 'A named person, always' },
            { value: 'whoever', label: 'Whoever is free' },
            { value: 'reception', label: 'A receptionist or answering service' },
            {
              value: 'voicemail',
              label: 'It goes to voicemail more often than not',
              flag: 'watch',
              flagNote: 'Ask what proportion, and whether they have ever counted.',
            },
            { value: 'rings-mobile', label: "It rings a mobile in somebody's pocket" },
          ],
          source: '03-audience-and-icp/voice-of-customer.md',
        },
        {
          id: 'x5.missed-calls',
          prompt: 'How many calls went unanswered last month?',
          kind: 'number',
          unit: 'per month',
          why: 'Their own number, from their own phone bill. It needs nothing of ours to mean something.',
          min: 0,
          followUp: 'And of those, how many rang back?',
          source: '11-operations/ghl-data-audit.md',
        },
        {
          id: 'x5.missed-call-handling',
          prompt: 'What happens to a missed call now, without anybody doing anything?',
          kind: 'single',
          why: 'The clearest single demonstration of the gap, and it comes entirely from their own answer.',
          allowOther: true,
          choices: [
            { value: 'text-back', label: 'A text goes back automatically' },
            { value: 'task-created', label: 'A task or a notification is created' },
            {
              value: 'voicemail-only',
              label: 'Voicemail, and somebody gets to it',
              flag: 'watch',
              flagNote: 'Ask how long "gets to it" usually is.',
            },
            {
              value: 'nothing',
              label: 'Nothing',
              flag: 'risk',
              flagNote:
                'The call leaves no trace anybody can act on, so it cannot be followed up and cannot be counted.',
            },
          ],
          source: '11-operations/sequence-architecture.md',
        },
        {
          id: 'x5.call-recording',
          prompt: 'Are calls recorded?',
          kind: 'yesno',
          why: 'Recording carries its own obligations on the client side. Ask rather than assume, and do not settle it on the call.',
          source: '07-compliance-and-guardrails/layer-a/privacy-and-app.md',
        },
        {
          id: 'x5.recording-basis',
          prompt: 'And how is the person on the other end told?',
          kind: 'single',
          why: 'Affects the basis for recording. Note what they say and route it to their own advice rather than resolving it here.',
          showIf: { question: 'x5.call-recording', equals: ['yes'] },
          choices: [
            { value: 'announcement', label: 'A recorded announcement before the call connects' },
            { value: 'spoken', label: 'The person says it at the start' },
            {
              value: 'policy-only',
              label: 'It is mentioned in the privacy policy',
              flag: 'watch',
              flagNote:
                'A policy page is not the same as telling the caller. Worth raising with their own advice before the practice continues.',
            },
            {
              value: 'not-told',
              label: 'They are not told',
              flag: 'risk',
              flagNote:
                'Recording without telling the caller sits squarely inside their own obligations. Flag it, do not diagnose it, and put it to their adviser.',
            },
          ],
          followUp: 'Where do the recordings live, and who can listen to them?',
          source: '07-compliance-and-guardrails/layer-a/privacy-and-app.md',
        },
      ],
    },
    {
      id: 'x5.inbox',
      title: 'Where a message can land',
      intro:
        'Now the written side. I want to count the places a client message can arrive, and find out whether anyone can see all of them at once.',
      questions: [
        {
          id: 'x5.channels',
          prompt: 'Where can a client message actually reach you?',
          kind: 'multi',
          why: 'The count is the finding. Each channel is a separate place something can be missed.',
          hint: 'Tick everything, including the ones they say nobody uses. Those are the ones that go unwatched.',
          allowOther: true,
          choices: [
            { value: 'sms', label: 'Text message' },
            { value: 'email', label: 'Email' },
            { value: 'messenger', label: 'Facebook Messenger' },
            {
              value: 'whatsapp',
              label: 'WhatsApp',
              flag: 'watch',
              flagNote:
                "Usually a personal thread on somebody's own phone. Ask where those conversations are kept and who else can see them.",
            },
            { value: 'instagram', label: 'Instagram DM' },
            { value: 'web-chat', label: 'Chat on the website' },
            { value: 'google-business', label: 'Google Business messages' },
            { value: 'phone', label: 'Phone and voicemail' },
            { value: 'linkedin', label: 'LinkedIn' },
          ],
          source: '02-offer-and-pricing/platform-capabilities.md',
        },
        {
          id: 'x5.shared-inbox',
          prompt: 'Is there one place where all of that is visible?',
          kind: 'single',
          why: 'Decides whether anyone in the business can answer a conversation they did not start.',
          choices: [
            { value: 'one-inbox', label: 'One shared inbox' },
            {
              value: 'personal-inboxes',
              label: "Each person's own inbox and phone",
              flag: 'risk',
              flagNote:
                'A conversation is visible only to whoever it happened to reach. Nobody can cover for anybody, and nothing survives a person leaving.',
            },
            {
              value: 'mixed',
              label: 'Some shared, some not',
              flag: 'watch',
              flagNote: 'Ask which channels are outside the shared view.',
            },
            {
              value: 'nothing-shared',
              label: 'Nothing is shared',
              flag: 'risk',
              flagNote: 'Worth asking what happens when the person who owns a thread is on leave.',
            },
          ],
          source: '02-offer-and-pricing/platform-capabilities.md',
        },
        {
          id: 'x5.inbox-owner',
          prompt: 'Who is responsible for watching it, and inside what hours?',
          kind: 'short',
          why: 'A two-way channel with no named owner becomes a silent inbox. Names the person, not the tool.',
          placeholder: 'e.g. office manager, 9 to 5 weekdays',
          source: '07-compliance-and-guardrails/layer-c/ai-disclosure-and-escalation.md',
        },
        {
          id: 'x5.response-time',
          prompt: 'How long does a written message typically wait before somebody replies?',
          kind: 'number',
          unit: 'hours',
          why: 'Their number for the written channels, to sit beside the speed-to-lead figure from the intake module.',
          min: 0,
          flags: [
            {
              op: 'gt',
              value: 24,
              level: 'watch',
              title: 'Over a day to reply to a written message',
              note: 'Worth checking against anything they have published about response times.',
              action: 'Ask which channel is the slowest, and why that one.',
            },
          ],
          source: '11-operations/sequence-architecture.md',
        },
        {
          id: 'x5.published-promise',
          prompt:
            'Have you published a response time anywhere? On the site, in an auto-reply, on your Google profile?',
          kind: 'single',
          why: 'A published time is a representation about the business. It affects them if the actual time does not match.',
          choices: [
            {
              value: 'website',
              label: 'Yes, on the website',
              flag: 'watch',
              flagNote:
                'Check it against the number they just gave you. If the two do not match, that is theirs to reconcile, with their own advice.',
            },
            {
              value: 'auto-reply',
              label: 'Yes, in an automatic reply',
              flag: 'watch',
              flagNote:
                'Auto-replies are the commonest place an unmet commitment lives, because nobody rereads them.',
            },
            { value: 'google', label: 'Yes, on the Google profile' },
            { value: 'nowhere', label: 'Nowhere' },
            { value: 'not-sure', label: 'Not sure', flag: 'watch', flagNote: 'Worth a look on the hands-on pass.' },
          ],
          source: '07-compliance-and-guardrails/layer-b/rg234-advertising.md',
        },
        {
          id: 'x5.thread-record',
          prompt:
            "Does a client's message history sit against their record, or only inside the app it arrived in?",
          kind: 'yesno',
          why: 'Decides whether the conversation survives a staff change, and whether anything can be reconstructed later.',
          flags: [
            {
              op: 'eq',
              value: 'no',
              level: 'watch',
              title: 'Conversations live only in the app they arrived in',
              note: 'Nothing can be reconstructed against a client later, which matters most on the deals that go wrong.',
              action: 'Ask what they would do today if they had to show a full history on one file.',
            },
          ],
          source: '11-operations/ghl-account-map.md',
        },
      ],
    },
    {
      id: 'x5.answering',
      title: 'Anything answering on your behalf',
      intro:
        'Last block. I want to know whether anything replies to a client before a person has read it, and what it is allowed to say.',
      questions: [
        {
          id: 'x5.ai-surfaces',
          prompt:
            'Is anything automated in your conversations today? Chat widget, auto-replies, anything answering the phone?',
          kind: 'multi',
          why: 'Establishes the surface. Each one pulls in a different set of obligations on their side.',
          allowOther: true,
          choices: [
            { value: 'web-chat', label: 'A chat widget on the website' },
            { value: 'sms-auto', label: 'An automatic text reply' },
            { value: 'social-auto', label: 'Messenger or Instagram auto-replies' },
            { value: 'email-auto', label: 'An email reply that writes its own text' },
            {
              value: 'voice-in',
              label: 'Something answering inbound calls',
              flag: 'watch',
              flagNote:
                'A synthetic voice is a voice call, which brings the calling rules with it. Note it and route it to their own advice.',
            },
            {
              value: 'voice-out',
              label: 'Something making outbound calls',
              flag: 'risk',
              flagNote:
                'Outbound calling carries its own register, timing and identification obligations on their side. Do not settle any of it on this call.',
            },
            { value: 'none', label: 'Nothing automated' },
          ],
          source: '07-compliance-and-guardrails/layer-c/ai-disclosure-and-escalation.md',
        },
        {
          id: 'x5.ai-rate-reply',
          prompt:
            'If a consumer asks it right now what rate they would get, or which lender suits them, what does it say?',
          kind: 'long',
          why: 'The sharpest question in the module. An automated product answer looks like credit assistance given in their name.',
          showIf: {
            question: 'x5.ai-surfaces',
            equals: ['web-chat', 'sms-auto', 'social-auto', 'email-auto', 'voice-in', 'voice-out'],
          },
          hint: 'Ask if you can put the question to it live while you are both on the call. That answer is worth more than the description.',
          flags: [
            {
              op: 'notEmpty',
              level: 'risk',
              title: 'Automated replies to product questions. Read the wording carefully',
              note: 'A recommendation, a match, a ranking or a best-fit answer produced by software carries no licensee, no credit guide and no assessment behind it. That exposure sits with them and needs their own compliance advice.',
              action:
                'Ask who wrote that answer, and whether anyone holding a credit licence has read it.',
            },
          ],
          source: '07-compliance-and-guardrails/layer-b/nccp-credit-activity-and-assistance.md',
        },
        {
          id: 'x5.ai-disclosure',
          prompt: 'Does it tell people it is not a person, and what exactly does it say?',
          kind: 'single',
          why: 'Disclosure is a Finance OS product standard that goes beyond the law. There is no Australian rule requiring it, so never tell them there is.',
          showIf: {
            question: 'x5.ai-surfaces',
            equals: ['web-chat', 'sms-auto', 'social-auto', 'email-auto', 'voice-in', 'voice-out'],
          },
          choices: [
            { value: 'first-turn', label: 'It says so in the first message' },
            { value: 'when-asked', label: 'It says so if somebody asks' },
            {
              value: 'does-not',
              label: 'It does not say',
              flag: 'watch',
              flagNote:
                'Not a legal defect, and do not present it as one. It is our standard, and the reason a broker wants it is that a tool overstating itself is the representation that bites.',
            },
            {
              value: 'not-sure',
              label: 'Not sure',
              flag: 'watch',
              flagNote: 'Ask it directly on the hands-on pass: are you a person?',
            },
          ],
          followUp: 'Has anyone ever asked it straight out whether it is a person?',
          source: '07-compliance-and-guardrails/layer-c/ai-disclosure-and-escalation.md',
        },
        {
          id: 'x5.ai-escalation',
          prompt: 'Which of these hand straight to a person, every time?',
          kind: 'multi',
          why: 'The escalation set is the real control. Anything unticked is something it is still answering by itself.',
          showIf: {
            question: 'x5.ai-surfaces',
            equals: ['web-chat', 'sms-auto', 'social-auto', 'email-auto', 'voice-in', 'voice-out'],
          },
          allowOther: true,
          choices: [
            { value: 'stop', label: 'A request to stop, leave or unsubscribe' },
            { value: 'human', label: 'A request to speak to a person' },
            {
              value: 'product',
              label: 'Any question about a rate, a lender, eligibility or an amount',
              hint: 'Unticked here is the same finding as the rate question above.',
            },
            {
              value: 'hardship',
              label: 'Hardship, illness, bereavement, family violence or a stated vulnerability',
            },
            { value: 'complaint', label: 'A complaint, or any mention of a regulator or a lawyer' },
            { value: 'low-confidence', label: 'Two turns where it has not answered' },
            { value: 'contact-details', label: 'A request for contact or complaint details' },
            {
              value: 'none',
              label: 'None of these are configured',
              flag: 'risk',
              flagNote:
                'There is no route to a person on any of the paths that most need one. This is the finding, and it is fixable before anything else about the agent is.',
            },
          ],
          source: '07-compliance-and-guardrails/layer-c/ai-disclosure-and-escalation.md',
        },
        {
          id: 'x5.ai-escalation-cover',
          prompt:
            'When it hands over on hardship, who is actually on the other end, and inside what hours?',
          kind: 'long',
          why: 'An escalation into an unwatched queue turns a bad answer into silence. This is an onboarding question, not a template one.',
          showIf: {
            question: 'x5.ai-surfaces',
            equals: ['web-chat', 'sms-auto', 'social-auto', 'email-auto', 'voice-in', 'voice-out'],
          },
          placeholder: 'Who, which queue, and what hours they watch it…',
          flags: [
            {
              op: 'empty',
              level: 'risk',
              title: 'No named cover behind the hardship handover',
              note: 'A person in difficulty reaching an unstaffed queue is the highest-harm failure available in this channel, and no disclaimer covers it.',
              action: 'Ask who would pick it up at seven on a Friday evening.',
            },
          ],
          source: '07-compliance-and-guardrails/layer-c/ai-disclosure-and-escalation.md',
        },
        {
          id: 'x5.ai-escalation-log',
          prompt:
            'Is there a log of every handover: what triggered it, when, the conversation up to that point, and where it went?',
          kind: 'yesno',
          why: 'Without a record, an escalation is a behaviour nobody can prove happened.',
          showIf: {
            question: 'x5.ai-surfaces',
            equals: ['web-chat', 'sms-auto', 'social-auto', 'email-auto', 'voice-in', 'voice-out'],
          },
          flags: [
            {
              op: 'eq',
              value: 'no',
              level: 'watch',
              title: 'No escalation record',
              note: 'The value of this layer is the evidence it produces. Without the log there is nothing to show afterwards.',
              action: 'Ask how many handovers happened last month. If nobody knows, that is the point.',
            },
          ],
          source: '07-compliance-and-guardrails/layer-c/ai-disclosure-and-escalation.md',
        },
        {
          id: 'x5.ai-knowledge',
          prompt:
            'Who wrote what the bot knows, and does any of it hold lender names, rate sheets or product comparisons?',
          kind: 'long',
          why: 'A lender and product pair sitting in a knowledge base is one consumer question away from becoming an automated suggestion.',
          showIf: {
            question: 'x5.ai-surfaces',
            equals: ['web-chat', 'sms-auto', 'social-auto', 'email-auto', 'voice-in', 'voice-out'],
          },
          hint: 'The instruction text, the examples and the knowledge base all count, not only the visible copy.',
          source: '07-compliance-and-guardrails/layer-c/template-compliance-gate.md',
        },
        {
          id: 'x5.ai-adversarial',
          prompt:
            'Has anyone deliberately tried to get it to name a lender, quote a rate, refuse a handover, or claim to be human?',
          kind: 'yesno',
          why: 'Decides whether anything about the agent has ever been tested, or only configured.',
          showIf: {
            question: 'x5.ai-surfaces',
            equals: ['web-chat', 'sms-auto', 'social-auto', 'email-auto', 'voice-in', 'voice-out'],
          },
          flags: [
            {
              op: 'eq',
              value: 'no',
              level: 'watch',
              title: 'The agent has never been tested against its own boundaries',
              note: 'Configuration is not evidence of behaviour, and a prompt change can undo a boundary silently.',
              action: 'Offer to put three questions to it live while you are both here.',
            },
          ],
          source: '07-compliance-and-guardrails/layer-c/ai-disclosure-and-escalation.md',
        },
        {
          id: 'x5.conversation-read',
          prompt:
            'Auditor read: how much of a client conversation ends up somewhere the whole business can see?',
          kind: 'scale',
          why: 'Your own read, recorded at the end of the block. Not asked out loud.',
          hint: 'Score the record, not the intent.',
          min: 1,
          max: 5,
          scaleLabels: ['Nothing lands in a shared record', 'Every conversation lands in one record'],
          source: '11-operations/ghl-account-map.md',
        },
      ],
    },
  ],
}
