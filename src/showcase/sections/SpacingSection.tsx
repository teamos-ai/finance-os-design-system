/**
 * SpacingSection — documents the 8px space scale, container widths, breakpoints
 * and the 12-column grid. Built inline with tokenised divs; no new components.
 */
import { Section, Demo } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'

/** The 8px-derived spacing scale. Each step renders a live gold ruler. */
const SPACE_SCALE: { token: string; px: number; note: string }[] = [
  { token: 'space-1', px: 4, note: 'Hairline gaps, icon insets' },
  { token: 'space-2', px: 8, note: 'Base unit — tight stacks' },
  { token: 'space-3', px: 12, note: 'Control padding' },
  { token: 'space-4', px: 16, note: 'Default element gap' },
  { token: 'space-6', px: 24, note: 'Card padding, group spacing' },
  { token: 'space-8', px: 32, note: 'Section sub-rhythm' },
  { token: 'space-12', px: 48, note: 'Block separation' },
  { token: 'space-16', px: 64, note: 'Major vertical rhythm' },
]

/** Container width ladder. */
const CONTAINERS: { token: string; px: string; use: string }[] = [
  { token: 'max-w-2xl', px: '672px', use: 'Reading column, prose, forms' },
  { token: 'max-w-4xl', px: '896px', use: 'Focused content, dialogs' },
  { token: 'max-w-5xl', px: '1024px', use: 'Showcase section width' },
  { token: 'max-w-6xl', px: '1152px', use: 'Dashboard content' },
  { token: 'max-w-7xl', px: '1280px', use: 'Full application shell' },
]

/** Responsive breakpoints. */
const BREAKPOINTS: { token: string; px: string; note: string }[] = [
  { token: 'sm', px: '640px', note: 'Large phone — stacks resolve' },
  { token: 'md', px: '768px', note: 'Tablet — two-up layouts' },
  { token: 'lg', px: '1024px', note: 'Laptop — full grids' },
  { token: 'xl', px: '1280px', note: 'Desktop — shell at rest' },
]

export function SpacingSection() {
  // widest bar (64px) sets the track length the rulers scale within.
  const maxPx = 64

  return (
    <Section
      id="spacing"
      eyebrow="07 - Spacing & Layout"
      title="Spacing & Layout"
      lead="Everything sits on an 8px grid. The scale below, a small set of container widths and four breakpoints give every surface the same quiet, predictable rhythm."
    >
      <div className="flex flex-col gap-12">
        {/* SPACE SCALE -------------------------------------------------- */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <MonoLabel tone="amber" dot>
              The 8px scale
            </MonoLabel>
            <span className="font-mono text-mono-xs text-fg-subtle">base unit = 8px</span>
          </div>

          <Demo label="space scale · live rulers">
            <div className="flex flex-col">
              {SPACE_SCALE.map((step, i) => (
                <div
                  key={step.token}
                  className={
                    'grid grid-cols-[6.5rem_1fr] items-center gap-4 py-3 sm:grid-cols-[7rem_minmax(0,1fr)_12rem]' +
                    (i !== 0 ? ' border-t border-border-subtle' : '')
                  }
                >
                  {/* token + px */}
                  <div className="flex flex-col">
                    <span className="font-mono text-mono-xs text-fg">{step.token}</span>
                    <span className="font-mono text-mono-xs tabular-nums text-fg-subtle">
                      {step.px}px
                    </span>
                  </div>

                  {/* the gold ruler */}
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-full max-w-[16rem] overflow-hidden rounded-xs bg-inset">
                      <div
                        className="h-full rounded-xs bg-gradient-accent shadow-glow"
                        style={{ width: `${(step.px / maxPx) * 100}%` }}
                        aria-hidden
                      />
                    </div>
                  </div>

                  {/* usage note — hidden on the tightest viewports */}
                  <span className="hidden font-body text-body-sm text-fg-muted sm:block">
                    {step.note}
                  </span>
                </div>
              ))}
            </div>
          </Demo>

          <p className="font-body text-body-sm text-fg-subtle">
            Steps map to Tailwind spacing utilities (<span className="font-mono">p-2</span>,{' '}
            <span className="font-mono">gap-4</span>, <span className="font-mono">mt-6</span>…). Reach
            for the named step rather than an arbitrary value — drift off the grid is the first thing
            that reads as untidy.
          </p>
        </div>

        {/* CONTAINERS + BREAKPOINTS ------------------------------------ */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* container widths */}
          <div className="flex flex-col gap-4">
            <MonoLabel tone="accent" dot>
              Container widths
            </MonoLabel>
            <Demo label="max-width ladder" padded={false}>
              <div className="flex flex-col">
                {CONTAINERS.map((c, i) => (
                  <div
                    key={c.token}
                    className={
                      'flex flex-col gap-2 px-5 py-4' +
                      (i !== 0 ? ' border-t border-border-subtle' : '')
                    }
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-mono text-mono-xs text-fg">{c.token}</span>
                      <span className="font-mono text-mono-xs tabular-nums text-fg-subtle">
                        {c.px}
                      </span>
                    </div>
                    <span className="font-body text-body-sm text-fg-muted">{c.use}</span>
                  </div>
                ))}
              </div>
            </Demo>
          </div>

          {/* breakpoints */}
          <div className="flex flex-col gap-4">
            <MonoLabel tone="accent" dot>
              Breakpoints
            </MonoLabel>
            <Demo label="responsive thresholds" padded={false}>
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-5 py-3 font-mono text-mono-xs uppercase text-fg-subtle">
                      Prefix
                    </th>
                    <th className="px-5 py-3 font-mono text-mono-xs uppercase text-fg-subtle">
                      Min width
                    </th>
                    <th className="hidden px-5 py-3 font-mono text-mono-xs uppercase text-fg-subtle sm:table-cell">
                      Behaviour
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {BREAKPOINTS.map((b) => (
                    <tr key={b.token} className="border-b border-border-subtle last:border-b-0">
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-body-sm text-accent-text">{b.token}:</span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-body-sm tabular-nums text-fg">
                        {b.px}
                      </td>
                      <td className="hidden px-5 py-3.5 font-body text-body-sm text-fg-muted sm:table-cell">
                        {b.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Demo>
            <p className="font-body text-body-sm text-fg-subtle">
              Mobile-first: design for the smallest width, then layer up with{' '}
              <span className="font-mono">md:</span> and <span className="font-mono">lg:</span>{' '}
              utilities. Grids stack below their threshold.
            </p>
          </div>
        </div>

        {/* 12-COLUMN GRID --------------------------------------------- */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <MonoLabel tone="amber" dot>
              12-column grid
            </MonoLabel>
            <span className="font-mono text-mono-xs text-fg-subtle">gutter = space-4 (16px)</span>
          </div>

          <Demo label="grid · 12 columns, 16px gutter">
            <div className="flex flex-col gap-5">
              {/* the column track */}
              <div className="grid grid-cols-12 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex h-12 items-center justify-center rounded-xs bg-accent-soft"
                  >
                    <span className="font-mono text-mono-xs tabular-nums text-accent-text">
                      {i + 1}
                    </span>
                  </div>
                ))}
              </div>

              {/* a representative span layout */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 flex h-14 items-center rounded-sm bg-surface px-4 md:col-span-8">
                  <span className="font-mono text-mono-xs text-fg-muted">
                    col-span-12 · md:col-span-8
                  </span>
                </div>
                <div className="col-span-12 flex h-14 items-center rounded-sm border border-border bg-canvas px-4 md:col-span-4">
                  <span className="font-mono text-mono-xs text-fg-muted">
                    col-span-12 · md:col-span-4
                  </span>
                </div>
              </div>
            </div>
          </Demo>

          <p className="font-body text-body-sm text-fg-subtle">
            Twelve columns divide cleanly into halves, thirds, quarters and sixths. Spans collapse to
            full width below <span className="font-mono">md</span>, so the same markup reads on a
            phone and a trading desk.
          </p>
        </div>
      </div>
    </Section>
  )
}
