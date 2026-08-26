import * as React from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { Section } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { GradientSwatch } from '@/components/ui/swatch'
import { Inspectable, type InspectData } from '@/components/ui/inspectable'
import { copyText } from '@/lib/utils'
import { cn } from '@/lib/cn'

type Shade = { label: string; hex: string; main?: boolean }
type Primary = {
  key: string
  name: string
  role: string
  hex: string
  rgb: string
  shades: Shade[]
  usage: string
}

const PRIMARIES: Primary[] = [
  {
    key: 'amber', name: 'Momentum Amber', role: 'Warm accent · fills & emphasis',
    hex: '#E68A00', rgb: '230, 138, 0',
    shades: [{ label: '100', hex: '#F0B966' }, { label: '200', hex: '#EBA133' }, { label: '300', hex: '#E68A00', main: true }],
    usage: 'Fill only — amber is never used as text (ink for AA on white).',
  },
  {
    key: 'gold', name: 'Signal Gold', role: 'Brand highlight · accents & emphasis',
    hex: '#EEBA2B', rgb: '238, 186, 43',
    shades: [{ label: '100', hex: '#FBEAB8' }, { label: '200', hex: '#F4D472' }, { label: '300', hex: '#EEBA2B', main: true }],
    usage: 'Emphasis / fills only — never as text (not AA on white).',
  },
  {
    key: 'blue', name: 'Atlas Blue', role: 'Primary accent · CTAs, focus, links, the gradient',
    hex: '#33488F', rgb: '51, 72, 143',
    shades: [{ label: '100', hex: '#ADB6D2' }, { label: '200', hex: '#8591BC' }, { label: '300', hex: '#5C6DA5' }, { label: '400', hex: '#33488F', main: true }, { label: '500', hex: '#1F2B56' }],
    usage: 'Fill and text — #33488F (400) on white. The primary accent.',
  },
  {
    key: 'black', name: 'Black', role: 'Ink & inverse surface',
    hex: '#14161B', rgb: '20, 22, 27',
    shades: [{ label: 'Ink', hex: '#14161B', main: true }, { label: 'Muted', hex: '#474E5C' }, { label: 'Subtle', hex: '#646C7D' }, { label: 'Inverse', hex: '#141414' }, { label: 'Line', hex: '#E6E8EC' }],
    usage: 'Ink #14161B for text on white; #141414 is the inverse-surface + black banner.',
  },
  {
    key: 'white', name: 'White', role: 'Canvas & surfaces',
    hex: '#FFFFFF', rgb: '255, 255, 255',
    shades: [{ label: 'Canvas', hex: '#FFFFFF', main: true }, { label: 'Muted', hex: '#F6F7F9' }, { label: 'Selected', hex: '#EDEFF2' }, { label: 'Line', hex: '#E6E8EC' }, { label: 'Line-2', hex: '#CDD2DA' }],
    usage: 'Canvas #FFF · muted #F6F7F9 rhythm ground · #EDEFF2 selected lift.',
  },
]

/** Build the "+" inspector payload for a colour family — tokens/CSS live here, not on the page. */
function familyInspect(c: Primary): InspectData {
  const css = [
    `/* ${c.name} — ${c.role} */`,
    ...c.shades.map((s) => `--${c.key}-${s.label.toLowerCase()}: ${s.hex};`),
  ].join('\n')
  return {
    name: c.name,
    explain: `${c.role}. ${c.usage}`,
    token: c.shades.map((s) => `${c.key}-${s.label}${s.main ? '  (base)' : ''}  →  ${s.hex}`).join('\n'),
    code: css,
    download: { filename: `color-${c.key}.css`, content: css, mime: 'text/css' },
  }
}

function useCopy() {
  const [copied, setCopied] = React.useState(false)
  const copy = async (v: string) => {
    if (await copyText(v)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }
  }
  return [copied, copy] as const
}

function ShadeChip({ shade }: { shade: Shade }) {
  const [copied, copy] = useCopy()
  return (
    <button
      type="button"
      onClick={() => copy(shade.hex)}
      aria-label={`Copy ${shade.hex}`}
      className="group flex flex-col gap-1 rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      <span
        className={cn('relative h-12 w-full rounded-md border border-border-subtle', shade.main && 'ring-2 ring-accent ring-offset-1 ring-offset-surface')}
        style={{ background: shade.hex }}
      >
        <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
          {copied ? <Check className="h-4 w-4 text-fg" strokeWidth={2.5} /> : <span className="font-mono text-[0.625rem] text-fg/70">copy</span>}
        </span>
      </span>
      <span className="font-mono text-[0.625rem] uppercase text-fg-subtle">{shade.label}</span>
      <span className="font-mono text-[0.625rem] text-fg">{shade.hex}</span>
    </button>
  )
}

function ColorCard({ c }: { c: Primary }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-4 pr-14 text-left transition-colors duration-fast hover:bg-canvas-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <span className="h-12 w-12 shrink-0 rounded-md border border-border-subtle" style={{ background: c.hex }} aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block font-display text-title-sm text-fg">{c.name}</span>
          <span className="block font-mono text-caption text-fg-subtle">{c.role}</span>
        </span>
        <span className="hidden shrink-0 text-right sm:block">
          <span className="block font-mono text-caption text-fg">{c.hex}</span>
          <span className="block font-mono text-caption text-fg-subtle">rgb({c.rgb})</span>
        </span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-fg-subtle transition-transform duration-base', open && 'rotate-180')} strokeWidth={2} aria-hidden />
      </button>

      <div className={cn('grid transition-[grid-template-rows] duration-base ease-out', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
        <div className="overflow-hidden">
          <div className="border-t border-border p-4">
            <div className="mb-4 flex items-center gap-3 sm:hidden">
              <span className="font-mono text-caption text-fg">{c.hex}</span>
              <span className="font-mono text-caption text-fg-subtle">rgb({c.rgb})</span>
            </div>
            <MonoLabel tone="subtle" size="sm">Shades — click to copy</MonoLabel>
            <div className="mt-2.5 grid grid-cols-5 gap-2">
              {c.shades.map((s) => <ShadeChip key={s.label} shade={s} />)}
            </div>
            <div className="mt-5">
              <div className="rounded-md border border-border bg-canvas p-3">
                <MonoLabel tone="subtle" size="sm">Usage</MonoLabel>
                <p className="mt-1.5 font-body text-body-sm leading-relaxed text-fg-muted">{c.usage}</p>
              </div>
            </div>
          </div>
        </div>
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
      lead="Five locked primaries with their hex + RGB. Click any card to drop down its shade ramp and see exactly which shade to use. Components always name a semantic token, never a raw hex."
    >
      <div className="space-y-3">
        {PRIMARIES.map((c) => (
          <Inspectable key={c.key} {...familyInspect(c)}>
            <ColorCard c={c} />
          </Inspectable>
        ))}
      </div>

      <div className="mt-8">
        <MonoLabel tone="amber" dot>Signature gradient</MonoLabel>
        <div className="mt-3">
          <Inspectable
            name="Signature gradient"
            explain="The amber sweep — Momentum Amber 100 → 300 at 135°. The system's one gradient; used for the hero accent and gradient banner. Everything else stays flat."
            token={'gradient-accent\n--c-gradient-accent'}
            code={'background: linear-gradient(135deg, #F0B966 0%, #E68A00 100%);'}
            download={{ filename: 'gradient-accent.css', content: '.gradient-accent {\n  background: linear-gradient(135deg, #F0B966 0%, #E68A00 100%);\n}', mime: 'text/css' }}
          >
            <GradientSwatch label="Amber sweep" css="linear-gradient(135deg, #F0B966 0%, #E68A00 100%)" />
          </Inspectable>
        </div>
      </div>
    </Section>
  )
}
