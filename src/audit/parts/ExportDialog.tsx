/**
 * ExportDialog — get the audit out of the browser.
 *
 * Markdown carries the db-finance-os frontmatter so the record commits straight into a
 * client folder; JSON is the lossless copy. Both are previewed before they leave, because
 * the thing being exported is a record of what a real person said about their business.
 */
import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, Copy, Download, X } from 'lucide-react'
import type { Part, Session } from '@/audit/types'
import { copyToClipboard, download, exportFilename, toJSON, toMarkdown } from '@/audit/export'
import { Button } from '@/components/ui/button'
import { SegmentedControl } from '@/components/ui/segmented'
import { MonoLabel } from '@/components/ui/mono-label'
import { EASE_OUT } from '@/lib/motion'

type Format = 'markdown' | 'json'

export interface ExportDialogProps {
  open: boolean
  onClose: () => void
  session: Session
  parts: Part[]
}

export function ExportDialog({ open, onClose, session, parts }: ExportDialogProps) {
  const [format, setFormat] = React.useState<Format>('markdown')
  const [copied, setCopied] = React.useState(false)
  const reduced = useReducedMotion()

  const contents = React.useMemo(
    () => (format === 'markdown' ? toMarkdown(session, parts) : toJSON(session, parts)),
    [format, session, parts],
  )

  React.useEffect(() => {
    if (!open) setCopied(false)
  }, [open])

  React.useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(id)
  }, [copied])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Export this audit"
        >
          <motion.div
            className="flex max-h-[86vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-lg"
            initial={reduced ? false : { opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.99 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5">
              <MonoLabel tone="accent">Export the record</MonoLabel>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-md text-fg-subtle transition-colors duration-fast hover:bg-selected hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
              <SegmentedControl
                size="sm"
                aria-label="Export format"
                options={[
                  { value: 'markdown', label: 'Markdown' },
                  { value: 'json', label: 'JSON' },
                ]}
                value={format}
                onValueChange={(v) => setFormat(v as Format)}
              />
              <span className="font-mono text-caption text-fg-subtle">
                {exportFilename(session, format === 'markdown' ? 'md' : 'json')}
              </span>
            </div>

            <pre className="flex-1 overflow-auto bg-inset px-5 py-4 font-mono text-body-sm leading-relaxed text-fg-muted">
              {contents}
            </pre>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3.5">
              <p className="font-body text-caption text-fg-subtle">
                Everything below is what the client reported. None of it is verified, and none of it
                is a claim.
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void copyToClipboard(contents).then(setCopied)
                  }}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                  ) : (
                    <Copy className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                  )}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    download(
                      exportFilename(session, format === 'markdown' ? 'md' : 'json'),
                      contents,
                      format === 'markdown' ? 'text/markdown' : 'application/json',
                    )
                  }
                >
                  <Download className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                  Download
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
