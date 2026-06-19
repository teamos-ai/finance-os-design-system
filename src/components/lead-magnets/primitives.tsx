/**
 * Lead-magnet motion primitives — the reusable interaction vocabulary for building
 * lead magnets from Finance OS tokens. All honour prefers-reduced-motion.
 *
 *   • Flipbook  — page-turn (3D rotateY hinge) for ebooks / magazines / guides
 *   • SwipeDeck — drag-to-decide cards for swipe files (Tinder-style, keyboard-safe)
 *   • Checklist — animated checkbox tick + progress for checklists / quizzes
 *   • AnimatedCheck — a single SVG check that draws itself in (composable)
 *
 * Token-only (accent follows the theme), keyboard-operable, no autoplay.
 */
import * as React from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useReducedMotion, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Heart, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'

const EASE = [0.22, 1, 0.36, 1] as const

/* ── AnimatedCheck — a check mark that draws itself (currentColor) ──────────── */
export function AnimatedCheck({ className, strokeWidth = 3 }: { className?: string; strokeWidth?: number }) {
  const reduced = useReducedMotion()
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <motion.path
        d="M5 12.5l4.2 4.3L19 7"
        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.32, ease: EASE }}
      />
    </svg>
  )
}

/* ── Flipbook — page-turn for ebooks / magazines / guides ──────────────────── */
export interface FlipbookProps {
  /** each page is fully-rendered JSX (use the PaperPage helper for the on-brand sheet) */
  pages: React.ReactNode[]
  className?: string
  /** tailwind aspect ratio of the book, default portrait 3:4 */
  aspect?: string
}
export function Flipbook({ pages, className, aspect = 'aspect-[3/4]' }: FlipbookProps) {
  const reduced = useReducedMotion()
  const [[index, dir], setState] = React.useState<[number, number]>([0, 0])
  const total = pages.length
  const go = (d: number) =>
    setState(([i]) => {
      const next = Math.min(total - 1, Math.max(0, i + d))
      return [next, next === i ? 0 : d]
    })

  return (
    <div
      className={cn('flex flex-col items-center gap-4 outline-none', className)}
      tabIndex={0}
      role="group"
      aria-label="Flipbook — use left and right arrow keys to turn pages"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
        else if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
      }}
    >
      <div className={cn('relative w-full max-w-sm overflow-hidden rounded-lg border border-border bg-surface shadow-lg', aspect)} style={{ perspective: '1600px' }}>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-black/10 to-transparent" />
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0"
            style={{ transformStyle: 'preserve-3d', transformOrigin: 'left center' }}
            initial={reduced ? false : { rotateY: dir >= 0 ? 78 : -78, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { rotateY: dir >= 0 ? -78 : 78, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            {pages[index]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="Previous page"
          className="grid h-9 w-9 place-items-center rounded-md border border-border-strong text-fg transition-colors hover:bg-accent-soft disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        </button>
        <span className="font-mono text-caption tabular-nums text-fg-subtle">
          {index + 1} / {total}
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={index === total - 1}
          aria-label="Next page"
          className="grid h-9 w-9 place-items-center rounded-md border border-border-strong text-fg transition-colors hover:bg-accent-soft disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

/* ── SwipeDeck — drag-to-decide cards (swipe files) ────────────────────────── */
export interface SwipeItem {
  id: string | number
  content: React.ReactNode
}
export interface SwipeDeckProps {
  items: SwipeItem[]
  className?: string
  keepLabel?: string
  skipLabel?: string
}

function SwipeCard({
  item,
  isFront,
  dir,
  onDecide,
}: {
  item: SwipeItem
  isFront: boolean
  dir: number
  onDecide: (id: SwipeItem['id'], d: number) => void
}) {
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-180, 180], [-16, 16])
  const opacity = useTransform(x, [-180, 0, 180], [0, 1, 0])
  const likeOpacity = useTransform(x, [40, 130], [0, 1])
  const nopeOpacity = useTransform(x, [-130, -40], [1, 0])

  const handleEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 90) onDecide(item.id, 1)
    else if (info.offset.x < -90) onDecide(item.id, -1)
  }

  return (
    <motion.div
      className="absolute inset-0 touch-none select-none"
      style={isFront ? { x, rotate, opacity } : undefined}
      drag={isFront && !reduced ? 'x' : false}
      dragSnapToOrigin
      dragElastic={0.6}
      onDragEnd={handleEnd}
      initial={false}
      animate={{ scale: isFront ? 1 : 0.95, y: isFront ? 0 : 14 }}
      exit={{ x: dir * 360, opacity: 0, rotate: dir * 18, transition: { duration: 0.35, ease: EASE } }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      <div className={cn('relative h-full w-full overflow-hidden rounded-lg border border-border bg-surface shadow-lg', isFront && 'cursor-grab active:cursor-grabbing')}>
        {isFront && (
          <>
            <motion.span style={{ opacity: likeOpacity }} className="absolute right-4 top-4 z-10 rounded-md border-2 border-success px-2 py-1 font-mono text-mono-xs uppercase text-success">
              Keep
            </motion.span>
            <motion.span style={{ opacity: nopeOpacity }} className="absolute left-4 top-4 z-10 rounded-md border-2 border-danger px-2 py-1 font-mono text-mono-xs uppercase text-danger">
              Skip
            </motion.span>
          </>
        )}
        {item.content}
      </div>
    </motion.div>
  )
}

export function SwipeDeck({ items, className, keepLabel = 'Keep', skipLabel = 'Skip' }: SwipeDeckProps) {
  const [cards, setCards] = React.useState(items)
  const [dir, setDir] = React.useState(0)
  const decide = (id: SwipeItem['id'], d: number) => {
    setDir(d)
    setCards((cs) => cs.filter((c) => c.id !== id))
  }
  const front = cards[cards.length - 1]
  const reset = () => setCards(items)

  return (
    <div
      className={cn('flex flex-col items-center gap-5 outline-none', className)}
      tabIndex={0}
      role="group"
      aria-label="Swipe deck — left arrow to skip, right arrow to keep"
      onKeyDown={(e) => {
        if (!front) return
        if (e.key === 'ArrowLeft') { e.preventDefault(); decide(front.id, -1) }
        else if (e.key === 'ArrowRight') { e.preventDefault(); decide(front.id, 1) }
      }}
    >
      <div className="relative aspect-[4/5] w-full max-w-xs">
        <AnimatePresence>
          {cards.length > 0 ? (
            cards.map((card) => (
              <SwipeCard key={card.id} item={card} isFront={card.id === front?.id} dir={dir} onDecide={decide} />
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 grid place-items-center rounded-lg border border-dashed border-border-strong bg-canvas-muted text-center"
            >
              <div className="flex flex-col items-center gap-3 px-6">
                <p className="font-display text-title-md text-fg">That's the whole file.</p>
                <p className="font-body text-body-sm text-fg-muted">Swipe through your saved frameworks any time.</p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-1 inline-flex items-center gap-2 rounded-md border border-accent-text px-3 py-1.5 font-mono text-caption text-accent-text transition-colors hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} /> Start over
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {cards.length > 0 && (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => front && decide(front.id, -1)}
            aria-label={skipLabel}
            className="grid h-12 w-12 place-items-center rounded-md border border-border-strong text-danger transition-colors hover:bg-danger-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
          <span className="font-mono text-caption tabular-nums text-fg-subtle">{cards.length} left</span>
          <button
            type="button"
            onClick={() => front && decide(front.id, 1)}
            aria-label={keepLabel}
            className="grid h-12 w-12 place-items-center rounded-md border border-border-strong text-success transition-colors hover:bg-success-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Heart className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Checklist — animated tick + progress (checklists / quiz steps) ────────── */
export interface ChecklistEntry {
  id: string
  label: string
  done?: boolean
}
export function Checklist({ items, className, title }: { items: ChecklistEntry[]; className?: string; title?: string }) {
  const [state, setState] = React.useState(() => items.map((i) => ({ ...i, done: !!i.done })))
  const done = state.filter((i) => i.done).length
  const pct = Math.round((done / state.length) * 100)
  const toggle = (id: string) => setState((s) => s.map((i) => (i.id === id ? { ...i, done: !i.done } : i)))

  return (
    <div className={cn('rounded-lg border border-border bg-surface p-5', className)}>
      {title && <p className="mb-3 font-display text-title-sm text-fg">{title}</p>}
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between font-mono text-caption text-fg-subtle">
          <span>
            {done} / {state.length} done
          </span>
          <span className="tabular-nums text-accent-text">{pct}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-sm bg-inset">
          <motion.div className="h-full rounded-sm bg-accent" initial={false} animate={{ width: `${pct}%` }} transition={{ duration: 0.4, ease: EASE }} />
        </div>
      </div>
      <ul className="flex flex-col gap-1">
        {state.map((it) => (
          <li key={it.id}>
            <button
              type="button"
              role="checkbox"
              aria-checked={it.done}
              onClick={() => toggle(it.id)}
              className="group flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-canvas-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className={cn(
                  'grid h-5 w-5 shrink-0 place-items-center rounded-sm border transition-colors',
                  it.done ? 'border-accent bg-accent text-accent-fg' : 'border-border-strong text-transparent',
                )}
              >
                {it.done && <AnimatedCheck className="h-3.5 w-3.5" />}
              </span>
              <span className={cn('font-body text-body-sm transition-colors', it.done ? 'text-fg-subtle line-through' : 'text-fg')}>{it.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
