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
import { TokenTag } from '@/components/ui/token-tag'
import { Input } from '@/components/ui/input'
import { IconButton } from '@/components/ui/icon-button'
import { StatusIcon, type StatusVariant } from '@/components/ui/status-icon'
import { GoatRating, GoatedBadge } from '@/components/scoring/GoatRating'
import { type GoatScore } from '@/data/scoring'
import { DownloadFolder } from '@/components/brand/DownloadFolder'
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
    'One family — lucide-react, never mixed with another set. A glyph inherits its colour from the text around it through currentColor, carries one standard stroke (1.75), and sits on the 14 / 16 / 20 / 24 size scale. Outline is the resting state; a filled glyph marks the active one.',
  token: [
    'size    h-3.5·14  h-4·16  h-5·20  h-6·24',
    'stroke  strokeWidth={1.75}  (one standard weight — no bold option)',
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
      '// stroke  strokeWidth={1.75} — one standard weight across the set (no bold)',
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
    '  <Search className="h-5 w-5" strokeWidth={1.75} aria-hidden />',
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
      '  <Search className="h-5 w-5" strokeWidth={1.75} aria-hidden />',
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
        caption="One standard stroke across the whole set, so icons read as one family. There is no bold option — weight never carries meaning; colour, fill and size do."
      >
        <div className="flex w-full items-center gap-3">
          <FileText className="h-6 w-6 text-fg" strokeWidth={1.75} aria-hidden />
          <span className="font-body text-body-md text-fg">Standard stroke</span>
          <TokenTag title="stroke prop" className="ml-auto">{'strokeWidth={1.75}'}</TokenTag>
        </div>
      </ConventionTile>

      <ConventionTile
        title="currentColor"
        caption="One glyph, six text tokens — the colour comes from the text, never a baked-in fill."
      >
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
          {COLOR_STATES.map((c) => (
            <div key={c.label} className="flex flex-col items-center gap-2">
              <ShieldCheck className={cn('h-5 w-5', c.cls)} strokeWidth={1.75} aria-hidden />
              <TokenTag title="text colour token">{c.cls}</TokenTag>
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
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-fg-subtle">
            <span className="inline-flex items-center gap-1.5">
              <TokenTag title="selected glyph">fill-current</TokenTag>
              <span className="font-mono text-mono-2xs">= selected</span>
            </span>
            <span className="font-mono text-mono-2xs">outline = empty</span>
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
                        'transition-calm duration-fast ease-out active:scale-[0.96]',
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
                <v.Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
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
                <ArrowUpRight className={cn(s === 'sm' ? 'h-4 w-4' : 'h-5 w-5')} strokeWidth={1.75} aria-hidden />
              </IconButton>
              <span className="font-mono text-mono-2xs text-fg-subtle">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── D · Icon packs — downloadable sets, each drawn as a folder (press → open → download) ── */

function IconPacks() {
  return (
    <div className="flex flex-col gap-10">
      <p className="mx-auto max-w-xl text-center font-body text-body-sm leading-relaxed text-fg-muted">
        Two full sets to take with you — each a <span className="text-accent-text">folder</span>, not a button.
        Press to open and see what is inside, press again to save the <span className="font-mono text-mono-2xs">.zip</span>.
      </p>
      <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2">
        <DownloadFolder
          label="Full Lucide set"
          meta="2713 · 1.2 MB"
          filename="lucide-icons-full.zip"
          href="/packs/lucide-icons-full.zip"
          width={292}
          art="atlas"
          seed={3}
          files={[
            { name: 'lucide-static', meta: '2356 SVG', art: 'mist' },
            { name: '@lucide/lab', meta: '357 SVG' },
            { name: 'README.md', meta: 'ISC' },
          ]}
          caption={
            <p className="max-w-xs font-body text-caption leading-relaxed text-fg-subtle">
              Every Lucide icon as a clean SVG —{' '}
              <a href="https://lucide.dev" target="_blank" rel="noreferrer" className="text-accent-text underline-offset-4 hover:underline">
                lucide.dev
              </a>{' '}
              (ISC): 2,356 core (<span className="font-mono text-mono-2xs">lucide-static</span> 1.72.0) + 357
              experimental (<span className="font-mono text-mono-2xs">@lucide/lab</span>). The raw SVG library for
              design tools, email and exports.
            </p>
          }
        />
        <DownloadFolder
          label="Animated Lucide"
          meta="999 · 1.5 MB"
          filename="animated-lucide-icons.zip"
          href="/packs/animated-lucide-icons.zip"
          width={292}
          art="tide"
          seed={11}
          files={[
            { name: 'components', meta: '999 .tsx', art: 'mist' },
            { name: 'README.md', meta: 'setup' },
            { name: 'LICENSE', meta: 'MIT · ISC' },
          ]}
          caption={
            <p className="max-w-xs font-body text-caption leading-relaxed text-fg-subtle">
              The same shapes, animated — self-contained React components (hover to play). A vendored snapshot of{' '}
              <a href="https://github.com/Avijit07x/animateicons" target="_blank" rel="noreferrer" className="text-accent-text underline-offset-4 hover:underline">
                AnimateIcons
              </a>{' '}
              (MIT) over Lucide (ISC). Each needs the <span className="font-mono text-mono-2xs">motion</span> runtime.
            </p>
          }
        />
      </div>
    </div>
  )
}

/* ── A2 · Status variants (shared with Tables) ───────────────────────────────── */

const STATUS_VARIANTS: { variant: StatusVariant; label: string; use: string }[] = [
  { variant: 'yes', label: 'Yes', use: 'Included · supported · pass' },
  { variant: 'no', label: 'No', use: 'Excluded · unsupported · fail' },
  { variant: 'warn', label: 'Partial', use: 'Caveat · add-on · at-risk' },
]

const STATUS_INSPECT = {
  name: 'Status variants',
  explain:
    'The three semantic status glyphs, shared by the Icons set and the comparison Tables so a check means the same thing everywhere. Each pairs a tokenised status colour with a recognisable shape (never colour alone), the one standard stroke, and an accessible label — green check for yes, red cross for no, amber triangle for a caveat.',
  token: [
    'yes   <Check/>          text-success',
    'no    <X/>              text-danger',
    'warn  <AlertTriangle/>  text-amber-text   (amber = status)',
    'a11y  role="img" + aria-label (Yes / No / Partial)',
    'stroke strokeWidth={1.75} — the one standard weight',
  ].join('\n'),
  code: [
    "import { StatusIcon } from '@/components/ui/status-icon'",
    '',
    '<StatusIcon variant="yes" />              // green check',
    '<StatusIcon variant="no" />               // red cross',
    '<StatusIcon variant="warn" label="Add-on" /> // amber warning',
  ].join('\n'),
  download: {
    filename: 'status-icon-usage.tsx',
    mime: 'text/plain',
    content: [
      "import { StatusIcon } from '@/components/ui/status-icon'",
      '',
      '// variant: yes (success check) | no (danger cross) | warn (amber triangle)',
      '// colour comes from the status token; shape + aria-label carry the meaning',
      '<StatusIcon variant="yes" />',
      '<StatusIcon variant="no" />',
      '<StatusIcon variant="warn" label="Add-on" />',
    ].join('\n'),
  },
}

function StatusVariants() {
  return (
    <div className="flex flex-wrap items-stretch gap-4">
      {STATUS_VARIANTS.map((s) => (
        <div
          key={s.variant}
          className="flex flex-1 items-center gap-4 rounded-lg border border-border bg-surface p-4 min-w-[14rem]"
        >
          <StatusIcon variant={s.variant} />
          <div className="flex min-w-0 flex-col gap-1">
            <span className="font-display text-title-sm text-fg">{s.label}</span>
            <span className="font-body text-caption text-fg-subtle">{s.use}</span>
          </div>
          <TokenTag title="status variant" className="ml-auto self-start">{`variant="${s.variant}"`}</TokenTag>
        </div>
      ))}
    </div>
  )
}

/* ── A3 · Rating artwork — the goats (shared with Tables & Image Library) ─────── */

const GOAT_INSPECT = {
  name: 'Goat rating',
  explain:
    'The rating glyph — five voxel goats, one per score, whose expression IS the score. Owner-supplied artwork, shared across Icons, Image Library and the comparison Tables. AMBER is the rating colour here (the DS has no gold); the numeral renders with the picture, and each goat reacts on hover in the mood of its score (reduced-motion safe). Scores shown are samples.',
  token: [
    'component  <GoatRating score={1..5} size showLabel showStars />',
    'artwork    /goats/goat-1.png … goat-5.png  (shared assets)',
    'colour     amber (stars · graded border ramp · Goated badge)',
    'a11y       score in alt + printed n/5 · hover reactions reduced-motion safe',
  ].join('\n'),
  code: [
    "import { GoatRating, GoatedBadge } from '@/components/scoring/GoatRating'",
    '',
    '<GoatRating score={4} showLabel />   // a frown at 1, star-eyes at 5',
    '<GoatedBadge />                        // 22/25 and never below 4',
  ].join('\n'),
}

function GoatRatingExhibit() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
        {([1, 2, 3, 4, 5] as GoatScore[]).map((s) => (
          <div key={s} className="flex flex-col items-center gap-2">
            <GoatRating score={s} size={56} showCount={false} />
            <span className="font-mono text-mono-2xs tabular-nums text-fg-subtle">{s}/5</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-5">
        <GoatedBadge />
        <span className="font-body text-caption text-fg-subtle">Hover a goat — it reacts in the mood of its score. Sample scores.</span>
        <TokenTag className="ml-auto">{'<GoatRating score>'}</TokenTag>
      </div>
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
      lead="One icon family — lucide-react. Every glyph inherits its colour through currentColor, carries one standard stroke, and sits on a tight 14–24px scale. Search the curated set the system actually ships, and click any icon to copy its name."
    >
      <div className="flex flex-col gap-8">
        <Demo
          label="Conventions — one family, currentColor, one standard stroke"
          inspect={CONVENTIONS_INSPECT}
        >
          <Conventions />
        </Demo>

        <Demo
          label="Status variants — a check, a cross and a warning, shared with Tables"
          inspect={STATUS_INSPECT}
          action={<TokenTag>{'<StatusIcon variant>'}</TokenTag>}
        >
          <StatusVariants />
        </Demo>

        <Demo
          label="Rating — the goats (amber), shared with Tables & Image Library"
          inspect={GOAT_INSPECT}
        >
          <GoatRatingExhibit />
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
