/**
 * LeadMagnetFrame — the consistent shell every lead-magnet template renders inside.
 * A labelled chrome bar (kind · title · format · motion badge), the content area, and
 * an optional footer (usually the gate CTA). This is the "frame" half of the framework:
 * drop any template body in, get a branded, on-token lead magnet. Token-only.
 */
import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/cn'

export interface LeadMagnetMeta {
  /** category, e.g. 'Ebook / Flipbook' */
  kind: string
  /** the magnet's working title */
  title: string
  /** delivery format, e.g. 'PDF · 24 pages' or 'Interactive' */
  format: string
  Icon: LucideIcon
  /** the built-in motion, if any: 'Page-flip' | 'Swipe' | 'Checkbox tick' | 'Count-up' */
  motion?: string
}

export function LeadMagnetFrame({
  meta,
  children,
  footer,
  className,
  bodyClassName,
}: {
  meta: LeadMagnetMeta
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <div className={cn('flex flex-col overflow-hidden rounded-lg border border-border bg-canvas', className)}>
      <header className="flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent-soft text-accent-text">
            <meta.Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-title-sm leading-tight text-fg">{meta.title}</p>
            <p className="font-mono text-mono-xs uppercase tracking-wide text-fg-subtle">{meta.kind}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="font-mono text-caption text-fg-subtle">{meta.format}</span>
          {meta.motion && (
            <Badge variant="outline" size="sm">
              {meta.motion}
            </Badge>
          )}
        </div>
      </header>
      <div className={cn('flex-1 p-5 md:p-6', bodyClassName)}>{children}</div>
      {footer && <footer className="border-t border-border bg-surface px-4 py-3">{footer}</footer>}
    </div>
  )
}

/** PaperPage — an on-brand sheet for a Flipbook page (solid bg so flips don't bleed). */
export function PaperPage({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex h-full w-full flex-col bg-surface p-6', className)}>{children}</div>
}

/** Small eyebrow used across template bodies. */
export function TemplateKicker({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-mono-xs uppercase tracking-[0.14em] text-accent-text">{children}</p>
}
