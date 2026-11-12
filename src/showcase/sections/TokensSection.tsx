/**
 * TokensSection — the three-layer token system made visible. The DS's defining idea is that
 * every value is named once and resolved downward: a raw brand hex (primitive, `--p-*`) is
 * pointed at by an intent (semantic, `--c-*`), which a component consumes (`--btn-*`, `--card-*`).
 * Change the primitive and every surface that resolves through it follows.
 *
 * Four calm exhibits, read top to bottom:
 *   A · Resolution — pick an intent and trace one value through all three layers to a live control.
 *   B · Layer 1 Primitives — the raw ramps, rendered with the shared `Swatch` (fixed brand hexes).
 *   C · Layer 2 Semantic — live swatches read straight off the real `var(--c-*)`; click copies the token.
 *   D · Layer 3 Component — component-scoped tokens, the 2/4/6/8 radius ceiling, and the build guardrail.
 *
 * Blue owns every highlight; amber appears once, only as a status Badge (its sanctioned use). No
 * ribbons — emphasis is a full border + resting elevation. Motion is motivated (the trace re-resolves
 * on selection; the ramps reveal in sequence), each change has a static cue, and all of it is
 * reduced-motion safe. Figures use tabular-nums; interactive controls get active:scale + focus-visible.
 */
import * as React from 'react'
import { type Variants, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowDown, Boxes, Check, Ban } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { Swatch } from '@/components/ui/swatch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Stagger, StaggerItem, EASE_OUT } from '@/lib/motion'
import { copyText } from '@/lib/utils'
import { cn } from '@/lib/cn'

/* ── Data ──────────────────────────────────────────────────────────────────── */

type BadgeVariant = 'success' | 'amber' | 'danger'

/** One intent, traced through the three layers to the component that consumes it. */
interface Intent {
  key: string
  label: string
  primitive: { token: string; hex: string }
  semantic: string
  component: string
  via: string
  preview: 'button' | 'badge'
  badge?: BadgeVariant
  badgeText?: string
}

const INTENTS: Intent[] = [
  {
    key: 'accent',
    label: 'Accent',
    primitive: { token: '--p-blue-400', hex: '#33488F' },
    semantic: '--c-accent',
    component: '--btn-bg',
    via: 'Button · primary',
    preview: 'button',
  },
  {
    key: 'success',
    label: 'Success',
    primitive: { token: '--p-green-700', hex: '#0E6B49' },
    semantic: '--c-success',
    component: 'text-success · bg-success-soft',
    via: 'Badge · success',
    preview: 'badge',
    badge: 'success',
    badgeText: 'Settled',
  },
  {
    key: 'amber',
    label: 'Attention',
    primitive: { token: '--p-amber-400', hex: '#D99A3E' },
    semantic: '--c-amber',
    component: 'text-amber-text · bg-amber-soft',
    via: 'Badge · amber',
    preview: 'badge',
    badge: 'amber',
    badgeText: 'Awaiting docs',
  },
  {
    key: 'danger',
    label: 'Danger',
    primitive: { token: '--p-red-700', hex: '#A81E23' },
    semantic: '--c-danger',
    component: 'text-danger · bg-danger-soft',
    via: 'Badge · danger',
    preview: 'badge',
    badge: 'danger',
    badgeText: 'Overdue',
  },
]

type Shade = { label: string; hex: string; primary?: boolean }
type Ramp = { key: string; title: string; note: string; shades: Shade[] }

const RAMPS: Ramp[] = [
  {
    key: 'blue',
    title: 'Atlas Blue',
    note: 'The one brand accent',
    shades: [
      { label: '50', hex: '#EEF2F9' },
      { label: '100', hex: '#ADB6D2' },
      { label: '200', hex: '#8591BC' },
      { label: '300', hex: '#5C6DA5' },
      { label: '400', hex: '#33488F', primary: true },
      { label: '500', hex: '#1F2B56' },
    ],
  },
  {
    key: 'neutral',
    title: 'Neutral',
    note: 'Ink, hairlines, surfaces',
    shades: [
      { label: '100', hex: '#F4F5F7' },
      { label: '200', hex: '#C9CDD6' },
      { label: '300', hex: '#8B93A3' },
      { label: '400', hex: '#3A3F4B' },
      { label: '500', hex: '#0F1115' },
    ],
  },
  {
    key: 'amber',
    title: 'Amber · status',
    note: 'Attention / pending only — never type',
    shades: [
      { label: '300', hex: '#E8B866' },
      { label: '400', hex: '#D99A3E' },
      { label: '500', hex: '#8A5A0F' },
    ],
  },
  {
    key: 'state',
    title: 'State',
    note: 'Functional signals',
    shades: [
      { label: 'green 500', hex: '#138A5E' },
      { label: 'green 700', hex: '#0E6B49' },
      { label: 'red 500', hex: '#D5292F' },
      { label: 'red 700', hex: '#A81E23' },
    ],
  },
]

/** A resolved semantic intent — the hex it currently reads, and the `--c-*` token to copy. */
type Semantic = { token: string; label: string; hex: string }
type SemanticGroup = { title: string; items: Semantic[] }

const SEMANTIC_GROUPS: SemanticGroup[] = [
  {
    title: 'Surfaces',
    items: [
      { token: '--c-canvas', label: 'canvas', hex: '#FFFFFF' },
      { token: '--c-canvas-muted', label: 'canvas-muted', hex: '#F6F7F9' },
      { token: '--c-surface', label: 'surface', hex: '#FFFFFF' },
      { token: '--c-elevated', label: 'elevated', hex: '#FFFFFF' },
      { token: '--c-inset', label: 'inset', hex: '#F6F7F9' },
      { token: '--c-selected', label: 'selected', hex: '#EDEFF2' },
    ],
  },
  {
    title: 'Foreground & line',
    items: [
      { token: '--c-fg', label: 'fg', hex: '#14161B' },
      { token: '--c-fg-muted', label: 'fg-muted', hex: '#474E5C' },
      { token: '--c-fg-subtle', label: 'fg-subtle', hex: '#646C7D' },
      { token: '--c-border', label: 'border', hex: '#E6E8EC' },
      { token: '--c-border-strong', label: 'border-strong', hex: '#CDD2DA' },
    ],
  },
  {
    title: 'Accent & state',
    items: [
      { token: '--c-accent', label: 'accent', hex: '#33488F' },
      { token: '--c-success', label: 'success', hex: '#0E6B49' },
      { token: '--c-amber', label: 'amber', hex: '#D99A3E' },
      { token: '--c-danger', label: 'danger', hex: '#A81E23' },
      { token: '--c-info', label: 'info', hex: '#5C6DA5' },
    ],
  },
]

const SOFT_TINTS: { token: string; label: string }[] = [
  { token: '--c-accent-soft', label: 'accent-soft' },
  { token: '--c-success-soft', label: 'success-soft' },
  { token: '--c-amber-soft', label: 'amber-soft' },
  { token: '--c-danger-soft', label: 'danger-soft' },
]

const RADII: { name: string; cls: string; px: string }[] = [
  { name: 'radius-xs', cls: 'rounded-xs', px: '2px' },
  { name: 'radius-sm', cls: 'rounded-sm', px: '4px' },
  { name: 'radius-md', cls: 'rounded-md', px: '6px' },
  { name: 'radius-lg', cls: 'rounded-lg', px: '8px' },
]

const COMPONENT_TOKENS: [string, string][] = [
  ['--btn-bg', '--c-accent'],
  ['--btn-radius', '--radius-lg · 8px'],
  ['--card-bg', '--c-surface'],
  ['--card-radius', '--radius-lg · 8px'],
  ['--card-shadow', '--shadow-md'],
  ['--input-border', '--c-border-strong'],
  ['--input-radius', '--radius-md · 6px'],
]

// Rendered as plain text, never as class attributes — so the off-token examples cannot compile.
const COMPILES = ['bg-accent', 'text-fg', 'rounded-lg', 'shadow-md']
const FAILS = ['bg-gray-500', 'text-[#ff0000]', 'rounded-3xl', 'rounded-full']

/* ── Inspect payloads ──────────────────────────────────────────────────────── */

const RESOLUTION_INSPECT = {
  name: 'Token resolution',
  explain:
    'One value, three layers. A primitive hex is named once, a semantic intent points at it, and a component consumes the intent — so a rebrand edits one primitive and every surface that resolves through it follows. Pick an intent to trace it.',
  token: [
    '--p-blue-400   #33488F        (primitive)',
    '  → --c-accent                (semantic intent)',
    '    → --btn-bg → Button       (component)',
  ].join('\n'),
  code: [
    ':root {',
    '  --p-blue-400: #33488F;          /* 1 · primitive */',
    '  --c-accent:   var(--p-blue-400); /* 2 · semantic  */',
    '  --btn-bg:     var(--c-accent);   /* 3 · component */',
    '}',
  ].join('\n'),
  download: {
    filename: 'token-resolution.css',
    mime: 'text/css',
    content: [
      ':root {',
      '  --p-blue-400: #33488F;           /* primitive — raw brand value */',
      '  --c-accent:   var(--p-blue-400); /* semantic  — intent */',
      '  --btn-bg:     var(--c-accent);   /* component — consumed by Button */',
      '}',
    ].join('\n'),
  },
}

const PRIMITIVES_INSPECT = {
  name: 'Primitive ramps',
  explain:
    'Layer 1 — the raw brand values. Blue 50–500, the neutrals, the status amber and the state hues. Nothing in a component references these directly; they exist only to be pointed at by the semantic layer.',
  token: [
    '--p-blue-50 … --p-blue-500   (400 = base accent)',
    '--p-neutral-100 … --p-neutral-500',
    '--p-amber-300/400/500        (status only)',
    '--p-green-500/700 · --p-red-500/700',
  ].join('\n'),
  code: [
    ':root {',
    '  --p-blue-400: #33488F;  /* base accent */',
    '  --p-neutral-500: #0F1115;',
    '  --p-amber-400: #D99A3E; /* status */',
    '  --p-green-700: #0E6B49;',
    '  --p-red-700: #A81E23;',
    '}',
  ].join('\n'),
  download: {
    filename: 'primitives.css',
    mime: 'text/css',
    content: [
      ':root {',
      '  --p-blue-50: #EEF2F9;  --p-blue-100: #ADB6D2; --p-blue-200: #8591BC;',
      '  --p-blue-300: #5C6DA5; --p-blue-400: #33488F; --p-blue-500: #1F2B56;',
      '  --p-neutral-100: #F4F5F7; --p-neutral-200: #C9CDD6; --p-neutral-300: #8B93A3;',
      '  --p-neutral-400: #3A3F4B; --p-neutral-500: #0F1115;',
      '  --p-amber-300: #E8B866; --p-amber-400: #D99A3E; --p-amber-500: #8A5A0F;',
      '  --p-green-500: #138A5E; --p-green-700: #0E6B49;',
      '  --p-red-500: #D5292F;  --p-red-700: #A81E23;',
      '}',
    ].join('\n'),
  },
}

const SEMANTIC_INSPECT = {
  name: 'Semantic intents',
  explain:
    'Layer 2 — intent, not colour. Components only ever name these: surface, fg, border, accent, success, amber (status), danger. Each points at a primitive, so the palette can shift without touching a single component. Click a swatch to copy its token.',
  token: [
    '--c-surface  → white        --c-fg      → ink',
    '--c-border   → hairline      --c-accent  → --p-blue-400',
    '--c-success  → --p-green-700 --c-amber   → --p-amber-400 (status)',
    '--c-danger   → --p-red-700   --c-info    → --p-blue-300',
  ].join('\n'),
  code: [
    ':root {',
    '  --c-surface: #FFFFFF;',
    '  --c-fg: #14161B;',
    '  --c-border: #E6E8EC;',
    '  --c-accent: var(--p-blue-400);',
    '  --c-success: var(--p-green-700);',
    '  --c-amber: var(--p-amber-400); /* status only */',
    '  --c-danger: var(--p-red-700);',
    '}',
  ].join('\n'),
  download: {
    filename: 'semantic.css',
    mime: 'text/css',
    content: [
      ':root {',
      '  --c-canvas: #FFFFFF; --c-canvas-muted: #F6F7F9; --c-surface: #FFFFFF;',
      '  --c-elevated: #FFFFFF; --c-inset: #F6F7F9; --c-selected: #EDEFF2;',
      '  --c-fg: #14161B; --c-fg-muted: #474E5C; --c-fg-subtle: #646C7D;',
      '  --c-border: #E6E8EC; --c-border-strong: #CDD2DA;',
      '  --c-accent: var(--p-blue-400); --c-accent-soft: rgba(51, 72, 143, 0.12);',
      '  --c-success: var(--p-green-700); --c-amber: var(--p-amber-400);',
      '  --c-danger: var(--p-red-700); --c-info: var(--p-blue-300);',
      '}',
    ].join('\n'),
  },
}

const COMPONENT_INSPECT = {
  name: 'Component tokens',
  explain:
    'Layer 3 — component-scoped tokens that compose from the semantic layer, plus the radius scale (2/4/6/8, an 8px ceiling). Tailwind REPLACES the colour and radius scales rather than extending them, so bg-gray-500 or rounded-3xl never reaches the browser — it fails the build.',
  token: COMPONENT_TOKENS.map(([t, r]) => `${t.padEnd(16)} → ${r}`).join('\n'),
  code: [
    ':root {',
    '  --radius-xs: 2px; --radius-sm: 4px; --radius-md: 6px; --radius-lg: 8px;',
    '  --btn-bg: var(--c-accent);',
    '  --btn-radius: var(--radius-lg);',
    '  --card-radius: var(--radius-lg);',
    '  --input-border: var(--c-border-strong);',
    '}',
  ].join('\n'),
  download: {
    filename: 'component-tokens.css',
    mime: 'text/css',
    content: [
      ':root {',
      '  --radius-xs: 2px; --radius-sm: 4px; --radius-md: 6px; --radius-lg: 8px;',
      '  --btn-fg: var(--c-accent-fg); --btn-bg: var(--c-accent);',
      '  --btn-bg-hover: var(--c-accent-hover); --btn-radius: var(--radius-lg);',
      '  --card-bg: var(--c-surface); --card-border: var(--c-border);',
      '  --card-radius: var(--radius-lg); --card-shadow: var(--shadow-md);',
      '  --input-bg: var(--c-surface); --input-border: var(--c-border-strong);',
      '  --input-fg: var(--c-fg); --input-radius: var(--radius-md);',
      '}',
    ].join('\n'),
  },
}

/* ── A · Resolution trace ──────────────────────────────────────────────────── */

const traceContainer: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const traceItem: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE_OUT } },
}

/** A single step in the trace — a full-bordered, calmly elevated card (no ribbons). */
function Stage({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div
      variants={traceItem}
      className="flex h-full flex-col gap-2.5 rounded-lg border border-border bg-surface p-4 shadow-sm"
    >
      <MonoLabel tone="subtle" size="sm">
        {label}
      </MonoLabel>
      {children}
    </motion.div>
  )
}

/** The horizontal connector — an arrow on desktop, pointing down when the trace stacks. */
function Connector() {
  return (
    <motion.div
      variants={traceItem}
      aria-hidden
      className="flex items-center justify-center py-1 text-fg-subtle md:py-0"
    >
      <ArrowRight className="hidden h-4 w-4 md:block" strokeWidth={2} />
      <ArrowDown className="h-4 w-4 md:hidden" strokeWidth={2} />
    </motion.div>
  )
}

function Resolution() {
  const reduced = useReducedMotion()
  const [active, setActive] = React.useState('accent')
  const intent = INTENTS.find((i) => i.key === active) ?? INTENTS[0]

  return (
    <div className="flex flex-col gap-5">
      {/* intent selector — one filled selected state is the static cue */}
      <div role="group" aria-label="Choose an intent to trace" className="flex flex-wrap gap-2">
        {INTENTS.map((i) => {
          const selected = i.key === active
          return (
            <button
              key={i.key}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(i.key)}
              className={cn(
                'rounded-md border px-3.5 py-2 font-mono text-mono-xs uppercase transition-colors duration-fast ease-out active:scale-[0.96]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
                selected
                  ? 'border-accent bg-accent text-accent-fg'
                  : 'border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg',
              )}
            >
              {i.label}
            </button>
          )
        })}
      </div>

      {/* the trace — re-keyed on selection so it re-resolves (motivated); instant under reduced-motion */}
      <motion.div
        key={active}
        variants={traceContainer}
        initial={reduced ? false : 'hidden'}
        animate="show"
        className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]"
      >
        <Stage label="1 · Primitive">
          <div className="flex items-center gap-2.5">
            <span
              className="h-8 w-8 shrink-0 rounded-md ring-1 ring-inset ring-black/[0.06]"
              style={{ background: intent.primitive.hex }}
              aria-hidden
            />
            <div className="min-w-0">
              <span className="block truncate font-mono text-caption text-fg">{intent.primitive.token}</span>
              <span className="block font-mono text-mono-2xs tabular-nums text-fg-subtle">
                {intent.primitive.hex}
              </span>
            </div>
          </div>
        </Stage>

        <Connector />

        <Stage label="2 · Semantic">
          <div className="flex items-center gap-2.5">
            <span
              className="h-8 w-8 shrink-0 rounded-md ring-1 ring-inset ring-black/[0.06]"
              style={{ background: `var(${intent.semantic})` }}
              aria-hidden
            />
            <div className="min-w-0">
              <span className="block truncate font-mono text-caption text-fg">{intent.semantic}</span>
              <span className="block font-mono text-mono-2xs text-fg-subtle">intent</span>
            </div>
          </div>
        </Stage>

        <Connector />

        <Stage label="3 · Component">
          <div className="flex flex-col gap-3">
            <span className="block break-words font-mono text-caption text-fg">{intent.component}</span>
            <div className="flex flex-wrap items-center gap-2.5">
              {intent.preview === 'button' ? (
                <Button variant="primary" size="sm">
                  Review deal
                </Button>
              ) : (
                <Badge variant={intent.badge} size="md">
                  {intent.badgeText}
                </Badge>
              )}
              <span className="font-mono text-mono-2xs text-fg-subtle">{intent.via}</span>
            </div>
          </div>
        </Stage>
      </motion.div>

      <p className="font-body text-body-sm leading-relaxed text-fg-muted">
        One value, three layers. A component never names a hex — only the{' '}
        <span className="text-highlight">intent</span>. Change the primitive and every surface that
        resolves through it moves with it.
      </p>
    </div>
  )
}

/* ── C · live semantic + soft-tint swatches ────────────────────────────────── */

/** A soft (alpha-over-canvas) tint — read live from its variable, since a fixed hex can't carry alpha. */
function SoftSwatch({ token, label }: { token: string; label: string }) {
  const [copied, setCopied] = React.useState(false)
  const fire = async () => {
    if (await copyText(token)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }
  }
  return (
    <button
      type="button"
      onClick={fire}
      aria-label={`Copy ${token}`}
      title={`Copy ${token}`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-md border border-border bg-surface text-left',
        'transition-all duration-fast ease-out hover:border-border-strong hover:shadow-sm active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
      )}
    >
      <span
        className="h-10 w-full ring-1 ring-inset ring-black/[0.06]"
        style={{ background: `var(${token})` }}
        aria-hidden
      />
      <span className="flex flex-col gap-0.5 px-2.5 py-2">
        <span className="font-mono text-mono-2xs uppercase tracking-[0.1em] text-fg-subtle">{label}</span>
        <span className="font-mono text-caption text-fg">{copied ? 'Copied ✓' : token}</span>
      </span>
    </button>
  )
}

/* ── Section ───────────────────────────────────────────────────────────────── */

export function TokensSection() {
  return (
    <Section
      id="tokens"
      eyebrow="Tokens"
      title="Tokens"
      lead="Tokens are ground truth. Three layers resolve downward — raw primitive ramps, semantic intents, then component-scoped tokens — so a component never names a colour, only an intent. Tailwind replaces the colour and radius scales rather than extending them, so an off-token value fails the build."
    >
      <div className="flex flex-col gap-8">
        {/* A · Resolution */}
        <Demo label="Resolution — one value through the three layers" inspect={RESOLUTION_INSPECT}>
          <Resolution />
        </Demo>

        {/* B · Layer 1 — primitives (shared Swatch) */}
        <Demo label="Layer 1 · Primitives — the raw brand ramps" inspect={PRIMITIVES_INSPECT}>
          <Stagger className="flex flex-col gap-6">
            {RAMPS.map((r) => (
              <StaggerItem key={r.key}>
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <MonoLabel tone="subtle" size="sm">
                    {r.title}
                  </MonoLabel>
                  <span className="font-mono text-mono-2xs text-fg-subtle">{r.note}</span>
                </div>
                <div className="mt-2.5 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                  {r.shades.map((s) => (
                    <Swatch key={s.label} hex={s.hex} label={s.label} primary={s.primary} />
                  ))}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Demo>

        {/* C · Layer 2 — semantic intents, live */}
        <Demo
          label="Layer 2 · Semantic — intent, not colour (click copies the token)"
          inspect={SEMANTIC_INSPECT}
        >
          <div className="flex flex-col gap-6">
            {SEMANTIC_GROUPS.map((g) => (
              <div key={g.title}>
                <MonoLabel tone="subtle" size="sm">
                  {g.title}
                </MonoLabel>
                <div className="mt-2.5 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                  {g.items.map((s) => (
                    <Swatch key={s.token} hex={s.hex} label={s.label} copyValue={s.token} />
                  ))}
                </div>
              </div>
            ))}

            <div>
              <MonoLabel tone="subtle" size="sm">
                Soft fills — alpha over canvas
              </MonoLabel>
              <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {SOFT_TINTS.map((t) => (
                  <SoftSwatch key={t.token} token={t.token} label={t.label} />
                ))}
              </div>
            </div>
          </div>
        </Demo>

        {/* D · Layer 3 — component tokens, radius ceiling, the guardrail */}
        <Demo
          label="Layer 3 · Component — scoped tokens, the radius ceiling & the guardrail"
          inspect={COMPONENT_INSPECT}
        >
          <div className="flex flex-col gap-7">
            {/* radius scale — rendered with the real utilities, so the 8px ceiling is literal */}
            <div>
              <MonoLabel tone="subtle" size="sm">
                Radius scale · 8px ceiling
              </MonoLabel>
              <div className="mt-2.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {RADII.map((r) => (
                  <div
                    key={r.name}
                    className="flex flex-col items-center gap-2 rounded-lg border border-border bg-surface p-3.5"
                  >
                    <span
                      className={cn('h-12 w-12 border border-border-strong bg-accent-soft', r.cls)}
                      aria-hidden
                    />
                    <span className="font-mono text-caption text-fg">{r.name}</span>
                    <span className="font-mono text-mono-2xs tabular-nums text-fg-subtle">{r.px}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* component tokens → the semantic they compose from */}
            <div>
              <MonoLabel tone="subtle" size="sm">
                Component tokens → semantic
              </MonoLabel>
              <dl className="mt-2.5 grid gap-2 sm:grid-cols-2">
                {COMPONENT_TOKENS.map(([token, ref]) => (
                  <div
                    key={token}
                    className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2.5"
                  >
                    <dt className="font-mono text-caption text-fg">{token}</dt>
                    <dd className="flex min-w-0 items-center gap-1.5 font-mono text-caption text-fg-subtle">
                      <ArrowRight className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden />
                      <span className="truncate">{ref}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* the guardrail — tailwind replaces, so off-token classes never compile */}
            <div className="rounded-lg border border-border bg-canvas-muted p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent-soft text-accent">
                  <Boxes className="h-4 w-4" strokeWidth={2} aria-hidden />
                </span>
                <div>
                  <h4 className="font-display text-title-sm text-fg">Tokens are truth</h4>
                  <p className="mt-1 max-w-[62ch] font-body text-body-sm leading-relaxed text-fg-muted">
                    Tailwind <span className="text-highlight">replaces</span> the colour and radius
                    scales — it does not extend them. An off-token class never reaches the browser; the
                    build is the guardrail.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-border bg-surface p-3.5">
                  <MonoLabel tone="success" size="sm" dot>
                    Compiles
                  </MonoLabel>
                  <ul className="mt-2.5 flex flex-col gap-1.5">
                    {COMPILES.map((c) => (
                      <li key={c} className="flex items-center gap-2 font-mono text-caption text-fg">
                        <Check className="h-3.5 w-3.5 shrink-0 text-success" strokeWidth={2.5} aria-hidden />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-md border border-border bg-surface p-3.5">
                  <span className="inline-flex items-center gap-2 font-mono text-mono-2xs font-bold uppercase tracking-[0.14em] text-danger">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-sm bg-danger" />
                    Fails to compile
                  </span>
                  <ul className="mt-2.5 flex flex-col gap-1.5">
                    {FAILS.map((c) => (
                      <li key={c} className="flex items-center gap-2 font-mono text-caption">
                        <Ban className="h-3.5 w-3.5 shrink-0 text-danger" strokeWidth={2} aria-hidden />
                        <span className="text-fg-subtle line-through">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Demo>
      </div>
    </Section>
  )
}
