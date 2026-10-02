/**
 * SidePanel — notes and the running flag list.
 *
 * The structured questions catch what we knew to ask. This panel catches everything else,
 * which on a good call is most of the value. It stays open by default and is always one
 * key away, because an auditor who has to go looking for the notes box stops taking notes.
 */
import * as React from 'react'
import { AlertTriangle, Eye, Lightbulb, PenLine } from 'lucide-react'
import type { Block, FlagLevel, RaisedFlag } from '@/audit/types'
import { MonoLabel } from '@/components/ui/mono-label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/cn'

const ICON: Record<FlagLevel, typeof AlertTriangle> = {
  risk: AlertTriangle,
  watch: Eye,
  opportunity: Lightbulb,
}

const INK: Record<FlagLevel, string> = {
  risk: 'text-danger',
  watch: 'text-fg-muted',
  opportunity: 'text-accent-text',
}

export interface SidePanelProps {
  block: Block
  note: string
  onNote: (v: string) => void
  flags: RaisedFlag[]
}

export function SidePanel({ block, note, onNote, flags }: SidePanelProps) {
  const ref = React.useRef<HTMLTextAreaElement>(null)

  /* `data-audit-notes` lets the keyboard shortcut focus this box from anywhere. */
  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-5">
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <MonoLabel tone="subtle" size="sm">
            <PenLine className="h-3 w-3" strokeWidth={2} aria-hidden />
            Notes — {block.title}
          </MonoLabel>
          <span className="font-mono text-mono-2xs uppercase tracking-[0.12em] text-fg-subtle">⌘ .</span>
        </div>
        <textarea
          ref={ref}
          data-audit-notes
          rows={10}
          value={note}
          onChange={(e) => onNote(e.target.value)}
          placeholder="Their words, the aside they dropped, the thing they got animated about…"
          className={cn(
            'w-full resize-none rounded-md border border-border bg-surface px-3.5 py-3',
            'font-body text-body-sm leading-relaxed text-fg placeholder:text-fg-subtle',
            'transition-colors duration-fast ease-out',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-border-strong',
          )}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <MonoLabel tone="subtle" size="sm">
            Flags so far
          </MonoLabel>
          {flags.length > 0 && (
            <Badge variant={flags.some((f) => f.level === 'risk') ? 'danger' : 'outline'} size="sm">
              {flags.length}
            </Badge>
          )}
        </div>

        {flags.length === 0 ? (
          <p className="font-body text-body-sm leading-relaxed text-fg-subtle">
            Nothing flagged yet. Flags appear here the moment an answer trips one.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {flags.map((f, i) => {
              const Icon = ICON[f.level]
              return (
                <li
                  key={`${f.questionId}-${i}`}
                  className="flex items-start gap-2.5 rounded-md border border-border bg-surface p-3"
                >
                  <Icon className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', INK[f.level])} strokeWidth={1.75} aria-hidden />
                  <span className="min-w-0">
                    {f.context && (
                      <span className="mb-0.5 block font-mono text-caption leading-snug text-fg-subtle">
                        {f.context}
                      </span>
                    )}
                    <span className="block font-body text-body-sm leading-snug text-fg">{f.title}</span>
                    {f.note && (
                      <span className="mt-0.5 block font-body text-caption leading-relaxed text-fg-subtle">
                        {f.note}
                      </span>
                    )}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
