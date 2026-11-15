/**
 * SystemBento — "the system at a glance" as ONE cohesive premium bento.
 *
 * Merges the former GlanceBento (what it's made of) and FeatureBento (the system as a product) into a
 * single asymmetric grid: a gradient token-architecture hero, verified-AA proof, the type ramp, the
 * three token layers, the Ruler/Sage archetype, the 8px radius ladder, the motion vocabulary, the
 * single Light theme, and a closing "copy anything" row. Every cell rides a cursor-parallax TiltCard,
 * rests on a layered shadow and lifts on hover, and every figure counts up / draws in — all on the
 * house EASE_OUT and reduced-motion safe. Atlas Blue + neutrals, 8px squircles, depth from glow +
 * shadow (never glass), no ribbons.
 */
import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MonoLabel } from '@/components/ui/mono-label'
import { Stagger, StaggerItem, CountUp, Glow, EASE_OUT } from '@/lib/motion'
import { PILLARS } from '@/data/system'
import { cn } from '@/lib/cn'
import { TiltCard } from './TiltCard'

/* ── standard cell shell — hairline border, resting shadow, lift + strengthen on hover ───────── */
function Cell({
  title,
  desc,
  children,
  tone = 'surface',
  className,
}: {
  title: string
  desc: React.ReactNode
  children: React.ReactNode
  tone?: 'surface' | 'muted'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-lg border border-border p-6 shadow-sm',
        'transition-[border-color,box-shadow] duration-base ease-out hover:border-border-strong hover:shadow-lg',
        tone === 'muted' ? 'bg-canvas-muted' : 'bg-surface',
        className,
      )}
    >
      <div className="relative flex-1">{children}</div>
      <div className="mt-5">
        <h4 className="font-display text-title-sm text-fg text-balance">{title}</h4>
        <p className="mt-1 font-body text-body-sm leading-relaxed text-fg-muted text-pretty">{desc}</p>
      </div>
    </div>
  )
}

/* ── 1 · Token architecture — the gradient hero spine, a dot travelling the three layers ─────── */
const ARCH = [
  { tag: 'primitive', note: 'raw brand ramps · --p-*' },
  { tag: 'semantic', note: 'intent · --c-*' },
  { tag: 'component', note: 'parts · --btn- · --card-' },
]
function ArchitectureCell() {
  const reduced = useReducedMotion()
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-lg border border-border bg-gradient-accent p-7 shadow-md md:p-8">
      <Glow />
      <div className="flex flex-col gap-3">
        <MonoLabel tone="accent" dot className="text-accent-fg">
          Token architecture
        </MonoLabel>
        <h3 className="max-w-xs font-display text-display-sm leading-tight text-accent-fg text-balance">
          Every surface composes from one layer.
        </h3>
      </div>

      <div className="relative mt-8 flex flex-col gap-3">
        <span aria-hidden className="absolute bottom-4 left-[15px] top-4 w-px bg-accent-fg/30" />
        {!reduced && (
          <motion.span
            aria-hidden
            className="absolute left-[11px] h-2 w-2 rounded-sm bg-accent-fg shadow-[0_0_10px_rgba(255,255,255,0.6)]"
            initial={{ top: 16 }}
            animate={{ top: [16, '85%', 16] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: EASE_OUT }}
          />
        )}
        {ARCH.map((l) => (
          <div
            key={l.tag}
            className="relative flex items-center gap-3 rounded-md border border-accent-fg/20 bg-accent-fg/10 px-3 py-2"
          >
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

/* ── 2 · Verified AA — a count-up over calm concentric rings ─────────────────────────────────── */
function ContrastInset() {
  const reduced = useReducedMotion()
  return (
    <div className="relative flex h-full min-h-[128px] items-center justify-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {[0, 1, 2].map((r) => (
          <motion.span
            key={r}
            className="absolute rounded-sm border border-accent/25"
            style={{ width: 80, height: 80 }}
            initial={{ scale: 0.6, opacity: reduced ? 0.25 : 0.5 }}
            animate={reduced ? { scale: 1 + r * 0.6, opacity: 0.18 } : { scale: [0.6, 2.4], opacity: [0.5, 0] }}
            transition={reduced ? { duration: 0 } : { duration: 3.2, repeat: Infinity, delay: r * 1.05, ease: 'easeOut' }}
          />
        ))}
      </div>
      <div className="relative flex flex-col items-center">
        <span className="font-display text-display-md font-semibold tabular-nums text-fg">
          <CountUp to={21} duration={1.6} />/21
        </span>
        <span className="mt-1 font-mono text-mono-2xs uppercase tracking-[0.16em] text-accent-text">AA pairs pass</span>
      </div>
    </div>
  )
}

/* ── 3 · Type ramp — an Aa that eases through the real scale ─────────────────────────────────── */
const SCALE = [
  { label: 'display-lg', px: 'clamp(2.6rem,7vw,4rem)' },
  { label: 'display-sm', px: 'clamp(2rem,5vw,2.75rem)' },
  { label: 'title-lg', px: '1.75rem' },
  { label: 'body-md', px: '1.25rem' },
]
function TypeRampInset() {
  const reduced = useReducedMotion()
  const [i, setI] = React.useState(0)
  React.useEffect(() => {
    if (reduced) return
    const t = setInterval(() => setI((p) => (p + 1) % SCALE.length), 2100)
    return () => clearInterval(t)
  }, [reduced])
  const step = SCALE[i]
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <motion.span
        key={step.label}
        initial={reduced ? false : { opacity: 0, y: 8, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        className="font-display font-semibold leading-none text-fg"
        style={{ fontSize: reduced ? 'clamp(2.6rem,7vw,4rem)' : step.px }}
      >
        Aa<span className="text-highlight">a</span>
      </motion.span>
      <span className="font-mono text-mono-2xs uppercase tracking-[0.14em] text-fg-subtle">
        {reduced ? 'display-lg' : step.label}
      </span>
    </div>
  )
}

/* ── 4 · Three token layers — a highlight travels down the stack ─────────────────────────────── */
const LAYERS = [
  { tag: 'primitive', val: '#33488F' },
  { tag: 'semantic', val: '--c-accent' },
  { tag: 'component', val: '--btn-bg' },
]
function TokenLayersInset() {
  const reduced = useReducedMotion()
  const [active, setActive] = React.useState(0)
  React.useEffect(() => {
    if (reduced) return
    const t = setInterval(() => setActive((p) => (p + 1) % LAYERS.length), 1500)
    return () => clearInterval(t)
  }, [reduced])
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {LAYERS.map((l, idx) => {
        const on = reduced || idx === active
        return (
          <div
            key={l.tag}
            className={cn(
              'flex items-center justify-between rounded-md border px-3 py-2 transition-colors duration-base ease-out',
              on ? 'border-border-strong bg-accent-soft' : 'border-border bg-surface',
            )}
          >
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-accent" style={{ opacity: 1 - idx * 0.28 }} aria-hidden />
              <span className="font-mono text-mono-2xs uppercase tracking-[0.12em] text-fg-muted">{l.tag}</span>
            </span>
            <span className="font-mono text-caption text-fg-subtle">{l.val}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ── 5 · Ruler / Sage archetype — one cell, a 70 / 30 split ──────────────────────────────────── */
function ArchetypeCell() {
  const reduced = useReducedMotion()
  const [ruler, sage] = PILLARS
  return (
    <div className="flex h-full flex-col justify-between gap-5 rounded-lg border border-border bg-surface p-6 shadow-sm transition-[border-color,box-shadow] duration-base ease-out hover:border-border-strong hover:shadow-lg">
      <div className="flex items-center justify-between">
        <MonoLabel tone="brand" dot>
          Ruler-first
        </MonoLabel>
        <span className="font-mono text-mono-2xs uppercase tracking-[0.14em] text-fg-subtle">archetype</span>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="flex h-3 overflow-hidden rounded-sm bg-inset" aria-hidden>
          <motion.span
            className="block h-full bg-accent"
            initial={{ width: 0 }}
            whileInView={{ width: '70%' }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: reduced ? 0 : 0.8, ease: EASE_OUT }}
          />
          <span className="block h-full flex-1 bg-accent/35" />
        </div>
        <div className="flex items-center justify-between font-mono text-mono-2xs uppercase tracking-[0.12em]">
          <span className="text-accent-text">
            {ruler.name} <span className="tabular-nums">70</span>
          </span>
          <span className="text-fg-subtle">
            {sage.name} <span className="tabular-nums">30</span>
          </span>
        </div>
      </div>
      <p className="font-body text-body-sm leading-relaxed text-fg-muted text-pretty">
        Structure, order and authority — softened by the Sage's clarity.
      </p>
    </div>
  )
}

/* ── 6 · Radius ladder — 2 / 4 / 6 / 8, highlighted in turn ──────────────────────────────────── */
const RADII = [
  { r: 'rounded-xs', n: '2' },
  { r: 'rounded-sm', n: '4' },
  { r: 'rounded-md', n: '6' },
  { r: 'rounded-lg', n: '8' },
]
function RadiusInset() {
  const reduced = useReducedMotion()
  const [i, setI] = React.useState(3)
  React.useEffect(() => {
    if (reduced) return
    const t = setInterval(() => setI((p) => (p + 1) % RADII.length), 1100)
    return () => clearInterval(t)
  }, [reduced])
  return (
    <div className="flex h-full items-center justify-center gap-4 sm:gap-6">
      {RADII.map((it, idx) => {
        const on = reduced || idx === i
        return (
          <div key={it.n} className="flex flex-col items-center gap-2">
            <div
              className={cn(
                'h-12 w-12 border-2 transition-colors duration-base ease-out',
                it.r,
                on ? 'border-accent bg-accent-soft' : 'border-border-strong bg-surface',
              )}
            />
            <span className={cn('font-mono text-mono-2xs tabular-nums', on ? 'text-accent-text' : 'text-fg-subtle')}>
              {it.n}px
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ── 7 · Motion vocabulary — a dot fades + translates on a loop ──────────────────────────────── */
function MotionInset() {
  const reduced = useReducedMotion()
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="flex h-10 items-center gap-2">
        {[0, 1, 2].map((d) => (
          <motion.span
            key={d}
            className="h-2.5 w-2.5 rounded-sm bg-accent"
            initial={{ opacity: 0.3, y: 6 }}
            animate={reduced ? { opacity: 0.9, y: 0 } : { opacity: [0.3, 1, 0.3], y: [6, 0, 6] }}
            transition={reduced ? { duration: 0 } : { duration: 1.8, repeat: Infinity, delay: d * 0.18, ease: EASE_OUT }}
          />
        ))}
      </div>
      <div className="h-1.5 w-32 max-w-full overflow-hidden rounded-sm bg-inset">
        <motion.div
          className="h-full rounded-sm bg-accent"
          initial={{ width: '12%' }}
          animate={reduced ? { width: '100%' } : { width: ['12%', '100%', '12%'] }}
          transition={reduced ? { duration: 0 } : { duration: 3.4, repeat: Infinity, ease: EASE_OUT }}
        />
      </div>
    </div>
  )
}

/* ── 8 · Colour · Light theme — the Atlas Blue swatch trio ───────────────────────────────────── */
function ColourInset() {
  return (
    <div className="flex h-full items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent-soft text-accent-text">
        <Palette className="h-5 w-5" strokeWidth={1.5} aria-hidden />
      </span>
      <div className="flex gap-1.5">
        <span className="h-9 w-9 rounded-sm bg-accent shadow-sm" title="Atlas Blue" />
        <span className="h-9 w-9 rounded-sm border border-border bg-canvas" title="Canvas white" />
        <span className="h-9 w-9 rounded-sm bg-fg" title="Ink" />
      </div>
    </div>
  )
}

/* ── Section ─────────────────────────────────────────────────────────────────────────────────── */
export function SystemBento() {
  return (
    <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[184px]" amount={0.08}>
      {/* Token architecture — tall hero, top-left */}
      <StaggerItem className="md:col-start-1 md:col-span-2 md:row-start-1 md:row-span-2">
        <TiltCard className="h-full">
          <ArchitectureCell />
        </TiltCard>
      </StaggerItem>

      {/* Typography */}
      <StaggerItem className="md:col-start-3 md:col-span-2 md:row-start-1">
        <TiltCard className="h-full">
          <Cell
            title="Typography"
            desc="Spline Sans for voice, Anonymous Pro for labels — one ramp, blue owns the highlight."
          >
            <TypeRampInset />
          </Cell>
        </TiltCard>
      </StaggerItem>

      {/* Verified AA — tall, top-right */}
      <StaggerItem className="md:col-start-5 md:col-span-2 md:row-start-1 md:row-span-2">
        <TiltCard className="h-full">
          <Cell
            title="Verified contrast"
            desc="Every semantic pair is checked against WCAG AA on each build — 21 of 21 pass."
          >
            <ContrastInset />
          </Cell>
        </TiltCard>
      </StaggerItem>

      {/* Three-layer tokens */}
      <StaggerItem className="md:col-start-3 md:col-span-2 md:row-start-2">
        <TiltCard className="h-full">
          <Cell
            title="Three-layer tokens"
            desc="primitive → semantic → component. Nothing hardcodes a value a token should own."
            tone="muted"
          >
            <TokenLayersInset />
          </Cell>
        </TiltCard>
      </StaggerItem>

      {/* Ruler / Sage archetype */}
      <StaggerItem className="md:col-start-1 md:col-span-2 md:row-start-3">
        <TiltCard className="h-full">
          <ArchetypeCell />
        </TiltCard>
      </StaggerItem>

      {/* Radius ladder */}
      <StaggerItem className="md:col-start-3 md:col-span-2 md:row-start-3">
        <TiltCard className="h-full">
          <Cell
            title="8px-max squircles"
            desc="A tight 2 / 4 / 6 / 8 corner ladder — crisp and software-grade, never a pill."
            tone="muted"
          >
            <RadiusInset />
          </Cell>
        </TiltCard>
      </StaggerItem>

      {/* Gentle motion */}
      <StaggerItem className="md:col-start-5 md:col-span-2 md:row-start-3">
        <TiltCard className="h-full">
          <Cell
            title="Gentle motion"
            desc="Fade, a small translate, a soft glow. Everything honours reduced-motion."
          >
            <MotionInset />
          </Cell>
        </TiltCard>
      </StaggerItem>

      {/* Light · Clarity */}
      <StaggerItem className="md:col-start-1 md:col-span-2 md:row-start-4">
        <TiltCard className="h-full">
          <Cell
            title="Light · Clarity"
            desc="One theme. Pure white with the Atlas Blue accent — matched to the production site."
          >
            <ColourInset />
          </Cell>
        </TiltCard>
      </StaggerItem>

      {/* Copy-anything CTA — wide closer */}
      <StaggerItem className="md:col-start-3 md:col-span-4 md:row-start-4">
        <TiltCard className="h-full" max={3}>
          <div className="flex h-full flex-col items-start justify-between gap-5 rounded-lg border border-border bg-elevated p-6 shadow-sm transition-[border-color,box-shadow] duration-base ease-out hover:border-border-strong hover:shadow-lg md:flex-row md:items-center md:p-7">
            <div className="flex flex-col gap-2.5">
              <Badge variant="blue" size="sm" dot>
                The showcase is the documentation
              </Badge>
              <h4 className="font-display text-title-md text-fg text-balance">Copy any token. Lift any component.</h4>
              <div className="flex flex-wrap items-center gap-2">
                {['--c-accent', '<Button>', '#33488F', '--radius-lg'].map((t) => (
                  <code
                    key={t}
                    className="rounded-sm border border-border bg-surface px-2 py-1 font-mono text-caption text-accent-text"
                  >
                    {t}
                  </code>
                ))}
              </div>
            </div>
            <Button variant="primary" size="md" className="shrink-0">
              Browse the system
              <ArrowRight width={18} height={18} strokeWidth={1.5} aria-hidden />
            </Button>
          </div>
        </TiltCard>
      </StaggerItem>
    </Stagger>
  )
}
