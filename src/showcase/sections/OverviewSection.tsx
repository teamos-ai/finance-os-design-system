/**
 * OverviewSection — "the system at a glance", a two-part premium showreel:
 *   1 · CardSphere  — a draggable sphere of cards (one per part of the system), floating on the
 *       canvas over a soft Atlas-Blue halo — no container box, no caption, cards free to rotate
 *       without clipping (the sphere sits well inside its frame, with overflow unclipped as a net).
 *   2 · SystemBento — ONE cohesive bento merging "what it's made of" and "the system as a product".
 *
 * Tokenised to the constitution (Atlas Blue + neutrals, 8px squircles, depth from glow + shadow,
 * no glass, no ribbons) and reduced-motion safe.
 */
import { Section } from '@/showcase/Section'
import { FadeIn } from '@/lib/motion'
import CardSphere from './overview/CardSphere'
import { SystemBento } from './overview/SystemBento'

export function OverviewSection() {
  return (
    <Section
      id="overview"
      eyebrow="Overview"
      title="The system at a glance"
      lead="Finance OS is built Ruler-first: structure, order and authority, softened by the Sage's clarity. Spin the parts, then meet the system as a product — every surface composed from one locked token layer."
    >
      {/* 1 — the interactive sphere, floating over a soft Atlas-Blue halo (no box, no caption) */}
      <FadeIn>
        <div className="relative py-6">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[780px] max-w-[116%] -translate-x-1/2 -translate-y-1/2 rounded-sm opacity-70 blur-3xl"
            style={{
              background:
                'radial-gradient(closest-side, color-mix(in srgb, var(--c-accent) 15%, transparent), transparent 72%)',
            }}
          />
          <div className="relative h-[clamp(420px,58vw,600px)]">
            <CardSphere />
          </div>
        </div>
      </FadeIn>

      {/* 2 — one cohesive premium bento */}
      <div className="mt-12">
        <SystemBento />
      </div>
    </Section>
  )
}
