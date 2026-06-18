import { Section } from '@/showcase/Section'
import { MonoLabel, type MonoTone } from '@/components/ui/mono-label'
import { Swatch, GradientSwatch } from '@/components/ui/swatch'

type Shade = { hex: string; label: string; primary?: boolean }

const AMBER: Shade[] = [
  { hex: '#F0B966', label: '100' },
  { hex: '#EBA133', label: '200' },
  { hex: '#E68A00', label: '300', primary: true },
  { hex: '#B86E00', label: '400' },
  { hex: '#8A5300', label: '500' },
]
const BLUE: Shade[] = [
  { hex: '#ADB6D2', label: '100' },
  { hex: '#8591BC', label: '200' },
  { hex: '#5C6DA5', label: '300' },
  { hex: '#33488F', label: '400', primary: true },
  { hex: '#1F2B56', label: '500' },
]
const NEUTRAL: Shade[] = [
  { hex: '#FFFFFF', label: 'White' },
  { hex: '#F4F5F7', label: '100' },
  { hex: '#C9CDD6', label: '200' },
  { hex: '#8B93A3', label: '300' },
  { hex: '#3A3F4B', label: '400' },
  { hex: '#0F1115', label: '500' },
  { hex: '#000000', label: 'Black' },
]

const SEMANTIC: [string, string][] = [
  ['canvas', 'page ground — true black / pure white / warm ivory'],
  ['surface · elevated', 'cards & panels, then raised menus/popovers'],
  ['fg · fg-muted · fg-subtle', 'text — primary, secondary, tertiary'],
  ['border · border-strong', 'hairlines & dividers'],
  ['accent', 'Momentum Amber — primary CTA + focus ring'],
  ['brand', 'Atlas Blue — secondary, info, links'],
  ['success · warning · danger · info', 'state colours'],
  ['canvas-muted', 'the crinkle / off-section ground'],
]

function Ramp({ name, tone, note, shades }: { name: string; tone: MonoTone; note: string; shades: Shade[] }) {
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <MonoLabel tone={tone} dot>{name}</MonoLabel>
        <span className="font-mono text-caption text-fg-subtle">{note}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
        {shades.map((s) => (
          <Swatch key={s.label} hex={s.hex} label={s.label} primary={s.primary} />
        ))}
      </div>
    </div>
  )
}

export function ColorSection() {
  return (
    <Section
      id="color"
      eyebrow="05 — Color"
      title="Color"
      lead="Two accent families — Momentum Amber (primary) and Atlas Blue (secondary) — plus a neutral white-to-black ramp. Five shades each. Components name a semantic token, never a raw hex; click any swatch to copy."
    >
      <div className="space-y-10">
        <Ramp name="Momentum Amber" tone="amber" note="primary accent · CTA, focus, the gradient" shades={AMBER} />
        <Ramp name="Atlas Blue" tone="brand" note="secondary accent · info, structure, links" shades={BLUE} />
        <Ramp name="Neutral" tone="subtle" note="type, hairlines & surfaces — white through black" shades={NEUTRAL} />

        <div>
          <MonoLabel tone="amber" dot>Signature gradient</MonoLabel>
          <div className="mt-3 max-w-md">
            <GradientSwatch label="gradient-accent · amber sweep" css="linear-gradient(135deg, #F0B966 0%, #E68A00 100%)" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <MonoLabel tone="subtle">Semantic surfaces — what components actually name</MonoLabel>
          <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {SEMANTIC.map(([token, desc]) => (
              <div key={token} className="flex flex-col border-b border-border-subtle pb-2">
                <dt className="font-mono text-caption text-accent-text">{token}</dt>
                <dd className="font-body text-body-sm text-fg-muted">{desc}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 font-mono text-caption text-fg-subtle">
            Every foreground/background pair passes WCAG AA across dark, light and paper.
          </p>
        </div>
      </div>
    </Section>
  )
}
