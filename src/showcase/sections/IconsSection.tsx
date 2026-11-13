/**
 * IconsSection — the icon foundation made usable. One family (lucide-react), no mixing. Three
 * calm exhibits, read top to bottom:
 *   A · Conventions — the four rules a glyph obeys: the 14/16/20/24 size scale, a stroke that
 *       matches the text weight beside it (1.5 body · 2 emphasis), colour inherited through
 *       currentColor, and outline-default / fill-active.
 *   B · The set — the curated icons the system actually ships, grouped by purpose. Search by
 *       name, then click any glyph to copy its import name (live filter + copy feedback).
 *   C · In context — the shared IconButton, across its five variants and three sizes.
 *
 * Blue owns every accent; amber appears once, only as the fill-active star rating (its sanctioned
 * status use). No ribbons — emphasis is a full border + resting elevation. Motion is motivated
 * (the exhibits reveal in sequence; copy and filter give feedback), each change has a static cue,
 * and all of it is reduced-motion safe. Figures use tabular-nums; every control gets
 * active:scale-[0.96] + a neutral focus-visible ring.
 */
import * as React from 'react'
import {
  Search,
  Plus,
  X,
  Check,
  Copy,
  Download,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Eye,
  PenLine,
  Trash2,
  Command,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  Star,
  TrendingUp,
  TrendingDown,
  Calculator,
  FileText,
  Building2,
  Handshake,
  BadgePercent,
  Mail,
  CalendarDays,
  Gauge,
  LineChart,
  BarChart3,
  Compass,
  Layers,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { Input } from '@/components/ui/input'
import { IconButton } from '@/components/ui/icon-button'
import { Stagger, StaggerItem } from '@/lib/motion'
import { copyText } from '@/lib/utils'
import { cn } from '@/lib/cn'

/* ── Data ──────────────────────────────────────────────────────────────────── */

interface IconEntry {
  name: string
  Icon: LucideIcon
}
interface IconCategory {
  key: string
  label: string
  note: string
  icons: IconEntry[]
}

/** Only icons the DS actually uses — surveyed from the components, the nav and the sections. */
const CATEGORIES: IconCategory[] = [
  {
    key: 'interface',
    label: 'Interface',
    note: 'Navigation and the core actions on every surface.',
    icons: [
      { name: 'Search', Icon: Search },
      { name: 'Plus', Icon: Plus },
      { name: 'X', Icon: X },
      { name: 'Check', Icon: Check },
      { name: 'Copy', Icon: Copy },
      { name: 'Download', Icon: Download },
      { name: 'ArrowRight', Icon: ArrowRight },
      { name: 'ArrowUpRight', Icon: ArrowUpRight },
      { name: 'ChevronLeft', Icon: ChevronLeft },
      { name: 'ChevronRight', Icon: ChevronRight },
      { name: 'ChevronDown', Icon: ChevronDown },
      { name: 'ExternalLink', Icon: ExternalLink },
      { name: 'Eye', Icon: Eye },
      { name: 'PenLine', Icon: PenLine },
      { name: 'Trash2', Icon: Trash2 },
      { name: 'Command', Icon: Command },
    ],
  },
  {
    key: 'status',
    label: 'Status & feedback',
    note: 'Functional signals — compliance, attention, trend and rating.',
    icons: [
      { name: 'ShieldCheck', Icon: ShieldCheck },
      { name: 'ShieldAlert', Icon: ShieldAlert },
      { name: 'AlertTriangle', Icon: AlertTriangle },
      { name: 'AlertCircle', Icon: AlertCircle },
      { name: 'Info', Icon: Info },
      { name: 'Clock', Icon: Clock },
      { name: 'Star', Icon: Star },
      { name: 'TrendingUp', Icon: TrendingUp },
      { name: 'TrendingDown', Icon: TrendingDown },
    ],
  },
  {
    key: 'finance',
    label: 'Finance & broker',
    note: 'The domain set — deals, lenders, calculators and commission.',
    icons: [
      { name: 'Calculator', Icon: Calculator },
      { name: 'FileText', Icon: FileText },
      { name: 'Building2', Icon: Building2 },
      { name: 'Handshake', Icon: Handshake },
      { name: 'BadgePercent', Icon: BadgePercent },
      { name: 'Mail', Icon: Mail },
      { name: 'CalendarDays', Icon: CalendarDays },
      { name: 'Gauge', Icon: Gauge },
      { name: 'LineChart', Icon: LineChart },
      { name: 'BarChart3', Icon: BarChart3 },
      { name: 'Compass', Icon: Compass },
      { name: 'Layers', Icon: Layers },
    ],
  },
]

const ALL_NAMES = CATEGORIES.flatMap((c) => c.icons.map((i) => i.name))
const TOTAL = ALL_NAMES.length

/** A real, copy-paste import of the whole curated set — the download behind the set inspector. */
const SET_IMPORT = `import {\n${ALL_NAMES.map((n) => `  ${n},`).join('\n')}\n} from 'lucide-react'`

/* ── The size + stroke demo data ───────────────────────────────────────────── */

const SIZES: { px: number; cls: string }[] = [
  { px: 14, cls: 'h-3.5 w-3.5' },
  { px: 16, cls: 'h-4 w-4' },
  { px: 20, cls: 'h-5 w-5' },
  { px: 24, cls: 'h-6 w-6' },
]

const COLOR_STATES: { cls: string; label: string }[] = [
  { cls: 'text-fg', label: 'fg' },
  { cls: 'text-fg-muted', label: 'muted' },
  { cls: 'text-fg-subtle', label: 'subtle' },
  { cls: 'text-accent-text', label: 'accent' },
  { cls: 'text-success', label: 'success' },
  { cls: 'text-danger', label: 'danger' },
]

/* ── In-context IconButton data ────────────────────────────────────────────── */

const IB_VARIANTS = [
  { variant: 'dark', Icon: Search, label: 'Search' },
  { variant: 'outline', Icon: Download, label: 'Download' },
  { variant: 'soft', Icon: Copy, label: 'Copy' },
  { variant: 'ghost', Icon: PenLine, label: 'Edit' },
  { variant: 'accent', Icon: Plus, label: 'Add' },
] as const

const IB_SIZES = ['sm', 'md', 'lg'] as const

/* ── Inspect payloads ──────────────────────────────────────────────────────── */

const CONVENTIONS_INSPECT = {
  name: 'Icon conventions',
  explain:
    'One family — lucide-react, never mixed with another set. A glyph inherits its colour from the text around it through currentColor, carries a stroke that matches that text weight (1.5 for body, 2 for emphasis), and sits on the 14 / 16 / 20 / 24 size scale. Outline is the resting state; a filled glyph marks the active one.',
  token: [
    'size    h-3.5·14  h-4·16  h-5·20  h-6·24',
    'stroke  strokeWidth={1.5}  body  ·  {2} emphasis',
    'colour  currentColor ← text-fg / text-accent-text / …',
    'fill    fill-current for the active (selected) glyph',
  ].join('\n'),
  code: [
    "import { Star } from 'lucide-react'",
    '',
    '// outline — the default; inherits the text colour',
    '<Star className="h-5 w-5 text-fg-subtle" strokeWidth={1.75} aria-hidden />',
    '',
    '// filled — the active state (amber, a status fill)',
    '<Star className="h-5 w-5 fill-current text-amber" strokeWidth={0} aria-hidden />',
  ].join('\n'),
  download: {
    filename: 'icon-conventions.tsx',
    mime: 'text/plain',
    content: [
      "import { Star } from 'lucide-react'",
      '',
      '// Finance OS icon conventions',
      '// family  lucide-react (one set, never mixed)',
      '// size    h-3.5 (14) · h-4 (16) · h-5 (20) · h-6 (24)',
      '// stroke  1.5 beside body copy · 2 beside a bold label/heading',
      '// colour  currentColor — a semantic text token paints the glyph',
      '',
      '<Star className="h-5 w-5 text-fg-subtle" strokeWidth={1.75} aria-hidden />   // outline',
      '<Star className="h-5 w-5 fill-current text-amber" strokeWidth={0} aria-hidden /> // filled',
    ].join('\n'),
  },
}

const SET_INSPECT = {
  name: 'Icon set',
  explain:
    'The curated lucide-react set the system actually ships, grouped by purpose. Search by name, then click any glyph to copy its import name straight into your editor. The glyph is decorative — give the control the accessible label.',
  token: [
    "import { ArrowRight } from 'lucide-react'",
    'size    h-4 w-4   (16px, inline default)',
    'stroke  strokeWidth={1.75}',
    'a11y    aria-hidden on the glyph; label the button',
  ].join('\n'),
  code: [
    "import { ArrowRight } from 'lucide-react'",
    '',
    '<ArrowRight className="h-4 w-4 text-fg-muted" strokeWidth={1.75} aria-hidden />',
  ].join('\n'),
  download: {
    filename: 'finance-os-icons.tsx',
    mime: 'text/plain',
    content: `// Finance OS — the curated lucide-react set (${TOTAL} icons)\n${SET_IMPORT}`,
  },
}

const ICONBUTTON_INSPECT = {
  name: 'IconButton',
  explain:
    'The square, icon-only control — five variants (dark, outline, soft, ghost, accent) across three sizes. An aria-label is required since there is no visible text. 8px squircle, neutral focus ring, press-scale.',
  token: [
    'variant  dark · outline · soft · ghost · accent',
    'size     sm·h-9   md·h-11   lg·h-12',
    'focus    ring-ring (neutral)  ·  active:scale-[0.96]',
  ].join('\n'),
  code: [
    "import { IconButton } from '@/components/ui/icon-button'",
    "import { Search } from 'lucide-react'",
    '',
    '<IconButton aria-label="Search" variant="soft">',
    '  <Search className="h-5 w-5" strokeWidth={2} aria-hidden />',
    '</IconButton>',
  ].join('\n'),
  download: {
    filename: 'icon-button-usage.tsx',
    mime: 'text/plain',
    content: [
      "import { IconButton } from '@/components/ui/icon-button'",
      "import { Search } from 'lucide-react'",
      '',
      '// variant: dark | outline | soft | ghost | accent',
      '// size:    sm (h-9) | md (h-11) | lg (h-12)',
      '<IconButton aria-label="Search" variant="soft">',
      '  <Search className="h-5 w-5" strokeWidth={2} aria-hidden />',
      '</IconButton>',
    ].join('\n'),
  },
}

/* ── A · Conventions ───────────────────────────────────────────────────────── */

/** One rule, framed as a full-bordered, calmly elevated panel (no ribbons). */
function ConventionTile({
  title,
  caption,
  children,
}: {
  title: string
  caption: string
  children: React.ReactNode
}) {
  return (
    <StaggerItem className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5">
      <MonoLabel tone="subtle" size="sm">
        {title}
      </MonoLabel>
      <div className="flex flex-1 items-center">{children}</div>
      <p className="font-body text-caption leading-relaxed text-fg-subtle">{caption}</p>
    </StaggerItem>
  )
}

function Conventions() {
  return (
    <Stagger className="grid gap-4 sm:grid-cols-2">
      <ConventionTile
        title="Size scale"
        caption="14 · 16 · 20 · 24px — h-3.5 / h-4 / h-5 / h-6. 16 is the inline default."
      >
        <div className="flex flex-wrap items-end gap-6">
          {SIZES.map((s) => (
            <div key={s.px} className="flex flex-col items-center gap-2">
              <Compass className={cn(s.cls, 'text-fg')} strokeWidth={1.75} aria-hidden />
              <span className="font-mono text-mono-2xs tabular-nums text-fg-subtle">{s.px}</span>
            </div>
          ))}
        </div>
      </ConventionTile>

      <ConventionTile
        title="Stroke weight"
        caption="The stroke matches the weight of the text beside it — 1.5 for body, 2 for emphasis."
      >
        <div className="flex w-full flex-col gap-3.5">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-fg" strokeWidth={1.5} aria-hidden />
            <span className="font-body text-body-md text-fg">Body copy</span>
            <span className="ml-auto font-mono text-mono-2xs tabular-nums text-fg-subtle">1.5</span>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-fg" strokeWidth={2} aria-hidden />
            <span className="font-display text-title-sm text-fg">Bold label</span>
            <span className="ml-auto font-mono text-mono-2xs tabular-nums text-fg-subtle">2</span>
          </div>
        </div>
      </ConventionTile>

      <ConventionTile
        title="currentColor"
        caption="One glyph, six text tokens — the colour comes from the text, never a baked-in fill."
      >
        <div className="grid w-full grid-cols-3 gap-3 sm:grid-cols-6">
          {COLOR_STATES.map((c) => (
            <div key={c.label} className="flex flex-col items-center gap-1.5">
              <ShieldCheck className={cn('h-5 w-5', c.cls)} strokeWidth={1.75} aria-hidden />
              <span className="font-mono text-mono-2xs text-fg-subtle">{c.label}</span>
            </div>
          ))}
        </div>
      </ConventionTile>

      <ConventionTile
        title="Outline & fill"
        caption="Outline is the resting state; a fill marks the selected one — amber here, for a review rating."
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1" role="img" aria-label="Rated 4 out of 5">
            {[0, 1, 2, 3, 4].map((i) =>
              i < 4 ? (
                <Star key={i} className="h-6 w-6 fill-current text-amber" strokeWidth={0} aria-hidden />
              ) : (
                <Star key={i} className="h-6 w-6 text-fg-subtle" strokeWidth={1.75} aria-hidden />
              ),
            )}
          </div>
          <div className="flex gap-4 font-mono text-mono-2xs text-fg-subtle">
            <span>fill = selected</span>
            <span>outline = empty</span>
          </div>
        </div>
      </ConventionTile>
    </Stagger>
  )
}

/* ── B · The curated, searchable set ───────────────────────────────────────── */

function IconGrid() {
  const [query, setQuery] = React.useState('')
  const [copied, setCopied] = React.useState<string | null>(null)
  const timer = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const onCopy = (name: string) => {
    copyText(name)
    setCopied(name)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(null), 1200)
  }

  const q = query.trim().toLowerCase()
  const groups = CATEGORIES.map((c) => ({
    ...c,
    icons: q ? c.icons.filter((i) => i.name.toLowerCase().includes(q)) : c.icons,
  })).filter((c) => c.icons.length > 0)
  const shown = groups.reduce((n, c) => n + c.icons.length, 0)

  return (
    <div className="flex flex-col gap-6">
      {/* control — labelled, with a live match count (static cue for the filter) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <MonoLabel tone="subtle" size="sm">
            The curated set
          </MonoLabel>
          <span
            role="status"
            aria-live="polite"
            className="font-mono text-caption tabular-nums text-fg-subtle"
          >
            {q ? `${shown} of ${TOTAL}` : `${TOTAL} icons`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              icon={Search}
              type="text"
              aria-label="Search icons by name"
              placeholder="Search icons — arrow, shield, chart…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {query && (
            <IconButton variant="ghost" size="sm" aria-label="Clear search" onClick={() => setQuery('')}>
              <X className="h-4 w-4" strokeWidth={2} aria-hidden />
            </IconButton>
          )}
        </div>
      </div>

      {/* groups, or a calm empty state */}
      {groups.length > 0 ? (
        <Stagger className="flex flex-col gap-7">
          {groups.map((c) => (
            <StaggerItem key={c.key} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <MonoLabel tone="subtle" size="sm" trailing={String(c.icons.length)}>
                  {c.label}
                </MonoLabel>
                <p className="font-body text-caption text-fg-subtle">{c.note}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {c.icons.map((i) => {
                  const isCopied = copied === i.name
                  return (
                    <button
                      key={i.name}
                      type="button"
                      onClick={() => onCopy(i.name)}
                      title={`Copy “${i.name}”`}
                      aria-label={`Copy icon name ${i.name}`}
                      className={cn(
                        'group/icon flex flex-col items-center gap-2 rounded-md border px-2 py-3 text-center',
                        'transition-all duration-fast ease-out active:scale-[0.96]',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
                        isCopied
                          ? 'border-accent bg-accent-soft'
                          : 'border-border bg-surface hover:border-border-strong hover:bg-canvas-muted',
                      )}
                    >
                      <i.Icon
                        className={cn(
                          'h-5 w-5 transition-colors duration-fast',
                          isCopied ? 'text-accent-text' : 'text-fg',
                        )}
                        strokeWidth={1.75}
                        aria-hidden
                      />
                      <span
                        className={cn(
                          'flex max-w-full items-center justify-center gap-1 font-mono text-mono-2xs leading-tight',
                          isCopied ? 'text-accent-text' : 'text-fg-subtle',
                        )}
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden />
                            Copied
                          </>
                        ) : (
                          <span className="truncate">{i.name}</span>
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border-strong bg-canvas-muted px-6 py-12 text-center">
          <Search className="h-6 w-6 text-fg-subtle" strokeWidth={1.5} aria-hidden />
          <p className="font-body text-body-sm text-fg-muted">
            No icon matches “<span className="font-mono text-fg">{query}</span>”.
          </p>
          <p className="font-body text-caption text-fg-subtle">
            Try a word like arrow, shield, chart or mail.
          </p>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="rounded-sm font-mono text-mono-xs text-accent-text underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}

/* ── C · In context — IconButton ───────────────────────────────────────────── */

function IconButtonShowcase() {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <MonoLabel tone="subtle" size="sm">
          Variants
        </MonoLabel>
        <div className="flex flex-wrap items-start gap-5">
          {IB_VARIANTS.map((v) => (
            <div key={v.variant} className="flex flex-col items-center gap-2">
              <IconButton variant={v.variant} aria-label={v.label}>
                <v.Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
              </IconButton>
              <span className="font-mono text-mono-2xs text-fg-subtle">{v.variant}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <MonoLabel tone="subtle" size="sm">
          Sizes
        </MonoLabel>
        <div className="flex flex-wrap items-center gap-5">
          {IB_SIZES.map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <IconButton variant="outline" size={s} aria-label={`Open (${s})`}>
                <ArrowUpRight className={cn(s === 'sm' ? 'h-4 w-4' : 'h-5 w-5')} strokeWidth={2} aria-hidden />
              </IconButton>
              <span className="font-mono text-mono-2xs text-fg-subtle">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── D · Icon packs — downloadable sets (full static + animated) ─────────────── */

function PackRow({
  title,
  count,
  href,
  size,
  children,
}: {
  title: string
  count: string
  href: string
  size: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2">
        <MonoLabel tone="subtle" size="sm" trailing={count}>
          {title}
        </MonoLabel>
        <p className="max-w-xl font-body text-body-sm leading-relaxed text-fg-muted">{children}</p>
      </div>
      <a
        href={href}
        download
        className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-body text-body-sm font-semibold text-accent-fg shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:scale-[0.98]"
      >
        <Download className="h-4 w-4" strokeWidth={2} aria-hidden />
        Download · {size}
      </a>
    </div>
  )
}

function IconPacks() {
  return (
    <div className="flex flex-col gap-6">
      <PackRow title="Full Lucide set" count="2713" href="/packs/lucide-icons-full.zip" size="1.2 MB">
        Every Lucide icon as a clean SVG —{' '}
        <a href="https://lucide.dev" target="_blank" rel="noreferrer" className="text-accent-text underline-offset-4 hover:underline">
          lucide.dev
        </a>{' '}
        (ISC): 2,356 core (<span className="font-mono text-mono-2xs">lucide-static</span> 1.72.0) + 357
        experimental (<span className="font-mono text-mono-2xs">@lucide/lab</span>), aliases included. In code
        the icons are already React components via <span className="font-mono text-mono-2xs">lucide-react</span>;
        this is the raw SVG library for design tools, email and exports.
      </PackRow>
      <div className="h-px bg-border" aria-hidden />
      <PackRow title="Animated Lucide set" count="999" href="/packs/animated-lucide-icons.zip" size="1.5 MB">
        The same shapes, animated — self-contained React components (hover to play). A vendored snapshot of{' '}
        <a href="https://github.com/Avijit07x/animateicons" target="_blank" rel="noreferrer" className="text-accent-text underline-offset-4 hover:underline">
          AnimateIcons
        </a>{' '}
        (MIT) over Lucide (ISC). Each needs the <span className="font-mono text-mono-2xs">motion</span> runtime —
        the bundled README has the two-line setup.
      </PackRow>
    </div>
  )
}

/* ── Section ───────────────────────────────────────────────────────────────── */

export function IconsSection() {
  return (
    <Section
      id="icons"
      eyebrow="Icons"
      title="Icons"
      lead="One icon family — lucide-react. Every glyph inherits its colour through currentColor, carries a stroke that matches the text weight beside it, and sits on a tight 14–24px scale. Search the curated set the system actually ships, and click any icon to copy its name."
    >
      <div className="flex flex-col gap-8">
        <Demo
          label="Conventions — one family, currentColor, stroke matches text weight"
          inspect={CONVENTIONS_INSPECT}
        >
          <Conventions />
        </Demo>

        <Demo label="The set — search, then click an icon to copy its name" inspect={SET_INSPECT}>
          <IconGrid />
        </Demo>

        <Demo label="In context — IconButton variants & sizes" inspect={ICONBUTTON_INSPECT}>
          <IconButtonShowcase />
        </Demo>

        <Demo label="Icon packs — download a full set to use">
          <IconPacks />
        </Demo>
      </div>
    </Section>
  )
}
