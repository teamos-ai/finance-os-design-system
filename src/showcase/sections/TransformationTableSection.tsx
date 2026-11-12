/**
 * TransformationTableSection — "From, and to" (Positioning).
 *
 * The brand transformations from the Finance OS positioning (section 04): each row starts with the
 * generic framing on the left and moves, across one Atlas Blue arrow, to the position built for
 * broking on the right. The destination carries full-strength ink on a calm accent-soft field; the
 * start stays muted. Emphasis is ink weight, elevation and that field — never a coloured side-rail
 * (no ribbons). Horizontal hairlines only, 8px squircles, a gentle reduced-motion-safe row reveal.
 *
 * Composes from --c-* tokens and the shared Section / Demo / Inspectable frame, and mirrors the
 * Tables comparison treatment, so it reads as one system with the showcase and the brand-positioning
 * page it is lifted from. Content is data — `transformations` (from/to pairs) from
 * src/data/positioning.ts, never hardcoded.
 */
import { ArrowRight } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { Stagger, StaggerItem } from '@/lib/motion'
import { transformations } from '@/data/positioning'
import { cn } from '@/lib/cn'

/**
 * Shared 3-column template — a fixed 4rem arrow lane so the header and every row line up across
 * the separate grids, and minmax(0,1fr) sides so a long framing line wraps instead of overflowing.
 * Below md the row collapses to a stacked flex column (from · arrow · to).
 */
const COLS = 'md:grid md:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)]'

const INSPECT = {
  name: 'Transformation row',
  explain:
    'A From → To row: the generic framing (muted ink, left) moves to the position built for broking (full-strength ink on a calm accent-soft field, right), with one Atlas Blue arrow as the only accent. Emphasis is ink weight and the destination field — never a coloured side-rail. Rows divide on horizontal hairlines only.',
  token: [
    'from    bg-surface · text-fg-muted',
    'arrow   rounded-md (8px ceiling) · bg-accent-soft → group-hover:bg-accent · text-accent/-fg',
    'to      bg-accent-soft · text-fg font-medium',
    'rule    border-b border-border (horizontal only — no vertical rails)',
    'grid    md:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)]',
  ].join('\n'),
  code: `<div className="group border-b border-border md:grid md:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)]">
  <p className="text-fg-muted md:py-5 md:pl-6 md:pr-3">{from}</p>
  <span className="grid h-9 w-9 place-items-center rounded-md bg-accent-soft text-accent
                   transition duration-base ease-out group-hover:bg-accent group-hover:text-accent-fg">
    <ArrowRight className="h-4 w-4" aria-hidden />
  </span>
  <p className="bg-accent-soft font-medium text-fg md:py-5 md:pl-3 md:pr-6">{to}</p>
</div>`,
}

export function TransformationTableSection() {
  const last = transformations.length - 1
  return (
    <Section
      id="from-and-to"
      eyebrow="Brand transformations"
      title="From, and to"
      lead="How the Finance OS story shifts — from a generic framing on the left, across one blue arrow, to the position built for broking on the right. Eight moves, one direction."
    >
      <Demo
        label="From → To — the brand transformations, generic framing to broking-specific"
        inspect={INSPECT}
      >
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          {/* column header — desktop only; stacked rows carry their own From / To micro-labels */}
          <div className={cn('hidden border-b border-border bg-canvas-muted', COLS)}>
            <div className="py-3 pl-6 pr-3">
              <MonoLabel tone="subtle">From</MonoLabel>
            </div>
            <div aria-hidden />
            <div className="bg-accent-soft py-3 pl-3 pr-6">
              <MonoLabel tone="accent">To · built for broking</MonoLabel>
            </div>
          </div>

          <Stagger>
            {transformations.map((t, i) => (
              <StaggerItem
                key={t.from}
                className={cn(
                  'group flex flex-col gap-3 px-5 py-5',
                  COLS,
                  'md:gap-0 md:px-0 md:py-0',
                  i < last && 'border-b border-border',
                )}
              >
                {/* from — the generic framing */}
                <div className="flex flex-col gap-1.5 md:justify-center md:py-5 md:pl-6 md:pr-3">
                  <span className="font-mono text-mono-2xs uppercase tracking-[0.14em] text-fg-subtle md:hidden">
                    From
                  </span>
                  <p className="font-body text-body-md leading-relaxed text-fg-muted">{t.from}</p>
                </div>

                {/* arrow — the single blue moment; points down while the row is stacked */}
                <div className="flex items-center justify-center">
                  <span
                    className={cn(
                      'grid h-9 w-9 place-items-center rounded-md bg-accent-soft text-accent',
                      'transition duration-base ease-out',
                      'group-hover:bg-accent group-hover:text-accent-fg',
                      'motion-safe:group-hover:translate-x-0.5',
                    )}
                  >
                    <ArrowRight className="h-4 w-4 rotate-90 md:rotate-0" strokeWidth={2} aria-hidden />
                  </span>
                  <span className="sr-only">becomes</span>
                </div>

                {/* to — the position built for broking */}
                <div className="flex flex-col gap-1.5 rounded-md bg-accent-soft p-4 md:justify-center md:rounded-none md:p-0 md:py-5 md:pl-3 md:pr-6">
                  <span className="font-mono text-mono-2xs uppercase tracking-[0.14em] text-accent-text md:hidden">
                    To
                  </span>
                  <p className="font-body text-body-md font-medium leading-relaxed text-fg">{t.to}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <p className="mt-2.5 font-body text-caption leading-relaxed text-fg-subtle">
          From the Finance OS positioning — section 04, Brand transformations. Each line is a shift in
          framing, not a claim of outcome.
        </p>
      </Demo>
    </Section>
  )
}
