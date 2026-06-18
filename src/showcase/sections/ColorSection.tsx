/**
 * ColorSection — the colour reference. The four primitive ramps (Signal Gold,
 * Momentum Amber, Atlas Blue, Neutral) as click-to-copy Swatch rows, the signature
 * gold → amber GradientSwatch, and a note mapping primitives onto the semantic
 * surface and text tokens that every component actually consumes. Every swatch is the
 * literal locked hex; the surrounding cards flip with the theme.
 */
import type { ReactNode } from 'react'
import { Section } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { Swatch, GradientSwatch } from '@/components/ui/swatch'

/** The four primitive ramps. Each `primary` step is the signature shade for that hue. */
const RAMPS: { name: string; note: string; primary: string; ramp: Record<string, string> }[] = [
  {
    name: 'Signal Gold',
    note: 'The accent — figures, focus, the start of the gradient.',
    primary: '500',
    ramp: {
      50: '#FCF1D5', 100: '#F8E3AA', 200: '#F5D680', 300: '#F1C855', 400: '#EEBA2B',
      500: '#BE9522', 600: '#8F701A', 700: '#5F4A11', 800: '#302509',
    },
  },
  {
    name: 'Momentum Amber',
    note: 'The warm counterweight — secondary emphasis, the gradient end.',
    primary: '300',
    ramp: {
      100: '#F0B966', 200: '#EBA133', 300: '#E68A00', 400: '#B86E00', 500: '#8A5300',
    },
  },
  {
    name: 'Atlas Blue',
    note: 'The deep base — canvas, ink and structure across the dark UI.',
    primary: '500',
    ramp: {
      50: '#D6DAE9', 100: '#ADB6D2', 200: '#8591BC', 300: '#5C6DA5', 400: '#33488F',
      500: '#293A72', 600: '#1F2B56', 700: '#141D39', 800: '#0A0E1D',
    },
  },
  {
    name: 'Neutral',
    note: 'Type and hairlines — white through near-black.',
    primary: '400',
    ramp: {
      0: '#FFFFFF', 50: '#F6F7F9', 100: '#D7DBE2', 200: '#8B93A3', 300: '#646C7D',
      400: '#333845', 500: '#22262F', 600: '#10131B', 700: '#0A0C12',
    },
  },
]

/** Semantic token → what it resolves to → which primitive it draws from. */
const SEMANTIC: { token: string; role: string; from: string }[] = [
  { token: 'bg-canvas', role: 'Page base — the deepest surface', from: 'Atlas Blue 800' },
  { token: 'bg-surface', role: 'Cards, panels, raised fields', from: 'Atlas Blue 700' },
  { token: 'bg-elevated', role: 'Menus, popovers, overlays', from: 'Atlas Blue 600' },
  { token: 'text-fg', role: 'Primary copy + figures', from: 'Neutral 0 / 50' },
  { token: 'text-fg-muted', role: 'Secondary copy, supporting labels', from: 'Neutral 200' },
  { token: 'border-border', role: 'Hairlines + dividers', from: 'Atlas Blue 500' },
  { token: 'bg-accent', role: 'Gold actions, focus, emphasis', from: 'Signal Gold 400 / 500' },
  { token: 'text-success / warning / danger', role: 'State signals', from: 'Green / Amber / Red' },
]

const Block = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="mt-12 first:mt-0">
    <MonoLabel>{title}</MonoLabel>
    <div className="mt-5">{children}</div>
  </div>
)

export function ColorSection() {
  return (
    <Section
      id="color"
      eyebrow="05 - Color"
      title="Color"
      lead="Four primitive ramps resolve into a small set of semantic surface and text tokens — the only colours any component ever names. Click any swatch to copy its hex."
    >
      {/* Primitive ramps */}
      <Block title="Primitive ramps">
        <p className="mb-6 font-mono text-caption text-fg-subtle">
          Hex + RGB on every swatch. The <span className="font-bold text-fg">★ Main</span> chip
          (ringed) marks the signature shade for each hue — the colours that drive the gradient and
          the accent surfaces.
        </p>
        <div className="flex flex-col gap-7">
          {RAMPS.map(({ name, note, primary, ramp }) => (
            <div key={name}>
              <div className="mb-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="font-mono text-caption font-bold uppercase tracking-[0.1em] text-fg-muted">
                  {name}
                </p>
                <p className="font-mono text-[10px] text-fg-subtle">{note}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
                {Object.entries(ramp).map(([step, hex]) => (
                  <Swatch key={step} hex={hex} label={step} primary={primary === step} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Block>

      {/* Signature gradient */}
      <Block title="Signature gradient">
        <div className="grid gap-5 md:grid-cols-[2fr_3fr] md:items-start">
          <GradientSwatch
            label="gradient-accent · gold → amber"
            css="linear-gradient(135deg,#EEBA2B,#E68A00)"
          />
          <p className="font-body text-body-md leading-relaxed text-fg-muted">
            The one gradient the system runs on — Signal Gold 400 into Momentum Amber 300 at 135°.
            It is the only place two hues blend, reserved for hero figures and a single primary
            action per view. Reach for the flat{' '}
            <span className="font-mono text-caption text-accent-text">bg-accent</span> token
            everywhere else; the gradient stays rare so it keeps its weight.
          </p>
        </div>
      </Block>

      {/* Semantic surfaces */}
      <Block title="Semantic surfaces + state">
        <p className="mb-5 font-mono text-caption text-fg-subtle">
          Components never name a primitive. They consume these semantic tokens, which re-point per
          theme — so a single ramp change reflows the whole UI.
        </p>
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1.2fr)] gap-4 border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-subtle sm:grid">
            <span>Token</span>
            <span>Role</span>
            <span>Resolves from</span>
          </div>
          <div className="divide-y divide-border">
            {SEMANTIC.map(({ token, role, from }) => (
              <div
                key={token}
                className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1.2fr)] sm:items-center sm:gap-4"
              >
                <span className="font-mono text-caption text-accent-text">{token}</span>
                <span className="font-body text-body-sm text-fg">{role}</span>
                <span className="font-mono text-[11px] text-fg-subtle">{from}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-5 font-body text-body-sm leading-relaxed text-fg-muted">
          Every text-on-surface pairing clears <span className="font-mono text-caption text-fg">WCAG AA</span>{' '}
          (4.5:1 for body, 3:1 for large type and non-text). Signal Gold carries the accent only on
          deep Atlas Blue, where the contrast holds; it is never set as a text colour on light fills.
        </p>
      </Block>
    </Section>
  )
}
