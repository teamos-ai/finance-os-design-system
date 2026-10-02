/**
 * Jumper — ⌘K to any screen in the audit.
 *
 * A client does not answer in order. When they jump to their email problem during the
 * pipeline module, the auditor needs to be on that screen in a second, without scrolling
 * a rail or losing their place. Fuzzy-ish substring match over part, module and block.
 */
import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CornerDownLeft, Search } from 'lucide-react'
import type { Answers, Part } from '@/audit/types'
import { blockProgress } from '@/audit/flags'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

export interface JumpTarget {
  partId: Part['id']
  moduleId: string
  blockId: string
  partTitle: string
  moduleTitle: string
  blockTitle: string
  answered: number
  total: number
  /** every question on this screen, for matching — a client says "fixed rate expiry",
      not "retention and advocacy", and the auditor needs to land on it in one keystroke */
  questions: { id: string; prompt: string }[]
}

export function buildTargets(parts: Part[], answers: Answers): JumpTarget[] {
  const out: JumpTarget[] = []
  for (const part of parts) {
    for (const mod of part.modules) {
      for (const block of mod.blocks) {
        const p = blockProgress(block, answers)
        out.push({
          partId: part.id,
          moduleId: mod.id,
          blockId: block.id,
          partTitle: part.title,
          moduleTitle: mod.title,
          blockTitle: block.title,
          answered: p.answered,
          total: p.total,
          questions: block.questions.map((q) => ({ id: q.id, prompt: q.prompt })),
        })
      }
    }
  }
  return out
}

export interface JumperProps {
  open: boolean
  onClose: () => void
  targets: JumpTarget[]
  /** `questionId` is set when the match came from a question rather than a title */
  onJump: (t: JumpTarget, questionId?: string) => void
}

/** A screen, plus the question that made it match. */
interface Hit {
  target: JumpTarget
  question?: { id: string; prompt: string }
}

export function Jumper({ open, onClose, targets, onJump }: JumperProps) {
  const [query, setQuery] = React.useState('')
  const [cursor, setCursor] = React.useState(0)
  const reduced = useReducedMotion()
  const listRef = React.useRef<HTMLUListElement>(null)

  React.useEffect(() => {
    if (open) {
      setQuery('')
      setCursor(0)
    }
  }, [open])

  const results = React.useMemo<Hit[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q) return targets.slice(0, 40).map((target) => ({ target }))
    const terms = q.split(/\s+/)
    const hits: Hit[] = []
    for (const target of targets) {
      const title = `${target.partTitle} ${target.moduleTitle} ${target.blockTitle}`.toLowerCase()
      if (terms.every((term) => title.includes(term))) {
        hits.push({ target })
        continue
      }
      /* fall through to the questions themselves */
      const question = target.questions.find((x) => {
        const hay = x.prompt.toLowerCase()
        return terms.every((term) => hay.includes(term))
      })
      if (question) hits.push({ target, question })
    }
    return hits.slice(0, 40)
  }, [query, targets])

  React.useEffect(() => {
    setCursor((c) => Math.min(c, Math.max(0, results.length - 1)))
  }, [results.length])

  /* keep the highlighted row in view while arrowing */
  React.useEffect(() => {
    const el = listRef.current?.children[cursor] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => (c + 1) % Math.max(1, results.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => (c - 1 + results.length) % Math.max(1, results.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const hit = results[cursor]
      if (hit) {
        onJump(hit.target, hit.question?.id)
        onClose()
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-overlay p-4 pt-[12vh]"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Jump to a screen"
        >
          <motion.div
            className="w-full max-w-xl overflow-hidden rounded-lg border border-border bg-surface shadow-lg"
            initial={reduced ? false : { opacity: 0, y: -8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-fg-subtle" strokeWidth={1.75} aria-hidden />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Jump to a screen…"
                aria-label="Search screens"
                className="w-full bg-transparent font-body text-body-md text-fg placeholder:text-fg-subtle focus:outline-none"
              />
              <kbd className="hidden shrink-0 rounded-sm bg-inset px-1.5 py-0.5 font-mono text-mono-2xs text-fg-subtle sm:block">
                ESC
              </kbd>
            </div>

            {results.length === 0 ? (
              <p className="px-4 py-8 text-center font-body text-body-sm text-fg-subtle">
                Nothing matches “{query}”.
              </p>
            ) : (
              <ul ref={listRef} className="max-h-[52vh] overflow-y-auto py-1.5">
                {results.map((hit, i) => {
                  const t = hit.target
                  const on = i === cursor
                  return (
                    <li key={`${t.partId}-${t.blockId}-${hit.question?.id ?? ''}`}>
                      <button
                        type="button"
                        onMouseEnter={() => setCursor(i)}
                        onClick={() => {
                          onJump(t, hit.question?.id)
                          onClose()
                        }}
                        className={cn(
                          'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-fast',
                          on ? 'bg-selected' : 'hover:bg-selected',
                        )}
                      >
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              'block truncate font-body text-body-md',
                              on ? 'text-accent-text' : 'text-fg',
                            )}
                          >
                            {hit.question ? hit.question.prompt : t.blockTitle}
                          </span>
                          <span className="mt-0.5 block truncate font-mono text-caption text-fg-subtle">
                            {t.partTitle} · {t.moduleTitle}
                            {hit.question ? ` · ${t.blockTitle}` : ''}
                          </span>
                        </span>
                        <span className="shrink-0 font-mono text-mono-2xs tabular-nums text-fg-subtle">
                          {t.answered}/{t.total}
                        </span>
                        {on && (
                          <CornerDownLeft
                            className="h-3.5 w-3.5 shrink-0 text-fg-subtle"
                            strokeWidth={1.75}
                            aria-hidden
                          />
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
