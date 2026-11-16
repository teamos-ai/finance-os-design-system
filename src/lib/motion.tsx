/**
 * Motion primitives — Finance OS's quiet Framer Motion vocabulary.
 *
 * Calm precision: things arrive, land and hold. Every number comes from `motion-tokens.ts`
 * (= the `--dur-*` / `--ease-*` / `--rise-*` CSS tokens = the `motion-finance` skill's GSAP presets).
 * Every primitive honours `prefers-reduced-motion`. No bounce / elastic; no idle loops on content
 * (sanctioned loops: Marquee, BreathingDot, the halftone cloud drift, and the opt-in hero FloatWobble).
 * Use at most ONE reveal per viewport band so the page reads calm.
 *
 * Exports: FadeIn · FloatWobble · Stagger · StaggerItem · CountUp · HoverLift · Glow · BorderGlow ·
 *          BreathingDot · Marquee · Reveal · MaskReveal · DrawLine · GradientShimmer · EASE_OUT
 */
import * as React from 'react'
import {
  motion,
  useReducedMotion,
  useInView,
  useMotionValue,
  useAnimationFrame,
  wrap,
  type Variants,
} from 'framer-motion'
import { cn } from '@/lib/cn'
import { MOTION } from '@/lib/motion-tokens'

export const EASE_OUT = MOTION.ease.out

/* ── FadeIn — viewport fade + small translate-up ───────────────────────────── */
export interface FadeInProps {
  delay?: number
  y?: number
  className?: string
  children: React.ReactNode
  as?: 'div' | 'section' | 'span' | 'li' | 'header' | 'p'
}
export const FadeIn = ({ delay = 0, y = MOTION.rise.md, className, children, as = 'div' }: FadeInProps) => {
  const reduced = useReducedMotion()
  const MotionTag = motion[as] as React.ElementType
  return (
    <MotionTag
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={MOTION.viewport}
      transition={{ duration: MOTION.dur.slow, ease: EASE_OUT, delay }}
    >
      {children}
    </MotionTag>
  )
}

/* ── FloatWobble — a gentle, perpetual hover for the hero logo: a soft bob + tiny tilt.
   A deliberate, opt-in exception to the "no wobble" rule, reserved for the hero mark.
   Reduced-motion safe (renders static). */
export const FloatWobble = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      style={{ transformOrigin: '50% 50%' }}
      animate={{ y: [0, -9, 0], rotate: [-2.5, 2.5, -2.5] }}
      transition={{
        y: { duration: 4, ease: 'easeInOut', repeat: Infinity },
        rotate: { duration: 6, ease: 'easeInOut', repeat: Infinity },
      }}
    >
      {children}
    </motion.div>
  )
}

/* ── Stagger container + item ──────────────────────────────────────────────── */
const containerVariants: Variants = { hidden: {}, show: { transition: { staggerChildren: MOTION.stagger.base } } }
const itemVariants: Variants = {
  hidden: { opacity: 0, y: MOTION.rise.md },
  show: { opacity: 1, y: 0, transition: { duration: MOTION.dur.slow, ease: EASE_OUT } },
}
export const Stagger = ({
  className,
  children,
  amount,
}: {
  className?: string
  children: React.ReactNode
  /** visible fraction that triggers the reveal. Omit (recommended) to use the in-view margin. */
  amount?: number
}) => {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial={reduced ? false : 'hidden'}
      whileInView="show"
      viewport={amount == null ? MOTION.viewport : { once: true, amount }}
    >
      {children}
    </motion.div>
  )
}
export const StaggerItem = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <motion.div className={className} variants={itemVariants}>
    {children}
  </motion.div>
)

/* ── CountUp — animated number, in-view driven ─────────────────────────────── */
export interface CountUpProps {
  to: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  /** group the integer part with locale thousands separators (e.g. 126,941) */
  group?: boolean
  className?: string
}
export const CountUp = ({ to, duration = MOTION.dur.draw, decimals = 0, prefix = '', suffix = '', group = false, className }: CountUpProps) => {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduced = useReducedMotion()
  const [value, setValue] = React.useState(0)

  React.useEffect(() => {
    if (!inView) return
    if (reduced) {
      setValue(to)
      return
    }
    let raf = 0
    let start = 0
    const ms = duration * 1000
    const step = (ts: number) => {
      if (!start) start = ts
      const t = Math.min(1, (ts - start) / ms)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(to * eased)
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, to, duration])

  const formatted = group
    ? value.toLocaleString('en-AU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : value.toFixed(decimals)

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}

/* ── HoverLift — calm hover raise (no glass) ───────────────────────────────── */
export const HoverLift = ({
  className,
  children,
  y = -4,
}: {
  className?: string
  children: React.ReactNode
  y?: number
}) => {
  const reduced = useReducedMotion()
  return (
    <motion.div className={className} whileHover={reduced ? undefined : { y }} transition={{ duration: MOTION.dur.base, ease: EASE_OUT }}>
      {children}
    </motion.div>
  )
}

/* ── Glow — signature accent radial wash behind a hero/banner ──────────────────
   Via color-mix on --c-accent (Atlas Blue), low alpha, blurred.
   aria-hidden, no pointer events. */
export const Glow = ({ className }: { className?: string }) => (
  <div aria-hidden className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}>
    <div
      className="absolute left-1/2 top-[-18%] h-[620px] w-[min(1100px,120%)] -translate-x-1/2 rounded-sm blur-3xl opacity-70"
      style={{
        background:
          'radial-gradient(closest-side, color-mix(in srgb, var(--c-accent) 30%, transparent), color-mix(in srgb, var(--c-accent) 14%, transparent) 55%, transparent 75%)',
      }}
    />
  </div>
)

/* ── BorderGlow — animated accent sweep around an accent surface ────────────── */
export const BorderGlow = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  const reduced = useReducedMotion()
  return (
    <div className={cn('relative', className)}>
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-lg opacity-60"
          style={{ background: 'conic-gradient(from 0deg, transparent, color-mix(in srgb, var(--c-accent) 50%, transparent), transparent 30%)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, ease: 'linear', repeat: Infinity }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  )
}

/* ── BreathingDot — quiet pulsing status dot ───────────────────────────────── */
export const BreathingDot = ({ className }: { className?: string }) => {
  const reduced = useReducedMotion()
  return (
    <span className={cn('relative inline-flex h-2 w-2', className)}>
      {!reduced && (
        <motion.span
          className="absolute inline-flex h-full w-full rounded-sm bg-accent"
          animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
          transition={{ duration: 1.8, ease: 'easeOut', repeat: Infinity }}
        />
      )}
      <span className="relative inline-flex h-2 w-2 rounded-sm bg-accent" />
    </span>
  )
}

/* ── Reveal — in-view clip/opacity reveal for a single block ────────────────── */
export const Reveal = ({
  className,
  children,
  delay = 0,
}: {
  className?: string
  children: React.ReactNode
  delay?: number
}) => {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: MOTION.rise.md, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={MOTION.viewport}
      transition={{ duration: MOTION.dur.slower, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  )
}

/* ── MaskReveal — the headline entrance: each line slides up from behind its own mask.
   Pass one node per line. One Atlas-Blue keyword per headline (wrap it in `text-highlight`). */
export const MaskReveal = ({
  lines,
  className,
  lineClassName,
  delay = 0,
  as = 'h3',
}: {
  lines: React.ReactNode[]
  className?: string
  lineClassName?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
}) => {
  const reduced = useReducedMotion()
  const Tag = motion[as] as React.ElementType
  return (
    <Tag
      className={className}
      initial={reduced ? false : 'hidden'}
      whileInView="show"
      viewport={MOTION.viewport}
      variants={{ hidden: {}, show: { transition: { staggerChildren: MOTION.stagger.words + 0.02, delayChildren: delay } } }}
    >
      {lines.map((line, i) => (
        <span key={i} className={cn('block overflow-hidden pb-[0.08em]', lineClassName)}>
          <motion.span
            className="block"
            variants={{
              hidden: { y: '108%' },
              show: { y: '0%', transition: { duration: MOTION.dur.slower, ease: EASE_OUT } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/* ── DrawLine — an SVG path that draws on (charts, underlines, connectors).
   Render inside an <svg>; stroke colour / width come from the caller via className or props. */
export const DrawLine = ({
  d,
  className,
  delay = 0,
  duration = MOTION.dur.draw,
  strokeWidth = 2,
}: {
  d: string
  className?: string
  delay?: number
  duration?: number
  strokeWidth?: number
}) => {
  const reduced = useReducedMotion()
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial={reduced ? false : { pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={MOTION.viewport}
      transition={{
        pathLength: { duration, ease: MOTION.ease.inOut, delay },
        opacity: { duration: 0.01, delay },
      }}
    />
  )
}

/* ── GradientShimmer — gentle moving blue sheen on text/labels ───────── */
export const GradientShimmer = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  const reduced = useReducedMotion()
  return (
    <motion.span
      className={cn('bg-gradient-accent bg-clip-text text-transparent', className)}
      style={{ backgroundSize: '200% 100%' }}
      animate={reduced ? undefined : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
    >
      {children}
    </motion.span>
  )
}

/* ── Marquee — seamless, gentle, pause-on-hover, reduced-motion safe ───────── */
export interface MarqueeProps {
  children: React.ReactNode
  /** pixels per second */
  speed?: number
  reverse?: boolean
  pauseOnHover?: boolean
  className?: string
  gapClassName?: string
}
export const Marquee = ({
  children,
  speed = 36,
  reverse = false,
  pauseOnHover = true,
  className,
  gapClassName = 'gap-5',
}: MarqueeProps) => {
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const [copyWidth, setCopyWidth] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const firstCopyRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = firstCopyRef.current
    if (!el) return
    const measure = () => setCopyWidth(el.scrollWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [children])

  useAnimationFrame((_, delta) => {
    if (reduced || paused || copyWidth === 0) return
    const move = (delta / 1000) * speed * (reverse ? 1 : -1)
    const next = wrap(-copyWidth, 0, x.get() + move)
    x.set(next)
  })

  return (
    <div
      className={cn('overflow-hidden', className)}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      <motion.div className={cn('flex w-max flex-nowrap', gapClassName)} style={{ x }}>
        <div ref={firstCopyRef} className={cn('flex flex-nowrap', gapClassName)}>
          {children}
        </div>
        <div className={cn('flex flex-nowrap', gapClassName)} aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  )
}
