import { Section } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { Inspectable, type InspectData } from '@/components/ui/inspectable'

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

const RADIUS_INSPECT: InspectData = {
  name: 'Radius scale',
  explain: 'A tight corner scale — 2, 4, 6 and 8px. 8px is the cap: no pills, no full rounds on UI boxes.',
  token: RADII.map((r) => `${r.token}  ·  ${r.px}  ·  ${r.use}`).join('\n'),
  code: '--radius-xs: 2px;\n--radius-sm: 4px;\n--radius-md: 6px;\n--radius-lg: 8px;',
  download: { filename: 'radius.css', content: ':root {\n  --radius-xs: 2px;\n  --radius-sm: 4px;\n  --radius-md: 6px;\n  --radius-lg: 8px;\n}', mime: 'text/css' },
}
const SHADOW_INSPECT: InspectData = {
  name: 'Elevation — shadows',
  explain: 'Restrained neutral depth. sm for hover lift, md for cards & popovers, lg for modals and raised panels.',
  token: SHADOWS.map((s) => `${s.token}  ·  ${s.use}`).join('\n'),
  code: 'box-shadow: var(--shadow-sm);  /* or --shadow-md / --shadow-lg */',
  download: { filename: 'elevation.css', content: '/* dark theme */\n:root {\n  --shadow-sm: 0 1px 2px rgba(0,0,0,.6);\n  --shadow-md: 0 6px 20px -6px rgba(0,0,0,.7);\n  --shadow-lg: 0 18px 50px -12px rgba(0,0,0,.8);\n}', mime: 'text/css' },
}
const GLOW_INSPECT: InspectData = {
  name: 'Signature glow',
  explain: 'A soft amber halo that replaces heavy drop-shadows on brand surfaces — reserved for the gradient CTA and the logo mark.',
  token: 'shadow-glow\n--shadow-glow',
  code: 'box-shadow: 0 0 40px -8px rgba(230,138,0,0.45);',
  download: { filename: 'glow.css', content: '.shadow-glow {\n  box-shadow: 0 0 40px -8px rgba(230,138,0,0.45);\n}', mime: 'text/css' },
}

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
          <Inspectable {...RADIUS_INSPECT} className="mt-4">
            <div className="grid grid-cols-2 gap-4 rounded-lg sm:grid-cols-4">
              {RADII.map((r) => (
                <div key={r.token} className="flex flex-col items-center gap-3">
                  <div className={`h-20 w-full border border-border-strong bg-elevated ${r.token}`} />
                  <p className="text-center font-mono text-caption text-fg-subtle">
                    {r.px} · {r.use}
                  </p>
                </div>
              ))}
            </div>
          </Inspectable>
        </div>

        <div>
          <MonoLabel tone="subtle">Elevation · shadows</MonoLabel>
          <Inspectable {...SHADOW_INSPECT} className="mt-4">
            <div className="grid gap-4 rounded-lg sm:grid-cols-3">
              {SHADOWS.map((s) => (
                <div key={s.token} className={`rounded-lg border border-border bg-surface p-6 ${s.token}`}>
                  <p className="font-mono text-caption text-fg-subtle">{s.use}</p>
                </div>
              ))}
            </div>
          </Inspectable>
        </div>

        <div>
          <MonoLabel tone="amber" dot>Signature glow</MonoLabel>
          <Inspectable {...GLOW_INSPECT} className="mt-4">
            <div className="grid gap-4 rounded-lg sm:grid-cols-2">
              <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-surface p-8">
                <div className="h-16 w-16 rounded-lg bg-gradient-accent shadow-glow" />
                <p className="font-mono text-caption text-fg-subtle">amber glow on an accent tile</p>
              </div>
              <div className="flex items-center rounded-lg border border-border bg-surface p-8">
                <p className="font-body text-body-sm leading-relaxed text-fg-muted">
                  The glow replaces heavy drop-shadows on brand surfaces — a soft amber halo that reads
                  as luxury, not noise. Reserved for the gradient CTA and the logo mark.
                </p>
              </div>
            </div>
          </Inspectable>
        </div>
      </div>
    </Section>
  )
}
