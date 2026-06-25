/**
 * PdfModal — a pop-up that opens a PDF in a scrollable embedded viewer with a Download
 * action. Backdrop + Esc close, body scroll lock while open, gentle scale/fade pop
 * (reduced-motion safe). The PDF scrolls inside the native browser viewer (iframe).
 */
import * as React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, Download } from 'lucide-react'

export interface PdfModalProps {
  open: boolean
  onClose: () => void
  title: string
  /** path to the PDF, e.g. "/docs/business-plan.pdf" */
  src: string
}

export function PdfModal({ open, onClose, title, src }: PdfModalProps) {
  const reduced = useReducedMotion()

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
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
            className="relative flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-lg"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between gap-3 border-b border-border bg-surface px-5 py-3">
              <p className="truncate font-display text-title-sm text-fg">{title}</p>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={src}
                  download
                  className="inline-flex items-center gap-2 rounded-md border border-accent-text px-3 py-1.5 font-mono text-caption text-accent-text transition-colors hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Download className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                  Download
                </a>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={onClose}
                  className="grid h-8 w-8 place-items-center rounded-md text-fg-subtle transition-colors hover:bg-canvas-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-hidden bg-inset">
              <iframe src={`${src}#view=FitH`} title={title} className="h-full w-full border-0" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
