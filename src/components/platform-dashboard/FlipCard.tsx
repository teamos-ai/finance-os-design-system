/**
 * FlipCard — a reduced-motion-safe 3D flip between a front and a back face.
 *
 * Non-reduced: the inner wrapper rotates on Y (preserve-3d) and backface-visibility hides
 * the away side, resting at a subtle 3D tilt (rotateX 3° / rotateY -6°, matching
 * brand.financeos.au) that straightens as it flips. On the dashboard face it also follows the
 * mouse — a gentle cursor-parallax tilt (±5°, FT 10, matching the brand page) that settles back
 * to the rest tilt when the pointer leaves. Reduced-motion: no rotation — the faces cross-fade,
 * and the back face is left un-rotated so its text never renders mirrored. Both faces are
 * grid-stacked into one cell, so the card sizes to the TALLER face with no fixed height. Motion
 * is transform / opacity only, ease-out, Finance OS durations. No glass.
 */
import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

export interface FlipCardProps {
  /** true shows the back face */
  flipped: boolean
  front: ReactNode
  back: ReactNode
  className?: string
}

/** Cursor-follow tilt amplitude (deg) — matches brand.financeos.au (FT 10 → ±5° per axis). */
const TILT = 10

export function FlipCard({ flipped, front, back, className }: FlipCardProps) {
  const reduced = useReducedMotion()
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)

  // Resting tilt matches the reference, but is dropped on narrow screens (≤600px) where the
  // reference also sits the card flat — a steep tilt reads as skew on a phone.
  const [flat, setFlat] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 600px)')
    const sync = () => setFlat(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  const restX = flat ? 0 : 3
  const restY = flat ? 0 : -6

  // rotateX / rotateY drive the resting tilt, the cursor-follow AND the flip. Motion values, so
  // the pointer-follow retargets the transform without a React re-render.
  const rotateX = useMotionValue(restX)
  const rotateY = useMotionValue(restY)

  // Rest ↔ flip (700ms ease-out). Reduced-motion: no rotation — the faces cross-fade, so hold flat.
  useEffect(() => {
    if (reduced) {
      rotateX.set(0)
      rotateY.set(0)
      return
    }
    const cx = animate(rotateX, flipped ? 0 : restX, { duration: 0.7, ease: EASE_OUT })
    const cy = animate(rotateY, flipped ? 180 : restY, { duration: 0.7, ease: EASE_OUT })
    return () => {
      cx.stop()
      cy.stop()
    }
  }, [flipped, reduced, restX, restY, rotateX, rotateY])

  // Cursor-follow tilt — mouse only, dashboard face only (never while flipped / flat / reduced).
  const follow = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced || flat || flipped || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const tx = ((e.clientY - r.top) / r.height - 0.5) * -TILT
    const ty = ((e.clientX - r.left) / r.width - 0.5) * TILT
    animate(rotateX, tx, { duration: 0.18, ease: EASE_OUT })
    animate(rotateY, ty, { duration: 0.18, ease: EASE_OUT })
  }
  const release = () => {
    if (reduced || flat || flipped) return
    animate(rotateX, restX, { duration: 0.7, ease: EASE_OUT })
    animate(rotateY, restY, { duration: 0.7, ease: EASE_OUT })
  }

  // Take the away face out of the tab order, pointer events and the a11y tree in one. `inert`
  // is set imperatively: the DOM property is typed under React 18, the JSX prop is not.
  useLayoutEffect(() => {
    if (frontRef.current) frontRef.current.inert = flipped
    if (backRef.current) backRef.current.inert = !flipped
  }, [flipped])

  return (
    <div className={cn('grid', className)} style={{ perspective: '1600px' }}>
      <motion.div
        className="grid"
        style={{ transformStyle: 'preserve-3d', rotateX, rotateY }}
        onPointerMove={follow}
        onPointerLeave={release}
      >
        <div
          ref={frontRef}
          className="min-w-0"
          style={{
            gridArea: '1 / 1',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            opacity: reduced ? (flipped ? 0 : 1) : 1,
            transition: reduced ? 'opacity 0.3s ease' : undefined,
          }}
        >
          {front}
        </div>
        <div
          ref={backRef}
          className="min-w-0"
          style={{
            gridArea: '1 / 1',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: reduced ? undefined : 'rotateY(180deg)',
            opacity: reduced ? (flipped ? 1 : 0) : 1,
            transition: reduced ? 'opacity 0.3s ease' : undefined,
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  )
}
