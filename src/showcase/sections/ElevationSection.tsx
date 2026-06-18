import { Section } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'

const RADII = [
  { token: 'rounded-xs', px: '2px', use: 'tiny marks' },
  { token: 'rounded-sm', px: '4px', use: 'badges, dots, inputs' },
  { token: 'rounded-md', px: '6px', use: 'buttons, chips' },
  { token: 'rounded-lg', px: '8px', use: 'cards, panels — the cap' },
]

const SHADOWS = [
  { token: 'shadow-sm', use: 'subtle hover lift' },
  { token: 'shadow-md', use: 'cards, popovers' },
  { token: 'shadow-lg', use: 'modals, raised panels' },
]

export function ElevationSection() {
  return (
    <Section
      id="elevation"
      eyebrow="08 — Radius & Elevation"
      title="Radius & Elevation"
      lead="A tight corner scale — 2, 4, 6 and 8px, with no pills or full rounds. Depth stays restrained: soft neutral shadows plus the signature amber glow on brand surfaces."
    >
      <div className="space-y-10">
        <div>
          <MonoLabel tone="amber" dot>Radius · 8px maximum</MonoLabel>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {RADII.map((r) => (
              <div key={r.token} className="flex flex-col items-center gap-3">
                <div className={`h-20 w-full border border-border-strong bg-elevated ${r.token}`} />
                <div className="text-center">
                  <code className="font-mono text-mono-xs text-accent-text">{r.token}</code>
                  <p className="font-mono text-caption text-fg-subtle">
                    {r.px} · {r.use}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <MonoLabel tone="subtle">Elevation · shadows</MonoLabel>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {SHADOWS.map((s) => (
              <div key={s.token} className={`rounded-lg border border-border bg-surface p-6 ${s.token}`}>
                <code className="font-mono text-mono-xs text-accent-text">{s.token}</code>
                <p className="mt-1 font-mono text-caption text-fg-subtle">{s.use}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <MonoLabel tone="amber" dot>Signature glow · shadow-glow</MonoLabel>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-surface p-8">
              <div className="h-16 w-16 rounded-lg bg-gradient-accent shadow-glow" />
              <p className="font-mono text-caption text-fg-subtle">amber glow on an accent tile</p>
            </div>
            <div className="flex items-center rounded-lg border border-border bg-surface p-8">
              <p className="font-body text-body-sm leading-relaxed text-fg-muted">
                The glow replaces heavy drop-shadows on brand surfaces — a soft amber halo
                (<code className="text-accent-text">shadow-glow</code>) that reads as luxury, not noise. Reserved
                for the gradient CTA and the logo mark.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
