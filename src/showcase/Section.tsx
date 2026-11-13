/**
 * Section — a showcase reference block. Anchor id, mono eyebrow, Spline Sans title and
 * a calm lead, then children. Generous rhythm so the reference reads like the system.
 */
import type { ReactNode } from 'react'
import { MonoLabel } from '@/components/ui/mono-label'
import { Inspectable, type InspectData } from '@/components/ui/inspectable'
import { SHOWCASE_NAV } from '@/lib/nav'
import { FadeIn } from '@/lib/motion'
import { cn } from '@/lib/cn'

export interface SectionProps {
  id: string
  eyebrow?: string
  title: string
  lead?: string
  children: ReactNode
  className?: string
}

/**
 * The section's number is its position in SHOWCASE_NAV (hero = 0, unnumbered), so the running
 * sequence never gaps or drifts when a section is added, removed or reordered — the nav is the
 * one source of truth. Any legacy "NN - " prefix in the passed eyebrow is stripped first.
 */
const navNumber = (id: string): string | null => {
  const i = SHOWCASE_NAV.findIndex((n) => n.id === id)
  return i > 0 ? String(i).padStart(2, '0') : null
}

export const Section = ({ id, eyebrow, title, lead, children, className }: SectionProps) => {
  const label = (eyebrow ?? '').replace(/^\s*\d+\s*[-–—]\s*/, '').trim()
  const shown = [navNumber(id), label].filter(Boolean).join(' - ')
  return (
    <section id={id} className={cn('scroll-mt-8 border-b border-border px-6 py-16 md:px-12 md:py-20', className)}>
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <header className="mb-10 flex flex-col items-center text-center">
            {shown && <MonoLabel>{shown}</MonoLabel>}
            <h2 className="mt-3 font-display text-display-md text-fg">{title}</h2>
            {lead && <p className="mt-4 max-w-2xl font-body text-body-lg leading-relaxed text-fg-muted">{lead}</p>}
          </header>
        </FadeIn>
        {children}
      </div>
    </section>
  )
}

/**
 * ComposedFrom — a small cross-link row placed under a section header on an ASSEMBLED design,
 * pointing to the reusable parts it is built from (e.g. a dashboard → its widgets, charts, tables).
 * Links are in-page anchors, so they jump straight to the part's own section.
 */
export const ComposedFrom = ({ items, className }: { items: { label: string; href: string }[]; className?: string }) => (
  <div
    className={cn(
      '-mt-4 mb-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono text-mono-2xs uppercase tracking-[0.12em] text-fg-subtle',
      className,
    )}
  >
    <span>Composed from</span>
    {items.map((it, i) => (
      <span key={it.href} className="inline-flex items-center gap-2">
        <a href={it.href} className="text-accent-text underline-offset-4 hover:underline">
          {it.label}
        </a>
        {i < items.length - 1 && <span aria-hidden className="opacity-50">·</span>}
      </span>
    ))}
  </div>
)

/**
 * Small labelled frame for embedding a live component demo. `action` sits top-right.
 * Pass `inspect` to float the "+" inspector (Explain / Token / Code / Download) over the
 * frame — the FAB is rendered OUTSIDE this frame's `overflow-hidden` so its popover never clips.
 */
export const Demo = ({
  label,
  action,
  children,
  className,
  padded = true,
  inspect,
}: {
  label?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  padded?: boolean
  inspect?: InspectData
}) => {
  const frame = (
    <div className={cn('overflow-hidden rounded-lg border border-border bg-canvas', className)}>
      {(label || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-2.5">
          {label ? <span className="font-mono text-caption text-fg-subtle">{label}</span> : <span />}
          {action}
        </div>
      )}
      <div className={cn(padded && 'p-6 md:p-8')}>{children}</div>
    </div>
  )
  return inspect ? <Inspectable {...inspect}>{frame}</Inspectable> : frame
}
