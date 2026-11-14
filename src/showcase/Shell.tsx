/**
 * Shell — the showcase chrome. A collapsible left icon-rail sidebar with a THREE-level nav
 * (top group → Library category → Comparisons cluster), IntersectionObserver active-section
 * tracking, a flat pure-white background, a pinned footer and a mobile sticky header. Token-only.
 *
 * The sidebar is rendered straight from SHOWCASE_NAV in order, so it always matches the page.
 */
import * as React from 'react'
import { Github, PanelLeftClose, PanelLeft } from 'lucide-react'
import { SHOWCASE_NAV, type NavItem } from '@/lib/nav'
import { ACCENTS } from '@/lib/accents'
import { Logo } from '@/components/brand/Logo'
import { cn } from '@/lib/cn'

const REPO_URL = 'https://github.com/teamos-ai/finance-os-design-system'

/** Draggable sidebar width (px): min · max · default. The collapsed rail stays a fixed 76px. */
const SIDEBAR_MIN = 208
const SIDEBAR_MAX = 420
const SIDEBAR_DEFAULT = 256
const SIDEBAR_STEP = 16

function useActiveSection(ids: string[]) {
  const [active, setActive] = React.useState(ids[0] ?? '')
  React.useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [ids])
  return active
}

/** A flat render list: group / category / subcategory headers interleaved with the items,
 *  computed once from SHOWCASE_NAV so the sidebar tree follows the page order exactly. */
type Row =
  | { kind: 'group'; key: string; name: string }
  | { kind: 'category'; key: string; name: string }
  | { kind: 'subcategory'; key: string; name: string }
  | { kind: 'item'; key: string; item: NavItem }

function buildRows(): Row[] {
  const out: Row[] = []
  let g: string | undefined
  let c: string | undefined
  let s: string | undefined
  for (const item of SHOWCASE_NAV) {
    if (item.group !== g) {
      out.push({ kind: 'group', key: `g:${item.group}`, name: item.group })
      g = item.group
      c = undefined
      s = undefined
    }
    if (item.category !== c) {
      if (item.category) out.push({ kind: 'category', key: `c:${item.group}:${item.category}`, name: item.category })
      c = item.category
      s = undefined
    }
    if (item.subcategory !== s) {
      if (item.subcategory) out.push({ kind: 'subcategory', key: `s:${item.category}:${item.subcategory}`, name: item.subcategory })
      s = item.subcategory
    }
    out.push({ kind: 'item', key: item.id, item })
  }
  return out
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(() => {
    try {
      return localStorage.getItem('fos-sidebar') === '1'
    } catch {
      return false
    }
  })
  const ids = React.useMemo(() => SHOWCASE_NAV.map((n) => n.id), [])
  const active = useActiveSection(ids)
  const rows = React.useMemo(buildRows, [])

  React.useEffect(() => {
    try {
      localStorage.setItem('fos-sidebar', collapsed ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [collapsed])

  // Draggable width — persisted, clamped. The collapsed rail ignores it (fixed 76px).
  const [width, setWidth] = React.useState(() => {
    try {
      const w = Number(localStorage.getItem('fos-sidebar-w'))
      return w >= SIDEBAR_MIN && w <= SIDEBAR_MAX ? w : SIDEBAR_DEFAULT
    } catch {
      return SIDEBAR_DEFAULT
    }
  })
  const [dragging, setDragging] = React.useState(false)

  React.useEffect(() => {
    try {
      localStorage.setItem('fos-sidebar-w', String(width))
    } catch {
      /* ignore */
    }
  }, [width])

  const startResize = React.useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    setDragging(true)
    const clamp = (x: number) => Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, x))
    const onMove = (ev: PointerEvent) => setWidth(clamp(ev.clientX))
    const onUp = () => {
      setDragging(false)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }, [])

  return (
    <div className="min-h-screen" style={{ ['--sidebar-w' as string]: `${collapsed ? 76 : width}px` } as React.CSSProperties}>
      {/* mobile header */}
      <header className="sticky top-0 z-30 flex items-center border-b border-border bg-canvas/90 px-4 py-3 backdrop-blur lg:hidden">
        <Logo size="sm" />
      </header>

      {/* sidebar */}
      <aside
        style={{ width: 'var(--sidebar-w)', transition: dragging ? 'none' : undefined }}
        className={cn(
          'fixed inset-y-0 left-0 z-20 hidden flex-col border-r border-border bg-surface transition-[width,padding] duration-base ease-out lg:flex',
          collapsed ? 'px-3' : 'px-4',
        )}
      >
        <div className={cn('flex py-5', collapsed ? 'flex-col items-center gap-3' : 'items-center justify-between')}>
          {collapsed ? <Logo variant="mark" size="sm" /> : <Logo size="sm" />}
          <button
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setCollapsed((c) => !c)}
            className="grid h-8 w-8 place-items-center rounded-md text-fg-subtle transition-colors hover:bg-selected hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {collapsed ? <PanelLeft className="h-4 w-4" strokeWidth={1.75} /> : <PanelLeftClose className="h-4 w-4" strokeWidth={1.75} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto pb-6">
          <ul className="space-y-0.5">
            {rows.map((row) => {
              if (row.kind === 'group') {
                if (collapsed) return <li key={row.key} className="mt-4 first:mt-0 border-t border-border" aria-hidden />
                return (
                  <li key={row.key} className="mt-5 first:mt-0 px-2 pb-1 pt-2">
                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-fg-subtle">{row.name}</p>
                  </li>
                )
              }
              if (row.kind === 'category') {
                if (collapsed) return null
                return (
                  <li key={row.key} className="mt-3 px-2 pb-0.5 pt-1">
                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-fg-muted">{row.name}</p>
                  </li>
                )
              }
              if (row.kind === 'subcategory') {
                if (collapsed) return null
                return (
                  <li key={row.key} className="mt-1 pl-4 pr-2 pb-0.5">
                    <p className="font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-fg-subtle/80">{row.name}</p>
                  </li>
                )
              }
              const item = row.item
              const on = active === item.id
              const a = ACCENTS[item.accent]
              const nested = !!item.subcategory
              return (
                <li key={row.key}>
                  <a
                    href={`#${item.id}`}
                    title={item.label}
                    aria-current={on ? 'true' : undefined}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-md px-2 py-2 text-body-sm transition-colors',
                      on ? cn('bg-selected', a.text) : 'text-fg-muted hover:bg-selected hover:text-fg',
                      collapsed ? 'justify-center' : nested && 'ml-3',
                    )}
                  >
                    <item.Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className={cn('border-t border-border py-4', collapsed ? 'flex flex-col items-center gap-3' : 'space-y-3')}>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            title="Finance OS on GitHub"
            aria-label={collapsed ? 'Finance OS on GitHub' : undefined}
            className={cn('flex items-center gap-2 text-caption text-fg-subtle transition-colors hover:text-fg', collapsed && 'justify-center')}
          >
            <Github className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            {!collapsed && <span>teamos-ai/finance-os</span>}
          </a>
        </div>

        {/* draggable width handle — neutral + keyboard-operable (drag or ←/→); not an accent rail */}
        {!collapsed && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar"
            aria-valuenow={width}
            aria-valuemin={SIDEBAR_MIN}
            aria-valuemax={SIDEBAR_MAX}
            tabIndex={0}
            onPointerDown={startResize}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') {
                e.preventDefault()
                setWidth((w) => Math.max(SIDEBAR_MIN, w - SIDEBAR_STEP))
              }
              if (e.key === 'ArrowRight') {
                e.preventDefault()
                setWidth((w) => Math.min(SIDEBAR_MAX, w + SIDEBAR_STEP))
              }
            }}
            className="group absolute inset-y-0 right-0 z-30 w-2 translate-x-1/2 cursor-col-resize touch-none rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span aria-hidden className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-transparent transition-colors group-hover:bg-border-strong" />
          </div>
        )}
      </aside>

      {/* content */}
      <main
        style={{ transition: dragging ? 'none' : undefined }}
        className="transition-[padding] duration-base ease-out lg:pl-[var(--sidebar-w)]"
      >
        {children}
      </main>
    </div>
  )
}
