/**
 * Motion primitives — Finance OS's quiet Framer Motion vocabulary.
 *
 * Every primitive honours `prefers-reduced-motion`. Vocabulary = fade + small
 * translate + gentle marquee + soft hover lift + count-up + signature amber glow.
 * No bounce / wobble / elastic / autoplay. Durations stay subtle (<= 480ms).
 * Use at most ONE reveal per viewport band so the page reads calm.
 *
 * Exports: FadeIn · Stagger · StaggerItem · CountUp · HoverLift · Glow · BorderGlow ·
 *          BreathingDot · Marquee · Reveal · GradientShimmer · EASE_OUT
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

export const EASE_OUT = [0.22, 1, 0.36, 1] as const

/* ── FadeIn — viewport fade + small translate-up ───────────────────────────── */
export interface FadeInProps {
  delay?: number
  y?: number
  className?: string
  children: React.ReactNode
  as?: 'div' | 'section' | 'span' | 'li' | 'header' | 'p'
}
export const FadeIn = ({ delay = 0, y = 10, className, children, as = 'div' }: FadeInProps) => {
  const reduced = useReducedMotion()
  const MotionTag = motion[as] as React.ElementType
  return (
    <MotionTag
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: EASE_OUT, delay }}
    >
      {children}
    </MotionTag>
  )
}

/* ── Stagger container + item ──────────────────────────────────────────────── */
const containerVariants: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
}
export const Stagger = ({
  className,
  children,
  amount = 0.15,
}: {
  className?: string
  children: React.ReactNode
  amount?: number
}) => {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial={reduced ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount }}
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
  className?: string
}
export const CountUp = ({ to, duration = 1.4, decimals = 0, prefix = '', suffix = '', className }: CountUpProps) => {
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

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {value.toFixed(decimals)}
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
    <motion.div className={className} whileHover={reduced ? undefined : { y }} transition={{ duration: 0.24, ease: EASE_OUT }}>
      {children}
    </motion.div>
  )
}

/* ── Glow — signature amber/amber radial wash behind a hero/banner ──────────────
   Pure CSS radial gradients at low alpha, blurred. aria-hidden, no pointer events. */
export const Glow = ({ className }: { className?: string }) => (
  <div aria-hidden className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}>
    <div
      className="absolute left-1/2 top-[-18%] h-[620px] w-[min(1100px,120%)] -translate-x-1/2 rounded-sm blur-3xl opacity-70"
      style={{
        background:
          'radial-gradient(closest-side, rgba(230, 138, 0,0.30), rgba(230,138,0,0.14) 55%, transparent 75%)',
      }}
    />
  </div>
)

/* ── BorderGlow — animated amber sweep around an accent surface ─────────────── */
export const BorderGlow = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  const reduced = useReducedMotion()
  return (
    <div className={cn('relative', className)}>
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-lg opacity-60"
          style={{ background: 'conic-gradient(from 0deg, transparent, rgba(230, 138, 0,0.5), transparent 30%)' }}
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
      initial={reduced ? false : { opacity: 0, y: 14, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  )
}

/* ── GradientShimmer — gentle moving amber→amber sheen on text/labels ───────── */
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
