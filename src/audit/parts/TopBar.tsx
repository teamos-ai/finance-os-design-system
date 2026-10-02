/**
 * TopBar — who the audit is with, where it is up to, and the way out.
 *
 * The client name is edited in place: on a live call nobody opens a settings screen. The
 * elapsed timer is deliberately quiet — it is there so the auditor can keep to the hour,
 * not to hurry the client.
 */
import * as React from 'react'
import { ArrowLeft, Command, Download, PanelRight, Search } from 'lucide-react'
import type { Answers, Part } from '@/audit/types'
import { partProgress } from '@/audit/flags'
import { LogoMark } from '@/components/brand/Logo'
import { Badge } from '@/components/ui/badge'
import { SegmentedControl } from '@/components/ui/segmented'
import { cn } from '@/lib/cn'

/** Minutes elapsed since the component mounted, ticking once a minute. */
function useElapsed(): number {
  const [mins, setMins] = React.useState(0)
  React.useEffect(() => {
    const started = Date.now()
    const id = window.setInterval(() => setMins(Math.floor((Date.now() - started) / 60000)), 15000)
    return () => window.clearInterval(id)
  }, [])
  return mins
}

export interface TopBarProps {
  parts: Part[]
  activePartId: Part['id']
  onPart: (id: Part['id']) => void
  client: string
  onClient: (v: string) => void
  answers: Answers
  riskCount: number
  onJumper: () => void
  onExport: () => void
  onTogglePanel: () => void
  panelOpen: boolean
  onExit: () => void
}

export function TopBar({
  parts,
  activePartId,
  onPart,
  client,
  onClient,
  answers,
  riskCount,
  onJumper,
  onExport,
  onTogglePanel,
  panelOpen,
  onExit,
}: TopBarProps) {
  const mins = useElapsed()
  const part = parts.find((p) => p.id === activePartId) ?? parts[0]
  const p = partProgress(part, answers)

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-canvas/95 backdrop-blur">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 md:px-6">
        <button
          type="button"
          onClick={onExit}
          aria-label="Leave the audit"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-fg-subtle transition-colors duration-fast hover:bg-selected hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <LogoMark size="sm" />

        <input
          value={client}
          onChange={(e) => onClient(e.target.value)}
          placeholder="Brokerage name"
          aria-label="Brokerage name"
          className="min-w-0 max-w-[14rem] flex-1 rounded-md bg-transparent px-2 py-1.5 font-display text-title-sm text-fg placeholder:text-fg-subtle transition-colors duration-fast hover:bg-selected focus-visible:bg-selected focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <div className="order-last w-full md:order-none md:w-auto">
          <SegmentedControl
            size="sm"
            aria-label="Audit part"
            options={parts.map((x) => ({ value: x.id, label: x.kicker }))}
            value={activePartId}
            onValueChange={(v) => onPart(v as Part['id'])}
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden font-mono text-caption tabular-nums text-fg-subtle sm:inline">
            {p.answered}/{p.total}
          </span>
          {mins > 0 && (
            <span className="hidden font-mono text-caption tabular-nums text-fg-subtle md:inline">
              {mins}m
            </span>
          )}
          {riskCount > 0 && (
            <Badge variant="danger" size="sm">
              {riskCount} risk{riskCount === 1 ? '' : 's'}
            </Badge>
          )}

          {/* On a phone the module rail is hidden, so this is the only way to move
              between chapters — it must never be the thing that disappears. */}
          <button
            type="button"
            onClick={onJumper}
            aria-label="Jump to a screen"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-mono text-caption text-fg-subtle transition-colors duration-fast hover:border-border-strong hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Search className="h-3.5 w-3.5 sm:hidden" strokeWidth={1.75} aria-hidden />
            <Command className="hidden h-3 w-3 sm:block" strokeWidth={2} aria-hidden />
            <span className="hidden sm:inline">K</span>
          </button>

          <button
            type="button"
            onClick={onExport}
            aria-label="Export this audit"
            className="grid h-9 w-9 place-items-center rounded-md text-fg-subtle transition-colors duration-fast hover:bg-selected hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Download className="h-4 w-4" strokeWidth={1.75} />
          </button>

          <button
            type="button"
            onClick={onTogglePanel}
            aria-label={panelOpen ? 'Hide notes' : 'Show notes'}
            aria-pressed={panelOpen}
            className={cn(
              'grid h-9 w-9 place-items-center rounded-md transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              panelOpen ? 'bg-selected text-accent-text' : 'text-fg-subtle hover:bg-selected hover:text-fg',
            )}
          >
            <PanelRight className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* progress hairline */}
      <div aria-hidden className="h-0.5 w-full bg-border">
        <div
          className="h-full bg-accent transition-[width] duration-base ease-out"
          style={{ width: `${Math.round(p.ratio * 100)}%` }}
        />
      </div>
    </header>
  )
}
