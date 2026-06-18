/**
 * Pagination — Finance OS.
 *
 * Filled inverse current page, muted siblings, outline prev/next IconButtons with
 * lucide chevrons (for consistency with the rest of the system). Collapses to an
 * ellipsis when there are many pages. 8px squircles only — no circles.
 */
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IconButton } from '@/components/ui/icon-button'
import { cn } from '@/lib/cn'

export interface PaginationProps {
  /** 1-based current page. */
  page: number
  total: number
  onChange: (page: number) => void
  siblingCount?: number
  className?: string
}

function pageRange(page: number, total: number, sib: number): (number | 'gap')[] {
  const window = sib * 2 + 5 // first, last, current, 2*sib, 2 gaps
  if (total <= window) return Array.from({ length: total }, (_, i) => i + 1)
  const left = Math.max(page - sib, 2)
  const right = Math.min(page + sib, total - 1)
  const out: (number | 'gap')[] = [1]
  if (left > 2) out.push('gap')
  for (let i = left; i <= right; i++) out.push(i)
  if (right < total - 1) out.push('gap')
  out.push(total)
  return out
}

export const Pagination = ({
  page,
  total,
  onChange,
  siblingCount = 1,
  className,
}: PaginationProps) => {
  const items = pageRange(page, total, siblingCount)
  const go = (p: number) => {
    if (p >= 1 && p <= total && p !== page) onChange(p)
  }

  const cell =
    'inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 ' +
    'font-display text-body-sm font-medium transition-all duration-fast ease-out ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
    'focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:scale-[0.96]'

  return (
    <nav aria-label="Pagination" className={cn('flex items-center gap-1.5', className)}>
      <IconButton
        size="sm"
        variant="outline"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => go(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden />
      </IconButton>

      {items.map((it, i) =>
        it === 'gap' ? (
          <span
            key={`gap-${i}`}
            className="px-1.5 font-mono text-body-sm text-fg-subtle"
            aria-hidden
          >
            …
          </span>
        ) : (
          <button
            key={it}
            type="button"
            aria-current={it === page ? 'page' : undefined}
            onClick={() => go(it)}
            className={cn(
              cell,
              it === page
                ? 'bg-inverse text-inverse-fg'
                : 'text-fg-subtle hover:bg-elevated hover:text-fg',
            )}
          >
            {it}
          </button>
        ),
      )}

      <IconButton
        size="sm"
        variant="outline"
        aria-label="Next page"
        disabled={page >= total}
        onClick={() => go(page + 1)}
      >
        <ChevronRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
      </IconButton>
    </nav>
  )
}
