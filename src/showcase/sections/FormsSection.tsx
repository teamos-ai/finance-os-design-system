/**
 * FormsSection — the forms family. Three variations rebuilt from the kit on the repo's
 * tokens: an inline newsletter capture with a privacy note, a lead/enquiry form that
 * demonstrates the live error + success field states, and a three-step booking stepper
 * driven by React useState (the kit's forms.js was raw DOM — here it is state).
 *
 * Fields follow the kit's single `.fos-input` treatment — a 1px `border-border-strong`
 * line, 6px radius and the system's NEUTRAL focus ring (no accent glow) — shared across
 * input / select / textarea so the family reads as one. The repo's <Input> isn't reused
 * here because it can't express selects, textareas or the trailing-tick success field,
 * and this keeps every field on one consistent border. Blue owns the one typographic
 * highlight (the scarcity note + required marks); amber appears nowhere. 8px radius
 * ceiling, no side-rails, reduced-motion safe.
 */
import { useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Mail, ShieldCheck, Check, AlertCircle, ChevronDown, Clock } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { Button } from '@/components/ui/button'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

/* Shared field style — the kit's `.fos-input`, on tokens. One line across every field. */
const fieldClass =
  'w-full rounded-md border border-border-strong bg-surface px-3.5 py-2.5 font-body text-body-md text-fg ' +
  'placeholder:text-fg-subtle transition-colors duration-fast ease-out hover:border-accent ' +
  'focus-visible:border-fg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

const AGGREGATORS = ['AFG', 'Connective', 'Finsure', 'Loan Market', 'Other']
const TEAM_SIZES = ['Just me', '2–4 brokers', '5–10 brokers', '10+ brokers']
const VOLUME_OPTIONS = ['Under 20 enquiries', '20–50 enquiries', '50–100 enquiries', '100+ enquiries']
const SLOTS = ['Tue 9:00', 'Tue 14:30', 'Wed 10:00', 'Wed 15:30', 'Thu 11:00', 'Thu 16:00']
const STEPS = ['Your details', 'Pick a time', 'Confirm']

/* Kit `.fos-label` — mono-ish caption, with an accent (blue) required mark. */
function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label htmlFor={htmlFor} className="font-body text-caption font-semibold tracking-[0.02em] text-fg-muted">
      {children}
      {required && (
        <span aria-hidden className="ml-0.5 text-accent">
          *
        </span>
      )}
    </label>
  )
}

/* Styled select — appearance-none + an inline chevron (token ink, no data-URI hex). */
function Select({
  id,
  value,
  onChange,
  options,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(fieldClass, 'cursor-pointer appearance-none pr-10')}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        strokeWidth={1.6}
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted"
      />
    </div>
  )
}

export function FormsSection() {
  const reduced = useReducedMotion()

  /* (a) newsletter */
  const [email, setEmail] = useState<string>('')
  const [subscribed, setSubscribed] = useState<boolean>(false)

  /* (b) lead / enquiry — seeded to the kit's shown states, now validated live */
  const [leadName, setLeadName] = useState<string>('Marcus Hale')
  const [leadEmail, setLeadEmail] = useState<string>('marcus.hale@brokerage')
  const [enquiryVolume, setEnquiryVolume] = useState<string>('20–50 enquiries')
  const leadNameValid = leadName.trim().length > 1
  const leadEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadEmail.trim())
  const leadEmailError = leadEmail.trim().length > 0 && !leadEmailValid

  /* (c) booking stepper */
  const [step, setStep] = useState<number>(0)
  const [aggregator, setAggregator] = useState<string>('Connective')
  const [teamSize, setTeamSize] = useState<string>('2–4 brokers')
  const [slot, setSlot] = useState<string>('Tue 14:30')
  const [confirmed, setConfirmed] = useState<boolean>(false)
  const headerStep = confirmed ? STEPS.length : step

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))
  const reset = () => {
    setConfirmed(false)
    setStep(0)
  }

  const review: { label: string; value: string }[] = [
    { label: 'Call type', value: 'Pipeline review (Discovery)' },
    { label: 'Aggregator', value: aggregator },
    { label: 'Team size', value: teamSize },
    { label: 'Time', value: `${slot} AEDT` },
  ]

  return (
    <Section
      id="forms"
      eyebrow="18 - Forms"
      title="Forms"
      lead="Capture, qualify and book. Every field sits on a neutral focus ring with a blue primary action; validation speaks plainly — green for clear, red for fix — and the booking flow stays calm across three steps."
    >
      <div className="flex flex-col gap-8">
        {/* Newsletter + enquiry — side by side, as in the kit grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* (a) Inline newsletter capture */}
          <Demo label="Newsletter — inline capture with a privacy note">
            <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 flex-none place-items-center rounded-md bg-accent-soft text-accent">
                  <Mail aria-hidden strokeWidth={1.8} className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-display text-title-md text-fg">The Settlement Note</div>
                  <p className="mt-0.5 font-body text-body-sm leading-relaxed text-fg-muted">
                    Fortnightly read on rate moves, aggregator policy and pipeline benchmarks — for broker
                    principals.
                  </p>
                </div>
              </div>

              {subscribed ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-5 flex items-center gap-3 rounded-md border border-border-subtle bg-success-soft px-4 py-3.5"
                >
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-success text-inverse-fg">
                    <Check aria-hidden strokeWidth={2} className="h-4 w-4" />
                  </span>
                  <p className="font-body text-body-sm text-fg">
                    You're on the list — the next Settlement Note is on its way.
                  </p>
                </div>
              ) : (
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (email.trim()) setSubscribed(true)
                  }}
                  className="mt-5 flex flex-col gap-2.5 sm:flex-row"
                >
                  <label htmlFor="nl-email" className="sr-only">
                    Work email
                  </label>
                  <input
                    id="nl-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@brokerage.com.au"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(fieldClass, 'flex-1')}
                  />
                  <Button type="submit" variant="primary" className="w-full sm:w-auto">
                    Subscribe
                  </Button>
                </form>
              )}

              <p className="mt-3 flex items-start gap-2 font-body text-caption leading-relaxed text-fg-subtle">
                <ShieldCheck aria-hidden strokeWidth={1.5} className="mt-0.5 h-3.5 w-3.5 flex-none" />
                <span>
                  No spam, ever. One email a fortnight, unsubscribe in a click. We never share your details with
                  lenders or aggregators.
                </span>
              </p>
            </div>
          </Demo>

          {/* (b) Lead / enquiry form — live error + success field states */}
          <Demo label="Enquiry — lead form with live error & success states">
            <form
              noValidate
              onSubmit={(e) => e.preventDefault()}
              className="rounded-lg border border-border bg-surface p-6 shadow-sm"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {/* name — success */}
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="lf-name" required>
                    Full name
                  </FieldLabel>
                  <div className="relative">
                    <input
                      id="lf-name"
                      type="text"
                      autoComplete="name"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className={cn(fieldClass, 'pr-10', leadNameValid && 'border-success')}
                    />
                    {leadNameValid && (
                      <Check
                        aria-hidden
                        strokeWidth={2.2}
                        className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-success"
                      />
                    )}
                  </div>
                  {leadNameValid && (
                    <span className="flex items-center gap-1.5 font-body text-caption text-success">
                      <Check aria-hidden strokeWidth={2.2} className="h-3.5 w-3.5" />
                      Looks good
                    </span>
                  )}
                </div>

                {/* email — error */}
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="lf-email" required>
                    Work email
                  </FieldLabel>
                  <input
                    id="lf-email"
                    type="email"
                    autoComplete="email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    aria-invalid={leadEmailError || undefined}
                    aria-describedby={leadEmailError ? 'lf-email-err' : undefined}
                    className={cn(fieldClass, leadEmailError && 'border-danger')}
                  />
                  {leadEmailError && (
                    <span id="lf-email-err" className="flex items-center gap-1.5 font-body text-caption text-danger">
                      <AlertCircle aria-hidden strokeWidth={2} className="h-3.5 w-3.5 flex-none" />
                      Enter a valid email — a domain is missing
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="lf-phone">Phone</FieldLabel>
                  <input
                    id="lf-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="04xx xxx xxx"
                    className={fieldClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="lf-vol">Monthly enquiry volume</FieldLabel>
                  <Select id="lf-vol" value={enquiryVolume} onChange={setEnquiryVolume} options={VOLUME_OPTIONS} />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-1.5">
                <FieldLabel htmlFor="lf-note">What are you hoping to fix?</FieldLabel>
                <textarea
                  id="lf-note"
                  rows={3}
                  placeholder="e.g. leads going cold before the first call, or no view of settlements by broker…"
                  className={cn(fieldClass, 'min-h-[92px] resize-y leading-relaxed')}
                />
                <span className="font-body text-caption text-fg-subtle">
                  We read every note before the call — the more context, the sharper the diagnosis.
                </span>
              </div>

              <Button type="submit" variant="primary" className="mt-5 w-full">
                Request a pipeline review
              </Button>
            </form>
          </Demo>
        </div>

        {/* (c) Multi-step booking — full width, driven by useState */}
        <Demo label="Booking — three-step stepper with an active-step panel">
          <div className="rounded-lg border border-border bg-surface p-6 shadow-sm md:p-8">
            {/* stepper header */}
            <div className="flex items-start">
              {STEPS.map((label, i) => {
                const isDone = i < headerStep
                const isActive = i === step && !confirmed
                return (
                  <div key={label} className="relative flex flex-1 flex-col items-center gap-2">
                    {i < STEPS.length - 1 && (
                      <span
                        aria-hidden
                        className={cn('absolute left-1/2 top-4 h-px w-full', isDone ? 'bg-accent' : 'bg-border-strong')}
                      />
                    )}
                    <span
                      className={cn(
                        'relative z-10 grid h-8 w-8 place-items-center rounded-lg border font-display text-body-sm font-semibold transition-colors duration-base ease-out',
                        isDone && 'border-accent bg-accent text-accent-fg',
                        isActive && 'border-accent bg-surface text-accent ring-2 ring-accent-soft',
                        !isDone && !isActive && 'border-border-strong bg-surface text-fg-subtle',
                      )}
                    >
                      {isDone ? <Check aria-hidden strokeWidth={2.4} className="h-4 w-4" /> : i + 1}
                    </span>
                    <span
                      className={cn(
                        'text-center font-body text-caption font-semibold',
                        isDone || isActive ? 'text-fg' : 'text-fg-subtle',
                      )}
                    >
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>

            {confirmed ? (
              <div
                role="status"
                aria-live="polite"
                className="mt-6 flex flex-col items-center gap-3 rounded-md border border-border-subtle bg-success-soft px-6 py-10 text-center"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-success text-inverse-fg">
                  <Check aria-hidden strokeWidth={2} className="h-5 w-5" />
                </span>
                <div className="font-display text-title-sm text-fg">Booking confirmed</div>
                <p className="max-w-sm font-body text-body-sm leading-relaxed text-fg-muted">
                  We've sent a calendar invite and a short prep note for your {slot} AEDT call to your inbox.
                </p>
                <Button type="button" variant="ghost" size="sm" onClick={reset}>
                  Start over
                </Button>
              </div>
            ) : (
              <>
                <div className="relative mt-6 min-h-[200px]">
                  <motion.div
                    key={step}
                    initial={reduced ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: EASE_OUT }}
                  >
                    {step === 0 && (
                      <div className="flex flex-col gap-4">
                        <div>
                          <div className="font-display text-title-sm text-fg">Tell us about the brokerage</div>
                          <p className="mt-0.5 font-body text-body-sm leading-relaxed text-fg-muted">
                            A two-call diagnostic for mortgage &amp; finance brokers. Takes about 30 minutes.
                          </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="flex flex-col gap-1.5">
                            <FieldLabel htmlFor="bk-name">Principal name</FieldLabel>
                            <input
                              id="bk-name"
                              type="text"
                              autoComplete="name"
                              placeholder="Jordan Lee"
                              className={fieldClass}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <FieldLabel htmlFor="bk-aggr">Aggregator</FieldLabel>
                            <Select id="bk-aggr" value={aggregator} onChange={setAggregator} options={AGGREGATORS} />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <FieldLabel htmlFor="bk-size">Writers in the team</FieldLabel>
                          <Select id="bk-size" value={teamSize} onChange={setTeamSize} options={TEAM_SIZES} />
                        </div>
                      </div>
                    )}

                    {step === 1 && (
                      <div className="flex flex-col gap-4">
                        <div>
                          <div className="font-display text-title-sm text-fg">Choose a time that suits</div>
                          <p className="mt-0.5 font-body text-body-sm leading-relaxed text-fg-muted">
                            All times AEDT. We hold the slot for 15 minutes while you confirm.
                          </p>
                        </div>
                        <div
                          role="group"
                          aria-label="Available call times"
                          className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
                        >
                          {SLOTS.map((s) => {
                            const active = s === slot
                            return (
                              <button
                                key={s}
                                type="button"
                                aria-pressed={active}
                                onClick={() => setSlot(s)}
                                className={cn(
                                  'rounded-md border px-2 py-2.5 text-center font-body text-body-sm tabular-nums transition-colors duration-fast ease-out',
                                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                  active
                                    ? 'border-accent bg-accent-soft font-semibold text-accent'
                                    : 'border-border-strong bg-surface text-fg hover:border-accent hover:bg-canvas-muted',
                                )}
                              >
                                {s}
                              </button>
                            )
                          })}
                        </div>
                        <p className="flex items-center gap-2 font-body text-caption text-accent-text">
                          <Clock aria-hidden strokeWidth={1.5} className="h-3.5 w-3.5 flex-none" />
                          Only a few review slots left this week
                        </p>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="flex flex-col gap-4">
                        <div>
                          <div className="font-display text-title-sm text-fg">Confirm your booking</div>
                          <p className="mt-0.5 font-body text-body-sm leading-relaxed text-fg-muted">
                            We'll send a calendar invite and a short prep note to your inbox.
                          </p>
                        </div>
                        <dl className="flex flex-col">
                          {review.map((r, i) => (
                            <div
                              key={r.label}
                              className={cn(
                                'flex justify-between gap-3 py-2.5 font-body text-body-sm',
                                i > 0 && 'border-t border-border',
                              )}
                            >
                              <dt className="text-fg-subtle">{r.label}</dt>
                              <dd className="text-right font-semibold tabular-nums text-fg">{r.value}</dd>
                            </div>
                          ))}
                        </dl>
                        <div className="flex flex-col gap-1.5">
                          <FieldLabel htmlFor="bk-email">Send the invite to</FieldLabel>
                          <input
                            id="bk-email"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            placeholder="you@brokerage.com.au"
                            className={fieldClass}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                <div className="mt-6 flex gap-2.5">
                  {step > 0 && (
                    <Button type="button" variant="ghost" className="flex-1" onClick={back}>
                      Back
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="primary"
                    className="flex-1"
                    onClick={step === STEPS.length - 1 ? () => setConfirmed(true) : next}
                  >
                    {step === STEPS.length - 1 ? 'Confirm booking' : 'Continue'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </Demo>
      </div>
    </Section>
  )
}
