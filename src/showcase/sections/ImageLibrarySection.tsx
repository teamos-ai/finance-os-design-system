/**
 * ImageLibrarySection — the visual language. ImageWash tiles carry the image-wash +
 * gradient-overlay tokens across the four reference aspect ratios; a gradient-overlay-over-
 * image pattern shows how copy sits on a photo; an approved / forbidden pair fixes the
 * direction; a closing note covers how images behave per theme. Calm, broker-grade.
 *
 * Self-contained: the wash CSS strings are documented signature-gradient + glow draughts
 * built only from the locked amber/amber/navy family (rgba allowed inside a documented glow).
 */
import { Building2, LineChart, Handshake, ShieldCheck, Check, X } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { ImageWash } from '@/components/ui/image-wash'
import type { InspectData } from '@/components/ui/inspectable'

const OVERLAY_INSPECT: InspectData = {
  name: 'Gradient overlay',
  explain: 'Text never sits on bare photography. A single bottom-anchored scrim guarantees contrast and keeps the eye on the headline. One accent overline max, never a second gradient.',
  token: 'bottom-up scrim · inverse-fg copy',
  code: 'background: linear-gradient(to top, rgba(8,12,18,0.88) 0%, transparent 55%);',
  download: { filename: 'image-overlay.css', content: '.image-scrim {\n  background: linear-gradient(to top, rgba(8,12,18,0.88) 0%, transparent 55%);\n}', mime: 'text/css' },
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
    note: '16 / 9 · amber glow',
    background:
      'radial-gradient(120% 140% at 0% 0%, rgba(238,186,43,0.20), transparent 60%), linear-gradient(135deg, #1b2433, #0e131c)',
    dark: true,
  },
  {
    ratio: '4/3',
    label: 'Card media',
    note: '4 / 3 · amber wash',
    background:
      'radial-gradient(120% 120% at 100% 0%, rgba(230,138,0,0.18), transparent 55%), linear-gradient(135deg, #f4ede0, #e7dccb)',
  },
  {
    ratio: '1/1',
    label: 'Avatar & tile',
    note: '1 / 1 · navy depth',
    background:
      'radial-gradient(110% 110% at 50% 0%, rgba(238,186,43,0.16), transparent 60%), linear-gradient(160deg, #182233, #0c111a)',
    dark: true,
  },
  {
    ratio: '3/4',
    label: 'Portrait',
    note: '3 / 4 · paper warmth',
    background:
      'radial-gradient(120% 120% at 0% 100%, rgba(238,186,43,0.14), transparent 55%), linear-gradient(200deg, #f6f1e8, #e9ded0)',
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
      lead="The visual language. Photography is calm, real and considered — advisors at work, not stock smiles. Until shoots land, washes built from the signature amber-amber-navy family stand in. Every frame rounds to rounded-md and rests on a hairline border."
    >
      {/* Aspect-ratio frames */}
      <div className="mb-14">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <MonoLabel number="17.1" dot>
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
          <MonoLabel number="17.2" dot>
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
                <MonoLabel tone="amber" number="01" dot className="text-inverse-fg/70">
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
        <MonoLabel number="17.3" dot className="mb-5">
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
                background="radial-gradient(120% 120% at 100% 0%, rgba(238,186,43,0.16), transparent 55%), linear-gradient(135deg, #1b2433, #0e131c)"
                label="Considered, calm, real"
                note="natural light · muted · on-brand wash"
                icon={Handshake}
                dark
                ratio="16/9"
              />
              <p className="mt-4 font-body text-body-sm leading-relaxed text-fg-muted">
                Documentary tone, restrained colour, advisors mid-work. Warmth comes from a faint
                amber glow — never a filter. Subjects look composed, not staged.
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

      {/* Per-theme note */}
      <div>
        <MonoLabel number="17.4" dot className="mb-5">
          Images across themes
        </MonoLabel>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              Icon: ShieldCheck,
              theme: 'Dark-OLED',
              body: 'Frames glow against true black. A faint amber wash at the corner ties the image to the accent without a visible border seam.',
            },
            {
              Icon: Building2,
              theme: 'Light',
              body: 'Warm-paper canvas. Photography keeps a hairline border-border so it never floats; the scrim stays the same dark recipe.',
            },
            {
              Icon: LineChart,
              theme: 'Paper',
              body: 'Highest warmth. Images read slightly softer — lean on the wash, not added saturation, to keep the calm register.',
            },
          ].map(({ Icon, theme, body }) => (
            <div key={theme} className="rounded-md border border-border bg-surface p-5">
              <Icon className="h-5 w-5 text-accent-text" strokeWidth={1.5} aria-hidden />
              <h3 className="mt-3 font-display text-title-sm text-fg">{theme}</h3>
              <p className="mt-1.5 font-body text-body-sm leading-relaxed text-fg-muted">{body}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-2xl font-body text-body-md leading-relaxed text-fg-muted">
          The rules hold across all three themes: same ratios, same rounded corner + hairline border,
          same bottom-up scrim. Only the surrounding canvas shifts, so a single change reflows every frame.
        </p>
      </div>
    </Section>
  )
}
