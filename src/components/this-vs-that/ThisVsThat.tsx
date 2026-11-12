/**
 * This vs That — the green/red comparison primitive. A pair of panels that sets what the brand
 * DOES against what it does NOT: a green "keep" column of success-tick rows beside a red "avoid"
 * column of danger-cross rows. Green is --c-success and red is --c-danger — functional signals,
 * never brand colour (Atlas Blue stays the only accent, and it owns type highlight elsewhere).
 *
 * Structure is a full hairline border + a tinted header band + a centred count chip; the colour
 * lives in the glyph tiles, the chip and the tint — no side-rails, strips or ribbons. 8px-max
 * squircles, no glass. The two panels reveal in one calm two-step stagger, rows hover-lit.
 */
import type { LucideIcon } from 'lucide-react'
import { Check, X } from 'lucide-react'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { Stagger, StaggerItem } from '@/lib/motion'
import { cn } from '@/lib/cn'

/** One side of the comparison. `tone` picks the functional signal: keep = success, avoid = danger. */
export interface CompareSide {
  tone: 'keep' | 'avoid'
  title: string
  /** short word shown after the item count in the chip, e.g. 'to keep' / 'to avoid'. */
  countWord: string
  items: string[]
}

interface ToneStyle {
  Icon: LucideIcon
  head: string
  tile: string
  rowTile: string
  badge: NonNullable<BadgeProps['variant']>
}

const TONE: Record<CompareSide['tone'], ToneStyle> = {
  keep: {
    Icon: Check,
    head: 'bg-success-soft',
    tile: 'border border-border bg-surface text-success',
    rowTile: 'bg-success-soft text-success',
    badge: 'success',
  },
  avoid: {
    Icon: X,
    head: 'bg-danger-soft',
    tile: 'border border-border bg-surface text-danger',
    rowTile: 'bg-danger-soft text-danger',
    badge: 'danger',
  },
}

/** A single comparison column — tinted header band, count chip, then glyph + sentence rows. */
function ComparePanel({ side }: { side: CompareSide }) {
  const t = TONE[side.tone]
  const { Icon } = t
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface">
      {/* header band — full-width, never a side-rail */}
      <div className={cn('flex items-center justify-between gap-3 border-b border-border px-4 py-3', t.head)}>
        <span className="flex items-center gap-2.5">
          <span aria-hidden className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-sm', t.tile)}>
            <Icon className="h-4 w-4" strokeWidth={2.4} />
          </span>
          <span className="font-display text-title-sm text-fg">{side.title}</span>
        </span>
        <Badge variant={t.badge} size="sm" className="shrink-0">
          <span className="tabular-nums">{side.items.length}</span> {side.countWord}
        </Badge>
      </div>

      {/* rows — glyph tile + verbatim sentence */}
      <ul className="flex flex-1 flex-col">
        {side.items.map((item, i) => (
          <li
            key={item}
            className={cn(
              'grid grid-cols-[20px_1fr] items-start gap-3 px-4 py-3 transition-colors duration-base ease-out hover:bg-canvas-muted',
              i < side.items.length - 1 && 'border-b border-border',
            )}
          >
            <span aria-hidden className={cn('mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-sm', t.rowTile)}>
              <Icon className="h-3 w-3" strokeWidth={2.4} />
            </span>
            <span className="font-body text-body-sm leading-relaxed text-fg-muted">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** The paired green/red comparison: keep (success) beside avoid (danger). */
export function ComparePair({ keep, avoid }: { keep: CompareSide; avoid: CompareSide }) {
  return (
    <Stagger className="grid gap-5 md:grid-cols-2" amount={0.2}>
      <StaggerItem className="h-full">
        <ComparePanel side={keep} />
      </StaggerItem>
      <StaggerItem className="h-full">
        <ComparePanel side={avoid} />
      </StaggerItem>
    </Stagger>
  )
}
