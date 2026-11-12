/**
 * SectionFolder — one positioning section, filed as a folder. A tokenised mist tab sits above a
 * calm surface that carries the section number, title and a Decided/Open status chip. Hover, focus
 * or press lifts the folder open: a gentle raise + hinge that cracks a sliver of mist at the top
 * and reveals the section's status in words. Composes from --c-* tokens and the shared mist washes
 * only — no accent ribbon, no glass, 8px radius ceiling, neutral focus ring, reduced-motion safe.
 */
import * as React from 'react'
import { useReducedMotion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import type { SectionStatus } from '@/data/positioning'
import { cn } from '@/lib/cn'

/** The honest meaning of each state, lifted from the positioning data's own definition. */
const STATUS: Record<SectionStatus, { label: string; caption: string; open: boolean }> = {
  decided: { label: 'Decided', caption: 'Signed off — no open blocks.', open: false },
  open: { label: 'Open', caption: 'Still carries deferred or illustrative blocks.', open: true },
}

export interface SectionFolderProps {
  /** section number, e.g. "05" */
  n: string
  title: string
  status: SectionStatus
  /** position in the grid — gives the mist tab a calm two-step variation */
  index?: number
}

export function SectionFolder({ n, title, status, index = 0 }: SectionFolderProps) {
  const reduced = useReducedMotion()
  const [open, setOpen] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const active = open || hovered || focused
  const s = STATUS[status]
  const ease = 'var(--ease-out)'
  const tabWash = index % 2 === 0 ? 'bg-wash-mist' : 'bg-wash-haze'

  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={() => setOpen((o) => !o)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={cn(
        'group relative block w-full text-left aspect-[3/2] rounded-lg outline-none',
        'transition-transform duration-fast ease-out active:scale-[0.96]',
        'motion-reduce:active:scale-100 motion-reduce:transition-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
      )}
    >
      {/* stack — tab, lip and face lift as one on hover / focus / open */}
      <span
        className="absolute inset-0 block"
        style={{
          transform: active && !reduced ? 'translateY(-4px)' : 'translateY(0)',
          transition: `transform 250ms ${ease}`,
        }}
      >
        {/* mist tab — the folder's tab, a tokenised mist gradient (never an accent ribbon) */}
        <span
          aria-hidden
          className={cn('absolute left-5 top-0 h-7 w-[46%] rounded-t-md border border-b-0 border-border', tabWash)}
          style={{
            transform: active && !reduced ? 'translateY(-3px)' : 'translateY(0)',
            transition: `transform 400ms ${ease}`,
          }}
        />

        {/* inside lip — the sliver of mist that shows at the crack as the folder opens */}
        <span
          aria-hidden
          className="absolute inset-x-1.5 top-6 h-8 rounded-t-md border border-b-0 border-border bg-wash-mist"
          style={{
            transform: active && !reduced ? 'translateY(-4px)' : 'translateY(0)',
            opacity: active ? 1 : 0,
            transition: reduced ? `opacity 200ms ${ease}` : `transform 400ms ${ease}, opacity 300ms ${ease}`,
          }}
        />

        {/* front face — the folder body, hinged gently at its base */}
        <span
          className={cn(
            'absolute inset-x-0 bottom-0 top-7 block overflow-hidden rounded-lg border bg-elevated',
            active ? 'border-border-strong shadow-md' : 'border-border shadow-sm',
          )}
          style={{
            transformOrigin: 'bottom',
            transform: active && !reduced ? 'perspective(900px) rotateX(-7deg)' : 'perspective(900px) rotateX(0deg)',
            transition: reduced
              ? `box-shadow 250ms ${ease}, border-color 250ms ${ease}`
              : `transform 400ms ${ease}, box-shadow 250ms ${ease}, border-color 250ms ${ease}`,
          }}
        >
          <span className="flex h-full flex-col p-4 md:p-5">
            {/* head — section index + status chip */}
            <span className="flex items-center justify-between gap-2">
              <span className="font-mono text-mono-xs uppercase tabular-nums text-fg-subtle">Section {n}</span>
              <Badge variant={s.open ? 'amber' : 'neutral'} size="sm" dot>
                {s.label}
              </Badge>
            </span>

            {/* title */}
            <span className="mt-2 block font-display text-title-sm leading-snug text-fg">{title}</span>

            {/* status caption — revealed when the folder is opened (grid rows 0fr → 1fr: no layout-magic height, no easing-tail dead air) */}
            <span
              aria-hidden={!open}
              className="grid font-body text-body-sm leading-relaxed text-fg-muted"
              style={{
                gridTemplateRows: open ? '1fr' : '0fr',
                opacity: open ? 1 : 0,
                transition: reduced
                  ? `opacity 200ms ${ease}`
                  : `grid-template-rows 360ms ${ease}, opacity 300ms ${ease}`,
              }}
            >
              <span className="min-h-0 overflow-hidden">
                <span className="block pt-2">{s.caption}</span>
              </span>
            </span>
          </span>
        </span>
      </span>
    </button>
  )
}
