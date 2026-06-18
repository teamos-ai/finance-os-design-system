/**
 * SaveButton — Finance OS.
 *
 * A amber accent CTA (`variant="primary"`) that, on click, sends up a few small green
 * check chips that rise and fade — the calm "saved" confirmation. Reuses the Finance
 * success token for the chip skin so it themes per mode with no rogue colour. Honours
 * `prefers-reduced-motion`: reduced users get at most two ticks with no travel (a gentle
 * pop in place, no particles). Per-click keyed bursts support rapid re-clicks; each burst
 * self-cleans after the animation, and any in-flight timers are cleared on unmount. The
 * burst layer is aria-hidden and never intercepts clicks.
 */
import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button, type ButtonProps } from '@/components/ui/button'
import { EASE_OUT } from '@/lib/motion'

interface Tick {
  id: number
  x: number // horizontal drift (px)
  rise: number // distance risen (px)
  delay: number // stagger (s)
}

interface Burst {
  key: number
  ticks: Tick[]
}

export interface SaveButtonProps extends Omit<ButtonProps, 'variant'> {
  /** Number of check chips in a full-motion burst. Default 4. */
  tickCount?: number
}

export const SaveButton = React.forwardRef<HTMLButtonElement, SaveButtonProps>(
  ({ tickCount = 4, onClick, children, className, ...props }, ref) => {
    const reduced = useReducedMotion()
    const [bursts, setBursts] = React.useState<Burst[]>([])
    const seq = React.useRef(0)
    const timers = React.useRef<number[]>([])

    React.useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

    const fire = (e: React.MouseEvent<HTMLButtonElement>) => {
      const key = seq.current++
      const count = reduced ? Math.min(2, tickCount) : tickCount
      const ticks: Tick[] = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: reduced ? 0 : (Math.random() - 0.5) * 44, // ±22px
        rise: reduced ? 0 : 34 + Math.random() * 16, // 34–50px
        delay: reduced ? 0 : i * 0.08,
      }))
      setBursts((b) => [...b, { key, ticks }])
      const id = window.setTimeout(() => {
        setBursts((b) => b.filter((x) => x.key !== key))
        timers.current = timers.current.filter((t) => t !== id)
      }, 1100)
      timers.current.push(id)
      onClick?.(e)
    }

    return (
      <span className="relative inline-flex">
        <Button ref={ref} variant="primary" onClick={fire} className={className} {...props}>
          {children}
        </Button>

        {/* tick layer — pinned to the button's top-centre, never intercepts clicks */}
        <span aria-hidden className="pointer-events-none absolute left-1/2 top-1 z-10 h-0 w-0">
          {bursts.map((burst) =>
            burst.ticks.map((t) => (
              <motion.span
                key={`${burst.key}-${t.id}`}
                className="absolute flex h-6 w-6 items-center justify-center rounded-md bg-success-soft text-success shadow-sm will-change-transform"
                style={{ translateX: '-50%' }}
                initial={{ opacity: 0, x: t.x, y: 0, scale: 0.4 }}
                animate={
                  reduced
                    ? { opacity: [0, 1, 1, 0], scale: [0.4, 1, 1, 0.9] }
                    : {
                        opacity: [0, 1, 1, 0],
                        scale: [0.4, 1, 1, 0.9],
                        x: t.x,
                        y: [0, -t.rise * 0.7, -t.rise, -t.rise],
                      }
                }
                transition={{ duration: 0.9, ease: EASE_OUT, times: [0, 0.25, 0.7, 1], delay: t.delay }}
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              </motion.span>
            )),
          )}
        </span>
      </span>
    )
  },
)
SaveButton.displayName = 'SaveButton'
