/**
 * AuditApp — the instrument.
 *
 * A full-screen surface, deliberately outside the showcase chrome: on a client call the
 * only thing on screen should be the conversation. Three parts, a module rail, one block
 * at a time, notes and flags alongside, and an export that lands in the database's own
 * record shape.
 *
 * Keyboard: ⌘K jump · ⌘← / ⌘→ move between screens · ⌘. notes · 1–9 pick a choice.
 */
import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Block, Module, Part } from '@/audit/types'
import { readView, writeView, type AuditStore } from '@/audit/state'
import { raisedFlags } from '@/audit/flags'
import { AUDIT_PARTS } from '@/data/audit'
import { BlockView } from '@/audit/parts/BlockView'
import { ExportDialog } from '@/audit/parts/ExportDialog'
import { Jumper, buildTargets, type JumpTarget } from '@/audit/parts/Jumper'
import { Rail } from '@/audit/parts/Rail'
import { SidePanel } from '@/audit/parts/SidePanel'
import { TopBar } from '@/audit/parts/TopBar'
import { Button } from '@/components/ui/button'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

/** The arrow key, printed on the button that it drives. */
const Key = ({ children, onAccent = false }: { children: React.ReactNode; onAccent?: boolean }) => (
  <kbd
    aria-hidden
    className={cn(
      'grid h-5 w-5 place-items-center rounded-sm font-mono text-mono-2xs leading-none',
      onAccent ? 'bg-black/15 text-accent-fg' : 'bg-inset text-fg-subtle',
    )}
  >
    {children}
  </kbd>
)

/** Every block of a part, flattened, so ← / → walk the whole part in order. */
function flatten(part: Part): { module: Module; block: Block; indexInModule: number; ofModule: number }[] {
  return part.modules.flatMap((module) =>
    module.blocks.map((block, i) => ({
      module,
      block,
      indexInModule: i,
      ofModule: module.blocks.length,
    })),
  )
}

export function AuditApp({ store, onExit }: { store: AuditStore; onExit: () => void }) {
  const reduced = useReducedMotion()

  /* Restore where the auditor was. A refresh mid-call returns to the same screen, not
     to the top of part one. Anything stale (a renamed block) falls back to the start. */
  const [partId, setPartId] = React.useState<Part['id']>(() => {
    const saved = readView()?.partId
    return AUDIT_PARTS.some((p) => p.id === saved) ? (saved as Part['id']) : AUDIT_PARTS[0].id
  })
  const [blockId, setBlockId] = React.useState<string>(() => {
    const saved = readView()?.blockId
    const known = AUDIT_PARTS.some((p) =>
      p.modules.some((m) => m.blocks.some((b) => b.id === saved)),
    )
    return known && saved ? saved : AUDIT_PARTS[0].modules[0].blocks[0].id
  })

  React.useEffect(() => {
    writeView({ started: true, partId, blockId })
  }, [partId, blockId])
  const [panelOpen, setPanelOpen] = React.useState(true)
  const [jumperOpen, setJumperOpen] = React.useState(false)
  const [exportOpen, setExportOpen] = React.useState(false)

  const part = React.useMemo(
    () => AUDIT_PARTS.find((p) => p.id === partId) ?? AUDIT_PARTS[0],
    [partId],
  )
  const sequence = React.useMemo(() => flatten(part), [part])
  const position = Math.max(
    0,
    sequence.findIndex((s) => s.block.id === blockId),
  )
  const current = sequence[position] ?? sequence[0]

  const flags = React.useMemo(
    () => raisedFlags(AUDIT_PARTS, store.answers),
    [store.answers],
  )
  const riskCount = flags.filter((f) => f.level === 'risk').length
  const targets = React.useMemo(() => buildTargets(AUDIT_PARTS, store.answers), [store.answers])

  const scrollTop = React.useCallback(() => {
    document.getElementById('audit-scroll')?.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }, [reduced])

  const go = React.useCallback(
    (delta: number) => {
      const next = sequence[position + delta]
      if (!next) return
      setBlockId(next.block.id)
      scrollTop()
    },
    [position, scrollTop, sequence],
  )

  const selectPart = React.useCallback((id: Part['id']) => {
    const p = AUDIT_PARTS.find((x) => x.id === id)
    if (!p) return
    setPartId(id)
    setBlockId(p.modules[0].blocks[0].id)
    document.getElementById('audit-scroll')?.scrollTo({ top: 0 })
  }, [])

  const jump = React.useCallback(
    (t: JumpTarget, questionId?: string) => {
      setPartId(t.partId)
      setBlockId(t.blockId)
      document.getElementById('audit-scroll')?.scrollTo({ top: 0 })
      /* When the match came from a question rather than a screen title, land ON it —
         the client said the thing, so put the thing in front of the auditor. */
      if (questionId) {
        window.setTimeout(() => {
          document
            .getElementById(`q-${questionId}`)
            ?.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' })
        }, 120)
      }
    },
    [reduced],
  )

  /* Global shortcuts.
     ← / → move between screens, because on a call the auditor is talking and typing at once
     and a two-key chord is one thing too many. They are suppressed wherever an arrow already
     means something: inside a text field (caret movement), and inside the part switcher,
     which has its own roving-tabindex arrow handling. ⌘←/⌘→ keep working regardless, so the
     chord still moves you on even while the caret is in a box. */
  React.useEffect(() => {
    const typingTarget = (): boolean => {
      const el = document.activeElement
      if (!(el instanceof HTMLElement)) return false
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return true
      if (el.isContentEditable) return true
      return Boolean(el.closest('[role="tablist"]'))
    }

    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey

      /* Escape steps out of a box, so the arrows work again without reaching for the mouse. */
      if (e.key === 'Escape' && typingTarget()) {
        ;(document.activeElement as HTMLElement | null)?.blur()
        return
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        if (!mod && (typingTarget() || e.altKey || e.shiftKey)) return
        e.preventDefault()
        go(e.key === 'ArrowRight' ? 1 : -1)
        return
      }

      if (!mod) return
      if (e.key === 'k') {
        e.preventDefault()
        setJumperOpen((o) => !o)
      } else if (e.key === '.') {
        e.preventDefault()
        setPanelOpen((o) => {
          if (!o) {
            window.setTimeout(
              () => document.querySelector<HTMLTextAreaElement>('[data-audit-notes]')?.focus(),
              60,
            )
          }
          return !o
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  if (!current) return null

  return (
    <div className="flex h-screen flex-col bg-canvas">
      <TopBar
        parts={AUDIT_PARTS}
        activePartId={partId}
        onPart={selectPart}
        client={store.session?.client ?? ''}
        onClient={(v) => store.setMeta({ client: v })}
        answers={store.answers}
        riskCount={riskCount}
        onJumper={() => setJumperOpen(true)}
        onExport={() => setExportOpen(true)}
        onTogglePanel={() => setPanelOpen((o) => !o)}
        panelOpen={panelOpen}
        onExit={onExit}
      />

      <div className="flex min-h-0 flex-1">
        {/* module rail */}
        <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-border bg-surface p-3 lg:block">
          <p className="mb-2 px-3 pt-2 font-mono text-mono-2xs uppercase tracking-[0.14em] text-fg-subtle">
            {part.kicker}
          </p>
          <Rail
            part={part}
            answers={store.answers}
            activeModuleId={current.module.id}
            onSelect={(m) => {
              setBlockId(m.blocks[0].id)
              scrollTop()
            }}
          />
        </aside>

        {/* the screen */}
        <main id="audit-scroll" className="min-w-0 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${partId}-${current.block.id}`}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.24, ease: EASE_OUT }}
            >
              <BlockView
                part={part}
                module={current.module}
                block={current.block}
                answers={store.answers}
                onAnswer={store.setAnswer}
                index={current.indexInModule}
                count={current.ofModule}
              />
            </motion.div>
          </AnimatePresence>

          {/* move — the key is printed on the control so it does not have to be remembered */}
          <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 border-t border-border px-6 py-6 md:px-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => go(-1)}
              disabled={position === 0}
              title="Previous screen (left arrow)"
            >
              <Key>&larr;</Key>
              Back
            </Button>
            <span className="font-mono text-caption tabular-nums text-fg-subtle">
              {position + 1} of {sequence.length}
            </span>
            <Button
              size="sm"
              onClick={() => go(1)}
              disabled={position === sequence.length - 1}
              title="Next screen (right arrow)"
            >
              Next
              <Key onAccent>&rarr;</Key>
            </Button>
          </div>
        </main>

        {/* notes + flags */}
        <aside
          className={cn(
            'hidden shrink-0 border-l border-border bg-surface transition-[width] duration-base ease-out xl:block',
            panelOpen ? 'w-80' : 'w-0 overflow-hidden border-l-0',
          )}
        >
          {panelOpen && (
            <SidePanel
              block={current.block}
              note={store.session?.notes[current.block.id] ?? ''}
              onNote={(v) => store.setNote(current.block.id, v)}
              flags={flags}
            />
          )}
        </aside>
      </div>

      <Jumper
        open={jumperOpen}
        onClose={() => setJumperOpen(false)}
        targets={targets}
        onJump={jump}
      />
      {store.session && (
        <ExportDialog
          open={exportOpen}
          onClose={() => setExportOpen(false)}
          session={store.session}
          parts={AUDIT_PARTS}
        />
      )}
    </div>
  )
}
