/**
 * FeatureBento — "the system as a product", the taste-forward board.
 *
 * Re-slotted from the reference "Bento Product Features": a tall gradient hero carries the three
 * token layers (the product's spine), flanked by the Ruler/Sage archetype, the single Light theme
 * with its Atlas-Blue swatch, the Spline Sans + Anonymous Pro pairing, and a closing "copy anything"
 * row. Gradient + Glow depth (never glass), CountUp figures, calm entrance stagger and quiet hovers.
 * Token-only, 8px ceiling.
 */
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MonoLabel } from '@/components/ui/mono-label'
import { Stagger, StaggerItem, Glow, EASE_OUT } from '@/lib/motion'
import { PILLARS } from '@/data/system'

/* ── the architecture spine — three layers, a dot travelling the seam ─────────── */
const ARCH = [
  { tag: 'primitive', note: 'raw brand ramps · --p-*' },
  { tag: 'semantic', note: 'intent · --c-*' },
  { tag: 'component', note: 'parts · --btn- · --card-' },
]
function ArchitectureTile() {
  const reduced = useReducedMotion()
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-lg border border-border bg-gradient-accent p-7 md:p-8">
      <Glow />
      <div className="flex flex-col gap-3">
        <MonoLabel tone="accent" dot className="text-accent-fg">
          Token architecture
        </MonoLabel>
        <h3 className="max-w-xs font-display text-display-sm leading-tight text-accent-fg">
          Every surface composes from one layer.
        </h3>
      </div>

      <div className="relative mt-8 flex flex-col gap-3">
        <span aria-hidden className="absolute left-[15px] top-4 bottom-4 w-px bg-accent-fg/30" />
        {!reduced && (
          <motion.span
            aria-hidden
            className="absolute left-[11px] h-2 w-2 rounded-sm bg-accent-fg"
            initial={{ top: 16 }}
            animate={{ top: [16, '85%', 16] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: EASE_OUT }}
          />
        )}
        {ARCH.map((l) => (
          <div key={l.tag} className="relative flex items-center gap-3 rounded-md border border-accent-fg/20 bg-accent-fg/10 px-3 py-2">
            <span className="h-2 w-2 shrink-0 rounded-sm bg-accent-fg" aria-hidden />
            <span className="flex flex-col">
              <span className="font-mono text-mono-2xs uppercase tracking-[0.12em] text-accent-fg">{l.tag}</span>
              <span className="font-mono text-caption text-accent-fg/75">{l.note}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── archetype cell (Ruler / Sage) ────────────────────────────────────────────── */
function PillarCell({ name, weight, blurb }: { name: string; weight: string; blurb: string }) {
  return (
    <div className="flex h-full flex-col justify-between gap-4 rounded-lg border border-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <MonoLabel tone="brand" dot>{name}</MonoLabel>
        <span className="font-display text-display-sm font-semibold text-accent-text">{weight}</span>
      </div>
      <p className="font-body text-body-sm leading-relaxed text-fg-muted">{blurb}</p>
    </div>
  )
}

export function FeatureBento() {
  const reduced = useReducedMotion()
  const [ruler, sage] = PILLARS
  const hover = reduced ? undefined : { y: -2 }

  return (
    <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[minmax(150px,1fr)]" amount={0.1}>
      {/* Architecture spine — tall left column */}
      <StaggerItem className="md:col-start-1 md:row-start-1 md:row-span-3">
        <motion.div whileHover={hover} transition={{ duration: 0.24, ease: EASE_OUT }} className="h-full">
          <ArchitectureTile />
        </motion.div>
      </StaggerItem>

      {/* Ruler / Sage archetype */}
      <StaggerItem className="md:col-start-2 md:row-start-1">
        <motion.div whileHover={hover} transition={{ duration: 0.24, ease: EASE_OUT }} className="h-full">
          <PillarCell name={ruler.name} weight={ruler.weight} blurb={ruler.blurb} />
        </motion.div>
      </StaggerItem>
      <StaggerItem className="md:col-start-3 md:row-start-1">
        <motion.div whileHover={hover} transition={{ duration: 0.24, ease: EASE_OUT }} className="h-full">
          <PillarCell name={sage.name} weight={sage.weight} blurb={sage.blurb} />
        </motion.div>
      </StaggerItem>

      {/* Single theme + Atlas Blue */}
      <StaggerItem className="md:col-start-2 md:row-start-2">
        <motion.div
          whileHover={hover}
          transition={{ duration: 0.24, ease: EASE_OUT }}
          className="flex h-full flex-col justify-between gap-4 rounded-lg border border-border bg-surface p-6"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent-soft text-accent-text">
              <Palette className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            </span>
            <div className="flex gap-1.5">
              <span className="h-8 w-8 rounded-sm bg-accent" title="Atlas Blue" />
              <span className="h-8 w-8 rounded-sm border border-border bg-canvas" title="Canvas white" />
              <span className="h-8 w-8 rounded-sm bg-fg" title="Ink" />
            </div>
          </div>
          <div>
            <h4 className="font-display text-title-sm text-fg">Light · Clarity</h4>
            <p className="mt-1 font-body text-body-sm leading-relaxed text-fg-muted">
              One theme. Pure white with the Atlas Blue accent — matched to the production site.
            </p>
          </div>
        </motion.div>
      </StaggerItem>

      {/* Type pairing */}
      <StaggerItem className="md:col-start-3 md:row-start-2">
        <motion.div
          whileHover={hover}
          transition={{ duration: 0.24, ease: EASE_OUT }}
          className="flex h-full flex-col justify-between gap-4 rounded-lg border border-border bg-surface p-6"
        >
          <div className="flex items-end gap-3">
            <span className="font-display text-display-sm font-semibold leading-none text-fg">Aa</span>
            <span className="font-mono text-display-sm leading-none text-accent-text">A1</span>
          </div>
          <div>
            <h4 className="font-display text-title-sm text-fg">Spline Sans + Anonymous Pro</h4>
            <p className="mt-1 font-body text-body-sm leading-relaxed text-fg-muted">
              Self-hosted. The sans carries voice; the mono carries labels, counts and tokens.
            </p>
          </div>
        </motion.div>
      </StaggerItem>

      {/* Copy-anything CTA — wide */}
      <StaggerItem className="md:col-start-2 md:col-span-2 md:row-start-3">
        <motion.div
          whileHover={hover}
          transition={{ duration: 0.24, ease: EASE_OUT }}
          className="flex h-full flex-col items-start justify-between gap-5 rounded-lg border border-border bg-elevated p-6 md:flex-row md:items-center md:p-7"
        >
          <div className="flex flex-col gap-2.5">
            <Badge variant="blue" size="sm" dot>The showcase is the documentation</Badge>
            <h4 className="font-display text-title-md text-fg">Copy any token. Lift any component.</h4>
            <div className="flex flex-wrap items-center gap-2">
              {['--c-accent', '<Button>', '#33488F', '--radius-lg'].map((t) => (
                <code key={t} className="rounded-sm border border-border bg-surface px-2 py-1 font-mono text-caption text-accent-text">{t}</code>
              ))}
            </div>
          </div>
          <Button variant="primary" size="md" className="shrink-0">
            Browse the system
            <ArrowRight width={18} height={18} strokeWidth={1.5} aria-hidden />
          </Button>
        </motion.div>
      </StaggerItem>
    </Stagger>
  )
}
