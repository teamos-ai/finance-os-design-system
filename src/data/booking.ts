/**
 * The "Let's Chat Finance" booking set: the calendar description, the seven emails and the five
 * SMS that surround one booked discovery call in GHL, from confirmation through no-show recovery,
 * cancellation and the thank-you after the call.
 *
 * One source per email: `blocks` render the HTML body (`src/lib/booking-render.ts`). The palette
 * and sender block are shared with the warm-up sequence (`src/data/warmup.ts`), so the booking
 * mail and the warm-up mail read as one system.
 *
 * Written for any finance business (brokers, advisers, lenders, accountants), not one niche.
 * Voice per the Brand Bible: Ruler 70 / Sage 30, calm, clear, direct, Australian English. CTAs are
 * verb-first. Nothing here quotes a result, because no Finance OS client outcome is on record.
 */
import { MERGE } from '@/data/warmup'

/**
 * GHL appointment merge fields. They resolve in calendar notifications and in workflows started
 * by an appointment trigger. `location` is whatever the calendar's meeting location is set to: a
 * video link reads as a link, a phone number reads as a number.
 */
export const APPT = {
  firstName: MERGE.firstName,
  date: '{{appointment.only_start_date}}',
  time: '{{appointment.only_start_time}}',
  timezone: '{{appointment.timezone}}',
  location: '{{appointment.meeting_location}}',
  reschedule: '{{appointment.reschedule_link}}',
  cancel: '{{appointment.cancellation_link}}',
  google: '{{appointment.add_to_google_calendar}}',
  outlook: '{{appointment.add_to_ical_outlook}}',
} as const

/**
 * The booking page itself, for the sends that follow a missed or cancelled call: the old
 * appointment's reschedule link is no use once it is cancelled. Create the custom value once in
 * Settings › Custom Values ("Booking Link"), and every email and SMS picks up a URL change.
 */
export const BOOKING_LINK = '{{custom_values.booking_link}}'

const SAMPLE_BOOKING_URL = 'https://start.onestaaack.ai/widget/booking/1bXsWmjEyOigmMazr7HG'

/** What the Preview tab swaps in, so the render reads like a real message. Never sent. */
export const SAMPLE: Record<string, string> = {
  [APPT.firstName]: 'Ben',
  [APPT.date]: 'Thursday, 8 October 2026',
  [APPT.time]: '1:30 pm',
  [APPT.timezone]: 'Australia/Melbourne',
  [APPT.location]: 'https://meet.google.com/abc-defg-hij',
  [APPT.reschedule]: SAMPLE_BOOKING_URL,
  [APPT.cancel]: SAMPLE_BOOKING_URL,
  [APPT.google]: 'https://calendar.google.com',
  [APPT.outlook]: 'https://outlook.live.com/calendar',
  [BOOKING_LINK]: SAMPLE_BOOKING_URL,
}

export const CALENDAR = {
  name: "Let's Chat Finance",
  length: '45 minutes',
  /** Pasted into GHL > Calendar > Basic details > Description. Shows on the booking page. */
  description:
    "A 45-minute call for finance businesses, from brokers and advisers to lenders and accountants. We map where enquiries slip between first contact and a signed client, show you the system that closes each gap, and tell you plainly whether Finance OS fits your business. Bring your numbers. Leave with a clear next step, whichever way you go.",
  /** GHL > Calendar > Meeting invite title. Shows in the attendee's own calendar. */
  inviteTitle: `Let's Chat Finance · Finance OS x ${APPT.firstName}`,
} as const

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'h'; text: string }
  /** The appointment itself: when, how long, where. An inset table, not a card. */
  | { kind: 'details' }
  /** Numbered prep list. */
  | { kind: 'list'; items: string[] }
  /** The message's one Atlas Blue fill. */
  | { kind: 'cta'; label: string; url: string }
  /** Quiet text links under the CTA or the details. */
  | { kind: 'links'; items: { label: string; url: string }[] }

export interface BookingEmail {
  n: number
  slug: string
  /** When GHL sends it, relative to the booking. */
  when: string
  subject: string
  preheader: string
  /** The job this send does. */
  role: string
  blocks: Block[]
  signoff: string[]
}

export interface BookingSms {
  n: number
  slug: string
  when: string
  text: string
}

const p = (text: string): Block => ({ kind: 'p', text })

const SIGN = ['The Finance OS team']

const MANAGE: Block = {
  kind: 'links',
  items: [
    { label: 'Reschedule', url: APPT.reschedule },
    { label: 'Cancel', url: APPT.cancel },
  ],
}

export const BOOKING_EMAILS: BookingEmail[] = [
  {
    n: 1,
    slug: 'confirmation',
    when: 'Immediately on booking',
    subject: `You're booked in: ${APPT.date} at ${APPT.time}`,
    preheader: "45 minutes, one clear next step. Here's what to expect.",
    role: 'Confirms the time, puts it in their calendar and sets the frame for the call: diagnostic, not a pitch.',
    blocks: [
      p(`Hi ${APPT.firstName},`),
      p("Your call is locked in. Here are the details."),
      { kind: 'details' },
      { kind: 'cta', label: 'Add to Google Calendar', url: APPT.google },
      {
        kind: 'links',
        items: [
          { label: 'Outlook or Apple Calendar', url: APPT.outlook },
          { label: 'Reschedule', url: APPT.reschedule },
        ],
      },
      { kind: 'h', text: 'What the 45 minutes covers' },
      {
        kind: 'list',
        items: [
          'Where your enquiries come from today, and where they slip before they become clients.',
          'The system that closes each gap: lead capture, follow-up and client retention.',
          'A straight answer on whether Finance OS fits your business. If it does not, we will say so.',
        ],
      },
      p('No slides. Bring your questions and a rough idea of your monthly numbers.'),
    ],
    signoff: SIGN,
  },
  {
    n: 2,
    slug: 'reminder-24h',
    when: '24 hours before',
    subject: `Tomorrow at ${APPT.time}: three things to have ready`,
    preheader: 'Five minutes of prep makes the 45 minutes count.',
    role: 'Reduces no-shows and makes the call diagnostic. The prep list gives them a reason to turn up ready.',
    blocks: [
      p(`Hi ${APPT.firstName},`),
      p("A quick reminder that we're speaking tomorrow."),
      { kind: 'details' },
      p('To get the most from the call, have these three numbers roughly to hand. Estimates are fine.'),
      {
        kind: 'list',
        items: [
          'How many new enquiries you get in a typical month, and where they come from.',
          'How many of those become paying clients.',
          'The tools you pay for today: CRM, email, forms, scheduling and anything else.',
        ],
      },
      p('That is enough for us to show you where the pipeline leaks and what one extra client a month would change.'),
      MANAGE,
    ],
    signoff: SIGN,
  },
  {
    n: 3,
    slug: 'reminder-1h',
    when: '1 hour before',
    subject: `Starting at ${APPT.time}: your Finance OS call`,
    preheader: "Here's the link. See you shortly.",
    role: 'The last nudge. Short, with the join link as the only fill so it can be opened from a phone.',
    blocks: [
      p(`Hi ${APPT.firstName},`),
      p(`We're speaking in an hour, at ${APPT.time}. Here's the link to join.`),
      { kind: 'cta', label: 'Join the call', url: APPT.location },
      p('If something has come up, move the time rather than skipping it. It takes ten seconds.'),
      MANAGE,
    ],
    signoff: SIGN,
  },
  {
    n: 4,
    slug: 'no-show',
    when: 'On No Show status',
    subject: 'We missed you today',
    preheader: 'No problem. Pick a time that suits you better.',
    role: 'Recovers the booking without guilt. One action: rebook.',
    blocks: [
      p(`Hi ${APPT.firstName},`),
      p("We didn't connect for your call today. It happens, weeks in finance rarely go to plan."),
      p('The offer stands. 45 minutes to map where your enquiries slip and what it would take to close the gaps. Choose a time that suits you.'),
      { kind: 'cta', label: 'Pick a new time', url: BOOKING_LINK },
      p('If now is not the right time, reply and let us know. We will close the loop on our end.'),
    ],
    signoff: SIGN,
  },
  {
    n: 5,
    slug: 'no-show-last',
    when: '2 days after a no-show, if not rebooked',
    subject: 'One last note about your call',
    preheader: 'Then we will leave it with you.',
    role: 'The final touch, and it says so. Ends the follow-up cleanly and leaves the door open.',
    blocks: [
      p(`Hi ${APPT.firstName},`),
      p('One last note about the call we missed. We will not keep following up about it.'),
      p('If enquiries are still slipping between first contact and a signed client, the calendar stays open. 45 minutes, your numbers, and a plain answer on whether Finance OS fits.'),
      { kind: 'cta', label: 'Book a time', url: BOOKING_LINK },
      p('Either way, thank you for your interest in Finance OS.'),
    ],
    signoff: SIGN,
  },
  {
    n: 6,
    slug: 'cancelled',
    when: 'On Cancelled status',
    subject: 'Your call is cancelled',
    preheader: 'If you would like another time, the calendar is open.',
    role: 'Confirms the cancellation so nobody is left wondering, and makes rebooking one step.',
    blocks: [
      p(`Hi ${APPT.firstName},`),
      p(`Your Let's Chat Finance call on ${APPT.date} at ${APPT.time} has been cancelled. Nothing else is needed from you.`),
      p('If the time did not suit, choose another. It takes under a minute.'),
      { kind: 'cta', label: 'Pick a new time', url: BOOKING_LINK },
      p('If something has changed on your side, reply and let us know.'),
    ],
    signoff: SIGN,
  },
  {
    n: 7,
    slug: 'thank-you',
    when: '1 hour after Showed status',
    subject: 'Thank you for your time today',
    preheader: 'What happens next, and how to reach us.',
    role: 'Closes the call and opens a reply channel. No recap and no solution: whatever they asked for becomes the agenda of the next conversation.',
    blocks: [
      p(`Hi ${APPT.firstName},`),
      p('Thank you for taking us through your business today.'),
      p('Anything we agreed to send, you will receive from us directly.'),
      p('If a question comes to mind after the call, reply to this email. It comes straight to us, and we will add it to our next conversation.'),
    ],
    signoff: SIGN,
  },
]

export const BOOKING_SMS: BookingSms[] = [
  {
    n: 1,
    slug: 'confirmation',
    when: 'Immediately on booking',
    text: `Hi ${APPT.firstName}, you're booked in with Finance OS for ${APPT.date} at ${APPT.time}. Details are in your inbox. Need to move it? ${APPT.reschedule}`,
  },
  {
    n: 2,
    slug: 'reminder-24h',
    when: '24 hours before',
    text: `Hi ${APPT.firstName}, reminder: your Finance OS call is tomorrow at ${APPT.time}. Have your monthly enquiry and new-client numbers handy, rough is fine. Reschedule: ${APPT.reschedule}`,
  },
  {
    n: 3,
    slug: 'reminder-1h',
    when: '1 hour before',
    text: `Hi ${APPT.firstName}, we're speaking at ${APPT.time}. Join here: ${APPT.location} - Finance OS`,
  },
  {
    n: 4,
    slug: 'no-show',
    when: 'On No Show status',
    text: `Hi ${APPT.firstName}, we missed you on today's call. No problem. Pick a new time here: ${BOOKING_LINK} - Finance OS`,
  },
  {
    n: 6,
    slug: 'cancelled',
    when: 'On Cancelled status',
    text: `Hi ${APPT.firstName}, your Finance OS call is cancelled. Want another time? ${BOOKING_LINK} - Finance OS`,
  },
]

/** Where each piece is set up in GHL. Four small workflows, one custom value. */
export const WIRING: ReadonlyArray<{ what: string; where: string }> = [
  { what: 'Booking link', where: 'Settings › Custom Values › add "Booking Link" = this calendar\'s booking page URL. Emails 04 to 06 and SMS 04 and 06 read it.' },
  { what: 'Description and invite title', where: `Calendars › ${CALENDAR.name} › Meeting details. Duration ${CALENDAR.length}; meeting location = the video link.` },
  { what: '1 · Booked: Email 01 + SMS 01', where: 'Trigger Customer Booked Appointment (filter: this calendar). First action Remove From Workflow (No-show, Cancelled), so a rebooking stops the recovery sends. Then send straight away.' },
  { what: '1 · Booked: Email 02 + SMS 02', where: 'If/Else: appointment start is more than 24 hours away. Yes branch: Wait until 24 hours before the start, then send. A same-day booking skips the "tomorrow" reminder.' },
  { what: '1 · Booked: Email 03 + SMS 03', where: 'Both branches rejoin: Wait until 1 hour before the start (If date already passed: skip), then send.' },
  { what: '2 · No-show: Email 04 + SMS 04, then 05', where: 'Trigger Appointment Status = No Show (this calendar). Send 04 straight away. Wait 2 days, then Email 05. A rebooking enters workflow 1, which removes them before 05.' },
  { what: '3 · Cancelled: Email 06 + SMS 06', where: 'Trigger Appointment Status = Cancelled (this calendar). First action Remove From Workflow (Booked), so no reminders follow. Then send.' },
  { what: '4 · Showed: Email 07', where: 'Trigger Appointment Status = Showed (this calendar). Wait 1 hour, then send. Mark the call Showed when it ends, or this never goes.' },
  { what: 'Test once', where: 'Book, reschedule and cancel a test appointment with your own email and phone. Confirm the reminders follow the new time after a reschedule.' },
]
