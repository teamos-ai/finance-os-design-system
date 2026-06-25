/**
 * PlanCard — a 3D-tilt card (mouse-driven rotateX/Y springs) with an on-brand gradient
 * + accent wash and an icon well. The action button opens the plan in a PdfModal.
 * 8px squircle, token-only, reduced-motion safe (tilt disabled when reduced).
 */
import * as React from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface PlanCardProps {
  title: string
  subtitle: string
  Icon: LucideIcon
  actionText: string
  onAction: () => void
  className?: string
}

export function PlanCard({ title, subtitle, Icon, actionText, onAction, className }: PlanCardProps) {
  const reduced = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { damping: 16, stiffness: 150 })
  const sy = useSpring(my, { damping: 16, stiffness: 150 })
  const rotateX = useTransform(sy, [-0.5, 0.5], ['8deg', '-8deg'])
  const rotateY = useTransform(sx, [-0.5, 0.5], ['-8deg', '8deg'])

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const Z = (px: number) => (reduced ? undefined : { transform: `translateZ(${px}px)` })

  return (
    <motion.div
      onMouseMove={reduced ? undefined : onMove}
      onMouseLeave={onLeave}
      style={reduced ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={cn(
        'group relative flex h-72 flex-col justify-between overflow-hidden rounded-lg border border-border bg-gradient-to-br from-surface to-canvas-muted p-6 shadow-md',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,var(--c-accent-soft),transparent_60%)]"
      />

      <div style={Z(40)} className="relative">
        <span className="grid h-12 w-12 place-items-center rounded-md bg-accent-soft text-accent-text">
          <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
        </span>
      </div>

      <div style={Z(30)} className="relative">
        <h3 className="font-display text-title-lg text-fg">{title}</h3>
        <p className="mt-1 font-body text-body-sm leading-relaxed text-fg-muted">{subtitle}</p>
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 font-display font-medium text-accent-fg transition-all duration-fast ease-out hover:bg-accent-hover active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          {actionText}
        </button>
      </div>
    </motion.div>
  )
}
