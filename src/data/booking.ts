/**
 * The "Let's Chat Finance" booking set: the calendar description, the four emails and the four
 * SMS that surround one booked discovery call in GHL.
 *
 * One source per email: `blocks` render the HTML body (`src/lib/booking-render.ts`). The palette
 * and sender block are shared with the warm-up sequence (`src/data/warmup.ts`), so the booking
 * mail and the warm-up mail read as one system.
 *
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

/** What the Preview tab swaps in, so the render reads like a real message. Never sent. */
export const SAMPLE: Record<string, string> = {
  [APPT.firstName]: 'Ben',
  [APPT.date]: 'Thursday, 8 October 2026',
  [APPT.time]: '1:30 pm',
  [APPT.timezone]: 'Australia/Melbourne',
  [APPT.location]: 'https://meet.google.com/abc-defg-hij',
  [APPT.reschedule]: 'https://start.onestaaack.ai/widget/booking/1bXsWmjEyOigmMazr7HG',
  [APPT.cancel]: 'https://start.onestaaack.ai/widget/booking/1bXsWmjEyOigmMazr7HG',
  [APPT.google]: 'https://calendar.google.com',
  [APPT.outlook]: 'https://outlook.live.com/calendar',
}

export const CALENDAR = {
  name: "Let's Chat Finance",
  length: '45 minutes',
  /** Pasted into GHL > Calendar > Basic details > Description. Shows on the booking page. */
  description:
    "A 45-minute call for Australian mortgage brokers. We map where enquiries slip between first contact and settlement, show you the system that closes each gap, and tell you plainly whether Finance OS fits your business. Bring your numbers. Leave with a clear next step, whichever way you go.",
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

const SIGN = ['Tumai and Ariki', 'Finance OS']

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
          'Where your enquiries come from today, and where they slip before settlement.',
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
          'How many of those settle.',
          'The tools you pay for today: CRM, email, forms, scheduling and anything else.',
        ],
      },
      p('That is enough for us to show you where the pipeline leaks and what one extra funded deal a month would change.'),
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
    when: 'On no-show status',
    subject: 'We missed you today',
    preheader: 'No problem. Pick a time that suits you better.',
    role: 'Recovers the booking without guilt. One action: rebook.',
    blocks: [
      p(`Hi ${APPT.firstName},`),
      p("We didn't connect for your call today. It happens, broking weeks rarely go to plan."),
      p('The offer stands. 45 minutes to map where your enquiries slip and what it would take to close the gaps. Choose a time that suits you.'),
      { kind: 'cta', label: 'Pick a new time', url: APPT.reschedule },
      p('If now is not the right time, reply and let us know. We will close the loop on our end.'),
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
    text: `Hi ${APPT.firstName}, reminder: your Finance OS call is tomorrow at ${APPT.time}. Have your monthly enquiry and settlement numbers handy, rough is fine. Reschedule: ${APPT.reschedule}`,
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
    when: 'On no-show status',
    text: `Hi ${APPT.firstName}, we missed you on today's call. No problem. Pick a new time here: ${APPT.reschedule} - Finance OS`,
  },
]
