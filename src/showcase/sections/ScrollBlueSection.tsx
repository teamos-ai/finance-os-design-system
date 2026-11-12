/**
 * ScrollBlueSection — the "scroll & blue transition" positioning surface. As the band enters
 * view the surface settles from the white page into a deep Atlas Blue, a calm full-bleed band
 * that holds the signed-off positioning statement on the left while the supporting figures read
 * alongside it on the right (graphs + stat tiles communicating next to the copy).
 *
 * Motion is motivated and reduced-motion safe: a single scroll-driven veil (useScroll) lifts a
 * white surface off the blue as the band centres; the figures draw/count once in view. With
 * reduced motion the band is simply static deep blue — no veil, no transform. BLUE owns the
 * surface; on blue, type and data are WHITE (--c-accent-fg) at AA-safe opacities. No ribbons,
 * no glass, 8px radius, neutral focus. Copy is imported from the positioning source, never hardcoded.
 */
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { MoveVertical } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { BlueAreaChart, BlueStatTile } from '@/components/scroll-blue/blue-viz'
import { hero, dashboard } from '@/data/positioning'

/** Deep Atlas Blue band fill — a lit sheen over the accent→accent-press gradient, all from tokens. */
const BAND_BG =
  'radial-gradient(130% 120% at 8% 0%, color-mix(in srgb, var(--c-accent-fg) 12%, transparent), transparent 52%), linear-gradient(155deg, var(--c-accent) 0%, var(--c-accent-press) 100%)'

/** The signed-off positioning line, split so the key phrase stays full-white against the dimmed rest. */
function Statement() {
  const idx = hero.headline.indexOf(hero.highlight)
  const before = idx >= 0 ? hero.headline.slice(0, idx) : hero.headline
  const after = idx >= 0 ? hero.headline.slice(idx + hero.highlight.length) : ''
  return (
    <h3 className="font-display text-display-sm text-white/90 md:text-display-md">
      {before}
      {idx >= 0 && <span className="text-white">{hero.highlight}</span>}
      {after}
    </h3>
  )
}

export function ScrollBlueSection() {
  const bandRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  // 0 when the band's top meets the viewport bottom → 1 when its centre reaches the viewport centre.
  const { scrollYProgress } = useScroll({ target: bandRef, offset: ['start end', 'center center'] })
  // the white page surface lifts off the blue over the first part of entry.
  const veil = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  return (
    <Section
      id="scroll-blue-band"
      eyebrow="Scroll transition"
      title="Scroll & blue transition"
      lead="As the page scrolls, the surface settles into deep Atlas Blue — one calm band that holds the positioning statement while the supporting figures read alongside it."
    >
      <Demo
        label="Scroll band — the surface deepens to Atlas Blue as it enters view"
        padded={false}
        inspect={{
          name: 'Scroll blue band',
          explain:
            'A scroll-driven positioning band: a white surface lifts off deep Atlas Blue as the block centres in view, pairing the signed-off statement with its supporting figures. Use it once on a page as a calm pivot moment — never as a busy, repeated effect.',
          token: [
            'band  = ' + BAND_BG,
            'veil  = bg-canvas (#FFFFFF), opacity driven by useScroll',
            'on-blue text = text-white / text-white/90 / text-white/75 (AA on #33488F)',
            'tiles = bg-white/10 · border-white/15 · rounded-md',
            'figures = tabular-nums + CountUp (reduced-motion safe)',
          ].join('\n'),
          code: [
            "const { scrollYProgress } = useScroll({ target: ref,",
            "  offset: ['start end', 'center center'] })",
            'const veil = useTransform(scrollYProgress, [0, 0.4], [1, 0])',
            '// <motion.div style={{ opacity: veil }} className="absolute inset-0 bg-canvas" />',
            '//   white page  →  deep Atlas Blue',
          ].join('\n'),
        }}
      >
        <div
          ref={bandRef}
          className="relative isolate min-h-[26rem] overflow-hidden"
          style={{ backgroundImage: BAND_BG }}
        >
          {/* content — statement beside the supporting figures */}
          <div className="relative z-10 grid gap-9 p-6 md:grid-cols-2 md:items-center md:gap-10 md:p-10 lg:p-12">
            {/* left — the positioning statement */}
            <div className="flex flex-col gap-5">
              <span className="inline-flex items-center gap-2 font-mono text-mono-xs uppercase tracking-wider text-white/75">
                <span aria-hidden className="h-1.5 w-1.5 rounded-xs bg-white/80" />
                {hero.overline}
              </span>
              <Statement />
              <p className="font-mono text-mono-xs uppercase tracking-[0.14em] text-white/70">{hero.signoff}</p>
            </div>

            {/* right — graphs + stat tiles, communicating alongside the copy */}
            <div className="rounded-lg border border-white/15 bg-white/5 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="font-mono text-mono-xs uppercase tracking-wider text-white/75">
                  {dashboard.pipeline.label}
                </span>
                <span className="rounded-sm border border-white/20 px-2 py-0.5 font-mono text-mono-2xs uppercase tracking-wider text-white/75">
                  Illustrative
                </span>
              </div>
              <BlueAreaChart data={dashboard.pipeline.points} ariaLabel={dashboard.pipeline.label} />
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/15 pt-5">
                {dashboard.stats.map((s, i) => (
                  <BlueStatTile key={s.label} stat={s} delay={i * 0.12} />
                ))}
              </div>
            </div>
          </div>

          {/* scroll-driven white veil — lifts to reveal the blue (motivated motion only) */}
          {!reduced && (
            <>
              <motion.div
                aria-hidden
                style={{ opacity: veil }}
                className="pointer-events-none absolute inset-0 z-20 bg-canvas"
              />
              <motion.div
                aria-hidden
                style={{ opacity: veil }}
                className="pointer-events-none absolute inset-x-0 top-6 z-30 flex items-center justify-center"
              >
                <span className="inline-flex items-center gap-1.5 font-mono text-mono-2xs uppercase tracking-[0.14em] text-fg-subtle">
                  <MoveVertical className="h-3.5 w-3.5" strokeWidth={2} />
                  Scroll
                </span>
              </motion.div>
            </>
          )}
        </div>
      </Demo>

      <p className="mt-2.5 font-body text-caption leading-relaxed text-fg-subtle">{dashboard.note}</p>
    </Section>
  )
}
