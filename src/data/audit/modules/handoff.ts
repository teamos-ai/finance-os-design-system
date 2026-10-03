/**
 * Handoff — part three. Scope, inputs, access and the record.
 *
 * Parts one and two were interviews. This part converts what they said into a scoped build,
 * a named list of things the build cannot start without, an access pack for the separate
 * hands-on pass, and a written record of the call. It is filled at the end of the second
 * call and between calls.
 *
 * Three things govern the wording here. Nothing on this screen asserts a Finance OS outcome,
 * turnaround, service level or refund position, because none is published. Nothing implies
 * that a configuration carries the broker's obligations, because it does not. And no price
 * line names a currency, because the currency is an open owner decision.
 */
import { ClipboardCheck, KeyRound, PackageOpen, SlidersHorizontal } from 'lucide-react'
import type { Module } from '@/audit/types'

/* ═══════════════════════════════════════════════════════════════════════════
   01 · Scope and fit
   ═══════════════════════════════════════════════════════════════════════════ */

export const MODULE_SCOPE: Module = {
  id: 'h1',
  number: '01',
  title: 'Scope and fit',
  purpose:
    'Land the delivery shape, name every custom item out loud, and read the four boundaries back to them.',
  Icon: SlidersHorizontal,
  blocks: [
    {
      id: 'h1.shape',
      title: 'Which delivery shape fits',
      intro:
        'Three ways this gets delivered. They differ by who does the build, not by what the platform can do. Let us work out which one actually suits you.',
      questions: [
        {
          id: 'h1.delivery-shape',
          prompt:
            'Of these three, which one sounds like you: you configure it yourself, we build it and hand it over, or we build it and you get first access to new apps as they ship?',
          kind: 'single',
          why: 'The delivery axis is the whole tier decision. Ask it as preference, never as a price question.',
          source: 'db-finance-os/02-offer-and-pricing/tier-feature-matrix.md',
          followUp:
            'What made you land on that one? If it was the apps rather than the build, say so now.',
          choices: [
            {
              value: 'configure-yourself',
              label: 'I configure it myself',
              hint: 'You get the account. The build is yours to do.',
            },
            {
              value: 'built-for-you',
              label: 'Built for me and handed over',
              hint: 'The broker configuration is built on your account and handed across.',
            },
            {
              value: 'built-plus-first-access',
              label: 'Built for me, plus first access to new apps',
              hint: 'The same build, and you are first in line as apps ship.',
              flag: 'watch',
              flagNote:
                'Only one app has actually shipped. The rest are named and not built. Do not let a roadmap carry the decision: ask which app specifically, and whether they would still buy if it never shipped.',
            },
          ],
        },
        {
          id: 'h1.self-build',
          prompt:
            'Be honest with me. If we handed you a configured account and a walkthrough tomorrow, would you build the rest out, or would it sit there?',
          kind: 'single',
          why: 'The reality check behind the preference. A stated preference for self-serve plus no capacity is a build that decays.',
          source: 'db-finance-os/02-offer-and-pricing/tier-feature-matrix.md',
          choices: [
            { value: 'i-would-build-it', label: "I'd build it myself" },
            {
              value: 'someone-on-my-team',
              label: 'Someone on my team would',
              hint: 'Name them at the next question.',
            },
            {
              value: 'start-then-stall',
              label: "I'd start and then stall",
              flag: 'risk',
              flagNote:
                'Their own words, and the most useful answer on this screen. A self-configure shape here produces an account nobody finishes. Put the honest recommendation to them before they choose on price.',
            },
            { value: 'want-it-built', label: 'I want it built for me' },
          ],
        },
        {
          id: 'h1.internal-owner',
          prompt:
            'Once it is live, who owns this system day to day in your business? Name the person, not the role.',
          kind: 'short',
          why: 'Handover has to land with a named person in their business, not a job title. No named owner, no retention.',
          placeholder: 'Name, and what else sits on their plate',
          source: 'db-finance-os/02-offer-and-pricing/onboarding-and-delivery.md',
          followUp: 'And if they leave, who picks it up?',
        },
        {
          id: 'h1.time-available',
          prompt:
            'How much of your own time can you give this in the first fortnight? Realistically, not aspirationally.',
          kind: 'single',
          why: 'How fast access and content come back from their side is the stated dependency. Agreeing it on the call makes it an agreement rather than a defence.',
          source: 'db-finance-os/02-offer-and-pricing/onboarding-and-delivery.md',
          choices: [
            {
              value: 'under-2-hours',
              label: 'Under 2 hours a week',
              flag: 'watch',
              flagNote:
                'Branding, domain, access and the sending decisions all need them. At this level of availability, set the expectation now that the schedule moves at their pace, and name no date.',
            },
            { value: '2-to-5-hours', label: '2 to 5 hours a week' },
            { value: '5-to-10-hours', label: '5 to 10 hours a week' },
            { value: 'whatever-it-takes', label: 'Whatever it takes' },
          ],
        },
      ],
    },
    {
      id: 'h1.custom',
      title: 'The custom items',
      intro:
        'Here is the list of things people usually want on top of the core build. Tell me straight which of these you are expecting to be part of this.',
      questions: [
        {
          id: 'h1.custom-items',
          prompt:
            'Which of these are you expecting to be included in what we do for you?',
          kind: 'multi',
          why: 'Every box ticked is scope priced now or margin lost in week three. No tier mapping exists for any of the eleven.',
          hint: 'Read them out. Do not let a nod cover the list.',
          source: 'db-finance-os/02-offer-and-pricing/onboarding-and-delivery.md',
          followUp:
            'Which of those did someone tell you was included, and who told you? Write down the name.',
          flags: [
            {
              op: 'notEmpty',
              level: 'watch',
              title: 'Custom scope is on the table',
              note: 'None of these eleven items has a documented tier home and none is recorded as included or as a paid extra. Anything not priced on this call gets absorbed.',
              action:
                'Price each ticked item separately, or write down in front of them that it is out of scope for now.',
            },
          ],
          allowOther: true,
          choices: [
            {
              value: 'custom-forms-surveys',
              label: 'Custom forms and surveys',
              flag: 'watch',
              flagNote:
                'Bounded work, but a fact find or an intake form is a client-facing surface and goes through a compliance review on their side before it ships.',
            },
            {
              value: 'custom-automations',
              label: 'Custom automations',
              flag: 'risk',
              flagNote:
                'Unbounded by description. Get a count and a definition of done at the next question, or this line never closes.',
            },
            {
              value: 'custom-funnels',
              label: 'Custom funnels',
              flag: 'watch',
              flagNote:
                'Ask how many and what each one is for. A funnel count is the only way this gets estimated.',
            },
            {
              value: 'custom-website',
              label: 'Custom website',
              flag: 'risk',
              flagNote:
                'The largest of the eleven by effort, and it drags domain, DNS and SEO decisions with it. Confirm whether a site is genuinely in scope or whether funnels sit beside the site they already have.',
            },
            {
              value: 'custom-course-community',
              label: 'Custom course or community',
              flag: 'risk',
              flagNote:
                'The capability is real, the build effort is unpriced. Ask whether they run one today or want to start one, because migrating an existing one is a different job.',
            },
            {
              value: 'custom-newsletter',
              label: 'Custom newsletter',
              flag: 'watch',
              flagNote:
                'Ask who writes it, ongoing. A newsletter with no author is a template nobody sends.',
            },
            {
              value: 'custom-branding-kit',
              label: 'Custom branding kit',
              flag: 'watch',
              flagNote:
                'This moves branding from an input the build needs to a line the build produces. Those are different jobs and different money.',
            },
            {
              value: 'custom-invoice-contract',
              label: 'Custom invoice and contract templates',
              flag: 'watch',
              flagNote:
                'Document templates carry their legal wording. We lay out what they supply. We do not draft terms.',
            },
            {
              value: 'seo-refresh',
              label: 'SEO refresh',
              flag: 'risk',
              flagNote:
                'Open-ended by nature and impossible to call done without a written scope. Get the scope on this call or leave it out.',
            },
            {
              value: 'deep-research',
              label: 'Deep research',
              flag: 'risk',
              flagNote:
                'No definition of this exists anywhere. Ask them what they picture, in their words, and write it down verbatim.',
            },
            {
              value: 'custom-pipelines',
              label: 'Custom pipelines',
              flag: 'watch',
              flagNote:
                'Compare against the six built pipelines and forty-four stages before agreeing to anything bespoke. Most requests are a stage rename, not a new pipeline.',
            },
          ],
        },
        {
          id: 'h1.custom-definition',
          prompt:
            'For each one you have ticked: how many, and what does done look like to you?',
          kind: 'table',
          why: 'No written acceptance standard for a delegated build exists. The finish line has to come out of their mouth and be written down here.',
          source: 'db-finance-os/02-offer-and-pricing/onboarding-and-delivery.md',
          columns: [
            { key: 'item', label: 'Item', kind: 'short', width: 'lg' },
            { key: 'count', label: 'How many', kind: 'number', width: 'sm' },
            { key: 'done', label: 'What done looks like', kind: 'short', width: 'lg' },
            { key: 'signoff', label: 'Who signs it off', kind: 'short', width: 'md' },
          ],
        },
        {
          id: 'h1.bespoke',
          prompt:
            'Anything you would call bespoke? A calculator, a client portal, a custom integration into something you already run?',
          kind: 'long',
          why: 'A borrowing-capacity or serviceability calculator is a boundary question, not a scoping question. Catch it here.',
          placeholder: 'Their words, not a paraphrase',
          source: 'db-finance-os/02-offer-and-pricing/micro-apps.md',
          flags: [
            {
              op: 'notEmpty',
              level: 'risk',
              title: 'Bespoke request recorded',
              note: 'Check it against the boundary before it is quoted. Nothing in the product calculates borrowing capacity for credit purposes or assesses a credit position, so a request on that side of the line is not a build item.',
              action:
                'Say plainly which side of the line it falls on, on this call, and write the answer next to the request.',
            },
          ],
        },
        {
          id: 'h1.custom-approval',
          prompt:
            'One thing about how we work: nothing custom gets built without being approved and written down first. Are you comfortable with that?',
          kind: 'yesno',
          why: 'Says the operations rule out loud, which is what makes it hold later. It turns scope creep into a conversation instead of an argument.',
          source: 'db-finance-os/02-offer-and-pricing/onboarding-and-delivery.md',
          flags: [
            {
              op: 'neq',
              value: 'yes',
              level: 'watch',
              title: 'Scope discipline not agreed',
              note: 'They are expecting requests to be absorbed as they come. That expectation will surface in week three instead of now.',
              action: 'Ask what they were picturing, and settle it before anything is signed.',
            },
          ],
        },
      ],
    },
    {
      id: 'h1.boundary',
      title: 'The four boundaries, read back',
      intro:
        'I am going to read four things back to you so there are no surprises later. Stop me if any of them is a problem.',
      questions: [
        {
          id: 'h1.bound-aggregator',
          prompt:
            'Your aggregator stays exactly as it is. This sits beside it and does not replace it, connect to it or write into it. Understood?',
          kind: 'yesno',
          why: 'The centre of gravity of the whole offer. There is no native aggregator integration of any kind.',
          source: 'db-finance-os/02-offer-and-pricing/boundaries.md',
          flags: [
            {
              op: 'neq',
              value: 'yes',
              level: 'risk',
              title: 'Aggregator boundary not accepted',
              note: 'They are picturing data moving between the two. Nothing native exists to move it, so this is a scoping conversation and possibly a no-sale.',
              action:
                'Ask what they expected to move, in which direction, and whether this still works for them if it does not move automatically.',
            },
          ],
        },
        {
          id: 'h1.bound-lodgement',
          prompt: 'Lodgement is not included. Nothing here lodges a loan. Understood?',
          kind: 'yesno',
          why: 'Stated on the call rather than left in a footer. A boundary only in a footer is a defence, not a boundary.',
          source: 'db-finance-os/02-offer-and-pricing/boundaries.md',
          flags: [
            {
              op: 'neq',
              value: 'yes',
              level: 'risk',
              title: 'Lodgement expectation present',
              note: 'A buyer expecting lodgement is buying the wrong thing. This has to be corrected before the sale, not after.',
              action: 'Ask exactly what they pictured, and write it down so nobody assumes it later.',
            },
          ],
        },
        {
          id: 'h1.bound-serviceability',
          prompt:
            'Nothing here calculates borrowing capacity for credit purposes, and nothing assesses a client credit position. Understood?',
          kind: 'yesno',
          why: 'The line that keeps the product outside credit assistance. It must be said out loud.',
          source: 'db-finance-os/02-offer-and-pricing/boundaries.md',
          flags: [
            {
              op: 'neq',
              value: 'yes',
              level: 'risk',
              title: 'Serviceability expectation present',
              note: 'This is a boundary question, not a feature request. A tool that did this would change what the product is.',
              action: 'Record the request and say clearly that the boundary decides it, not the build.',
            },
          ],
        },
        {
          id: 'h1.bound-compliance',
          prompt:
            'Compliance responsibility stays yours. Your NCCP obligations, Best Interests Duty and licensing sit with you, and nothing we configure moves any of that off you. Understood?',
          kind: 'yesno',
          why: 'The system can hold records and prompt for steps. It does not carry their obligations, and no configuration transfers them.',
          source: 'db-finance-os/07-compliance-and-guardrails/licensing-boundary.md',
          followUp:
            'Who signs off your compliance file today, and what were you hoping the software would do about it?',
          flags: [
            {
              op: 'neq',
              value: 'yes',
              level: 'risk',
              title: 'Compliance expectation misaligned',
              note: 'They are expecting the software to carry something it cannot carry. A stage moving is not evidence that a credit guide went out or that options were presented.',
              action:
                'Correct it on this call, in plain words, and tell them to run anything client-facing past their own compliance advice.',
            },
          ],
        },
        {
          id: 'h1.bound-gap',
          prompt:
            'Is anything you were hoping for sitting on the other side of any of those four lines?',
          kind: 'long',
          why: 'The catch-all. Anything recorded here is a scoping conversation that has to happen now.',
          placeholder: 'Write it in their words',
          source: 'db-finance-os/02-offer-and-pricing/boundaries.md',
          flags: [
            {
              op: 'notEmpty',
              level: 'risk',
              title: 'Expectation sits outside the boundary',
              note: 'Whatever is in this box is the thing most likely to become a dispute. It has an answer today or it becomes a surprise later.',
              action: 'Answer it on the call and note the answer beside it.',
            },
          ],
        },
      ],
    },
    {
      id: 'h1.usage',
      title: 'Usage, and the recommendation',
      intro:
        'Two last things on scope: what runs through it, and what I am going to recommend.',
      questions: [
        {
          id: 'h1.metered-ack',
          prompt:
            'SMS, phone calls and some AI usage are billed on top of the subscription, at cost. That applies whatever shape you pick. Is that clear?',
          kind: 'yesno',
          why: 'A published term, not a footnote, and the one most likely to produce a complaint if it is skipped in a price conversation.',
          source: 'db-finance-os/02-offer-and-pricing/pricing-and-tiers.md',
          flags: [
            {
              op: 'neq',
              value: 'yes',
              level: 'watch',
              title: 'Metered usage not acknowledged',
              note: 'They are reading the subscription as the whole number. Size the usage with them now rather than on their first invoice.',
              action: 'Fill the volume table with them before moving on.',
            },
          ],
        },
        {
          id: 'h1.metered-volume',
          prompt:
            'Roughly what volume would be going through it? Give me monthly numbers, even rough ones.',
          kind: 'table',
          why: 'Turns the metered line into a number they have seen before they sign. Do not quote a rate: the currency is an open owner question.',
          hint: 'One row each for SMS, call minutes and marketing emails.',
          source: 'db-finance-os/02-offer-and-pricing/pricing-and-tiers.md',
          columns: [
            { key: 'channel', label: 'Channel', kind: 'short', width: 'md' },
            { key: 'permonth', label: 'Per month', kind: 'number', width: 'sm' },
            { key: 'audience', label: 'People it reaches', kind: 'number', width: 'sm' },
          ],
        },
        {
          id: 'h1.recommended-shape',
          prompt:
            'Auditor note: which shape are you recommending, and on what evidence from this call?',
          kind: 'long',
          why: 'Written before the proposal, so the recommendation traces to answers rather than to budget.',
          hint: 'Name the two or three answers that decided it. Not shown to the client.',
          placeholder:
            'Recommending X because they said Y at h1.self-build and Z at h1.time-available.',
          source: 'db-finance-os/01-company/how-we-work.md',
        },
      ],
    },
  ],
}

/* ═══════════════════════════════════════════════════════════════════════════
   02 · What the build needs from them
   ═══════════════════════════════════════════════════════════════════════════ */

export const MODULE_INPUTS: Module = {
  id: 'h2',
  number: '02',
  title: 'What the build needs from them',
  purpose:
    'Branding, domain, sending identity and the phone decision. Nothing starts until these four have a name and a date on them.',
  Icon: PackageOpen,
  blocks: [
    {
      id: 'h2.branding',
      title: 'Branding',
      intro:
        'Four things have to come across from your side before anything gets built. Branding is the first.',
      questions: [
        {
          id: 'h2.brand-state',
          prompt:
            'Branding: do you have proper logo files, fonts and colours, or is that something you would want built?',
          kind: 'single',
          why: 'Decides whether branding is an input the build waits on or a scope line the build produces.',
          source: 'db-finance-os/02-offer-and-pricing/onboarding-and-delivery.md',
          followUp: 'Can we have them inside the week? If not, when?',
          choices: [
            { value: 'full-kit-vector', label: 'Complete kit, including vector files' },
            {
              value: 'logo-only',
              label: 'Logo only, no brand guide',
              flag: 'watch',
              flagNote:
                'Colours and type will get decided by whoever builds the first funnel. Agree them up front or expect a rework pass.',
            },
            {
              value: 'png-somewhere',
              label: 'Only a PNG somewhere',
              flag: 'risk',
              flagNote:
                'A raster logo will not hold up at any size that matters. This becomes a branding line in scope or a visibly rough build.',
            },
            {
              value: 'nothing-usable',
              label: 'Nothing usable',
              flag: 'risk',
              flagNote:
                'Branding is one of the four inputs the build needs. With nothing to work from, this is a scope line before it is an input.',
            },
            {
              value: 'want-it-built',
              label: 'We would want it built',
              flag: 'watch',
              flagNote:
                'This is the custom branding kit item from the scope list. Price it there, not here.',
            },
          ],
        },
        {
          id: 'h2.brand-holder',
          prompt: 'Who holds those files? Name and email.',
          kind: 'short',
          why: "A third party holding the brand assets is a dependency with a lead time. It belongs on the schedule with a name against it, not in someone's memory.",
          placeholder: 'Name, email, and what they are to the business',
          source: 'db-finance-os/02-offer-and-pricing/onboarding-and-delivery.md',
        },
      ],
    },
    {
      id: 'h2.domain',
      title: 'Domain and DNS',
      intro:
        'The second input, and the one that quietly gates everything else. Whoever holds the DNS is on the critical path.',
      questions: [
        {
          id: 'h2.domain-name',
          prompt: 'What domain are we working with?',
          kind: 'short',
          why: 'The literal string. Everything downstream hangs off it.',
          placeholder: 'yourbrokerage.com.au',
          source: 'db-finance-os/01-company/production-layer.md',
        },
        {
          id: 'h2.dns-control',
          prompt: 'Who actually controls the DNS for it?',
          kind: 'single',
          why: 'The sending domain, every funnel and every tracking record wait on this person. If they will not engage, the build stalls.',
          source: 'db-finance-os/01-company/production-layer.md',
          allowOther: true,
          choices: [
            { value: 'i-control-it', label: 'I do' },
            {
              value: 'our-web-developer',
              label: 'Our web developer',
              flag: 'watch',
              flagNote:
                'Named third party with their own queue. Get their name and email now and warn them a DNS request is coming.',
            },
            {
              value: 'aggregator-or-third-party',
              label: 'Our aggregator or another third party',
              flag: 'risk',
              flagNote:
                'The holder has no relationship with this build and may decline. Confirm before anything is scheduled whether records can be added at all.',
            },
            {
              value: 'dont-know',
              label: 'I do not know',
              flag: 'risk',
              flagNote:
                'Unknown DNS control is the most common single cause of a stalled start. Make finding out the first action item off this call.',
            },
            {
              value: 'no-domain-yet',
              label: 'We do not have a domain yet',
              flag: 'watch',
              flagNote: 'Registration is quick. Deciding the name is not. Put a date on it.',
            },
          ],
        },
        {
          id: 'h2.registrar',
          prompt: 'Where is it registered? And who holds that login?',
          kind: 'short',
          why: 'The registrar and the DNS host are often different, and the person who knows one often does not know the other.',
          placeholder: 'Registrar, and the person with the account',
          source: 'db-finance-os/01-company/production-layer.md',
        },
        {
          id: 'h2.subdomain-ok',
          prompt:
            'Are you comfortable with funnels and pages running on a subdomain of your domain, rather than on the main site itself?',
          kind: 'yesno',
          why: 'A no here means a website is in scope, which is the largest of the custom items.',
          source: 'db-finance-os/02-offer-and-pricing/onboarding-and-delivery.md',
          flags: [
            {
              op: 'neq',
              value: 'yes',
              level: 'watch',
              title: 'Subdomain declined',
              note: 'Pages have to live on the main site instead, which puts their web developer and their CMS on the critical path.',
              action: 'Ask what the site runs on and who can publish to it.',
            },
          ],
        },
      ],
    },
    {
      id: 'h2.sending',
      title: 'Sending identity',
      intro:
        'Nothing sends until the sending block carries real values. These are the decisions only you can make.',
      questions: [
        {
          id: 'h2.from-name',
          prompt: 'What name should client-facing email come from?',
          kind: 'short',
          why: 'One of the six fields behind the hard gate on sending. Their decision, captured verbatim.',
          placeholder: 'e.g. the brokerage name, or a named broker',
          source: 'db-finance-os/01-company/production-layer.md',
        },
        {
          id: 'h2.from-address',
          prompt:
            'And from what address? Is that a mailbox a human actually reads?',
          kind: 'short',
          why: 'A no-reply address kills every conversation the sequences are meant to start.',
          placeholder: 'address, and who reads it',
          source: 'db-finance-os/01-company/production-layer.md',
        },
        {
          id: 'h2.reply-to',
          prompt: 'Where should replies land?',
          kind: 'short',
          why: 'Third of the sending fields. Often a different mailbox from the send address, and nobody checks the difference until a reply is lost.',
          placeholder: 'Reply-to address, and who monitors it',
          source: 'db-finance-os/01-company/production-layer.md',
        },
        {
          id: 'h2.sending-subdomain-ok',
          prompt:
            'Are you comfortable sending from a dedicated subdomain, something like mail dot yourdomain, rather than from your main domain?',
          kind: 'yesno',
          why: 'A verified sending domain needs DNS records on their domain. The decision and the DNS access have to be agreed in the same breath.',
          source: 'db-finance-os/01-company/production-layer.md',
          flags: [
            {
              op: 'neq',
              value: 'yes',
              level: 'risk',
              title: 'Dedicated sending subdomain not agreed',
              note: 'Sending from the main domain puts their day-to-day business email in the same reputation as bulk sending. Say what that means and let them decide.',
              action: 'Ask who else sends from that domain today, and what breaks if its reputation moves.',
            },
          ],
        },
        {
          id: 'h2.auth-state',
          prompt:
            'Has your domain ever been used for bulk email? And do you know whether SPF, DKIM and DMARC are set up on it?',
          kind: 'single',
          why: 'Sending history is inherited. Capture it and schedule the warm-up. Do not characterise an inbox outcome either way.',
          source: 'db-finance-os/01-company/production-layer.md',
          choices: [
            { value: 'sending-bulk-now', label: 'Yes, we send bulk email now' },
            {
              value: 'used-to',
              label: 'We used to, not any more',
              flag: 'watch',
              flagNote:
                'Ask what platform, and whether anyone stopped because of a deliverability problem.',
            },
            { value: 'never', label: 'Never' },
            {
              value: 'dont-know',
              label: 'I do not know',
              flag: 'watch',
              flagNote:
                'Normal answer, and it means the records have to be read before anything is scheduled. Put it on the access pack.',
            },
          ],
        },
        {
          id: 'h2.dns-turnaround',
          prompt:
            'If we send through a set of DNS records, how quickly can they be added, and by whom?',
          kind: 'single',
          why: 'Turns the DNS dependency into a lead time. It is the single most common cause of a stalled week one.',
          source: 'db-finance-os/02-offer-and-pricing/onboarding-and-delivery.md',
          choices: [
            { value: 'same-day', label: 'Same day, I do it myself' },
            { value: 'within-a-week', label: 'Within a week' },
            {
              value: 'have-to-ask',
              label: 'I would have to ask someone',
              flag: 'watch',
              flagNote: 'Get that person named and warned before the call ends.',
            },
            {
              value: 'dont-know',
              label: 'No idea',
              flag: 'risk',
              flagNote:
                'An unknown DNS lead time means no part of the sending build can be scheduled. Resolve it before a start date is discussed.',
            },
          ],
        },
        {
          id: 'h2.footer-address',
          prompt:
            'What physical business address should appear on the footer of everything that goes out?',
          kind: 'short',
          why: 'It stamps system emails, funnel footers and client-facing documents. A wrong one is expensive to find later.',
          placeholder: 'Full postal address as it should be printed',
          source: 'db-finance-os/01-company/production-layer.md',
        },
      ],
    },
    {
      id: 'h2.phone',
      title: 'The phone number',
      intro:
        'The fourth input. A port has a third party in it, so this decision changes what can be live and when.',
      questions: [
        {
          id: 'h2.phone-decision',
          prompt:
            'Do you want a fresh number provisioned, or do you want to port the number your clients already ring?',
          kind: 'single',
          why: 'A decision they make and we schedule, not a switch that gets flicked.',
          source: 'db-finance-os/01-company/production-layer.md',
          choices: [
            { value: 'new-number', label: 'New number provisioned' },
            {
              value: 'port-existing',
              label: 'Port our existing number',
              flag: 'watch',
              flagNote:
                'A port is a third-party lead time and it is outside anyone here. Nothing that depends on the number can be scheduled against it.',
            },
            {
              value: 'keep-separate',
              label: 'Leave the existing number alone, do not route calls through the system',
              hint: 'Cleanest option where the current phone setup works.',
            },
            {
              value: 'undecided',
              label: 'Undecided',
              flag: 'watch',
              flagNote:
                'This is one of the four inputs. Leaving it open leaves the call and SMS side of the build unscheduled.',
            },
          ],
        },
        {
          id: 'h2.phone-provider',
          prompt: 'Who is your phone provider today, and who answers that number?',
          kind: 'short',
          why: 'The provider is the counterparty on a port and the person who answers is the process the build has to respect.',
          placeholder: 'Provider, plan if known, and who picks up',
          source: 'db-finance-os/01-company/production-layer.md',
        },
        {
          id: 'h2.phone-on-collateral',
          prompt:
            'Is that number on your business cards, your Google listing, your signage?',
          kind: 'yesno',
          why: 'A number change that breaks a Google listing costs more than the system returns. Know before anything moves.',
          source: 'db-finance-os/01-company/production-layer.md',
          flags: [
            {
              op: 'eq',
              value: 'yes',
              level: 'watch',
              title: 'Existing number is published',
              note: 'The number is load-bearing in their marketing. Any change has to protect the listing and the printed collateral.',
              action: 'List every place it appears before agreeing to a port or a swap.',
            },
          ],
        },
      ],
    },
    {
      id: 'h2.people',
      title: 'Content, and who we talk to',
      intro:
        'Last one. What you already have that we can load, and who we come to for a decision.',
      questions: [
        {
          id: 'h2.content-assets',
          prompt:
            'What have you already got written that we could load? Tick anything that exists in a usable form.',
          kind: 'multi',
          why: 'What exists gets loaded. What does not exist gets invented, and invention is what the custom items quietly are.',
          source: 'db-finance-os/02-offer-and-pricing/onboarding-and-delivery.md',
          followUp: 'Who can send those across, and by when?',
          allowOther: true,
          choices: [
            { value: 'call-scripts', label: 'Call scripts or talk tracks' },
            { value: 'lender-product-lists', label: 'Lender or product lists' },
            { value: 'written-faqs', label: 'FAQs you have written' },
            { value: 'past-email-campaigns', label: 'Past email campaigns' },
            { value: 'blog-articles', label: 'Blog or article content' },
            { value: 'written-testimonials', label: 'Written client testimonials' },
            { value: 'existing-forms', label: 'Existing forms or fact finds' },
            { value: 'video-webinar', label: 'Video or webinar recordings' },
            { value: 'photography', label: 'Photography and headshots' },
          ],
        },
        {
          id: 'h2.point-of-contact',
          prompt:
            'Who is our single point of contact, and how do we get a decision out of them in a day?',
          kind: 'short',
          why: 'How fast access and content come back is the stated dependency. Naming the person makes it an agreement.',
          placeholder: 'Name, mobile, email, best time',
          source: 'db-finance-os/02-offer-and-pricing/onboarding-and-delivery.md',
        },
        {
          id: 'h2.decision-speed',
          prompt: 'Honestly, how fast do you come back on things?',
          kind: 'single',
          why: 'Sets the pace of the schedule with them rather than for them. Do not name a completion date either way.',
          source: 'db-finance-os/02-offer-and-pricing/onboarding-and-delivery.md',
          choices: [
            { value: 'same-day', label: 'Same day' },
            { value: 'one-to-two-days', label: 'A day or two' },
            {
              value: 'about-a-week',
              label: 'About a week',
              flag: 'watch',
              flagNote:
                'Every step that waits on them stretches by the same amount. Say so now, plainly, rather than explaining it later.',
            },
            {
              value: 'depends-who-is-asking',
              label: 'Depends what else is on',
              flag: 'risk',
              flagNote:
                'No reliable response window means no reliable schedule. Agree a standing weekly slot instead of relying on replies.',
            },
          ],
        },
        {
          id: 'h2.kickoff-attendees',
          prompt: 'Kickoff call: who needs to be in the room?',
          kind: 'short',
          why: 'Everything downstream waits on the kickoff. Getting the attendee list now avoids the week-one reschedule.',
          placeholder: 'Names and roles',
          source: 'db-finance-os/02-offer-and-pricing/onboarding-and-delivery.md',
        },
      ],
    },
  ],
}

/* ═══════════════════════════════════════════════════════════════════════════
   03 · The access pack
   ═══════════════════════════════════════════════════════════════════════════ */

export const MODULE_ACCESS: Module = {
  id: 'h3',
  number: '03',
  title: 'The access pack',
  purpose:
    'Generates the checklist for the separate hands-on pass: what we log into, who grants it, what is off limits, and when it ends.',
  Icon: KeyRound,
  blocks: [
    {
      id: 'h3.systems',
      title: 'What we need into',
      intro:
        'To do the hands-on pass properly the team has to get into what you are running now. Let us build the list, then name who grants each one.',
      questions: [
        {
          id: 'h3.systems-needed',
          prompt:
            'Which of these would we need access to? Tick everything that exists in your business.',
          kind: 'multi',
          why: 'The list the hands-on pass runs off. An audit that has to come back and ask for one more login is an audit that does not happen.',
          source: 'db-finance-os/01-company/client-engagements.md',
          allowOther: true,
          choices: [
            { value: 'crm-admin', label: 'CRM, admin level' },
            {
              value: 'aggregator-read',
              label: 'Aggregator software, read access',
              flag: 'watch',
              flagNote:
                'This one may not be theirs to grant. Confirm at the next question before it goes on any list.',
            },
            { value: 'email-platform', label: 'Email platform' },
            { value: 'website-hosting', label: 'Website and hosting' },
            { value: 'domain-dns', label: 'Domain registrar and DNS' },
            { value: 'ad-accounts', label: 'Ad accounts' },
            { value: 'analytics', label: 'Analytics' },
            { value: 'social-accounts', label: 'Social accounts' },
            { value: 'phone-system', label: 'Phone system' },
            { value: 'calendar', label: 'Calendar' },
            {
              value: 'existing-ghl',
              label: 'An existing GoHighLevel account',
              flag: 'watch',
              flagNote:
                'A pre-existing account changes the shape of the build before it changes the access list. Follow it up at the next questions.',
            },
          ],
        },
        {
          id: 'h3.aggregator-permitted',
          prompt:
            'On the aggregator software: is giving a third party read access to it something you are actually permitted to do under your agreement?',
          kind: 'yesno',
          why: 'It may not be permitted, and asking for what cannot be granted is how an access request gets refused and the whole pass stalls.',
          source: 'db-finance-os/01-company/client-engagements.md',
          followUp:
            'If you are not sure, who would you ask, and can you check before the pass is booked?',
          flags: [
            {
              op: 'neq',
              value: 'yes',
              level: 'watch',
              title: 'Aggregator access is not confirmed',
              note: 'Plan the hands-on pass without it. A screen share they drive gets us the same picture without an access grant nobody can give.',
              action: 'Offer the screen-share route instead and note it against the walkthrough question.',
            },
          ],
        },
        {
          id: 'h3.ghl-existing',
          prompt:
            'Do you already have a GoHighLevel account, a snapshot, or a relationship with an agency running one for you?',
          kind: 'yesno',
          why: 'An existing sub-account under a third-party agency is a migration and an access problem before it is a build.',
          source: 'db-finance-os/02-offer-and-pricing/onboarding-and-delivery.md',
          followUp:
            'Who set it up, whose agency account does it sit under, who owns the data, and are you free to move?',
          flags: [
            {
              op: 'eq',
              value: 'yes',
              level: 'risk',
              title: 'Existing account or incumbent agency',
              note: 'Data ownership, the transfer path and the incumbent relationship all have to be settled before anything is provisioned.',
              action: 'Get the location ID and who holds agency-level access on it.',
            },
          ],
        },
        {
          id: 'h3.named-user',
          prompt:
            'We take a named user seat by invitation. We do not take passwords. Can your people create a user for us on each of those rather than share a login?',
          kind: 'yesno',
          why: 'Shared credentials are never handled. No password is spoken into, typed into or stored on this form.',
          source: 'db-finance-os/schema/do-not-publish.yml',
          flags: [
            {
              op: 'neq',
              value: 'yes',
              level: 'risk',
              title: 'Named-user access not available everywhere',
              note: 'Some system only supports a shared login. That system is audited by screen share with them driving, never by taking the credential.',
              action: 'Name which systems, and book the screen share for those instead.',
            },
          ],
        },
        {
          id: 'h3.access-table',
          prompt:
            'Let us go through it one by one. For each system: who grants it, what level, and when.',
          kind: 'table',
          why: 'The working checklist. Nothing gets opened that is not on this table with a grantor beside it.',
          hint: 'Access level: read only wherever read only will do. Never ask for admin out of habit.',
          source: 'db-finance-os/01-company/client-engagements.md',
          columns: [
            { key: 'system', label: 'System', kind: 'short', width: 'lg' },
            { key: 'grantor', label: 'Who grants it', kind: 'short', width: 'md' },
            { key: 'level', label: 'Level', kind: 'short', width: 'sm' },
            { key: 'requested', label: 'Requested', kind: 'short', width: 'sm' },
            { key: 'received', label: 'Received', kind: 'short', width: 'sm' },
          ],
        },
      ],
    },
    {
      id: 'h3.consent',
      title: 'Consent and scope',
      intro:
        'Before anything gets opened, we agree in writing what we are looking at and what we are not.',
      questions: [
        {
          id: 'h3.written-consent',
          prompt:
            'Nothing gets opened until you have granted it in writing. Are you comfortable confirming the access list by email after this call?',
          kind: 'yesno',
          why: 'Consent to access is written, dated and specific. A verbal yes on a call is not the record.',
          source: 'db-finance-os/01-company/how-we-work.md',
          flags: [
            {
              op: 'neq',
              value: 'yes',
              level: 'risk',
              title: 'Written access consent not agreed',
              note: 'The hands-on pass does not start. There is no version of this that proceeds on a verbal yes.',
              action: 'Ask what they would need in the email to be comfortable signing it.',
            },
          ],
        },
        {
          id: 'h3.out-of-scope',
          prompt:
            'Is there anything in those systems we should not open? Client financials, ID documents, staff records?',
          kind: 'long',
          why: "It is their data and their clients' data. Scope is agreed in writing before the pass starts, not negotiated inside it.",
          placeholder: 'Anything named here is off limits for the whole pass',
          source: 'db-finance-os/01-company/client-engagements.md',
          flags: [
            {
              op: 'notEmpty',
              level: 'watch',
              title: 'Out-of-scope areas named',
              note: 'Carry this verbatim into the access email so the exclusion is on the record before anyone logs in.',
            },
          ],
        },
        {
          id: 'h3.look-first',
          prompt: 'When we are in there, what would you most want us to look at first?',
          kind: 'long',
          why: 'Points the pass at what they already suspect is broken, which is where it earns its keep.',
          placeholder: 'Their words',
          source: 'db-finance-os/01-company/client-engagements.md',
        },
        {
          id: 'h3.who-is-told',
          prompt:
            'Who on your side gets told we are in, and is anyone going to be surprised to see our login in an audit trail?',
          kind: 'short',
          why: 'An unannounced login inside a licensed business is a conversation nobody wants to have afterwards.',
          placeholder: 'Who is told, by whom, and when',
          source: 'db-finance-os/01-company/client-engagements.md',
        },
        {
          id: 'h3.revocation',
          prompt: 'And when the pass is done: when does that access get revoked, and who does it?',
          kind: 'short',
          why: 'An access grant with no end date is an open door. The revocation owner and date are agreed at the same moment as the grant.',
          placeholder: 'Date, and the named person who revokes',
          source: 'db-finance-os/01-company/client-engagements.md',
        },
      ],
    },
    {
      id: 'h3.exports',
      title: 'Exports to send ahead',
      intro:
        'A few things are faster to read as a file than to click through. Anything you can send ahead shortens the pass.',
      questions: [
        {
          id: 'h3.exports-list',
          prompt: 'Which of these could you export and send through before we start?',
          kind: 'multi',
          why: 'Read ahead of the pass, so the time in their systems goes on what a file cannot show.',
          source: 'db-finance-os/01-company/client-engagements.md',
          allowOther: true,
          choices: [
            { value: 'contact-export', label: 'A full contact export' },
            { value: 'live-deals', label: 'A list of live deals and what stage each is at' },
            { value: 'last-three-months-enquiries', label: 'The last three months of enquiries' },
            { value: 'email-templates', label: 'Current email templates' },
            { value: 'current-forms', label: 'Current forms and fact finds' },
            { value: 'pipeline-stage-list', label: 'Your pipeline and stage names as they stand' },
            { value: 'recent-reporting', label: 'Whatever reporting you look at now' },
          ],
        },
        {
          id: 'h3.contact-count',
          prompt: 'Roughly how many contacts are in that database?',
          kind: 'number',
          why: 'Sizes the migration and tells us whether the list is a database or a mailing list.',
          unit: 'contacts',
          min: 0,
          source: 'db-finance-os/02-offer-and-pricing/onboarding-and-delivery.md',
          followUp: 'And how many of those have you contacted in the last twelve months?',
        },
        {
          id: 'h3.export-blocker',
          prompt: 'Can you get those out yourself, or does someone else have to run them?',
          kind: 'single',
          why: 'An export nobody can produce is not an export. Find the blocker before it is on a schedule.',
          source: 'db-finance-os/01-company/client-engagements.md',
          choices: [
            { value: 'we-can-export', label: 'We can run them ourselves' },
            {
              value: 'need-the-aggregator',
              label: 'The aggregator would have to run them',
              flag: 'watch',
              flagNote:
                'A third party with their own queue and possibly their own view on the request. Ask early.',
            },
            {
              value: 'need-web-person',
              label: 'Our web or IT person would',
              flag: 'watch',
              flagNote: 'Name them and give them notice before the pass is booked.',
            },
            {
              value: 'not-sure-exportable',
              label: 'Not sure it can be exported at all',
              flag: 'risk',
              flagNote:
                'Data that cannot leave a system is the strongest finding the whole audit can produce. Confirm it in the hands-on pass and record what was tried.',
            },
          ],
        },
        {
          id: 'h3.export-owner',
          prompt: 'Who sends those across, and by when?',
          kind: 'short',
          why: 'A file with no owner and no date does not arrive.',
          placeholder: 'Name, and the date they have agreed to',
          source: 'db-finance-os/02-offer-and-pricing/onboarding-and-delivery.md',
        },
      ],
    },
    {
      id: 'h3.walkthrough',
      title: 'The walkthrough',
      intro: 'Last thing on access: the screen share, and one thing we never do.',
      questions: [
        {
          id: 'h3.walkthrough-booked',
          prompt:
            'Have we booked a screen share where you walk us through what you run now?',
          kind: 'yesno',
          why: 'The screen share covers every system where a named user seat is not available. Book it on this call or it drifts.',
          source: 'db-finance-os/01-company/how-we-work.md',
          flags: [
            {
              op: 'neq',
              value: 'yes',
              level: 'watch',
              title: 'Walkthrough not booked',
              note: 'Without it the hands-on pass runs on access grants alone, and any system with a shared login stays unaudited.',
              action: 'Put a date in the calendar before the call ends.',
            },
          ],
        },
        {
          id: 'h3.walkthrough-when',
          prompt: 'When is it, and who is on it from your side?',
          kind: 'short',
          why: 'The person who drives the screen share has to be the one who uses the systems daily, not the owner describing them.',
          placeholder: 'Date, time, and who is driving',
          source: 'db-finance-os/01-company/how-we-work.md',
          showIf: { question: 'h3.walkthrough-booked', equals: ['yes'] },
        },
        {
          id: 'h3.no-credentials',
          prompt:
            'One thing for the record: no password gets spoken on this call or typed into this form, now or later. Clear?',
          kind: 'yesno',
          why: 'Client credentials have landed in notes and transcripts in this business before. Saying it out loud is what stops the next one.',
          source: 'db-finance-os/schema/do-not-publish.yml',
          flags: [
            {
              op: 'neq',
              value: 'yes',
              level: 'risk',
              title: 'Credential handling not confirmed',
              note: 'Stop and restate it. Nothing in the access pack proceeds on an unclear answer here.',
            },
          ],
        },
      ],
    },
  ],
}

/* ═══════════════════════════════════════════════════════════════════════════
   04 · The record and the next step
   ═══════════════════════════════════════════════════════════════════════════ */

export const MODULE_RECORD: Module = {
  id: 'h4',
  number: '04',
  title: 'The record and the next step',
  purpose:
    'Close the loop honestly: what was found, what was agreed, what was asked for in writing, and what was deliberately not promised.',
  Icon: ClipboardCheck,
  blocks: [
    {
      id: 'h4.findings',
      title: 'What the audit found',
      intro:
        'Auditor section. Written while the call is still fresh, before the proposal is drafted.',
      questions: [
        {
          id: 'h4.top-three',
          prompt:
            'The three things that would change the most for this business. Write them as three lines.',
          kind: 'long',
          why: 'The spine of the proposal. Three, not ten, and each one traceable to something they said.',
          hint: 'Each line: what it is, and the answer it came from.',
          placeholder: '1.\n2.\n3.',
          source: 'db-finance-os/01-company/how-we-work.md',
        },
        {
          id: 'h4.biggest-risk',
          prompt: 'The single biggest risk you found. One paragraph.',
          kind: 'long',
          why: 'What would hurt them soonest if nothing changed. It is also what decides whether we take the engagement.',
          hint: 'Describe what you observed. Do not characterise it as a breach of anything.',
          placeholder: 'What you saw, and what it exposes them to',
          source: 'db-finance-os/07-compliance-and-guardrails/licensing-boundary.md',
          flags: [
            {
              op: 'notEmpty',
              level: 'risk',
              title: 'Primary risk recorded',
              note: 'If this touches a client-facing surface, tell them plainly that it needs their own compliance advice. It is their obligation and their call, not ours to settle.',
              action: 'Say it on the call. Do not leave it to the written summary.',
            },
          ],
        },
        {
          id: 'h4.client-words',
          prompt:
            'What did they say the biggest problem was, in their own words? Write it as a quote.',
          kind: 'long',
          why: 'Recorded first-party buyer voices are in single figures. A verbatim line from this call is worth more than any research we could buy.',
          hint: 'Verbatim. Do not tidy it up.',
          placeholder: '"..."',
          source: 'db-finance-os/03-audience-and-icp/voice-of-customer.md',
        },
        {
          id: 'h4.speaker',
          prompt: 'Who said it? First name, role, and the date.',
          kind: 'short',
          why: 'A quote with no speaker to cite cannot be used anywhere. Plural attribution is worth nothing at all.',
          placeholder: 'First name, role, business, date',
          source: 'db-finance-os/03-audience-and-icp/voice-of-customer.md',
        },
      ],
    },
    {
      id: 'h4.permission',
      title: 'Permission, consent and the baseline',
      intro:
        'The highest-leverage part of the whole call. Ask it properly and ask it now, because the answer only gets harder to get later.',
      questions: [
        {
          id: 'h4.writeup-permission',
          prompt:
            'If this goes the way we both think it will, would you be willing to let us write it up afterwards? And in what form?',
          kind: 'single',
          why: 'Zero written client permissions exist. A single yes in writing is worth more than the rest of this form combined.',
          source: 'db-finance-os/05-proof-and-evidence/evidence-counter.md',
          followUp:
            'What would you need to see before you would be comfortable with that? And to be clear, you would approve every word before it goes anywhere.',
          choices: [
            {
              value: 'named',
              label: 'Yes, with our name on it',
              flag: 'opportunity',
              flagNote:
                'Record it as unconfirmed until a written, dated approval exists. A verbal yes on a call is not a permission. Send the request the same day.',
            },
            {
              value: 'de-identified',
              label: 'Yes, but de-identified',
              flag: 'watch',
              flagNote:
                'Still valuable, and still needs the same written, dated approval. Agree now exactly what may be described and what may not.',
            },
            {
              value: 'not-at-all',
              label: 'No',
              flag: 'watch',
              flagNote:
                'Fine, and do not push it. Ask whether that might change once they can see a result, and note the answer.',
            },
            {
              value: 'undecided',
              label: 'Ask me later',
              flag: 'watch',
              flagNote: 'Put a date on later, or later never arrives.',
            },
          ],
        },
        {
          id: 'h4.writeup-conditions',
          prompt:
            'What would have to be true for you to be happy putting your name to it?',
          kind: 'long',
          why: 'Their conditions are the acceptance criteria for the engagement, stated by them, before the build.',
          placeholder: 'Their words',
          source: 'db-finance-os/04-voice-and-messaging/messaging-pillars.md',
        },
        {
          id: 'h4.baseline',
          prompt:
            'Before we touch anything, let us write down the baseline. What are the numbers today?',
          kind: 'table',
          why: 'A baseline captured before the build is the only honest version of a result afterwards. Without it, a target gets reported as an outcome.',
          hint: 'Enquiries a month, conversion, days to settlement, database size. Their figures, dated today.',
          source: 'db-finance-os/04-voice-and-messaging/response-modes.md',
          columns: [
            { key: 'metric', label: 'Metric', kind: 'short', width: 'lg' },
            { key: 'today', label: 'Value today', kind: 'number', width: 'sm' },
            { key: 'method', label: 'How it is measured', kind: 'short', width: 'lg' },
            { key: 'asat', label: 'As at', kind: 'short', width: 'sm' },
          ],
        },
        {
          id: 'h4.recording-consent',
          prompt:
            'Two separate things: are you comfortable with me recording this call, and separately, would you be happy for us to quote you later by first name and role?',
          kind: 'single',
          why: 'Two permissions, routinely conflated. Without a recorded consent there is never an attributable quote.',
          source: 'db-finance-os/00-start-here/AI-INSTRUCTIONS.md',
          choices: [
            {
              value: 'recording-and-quoting',
              label: 'Recording yes, quoting yes',
              flag: 'opportunity',
              flagNote: 'Confirm the quoting half in writing after the call, dated, with who gave it.',
            },
            { value: 'recording-not-quoting', label: 'Recording yes, quoting no' },
            {
              value: 'no-recording',
              label: 'No recording',
              flag: 'watch',
              flagNote:
                'Take written notes instead and read the key lines back to confirm them. Nothing from this call may be quoted.',
            },
          ],
        },
      ],
    },
    {
      id: 'h4.close',
      title: 'The next step, and what was not promised',
      intro:
        'Here is what I would recommend as the next step. Then one note for our own file.',
      questions: [
        {
          id: 'h4.next-step',
          prompt: 'The agreed next step, verb first. One line.',
          kind: 'short',
          why: 'One next step, stated as an action, agreed out loud. Not a list of options.',
          placeholder: 'e.g. Send the access email and book the walkthrough',
          source: 'db-finance-os/04-voice-and-messaging/brand-voice.md',
        },
        {
          id: 'h4.next-date',
          prompt: 'By when, and who does it?',
          kind: 'short',
          why: 'A next step with no date and no owner is a note.',
          placeholder: 'Date, and the name on each side',
          source: 'db-finance-os/04-voice-and-messaging/brand-voice.md',
        },
        {
          id: 'h4.not-promised',
          prompt:
            'For the file: what did you explicitly not promise on this call?',
          kind: 'long',
          why: 'The record that protects both sides. Written while it is fresh, because it is the first thing forgotten.',
          hint: 'Name each one you were asked for and declined: a turnaround, a response time, a trial, a refund window, a result figure, any compliance outcome.',
          placeholder:
            'They asked about X. I said we do not publish one, and why.',
          source: 'db-finance-os/02-offer-and-pricing/guarantees-and-refunds.md',
          flags: [
            {
              op: 'notEmpty',
              level: 'watch',
              title: 'Declined commitments recorded',
              note: 'Repeat these in the written follow-up in the same words used on the call. A boundary stated once and never written down is a boundary nobody remembers.',
            },
          ],
        },
        {
          id: 'h4.fit-confidence',
          prompt: 'Auditor read: how confident are you that this is a fit?',
          kind: 'scale',
          why: 'Recorded before the proposal, so a weak fit is visible before effort goes into it.',
          min: 1,
          max: 5,
          scaleLabels: ['Not a fit', 'Clear fit'],
          source: 'db-finance-os/03-audience-and-icp/disqualifiers.md',
          flags: [
            {
              op: 'lt',
              value: 3,
              level: 'watch',
              title: 'Weak fit',
              note: 'Say so internally before a proposal is written. A poor fit taken on costs more than the engagement returns.',
              action: 'Name the one thing that would have to change for this to become a fit.',
            },
          ],
        },
      ],
    },
  ],
}
