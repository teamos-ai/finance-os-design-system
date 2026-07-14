/**
 * SpacingSection — the 8px space scale, container widths, breakpoints and the 12-column grid.
 * Px values stay on the page (design info); the utility-class tokens + CSS live inside each
 * block's "+" inspector.
 */
import { Section, Demo } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import type { InspectData } from '@/components/ui/inspectable'

/** The 8px-derived spacing scale. Each step renders a live amber ruler. */
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

const SPACE_INSPECT: InspectData = {
  name: 'Spacing scale',
  explain: 'Everything sits on an 8px grid. Reach for a named step, never an arbitrary value — drift off the grid is the first thing that reads as untidy.',
  token: SPACE_SCALE.map((s) => `${s.token}  ·  ${s.px}px  ·  ${s.note}`).join('\n'),
  code: SPACE_SCALE.map((s) => `--${s.token}: ${s.px}px;`).join('\n'),
  download: { filename: 'spacing.css', content: ':root {\n' + SPACE_SCALE.map((s) => `  --${s.token}: ${s.px}px;`).join('\n') + '\n}', mime: 'text/css' },
}
const CONTAINER_INSPECT: InspectData = {
  name: 'Container widths',
  explain: 'A small ladder of max-widths — from the reading column up to the full application shell.',
  token: CONTAINERS.map((c) => `${c.token}  ·  ${c.px}  ·  ${c.use}`).join('\n'),
  code: CONTAINERS.map((c) => `.${c.token} { max-width: ${c.px}; }`).join('\n'),
  download: { filename: 'containers.css', content: CONTAINERS.map((c) => `.${c.token} { max-width: ${c.px}; }`).join('\n'), mime: 'text/css' },
}
const BREAKPOINT_INSPECT: InspectData = {
  name: 'Breakpoints',
  explain: 'Mobile-first thresholds. Design for the smallest width, then layer up. Grids stack below their threshold.',
  token: BREAKPOINTS.map((b) => `${b.token}  ·  ${b.px}  ·  ${b.note}`).join('\n'),
  code: BREAKPOINTS.map((b) => `@media (min-width: ${b.px}) { /* ${b.token} */ }`).join('\n'),
  download: { filename: 'breakpoints.css', content: BREAKPOINTS.map((b) => `@media (min-width: ${b.px}) { /* ${b.token} */ }`).join('\n'), mime: 'text/css' },
}
const GRID_INSPECT: InspectData = {
  name: '12-column grid',
  explain: 'Twelve columns divide cleanly into halves, thirds, quarters and sixths, with a 16px gutter. Spans collapse to full width below the md breakpoint.',
  token: 'grid-cols-12 · gap-4 (16px gutter)\ncol-span-12 md:col-span-8  +  col-span-12 md:col-span-4',
  code: '<div class="grid grid-cols-12 gap-4">\n  <div class="col-span-12 md:col-span-8">main</div>\n  <div class="col-span-12 md:col-span-4">aside</div>\n</div>',
  download: { filename: 'grid-12.html', content: '<div class="grid grid-cols-12 gap-4">\n  <div class="col-span-12 md:col-span-8">main</div>\n  <div class="col-span-12 md:col-span-4">aside</div>\n</div>', mime: 'text/html' },
}

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

          <Demo label="space scale · live rulers" inspect={SPACE_INSPECT}>
            <div className="flex flex-col">
              {SPACE_SCALE.map((step, i) => (
                <div
                  key={step.token}
                  className={
                    'grid grid-cols-[4rem_1fr] items-center gap-4 py-3 sm:grid-cols-[4.5rem_minmax(0,1fr)_12rem]' +
                    (i !== 0 ? ' border-t border-border-subtle' : '')
                  }
                >
                  {/* px value */}
                  <span className="font-mono text-mono-xs tabular-nums text-fg">{step.px}px</span>

                  {/* the amber ruler */}
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
        </div>

        {/* CONTAINERS + BREAKPOINTS ------------------------------------ */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* container widths */}
          <div className="flex flex-col gap-4">
            <MonoLabel tone="accent" dot>
              Container widths
            </MonoLabel>
            <Demo label="max-width ladder" padded={false} inspect={CONTAINER_INSPECT}>
              <div className="flex flex-col">
                {CONTAINERS.map((c, i) => (
                  <div
                    key={c.token}
                    className={
                      'flex flex-col gap-2 px-5 py-4' +
                      (i !== 0 ? ' border-t border-border-subtle' : '')
                    }
                  >
                    <span className="font-mono text-mono-xs tabular-nums text-fg">{c.px}</span>
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
            <Demo label="responsive thresholds" padded={false} inspect={BREAKPOINT_INSPECT}>
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border">
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
          </div>
        </div>

        {/* 12-COLUMN GRID --------------------------------------------- */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <MonoLabel tone="amber" dot>
              12-column grid
            </MonoLabel>
            <span className="font-mono text-mono-xs text-fg-subtle">16px gutter</span>
          </div>

          <Demo label="grid · 12 columns, 16px gutter" inspect={GRID_INSPECT}>
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
                  <span className="font-body text-body-sm text-fg-muted">8 columns</span>
                </div>
                <div className="col-span-12 flex h-14 items-center rounded-sm border border-border bg-canvas px-4 md:col-span-4">
                  <span className="font-body text-body-sm text-fg-muted">4 columns</span>
                </div>
              </div>
            </div>
          </Demo>
        </div>
      </div>
    </Section>
  )
}
