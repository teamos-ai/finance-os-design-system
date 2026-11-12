/**
 * EmailsSection — Client email templates. The transactional and relationship emails a broker sends
 * a borrower through Finance OS, distinct from the sending-domain warm-up sequence: pre-approval
 * confirmation, settlement, the annual-review / rate-change nudge, and a review request.
 *
 * Copy is data (`src/components/emails/templates.ts`); the plain-text and HTML bodies both render
 * from the same blocks (`src/components/emails/render.ts`), so the reference cannot drift from what
 * is sent. The four-moment overview is live: a tile opens its template and scrolls to it.
 *
 * Budgets: one Atlas Blue fill per email (its CTA), and blue owns every icon well and link. Amber
 * appears exactly once in the section — the pre-approval "Conditional" status — because amber is an
 * attention/pending signal only. Settlement reads success-green, the review nudge reads blue, the
 * review ask stays neutral. No ribbons; emphasis is elevation, a full border and scale.
 */
import * as React from 'react'
import { ChevronDown, Copy, ArrowRight, BadgeCheck, KeyRound, CalendarClock, Star, type LucideIcon } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'
import { Section, Demo } from '@/showcase/Section'
import { Button } from '@/components/ui/button'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { MonoLabel } from '@/components/ui/mono-label'
import { SegmentedControl } from '@/components/ui/segmented'
import { Stagger, StaggerItem } from '@/lib/motion'
import { TEMPLATES, COMPLIANCE_RULES, type ClientEmail, type StatusTone } from '@/components/emails/templates'
import { toPlainText, toHtml, allPlainText, mergeFieldsIn } from '@/components/emails/render'
import { cn } from '@/lib/cn'

/** How long the "Copied" label and its live announcement hold. Not a motion duration. */
const COPIED_RESET_MS = 1200

/** Status tone → Badge variant. Only `amber` is attention/pending; the rest are calm signals. */
const STATUS_BADGE: Record<StatusTone, BadgeProps['variant']> = {
  amber: 'amber',
  success: 'success',
  blue: 'blue',
  neutral: 'neutral',
}

/** One lucide glyph per client moment — a single family, blue icon well across the system. */
const MOMENT_ICON: Record<string, LucideIcon> = {
  'pre-approval': BadgeCheck,
  settlement: KeyRound,
  'annual-review': CalendarClock,
  'review-request': Star,
}

type View = 'preview' | 'text' | 'html'

const VIEWS = [
  { value: 'preview' as const, label: 'Preview' },
  { value: 'text' as const, label: 'Plain text' },
  { value: 'html' as const, label: 'HTML' },
]

/** CopyButton — ghost, swaps its own label for 1.2s and announces the swap to a screen reader. */
const CopyButton = ({ value, children }: { value: string; children: React.ReactNode }) => {
  const [copied, setCopied] = React.useState(false)
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        leadingIcon={<Copy className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
            setTimeout(() => setCopied(false), COPIED_RESET_MS)
          } catch {
            /* clipboard blocked: the panel below is selectable, so there is still a way through */
          }
        }}
      >
        {copied ? 'Copied' : children}
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </>
  )
}

/** One overview tile — a button that opens its template below and scrolls to it. */
const OverviewTile = ({ email, onOpen }: { email: ClientEmail; onOpen: () => void }) => {
  const Icon = MOMENT_ICON[email.slug]
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'group flex h-full w-full flex-col gap-3 rounded-lg border border-border bg-surface p-5 text-left shadow-sm',
        'transition-all duration-base ease-out hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md',
        'active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
        'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-md bg-accent-soft text-accent">
          {Icon ? <Icon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden /> : null}
        </span>
        <Badge variant={STATUS_BADGE[email.status.tone]} size="sm">
          {email.status.label}
        </Badge>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-display text-title-sm text-fg">{email.moment}</span>
        <span className="font-body text-body-sm text-fg-muted">{email.sends}</span>
      </div>
      <span className="mt-auto inline-flex items-center gap-1.5 font-mono text-mono-2xs uppercase tracking-[0.14em] text-accent-text">
        View template
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform duration-base ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
          strokeWidth={2}
          aria-hidden
        />
      </span>
    </button>
  )
}

/**
 * One template, collapsed to its header until opened. The whole header row is the trigger; the
 * chevron turns over and nothing else moves. Open state is controlled by the section so a tile can
 * open the matching card.
 */
const EmailCard = ({
  email,
  open,
  onToggle,
  innerRef,
}: {
  email: ClientEmail
  open: boolean
  onToggle: () => void
  innerRef: (el: HTMLDivElement | null) => void
}) => {
  const [view, setView] = React.useState<View>('preview')
  const id = React.useId()

  const text = React.useMemo(() => toPlainText(email), [email])
  const html = React.useMemo(() => toHtml(email), [email])
  const fields = React.useMemo(() => mergeFieldsIn(email), [email])
  const body = view === 'text' ? text : html
  const nn = String(email.n).padStart(2, '0')

  return (
    <div ref={innerRef} className="scroll-mt-24 overflow-hidden rounded-lg border border-border bg-surface">
      <h3>
        <button
          type="button"
          id={`${id}-trigger`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="flex w-full items-start gap-4 p-6 text-left transition-colors hover:bg-inset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas md:p-8"
        >
          <span className="flex min-w-0 flex-1 flex-col gap-2">
            <MonoLabel tone="subtle" size="sm">
              Template <span className="tabular-nums">{nn}</span> · {email.moment}
            </MonoLabel>
            <span className="font-display text-title-md text-fg">{email.subject}</span>
            <span className="font-body text-body-md text-fg-muted">{email.preheader}</span>
          </span>
          <span className="flex shrink-0 items-center gap-3">
            <Badge variant={STATUS_BADGE[email.status.tone]} size="sm" className="hidden sm:inline-flex">
              {email.status.label}
            </Badge>
            <ChevronDown
              aria-hidden
              strokeWidth={1.75}
              className={cn(
                'mt-0.5 h-5 w-5 text-fg-subtle transition-transform duration-base ease-out motion-reduce:transition-none',
                open && 'rotate-180',
              )}
            />
          </span>
        </button>
      </h3>

      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-trigger`} hidden={!open}>
        {open && (
          <div className="flex flex-col gap-6 border-t border-border p-6 md:p-8">
            <div>
              <MonoLabel tone="subtle" size="sm">
                When this sends
              </MonoLabel>
              <p className="mt-2 max-w-2xl font-body text-body-md text-fg-muted">{email.trigger}</p>
            </div>

            <div>
              <MonoLabel tone="subtle" size="sm">
                Merge fields — resolved from the client record at send
              </MonoLabel>
              <dl className="mt-3 grid gap-x-8 sm:grid-cols-2">
                {fields.map((f) => (
                  <div
                    key={f.token}
                    className="flex items-baseline justify-between gap-3 border-b border-border py-2"
                  >
                    <dt className="font-mono text-caption text-accent-text">{f.token}</dt>
                    <dd className="text-right font-body text-body-sm text-fg-muted">{f.gloss}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <SegmentedControl
                size="sm"
                aria-label={`Format for the ${email.moment} template`}
                options={VIEWS}
                value={view}
                onValueChange={(v) => setView(v)}
              />
              <CopyButton value={email.subject}>Copy subject</CopyButton>
              <CopyButton value={view === 'html' ? html : text}>
                {view === 'html' ? 'Copy HTML' : 'Copy plain text'}
              </CopyButton>
            </div>

            {view === 'preview' ? (
              <iframe
                title={`Rendered preview: ${email.subject}`}
                srcDoc={html}
                sandbox=""
                className="h-[560px] w-full rounded-md border border-border bg-canvas"
              />
            ) : (
              <pre className="max-h-[560px] overflow-auto rounded-md border border-border bg-inset p-4 font-mono text-body-sm leading-relaxed text-fg-muted">
                <code>{body}</code>
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export const EmailsSection = () => {
  const reduced = useReducedMotion()
  const [openSlug, setOpenSlug] = React.useState<string | null>(TEMPLATES[0]?.slug ?? null)
  const cardEls = React.useRef<Record<string, HTMLDivElement | null>>({})
  const everything = React.useMemo(() => allPlainText(TEMPLATES), [])

  const openAndReveal = (slug: string) => {
    setOpenSlug(slug)
    requestAnimationFrame(() => {
      cardEls.current[slug]?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    })
  }

  const overviewInspect = React.useMemo(
    () => ({
      name: 'Client email templates',
      explain:
        'Four transactional broker emails — pre-approval, settlement, the annual review and a review request. Content is data; the plain-text and HTML bodies render from one source so they cannot drift, and every client figure is a merge field rather than a written-in value.',
      token:
        'surface + border + shadow-sm tiles · bg-accent-soft / text-accent icon well · Badge amber|success|blue|neutral status · bg-inset summary box · one bg-accent CTA per email',
      code: `import { TEMPLATES } from '@/components/emails/templates'
import { toHtml, toPlainText } from '@/components/emails/render'

const email = TEMPLATES[0]        // pre-approval
const html = toHtml(email)        // standalone, paste-ready
const text = toPlainText(email)   // plain-text alternate`,
      download: { filename: 'finance-os-client-emails.txt', content: everything, mime: 'text/plain' },
    }),
    [everything],
  )

  return (
    <Section
      id="client-emails"
      eyebrow="Client Emails"
      title="Client email templates"
      lead="The transactional and relationship emails a broker sends a borrower through Finance OS — pre-approval, settlement, the annual review and a review request. Content is data; the plain-text and HTML bodies render from one source, so they cannot drift. Every client figure is a merge field, never a written-in value."
    >
      <div className="flex flex-col gap-8">
        <Demo label="The four moments — one template each" inspect={overviewInspect}>
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {TEMPLATES.map((e) => (
              <StaggerItem key={e.slug} className="h-full">
                <OverviewTile email={e} onOpen={() => openAndReveal(e.slug)} />
              </StaggerItem>
            ))}
          </Stagger>
        </Demo>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <MonoLabel tone="subtle" size="sm">
              The templates — 4 emails, one source each
            </MonoLabel>
            <CopyButton value={everything}>Copy all four, plain text</CopyButton>
          </div>
          {TEMPLATES.map((e) => (
            <EmailCard
              key={e.slug}
              email={e}
              open={openSlug === e.slug}
              onToggle={() => setOpenSlug((s) => (s === e.slug ? null : e.slug))}
              innerRef={(el) => {
                cardEls.current[e.slug] = el
              }}
            />
          ))}
        </div>

        <Demo label="How these templates stay compliant">
          <div className="grid gap-6 md:grid-cols-2">
            {COMPLIANCE_RULES.map((r) => (
              <div key={r.title} className="flex flex-col gap-2">
                <h3 className="font-display text-body-lg font-semibold text-fg">{r.title}</h3>
                <p className="font-body text-body-md text-fg-muted">{r.text}</p>
              </div>
            ))}
          </div>
        </Demo>
      </div>
    </Section>
  )
}
