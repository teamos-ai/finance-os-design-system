/**
 * ElevationSection — documents corners and elevation. A radius row of labelled
 * tiles (xs→lg, the 8px squircle cap, plus the pill exception), an elevation row
 * of cards (sm/md/lg and the signature coloured glow), and the two interaction
 * patterns the system leans on: the focus ring and the glow-on-accent surface.
 * Built inline with tokenised divs — no new shared files.
 */
import { Section, Demo } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'

/** Corner radii. `lg` is the 8px squircle cap for every surface; pill is the
 *  documented exception (Badge, ThemeToggle, CommandChip only). */
const RADII: { token: string; cls: string; px: string; note: string }[] = [
  { token: 'rounded-xs', cls: 'rounded-xs', px: '2px', note: 'Rulers, chips, dense data cells' },
  { token: 'rounded-sm', cls: 'rounded-sm', px: '4px', note: 'Inputs, small controls, tags' },
  { token: 'rounded-md', cls: 'rounded-md', px: '6px', note: 'Buttons, fields — the default' },
  { token: 'rounded-lg', cls: 'rounded-lg', px: '8px', note: 'Cards, panels — the squircle cap' },
  { token: 'rounded-pill', cls: 'rounded-pill', px: '999px', note: 'Badges & toggles only — never panels' },
]

/** Soft shadows lift surfaces above the canvas; glow is the brand signature. */
const ELEVATION: { token: string; cls: string; label: string; note: string }[] = [
  { token: 'shadow-sm', cls: 'shadow-sm', label: 'Resting', note: 'Hairline lift — list rows, inline cards' },
  { token: 'shadow-md', cls: 'shadow-md', label: 'Raised', note: 'Default card depth, hovered controls' },
  { token: 'shadow-lg', cls: 'shadow-lg', label: 'Floating', note: 'Popovers, menus, modals, command bar' },
]

export function ElevationSection() {
  return (
    <Section
      id="elevation"
      eyebrow="08 - Radius & Elevation"
      title="Radius & Elevation"
      lead="Every corner sits on a small, deliberate radius scale capped at 8px — the squircle that keeps the system calm and modern. Depth is carried by three soft shadows plus one signature: the gold glow."
    >
      <div className="flex flex-col gap-12">
        {/* RADIUS ROW -------------------------------------------------- */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <MonoLabel tone="amber" dot>
              Corner radii
            </MonoLabel>
            <span className="font-mono text-mono-xs text-fg-subtle">squircle cap = 8px</span>
          </div>

          <Demo label="radius scale · live tiles">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {RADII.map((r) => (
                <div key={r.token} className="flex flex-col gap-3">
                  <div
                    className={`flex h-20 items-center justify-center border border-border-subtle bg-accent-soft ${r.cls}`}
                    aria-hidden
                  >
                    <span className="font-mono text-mono-xs tabular-nums text-accent-text">
                      {r.px}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-mono-xs text-fg">{r.token}</span>
                    <span className="font-body text-body-sm leading-snug text-fg-muted">
                      {r.note}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Demo>

          <p className="font-body text-body-sm text-fg-subtle">
            Reach for the named radius, never an arbitrary value. Panels and cards stop at{' '}
            <span className="font-mono">rounded-lg</span> (8px); only Badge, the theme toggle and
            command chips use <span className="font-mono">rounded-pill</span>. Nothing rounder.
          </p>
        </div>

        {/* ELEVATION ROW ----------------------------------------------- */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <MonoLabel tone="accent" dot>
              Elevation
            </MonoLabel>
            <span className="font-mono text-mono-xs text-fg-subtle">3 shadows + 1 glow</span>
          </div>

          <Demo label="elevation scale · shadows & the signature glow">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {ELEVATION.map((e) => (
                <div key={e.token} className="flex flex-col gap-3">
                  <div
                    className={`flex h-28 flex-col items-center justify-center gap-1 rounded-lg border border-border-subtle bg-elevated ${e.cls}`}
                  >
                    <span className="font-display text-title-sm text-fg">{e.label}</span>
                    <span className="font-mono text-mono-xs text-fg-subtle">{e.token}</span>
                  </div>
                  <span className="font-body text-body-sm leading-snug text-fg-muted">
                    {e.note}
                  </span>
                </div>
              ))}

              {/* the signature: gold glow on a gradient-accent tile */}
              <div className="flex flex-col gap-3">
                <div className="flex h-28 flex-col items-center justify-center gap-1 rounded-lg bg-gradient-accent shadow-glow">
                  <span className="font-display text-title-sm text-fg-onaccent">Signature</span>
                  <span className="font-mono text-mono-xs text-fg-onaccent opacity-80">
                    shadow-glow
                  </span>
                </div>
                <span className="font-body text-body-sm leading-snug text-fg-muted">
                  The gold halo — reserved for one hero surface or primary call to action per view.
                </span>
              </div>
            </div>
          </Demo>

          <p className="font-body text-body-sm text-fg-subtle">
            Shadows climb with importance: <span className="font-mono">sm</span> for resting rows,{' '}
            <span className="font-mono">md</span> for cards, <span className="font-mono">lg</span> for
            anything that floats over the page. The <span className="font-mono">glow</span> is brand
            punctuation, not decoration — use it sparingly so it keeps its weight.
          </p>
        </div>

        {/* INTERACTION PATTERNS ---------------------------------------- */}
        <div className="flex flex-col gap-4">
          <MonoLabel tone="accent" dot>
            Interaction patterns
          </MonoLabel>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* FOCUS RING */}
            <Demo label="focus ring · keyboard affordance">
              <div className="flex flex-col items-center gap-6 py-4">
                <button
                  type="button"
                  className="rounded-md bg-accent px-5 py-2.5 font-display text-title-sm text-accent-fg shadow-sm outline-none ring-2 ring-ring ring-offset-2 ring-offset-canvas"
                >
                  Focused control
                </button>
                <div className="flex flex-col items-center gap-1 text-center">
                  <span className="font-mono text-mono-xs text-fg">
                    ring-2 · ring-ring · ring-offset-2
                  </span>
                  <span className="max-w-xs font-body text-body-sm leading-snug text-fg-muted">
                    Every interactive element wears this ring on{' '}
                    <span className="font-mono">:focus-visible</span> — a 2px gold halo with an
                    offset so it reads clearly on any surface.
                  </span>
                </div>
              </div>
            </Demo>

            {/* GLOW ON ACCENT */}
            <Demo label="glow on accent · the hero surface">
              <div className="flex flex-col items-center gap-6 py-4">
                <div className="flex h-24 w-full max-w-xs items-center justify-center rounded-lg bg-gradient-accent px-6 shadow-glow">
                  <span className="font-display text-title-md text-fg-onaccent">
                    Finance&nbsp;OS
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <span className="font-mono text-mono-xs text-fg">
                    bg-gradient-accent · shadow-glow
                  </span>
                  <span className="max-w-xs font-body text-body-sm leading-snug text-fg-muted">
                    The gold gradient paired with the glow — the system's most emphatic surface. One
                    per screen, anchoring the single thing that matters most.
                  </span>
                </div>
              </div>
            </Demo>
          </div>
        </div>
      </div>
    </Section>
  )
}
