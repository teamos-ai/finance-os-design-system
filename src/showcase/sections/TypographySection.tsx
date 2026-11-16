import * as React from 'react'
import { Section } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { TokenTag } from '@/components/ui/token-tag'
import { SegmentedControl } from '@/components/ui/segmented'
import { Inspectable, type InspectData } from '@/components/ui/inspectable'
import { DownloadFolder } from '@/components/brand/DownloadFolder'
import { cn } from '@/lib/cn'

/**
 * Typography — two families, three roles, stated explicitly (17 Nov design review).
 *   · Headings — Spline Sans
 *   · Body paragraphs — Spline Sans
 *   · Utility (overline · mono labels · tags · counts) — Anonymous Pro
 * Every specimen names its role, family, size, weight and line height INLINE, beside the example, so a
 * builder can identify the font without opening the inspector. Each family is also downloadable as a
 * folder. (Correcting the earlier copy, which wrongly credited body paragraphs to Anonymous Pro.)
 */

/** `hl` = the single word that carries the Atlas-Blue highlight in the default "Mixed" heading
 *  pattern (the rest of the line stays ink) — the hero-H1 treatment used across the site. */
type Row = { token: string; cls: string; spec: string; sample: string; hl?: string }

/** Headings — Spline Sans (font-display), weight 600, tight tracking. */
const HEADINGS: Row[] = [
  { token: 'display-2xl', cls: 'text-display-2xl', spec: '44–72px · 600 · lh 1.04 · -0.02em', sample: 'Predictable pipeline', hl: 'Predictable' },
  { token: 'display-xl', cls: 'text-display-xl', spec: '36–56px · 600 · lh 1.07 · -0.02em', sample: 'More settlements', hl: 'settlements' },
  { token: 'display-lg', cls: 'text-display-lg', spec: '40px · 600 · lh 1.1 · -0.015em', sample: 'Less admin', hl: 'Less' },
  { token: 'display-md', cls: 'text-display-md', spec: '32px · 600 · lh 1.15', sample: 'The calm operator', hl: 'calm' },
  { token: 'title-lg', cls: 'text-title-lg', spec: '20px · 600 · lh 1.3', sample: 'Unified CRM', hl: 'Unified' },
  { token: 'title-md', cls: 'text-title-md', spec: '18px · 600 · lh 1.4', sample: 'Automated follow-up', hl: 'Automated' },
]

/** Body paragraphs — Spline Sans (font-body), weight 400. */
const BODY: Row[] = [
  { token: 'body-lg', cls: 'text-body-lg', spec: '17px · 400 · lh 1.7', sample: 'A broker-specific system that captures every enquiry and follows up instantly.' },
  { token: 'body-md', cls: 'text-body-md', spec: '15px · 400 · lh 1.65', sample: 'It replaces fragmented tools with one dependable operating layer.' },
  { token: 'body-sm', cls: 'text-body-sm', spec: '13px · 400 · lh 1.6', sample: 'Predictable pipeline. More settlements. Less admin.' },
  { token: 'caption', cls: 'text-caption', spec: '12px · 400 · lh 1.4', sample: 'Captions and helper text sit a step down from body.' },
]

/** Utility — Anonymous Pro (font-mono): the uppercase overline, mono labels and figures. */
const UTILITY: Row[] = [
  { token: 'mono-xs', cls: 'text-mono-xs uppercase', spec: '11px · 700 · lh 1.3 · 0.04em', sample: 'Theme accent · pinned per mode' },
  { token: 'mono-2xs', cls: 'text-mono-2xs uppercase', spec: '11px · 700 · lh 1.3 · 0.04em', sample: 'Composed from · tokens' },
  { token: 'tabular-nums', cls: 'text-body-sm tabular-nums', spec: 'lining figures · stats, counts & tables', sample: '126,941 · $829,320 · 4.9/5' },
]

const BODY_COPY = `Most brokers don't lose deals because they're bad at their job. They lose them in the gaps — the enquiry that lands at 9pm and gets a reply at noon, the pre-approval that goes quiet, the past client who refinances with someone else because no one followed up.

Finance OS closes those gaps. Every enquiry is captured the moment it arrives, every follow-up fires on time, and every conversation — SMS, email, social — lives in one place. You stay the trusted adviser; the system handles the chase. The result is a pipeline you can actually predict: more settlements, less admin, and a business that runs whether you're in the office or not.`

const HEADINGS_INSPECT: InspectData = {
  name: 'Headings — Spline Sans',
  explain: 'Spline Sans at weight 600 with tight tracking carries every heading, figure and hero line. The Mixed default keeps the line ink with one Atlas-Blue keyword.',
  token: ['family  font-display  ·  Spline Sans  ·  weight 600', ...HEADINGS.map((r) => `.${r.token}  ·  ${r.spec}`)].join('\n'),
  code: "font-family: 'Spline Sans', system-ui, sans-serif;\nfont-weight: 600;",
  download: { filename: 'spline-sans.zip', href: '/packs/spline-sans.zip' },
}
const BODY_INSPECT: InspectData = {
  name: 'Body paragraphs — Spline Sans',
  explain: 'Spline Sans also carries body copy and captions, at weight 400. One family across headings and body keeps the voice consistent; Anonymous Pro is reserved for utility typography only.',
  token: ['family  font-body  ·  Spline Sans  ·  weight 400', ...BODY.map((r) => `.${r.token}  ·  ${r.spec}`)].join('\n'),
  code: "font-family: 'Spline Sans', system-ui, sans-serif;\nfont-weight: 400;",
  download: { filename: 'spline-sans.zip', href: '/packs/spline-sans.zip' },
}
const UTILITY_INSPECT: InspectData = {
  name: 'Utility — Anonymous Pro',
  explain: 'Anonymous Pro is the utility voice: the uppercase overline, mono labels, tags (TokenTag, MonoLabel) and counts. It never carries headings or body paragraphs.',
  token: ['family  font-mono  ·  Anonymous Pro', ...UTILITY.map((r) => `.${r.token}  ·  ${r.spec}`)].join('\n'),
  code: "font-family: 'Anonymous Pro', ui-monospace, monospace;",
  download: { filename: 'anonymous-pro.zip', href: '/packs/anonymous-pro.zip' },
}

type ColorKey = 'mixed' | 'accent' | 'ink'

/* Heading-colour options. 'mixed' (default) = ink with one Atlas-Blue keyword — the hero-H1
   pattern; 'accent' = all Atlas Blue; 'ink' = all neutral black. Classes appear as string
   literals so Tailwind keeps them. */
const HEADING_COLORS: Record<ColorKey, string> = { mixed: 'Mixed', accent: 'Blue', ink: 'Black' }

/** Render a heading sample in the active mode: Mixed = ink line with one `text-highlight` word
 *  (the default), Blue = all `text-highlight`, Black = all `text-fg`. */
function HeadingText({ r, mode }: { r: Row; mode: ColorKey }) {
  const base = 'font-display transition-colors duration-base'
  if (mode === 'mixed' && r.hl && r.sample.includes(r.hl)) {
    const i = r.sample.indexOf(r.hl)
    return (
      <p className={cn(base, r.cls, 'text-fg')}>
        {r.sample.slice(0, i)}
        <span className="text-highlight">{r.hl}</span>
        {r.sample.slice(i + r.hl.length)}
      </p>
    )
  }
  return <p className={cn(base, r.cls, mode === 'accent' ? 'text-highlight' : 'text-fg')}>{r.sample}</p>
}

/** The shared specimen row: the token + its spec on the left, the live sample on the right. */
function SpecimenRow({ r, children }: { r: Row; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-3 px-5 py-5 md:grid-cols-[180px_1fr] md:items-baseline">
      <div className="flex flex-col items-start gap-1.5">
        <TokenTag>{r.cls}</TokenTag>
        <span className="font-mono text-caption text-fg-subtle">{r.spec}</span>
      </div>
      {children}
    </div>
  )
}

/** A group header: ROLE — FAMILY, with the family utility named inline as a TokenTag. */
function GroupHead({ role, family, familyClass, accent }: { role: string; family: string; familyClass: string; accent?: boolean }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <MonoLabel tone={accent ? 'accent' : 'subtle'} dot={accent}>
        {role} · {family}
      </MonoLabel>
      <TokenTag title="font-family utility">{familyClass}</TokenTag>
    </div>
  )
}

export function TypographySection() {
  const [color, setColor] = React.useState<ColorKey>('mixed')
  const opts = HEADING_COLORS

  return (
    <Section
      id="typography"
      eyebrow="Typography"
      title="Typography"
      lead="Two families, three roles. Spline Sans carries every heading AND every body paragraph; Anonymous Pro is the utility voice — the uppercase overline, mono labels, tags and counts. The default Mixed heading keeps the line ink with one Atlas-Blue keyword — the hero-H1 pattern — or switch it to all Blue or all Black."
    >
      <div className="space-y-8">
        {/* heading colour toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface px-5 py-4">
          <MonoLabel tone="subtle">Heading colour</MonoLabel>
          <div className="flex flex-wrap items-center gap-3">
            {color === 'mixed' ? (
              <span className="flex items-center gap-1.5">
                <TokenTag title="heading base">text-fg</TokenTag>
                <TokenTag title="highlighted keyword">text-highlight</TokenTag>
              </span>
            ) : (
              <TokenTag title="active heading-colour token">{color === 'accent' ? 'text-highlight' : 'text-fg'}</TokenTag>
            )}
            <SegmentedControl
              aria-label="Heading colour"
              value={color}
              onValueChange={(v) => setColor(v as ColorKey)}
              size="sm"
              options={[
                { value: 'mixed', label: opts.mixed },
                { value: 'accent', label: opts.accent },
                { value: 'ink', label: opts.ink },
              ]}
            />
          </div>
        </div>

        {/* 1 — Headings · Spline Sans */}
        <div>
          <GroupHead role="Headings" family="Spline Sans" familyClass="font-display" accent />
          <Inspectable {...HEADINGS_INSPECT}>
            <div className="divide-y divide-border-subtle rounded-lg border border-border bg-surface">
              {HEADINGS.map((r) => (
                <SpecimenRow key={r.token} r={r}>
                  <HeadingText r={r} mode={color} />
                </SpecimenRow>
              ))}
            </div>
          </Inspectable>
        </div>

        {/* 2 — Body paragraphs · Spline Sans */}
        <div>
          <GroupHead role="Body paragraphs" family="Spline Sans" familyClass="font-body" />
          <Inspectable {...BODY_INSPECT}>
            <div className="divide-y divide-border-subtle rounded-lg border border-border bg-surface">
              {BODY.map((r) => (
                <SpecimenRow key={r.token} r={r}>
                  <p className={cn('font-body text-fg', r.cls)}>{r.sample}</p>
                </SpecimenRow>
              ))}
            </div>
          </Inspectable>
        </div>

        {/* full body copy specimen — an actual paragraph, in Spline Sans */}
        <div className="rounded-lg border border-border bg-surface p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <MonoLabel tone="subtle">Body copy · a full paragraph · Spline Sans</MonoLabel>
            <TokenTag title="utility class">text-body-md</TokenTag>
          </div>
          <div className="mt-4 max-w-2xl space-y-4">
            {BODY_COPY.split('\n\n').map((para, i) => (
              <p key={i} className="font-body text-body-md leading-relaxed text-fg-muted">{para}</p>
            ))}
          </div>
        </div>

        {/* 3 — Utility · Anonymous Pro */}
        <div>
          <GroupHead role="Utility" family="Anonymous Pro" familyClass="font-mono" />
          <Inspectable {...UTILITY_INSPECT}>
            <div className="divide-y divide-border-subtle rounded-lg border border-border bg-surface">
              {UTILITY.map((r) => (
                <SpecimenRow key={r.token} r={r}>
                  <p className={cn('font-mono text-fg', r.cls)}>{r.sample}</p>
                </SpecimenRow>
              ))}
              {/* in context — the real utility components, so their font is verifiable by eye */}
              <div className="grid grid-cols-1 gap-3 px-5 py-5 md:grid-cols-[180px_1fr] md:items-center">
                <span className="font-mono text-caption text-fg-subtle">in context</span>
                <div className="flex flex-wrap items-center gap-3">
                  <MonoLabel tone="accent" dot>Overline</MonoLabel>
                  <TokenTag>text-highlight</TokenTag>
                  <span className="font-mono text-body-sm tabular-nums text-fg">$74,298.50</span>
                </div>
              </div>
            </div>
          </Inspectable>
        </div>

        {/* download the fonts — each family a folder; press to open, press again to save the ZIP */}
        <div className="rounded-lg border border-border bg-surface p-6 md:p-8">
          <div className="flex flex-col gap-2">
            <MonoLabel tone="subtle">Download the fonts</MonoLabel>
            <p className="max-w-2xl font-body text-body-sm leading-relaxed text-fg-muted">
              Both families as a folder, not a button — press to open and see what is inside, press again to save
              the <span className="font-mono text-mono-2xs">.zip</span>. Each archive keeps the font files and the
              family&rsquo;s OFL licence.
            </p>
          </div>
          <div className="mt-6 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            <DownloadFolder
              label="Spline Sans"
              meta="variable + 5 weights · OFL"
              filename="spline-sans.zip"
              href="/packs/spline-sans.zip"
              width={286}
              art="atlas"
              seed={3}
              files={[
                { name: 'Variable font', meta: 'wght 300–700', art: 'mist' },
                { name: 'static', meta: '5 weights' },
                { name: 'OFL.txt', meta: 'licence' },
              ]}
              caption={
                <p className="max-w-xs font-body text-caption leading-relaxed text-fg-subtle">
                  Headings &amp; body. Variable font plus static Light–Bold. Self-hosted via @fontsource in the app.
                </p>
              }
            />
            <DownloadFolder
              label="Anonymous Pro"
              meta="4 styles · OFL"
              filename="anonymous-pro.zip"
              href="/packs/anonymous-pro.zip"
              width={286}
              art="tide"
              seed={11}
              files={[
                { name: 'Regular + Bold', meta: '.ttf', art: 'mist' },
                { name: 'Italic + Bold Italic', meta: '.ttf' },
                { name: 'OFL.txt', meta: 'licence' },
              ]}
              caption={
                <p className="max-w-xs font-body text-caption leading-relaxed text-fg-subtle">
                  Utility only — overline, mono labels, tags and counts. Regular, Bold, Italic and Bold Italic.
                </p>
              }
            />
          </div>
        </div>

        {/* pairing rules — corrected roles */}
        <div className="rounded-lg border border-border bg-surface p-6">
          <MonoLabel tone="subtle">Pairing rules</MonoLabel>
          <ul className="mt-4 grid gap-2 font-body text-body-sm text-fg-muted sm:grid-cols-2">
            <li>• Headings &amp; figures → Spline Sans, tight tracking.</li>
            <li>• Body &amp; captions → Spline Sans, weight 400.</li>
            <li>• Overlines, labels, tags, counts → Anonymous Pro.</li>
            <li>• Numerics → tabular-nums for stats &amp; tables.</li>
          </ul>
        </div>
      </div>
    </Section>
  )
}
