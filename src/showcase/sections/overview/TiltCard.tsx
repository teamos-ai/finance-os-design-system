/**
 * TiltCard — a premium cursor-parallax wrapper for bento cells.
 *
 * The card tilts gently toward the pointer (rotateX / rotateY on a spring), lifts a hair, and
 * settles flat when the pointer leaves. Mouse only — touch and `prefers-reduced-motion` get a plain,
 * static card. Transform only (GPU-composited); the child keeps its own border / shadow / 8px radius.
 * This is the one bespoke flourish the premium bento leans on — restrained, and never the only cue
 * (every cell also changes border + shadow on hover).
 */
import * as React from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 }

export function TiltCard({
  children,
  className,
  max = 5,
}: {
  children: React.ReactNode
  className?: string
  max?: number
}) {
  const reduced = useReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), SPRING)
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), SPRING)

  if (reduced) return <div className={className}>{children}</div>

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const reset = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900, willChange: 'transform' }}
      whileHover={{ scale: 1.012 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
