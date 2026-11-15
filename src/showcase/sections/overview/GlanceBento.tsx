/**
 * GlanceBento — "what the system is made of", as a live bento grid.
 *
 * Re-themed and re-contented from the reference "Bento Grid 01": the dark zinc cells become
 * white/`canvas-muted` token surfaces with hairline borders, and the stock loaders become small
 * demonstrations of the system itself — the type ramp, the three token layers, the verified AA
 * contrast, the motion vocabulary, the 8px radius steps, and the parts count. Every animation runs
 * on the house EASE_OUT and freezes to a readable still under prefers-reduced-motion. 8px ceiling,
 * token-only, no glass.
 */
import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Stagger, StaggerItem, CountUp, EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

/* ── cell shell ─────────────────────────────────────────────────────────────── */
function Cell({
  title, desc, children, className, tone = 'surface',
}: {
  title: string; desc: string; children: React.ReactNode; className?: string; tone?: 'surface' | 'muted'
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -2 }}
      transition={{ duration: 0.24, ease: EASE_OUT }}
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-lg border border-border p-6 transition-[border-color,box-shadow] duration-base ease-out hover:border-border-strong hover:shadow-md',
        tone === 'muted' ? 'bg-canvas-muted' : 'bg-surface',
        className,
      )}
    >
      <div className="relative flex-1">{children}</div>
      <div className="mt-5">
        <h4 className="font-display text-title-sm text-fg">{title}</h4>
        <p className="mt-1 font-body text-body-sm leading-relaxed text-fg-muted">{desc}</p>
      </div>
    </motion.div>
  )
}

/* ── 1 · Type ramp — an Aa that eases through the real scale ──────────────────── */
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
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        className="font-display font-semibold leading-none text-fg"
        style={{ fontSize: reduced ? 'clamp(2.6rem,7vw,4rem)' : step.px }}
      >
        Aa<span className="text-highlight">a</span>
      </motion.span>
      <span className="font-mono text-mono-2xs uppercase tracking-[0.14em] text-fg-subtle">{reduced ? 'display-lg' : step.label}</span>
    </div>
  )
}

/* ── 2 · Three token layers — a highlight travels down the stack ─────────────── */
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

/* ── 3 · Verified AA — a count-up over calm concentric rings ──────────────────── */
function ContrastInset() {
  const reduced = useReducedMotion()
  return (
    <div className="relative flex h-full items-center justify-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {[0, 1, 2].map((r) => (
          <motion.span
            key={r}
            className="absolute rounded-sm border border-accent/25"
            style={{ width: 72, height: 72 }}
            initial={{ scale: 0.6, opacity: reduced ? 0.25 : 0.5 }}
            animate={reduced ? { scale: 1 + r * 0.6, opacity: 0.18 } : { scale: [0.6, 2.4], opacity: [0.5, 0] }}
            transition={reduced ? { duration: 0 } : { duration: 3.2, repeat: Infinity, delay: r * 1.05, ease: 'easeOut' }}
          />
        ))}
      </div>
      <div className="relative flex flex-col items-center">
        <span className="font-display text-display-sm font-semibold text-fg">
          <CountUp to={21} duration={1.6} />/21
        </span>
        <span className="mt-1 font-mono text-mono-2xs uppercase tracking-[0.16em] text-accent-text">AA pairs pass</span>
      </div>
    </div>
  )
}

/* ── 4 · Motion vocabulary — a dot fades + translates on a loop ───────────────── */
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

/* ── 5 · Radius ladder — 2 / 4 / 6 / 8, highlighted in turn ───────────────────── */
const RADII = [
  { r: 'rounded-xs', n: '2' }, { r: 'rounded-sm', n: '4' }, { r: 'rounded-md', n: '6' }, { r: 'rounded-lg', n: '8' },
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
                'h-12 w-12 border-2 transition-colors duration-base ease-out', it.r,
                on ? 'border-accent bg-accent-soft' : 'border-border-strong bg-surface',
              )}
            />
            <span className={cn('font-mono text-mono-2xs tabular-nums', on ? 'text-accent-text' : 'text-fg-subtle')}>{it.n}px</span>
          </div>
        )
      })}
    </div>
  )
}

/* ── 6 · The parts — a row of hairline glyph chips ────────────────────────────── */
const PARTS: { d: string; label: string }[] = [
  { label: 'Buttons', d: 'M3 8.3h18v7.4H3z' },
  { label: 'Cards', d: 'M3.3 8h12v11h-12zM8.7 4h12v11h-12z' },
  { label: 'Tables', d: 'M3 5h18v14H3zM3 10h18M9 5v14' },
  { label: 'Charts', d: 'M4 19V11M11 19V5M18 19V13' },
  { label: 'Forms', d: 'M3 6h18v5H3zM3 15h11' },
  { label: 'Widgets', d: 'M4 16a8 8 0 0 1 16 0' },
]
function PartsInset() {
  const reduced = useReducedMotion()
  return (
    <div className="flex h-full flex-wrap items-center justify-center gap-3">
      {PARTS.map((p, idx) => (
        <motion.span
          key={p.label}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: EASE_OUT, delay: idx * 0.06 }}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="text-accent" aria-hidden>
            <path d={p.d} />
          </svg>
          <span className="font-mono text-mono-2xs uppercase tracking-[0.1em] text-fg-muted">{p.label}</span>
        </motion.span>
      ))}
    </div>
  )
}

export function GlanceBento() {
  return (
    <Stagger
      className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[190px]"
      amount={0.1}
    >
      <StaggerItem className="md:col-start-1 md:col-span-2 md:row-start-1 md:row-span-2">
        <Cell title="Typography" desc="Spline Sans for voice, Anonymous Pro for labels — one ramp, blue owns the highlight.">
          <TypeRampInset />
        </Cell>
      </StaggerItem>

      <StaggerItem className="md:col-start-3 md:col-span-2 md:row-start-1">
        <Cell title="Three-layer tokens" desc="primitive → semantic → component. Nothing hardcodes a value a token should own." tone="muted">
          <TokenLayersInset />
        </Cell>
      </StaggerItem>

      <StaggerItem className="md:col-start-5 md:col-span-2 md:row-start-1 md:row-span-2">
        <Cell title="Verified contrast" desc="Every semantic pair is checked against WCAG AA on each build — 21 of 21 pass.">
          <ContrastInset />
        </Cell>
      </StaggerItem>

      <StaggerItem className="md:col-start-3 md:col-span-2 md:row-start-2">
        <Cell title="Gentle motion" desc="Fade, a small translate, a soft glow. Everything honours reduced-motion." tone="muted">
          <MotionInset />
        </Cell>
      </StaggerItem>

      <StaggerItem className="md:col-start-1 md:col-span-3 md:row-start-3">
        <Cell title="8px-max squircles" desc="A tight 2 / 4 / 6 / 8 corner ladder — crisp and software-grade, never a pill.">
          <RadiusInset />
        </Cell>
      </StaggerItem>

      <StaggerItem className="md:col-start-4 md:col-span-3 md:row-start-3">
        <Cell title="One kit of parts" desc="Buttons, cards, tables, charts, forms and widgets — all composed from the same tokens." tone="muted">
          <PartsInset />
        </Cell>
      </StaggerItem>
    </Stagger>
  )
}
