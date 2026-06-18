/**
 * BannersSection — hero/CTA banners and the background system.
 *
 * Three reference surfaces: (1) the signature gradient CTA banner — dark-on-gold
 * heading over `bg-gradient-accent`, AA-safe via `text-accent-fg`; (2) a slim
 * announcement bar — breathing dot + line + link; (3) a section-header banner —
 * eyebrow + title floating over a `Glow` field on `bg-surface`. The closing note
 * documents the background token set and the contrast guarantee over imagery.
 */
import { Section, Demo } from '@/showcase/Section'
import { Button } from '@/components/ui/button'
import { MonoLabel } from '@/components/ui/mono-label'
import { Glow, BreathingDot } from '@/lib/motion'
import { ArrowRight } from 'lucide-react'
import { BRAND } from '@/data/system'

export function BannersSection() {
  return (
    <Section
      id="banners"
      eyebrow="14 - Banners"
      title="Banners & backgrounds"
      lead="Hero and CTA banners plus the background system. Every banner keeps its label on a guaranteed-contrast surface — gold gets a dark label, imagery gets a scrim — so the message reads clearly on any theme."
    >
      <div className="flex flex-col gap-10">
        {/* ── 1 · Signature gradient CTA banner ───────────────────────────── */}
        <div className="flex flex-col gap-3">
          <MonoLabel tone="amber" number="01">Signature CTA banner</MonoLabel>
          <Demo label="bg-gradient-accent · text-accent-fg · shadow-glow" padded={false}>
            <div className="relative overflow-hidden rounded-lg bg-gradient-accent px-6 py-12 text-center shadow-glow md:px-12 md:py-16">
              <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
                <MonoLabel tone="fg" className="text-accent-fg/70">
                  Predictable pipeline
                </MonoLabel>
                <h3 className="font-display text-display-sm leading-tight text-accent-fg md:text-display-md">
                  More settlements, less admin — on one operating system.
                </h3>
                <p className="max-w-xl font-body text-body-md text-accent-fg/80">
                  {BRAND.promise}
                </p>
                <Button variant="dark" size="lg" className="mt-1">
                  Book a walkthrough
                </Button>
              </div>
            </div>
          </Demo>
          <p className="font-mono text-caption text-fg-subtle">
            Dark-on-gold heading uses <span className="text-accent-text">text-accent-fg</span> for AA
            contrast over the gradient. The CTA is a neutral <span className="text-accent-text">dark</span>{' '}
            pill so two gold fills never stack.
          </p>
        </div>

        {/* ── 2 · Announcement bar ────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <MonoLabel tone="amber" number="02">Announcement bar</MonoLabel>
          <Demo label="bg-surface · slim · dot + text + link" padded={false}>
            <div className="flex flex-col items-center justify-center gap-2 border-b border-border bg-surface px-4 py-3 text-center sm:flex-row sm:gap-3">
              <span className="inline-flex items-center gap-2 font-body text-body-sm text-fg-muted">
                <BreathingDot />
                <span>
                  New — AI conversations now answer and book{' '}
                  <span className="text-fg">24/7</span>.
                </span>
              </span>
              <a
                href="#features"
                className="inline-flex items-center gap-1 rounded-sm font-mono text-mono-xs font-bold uppercase tracking-[0.12em] text-accent-text transition-colors duration-fast ease-out hover:text-accent-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                See what is new
                <ArrowRight aria-hidden className="h-3 w-3" strokeWidth={1.5} />
              </a>
            </div>
          </Demo>
          <p className="font-mono text-caption text-fg-subtle">
            Full-bleed at the top of a page. Sits on <span className="text-accent-text">bg-surface</span>{' '}
            with a <span className="text-accent-text">border-border</span> hairline — the breathing dot
            stills under reduced motion.
          </p>
        </div>

        {/* ── 3 · Section-header banner over a Glow field ─────────────────── */}
        <div className="flex flex-col gap-3">
          <MonoLabel tone="amber" number="03">Section-header banner</MonoLabel>
          <Demo label="bg-surface · Glow field · eyebrow + title" padded={false}>
            <div className="relative overflow-hidden rounded-lg border border-border bg-surface px-6 py-16 text-center md:px-12 md:py-20">
              <Glow />
              <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-4">
                <MonoLabel dot>The platform</MonoLabel>
                <h3 className="font-display text-display-md leading-tight text-fg">
                  One system for the whole pipeline
                </h3>
                <p className="max-w-xl font-body text-body-lg leading-relaxed text-fg-muted">
                  {BRAND.oneLiner} The glow is a quiet gold wash — never a hero photo — so headings
                  stay crisp on <span className="text-fg">bg-surface</span>.
                </p>
                <Button variant="primary" size="md" className="mt-2">
                  Explore the system
                </Button>
              </div>
            </div>
          </Demo>
          <p className="font-mono text-caption text-fg-subtle">
            <span className="text-accent-text">Glow</span> is a blurred, low-alpha gold/amber radial
            (the one documented exception to token-only colour) sat behind the copy with{' '}
            <span className="text-accent-text">-z-10</span> and no pointer events.
          </p>
        </div>

        {/* ── Background token note ───────────────────────────────────────── */}
        <div className="rounded-lg border border-border bg-canvas p-6 md:p-8">
          <MonoLabel tone="subtle">Background system</MonoLabel>
          <p className="mt-3 max-w-3xl font-body text-body-md leading-relaxed text-fg-muted">
            Layer surfaces from back to front:{' '}
            <span className="text-fg">bg-canvas</span> (page),{' '}
            <span className="text-fg">bg-surface</span> (raised band),{' '}
            <span className="text-fg">bg-elevated</span> (cards),{' '}
            <span className="text-fg">bg-inset</span> (wells), and{' '}
            <span className="text-fg">bg-gradient-accent</span> for the one signature CTA. Add a{' '}
            <span className="text-fg">Glow</span> field for atmosphere — never below body copy that
            needs to stay legible.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { token: 'bg-canvas', className: 'bg-canvas' },
              { token: 'bg-surface', className: 'bg-surface' },
              { token: 'bg-elevated', className: 'bg-elevated' },
              { token: 'bg-inset', className: 'bg-inset' },
              { token: 'bg-overlay', className: 'bg-overlay' },
              { token: 'bg-gradient-accent', className: 'bg-gradient-accent' },
            ].map((swatch) => (
              <div key={swatch.token} className="flex flex-col gap-2">
                <div
                  className={`h-14 rounded-md border border-border ${swatch.className}`}
                  aria-hidden
                />
                <span className="font-mono text-mono-xs text-fg-subtle">{swatch.token}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl font-body text-body-sm leading-relaxed text-fg-muted">
            Over imagery, contrast is guaranteed two ways: a dark scrim layer
            (<span className="text-fg">bg-overlay</span>) under the text, or the label moves onto a
            solid token surface. Never set body copy directly on a raw photo.
          </p>
        </div>
      </div>
    </Section>
  )
}
