/**
 * WarmupSection — the sending-domain warm-up sequence. Six emails over 24 days that exist to earn
 * a new sub-domain a reputation, in the two formats they get pasted into LC Email as.
 *
 * Copy is data (`src/data/warmup.ts`); the plain-text and HTML bodies are both rendered from the
 * same blocks by `src/lib/warmup-render.ts`, so the reference cannot drift from what is sent.
 *
 * Budgets: no primary button, no gradient and no accent fill anywhere in the section. Every
 * control is ghost or outline, because this is a tool rather than a pitch, and the one Atlas Blue
 * fill in the whole sequence belongs to the CTA inside email six. The cards collapse; the chevron
 * is the only thing that moves.
 */
import * as React from 'react'
import { ChevronDown, Copy } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { Button } from '@/components/ui/button'
import { MonoLabel } from '@/components/ui/mono-label'
import { SegmentedControl } from '@/components/ui/segmented'
import { WARMUP, PLAN, RULES, type WarmupEmail } from '@/data/warmup'
import { allPlainText, toHtml, toPlainText } from '@/lib/warmup-render'
import { cn } from '@/lib/cn'

/** How long the "Copied" label and its live announcement hold. Not a motion duration. */
const COPIED_RESET_MS = 1200

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

/**
 * One email, collapsed to its header until opened. The whole header row is the trigger, so the
 * target is the width of the card; the chevron turns over and nothing else moves.
 */
const EmailCard = ({ email, defaultOpen = false }: { email: WarmupEmail; defaultOpen?: boolean }) => {
  const [open, setOpen] = React.useState(defaultOpen)
  const [view, setView] = React.useState<View>('text')
  const id = React.useId()

  const text = React.useMemo(() => toPlainText(email), [email])
  const html = React.useMemo(() => toHtml(email), [email])
  const body = view === 'text' ? text : html

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
              Email {String(email.n).padStart(2, '0')} · Day {email.day} ·{' '}
              {email.links === 0 ? 'no body link' : `${email.links} link${email.links > 1 ? 's' : ''}`}
            </MonoLabel>
            <span className="font-display text-title text-fg">{email.subject}</span>
            <span className="font-body text-body-md text-fg-muted">{email.preheader}</span>
          </span>
          <ChevronDown
            aria-hidden
            strokeWidth={1.75}
            className={cn('mt-1 h-5 w-5 shrink-0 text-fg-subtle transition-transform', open && 'rotate-180')}
          />
        </button>
      </h3>

      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-trigger`} hidden={!open}>
        <div className="flex flex-col gap-6 border-t border-border p-6 md:p-8">
          <div>
            <MonoLabel tone="subtle" size="sm">
              What this send is for
            </MonoLabel>
            <p className="mt-2 max-w-2xl font-body text-body-md text-fg-muted">{email.role}</p>
          </div>

          <div>
            <MonoLabel tone="subtle" size="sm">
              Subject alternates — A/B only once the domain is warm
            </MonoLabel>
            <ul className="mt-2 flex flex-col gap-1">
              {email.altSubjects.map((s) => (
                <li key={s} className="font-body text-body-md text-fg">
                  {s}
                </li>
              ))}
            </ul>
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
            <CopyButton value={view === 'html' ? html : text}>
              {view === 'html' ? 'Copy HTML' : 'Copy plain text'}
            </CopyButton>
          </div>

          {view === 'preview' ? (
            <iframe
              title={`Rendered preview: ${email.subject}`}
              srcDoc={html}
              sandbox=""
              className="h-[640px] w-full rounded-md border border-border bg-canvas"
            />
          ) : (
            <pre className="max-h-[640px] overflow-auto rounded-md border border-border bg-inset p-4 font-mono text-body-sm leading-relaxed text-fg-muted">
              <code>{body}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}

export const WarmupSection = () => {
  const everything = React.useMemo(() => allPlainText(WARMUP), [])

  return (
    <Section
      id="warmup"
      eyebrow="Applied"
      title="Sending-domain warm-up"
      lead="Six emails over 24 days, written to warm a new sending sub-domain rather than to sell anything. Copy is data; the plain-text and HTML bodies render from the same source, so they cannot drift. Both are paste-ready for LC Email."
    >
      <div className="flex flex-col gap-8">
        <Demo label="The ramp — volume, not copy, is what warms a domain">
          <div className="flex flex-col gap-5">
            <p className="max-w-2xl font-body text-body-md text-fg-muted">
              Six emails do not warm a sub-domain on their own. The ramp does. Each window adds a colder slice only
              after the warmer one has opened, replied and not complained.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <caption className="sr-only">
                  The warm-up ramp: window, which emails send, the segment added and the daily cap
                </caption>
                <thead>
                  <tr className="border-b border-border">
                    {['Window', 'Sends', 'Segment added', 'Daily cap'].map((th) => (
                      <th key={th} scope="col" className="py-3 pr-4 font-mono text-caption uppercase tracking-wide text-fg-subtle">
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PLAN.map((row) => (
                    <tr key={row.window} className="border-b border-border last:border-0">
                      <td className="py-3 pr-4 font-body text-body-md text-fg">{row.window}</td>
                      <td className="py-3 pr-4 font-body text-body-md text-fg-muted">{row.sends}</td>
                      <td className="py-3 pr-4 font-body text-body-md text-fg-muted">{row.segment}</td>
                      <td className="py-3 pr-4 font-mono text-body-md tabular-nums text-fg">{row.cap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Demo>

        <Demo label="The rules that sink a new domain">
          <div className="grid gap-6 md:grid-cols-2">
            {RULES.map((r) => (
              <div key={r.title} className="flex flex-col gap-2">
                <h3 className="font-display text-body-lg font-semibold text-fg">{r.title}</h3>
                <p className="font-body text-body-md text-fg-muted">{r.text}</p>
              </div>
            ))}
          </div>
        </Demo>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <MonoLabel tone="subtle" size="sm">
              The sequence — 6 emails over 24 days
            </MonoLabel>
            <CopyButton value={everything}>Copy all six, plain text</CopyButton>
          </div>
          {WARMUP.map((e, i) => (
            <EmailCard key={e.slug} email={e} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </Section>
  )
}
