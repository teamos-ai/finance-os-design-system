/**
 * Section — a showcase reference block. Anchor id, mono eyebrow, Spline Sans title and
 * a calm lead, then children. Generous rhythm so the reference reads like the system.
 */
import type { ReactNode } from 'react'
import { MonoLabel } from '@/components/ui/mono-label'
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

export const Section = ({ id, eyebrow, title, lead, children, className }: SectionProps) => (
  <section id={id} className={cn('scroll-mt-8 border-b border-border px-6 py-16 md:px-12 md:py-20', className)}>
    <div className="mx-auto max-w-5xl">
      <FadeIn>
        <header className="mb-10 flex flex-col items-center text-center">
          {eyebrow && <MonoLabel>{eyebrow}</MonoLabel>}
          <h2 className="mt-3 font-display text-display-md text-fg">{title}</h2>
          {lead && <p className="mt-4 max-w-2xl font-body text-body-lg leading-relaxed text-fg-muted">{lead}</p>}
        </header>
      </FadeIn>
      {children}
    </div>
  </section>
)

/** Small labelled frame for embedding a live component demo. `action` sits top-right. */
export const Demo = ({
  label,
  action,
  children,
  className,
  padded = true,
}: {
  label?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  padded?: boolean
}) => (
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
