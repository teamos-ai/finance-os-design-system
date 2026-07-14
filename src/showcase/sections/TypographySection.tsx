import * as React from 'react'
import { Section } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { SegmentedControl } from '@/components/ui/segmented'
import { Inspectable, type InspectData } from '@/components/ui/inspectable'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/cn'

type Row = { token: string; cls: string; spec: string; sample: string }

const DISPLAY: Row[] = [
  { token: 'display-2xl', cls: 'text-display-2xl', spec: '44–72px · 600 · -0.02em', sample: 'Predictable pipeline' },
  { token: 'display-xl', cls: 'text-display-xl', spec: '36–56px · 600 · -0.02em', sample: 'More settlements' },
  { token: 'display-lg', cls: 'text-display-lg', spec: '40px · 600 · -0.015em', sample: 'Less admin' },
  { token: 'display-md', cls: 'text-display-md', spec: '32px · 600', sample: 'The calm operator' },
  { token: 'title-lg', cls: 'text-title-lg', spec: '20px · 600', sample: 'Unified CRM' },
  { token: 'title-md', cls: 'text-title-md', spec: '18px · 600', sample: 'Automated follow-up' },
]

const BODY: Row[] = [
  { token: 'body-lg', cls: 'text-body-lg', spec: '17px · 1.7', sample: 'A broker-specific system that captures every enquiry and follows up instantly.' },
  { token: 'body-md', cls: 'text-body-md', spec: '15px · 1.65', sample: 'It replaces fragmented tools with one dependable operating layer.' },
  { token: 'body-sm', cls: 'text-body-sm', spec: '13px · 1.6', sample: 'Predictable pipeline. More settlements. Less admin.' },
  { token: 'caption', cls: 'text-caption', spec: '12px · 1.4', sample: 'Replaces 8 tools · $297/mo' },
  { token: 'mono-xs', cls: 'text-mono-xs uppercase', spec: '11px · 700 · 0.04em', sample: 'Theme accent · pinned per mode' },
]

const BODY_COPY = `Most brokers don't lose deals because they're bad at their job. They lose them in the gaps — the enquiry that lands at 9pm and gets a reply at noon, the pre-approval that goes quiet, the past client who refinances with someone else because no one followed up.

Finance OS closes those gaps. Every enquiry is captured the moment it arrives, every follow-up fires on time, and every conversation — SMS, email, social — lives in one place. You stay the trusted adviser; the system handles the chase. The result is a pipeline you can actually predict: more settlements, less admin, and a business that runs whether you're in the office or not.`

/** Per-typeface "+" — the font file downloads here; the class tokens live here, not on the page. */
const DISPLAY_INSPECT: InspectData = {
  name: 'Spline Sans — Display',
  explain: 'The display / heading typeface. Weight 600, tight tracking. Carries every heading, figure and hero line.',
  token: DISPLAY.map((r) => `.${r.token}  ·  ${r.spec}`).join('\n'),
  code: "font-family: 'Spline Sans', system-ui, sans-serif;\nfont-weight: 600;",
  download: { filename: 'spline-sans-600.woff2', href: '/fonts/spline-sans-600.woff2' },
}
const BODY_INSPECT: InspectData = {
  name: 'Anonymous Pro — Body & mono',
  explain: 'The body / mono typeface. Carries body copy, captions, labels and the uppercase overline. Weight 400 (700 for labels).',
  token: BODY.map((r) => `.${r.token}  ·  ${r.spec}`).join('\n'),
  code: "font-family: 'Anonymous Pro', ui-monospace, monospace;",
  download: { filename: 'anonymous-pro-400.woff2', href: '/fonts/anonymous-pro-400.woff2' },
}

type ColorKey = 'accent' | 'ink' | 'alt'

/* Heading-colour options are theme-aware. 'accent' = the theme highlight, 'ink' = neutral
   (white on dark, black on light/paper), 'alt' = the cross-accent. All AA(-large) for the
   display specimens. Classes appear here as string literals so Tailwind keeps them. */
const THEME_COLORS: Record<string, { accent: string; ink: string; alt: string; altCls: string }> = {
  dark: { accent: 'Orange', ink: 'White', alt: 'Blue', altCls: 'text-brand' },
  light: { accent: 'Blue', ink: 'Black', alt: 'Orange', altCls: 'text-amber-text' },
  paper: { accent: 'Amber', ink: 'Black', alt: 'Blue', altCls: 'text-brand' },
}

export function TypographySection() {
  const { theme } = useTheme()
  const [color, setColor] = React.useState<ColorKey>('accent')
  const opts = THEME_COLORS[theme] ?? THEME_COLORS.dark
  const colorClass = color === 'accent' ? 'text-highlight' : color === 'ink' ? 'text-fg' : opts.altCls

  return (
    <Section
      id="typography"
      eyebrow="06 — Typography"
      title="Typography"
      lead="Spline Sans carries every heading and figure; Anonymous Pro carries body, captions and the mono overline. Toggle the heading colour — each theme offers its accent, a neutral ink, and a cross-accent (e.g. orange · white · blue in dark). Switch the theme (top-right) to see the options change."
    >
      <div className="space-y-8">
        {/* heading colour toggle — theme-aware options */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface px-5 py-4">
          <MonoLabel tone="subtle">Heading colour · per theme</MonoLabel>
          <SegmentedControl
            aria-label="Heading colour"
            value={color}
            onValueChange={(v) => setColor(v as ColorKey)}
            size="sm"
            options={[
              { value: 'accent', label: opts.accent },
              { value: 'ink', label: opts.ink },
              { value: 'alt', label: opts.alt },
            ]}
          />
        </div>

        {/* display specimens — coloured by the toggle */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <MonoLabel tone="accent" dot>Display · Spline Sans</MonoLabel>
          </div>
          <Inspectable {...DISPLAY_INSPECT}>
          <div className="divide-y divide-border-subtle rounded-lg border border-border bg-surface">
            {DISPLAY.map((r) => (
              <div key={r.token} className="grid grid-cols-1 gap-3 px-5 py-5 md:grid-cols-[160px_1fr] md:items-baseline">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-caption text-fg-subtle">{r.spec}</span>
                </div>
                <p className={cn('font-display transition-colors duration-base', r.cls, colorClass)}>{r.sample}</p>
              </div>
            ))}
          </div>
          </Inspectable>
        </div>

        {/* body specimens */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <MonoLabel tone="subtle">Body &amp; mono · Anonymous Pro</MonoLabel>
          </div>
          <Inspectable {...BODY_INSPECT}>
          <div className="divide-y divide-border-subtle rounded-lg border border-border bg-surface">
            {BODY.map((r) => (
              <div key={r.token} className="grid grid-cols-1 gap-3 px-5 py-5 md:grid-cols-[160px_1fr] md:items-baseline">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-caption text-fg-subtle">{r.spec}</span>
                </div>
                <p className={cn('font-body text-fg', r.cls)}>{r.sample}</p>
              </div>
            ))}
          </div>
          </Inspectable>
        </div>

        {/* full body copy specimen */}
        <div className="rounded-lg border border-border bg-surface p-6 md:p-8">
          <MonoLabel tone="subtle">Body copy · a full paragraph</MonoLabel>
          <div className="mt-4 max-w-2xl space-y-4">
            {BODY_COPY.split('\n\n').map((para, i) => (
              <p key={i} className="font-body text-body-md leading-relaxed text-fg-muted">{para}</p>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <MonoLabel tone="subtle">Pairing rules</MonoLabel>
          <ul className="mt-4 grid gap-2 font-body text-body-sm text-fg-muted sm:grid-cols-2">
            <li>• Headings &amp; figures → Spline Sans, tight tracking.</li>
            <li>• Body, captions, labels → Anonymous Pro.</li>
            <li>• Overlines → uppercase mono with a tone dot.</li>
            <li>• Numerics → tabular-nums for stats &amp; tables.</li>
          </ul>
        </div>
      </div>
    </Section>
  )
}
