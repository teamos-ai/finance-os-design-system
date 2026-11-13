/**
 * Shell — the showcase chrome. A collapsible left icon-rail sidebar with a THREE-level nav
 * (top group → Library category → Comparisons cluster), IntersectionObserver active-section
 * tracking, a scroll-rhythm background, a pinned footer and a mobile sticky header. Token-only.
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

  /* Scroll rhythm: set <html data-bg> to whichever section owns the viewport centre, so the
     fixed .bg-stage cross-fades white ↔ grey-blue ↔ grid. Keyed by Library category where there
     is one (so the data-heavy displays warm), else by top-level group. */
  React.useEffect(() => {
    const root = document.documentElement
    const bgOf = new Map(
      SHOWCASE_NAV.map((n) => {
        const BY_CATEGORY: Record<string, string> = {
          'Images & Backgrounds': 'grid',
          'Dashboards & Data Displays': 'warm',
        }
        const BY_GROUP: Record<string, string> = {
          Start: 'plain',
          Foundations: 'plain',
          Components: 'grid',
          Library: 'plain',
        }
        return [n.id, (n.category && BY_CATEGORY[n.category]) || BY_GROUP[n.group] || 'plain']
      }),
    )
    const shown = new Set<Element>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) shown.add(e.target)
          else shown.delete(e.target)
        }
        const top = ids.map((id) => document.getElementById(id)).find((el) => el && shown.has(el))
        root.dataset.bg = (top && bgOf.get(top.id)) || 'plain'
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => {
      io.disconnect()
      delete root.dataset.bg
    }
  }, [ids])

  return (
    <div className="min-h-screen">
      {/* fixed scroll-rhythm ground (white ↔ grey-blue ↔ grid), behind all content */}
      <div className="bg-stage" aria-hidden />
      <div className="bg-grid" aria-hidden />

      {/* mobile header */}
      <header className="sticky top-0 z-30 flex items-center border-b border-border bg-canvas/90 px-4 py-3 backdrop-blur lg:hidden">
        <Logo size="sm" />
      </header>

      {/* sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-20 hidden flex-col border-r border-border bg-surface transition-[width,padding] duration-base ease-out lg:flex',
          collapsed ? 'w-[76px] px-3' : 'w-64 px-4',
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
                    {on && !collapsed && (
                      <span aria-hidden className={cn('absolute inset-y-1.5 left-0 w-0.5 rounded-full', a.dot)} />
                    )}
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
      </aside>

      {/* content */}
      <main className={cn('transition-[padding] duration-base ease-out', collapsed ? 'lg:pl-[76px]' : 'lg:pl-64')}>
        {children}
      </main>
    </div>
  )
}
