/**
 * Shell — the showcase chrome. A collapsible left icon-rail sidebar with grouped,
 * accent-highlighted nav, IntersectionObserver active-section tracking, a pinned
 * footer (theme toggle + repo link), and a mobile sticky header. Token-only.
 */
import * as React from 'react'
import { Github, PanelLeftClose, PanelLeft } from 'lucide-react'
import { SHOWCASE_NAV } from '@/lib/nav'
import { ACCENTS } from '@/lib/accents'
import { Logo } from '@/components/brand/Logo'
import { ThemeToggle } from '@/components/ui/theme-toggle'
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

  React.useEffect(() => {
    try {
      localStorage.setItem('fos-sidebar', collapsed ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [collapsed])

  const groups = React.useMemo(() => {
    const g: { name: string; items: typeof SHOWCASE_NAV }[] = []
    for (const item of SHOWCASE_NAV) {
      const last = g[g.length - 1]
      if (last && last.name === item.group) last.items.push(item)
      else g.push({ name: item.group, items: [item] })
    }
    return g
  }, [])

  return (
    <div className="min-h-screen bg-canvas">
      {/* mobile header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-canvas/90 px-4 py-3 backdrop-blur lg:hidden">
        <Logo size="sm" />
        <ThemeToggle />
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

        <nav className="flex-1 space-y-5 overflow-y-auto pb-6">
          {groups.map((group) => (
            <div key={group.name}>
              {!collapsed && (
                <p className="mb-2 px-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-fg-subtle">{group.name}</p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const on = active === item.id
                  const a = ACCENTS[item.accent]
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        title={item.label}
                        aria-current={on ? 'true' : undefined}
                        className={cn(
                          'group relative flex items-center gap-3 rounded-md px-2 py-2 text-body-sm transition-colors',
                          on ? cn('bg-selected', a.text) : 'text-fg-muted hover:bg-selected hover:text-fg',
                          collapsed && 'justify-center',
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
            </div>
          ))}
        </nav>

        <div className={cn('border-t border-border py-4', collapsed ? 'flex flex-col items-center gap-3' : 'space-y-3')}>
          {!collapsed && <ThemeToggle />}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
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
