/**
 * CelebrationButton — Finance OS.
 *
 * A gradient button (theme-accent signature fill) that throws a small shower of thin
 * coloured streamers on click — they fly up from the button's top-centre, then arc back
 * down and fade. The streamer palette is sourced from the brand PRIMITIVE tokens (gold,
 * amber, deep Atlas-blue) so the burst reads luxe, on-brand and rogue-hex-free. Honours
 * `prefers-reduced-motion`: reduced users get NO streamers (the click still works).
 * Per-click keyed bursts (a seq ref) support rapid re-clicks; each burst self-cleans after
 * the animation. The burst layer is aria-hidden and never intercepts clicks. A CSS @media
 * gate (.btn-celebrate-particle) is a belt-and-braces fallback so particles never animate
 * even if the JS guard is ever bypassed.
 */
import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Button, type ButtonProps } from '@/components/ui/button'
import { EASE_OUT } from '@/lib/motion'

/* Streamer ribbon palette — read from the brand PRIMITIVE tokens (theme-independent), so
   confetti stays on-brand with zero rogue hex: gold, amber and a deep Atlas-blue for depth. */
const STREAMER_VARS = ['--p-gold-300', '--p-amber-300', '--p-gold-200', '--p-amber-200', '--p-gold-400', '--p-blue-500']
function streamerColors(): string[] {
  if (typeof document === 'undefined') return ['#EEBA2B']
  const cs = getComputedStyle(document.documentElement)
  return STREAMER_VARS.map((v) => cs.getPropertyValue(v).trim() || '#EEBA2B')
}

interface Streamer {
  id: number
  w: number // px width of the thin rect
  h: number // px height
  color: string
  x: number // horizontal drift (px)
  up: number // peak rise (px)
  fall: number // distance it drops past the start (px)
  rotate: number // total spin (deg)
  delay: number // small stagger (s)
}

interface Burst {
  key: number
  streamers: Streamer[]
}

export interface CelebrationButtonProps extends Omit<ButtonProps, 'variant'> {
  /** Number of streamers in a full-motion burst. Default 18. */
  particleCount?: number
}

export const CelebrationButton = React.forwardRef<HTMLButtonElement, CelebrationButtonProps>(
  ({ particleCount = 18, onClick, children, className, ...props }, ref) => {
    const reduced = useReducedMotion()
    const [bursts, setBursts] = React.useState<Burst[]>([])
    const seq = React.useRef(0)
    const timers = React.useRef<number[]>([])

    // Clear any in-flight burst-cleanup timers if the button unmounts mid-animation.
    React.useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

    const fire = (e: React.MouseEvent<HTMLButtonElement>) => {
      const key = seq.current++
      // Reduced motion → no streamers at all (the action still fires below).
      const count = reduced ? 0 : particleCount
      const palette = streamerColors()
      const streamers: Streamer[] = Array.from({ length: count }, (_, i) => ({
        id: i,
        w: 4 + Math.random() * 4, // 4–8px
        h: 10 + Math.random() * 10, // 10–20px
        color: palette[i % palette.length],
        x: (Math.random() - 0.5) * 320, // ±160px
        up: 70 + Math.random() * 90, // 70–160px
        fall: 60 + Math.random() * 80, // 60–140px
        rotate: (Math.random() - 0.5) * 1080, // ±540°
        delay: Math.random() * 0.12,
      }))
      setBursts((b) => [...b, { key, streamers }])
      const id = window.setTimeout(() => {
        setBursts((b) => b.filter((x) => x.key !== key))
        timers.current = timers.current.filter((t) => t !== id)
      }, 1500)
      timers.current.push(id)
      onClick?.(e)
    }

    return (
      <span className="relative inline-flex">
        <Button ref={ref} variant="gradient" onClick={fire} className={className} {...props}>
          {children}
        </Button>

        {/* burst layer — pinned to the button's top-centre, never intercepts clicks */}
        <span aria-hidden className="pointer-events-none absolute left-1/2 top-1 z-10 h-0 w-0">
          {bursts.map((burst) =>
            burst.streamers.map((p) => (
              <motion.span
                key={`${burst.key}-${p.id}`}
                className="btn-celebrate-particle absolute rounded-[1px] will-change-transform"
                style={{
                  width: p.w,
                  height: p.h,
                  backgroundColor: p.color,
                  translateX: '-50%',
                }}
                initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  x: [0, p.x * 0.4, p.x * 0.8, p.x],
                  y: [0, -p.up, -p.up * 0.3, p.fall],
                  rotate: [0, p.rotate * 0.3, p.rotate * 0.7, p.rotate],
                }}
                transition={{ duration: 1.2, ease: EASE_OUT, times: [0, 0.25, 0.7, 1], delay: p.delay }}
              />
            ))
          )}
        </span>
      </span>
    )
  }
)
CelebrationButton.displayName = 'CelebrationButton'
