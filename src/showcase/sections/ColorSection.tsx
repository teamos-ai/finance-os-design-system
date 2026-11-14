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

/* ── The anchor + the neutrals — the structural trio. ─────────────────────────── */
const PRIMARIES: Primary[] = [
  {
    key: 'blue', name: 'Atlas Blue', role: 'The anchor · brand accent, CTAs, focus, links, the gradient',
    hex: '#33488F', rgb: '51, 72, 143',
    shades: [{ label: '100', hex: '#ADB6D2' }, { label: '200', hex: '#8591BC' }, { label: '300', hex: '#5C6DA5' }, { label: '400', hex: '#33488F', main: true }, { label: '500', hex: '#1F2B56' }],
    usage: 'Fill and text — #33488F (400) on white. The sole brand accent, and it owns ALL typographic highlight.',
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

/* ── The functional ecosystem — signals that sit AROUND the anchor. ───────────────
   Each is tuned to clear WCAG AA on white and kept deliberately deep/muted so it
   reads as one family with Atlas Blue rather than shouting. Blue carries the brand;
   these carry meaning only, used sparingly. (text = the AA-safe shade on white.) */
type StateColor = {
  key: string
  name: string
  role: string
  base: string
  onBase: string
  soft: string
  text: string
  token: string
  usage: string
}
const STATES: StateColor[] = [
  {
    key: 'success', name: 'Success', role: 'Positive — settled, approved, on track',
    base: '#0E6B49', onBase: '#FFFFFF', soft: 'rgba(19, 138, 94, 0.12)', text: '#0E6B49',
    token: '--c-success · --c-success-soft',
    usage: 'Settlement done, approval, positive movement. A functional signal — never brand, never decoration.',
  },
  {
    key: 'danger', name: 'Danger', role: 'Critical — failed, rejected, blocked',
    base: '#A81E23', onBase: '#FFFFFF', soft: 'rgba(213, 41, 47, 0.10)', text: '#A81E23',
    token: '--c-danger · --c-danger-soft',
    usage: 'Errors and destructive actions only. Used rarely, and the one hue allowed to feel urgent.',
  },
  {
    key: 'amber', name: 'Amber · attention', role: 'Pending — awaiting, overdue, at-risk',
    base: '#D99A3E', onBase: '#14161B', soft: 'rgba(217, 154, 62, 0.16)', text: '#8A5A0F',
    token: '--c-amber · --c-amber-text · --c-amber-soft',
    usage: 'Attention / pending state and star ratings — ≈ one amber moment per view. Status only: never type, never a CTA.',
  },
  {
    key: 'info', name: 'Info', role: 'Neutral — informational',
    base: '#5C6DA5', onBase: '#FFFFFF', soft: 'rgba(92, 109, 165, 0.14)', text: '#33488F',
    token: '--c-info · --c-info-soft',
    usage: 'Quiet informational notes — a lighter blue so it never competes with the Atlas-Blue accent.',
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

/* ── A functional-ecosystem card — base, soft fill, AA text, role + usage. ───────── */
function StateCard({ s }: { s: StateColor }) {
  const [copied, copy] = useCopy()
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => copy(s.base)}
          aria-label={`Copy ${s.base}`}
          className="group relative h-10 w-10 shrink-0 rounded-md border border-border-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          style={{ background: s.base }}
        >
          <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100" style={{ color: s.onBase }}>
            {copied ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <span className="font-mono text-[0.5625rem] opacity-80">copy</span>}
          </span>
        </button>
        <div className="min-w-0 flex-1">
          <div className="font-display text-title-sm text-fg">{s.name}</div>
          <div className="font-mono text-caption text-fg-subtle">{s.role}</div>
        </div>
      </div>

      {/* base · soft · AA-text samples */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center justify-center gap-1 rounded-md border border-border-subtle py-2" style={{ background: s.base }}>
          <span className="font-mono text-[0.5625rem] uppercase tracking-wider" style={{ color: s.onBase, opacity: 0.85 }}>base</span>
          <span className="font-mono text-[0.5625rem]" style={{ color: s.onBase }}>{s.base}</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 rounded-md border border-border py-2" style={{ background: s.soft }}>
          <span className="font-mono text-[0.5625rem] uppercase tracking-wider" style={{ color: s.text }}>soft</span>
          <span className="font-mono text-[0.5625rem]" style={{ color: s.text }}>fill</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 rounded-md border border-border bg-canvas py-2">
          <span className="font-mono text-[0.5625rem] uppercase tracking-wider text-fg-subtle">text</span>
          <span className="font-display text-title-sm font-bold" style={{ color: s.text }}>Aa</span>
        </div>
      </div>

      <p className="font-body text-caption leading-relaxed text-fg-muted">{s.usage}</p>
      <p className="font-mono text-mono-2xs text-fg-subtle">{s.token}</p>
    </div>
  )
}

export function ColorSection() {
  return (
    <Section
      id="color"
      eyebrow="Colour"
      title="Colour"
      lead="One anchor, a disciplined ecosystem. Atlas Blue is the brand and owns every typographic highlight; a small set of functional signals — success, danger, attention, info — sit around it, each tuned to clear WCAG AA on white so the whole palette reads as one family. Click any swatch to copy. Components always name a semantic token, never a raw hex — see Tokens for how these become the three token layers."
    >
      {/* Anchor & neutrals */}
      <MonoLabel tone="subtle" dot>Anchor &amp; neutrals</MonoLabel>
      <div className="mt-3 space-y-3">
        {PRIMARIES.map((c) => (
          <Inspectable key={c.key} {...familyInspect(c)}>
            <ColorCard c={c} />
          </Inspectable>
        ))}
      </div>

      {/* The functional ecosystem */}
      <div className="mt-10">
        <MonoLabel tone="subtle" dot>The functional ecosystem</MonoLabel>
        <p className="mt-2 max-w-3xl font-body text-body-sm leading-relaxed text-fg-muted">
          These carry <span className="text-highlight">meaning, not brand</span>. Each is deliberately deep and muted so it
          sits beside Atlas Blue rather than competing with it, and each clears AA on white. Blue stays the only accent and
          the only colour on type; these appear sparingly, as signals.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {STATES.map((s) => (
            <StateCard key={s.key} s={s} />
          ))}
        </div>
      </div>

      {/* Signature gradient */}
      <div className="mt-10">
        <MonoLabel tone="brand" dot>Signature gradient</MonoLabel>
        <div className="mt-3">
          <Inspectable
            name="Signature gradient"
            explain="The Atlas Blue sweep — Blue 300 → 400 at 135°. The system's one gradient; used for the hero accent and gradient banner. Everything else stays flat."
            token={'gradient-accent\n--c-gradient-accent'}
            code={'background: linear-gradient(135deg, #5C6DA5 0%, #33488F 100%);'}
            download={{ filename: 'gradient-accent.css', content: '.gradient-accent {\n  background: linear-gradient(135deg, #5C6DA5 0%, #33488F 100%);\n}', mime: 'text/css' }}
          >
            <GradientSwatch label="Atlas Blue sweep" css="linear-gradient(135deg, #5C6DA5 0%, #33488F 100%)" />
          </Inspectable>
        </div>
      </div>
    </Section>
  )
}
