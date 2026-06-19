import * as React from 'react'
import {
  Wallet, Landmark, PiggyBank, TrendingUp, LineChart, PieChart, Receipt, Calculator,
  Coins, CreditCard, Banknote, HandCoins, Percent, Target, Briefcase, Building2,
  Users, UserCheck, Handshake, FileText, FileCheck, ClipboardCheck, CalendarCheck, Clock,
  Bell, Mail, MessageSquare, Phone, Send, Inbox, Search, Filter,
  Workflow, ShieldCheck, BadgeCheck, Rocket,
  Download, Check, Copy,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { Button } from '@/components/ui/button'
import { copyText } from '@/lib/utils'

const ICONS: { name: string; Icon: LucideIcon }[] = [
  { name: 'wallet', Icon: Wallet }, { name: 'landmark', Icon: Landmark }, { name: 'piggy-bank', Icon: PiggyBank },
  { name: 'trending-up', Icon: TrendingUp }, { name: 'line-chart', Icon: LineChart }, { name: 'pie-chart', Icon: PieChart },
  { name: 'receipt', Icon: Receipt }, { name: 'calculator', Icon: Calculator }, { name: 'coins', Icon: Coins },
  { name: 'credit-card', Icon: CreditCard }, { name: 'banknote', Icon: Banknote }, { name: 'hand-coins', Icon: HandCoins },
  { name: 'percent', Icon: Percent }, { name: 'target', Icon: Target }, { name: 'briefcase', Icon: Briefcase },
  { name: 'building', Icon: Building2 }, { name: 'users', Icon: Users }, { name: 'user-check', Icon: UserCheck },
  { name: 'handshake', Icon: Handshake }, { name: 'file-text', Icon: FileText }, { name: 'file-check', Icon: FileCheck },
  { name: 'clipboard-check', Icon: ClipboardCheck }, { name: 'calendar-check', Icon: CalendarCheck }, { name: 'clock', Icon: Clock },
  { name: 'bell', Icon: Bell }, { name: 'mail', Icon: Mail }, { name: 'message-square', Icon: MessageSquare },
  { name: 'phone', Icon: Phone }, { name: 'send', Icon: Send }, { name: 'inbox', Icon: Inbox },
  { name: 'search', Icon: Search }, { name: 'filter', Icon: Filter }, { name: 'workflow', Icon: Workflow },
  { name: 'shield-check', Icon: ShieldCheck }, { name: 'badge-check', Icon: BadgeCheck }, { name: 'rocket', Icon: Rocket },
]

const STROKE = 1.75

function IconCell({ name, Icon }: { name: string; Icon: LucideIcon }) {
  const [copied, setCopied] = React.useState(false)
  const ref = React.useRef<HTMLButtonElement>(null)
  const copy = async () => {
    const svg = ref.current?.querySelector('svg')
    if (svg && (await copyText(svg.outerHTML))) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }
  }
  return (
    <button
      ref={ref}
      type="button"
      data-icon={name}
      onClick={copy}
      title={`Copy ${name}.svg`}
      className="group flex flex-col items-center gap-2 rounded-md border border-border bg-surface p-4 transition-colors duration-fast hover:border-border-strong hover:bg-canvas-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      <span className="relative grid h-8 w-8 place-items-center text-fg">
        <Icon className="h-6 w-6" strokeWidth={STROKE} aria-hidden />
      </span>
      <span className="flex items-center gap-1 font-mono text-[0.625rem] text-fg-subtle">
        {copied ? <Check className="h-3 w-3 text-success" strokeWidth={2.5} /> : <Copy className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-60" />}
        {name}
      </span>
    </button>
  )
}

const BG_TILES = [
  { name: 'Dark / Black', bg: '#000000', label: 'text-white/60' },
  { name: 'Light / White', bg: '#FFFFFF', label: 'text-black/50' },
  { name: 'Paper / Ivory', bg: '#F9F6F2', label: 'text-black/50' },
]

export function IconsSection() {
  const gridRef = React.useRef<HTMLDivElement>(null)

  // Build a single downloadable SVG sheet from the rendered icons (Lucide, ISC).
  const downloadPack = () => {
    const root = gridRef.current
    if (!root) return
    const cells = Array.from(root.querySelectorAll<HTMLElement>('[data-icon]'))
    const COLS = 6
    const CELL = 56
    const sheetW = COLS * CELL
    const sheetH = Math.ceil(cells.length / COLS) * CELL
    let body = ''
    cells.forEach((cell, i) => {
      const svg = cell.querySelector('svg')
      if (!svg) return
      const col = i % COLS
      const row = Math.floor(i / COLS)
      const x = col * CELL + (CELL - 24) / 2
      const y = row * CELL + (CELL - 24) / 2
      body += `<g transform="translate(${x},${y})" fill="none" stroke="#1A1A1A" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round">${svg.innerHTML}</g>`
    })
    const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${sheetW}" height="${sheetH}" viewBox="0 0 ${sheetW} ${sheetH}"><rect width="100%" height="100%" fill="none"/>${body}</svg>`
    const url = URL.createObjectURL(new Blob([sheet], { type: 'image/svg+xml' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'finance-os-icons.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Section
      id="icons"
      eyebrow="10 — Icons & Logo"
      title="Icons & Logo"
      lead="A curated Finance OS icon set — clean, rounded line icons at 1.75 stroke. Click any icon to copy its SVG, or download the whole pack. Below: the logo lockups on every theme surface."
    >
      <div className="space-y-12">
        {/* ── Icon pack ─────────────────────────────────────────────── */}
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <MonoLabel tone="amber" dot>
              Finance OS icon pack · {ICONS.length} icons
            </MonoLabel>
            <Button variant="primary" size="sm" leadingIcon={<Download className="h-4 w-4" strokeWidth={2} />} onClick={downloadPack}>
              Download pack (.svg)
            </Button>
          </div>
          <div ref={gridRef} className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {ICONS.map((it) => (
              <IconCell key={it.name} name={it.name} Icon={it.Icon} />
            ))}
          </div>
          <p className="mt-4 font-mono text-caption leading-relaxed text-fg-subtle">
            Built on <span className="text-accent-text">Lucide</span> (ISC licence) — free to use &amp; redistribute. Sizes 16 / 20 / 24px,
            stroke 1.75, token colours. Untitled UI's paid set is not redistributed; this is our own license-clean pack in the same clean style.
          </p>
        </div>

        {/* ── Sizes ─────────────────────────────────────────────────── */}
        <div>
          <MonoLabel tone="subtle">Sizing</MonoLabel>
          <div className="mt-3 flex items-end gap-6 rounded-lg border border-border bg-surface p-6">
            {[16, 20, 24, 32].map((px) => (
              <div key={px} className="flex flex-col items-center gap-2 text-fg">
                <Wallet style={{ width: px, height: px }} strokeWidth={STROKE} aria-hidden />
                <span className="font-mono text-caption text-fg-subtle">{px}px</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Logo lockups on every surface ─────────────────────────── */}
        <div>
          <MonoLabel tone="amber" dot>Logo lockups · both rectangles on every theme</MonoLabel>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {BG_TILES.map((tile) => (
              <div key={tile.name} className="overflow-hidden rounded-lg border border-border">
                <div className="flex flex-col items-center justify-center gap-6 p-8" style={{ background: tile.bg }}>
                  <img src="/logo-rect-white.png" alt="Finance OS — white lockup" className="h-9 w-auto object-contain" />
                  <img src="/logo-rect.png" alt="Finance OS — gradient lockup" className="h-9 w-auto object-contain" />
                  <img src="/logo-square.png" alt="Finance OS — mark" className="h-10 w-10 object-contain" />
                </div>
                <div className="border-t border-border bg-surface px-4 py-2.5">
                  <span className="font-mono text-caption text-fg-subtle">{tile.name}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-surface p-4">
              <MonoLabel tone="subtle" size="sm">Clear space</MonoLabel>
              <p className="mt-1.5 font-body text-body-sm text-fg-muted">Keep padding equal to the height of the "OS" monogram on all sides.</p>
            </div>
            <div className="rounded-md border border-border bg-surface p-4">
              <MonoLabel tone="subtle" size="sm">Which to use</MonoLabel>
              <p className="mt-1.5 font-body text-body-sm text-fg-muted">White-outline lockup on dark; gradient-fill lockup on light/paper. The square mark works on any surface.</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
