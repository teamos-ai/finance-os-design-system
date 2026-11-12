/**
 * PositioningSearch — the hero's fuzzy command search over the positioning. It reuses the DS
 * CommandBar look, filters the positioning entries (sections + options) live, and lists the
 * ranked matches in one calm popover. Suggestion chips seed common searches. Keyboard: ↑/↓ to
 * move, Enter to choose, Esc to clear. The matcher is a tiny local scorer — no new dependencies.
 *
 * It asserts nothing and navigates nowhere: choosing a match just fills the bar. The entries are
 * passed in from src/data/positioning.ts, so the index never drifts from the signed-off document.
 */
import * as React from 'react'
import { CornerDownLeft, Search } from 'lucide-react'
import { CommandBar } from '@/components/ui/command-bar'
import { cn } from '@/lib/cn'

export interface SearchEntry {
  id: string
  label: string
  /** 'Section' rows carry a 2-digit index; 'Option' rows are the positioning options. */
  kind: 'Section' | 'Option'
  meta?: string
}

interface Ranked extends SearchEntry {
  score: number
  /** contiguous match range for the highlight, or -1 when the hit is a looser subsequence. */
  start: number
  end: number
}

/** Substring hit (word-boundary preferred) beats a loose subsequence; shorter labels rank first. */
function scoreOf(query: string, text: string): { score: number; start: number; end: number } | null {
  const q = query.trim().toLowerCase()
  if (!q) return null
  const s = text.toLowerCase()
  const idx = s.indexOf(q)
  if (idx >= 0) {
    const boundary = idx === 0 || /[\s\-–—·]/.test(s[idx - 1])
    return { score: (boundary ? 1000 : 700) - idx, start: idx, end: idx + q.length }
  }
  let si = 0
  for (let qi = 0; qi < q.length; qi++) {
    const found = s.indexOf(q[qi], si)
    if (found < 0) return null
    si = found + 1
  }
  return { score: 200 - s.length, start: -1, end: -1 }
}

function Highlight({ label, start, end }: { label: string; start: number; end: number }) {
  if (start < 0) return <>{label}</>
  return (
    <>
      {label.slice(0, start)}
      <mark className="rounded-xs bg-accent-soft px-0.5 text-accent-text">{label.slice(start, end)}</mark>
      {label.slice(end)}
    </>
  )
}

export interface PositioningSearchProps {
  entries: SearchEntry[]
  tags: string[]
  placeholder?: string
}

export function PositioningSearch({ entries, tags, placeholder }: PositioningSearchProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [query, setQuery] = React.useState('')
  const [focused, setFocused] = React.useState(false)
  const [active, setActive] = React.useState(-1)
  const listId = React.useId()

  const results = React.useMemo<Ranked[]>(() => {
    const out: Ranked[] = []
    for (const entry of entries) {
      const m = scoreOf(query, entry.label)
      if (m) out.push({ ...entry, ...m })
    }
    out.sort((a, b) => b.score - a.score || a.label.length - b.label.length)
    return out.slice(0, 8)
  }, [entries, query])

  React.useEffect(() => {
    setActive(-1)
  }, [query])

  const open = focused && query.trim().length > 0
  const showChips = query.trim().length === 0

  const choose = (entry: SearchEntry) => {
    setQuery(entry.label)
    setFocused(false)
    inputRef.current?.blur()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (query) setQuery('')
      else inputRef.current?.blur()
      return
    }
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      const pick = active >= 0 ? results[active] : results[0]
      if (pick) {
        e.preventDefault()
        choose(pick)
      }
    }
  }

  return (
    <div className="w-full text-left">
      <CommandBar
        ref={inputRef}
        size="hero"
        placeholder={placeholder}
        aria-label="Search the positioning"
        role="combobox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={open && active >= 0 ? `${listId}-opt-${active}` : undefined}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={onKeyDown}
      />

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Positioning matches"
          className="mt-3 max-h-64 w-full overflow-auto rounded-lg border border-border bg-elevated py-1.5 text-left shadow-md"
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 font-body text-body-sm text-fg-subtle">No matches in the positioning.</li>
          ) : (
            results.map((r, i) => (
              <li key={r.id} id={`${listId}-opt-${i}`} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(r)}
                  className={cn(
                    'flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors duration-fast ease-out',
                    i === active ? 'bg-selected' : 'hover:bg-canvas-muted',
                  )}
                >
                  <span aria-hidden className="grid w-7 shrink-0 place-items-center">
                    {r.kind === 'Section' ? (
                      <span className="font-mono text-caption tabular-nums text-fg-subtle">{r.meta}</span>
                    ) : (
                      <Search className="h-3.5 w-3.5 text-fg-subtle" strokeWidth={1.75} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-body text-body-sm text-fg">
                    <Highlight label={r.label} start={r.start} end={r.end} />
                  </span>
                  <span className="shrink-0 font-mono text-mono-2xs uppercase tracking-[0.12em] text-fg-subtle">
                    {r.kind}
                  </span>
                  <CornerDownLeft
                    aria-hidden
                    className={cn('h-3.5 w-3.5 shrink-0 text-fg-subtle transition-opacity', i === active ? 'opacity-100' : 'opacity-0')}
                    strokeWidth={1.75}
                  />
                </button>
              </li>
            ))
          )}
        </ul>
      )}

      {showChips && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setQuery(t)
                setFocused(true)
                inputRef.current?.focus()
              }}
              className={cn(
                'rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-mono-xs text-fg-muted shadow-sm',
                'transition-all duration-base ease-out hover:border-border-strong hover:text-fg active:scale-[0.96]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
