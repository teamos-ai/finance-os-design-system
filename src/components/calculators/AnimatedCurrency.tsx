/**
 * AnimatedCurrency — the calculators' headline figure. On first scroll-in it counts
 * up from zero to the value (grouped AUD), then tracks the live value instantly as
 * inputs change, so the reveal reads as a moment but typing stays snappy. Reduced-motion
 * shows the figure immediately. `tabular-nums` keeps the digits from shifting width.
 */
import * as React from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { aud0 } from '@/components/calculators/finance'
import { cn } from '@/lib/cn'

export interface AnimatedCurrencyProps {
  value: number
  /** reveal count-up duration (ms) */
  duration?: number
  className?: string
}

export function AnimatedCurrency({ value, duration = 900, className }: AnimatedCurrencyProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduced = useReducedMotion()
  const latest = React.useRef(value)
  latest.current = value
  const [display, setDisplay] = React.useState(0)
  const [done, setDone] = React.useState(false)

  React.useEffect(() => {
    if (reduced) {
      setDone(true)
      return
    }
    if (!inView || done) return
    const target = latest.current
    let raf = 0
    let start = 0
    const step = (ts: number) => {
      if (!start) start = ts
      const t = Math.min(1, (ts - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(target * eased)
      if (t < 1) raf = requestAnimationFrame(step)
      else setDone(true)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, done, duration])

  const shown = done || reduced ? value : display
  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {aud0(shown)}
    </span>
  )
}
