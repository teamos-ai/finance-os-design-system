/**
 * Rail — the left module list.
 *
 * Shows where the conversation is and how much of each chapter is covered, so the auditor
 * can steer the call rather than follow it. A module is never locked: a client will answer
 * module 6 while you are on module 2, and the instrument has to let you follow them there.
 */
import type { Answers, Module, Part } from '@/audit/types'
import { moduleProgress } from '@/audit/flags'
import { cn } from '@/lib/cn'

/** A small progress arc — quieter than a bar and reads at a glance. */
function Ring({ ratio, on }: { ratio: number; on: boolean }) {
  const r = 8
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 -rotate-90" aria-hidden>
      <circle cx="10" cy="10" r={r} fill="none" stroke="var(--c-border)" strokeWidth="2" />
      <circle
        cx="10"
        cy="10"
        r={r}
        fill="none"
        stroke={on ? 'var(--c-accent)' : 'var(--c-fg-subtle)'}
        strokeWidth="2"
        strokeLinecap="butt"
        strokeDasharray={`${c * ratio} ${c}`}
        className="transition-[stroke-dasharray] duration-base ease-out"
      />
    </svg>
  )
}

export interface RailProps {
  part: Part
  answers: Answers
  activeModuleId: string
  onSelect: (module: Module) => void
}

export function Rail({ part, answers, activeModuleId, onSelect }: RailProps) {
  return (
    <nav aria-label={`${part.title} modules`} className="flex flex-col gap-0.5">
      {part.modules.map((mod) => {
        const p = moduleProgress(mod.blocks, answers)
        const on = mod.id === activeModuleId
        const done = p.total > 0 && p.answered === p.total
        return (
          <button
            key={mod.id}
            type="button"
            onClick={() => onSelect(mod)}
            aria-current={on ? 'true' : undefined}
            className={cn(
              'group relative flex items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors duration-fast',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              on ? 'bg-selected' : 'hover:bg-selected',
            )}
          >
            {on && (
              <span aria-hidden className="absolute inset-y-2 left-0 w-0.5 rounded-sm bg-accent" />
            )}
            <Ring ratio={p.ratio} on={on || done} />
            <span className="min-w-0 flex-1">
              <span
                className={cn(
                  'block truncate font-body text-body-sm leading-snug',
                  on ? 'text-accent-text' : 'text-fg-muted group-hover:text-fg',
                )}
              >
                {mod.title}
              </span>
              <span className="mt-0.5 block font-mono text-mono-2xs uppercase tracking-[0.12em] text-fg-subtle">
                {mod.number} · {p.answered}/{p.total}
              </span>
            </span>
          </button>
        )
      })}
    </nav>
  )
}
