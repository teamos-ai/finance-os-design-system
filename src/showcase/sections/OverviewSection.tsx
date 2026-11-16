/**
 * OverviewSection — "the system at a glance", a two-part premium showreel:
 *   1 · CardSphere  — a draggable sphere of cards (one per part of the system), floating on the
 *       canvas over a soft Atlas-Blue halo — no container box.
 *   2 · SystemBento — ONE cohesive bento merging "what it's made of" and "the system as a product":
 *       token architecture, verified AA, type, tokens, the Ruler/Sage archetype, radius, motion,
 *       the Light theme, and a copy-anything closer. Every cell tilts toward the cursor.
 *
 * Tokenised to the constitution (Atlas Blue + neutrals, 8px squircles, depth from glow + shadow,
 * no glass, no ribbons) and reduced-motion safe.
 */
import * as React from 'react'
import { Section } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { FadeIn } from '@/lib/motion'
import CardSphere from './overview/CardSphere'
import { SystemBento } from './overview/SystemBento'

export function OverviewSection() {
  const [showing, setShowing] = React.useState('Typography')

  return (
    <Section
      id="overview"
      eyebrow="Overview"
      title="The system at a glance"
      lead="Finance OS is built Ruler-first: structure, order and authority, softened by the Sage's clarity. Spin the parts, then meet the system as a product — every surface composed from one locked token layer."
    >
      {/* 1 — the interactive sphere of parts, floating over a soft Atlas-Blue halo (no box) */}
      <FadeIn>
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[780px] max-w-[116%] -translate-x-1/2 -translate-y-1/2 rounded-sm opacity-70 blur-3xl"
            style={{
              background:
                'radial-gradient(closest-side, color-mix(in srgb, var(--c-accent) 15%, transparent), transparent 72%)',
            }}
          />
          <div className="relative h-[clamp(420px,58vw,600px)]">
            <CardSphere onSettle={setShowing} />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
            <MonoLabel tone="subtle" size="sm">Showing</MonoLabel>
            <span className="font-display text-title-sm text-fg">{showing}</span>
            <span aria-hidden className="hidden text-fg-subtle sm:inline">·</span>
            <span className="hidden font-mono text-mono-2xs uppercase tracking-[0.12em] text-fg-subtle sm:inline">
              Drag or arrow keys to turn
            </span>
          </div>
        </div>
      </FadeIn>

      {/* 2 — one cohesive premium bento */}
      <div className="mt-16">
        <SystemBento />
      </div>
    </Section>
  )
}
