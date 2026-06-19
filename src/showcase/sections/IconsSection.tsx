import * as React from 'react'
import { Section } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SegmentedControl } from '@/components/ui/segmented'
import { Icon, iconToSvg } from '@/components/ui/icon'
import { ICONS, ICON_CATEGORIES } from '@/data/icons'
import { copyText } from '@/lib/utils'
import { cn } from '@/lib/cn'

type Tint = 'ink' | 'amber' | 'blue'
const TINT_CLASS: Record<Tint, string> = { ink: 'text-fg', amber: 'text-accent', blue: 'text-brand' }

function IconCell({ name }: { name: string }) {
  const [copied, setCopied] = React.useState(false)
  const copy = async () => {
    if (await copyText(iconToSvg(name))) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      title={`Copy ${name}.svg`}
      className="group flex flex-col items-center gap-2 rounded-md border border-border bg-surface p-3 transition-colors duration-fast hover:border-border-strong hover:bg-canvas-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      <Icon name={name} size={26} />
      <span className="flex items-center gap-1 font-mono text-[0.625rem] text-fg-subtle">
        {copied && <Icon name="check-circle" size={12} className="text-success" />}
        {name}
      </span>
    </button>
  )
}

const BG_TILES = [
  { name: 'Dark / Black', bg: '#000000' },
  { name: 'Light / White', bg: '#FFFFFF' },
  { name: 'Paper / Ivory', bg: '#F9F6F2' },
]

export function IconsSection() {
  const [query, setQuery] = React.useState('')
  const [tint, setTint] = React.useState<Tint>('amber')

  const q = query.trim().toLowerCase()
  const filtered = q
    ? ICONS.filter((i) => `${i.name} ${i.keywords} ${i.category}`.toLowerCase().includes(q))
    : ICONS

  // Download the whole pack as one on-brand (Momentum Amber) duotone SVG sheet.
  const downloadPack = () => {
    const COLS = 8
    const CELL = 48
    const rows = Math.ceil(ICONS.length / COLS)
    let body = ''
    ICONS.forEach((ic, i) => {
      const x = (i % COLS) * CELL + (CELL - 24) / 2
      const y = Math.floor(i / COLS) * CELL + (CELL - 24) / 2
      body += `<g transform="translate(${x},${y})" fill="#E68A00">${ic.body}</g>`
    })
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${COLS * CELL}" height="${rows * CELL}" viewBox="0 0 ${COLS * CELL} ${rows * CELL}">${body}</svg>`
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
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
      lead="An original Finance OS icon set — filled, duotone-in-one-colour, drawn on a 24px grid with the brand spark woven in. Search, recolour, click to copy an SVG, or download the whole pack. The logo lockups follow below."
    >
      <div className="space-y-12">
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <MonoLabel tone="amber" dot>
              Finance OS icon system · {ICONS.length} icons
            </MonoLabel>
            <Button variant="primary" size="sm" leadingIcon={<Icon name="download" size={16} />} onClick={downloadPack}>
              Download pack (.svg)
            </Button>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search icons — money, chart, send…"
              aria-label="Search icons"
              className="sm:max-w-xs"
            />
            <div className="flex items-center gap-2">
              <span className="font-mono text-caption text-fg-subtle">Tint</span>
              <SegmentedControl
                aria-label="Icon colour"
                value={tint}
                onValueChange={(v) => setTint(v as Tint)}
                size="sm"
                options={[
                  { value: 'ink', label: 'Ink' },
                  { value: 'amber', label: 'Amber' },
                  { value: 'blue', label: 'Blue' },
                ]}
              />
            </div>
          </div>
        </div>

        <div className={cn('space-y-8', TINT_CLASS[tint])}>
          {ICON_CATEGORIES.map((cat) => {
            const items = filtered.filter((i) => i.category === cat)
            if (!items.length) return null
            return (
              <div key={cat}>
                <p className="mb-3 font-mono text-caption uppercase tracking-wide text-fg-subtle">
                  {cat} · {items.length}
                </p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                  {items.map((i) => (
                    <IconCell key={i.name} name={i.name} />
                  ))}
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <p className="text-center font-mono text-caption text-fg-subtle">No icons match "{query}".</p>
          )}
        </div>

        <p className="font-mono text-caption leading-relaxed text-fg-subtle">
          Original artwork — our own geometry in a duotone-filled style, drawn fresh (no icon pack reproduced) with the
          free Pikaicons &amp; Untitled UI line only as aesthetic reference. SVGs use{' '}
          <span className="text-accent-text">currentColor</span>, so they take any brand colour; the downloaded pack
          defaults to Momentum Amber. v1 core set — expanding in reviewed batches.
        </p>

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
        </div>
      </div>
    </Section>
  )
}
