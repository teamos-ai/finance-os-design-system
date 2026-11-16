/**
 * SystemBento — "the system at a glance" as ONE large, varied premium bento.
 *
 * A true bento: fixed-height rows on a 6-column grid with mixed col/row spans (a tall gradient
 * token-architecture hero, 2×2 feature tiles, a wide image-library strip, and a spread of compact
 * nav tiles) packed with grid-auto-flow:dense. Heights are LOCKED — the Typography cell gives its
 * animated Aa a fixed, roomy box so the ramp cycles without ever resizing the grid. Each cell rides
 * a cursor-parallax TiltCard, rests on a layered shadow and lifts on hover; figures count up / draw
 * in. The compact tiles point at the rest of the system (Image Library, Buttons, Logo, This vs That,
 * Layouts, Blogs, Lead Magnets). Atlas Blue + neutrals, 8px squircles, depth from glow + shadow
 * (never glass), no ribbons, reduced-motion safe.
 */
import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight, ArrowUpRight, Palette, ToggleLeft, Gem, Image as ImageIcon,
  SquareSplitHorizontal, Ruler, FileText, Magnet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MonoLabel } from '@/components/ui/mono-label'
import { Stagger, StaggerItem, CountUp, Glow, EASE_OUT } from '@/lib/motion'
import { PILLARS } from '@/data/system'
import { cn } from '@/lib/cn'
import { TiltCard } from './TiltCard'

/* ── shells ──────────────────────────────────────────────────────────────────────────────────── */

/** Standard cell — a visual inset above a title + description. Used in the taller (2-row) tiles. */
function Cell({
  title, desc, children, tone = 'surface', className,
}: {
  title: string; desc: React.ReactNode; children: React.ReactNode; tone?: 'surface' | 'muted'; className?: string
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

/** Compact nav tile — an icon well, a title that links to its section, a one-line note, and an
 *  optional mini visual. Sized to a single fixed row. */
function NavCell({
  icon: Icon, title, href, desc, tone = 'surface', children,
}: {
  icon: typeof Palette; title: string; href: string; desc: string; tone?: 'surface' | 'muted'; children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'group/nav flex h-full flex-col justify-between gap-3 overflow-hidden rounded-lg border border-border p-5 shadow-sm',
        'transition-[border-color,box-shadow] duration-base ease-out hover:border-border-strong hover:shadow-lg',
        tone === 'muted' ? 'bg-canvas-muted' : 'bg-surface',
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent-soft text-accent-text">
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        {children}
      </div>
      <div>
        <h4 className="font-display text-title-sm text-fg">
          <a href={href} className="inline-flex items-center gap-1 rounded-sm hover:text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas">
            {title}
            <ArrowUpRight className="h-3.5 w-3.5 text-fg-subtle transition-colors group-hover/nav:text-accent-text" strokeWidth={2} aria-hidden />
          </a>
        </h4>
        <p className="mt-0.5 font-body text-body-sm leading-relaxed text-fg-muted text-pretty">{desc}</p>
      </div>
    </div>
  )
}

/* ── 1 · Token architecture — the gradient hero spine ────────────────────────────────────────── */
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
        <MonoLabel tone="accent" dot className="text-accent-fg">Token architecture</MonoLabel>
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

/* ── 2 · Verified AA ─────────────────────────────────────────────────────────────────────────── */
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

/* ── 3 · Type ramp (locked inside a fixed, roomy cell) ───────────────────────────────────────── */
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
    // min-height holds the tallest glyph so the cell never resizes as the ramp cycles — on mobile
    // (single-column, auto-height rows) as well as on the fixed-row desktop grid.
    <div className="flex h-full min-h-[7rem] flex-col items-center justify-center gap-3">
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

/* ── 4 · Three token layers ──────────────────────────────────────────────────────────────────── */
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

/* ── 5 · Ruler / Sage archetype ──────────────────────────────────────────────────────────────── */
function ArchetypeCell() {
  const reduced = useReducedMotion()
  const [ruler, sage] = PILLARS
  return (
    <div className="flex h-full flex-col justify-between gap-4 rounded-lg border border-border bg-surface p-6 shadow-sm transition-[border-color,box-shadow] duration-base ease-out hover:border-border-strong hover:shadow-lg">
      <div className="flex items-center justify-between">
        <MonoLabel tone="brand" dot>Ruler-first</MonoLabel>
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
          <span className="text-accent-text">{ruler.name} <span className="tabular-nums">70</span></span>
          <span className="text-fg-subtle">{sage.name} <span className="tabular-nums">30</span></span>
        </div>
      </div>
      <p className="font-body text-body-sm leading-relaxed text-fg-muted text-pretty">
        Structure and authority — softened by the Sage's clarity.
      </p>
    </div>
  )
}

/* ── 6 · Radius ladder ───────────────────────────────────────────────────────────────────────── */
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
    <div className="flex h-full items-center justify-center gap-3 sm:gap-4">
      {RADII.map((it, idx) => {
        const on = reduced || idx === i
        return (
          <div key={it.n} className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                'h-10 w-10 border-2 transition-colors duration-base ease-out', it.r,
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

/* ── 7 · Motion vocabulary ───────────────────────────────────────────────────────────────────── */
function MotionInset() {
  const reduced = useReducedMotion()
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="flex h-8 items-center gap-2">
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
      <div className="h-1.5 w-28 max-w-full overflow-hidden rounded-sm bg-inset">
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

/* ── 8 · Image Library — a wide strip of backgrounds ─────────────────────────────────────────── */
const WASHES = ['var(--wash-mist)', 'var(--wash-haze)', 'var(--wash-tint)', 'var(--wash-deep)', 'var(--c-gradient-accent)']
function ImageLibraryCell() {
  return (
    <div className="group/img flex h-full flex-col justify-between gap-4 overflow-hidden rounded-lg border border-border bg-surface p-6 shadow-sm transition-[border-color,box-shadow] duration-base ease-out hover:border-border-strong hover:shadow-lg sm:flex-row sm:items-center">
      <div className="flex max-w-xs flex-col gap-1.5">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-accent-soft text-accent-text">
          <ImageIcon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        <h4 className="mt-1 font-display text-title-sm text-fg">
          <a href="#imagery" className="inline-flex items-center gap-1 rounded-sm hover:text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas">
            Image Library
            <ArrowUpRight className="h-3.5 w-3.5 text-fg-subtle transition-colors group-hover/img:text-accent-text" strokeWidth={2} aria-hidden />
          </a>
        </h4>
        <p className="font-body text-body-sm leading-relaxed text-fg-muted text-pretty">
          Searchable photos, plus live Aurora and Contour backgrounds.
        </p>
      </div>
      <div className="grid flex-1 grid-cols-5 gap-2">
        {WASHES.map((w, i) => (
          <span
            key={i}
            aria-hidden
            className="h-16 rounded-md border border-border-subtle sm:h-full sm:min-h-[72px]"
            style={{ background: w }}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Section ─────────────────────────────────────────────────────────────────────────────────── */
export function SystemBento() {
  return (
    <Stagger
      className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[188px] md:[grid-auto-flow:row_dense]"
      amount={0.06}
    >
      {/* Token architecture — tall gradient hero */}
      <StaggerItem className="md:col-span-2 md:row-span-3">
        <TiltCard className="h-full"><ArchitectureCell /></TiltCard>
      </StaggerItem>

      {/* Typography — 2×2 so the animated Aa has a fixed, roomy box (height stays locked) */}
      <StaggerItem className="md:col-span-2 md:row-span-2">
        <TiltCard className="h-full">
          <Cell title="Typography" desc="Spline Sans for voice, Anonymous Pro for labels — one ramp, blue owns the highlight.">
            <TypeRampInset />
          </Cell>
        </TiltCard>
      </StaggerItem>

      {/* Verified AA — 2×2 */}
      <StaggerItem className="md:col-span-2 md:row-span-2">
        <TiltCard className="h-full">
          <Cell title="Verified contrast" desc="Every semantic pair is checked against WCAG AA on each build — 21 of 21 pass.">
            <ContrastInset />
          </Cell>
        </TiltCard>
      </StaggerItem>

      {/* Three-layer tokens — 2×2 */}
      <StaggerItem className="md:col-span-2 md:row-span-2">
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

      {/* Ruler / Sage */}
      <StaggerItem className="md:col-span-2 md:row-span-1">
        <TiltCard className="h-full"><ArchetypeCell /></TiltCard>
      </StaggerItem>

      {/* Buttons */}
      <StaggerItem className="md:col-span-2 md:row-span-1">
        <TiltCard className="h-full">
          <NavCell icon={ToggleLeft} title="Buttons" href="#components" desc="Solid blue primary, blue-outline secondary.">
            <span className="flex items-center gap-1.5" aria-hidden>
              <span className="h-5 w-10 rounded-sm bg-accent" />
              <span className="h-5 w-8 rounded-sm border border-accent-text" />
            </span>
          </NavCell>
        </TiltCard>
      </StaggerItem>

      {/* Radius ladder */}
      <StaggerItem className="md:col-span-2 md:row-span-1">
        <TiltCard className="h-full">
          <Cell title="8px-max squircles" desc="A tight 2 / 4 / 6 / 8 corner ladder — never a pill." tone="muted">
            <RadiusInset />
          </Cell>
        </TiltCard>
      </StaggerItem>

      {/* Gentle motion */}
      <StaggerItem className="md:col-span-2 md:row-span-1">
        <TiltCard className="h-full">
          <Cell title="Gentle motion" desc="Fade, a small translate, a soft glow — all reduced-motion safe.">
            <MotionInset />
          </Cell>
        </TiltCard>
      </StaggerItem>

      {/* Light · Clarity */}
      <StaggerItem className="md:col-span-2 md:row-span-1">
        <TiltCard className="h-full">
          <NavCell icon={Palette} title="Colour" href="#color" desc="One Light theme — pure white + the Atlas Blue accent." tone="muted">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-7 w-7 rounded-sm bg-accent" />
              <span className="h-7 w-7 rounded-sm border border-border bg-canvas" />
              <span className="h-7 w-7 rounded-sm bg-fg" />
            </span>
          </NavCell>
        </TiltCard>
      </StaggerItem>

      {/* Logo */}
      <StaggerItem className="md:col-span-2 md:row-span-1">
        <TiltCard className="h-full">
          <NavCell icon={Gem} title="Logo" href="#logo" desc="The provided mark — never redrawn or recoloured.">
            <img src="/logo-square-blue.png" alt="" className="h-9 w-9 object-contain" />
          </NavCell>
        </TiltCard>
      </StaggerItem>

      {/* This vs That */}
      <StaggerItem className="md:col-span-2 md:row-span-1">
        <TiltCard className="h-full">
          <NavCell icon={SquareSplitHorizontal} title="This vs That" href="#this-vs-that" desc="Side-by-side comparisons, success vs danger." tone="muted">
            <span className="flex h-7 w-16 overflow-hidden rounded-sm border border-border" aria-hidden>
              <span className="h-full flex-1 bg-success-soft" />
              <span className="h-full flex-1 bg-danger-soft" />
            </span>
          </NavCell>
        </TiltCard>
      </StaggerItem>

      {/* Layouts */}
      <StaggerItem className="md:col-span-2 md:row-span-1">
        <TiltCard className="h-full">
          <NavCell icon={Ruler} title="Spacing & Layout" href="#spacing" desc="An 8px grid and a 12-column system.">
            <span className="grid grid-cols-3 gap-0.5" aria-hidden>
              {Array.from({ length: 9 }).map((_, i) => <span key={i} className="h-2 w-2 rounded-[1px] bg-accent-soft" />)}
            </span>
          </NavCell>
        </TiltCard>
      </StaggerItem>

      {/* Blogs */}
      <StaggerItem className="md:col-span-2 md:row-span-1">
        <TiltCard className="h-full">
          <NavCell icon={FileText} title="Blogs" href="#blogs" desc="Article templates + a related-posts grid." tone="muted">
            <span className="flex w-16 flex-col gap-1" aria-hidden>
              <span className="h-1 w-full rounded-full bg-border-strong" />
              <span className="h-1 w-4/5 rounded-full bg-border" />
              <span className="h-1 w-full rounded-full bg-border" />
            </span>
          </NavCell>
        </TiltCard>
      </StaggerItem>

      {/* Lead Magnets */}
      <StaggerItem className="md:col-span-2 md:row-span-1">
        <TiltCard className="h-full">
          <NavCell icon={Magnet} title="Lead Magnets" href="#leadmagnets" desc="Ebooks, checklists, quizzes — opt-in templates.">
            <span className="flex items-end gap-1" aria-hidden>
              <span className="h-6 w-4 rounded-sm bg-accent-soft" />
              <span className="h-8 w-4 rounded-sm bg-accent" />
              <span className="h-5 w-4 rounded-sm bg-accent-soft" />
            </span>
          </NavCell>
        </TiltCard>
      </StaggerItem>

      {/* Image Library — wide strip */}
      <StaggerItem className="md:col-span-4 md:row-span-1">
        <TiltCard className="h-full" max={3}><ImageLibraryCell /></TiltCard>
      </StaggerItem>

      {/* Copy-anything CTA — wide closer */}
      <StaggerItem className="md:col-span-6 md:row-span-1">
        <TiltCard className="h-full" max={2}>
          <div className="flex h-full flex-col items-start justify-between gap-5 rounded-lg border border-border bg-elevated p-6 shadow-sm transition-[border-color,box-shadow] duration-base ease-out hover:border-border-strong hover:shadow-lg md:flex-row md:items-center md:p-7">
            <div className="flex flex-col gap-2.5">
              <Badge variant="blue" size="sm" dot>The showcase is the documentation</Badge>
              <h4 className="font-display text-title-md text-fg text-balance">Copy any token. Lift any component.</h4>
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
          </div>
        </TiltCard>
      </StaggerItem>
    </Stagger>
  )
}
