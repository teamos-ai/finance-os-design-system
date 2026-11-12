/**
 * DemoVideoModal — opens the Finance OS product demo in a centred modal. Backdrop + Esc
 * close, body scroll-lock while open, gentle scale/fade pop (reduced-motion safe). The
 * video sits in a flat hairline frame on the inverse surface; closing unmounts the node,
 * which stops playback. Patterned on src/components/ui/pdf-modal.tsx. 8px squircle, no glass.
 */
import * as React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'

export interface DemoVideoModalProps {
  open: boolean
  onClose: () => void
  title: string
  /** direct URL to the demo .mp4 */
  src: string
}

export function DemoVideoModal({ open, onClose, title, src }: DemoVideoModalProps) {
  const reduced = useReducedMotion()
  const dialogRef = React.useRef<HTMLDivElement>(null)
  const closeRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return
      // Trap Tab within the dialog so focus can't wander to the still-mounted page behind it.
      const items = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select, video, [tabindex]:not([tabindex="-1"])',
        ),
      )
      if (items.length === 0) {
        e.preventDefault()
        dialog.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || !dialog.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (active === last || !dialog.contains(active))) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Move focus into the dialog once it has mounted; restore it to the opener on close.
    const raf = requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      cancelAnimationFrame(raf)
      previouslyFocused?.focus?.()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default bg-overlay" />

          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-lg focus:outline-none"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between gap-3 border-b border-border bg-surface px-5 py-3">
              <p className="truncate font-display text-title-sm text-fg">{title}</p>
              <button
                ref={closeRef}
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-md text-fg-subtle transition-colors hover:bg-canvas-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.96]"
              >
                <X className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </button>
            </header>

            <div className="bg-inverse">
              <video
                src={src}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="block aspect-video h-auto w-full bg-inverse object-contain"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
