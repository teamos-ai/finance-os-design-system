/**
 * BookingSection — everything around one booked "Let's Chat Finance" call: the calendar
 * description, four HTML emails and four SMS, each paste-ready for GHL.
 *
 * Copy is data (`src/data/booking.ts`); the HTML renders from it via `src/lib/booking-render.ts`.
 * Same budgets as the warm-up section: every control is ghost or outline, the cards collapse and
 * the chevron is the only thing that moves.
 */
import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { CopyButton } from '@/components/ui/copy-button'
import { MonoLabel } from '@/components/ui/mono-label'
import { SegmentedControl } from '@/components/ui/segmented'
import { BOOKING_EMAILS, BOOKING_SMS, CALENDAR, type BookingEmail, type BookingSms } from '@/data/booking'
import { toHtml, withSample } from '@/lib/booking-render'
import { cn } from '@/lib/cn'

type View = 'preview' | 'html'

const VIEWS = [
  { value: 'preview' as const, label: 'Preview' },
  { value: 'html' as const, label: 'HTML' },
]

/** GSM-7 SMS segments. Merge fields expand when sent, so this is a floor, not a promise. */
const segments = (n: number) => (n <= 160 ? 1 : Math.ceil(n / 153))

/** Collapsible card shell: the whole header row is the trigger. */
const Collapsible = ({
  kicker,
  title,
  sub,
  defaultOpen = false,
  children,
}: {
  kicker: string
  title: string
  sub?: string
  defaultOpen?: boolean
  children: React.ReactNode
}) => {
  const [open, setOpen] = React.useState(defaultOpen)
  const id = React.useId()
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <h3>
        <button
          type="button"
          id={`${id}-trigger`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-start gap-4 p-6 text-left transition-colors hover:bg-inset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas md:p-8"
        >
          <span className="flex min-w-0 flex-1 flex-col gap-2">
            <MonoLabel tone="subtle" size="sm">
              {kicker}
            </MonoLabel>
            <span className="font-display text-title text-fg">{title}</span>
            {sub && <span className="font-body text-body-md text-fg-muted">{sub}</span>}
          </span>
          <ChevronDown
            aria-hidden
            strokeWidth={1.75}
            className={cn('mt-1 h-5 w-5 shrink-0 text-fg-subtle transition-transform', open && 'rotate-180')}
          />
        </button>
      </h3>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-trigger`} hidden={!open}>
        <div className="flex flex-col gap-6 border-t border-border p-6 md:p-8">{children}</div>
      </div>
    </div>
  )
}

const EmailCard = ({ email, defaultOpen }: { email: BookingEmail; defaultOpen?: boolean }) => {
  const [view, setView] = React.useState<View>('preview')
  const html = React.useMemo(() => toHtml(email), [email])
  const preview = React.useMemo(() => withSample(html), [html])

  return (
    <Collapsible
      kicker={`Email ${String(email.n).padStart(2, '0')} · ${email.when}`}
      title={withSample(email.subject)}
      sub={email.preheader}
      defaultOpen={defaultOpen}
    >
      <div>
        <MonoLabel tone="subtle" size="sm">
          What this send is for
        </MonoLabel>
        <p className="mt-2 max-w-2xl font-body text-body-md text-fg-muted">{email.role}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl
          size="sm"
          aria-label={`Format for email ${email.n}`}
          options={VIEWS}
          value={view}
          onValueChange={(v) => setView(v)}
        />
        <CopyButton value={email.subject}>Copy subject</CopyButton>
        <CopyButton value={html}>Copy HTML</CopyButton>
      </div>

      {view === 'preview' ? (
        <iframe
          title={`Rendered preview: ${email.subject}`}
          srcDoc={preview}
          sandbox=""
          className="h-[640px] w-full rounded-md border border-border bg-canvas"
        />
      ) : (
        <pre className="max-h-[640px] overflow-auto rounded-md border border-border bg-inset p-4 font-mono text-body-sm leading-relaxed text-fg-muted">
          <code>{html}</code>
        </pre>
      )}
    </Collapsible>
  )
}

const SmsCard = ({ sms, defaultOpen }: { sms: BookingSms; defaultOpen?: boolean }) => (
  <Collapsible kicker={`SMS ${String(sms.n).padStart(2, '0')} · ${sms.when}`} title={withSample(sms.text)} defaultOpen={defaultOpen}>
    <pre className="whitespace-pre-wrap rounded-md border border-border bg-inset p-4 font-mono text-body-sm leading-relaxed text-fg">
      <code>{sms.text}</code>
    </pre>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <MonoLabel tone="subtle" size="sm">
        {withSample(sms.text).length} characters with sample values · {segments(withSample(sms.text).length)} segment
        {segments(withSample(sms.text).length) > 1 ? 's' : ''}
      </MonoLabel>
      <CopyButton value={sms.text}>Copy SMS</CopyButton>
    </div>
  </Collapsible>
)

const WIRING = [
  { what: 'Calendar description', where: "Calendars › Let's Chat Finance › Basic details › Description" },
  { what: 'Email 01 + SMS 01', where: 'Workflow: trigger Customer Booked Appointment, send immediately' },
  { what: 'Email 02 + SMS 02', where: 'Same workflow: Wait until 24 hours before appointment start' },
  { what: 'Email 03 + SMS 03', where: 'Same workflow: Wait until 1 hour before appointment start' },
  { what: 'Email 04 + SMS 04', where: 'Workflow: trigger Appointment Status is No-show' },
]

export const BookingSection = () => (
  <Section
    id="booking"
    eyebrow="Applied"
    title="Booking emails & SMS"
    lead="The calendar description, confirmation, reminders and no-show recovery for the Let's Chat Finance call. HTML and SMS are paste-ready for GHL; merge fields stay in the copied code and resolve on send."
  >
    <div className="flex flex-col gap-8">
      <Demo label="Calendar description — shows on the booking page" action={<CopyButton value={CALENDAR.description}>Copy</CopyButton>}>
        <p className="max-w-2xl font-body text-body-lg leading-relaxed text-fg">{CALENDAR.description}</p>
      </Demo>

      <Demo label="Where each piece goes in GHL">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <caption className="sr-only">Where each booking message is set up in GHL</caption>
            <thead>
              <tr className="border-b border-border">
                {['Piece', 'Where'].map((th) => (
                  <th key={th} scope="col" className="py-3 pr-4 font-mono text-caption uppercase tracking-wide text-fg-subtle">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WIRING.map((row) => (
                <tr key={row.what} className="border-b border-border last:border-0">
                  <td className="py-3 pr-4 font-body text-body-md text-fg">{row.what}</td>
                  <td className="py-3 pr-4 font-body text-body-md text-fg-muted">{row.where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Demo>

      <div className="flex flex-col gap-4">
        <MonoLabel tone="subtle" size="sm">
          Emails — 4
        </MonoLabel>
        {BOOKING_EMAILS.map((e, i) => (
          <EmailCard key={e.slug} email={e} defaultOpen={i === 0} />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <MonoLabel tone="subtle" size="sm">
          Text messages — 4
        </MonoLabel>
        {BOOKING_SMS.map((s) => (
          <SmsCard key={s.slug} sms={s} />
        ))}
      </div>
    </div>
  </Section>
)
