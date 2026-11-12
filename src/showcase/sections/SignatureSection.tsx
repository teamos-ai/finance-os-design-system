/**
 * SignatureSection — the broker email signature, built from one model. A small builder (name,
 * role, direct line, email) feeds a live preview and the paste-ready, email-safe HTML behind it,
 * across three layouts. Pairs with Client Emails + the Domain Warm-up.
 *
 * Budgets: the one Atlas Blue moment is the signature's own contact links; the section chrome
 * stays quiet (neutral icon wells, subtle labels). No amber — a signature carries no status.
 * Motion is motivated: switching layout cross-fades the preview (static cue = the segmented
 * control's active state); typing updates the same block with no re-animation. Reduced-motion
 * safe, figures are tabular, every control has active:scale + focus-visible.
 */
import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Copy, Check, Table2, Type, ImageUp, ShieldCheck, Reply, Feather } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { Input } from '@/components/ui/input'
import { SegmentedControl } from '@/components/ui/segmented'
import { Button } from '@/components/ui/button'
import { MonoLabel } from '@/components/ui/mono-label'
import { SignaturePreview } from '@/components/signature/SignaturePreview'
import {
  signatureFragment,
  signaturePlainText,
  signatureDocument,
  SAMPLE,
  type SignatureData,
  type SignatureVariant,
} from '@/components/signature/signature'
import { copyText } from '@/lib/utils'
import { EASE_OUT } from '@/lib/motion'

/** How long the "Copied" label and its live announcement hold. Not a motion duration. */
const COPIED_RESET_MS = 1200
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type View = 'preview' | 'html' | 'text'

const LAYOUTS: { value: SignatureVariant; label: string }[] = [
  { value: 'mark', label: 'Mark' },
  { value: 'lockup', label: 'Lockup' },
  { value: 'minimal', label: 'Minimal' },
]

const VIEWS: { value: View; label: string }[] = [
  { value: 'preview', label: 'Preview' },
  { value: 'html', label: 'HTML' },
  { value: 'text', label: 'Plain text' },
]

const LAYOUT_NOTE: Record<SignatureVariant, string> = {
  mark: 'Square mark beside your name — the default for a live thread.',
  lockup: 'The full Finance OS lockup on top — for a first introduction.',
  minimal: 'Image-free wordmark — survives reply chains and strict filters.',
}

const NOTES: { Icon: typeof Table2; title: string; body: string }[] = [
  {
    Icon: Table2,
    title: 'Tables, not layout CSS',
    body: 'Mail clients have no flex or grid, so the block is one table with inline styles — it lands the same in Gmail, Outlook and Apple Mail.',
  },
  {
    Icon: Type,
    title: 'Hex and web-safe type',
    body: 'CSS variables and web fonts do not survive a paste, so colours are the token hex and Spline Sans / Anonymous Pro fall back to Arial.',
  },
  {
    Icon: ImageUp,
    title: 'Host the mark yourself',
    body: 'Email cannot read a relative path. The logo is an absolute URL you point at your own hosted copy of the Finance OS mark.',
  },
  {
    Icon: ShieldCheck,
    title: 'Regulated details stay merge fields',
    body: 'The ACR number, aggregator and ACL are yours to fill from your licensee. The template asserts nothing about your authorisation and invents no number.',
  },
  {
    Icon: Reply,
    title: 'An image-free fallback',
    body: 'The Minimal layout drops the logo for reply chains and strict filters, keeping the wordmark as text so nothing breaks mid-thread.',
  },
  {
    Icon: Feather,
    title: 'Light and quiet',
    body: 'No tracking pixel, no background image, a few kilobytes of markup — nothing that weighs on a thread or trips a spam filter.',
  },
]

/** CopyButton — ghost, swaps its own label for a beat and announces the swap to a screen reader. */
function CopyButton({ value, children }: { value: string; children: React.ReactNode }) {
  const [copied, setCopied] = React.useState(false)
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="active:scale-[0.96]"
        leadingIcon={
          copied ? (
            <Check className="h-4 w-4 text-success" strokeWidth={2.5} aria-hidden />
          ) : (
            <Copy className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          )
        }
        onClick={async () => {
          if (await copyText(value)) {
            setCopied(true)
            setTimeout(() => setCopied(false), COPIED_RESET_MS)
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

export function SignatureSection() {
  const [variant, setVariant] = React.useState<SignatureVariant>('mark')
  const [view, setView] = React.useState<View>('preview')
  const [data, setData] = React.useState<SignatureData>(SAMPLE)
  const reduced = useReducedMotion()

  const emailInvalid = data.email.trim() !== '' && !EMAIL_RE.test(data.email.trim())

  const html = React.useMemo(() => signatureFragment(data, variant), [data, variant])
  const text = React.useMemo(() => signaturePlainText(data), [data])
  const doc = React.useMemo(() => signatureDocument(data, variant), [data, variant])
  const kb = React.useMemo(() => new Blob([html]).size / 1024, [html])

  const set =
    (key: keyof SignatureData) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setData((d) => ({ ...d, [key]: e.target.value }))

  const inspect = {
    name: 'Email signature',
    explain:
      'The broker sign-off as one model rendered two ways: the live block here, and the email-safe HTML a broker pastes into Gmail or Outlook. Table layout with inline styles (mail has no flex, grid or CSS variables), Arial fallback for the brand fonts, one Atlas Blue accent on the links, and the real mark by absolute URL. Regulated identifiers stay merge fields for the broker’s own licensee — the template invents no number.',
    token:
      '--c-surface · --c-fg · --c-fg-muted · --c-fg-subtle · --c-accent-text (links) · --c-border (rules) · --radius-lg\nmail hex mirrors tokens.css — fg #14161B · body #474E5C · meta #646C7D · accent #33488F · line #E6E8EC',
    code: `import { SignaturePreview } from '@/components/signature/SignaturePreview'\nimport { signatureFragment, SAMPLE } from '@/components/signature/signature'\n\n<SignaturePreview data={SAMPLE} variant="mark" />\n\n// the paste-ready, email-safe artefact\nconst html = signatureFragment(SAMPLE, 'mark')`,
    download: { filename: 'finance-os-email-signature.html', content: doc, mime: 'text/html' },
  }

  return (
    <Section
      id="email-signature"
      eyebrow="Email Signature"
      title="Email signature"
      lead="A broker’s sign-off, kept on-brand and built from one model: the live block here and the email-safe HTML behind it. Table layout and inline styles so it survives Gmail and Outlook, the real mark, one Atlas Blue accent on the links, and the regulated details left as merge fields for the broker’s own licensee."
    >
      <div className="flex flex-col gap-8">
        {/* The builder — type your details, switch layout, copy the HTML. */}
        <Demo label="Signature builder — type your details, copy the HTML" inspect={inspect}>
          <div className="grid gap-8 md:grid-cols-2 md:gap-10">
            {/* details + layout */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <MonoLabel tone="subtle" size="sm">
                  Your details
                </MonoLabel>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Name" value={data.name} onChange={set('name')} autoComplete="off" />
                  <Input label="Role" value={data.role} onChange={set('role')} autoComplete="off" />
                  <Input
                    label="Direct line"
                    value={data.phone}
                    onChange={set('phone')}
                    placeholder="e.g. +61 3 7010 0100"
                    inputMode="tel"
                    autoComplete="off"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={data.email}
                    onChange={set('email')}
                    error={emailInvalid ? 'Enter a valid email address' : undefined}
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <MonoLabel tone="subtle" size="sm">
                  Layout
                </MonoLabel>
                <SegmentedControl
                  aria-label="Signature layout"
                  options={LAYOUTS}
                  value={variant}
                  onValueChange={setVariant}
                />
                <p className="font-body text-body-sm text-fg-subtle">{LAYOUT_NOTE[variant]}</p>
              </div>
            </div>

            {/* output — preview / html / plain text */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <MonoLabel tone="subtle" size="sm">
                  As it arrives
                </MonoLabel>
                <SegmentedControl
                  size="sm"
                  aria-label="Output format"
                  options={VIEWS}
                  value={view}
                  onValueChange={setView}
                />
              </div>

              {view === 'preview' ? (
                <div className="rounded-md border border-border bg-inset p-6 md:p-8">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={variant}
                      initial={reduced ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.22, ease: EASE_OUT }}
                    >
                      <SignaturePreview data={data} variant={variant} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : (
                <pre className="max-h-[22rem] overflow-auto rounded-md border border-border bg-inset p-4 font-mono text-body-sm leading-relaxed text-fg-muted">
                  <code>{view === 'html' ? html : text}</code>
                </pre>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-caption tabular-nums text-fg-subtle">
                  {kb.toFixed(1)} KB · no tracking pixel
                </span>
                <div className="flex flex-wrap gap-2.5">
                  <CopyButton value={html}>Copy HTML</CopyButton>
                  <CopyButton value={text}>Copy plain text</CopyButton>
                </div>
              </div>
            </div>
          </div>
        </Demo>

        {/* Why it is built the way it is — the inbox constraints the block answers to. */}
        <Demo label="Built for the inbox">
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {NOTES.map((n) => (
              <div key={n.title} className="flex gap-3.5">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md border border-border bg-surface text-fg-subtle">
                  <n.Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-title-sm text-fg">{n.title}</h3>
                  <p className="mt-1 font-body text-body-sm leading-relaxed text-fg-muted">{n.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Demo>
      </div>
    </Section>
  )
}
