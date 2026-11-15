/**
 * OverviewSection — "the system at a glance", rebuilt as a three-part visual showreel:
 *   1 · CardSphere   — a draggable sphere of cards, one per part of the system (the breadth).
 *   2 · GlanceBento  — what it's made of: type, tokens, verified contrast, motion, radius, parts.
 *   3 · FeatureBento — the system as a product: token architecture, Ruler/Sage, Light theme, type.
 *
 * All three are tokenised to the constitution (Atlas Blue + neutrals, 8px squircles, no glass) and
 * reduced-motion safe. The old principle cards + archetype + Light·Clarity copy are folded into the
 * two bentos, so nothing is lost — it is upgraded.
 */
import * as React from 'react'
import { Section } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { FadeIn } from '@/lib/motion'
import CardSphere from './overview/CardSphere'
import { GlanceBento } from './overview/GlanceBento'
import { FeatureBento } from './overview/FeatureBento'

/** Centered kicker + title introducing a block within the section. */
function BlockHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <FadeIn className="mb-7 flex flex-col items-center text-center">
      <MonoLabel tone="subtle" size="sm">{kicker}</MonoLabel>
      <h3 className="mt-2 font-display text-display-sm text-fg">{title}</h3>
    </FadeIn>
  )
}

export function OverviewSection() {
  const [showing, setShowing] = React.useState('Typography')

  return (
    <Section
      id="overview"
      eyebrow="Overview"
      title="The system at a glance"
      lead="Finance OS is built Ruler-first: structure, order and authority, softened by the Sage's clarity. Spin the parts, see what they're made of, and meet the system as a product — every surface composed from one locked token layer."
    >
      {/* 1 — the interactive sphere of parts */}
      <FadeIn>
        <div className="relative h-[380px] overflow-hidden rounded-lg border border-border bg-canvas-muted sm:h-[460px] lg:h-[520px]">
          <CardSphere onSettle={setShowing} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 md:p-5">
            <span className="inline-flex items-center gap-2.5 rounded-md border border-border bg-surface px-3 py-2 shadow-sm">
              <MonoLabel tone="subtle" size="sm">Showing</MonoLabel>
              <span className="font-display text-title-sm text-fg">{showing}</span>
            </span>
            <span className="hidden items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 font-mono text-mono-2xs uppercase tracking-[0.12em] text-fg-subtle shadow-sm sm:inline-flex">
              Drag · arrow keys to turn
            </span>
          </div>
        </div>
      </FadeIn>

      {/* 2 — what it's made of */}
      <div className="mt-16">
        <BlockHead kicker="Foundations" title="What it's made of" />
        <GlanceBento />
      </div>

      {/* 3 — the system as a product */}
      <div className="mt-16">
        <BlockHead kicker="At a glance" title="The system as a product" />
        <FeatureBento />
      </div>
    </Section>
  )
}
