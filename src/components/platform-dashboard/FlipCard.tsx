/**
 * FlipCard — a reduced-motion-safe 3D flip between a front and a back face.
 *
 * Non-reduced: the inner wrapper rotates on Y (preserve-3d) and backface-visibility hides
 * the away side. Reduced-motion: no rotation — the faces cross-fade, and the back face is
 * left un-rotated so its text never renders mirrored. Both faces are grid-stacked into one
 * cell, so the card sizes to the TALLER face with no fixed height. Motion is transform /
 * opacity only, ease-out, Finance OS durations. No glass.
 */
import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

export interface FlipCardProps {
  /** true shows the back face */
  flipped: boolean
  front: ReactNode
  back: ReactNode
  className?: string
}

export function FlipCard({ flipped, front, back, className }: FlipCardProps) {
  const reduced = useReducedMotion()
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)

  // Take the away face out of the tab order, pointer events and the a11y tree in one. `inert`
  // is set imperatively: the DOM property is typed under React 18, the JSX prop is not.
  useLayoutEffect(() => {
    if (frontRef.current) frontRef.current.inert = flipped
    if (backRef.current) backRef.current.inert = !flipped
  }, [flipped])

  return (
    <div className={cn('grid', className)} style={{ perspective: '1800px' }}>
      <motion.div
        className="grid"
        style={{ transformStyle: 'preserve-3d' }}
        animate={reduced ? undefined : { rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
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
