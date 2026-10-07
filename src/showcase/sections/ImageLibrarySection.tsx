/**
 * ImageLibrarySection — the visual language. ImageWash tiles carry the image-wash +
 * gradient-overlay tokens across the four reference aspect ratios; a gradient-overlay-over-
 * image pattern shows how copy sits on a photo; an approved / forbidden pair fixes the
 * direction; a closing note covers how images behave per theme. Calm, broker-grade.
 *
 * Self-contained: the wash CSS strings are documented signature-gradient + glow draughts
 * built only from the locked blue/navy family (rgba allowed inside a documented glow).
 */
import { Building2, LineChart, Handshake, ShieldCheck, Check, X } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { ImageWash } from '@/components/ui/image-wash'
import { Inspectable, type InspectData } from '@/components/ui/inspectable'
import { AuroraBackground, type AuroraTone } from '@/components/ui/aurora-background'

const OVERLAY_INSPECT: InspectData = {
  name: 'Gradient overlay',
  explain: 'Text never sits on bare photography. A single bottom-anchored scrim guarantees contrast and keeps the eye on the headline. One accent overline max, never a second gradient.',
  token: 'bottom-up scrim · inverse-fg copy',
  code: 'background: linear-gradient(to top, rgba(8,12,18,0.88) 0%, transparent 55%);',
  download: { filename: 'image-overlay.css', content: '.image-scrim {\n  background: linear-gradient(to top, rgba(8,12,18,0.88) 0%, transparent 55%);\n}', mime: 'text/css' },
}

/** Pixel-art backgrounds — production WEBP, tagged for website backdrops. Grouped by kind. */
interface Bg {
  id: string
  label: string
  note: string
}
const BG_GROUPS: ReadonlyArray<{ group: string; blurb: string; items: Bg[] }> = [
  {
    group: 'Scenes',
    blurb: 'Full pixel-art landscapes — section heroes and feature panels.',
    items: [
      { id: 'still-waters', label: 'Still Waters', note: 'lake · central peak' },
      { id: 'dense-range', label: 'Dense Range', note: 'dithered ridgeline' },
      { id: 'river-valley', label: 'River Valley', note: 'valley · winding river' },
      { id: 'rolling-mist', label: 'Rolling Mist', note: 'soft haze layers' },
    ],
  },
  {
    group: 'Horizons',
    blurb: 'Faded ridgelines dissolving into white — calm backdrops that leave room for copy.',
    items: [
      { id: 'mist-pale', label: 'Pale', note: 'pale haze → white' },
      { id: 'mist-sky', label: 'Sky', note: 'sky blue → white' },
      { id: 'mist-blue', label: 'Blue', note: 'blue haze → white' },
      { id: 'mist-navy', label: 'Navy', note: 'navy haze → white' },
    ],
  },
  {
    group: 'Washes',
    blurb: 'Plain vertical gradients fading to white — the quietest backdrop, including two neutral greys.',
    items: [
      { id: 'wash-pale', label: 'Pale', note: 'pale blue → white' },
      { id: 'wash-sky', label: 'Sky', note: 'sky blue → white' },
      { id: 'wash-blue', label: 'Blue', note: 'blue → white' },
      { id: 'wash-navy', label: 'Navy', note: 'navy → white' },
      { id: 'wash-stone', label: 'Stone', note: 'grey #EDEFF2 → white' },
      { id: 'wash-cloud', label: 'Cloud', note: 'grey #F6F7F9 → white' },
    ],
  },
]

/** Each background tile carries its own inspector: a real .webp download. */
function backgroundInspect(b: Bg): InspectData {
  const file = `/images/backgrounds/${b.id}.webp`
  return {
    name: b.label,
    explain:
      'A production-grade pixel-art background in the Atlas Blue palette, for section and hero backdrops. High-resolution WEBP — drop it behind content and add the bottom-up scrim (17.3) whenever copy sits on top.',
    token: 'WEBP · 16/9 · Atlas Blue palette',
    code: `<div className="relative aspect-[16/9] overflow-hidden rounded-md border border-border">\n  <img src="${file}" alt="${b.label}" className="absolute inset-0 h-full w-full object-cover" />\n</div>`,
    download: { filename: `bg-${b.id}.webp`, href: file },
  }
}

/** Aurora backgrounds — the live animated component, two blue + two grey tones. */
const AURORA_TONES: ReadonlyArray<{ tone: AuroraTone; label: string; note: string }> = [
  { tone: 'blue', label: 'Blue', note: 'Atlas Blue aurora' },
  { tone: 'sky', label: 'Sky', note: 'pale blue aurora' },
  { tone: 'slate', label: 'Slate', note: 'neutral grey aurora' },
  { tone: 'mist', label: 'Mist', note: 'pale grey aurora' },
]

function auroraInspect(a: (typeof AURORA_TONES)[number]): InspectData {
  return {
    name: `Aurora — ${a.label}`,
    explain:
      'Animated aurora light-columns drifting over the white canvas — a full-bleed section or hero backdrop that sits behind content. Colours are tokenised (blue ramp / neutral ramp); the 60s drift freezes under prefers-reduced-motion.',
    token: `AuroraBackground · tone="${a.tone}" · animate-aurora 60s`,
    code: `import { AuroraBackground } from '@/components/ui/aurora-background'\n\n<AuroraBackground tone="${a.tone}" className="h-screen">\n  {/* hero content */}\n</AuroraBackground>`,
    download: {
      filename: `aurora-${a.tone}.tsx`,
      content: `<AuroraBackground tone="${a.tone}" className="h-screen">\n  {/* hero content */}\n</AuroraBackground>\n`,
      mime: 'text/plain',
    },
  }
}

/** Aspect-ratio frames the system ships against — each a draft wash standing in for a shoot. */
const FRAMES: ReadonlyArray<{
  ratio: string
  label: string
  note: string
  background: string
  dark?: boolean
}> = [
  {
    ratio: '16/9',
    label: 'Hero & banner',
    note: '16 / 9 · Atlas Blue glow',
    background:
      'radial-gradient(120% 140% at 0% 0%, rgba(51,72,143,0.20), transparent 60%), linear-gradient(135deg, #1b2433, #0e131c)',
    dark: true,
  },
  {
    ratio: '4/3',
    label: 'Card media',
    note: '4 / 3 · blue wash',
    background:
      'radial-gradient(120% 120% at 100% 0%, rgba(51,72,143,0.18), transparent 55%), linear-gradient(135deg, #EEF2F9, #E2E8F2)',
  },
  {
    ratio: '1/1',
    label: 'Avatar & tile',
    note: '1 / 1 · navy depth',
    background:
      'radial-gradient(110% 110% at 50% 0%, rgba(51,72,143,0.16), transparent 60%), linear-gradient(160deg, #182233, #0c111a)',
    dark: true,
  },
  {
    ratio: '3/4',
    label: 'Portrait',
    note: '3 / 4 · paper warmth',
    background:
      'radial-gradient(120% 120% at 0% 100%, rgba(51,72,143,0.14), transparent 55%), linear-gradient(200deg, #F1F4FA, #E2E8F2)',
  },
]

/** The single overlay recipe used whenever copy must sit on a photo. */
const OVERLAY =
  'linear-gradient(to top, rgba(8,12,18,0.88) 0%, rgba(8,12,18,0.45) 45%, rgba(8,12,18,0) 100%)'

/** The photo standing under the overlay in the live demo (a calm navy draught, not stock). */
const PHOTO = 'linear-gradient(135deg, #233044, #11161f 70%)'

export function ImageLibrarySection() {
  return (
    <Section
      id="imagery"
      eyebrow="17 - Image Library"
      title="Image Library"
      lead="The visual language. Photography is calm, real and considered — advisors at work, not stock smiles. Backgrounds are production-grade pixel-art WEBP in the Atlas Blue palette. Until shoots land, washes from the same blue-navy family stand in. Every frame rounds to rounded-md and rests on a hairline border."
    >
      {/* Backgrounds — pixel-art website backdrops (WEBP) */}
      <div className="mb-14">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <MonoLabel number="17.1" dot>
            Backgrounds
          </MonoLabel>
          <span className="font-mono text-caption text-fg-subtle">WEBP + live aurora · website use</span>
        </div>
        <p className="mb-8 max-w-2xl font-body text-body-md leading-relaxed text-fg-muted">
          Backdrops for sections and heroes — drawn from the Atlas Blue palette. Four weights: full{' '}
          <span className="text-fg">Scenes</span>, faded <span className="text-fg">Horizons</span>, plain{' '}
          <span className="text-fg">Washes</span> (all high-resolution WEBP), and a live, animated{' '}
          <span className="text-fg">Aurora</span> component. Pair with the bottom-up scrim (17.3) whenever copy
          sits on top. Open any tile’s <span className="font-mono text-caption">+</span> to download the asset or
          its usage snippet.
        </p>
        {BG_GROUPS.map((g) => (
          <div key={g.group} className="mb-9 last:mb-0">
            <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-caption font-bold uppercase tracking-[0.1em] text-fg">
                {g.group}
              </span>
              <span className="font-body text-body-sm text-fg-muted">{g.blurb}</span>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {g.items.map((b) => (
                <div key={b.id}>
                  <Inspectable {...backgroundInspect(b)}>
                    <div className="overflow-hidden rounded-md border border-border shadow-md">
                      <div className="relative aspect-[16/9]">
                        <img
                          src={`/images/backgrounds/${b.id}.webp`}
                          alt={`${b.label} — ${g.group} background`}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </Inspectable>
                  <div className="mt-2 flex items-baseline justify-between gap-2">
                    <span className="font-display text-body-md font-medium text-fg">{b.label}</span>
                    <span className="font-mono text-caption text-fg-subtle">{b.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* Aurora — the live animated component (2 blue + 2 grey tones) */}
        <div className="mb-9">
          <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-caption font-bold uppercase tracking-[0.1em] text-fg">
              Aurora
            </span>
            <span className="font-body text-body-sm text-fg-muted">
              Live light-columns (a component, not an image) — drifts gently, freezes under reduced-motion.
            </span>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {AURORA_TONES.map((a) => (
              <div key={a.tone}>
                <Inspectable {...auroraInspect(a)}>
                  <div className="overflow-hidden rounded-md border border-border shadow-md">
                    <div className="relative aspect-[16/9]">
                      <AuroraBackground tone={a.tone} className="absolute inset-0 h-full min-h-0" />
                    </div>
                  </div>
                </Inspectable>
                <div className="mt-2 flex items-baseline justify-between gap-2">
                  <span className="font-display text-body-md font-medium text-fg">{a.label}</span>
                  <span className="font-mono text-caption text-fg-subtle">{a.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-6 max-w-2xl font-body text-body-md leading-relaxed text-fg-muted">
          Add a still background by dropping a 16/9 WEBP into{' '}
          <span className="font-mono text-caption">public/images/backgrounds</span> and appending to a group in{' '}
          <span className="font-mono text-caption">BG_GROUPS</span>; the live{' '}
          <span className="font-mono text-caption">&lt;AuroraBackground&gt;</span> takes{' '}
          <span className="font-mono text-caption">blue · sky · slate · mist</span>.
        </p>
      </div>

      {/* Aspect-ratio frames */}
      <div className="mb-14">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <MonoLabel number="17.2" dot>
            Aspect-ratio frames
          </MonoLabel>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FRAMES.map((frame) => (
            <div key={frame.ratio}>
              <ImageWash
                background={frame.background}
                label={frame.label}
                note={frame.note}
                dark={frame.dark}
                ratio={frame.ratio}
                className="shadow-md"
              />
              <p className="mt-2 font-mono text-caption text-fg-subtle">
                ratio <span className="text-fg-muted">{frame.ratio}</span>
              </p>
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-2xl font-body text-body-md leading-relaxed text-fg-muted">
          Four ratios cover the system: <span className="text-fg">16 / 9</span> for heroes and
          banners, <span className="text-fg">4 / 3</span> for card media,{' '}
          <span className="text-fg">1 / 1</span> for avatars and bento tiles, and{' '}
          <span className="text-fg">3 / 4</span> for portraits. Each tile is a soft CSS wash under a
          hairline border, rounded to the 8px ceiling and gently lifted.
        </p>
      </div>

      {/* Gradient overlay over image */}
      <div className="mb-14">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <MonoLabel number="17.3" dot>
            Gradient overlay
          </MonoLabel>
          <span className="font-mono text-caption text-fg-subtle">copy over photography</span>
        </div>
        <Demo label="Copy over photography · bottom-up scrim" padded={false} inspect={OVERLAY_INSPECT}>
          <div className="grid gap-0 md:grid-cols-2">
            {/* Live pattern: a photo draught with the scrim + copy on top */}
            <div
              className="relative min-h-[280px] overflow-hidden"
              style={{ background: PHOTO }}
            >
              <div className="absolute inset-0" style={{ background: OVERLAY }} aria-hidden />
              <div className="absolute inset-0 z-10 flex flex-col justify-end gap-2 p-6">
                <MonoLabel tone="brand" number="01" dot className="text-inverse-fg/70">
                  Private Credit
                </MonoLabel>
                <h3 className="font-display text-title-md text-inverse-fg">
                  Capital that moves at the speed of the deal
                </h3>
                <p className="font-body text-body-sm leading-relaxed text-inverse-fg/70">
                  A bottom-up scrim keeps display copy AA-legible over any frame, however busy the
                  underlying image.
                </p>
              </div>
            </div>
            {/* Anatomy note */}
            <div className="flex flex-col justify-center gap-4 border-t border-border bg-surface p-6 md:border-l md:border-t-0">
              <p className="font-body text-body-md leading-relaxed text-fg-muted">
                Text never sits on bare photography. A single bottom-anchored scrim, fading to
                transparent at the top, guarantees contrast and keeps the eye on the headline.
              </p>
              <ul className="flex flex-col gap-2 font-mono text-caption text-fg-subtle">
                <li>· overlay anchored to the bottom 55% of the frame</li>
                <li>· copy stacked in the lower-left, inverse-fg tokens</li>
                <li>· one accent overline max, never a second gradient</li>
              </ul>
            </div>
          </div>
        </Demo>
      </div>

      {/* Approved / forbidden */}
      <div className="mb-14">
        <MonoLabel number="17.4" dot className="mb-5">
          Direction — approved &amp; forbidden
        </MonoLabel>
        <div className="grid gap-5 md:grid-cols-2">
          {/* Approved */}
          <div className="overflow-hidden rounded-lg border border-success/40 bg-success-soft/30">
            <div className="flex items-center gap-2 border-b border-success/30 px-4 py-2.5">
              <Check className="h-4 w-4 text-success" strokeWidth={1.5} aria-hidden />
              <span className="font-mono text-caption font-bold uppercase tracking-[0.1em] text-success">
                Approved
              </span>
            </div>
            <div className="p-5">
              <ImageWash
                background="radial-gradient(120% 120% at 100% 0%, rgba(51,72,143,0.16), transparent 55%), linear-gradient(135deg, #1b2433, #0e131c)"
                label="Considered, calm, real"
                note="natural light · muted · on-brand wash"
                icon={Handshake}
                dark
                ratio="16/9"
              />
              <p className="mt-4 font-body text-body-sm leading-relaxed text-fg-muted">
                Documentary tone, restrained colour, advisors mid-work. Warmth comes from a faint
                Atlas Blue glow — never a filter. Subjects look composed, not staged.
              </p>
            </div>
          </div>
          {/* Forbidden */}
          <div className="overflow-hidden rounded-lg border border-danger/40 bg-danger-soft/30">
            <div className="flex items-center gap-2 border-b border-danger/30 px-4 py-2.5">
              <X className="h-4 w-4 text-danger" strokeWidth={1.5} aria-hidden />
              <span className="font-mono text-caption font-bold uppercase tracking-[0.1em] text-danger">
                Forbidden
              </span>
            </div>
            <div className="p-5">
              <ImageWash
                background="linear-gradient(135deg, #ff5fa2, #7a3bff 45%, #14e0c8)"
                label="Stock-smiley, neon, glassy"
                note="saturated gradients · fake handshakes"
                ratio="16/9"
                dark
              />
              <p className="mt-4 font-body text-body-sm leading-relaxed text-fg-muted">
                No rainbow gradients, no glassmorphism, no posed grins or trophy imagery. Loud colour
                and clipart confidence read as hype — the one thing a broker CRM cannot afford.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image treatment */}
      <div>
        <MonoLabel number="17.5" dot className="mb-5">
          Image treatment
        </MonoLabel>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              Icon: ShieldCheck,
              title: 'Framing',
              body: 'Every frame keeps a hairline border-border and an 8px rounded corner, so photography never floats on the white canvas.',
            },
            {
              Icon: Building2,
              title: 'Scrim',
              body: 'A bottom-up dark scrim sits under any overlaid text, so headlines stay legible over the busiest image.',
            },
            {
              Icon: LineChart,
              title: 'Wash',
              body: 'A faint blue wash at one corner ties the image to the accent without a visible border seam.',
            },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="rounded-md border border-border bg-surface p-5">
              <Icon className="h-5 w-5 text-accent-text" strokeWidth={1.5} aria-hidden />
              <h3 className="mt-3 font-display text-title-sm text-fg">{title}</h3>
              <p className="mt-1.5 font-body text-body-sm leading-relaxed text-fg-muted">{body}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-2xl font-body text-body-md leading-relaxed text-fg-muted">
          One recipe everywhere: same ratios, same rounded corner + hairline border, same bottom-up
          scrim — so a single change reflows every frame.
        </p>
      </div>
    </Section>
  )
}
