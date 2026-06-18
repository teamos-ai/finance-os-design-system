/**
 * Disclosure — a calm accordion. Smooth height-auto expand/collapse via Framer
 * AnimatePresence, a chevron that rotates, gold focus ring. Reduced-motion safe
 * (snaps open/closed). 8px squircle, flat hairline, zero glass.
 */
import * as React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { EASE_OUT } from '@/lib/motion'

export interface DisclosureProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

export const Disclosure = ({ title, children, defaultOpen = false, className }: DisclosureProps) => {
  const [open, setOpen] = React.useState(defaultOpen)
  const reduced = useReducedMotion()
  return (
    <div className={cn('overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3.5 text-left font-display text-title-md text-fg transition-colors duration-fast hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 text-fg-subtle transition-transform duration-base ease-out', open && 'rotate-180')}
          strokeWidth={1.5}
          aria-hidden
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduced ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 font-body text-body-md leading-relaxed text-fg-muted">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
