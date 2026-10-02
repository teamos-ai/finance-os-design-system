/**
 * Compliance posture and visibility — the two Diagnosis chapters that decide what can be built.
 *
 * Module 09 establishes what the client's current marketing rests on, because the next thing
 * that happens is that we write emails, SMS, funnel copy and automated replies that go out
 * under a credit licence which is theirs and not ours. Every flag here routes the client back
 * to their own licensee or compliance adviser: the instrument records what they told us, it
 * does not rule on it.
 *
 * Module 10 asks what they can actually see. It captures the numbers that exist today, the
 * ones assembled by hand, and the three they would want on one screen. It also sets a baseline
 * on the call, because a baseline captured after a build is not a baseline.
 */
import { Gauge, ShieldCheck } from 'lucide-react'
import type { Module } from '@/audit/types'

export const MODULE_COMPLIANCE: Module = {
  id: 'x9',
  number: '09',
  title: 'Compliance posture',
  purpose:
    'Establish what their marketing and messaging currently rests on, before we build anything that a consumer receives under their licence.',
  Icon: ShieldCheck,
  blocks: [
    /* ── (a) Consent and sending ─────────────────────────────────────────── */
    {
      id: 'x9.consent',
      title: 'Consent and sending',
      intro:
        'Before we build anything that sends, I want to understand what your current list rests on. None of this is a test. It decides what we can switch on straight away and what has to wait for you.',
      questions: [
        {
          id: 'x9.list-size',
          prompt:
            'Let me start with the numbers. How many contacts sit on each channel today, and how many of those carry a recorded consent date?',
          kind: 'table',
          why: 'The gap between the two columns is the migration decision, not a copy decision.',
          hint: 'One row per channel: email, SMS, and anything else that sends.',
          columns: [
            { key: 'channel', label: 'Channel', kind: 'short', width: 'md' },
            { key: 'contacts', label: 'Contacts', kind: 'number', width: 'sm' },
            { key: 'withDate', label: 'With a consent date', kind: 'number', width: 'sm' },
            { key: 'origin', label: 'Mostly came from', kind: 'short', width: 'lg' },
          ],
          followUp:
            'If you had to pull one of those segments out of the CRM today, could you identify it?',
          source: '07-compliance-and-guardrails/layer-a/spam-act-and-dnc.md',
        },
        {
          id: 'x9.consent-record',
          prompt:
            'Against each contact, do you record where the consent came from, the date, how it was given, and the actual words they agreed to?',
          kind: 'single',
          why: 'Spam Act s 16(5) puts the evidential burden on the sender. These four fields are what a send gate reads.',
          choices: [
            {
              value: 'all-four',
              label: 'All four: source, date, mechanism and the wording they saw',
            },
            {
              value: 'partial',
              label: 'Some of those, not all',
              hint: 'Usually a date and nothing else',
              flag: 'watch',
              flagNote:
                'Part of the record exists and part does not, which is harder to work with than a clean absence. Worth putting in front of their compliance adviser or licensee before we migrate anything.',
            },
            {
              value: 'inferred',
              label: 'Consent is inferred from the relationship, not recorded',
              flag: 'risk',
              flagNote:
                'There is nothing on file to point to if a record is ever asked for. This is a question for their own licensee or compliance adviser, and it decides whether we start from the existing list or only from contacts captured after go-live.',
            },
            {
              value: 'unsure',
              label: 'Not sure',
              flag: 'watch',
              flagNote:
                'Unknown is a finding in its own right. Put it on the hands-on list and ask their adviser what evidence they expect the business to hold.',
            },
          ],
          source: '07-compliance-and-guardrails/layer-c/sender-identity-and-opt-out.md',
        },
        {
          id: 'x9.list-origin',
          prompt:
            'Has any part of that list been built from addresses published online, bought in, or brought across from a previous business or a previous aggregator?',
          kind: 'multi',
          why: 'Spam Act Sch 2 cl 4(1): consent cannot be inferred from the mere fact an address is published. A segment like this gets kept separate, not merged.',
          choices: [
            {
              value: 'own-capture',
              label: 'No, all of it came through our own forms and our own clients',
            },
            {
              value: 'published',
              label: 'Some came from addresses published online',
              flag: 'risk',
              flagNote:
                'That segment needs to stay identifiable rather than blended into the main list, and whether it can be sent to at all is a call for their compliance adviser or licensee.',
            },
            {
              value: 'purchased',
              label: 'Some was bought, or supplied by a third party',
              flag: 'risk',
              flagNote:
                'Same treatment: keep it identifiable, and put the question of whether it can be sent to in front of their own adviser before anything is scheduled.',
            },
            {
              value: 'inherited',
              label: 'Some came across from a previous business or aggregator',
              flag: 'risk',
              flagNote:
                'The consent, if any, was given to a different entity. Their licensee is the right person to say what carries across and what does not.',
            },
            {
              value: 'unsure',
              label: 'Not sure which parts came from where',
              flag: 'watch',
              flagNote:
                'If the segments cannot be told apart in the CRM, that is itself the first job. Note it for the hands-on pass.',
            },
          ],
          followUp: 'Roughly how many contacts, and could you point at them in the CRM today?',
          source: '07-compliance-and-guardrails/layer-a/spam-act-and-dnc.md',
        },
        {
          id: 'x9.audience-split',
          prompt:
            'Do you message referral partners, agents and accountants off the same list as consumers, or are those kept apart?',
          kind: 'single',
          why: 'Spam Act Sch 2 cl 4(2) works one way for a published work address and the opposite way for a consumer. Software cannot tell them apart without a label.',
          choices: [
            { value: 'separate', label: 'Separate lists' },
            { value: 'same-tagged', label: 'One list, tagged by type' },
            {
              value: 'same-untagged',
              label: 'One list, not tagged',
              flag: 'risk',
              flagNote:
                'The two audiences sit under different rules and nothing in the data distinguishes them. An audience type on every list and every campaign is the fix, and the split itself is theirs to confirm with their adviser.',
            },
            {
              value: 'unsure',
              label: 'Not sure',
              flag: 'watch',
              flagNote: 'Goes on the hands-on list. The tags will show which it is.',
            },
          ],
          source: '07-compliance-and-guardrails/layer-c/sender-identity-and-opt-out.md',
        },
        {
          id: 'x9.sender-block',
          prompt:
            'Give me exactly what appears on a marketing send today: the from-name, the from-address, the reply-to, and the legal entity, ABN and physical address in the footer.',
          kind: 'table',
          why: 'Spam Act s 17(1)(a) and (b): the message identifies the organisation that authorised the send, with contact detail that stays valid. A trading name that is not the authoriser propagates into every automated send.',
          hint: 'One row per field. Write what is actually there, not what should be there.',
          columns: [
            { key: 'field', label: 'Field', kind: 'short', width: 'md' },
            { key: 'value', label: 'As it appears today', kind: 'short', width: 'lg' },
          ],
          followUp: 'Does that reply-to land in a mailbox a person actually reads?',
          source: '07-compliance-and-guardrails/layer-c/sender-identity-and-opt-out.md',
        },
        {
          id: 'x9.unsub-tested',
          prompt:
            'When did anyone on your side last click your own unsubscribe link and watch it actually process?',
          kind: 'single',
          why: 'Spam Act s 18(1)(e): the unsubscribe route has to keep working for at least 30 days after a send. Only a walked test shows that it does.',
          choices: [
            { value: 'last-month', label: 'Within the last month' },
            {
              value: 'last-year',
              label: 'Within the last year',
              flag: 'watch',
              flagNote:
                'Platforms change. Worth walking it again before anything new starts sending, and recording the date it was walked.',
            },
            {
              value: 'never',
              label: 'Never',
              flag: 'risk',
              flagNote:
                'The unsubscribe route is infrastructure, and nobody has confirmed it works. It goes on the hands-on list, and the result is theirs to keep as a record.',
            },
            {
              value: 'unsure',
              label: 'Not sure',
              flag: 'watch',
              flagNote: 'Treat as never until somebody has walked it and written down the date.',
            },
          ],
          followUp:
            'Does unsubscribing require a login, or ask them for any further personal detail?',
          source: '07-compliance-and-guardrails/layer-a/spam-act-and-dnc.md',
        },
        {
          id: 'x9.sms-optout',
          prompt:
            'Do your SMS bodies carry an opt-out line inside the message, or do you rely on the platform handling STOP?',
          kind: 'single',
          why: 'Whether platform STOP handling alone discharges the obligation is not settled in our sources, so the safer build puts the line in the body, measured after merge fields expand.',
          choices: [
            { value: 'in-body', label: 'An opt-out line in every message' },
            {
              value: 'platform-only',
              label: 'Platform STOP handling only',
              flag: 'watch',
              flagNote:
                'Not something to assert either way on the call. Note it, and let their adviser decide whether the body line goes in as well.',
            },
            {
              value: 'mixed',
              label: 'Mixed, some carry it and some do not',
              flag: 'watch',
              flagNote:
                'Inconsistency across a template library is the thing to count on the hands-on pass. Get the number before deciding anything.',
            },
            { value: 'no-sms', label: 'We do not send SMS' },
            {
              value: 'unsure',
              label: 'Not sure',
              flag: 'watch',
              flagNote: 'Goes on the hands-on list. The templates will answer it in minutes.',
            },
          ],
          source: '07-compliance-and-guardrails/layer-c/sender-identity-and-opt-out.md',
        },
        {
          id: 'x9.send-window',
          prompt:
            'What hours do you send email and SMS today, and did anyone tell you that window was a legal requirement?',
          kind: 'short',
          why: 'There is no statutory quiet-hours rule for SMS marketing in Australia. If they believe there is, correct it on the call rather than repeating it back to them.',
          placeholder: 'e.g. 9am to 6pm weekdays, set from the account timezone',
          hint: 'If they say it is the law, say plainly that it is not, and that a send window is a choice a business makes.',
          source: '11-operations/send-windows-and-rate-rules.md',
        },
      ],
    },

    /* ── (b) Calling ─────────────────────────────────────────────────────── */
    {
      id: 'x9.calling',
      title: 'Calling',
      intro:
        'Now the phone. If everything you do is inbound, this block is one question long and we move on.',
      questions: [
        {
          id: 'x9.cold-calling',
          prompt:
            'Do you, or anyone acting for you, ring people who have not asked you to call them?',
          kind: 'yesno',
          why: 'A no drops the whole calling layer out of the build. A yes brings the register, hours and contract rules with it.',
          flags: [
            {
              op: 'eq',
              value: 'yes',
              level: 'watch',
              title: 'Outbound calling is in scope',
              note: 'The Do Not Call Register Act and the Telemarketing and Research Calls Industry Standard 2017 both sit over this, and the controls they describe are operational rather than editorial.',
              action:
                'Work through the rest of this block properly, and ask who else dials on their behalf.',
            },
            {
              op: 'eq',
              value: 'unsure',
              level: 'watch',
              title: 'Nobody is certain whether cold calls go out',
              note: 'Where an agency, a VA or a call centre is involved, the person on the call often does not know what is dialled.',
              action: 'Ask who else has access to the contact list, and what they do with it.',
            },
          ],
          source: '07-compliance-and-guardrails/layer-a/spam-act-and-dnc.md',
        },
        {
          id: 'x9.who-dials',
          prompt: 'Who does the dialling?',
          kind: 'multi',
          why: 'DNC Act s 11(9): an arrangement under which a contractor makes the calls can still be the client causing them. A synthetic voice is a voice call.',
          showIf: { question: 'x9.cold-calling', equals: ['yes', 'unsure'] },
          choices: [
            { value: 'you', label: 'You personally' },
            { value: 'in-house', label: 'In-house staff' },
            {
              value: 'offshore-va',
              label: 'An offshore VA team',
              flag: 'watch',
              flagNote:
                'An arrangement with a third party brings its own contract requirements. Their own legal or compliance adviser is the right person to check what is in that agreement.',
            },
            {
              value: 'call-centre',
              label: 'A contracted call centre',
              flag: 'watch',
              flagNote:
                'Same point. Ask to see the agreement, and note who holds it on their side.',
            },
            { value: 'dialler', label: 'A power or auto dialler' },
            {
              value: 'ai-voice',
              label: 'An AI voice agent',
              flag: 'risk',
              flagNote:
                'A synthetic voice is still a voice call, so the whole Telemarketing Standard applies to it, plus everything in the AI block below. Nothing here goes live before their licensee has looked at it.',
            },
            { value: 'inbound-only', label: 'Nobody, we are inbound only' },
          ],
          source: '07-compliance-and-guardrails/layer-d/accessorial-liability.md',
        },
        {
          id: 'x9.dnc-wash',
          prompt:
            'Before a list gets dialled, is it washed against the Australian Do Not Call Register, and is that wash recorded per number with a timestamp, or per list with a date?',
          kind: 'single',
          why: 'DNC Act s 11(3) anchors the window to the call date, so a per-number timestamp is the only record that supports the defence for an individual call.',
          showIf: { question: 'x9.cold-calling', equals: ['yes', 'unsure'] },
          choices: [
            { value: 'per-number', label: 'Per number, with a timestamp' },
            {
              value: 'per-list',
              label: 'Per list, with a date',
              flag: 'risk',
              flagNote:
                'A list-level date cannot speak to a number added mid-cycle. Their compliance adviser should see how the record is kept before the next list is dialled.',
            },
            {
              value: 'platform-unchecked',
              label: 'The platform does it and we have never checked',
              flag: 'risk',
              flagNote:
                'This is the one to test rather than take on trust. The test is the wash step itself: submit a number known to be on the Australian register, watch it run, and date what it returns. No call gets placed, and a vendor page is not that evidence. Their compliance adviser should see the result, and the vendor’s claim is not repeated until that dated result exists.',
            },
            {
              value: 'not-washed',
              label: 'Not washed',
              flag: 'risk',
              flagNote:
                'Stop here and put it to their licensee. Nothing else in the calling layer matters until this is resolved on their side.',
            },
            {
              value: 'unsure',
              label: 'Not sure',
              flag: 'watch',
              flagNote: 'Goes on the hands-on list as a test, not as a settings check.',
            },
          ],
          followUp:
            'How do you know the tool checks the Australian register run by ACMA, rather than an internal suppression list or an overseas one?',
          source: '07-compliance-and-guardrails/layer-a/spam-act-and-dnc.md',
        },
        {
          id: 'x9.wash-age',
          prompt: 'How old can a washed number be before your team will still dial it?',
          kind: 'number',
          unit: 'days',
          why: 'Past 30 days from the call date there is no s 11(3) defence available. The answer decides whether the build carries a hard block or a warning.',
          min: 0,
          max: 365,
          showIf: { question: 'x9.cold-calling', equals: ['yes', 'unsure'] },
          flags: [
            {
              op: 'gt',
              value: 30,
              level: 'risk',
              title: 'Numbers dialled beyond the washing window',
              note: 'The window is measured to the day the call is made, not a monthly cycle, so a number washed this long ago falls outside s 11(3).',
              action:
                'Ask what would break if the dialler refused anything past 30 days, and refer the current practice to their licensee.',
            },
          ],
          source: '07-compliance-and-guardrails/layer-a/spam-act-and-dnc.md',
        },
        {
          id: 'x9.dial-hours',
          prompt:
            'What hours do you dial, and is that clock set from your own timezone or from where the person lives? And do you dial on Sundays or public holidays?',
          kind: 'long',
          why: 'Telemarketing Standard 2017 cl 8: no Sundays, weekdays 9am to 8pm, Saturdays 9am to 5pm, seven named public holidays out, and cl 8(4) sets the clock at the account-holder usual residential address.',
          placeholder:
            'e.g. 9am to 7pm Monday to Friday, computed from the account timezone in Victoria',
          hint: 'Almost every dialler defaults to the account timezone, which is the wrong one. Worth checking which yours uses before anything else.',
          followUp:
            'Does the scheduler know the public holiday calendar, or does somebody turn it off by hand?',
          source: '07-compliance-and-guardrails/layer-a/spam-act-and-dnc.md',
        },
        {
          id: 'x9.calling-controls',
          prompt:
            'Which of these have you confirmed, as opposed to assumed, about your calling today?',
          kind: 'multi',
          why: 'Telemarketing Standard cl 13 on stopping immediately and cl 14(1) on calling line identification, plus DNC Act s 12(1)(c) on the clause a contractor arrangement has to carry.',
          showIf: { question: 'x9.cold-calling', equals: ['yes', 'unsure'] },
          choices: [
            { value: 'caller-id', label: 'Caller ID is enabled on every outbound line' },
            {
              value: 'stop-written-back',
              label: 'A stop request mid-call gets written back to the record, not just remembered',
            },
            {
              value: 'contractor-clause',
              label:
                'Any contractor or offshore team has a Do Not Call Register Act compliance clause in their contract',
            },
            {
              value: 'business-numbers',
              label: 'We also ring business numbers: accountants, agents, referral partners',
              flag: 'watch',
              flagNote:
                'Whether business numbers can be registered is not settled in our sources and secondary sources disagree, so this is one for their own adviser rather than a position we take on the call.',
            },
            {
              value: 'none-confirmed',
              label: 'None of these have actually been confirmed',
              flag: 'risk',
              flagNote:
                'Three separate controls, none of them checked. Each is verifiable in an afternoon, and the contract clause is one for their legal adviser rather than for us.',
            },
          ],
          followUp:
            'A verbal stop that never reaches the CRM gets dialled again next cycle. Ask them to walk through what happened the last time someone asked to be taken off.',
          source: '07-compliance-and-guardrails/layer-a/spam-act-and-dnc.md',
        },
      ],
    },

    /* ── (c) Privacy ─────────────────────────────────────────────────────── */
    {
      id: 'x9.privacy',
      title: 'Privacy',
      intro:
        'Privacy next. Some of this is a document edit on your side, and some of it is a design decision on the forms we are about to rebuild.',
      questions: [
        {
          id: 'x9.privacy-policy',
          prompt: 'Do you have a privacy policy live right now, and when was it last touched?',
          kind: 'short',
          why: 'APP 1.4 sets its contents and APP 1.7 adds to them from 10 December 2026. A stale policy is an edit with a date on it; a missing one is a build dependency.',
          placeholder: 'URL, and the date it was last updated',
          followUp:
            'Who wrote it, and does it still describe the systems you are actually running?',
          source: '07-compliance-and-guardrails/layer-a/privacy-and-app.md',
        },
        {
          id: 'x9.collection-notice',
          prompt:
            'On the form a consumer actually fills in, is there a collection notice at the point of collection, or a tick box and a link to the policy?',
          kind: 'single',
          why: 'The form is the artefact we rebuild, so what sits on it at the moment of collection is a decision made once and inherited everywhere.',
          choices: [
            { value: 'notice-on-form', label: 'A collection notice on the form itself' },
            {
              value: 'tickbox-and-link',
              label: 'A tick box and a link to the policy',
              flag: 'watch',
              flagNote:
                'Common, and worth putting in front of their adviser when the forms get rebuilt, because the rebuild is the cheapest moment to change it.',
            },
            {
              value: 'tickbox-only',
              label: 'A tick box only',
              flag: 'risk',
              flagNote:
                'Nothing at the point of collection tells the person what is being collected or why. Their own privacy adviser should specify the wording; we build whatever they specify.',
            },
            {
              value: 'nothing',
              label: 'Nothing',
              flag: 'risk',
              flagNote:
                'Same route: their adviser writes it, we put it on every capture point. Note how many forms that is.',
            },
          ],
          followUp: 'How many capture points are there in total? Every one of them needs the same.',
          source: '07-compliance-and-guardrails/layer-a/privacy-and-app.md',
        },
        {
          id: 'x9.data-requests',
          prompt:
            'If someone emails you tomorrow and asks what you hold on them, or asks you to delete it, what actually happens?',
          kind: 'long',
          why: 'APP 12 access and APP 13 correction. The useful part of the answer is whether there is an owner or only an inbox.',
          placeholder: 'Who receives it, what they do, and how long it takes',
          followUp:
            'Has that ever happened? If it has, ask what they sent back and how long it took.',
          source: '07-compliance-and-guardrails/layer-a/privacy-and-app.md',
        },
        {
          id: 'x9.data-location',
          prompt:
            'Where does your data sit, and which of your suppliers are offshore? CRM, dialler, AI tools, email provider, payment processor.',
          kind: 'table',
          why: 'APP 8 on cross-border disclosure. A named recipient needs a named country, and a payment processor needs naming rather than describing as a category.',
          columns: [
            { key: 'system', label: 'System', kind: 'short', width: 'md' },
            { key: 'supplier', label: 'Supplier', kind: 'short', width: 'md' },
            { key: 'country', label: 'Country', kind: 'short', width: 'sm' },
            { key: 'holds', label: 'What it holds', kind: 'short', width: 'lg' },
          ],
          followUp:
            'Does the policy name each of those, with the country? That is a question for whoever drafted it.',
          source: '07-compliance-and-guardrails/layer-a/privacy-and-app.md',
        },
        {
          id: 'x9.credit-eligibility',
          prompt:
            'Does your marketing system hold, or even touch, anything that is credit eligibility information? A credit score, a default, repayment history, a credit enquiry.',
          kind: 'yesno',
          why: 'Privacy Act Part IIIA is a separate regime from the APPs. This one stops work on that surface rather than adding a note to it.',
          flags: [
            {
              op: 'eq',
              value: 'yes',
              level: 'risk',
              title: 'Credit information inside the marketing system',
              note: 'A marketing platform is not where this belongs, and the boundary question is one for their own privacy adviser or licensee before anything is built over the top of it.',
              action:
                'Ask them to name the field, the form and the automation now, and park the build on that surface until their adviser has looked.',
            },
            {
              op: 'eq',
              value: 'unsure',
              level: 'watch',
              title: 'Nobody knows what the custom fields hold',
              note: 'A custom field type is permanent once set, so this is worth resolving before anything new is created.',
              action: 'Ask for a full custom field export ahead of the hands-on pass.',
            },
          ],
          followUp:
            'Which field, which form, and which automation puts it there? We check field by field on the hands-on pass.',
          source: '07-compliance-and-guardrails/layer-a/privacy-and-app.md',
        },
        {
          id: 'x9.automated-decisions',
          prompt:
            'Does anything in your setup decide something about a person automatically? Lead scoring that suppresses a contact, routing that sends someone to a queue nobody watches, a qualifier that drops them out.',
          kind: 'long',
          why: 'APP 1.9(a) and (b): refusing or failing to make a decision is still making one, which catches ordinary marketing automation. The policy obligation commences 10 December 2026.',
          placeholder: 'Name the automation, what it decides, and what happens to the person',
          followUp:
            'And does the privacy policy mention AI, automated decision-making or profiling anywhere at all?',
          source: '07-compliance-and-guardrails/layer-c/ai-disclosure-and-escalation.md',
        },
      ],
    },

    /* ── (d) The credit perimeter ────────────────────────────────────────── */
    {
      id: 'x9.perimeter',
      title: 'The credit perimeter',
      intro:
        'This block is about the words already in your marketing, and where the line sits between marketing and credit assistance. I am not assessing you. I am working out what we can and cannot write on your behalf.',
      questions: [
        {
          id: 'x9.copy-owner',
          prompt: 'Who writes your copy today, and does anything check it before it goes out?',
          kind: 'long',
          why: 'Establishes whether we inherit a review trail or start the first one, and who holds sign-off after handover.',
          placeholder: 'Who writes, who reviews, and whether it is written down anywhere',
          followUp:
            'Has a compliance practitioner, or your aggregator compliance team, ever read your marketing copy? When was that?',
          source: '07-compliance-and-guardrails/approval-rules.md',
        },
        {
          id: 'x9.live-surfaces',
          prompt:
            'Which of these carry live consumer-facing copy today? I want the full list, because a review that misses a surface passes and ships anyway.',
          kind: 'multi',
          why: 'The template gate binds every one of these, including subject lines, button labels, form headings and the AI prompt, not only body copy.',
          choices: [
            { value: 'email', label: 'Email templates' },
            { value: 'sms', label: 'SMS templates' },
            { value: 'funnels', label: 'Funnel and landing pages' },
            { value: 'scripts', label: 'Sales scripts and objection handlers' },
            {
              value: 'chat-agent',
              label: 'Chat agent prompt and knowledge base',
              flag: 'watch',
              flagNote:
                'The prompt and the knowledge base are copy. They are the surface most likely to produce something nobody wrote, and they get scanned with everything else.',
            },
            { value: 'voice-agent', label: 'Voice agent scripts' },
            { value: 'auto-replies', label: 'Automated replies' },
            { value: 'blog', label: 'Blog posts' },
            { value: 'social', label: 'Social posts' },
            { value: 'ads', label: 'Paid ads' },
            { value: 'lead-magnets', label: 'Lead magnets and downloads' },
            { value: 'subject-lines', label: 'Subject lines and preheaders' },
            { value: 'micro-copy', label: 'Button labels and form headings' },
          ],
          followUp:
            'Anything you would not call marketing is usually where the sharpest line sits. Add it to the list.',
          source: '07-compliance-and-guardrails/layer-c/template-compliance-gate.md',
        },
        {
          id: 'x9.lender-product-pairs',
          prompt:
            'Pull up your best-performing email. Does it name a lender and a product together anywhere in the body, with something to click?',
          kind: 'yesno',
          why: 'NCCP s 8(a) and (d): a particular contract with a particular provider is the trigger. A rate alone is not, a lender name alone is not, the pair with a call to action is a different thing.',
          flags: [
            {
              op: 'eq',
              value: 'yes',
              level: 'risk',
              title: 'A named lender and a named product in the same message',
              note: 'This is the shape that sits closest to the credit assistance line, and a scheduled send made no individual assessment behind it. Their licensee or compliance adviser should read those templates before we extend the library.',
              action:
                'Ask which templates, how many, and whether the aggregator has ever seen them.',
            },
          ],
          followUp:
            'How many of your templates would that be true of? We count them properly on the hands-on pass.',
          source: '07-compliance-and-guardrails/layer-b/nccp-credit-activity-and-assistance.md',
        },
        {
          id: 'x9.stay-put-messages',
          prompt:
            'Do any of your sequences tell a past client their current loan is still competitive, still the right one, or that there is nothing they need to change? Or the reverse, that it is time to refinance?',
          kind: 'yesno',
          why: 'NCCP s 8(c) and RG 273.119. Either direction reaches a conclusion about a contract, and a timer performed no assessment. NCCP s 8(c) and RG 273.119. Either direction reaches a conclusion about a contract, and a timer performed no assessment. Read the post-settlement kit before assuming it is clear.',
          flags: [
            {
              op: 'eq',
              value: 'yes',
              level: 'risk',
              title: 'An automated message that reaches a verdict about a live loan',
              note: 'Both directions land in the same place: a conclusion about a particular contract, sent on a schedule. Their licensee is the right person to read the actual wording.',
              action:
                'Read the message out loud with them. A message that notes twelve months have passed and offers a review makes no representation about any contract, and that is the shape worth talking about.',
            },
            {
              op: 'eq',
              value: 'unsure',
              level: 'watch',
              title: 'Nobody has read the nurture sequence recently',
              note: 'Sequences written years ago keep sending. What is in them is a question of fact, answerable in an hour.',
              action: 'Ask for the sequence export ahead of the hands-on pass.',
            },
          ],
          source: '07-compliance-and-guardrails/layer-b/best-interests-duty-rg273.md',
        },
        {
          id: 'x9.outcome-language',
          prompt: 'Does any of your copy, anywhere, use these?',
          kind: 'multi',
          why: 'RG 234.136, .137 and .140 to .142 on suitability and approval language; NCCP s 160B and s 160C on prohibited self-descriptions; s 13(1) on a representation about a future matter.',
          hint: 'Check the button labels and the subject lines too. That is where these survive a copy pass.',
          choices: [
            {
              value: 'qualify-or-preapproved',
              label: '"Find out if you qualify" or "you are pre-approved"',
              flag: 'risk',
              flagNote:
                'Language of this kind implies an assessment that has not happened. Their compliance adviser should rule on the wording, and we do not write it in the meantime.',
            },
            {
              value: 'guaranteed-approval',
              label: '"Guaranteed approval" or "instant approval"',
              flag: 'risk',
              flagNote:
                'Named directly in the advertising guidance. Route it to their adviser, and take it off the build list until they have.',
            },
            {
              value: 'no-credit-check',
              label: '"No credit check"',
              flag: 'risk',
              flagNote:
                'It represents that no assessment happens, which sits at odds with the rest of the process. One for their adviser to look at across every surface, including ads.',
            },
            {
              value: 'independent',
              label: '"Independent", "impartial" or "unbiased" about yourselves',
              flag: 'risk',
              flagNote:
                'NCCP s 160B restricts those words in a representation to a consumer when providing a credit service, and the available defence turns on remuneration. This is squarely a question for their licensee.',
            },
            {
              value: 'financial-counsellor',
              label: '"Financial counsellor" or "financial counselling"',
              flag: 'risk',
              flagNote:
                'NCCP s 160C names those two terms. Whether any similar term is caught depends on regulations we have not read, so do not extend the list on the call.',
            },
            {
              value: 'savings-figure',
              label: 'A figure for what someone could save, borrow, or be approved for',
              flag: 'risk',
              flagNote:
                'A representation about a future matter needs grounds behind it, and the grounds have to exist as a record. Ask where the number came from and who holds the working.',
            },
            {
              value: 'free',
              label: '"Free" beside anything that carries a charge later',
              flag: 'watch',
              flagNote:
                'Worth a second look at how the fee is described and where. Their adviser decides the wording.',
            },
            { value: 'none', label: 'None of these' },
          ],
          source: '07-compliance-and-guardrails/layer-b/rg234-advertising.md',
        },
        {
          id: 'x9.guide-timing',
          prompt:
            'When does a client actually get your credit guide today, and how is that delivery evidenced?',
          kind: 'single',
          why: 'NCCP s 113: as soon as practicable after it becomes apparent that credit assistance is likely. RG 273.21 puts the evidence in the broker records, not in card positions.',
          choices: [
            {
              value: 'booking-timestamped',
              label: 'At or near the booking, with a timestamped delivery record',
            },
            {
              value: 'booking-stage',
              label: 'At or near the booking, evidenced by a pipeline stage',
              flag: 'watch',
              flagNote:
                'A stage transition shows a card moved. It does not show a document arrived. Two fields and two logged events close that on stages most accounts already have.',
            },
            {
              value: 'meeting',
              label: 'At the first meeting',
              flag: 'watch',
              flagNote:
                'If the funnel has already made credit assistance likely, the timing question arrives before the meeting does. Worth putting to their licensee with the funnel in front of them.',
            },
            {
              value: 'app-pack',
              label: 'With the application pack',
              flag: 'risk',
              flagNote:
                'That is well downstream of the point the obligation is usually triggered. Their licensee should look at the sequence, not us.',
            },
            {
              value: 'case-by-case',
              label: 'Case by case',
              flag: 'risk',
              flagNote:
                'Case by case means there is no record of which cases. Their adviser will want a consistent point, and the funnel can carry whatever they choose.',
            },
            {
              value: 'unsure',
              label: 'Not sure',
              flag: 'watch',
              flagNote: 'Goes on the hands-on list. The workflows will show what actually fires.',
            },
          ],
          followUp:
            'And where does the guide itself come from, your lodgement system or a document somebody edits? We do not draft it. It names their panel and their remuneration, so it is theirs.',
          source: '07-compliance-and-guardrails/layer-b/credit-guide-timing-s113.md',
        },
        {
          id: 'x9.bid-evidence',
          prompt:
            'When you present options to a client, is there a record of what you presented, the reason for each, and the date?',
          kind: 'single',
          why: 'RG 273.20 on presenting more than one option, and RG 273.21 on evidence coming predominantly from the broker own records.',
          choices: [
            { value: 'record-with-reasons', label: 'A record with the options, the reasons and a date' },
            {
              value: 'stage-only',
              label: 'A pipeline stage marked complete',
              flag: 'risk',
              flagNote:
                'The stage is a position, not a record. A sequence that writes a record is worth something later; one that writes none is a sequence with good open rates.',
            },
            {
              value: 'unstructured-notes',
              label: 'Notes in the CRM, unstructured',
              flag: 'watch',
              flagNote:
                'Better than nothing and hard to retrieve. Ask how they would find one specific client conversation from eighteen months ago.',
            },
            {
              value: 'nothing',
              label: 'Nothing recorded',
              flag: 'risk',
              flagNote:
                'This is one to raise with their licensee, and it is also the cheapest thing on the list to change, because the stages usually already exist.',
            },
          ],
          followUp:
            'Six months from now, if you had to show that a particular client received a particular guide and saw a particular set of options, where would you go? The pause is the finding.',
          source: '07-compliance-and-guardrails/layer-c/bid-by-construction.md',
        },
      ],
    },

    /* ── (e) Anything answering on their behalf ──────────────────────────── */
    {
      id: 'x9.ai',
      title: 'Anything answering on your behalf',
      intro:
        'Last one in this chapter. Anything that replies without you is the surface most likely to say something you would never write, in your name, at 11pm.',
      questions: [
        {
          id: 'x9.ai-surfaces',
          prompt: 'What is automated in your conversations today?',
          kind: 'multi',
          why: 'Each surface pulls a different rule set. A synthetic voice is a voice call, so an outbound agent pulls in the Telemarketing Standard as well as everything else here.',
          choices: [
            { value: 'web-chat', label: 'Website chat widget' },
            { value: 'sms-auto', label: 'SMS or Messenger auto-reply' },
            {
              value: 'voice-inbound',
              label: 'AI voice agent, inbound',
              flag: 'watch',
              flagNote:
                'Naming the business, the purpose and a route to a person is how we would build it. The calling rules reach outbound calls, so put the inbound question to their licensee.',
            },
            {
              value: 'voice-outbound',
              label: 'AI voice agent, outbound',
              flag: 'risk',
              flagNote:
                'This sits inside the calling block as well as this one, and it goes nowhere near a consumer before their licensee has heard it.',
            },
            { value: 'email-auto', label: 'Email auto-reply that composes its own text' },
            { value: 'none', label: 'Nothing automated' },
          ],
          source: '07-compliance-and-guardrails/layer-c/ai-disclosure-and-escalation.md',
        },
        {
          id: 'x9.ai-rate-answer',
          prompt:
            'If a consumer asks it right now what rate they would get, or which lender suits them, what does it actually say?',
          kind: 'long',
          why: 'An agent answering that is a product suggestion in the broker name, with no guide and no assessment behind it. Any match, ranking or best-fit output is a hard stop in the build, not a warning.',
          placeholder: 'Their words, or the actual reply if you can get it live',
          hint: 'The best version of this question is asked with the widget open.',
          followUp:
            'Would you mind if I asked it that question live, right now, while we are on this call?',
          source: '07-compliance-and-guardrails/layer-b/nccp-credit-activity-and-assistance.md',
        },
        {
          id: 'x9.ai-disclosure',
          prompt:
            'Does it tell people it is automated, and what exactly does it say if someone asks it straight out whether it is a person?',
          kind: 'long',
          why: 'No Australian law requires AI disclosure. Present it as our product standard, never as the law, and RG 234.153 is the reason a broker wants it: advertising for an AI tool should not overstate the tool.',
          placeholder: 'The disclosure line as written, and what it says when challenged',
          followUp:
            'If they believe disclosure is legally required, correct it plainly and say why we do it anyway.',
          source: '07-compliance-and-guardrails/layer-c/ai-disclosure-and-escalation.md',
        },
        {
          id: 'x9.ai-escalation',
          prompt: 'Which of these does it hand to a person, immediately and without conditions?',
          kind: 'multi',
          why: 'The seven escalation triggers. An automated reply to someone in hardship is the highest-harm failure available and no disclaimer covers it.',
          choices: [
            { value: 'stop', label: 'A request to stop, leave, unsubscribe, or "not interested"' },
            { value: 'human', label: 'A request to speak to a person' },
            {
              value: 'product',
              label: 'Any question about a product, a rate, a lender, eligibility or an amount',
            },
            {
              value: 'hardship',
              label:
                'Hardship, financial difficulty, illness, bereavement, family violence, or a stated vulnerability',
            },
            { value: 'complaint', label: 'A complaint, or any mention of a regulator or a lawyer' },
            { value: 'stuck', label: 'Two turns without answering, or low confidence' },
            { value: 'contact-details', label: 'A request for contact or complaints details' },
            {
              value: 'none-configured',
              label: 'None of these are configured',
              flag: 'risk',
              flagNote:
                'The agent is answering everything, including the things that most need a person. Nothing goes live in this state, and the trigger list is theirs to approve with their licensee.',
            },
          ],
          followUp:
            'Has anyone ever tried to break it on purpose? Ten different ways of asking for a human, five ways of mentioning hardship.',
          source: '07-compliance-and-guardrails/layer-c/ai-disclosure-and-escalation.md',
        },
      ],
    },
  ],
}

export const MODULE_VISIBILITY: Module = {
  id: 'x10',
  number: '10',
  title: 'What they can actually see',
  purpose:
    'Find out which numbers exist, which get assembled by hand, and which three they would put on one screen, then set a baseline before anything changes.',
  Icon: Gauge,
  blocks: [
    /* ── What they look at now ───────────────────────────────────────────── */
    {
      id: 'x10.today',
      title: 'What you look at now',
      intro:
        'Changing tack. I want to know what you can see today, because that decides what is worth building and what would just be another screen nobody opens.',
      questions: [
        {
          id: 'x10.weekly-numbers',
          prompt: 'What numbers do you look at each week, and where do they come from?',
          kind: 'long',
          why: 'Establishes whether reporting exists or gets assembled. It also names the source they trust, which is the one anything new has to reconcile with.',
          placeholder: 'The numbers, and the system or spreadsheet each one comes out of',
          followUp: 'Which of those do you trust, and which do you check twice?',
          source: '04-voice-and-messaging/messaging-pillars.md',
        },
        {
          id: 'x10.who-reads',
          prompt: 'Who actually looks at them, and what decision do they make with them?',
          kind: 'short',
          why: 'A dashboard nobody reads is a build cost with no return. Naming the reader and the decision is what keeps a reporting layer from becoming decoration.',
          placeholder: 'e.g. me, Monday morning, to decide where the week goes',
          followUp:
            'If the answer is nobody, ask what they would need it to say before they opened it.',
          source: '04-voice-and-messaging/messaging-pillars.md',
        },
        {
          id: 'x10.aggregator-reporting',
          prompt: 'What reporting does your aggregator give you, and is it enough?',
          kind: 'single',
          why: 'Decides what a reporting layer would duplicate and what it would actually add. The aggregator is the system of record for lodgement and settlement, and it is not going anywhere.',
          choices: [
            { value: 'sufficient', label: 'Enough on its own, we rarely look elsewhere' },
            {
              value: 'lodgement-only',
              label: 'Good on lodgements and settlements, nothing on where the enquiry came from',
              flag: 'opportunity',
              flagNote:
                'That gap is the whole question. Write down exactly which fields it does not carry, because that list is the scope conversation.',
            },
            {
              value: 'minimal',
              label: 'Very little that we use',
              flag: 'opportunity',
              flagNote:
                'Ask what they tried and stopped using. A rejected report tells you more than a missing one.',
            },
            {
              value: 'none',
              label: 'Nothing we use',
              flag: 'opportunity',
              flagNote: 'Everything they see is something they made. Find out how.',
            },
            {
              value: 'unsure',
              label: 'Not sure what it gives us',
              flag: 'watch',
              flagNote:
                'Worth checking before proposing anything, in case it already exists and nobody opened it.',
            },
          ],
          followUp: 'What do you find yourself going somewhere else for?',
          source: '11-operations/pipelines-and-stages.md',
        },
        {
          id: 'x10.spreadsheet',
          prompt: 'What do you build by hand in a spreadsheet, and how often?',
          kind: 'long',
          why: 'Hand assembly is the clearest statement of what is missing, and it is also a staleness risk in their decisions today.',
          placeholder: 'What gets rebuilt, by whom, and how often',
          followUp: 'Can we see one? The columns they chose are the specification.',
          source: '03-audience-and-icp/voice-of-customer.md',
        },
        {
          id: 'x10.spreadsheet-hours',
          prompt: 'Roughly how many hours a month goes into that?',
          kind: 'number',
          unit: 'hours per month',
          why: 'A figure to carry into scoping. Do not translate it into money on the call.',
          min: 0,
          max: 200,
          flags: [
            {
              op: 'gt',
              value: 4,
              level: 'opportunity',
              title: 'Reporting is assembled by hand every month',
              note: 'A recurring manual rebuild is a specification somebody has already written, in the columns they chose.',
              action: 'Ask for the spreadsheet, and ask what they leave out because it takes too long.',
            },
          ],
          source: '03-audience-and-icp/voice-of-customer.md',
        },
      ],
    },

    /* ── The numbers they can produce ────────────────────────────────────── */
    {
      id: 'x10.numbers',
      title: 'The numbers you can produce',
      intro:
        'Let me test it rather than ask about it. Take as long as you need, and if you cannot get to a number, that is a useful answer too.',
      questions: [
        {
          id: 'x10.enquiries-last-month',
          prompt: 'Last month, how many enquiries arrived, and from where? Give me the split.',
          kind: 'table',
          why: 'What they can produce on the spot is the real baseline. Everything else is what they believe about themselves.',
          hint: 'One row per source. Note how long it took them to get to these.',
          columns: [
            { key: 'source', label: 'Source', kind: 'short', width: 'md' },
            { key: 'enquiries', label: 'Enquiries', kind: 'number', width: 'sm' },
            { key: 'appointments', label: 'Appointments', kind: 'number', width: 'sm' },
            { key: 'applications', label: 'Applications', kind: 'number', width: 'sm' },
          ],
          followUp:
            'Where did you have to go to get those? Write down the systems, not just the figures.',
          source: '11-operations/pipelines-and-stages.md',
        },
        {
          id: 'x10.fy-settlements',
          prompt:
            'If I asked you right now how many loans you settled last financial year, split by type, could you tell me inside five minutes?',
          kind: 'yesno',
          why: 'A named, checkable job rather than a feeling. Award submissions and lender reviews both ask for exactly this and it is usually the thing that takes a weekend.',
          flags: [
            {
              op: 'eq',
              value: 'no',
              level: 'opportunity',
              title: 'Settlement counts are not available on demand',
              note: 'A specific, verifiable job with a clear finish line, and one they will recognise the next time somebody asks for it.',
              action:
                'Ask what splits they need, and what they had to do the last time somebody asked.',
            },
            {
              op: 'eq',
              value: 'unsure',
              level: 'watch',
              title: 'Unclear whether the settlement history is retrievable',
              note: 'Usually means it lives in the aggregator and nobody has tried to get it out in that shape.',
              action: 'Ask them to try it after the call and tell us how long it took.',
            },
          ],
          followUp: 'What splits do you need: residential, investment, commercial, asset finance?',
          source: '03-audience-and-icp/voice-of-customer.md',
        },
        {
          id: 'x10.settled-attribution',
          prompt: 'Can you tell which marketing activity produced which settled loan?',
          kind: 'single',
          why: 'Attribution is the difference between a marketing budget and a marketing decision. It also decides whether any later before-and-after is possible at all.',
          choices: [
            { value: 'per-deal', label: 'Yes, per deal' },
            {
              value: 'by-period',
              label: 'Roughly, by period',
              flag: 'watch',
              flagNote:
                'Good enough to notice a trend, not good enough to cut a channel. Ask which decision they have been putting off for want of this.',
            },
            {
              value: 'no',
              label: 'No',
              flag: 'opportunity',
              flagNote:
                'No channel can be defended or dropped on evidence today. Capture the source field now, before anything changes, or there is nothing to compare against later.',
            },
          ],
          source: '11-operations/pipelines-and-stages.md',
        },
        {
          id: 'x10.stage-conversion',
          prompt:
            'Do you know your conversion between stages? Enquiry to appointment, appointment to application, application to settlement.',
          kind: 'table',
          why: 'Stage conversion is what makes a pipeline a management tool rather than a filing cabinet. It has to be captured before a build, not after.',
          hint: 'Leave a rate blank rather than guessing. A blank is data.',
          columns: [
            { key: 'step', label: 'Step', kind: 'short', width: 'lg' },
            { key: 'rate', label: 'Rate', kind: 'percent', width: 'sm' },
            { key: 'basis', label: 'How they know', kind: 'short', width: 'md' },
          ],
          source: '11-operations/pipelines-and-stages.md',
        },
        {
          id: 'x10.silent-failure',
          prompt:
            'If your follow-up stopped working tomorrow, a sequence broke or a form stopped posting, how would you find out, and how long would it take?',
          kind: 'long',
          why: 'Silent failure is the most expensive thing in a marketing system and the least likely to be watched. The answer is usually a story about a client who rang to chase.',
          placeholder: 'How they would notice, and how long it took the last time',
          followUp: 'Has that happened? What was the tell?',
          source: '11-operations/qa-checklist-prelaunch.md',
        },
      ],
    },

    /* ── What they would want to see ─────────────────────────────────────── */
    {
      id: 'x10.want',
      title: 'What you would want to see',
      intro:
        'Last part. Forget what is possible for a minute and tell me what you would want in front of you.',
      questions: [
        {
          id: 'x10.three-numbers',
          prompt: 'If you could only have three numbers on one screen, what would they be?',
          kind: 'long',
          why: 'Their answer is a real input into a decision nobody has made yet. Write it in their words, not yours.',
          placeholder: 'Three numbers, in their words',
          followUp: 'Why those three, and what would be missing?',
          source: '12-decisions-and-conflicts/OPEN-QUESTIONS.md',
        },
        {
          id: 'x10.decision-behind',
          prompt: 'And for each one, what would you do differently depending on what it said?',
          kind: 'short',
          why: 'A number that changes no decision is decoration. This separates the three that matter from the three that look good.',
          placeholder: 'One decision per number',
          source: '04-voice-and-messaging/messaging-pillars.md',
        },
        {
          id: 'x10.baseline-permission',
          prompt:
            'Would you be open to us measuring where things stand now and where they stand later, and writing it up with your name on it if the numbers are worth showing?',
          kind: 'yesno',
          why: 'Ask it early, get it in writing, and set the baseline on the same call. Without a written permission, a dated method and a starting figure, nothing from this engagement can ever be published.',
          flags: [
            {
              op: 'eq',
              value: 'yes',
              level: 'opportunity',
              title: 'Open to a measured write-up',
              note: 'Only counts if the baseline is set now and the permission is confirmed in writing afterwards. A recollection in four months is not a baseline.',
              action:
                'Agree the one metric, write down its value today, and send the permission wording the same day.',
            },
            {
              op: 'eq',
              value: 'no',
              level: 'watch',
              title: 'No permission to measure or publish',
              note: 'Recorded, and that is a perfectly reasonable answer. It means nobody should plan on a published write-up from this engagement.',
              action:
                'Ask whether an internal-only before and after is still useful to them. It usually is.',
            },
          ],
          followUp:
            'If yes: what would we measure, and what is the starting number today? Write both down before you move on.',
          source: '05-proof-and-evidence/what-we-cannot-claim.md',
        },
        {
          id: 'x10.maturity',
          prompt: 'Auditor read: how much of this business runs on numbers it can see?',
          kind: 'scale',
          why: 'Your read, not theirs. It sets the order of the build and it is the line you will remember in a week.',
          min: 1,
          max: 5,
          scaleLabels: ['Nothing measured', 'Every stage measured and read weekly'],
          hint: 'Score what you watched them do on this call, not what they told you they do.',
          flags: [
            {
              op: 'lt',
              value: 3,
              level: 'opportunity',
              title: 'Low measurement maturity',
              note: 'Almost nothing is visible, which means the first thing built has to be the thing that makes the rest legible.',
              action:
                'Before leaving the call, agree the one number they would most want to see that they cannot see today.',
            },
          ],
          source: '11-operations/pipelines-and-stages.md',
        },
      ],
    },
  ],
}
