/**
 * Inspectable — wraps any showcase item and floats a small, quiet "inspect" affordance at its
 * top-right. It rests faint and comes forward on hover/focus. Press it and ONE calm pop-up box
 * opens (not a speed-dial): a tabbed card — Explain / Tokens / Code — with a Download action in
 * the footer. So the page stays clean and the reference lives INSIDE the control.
 *
 * Wrap any item:  <Inspectable name=… explain=… token=… code=…><Demo …/></Inspectable>
 * The control is a sibling of the wrapped item (not inside its overflow-hidden), so the pop-up
 * is never clipped, and any tokenised item gets the same treatment by wrapping it.
 *
 * Colour is pinned via --c-inspect: Atlas Blue (#33488F). Radius honours the 8px ceiling
 * (rounded-md trigger, rounded-lg card — no full rounds). Motion is transform/opacity only,
 * ease-out, and reduced-motion safe.
 */
import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Plus, Info, Braces, Code2, Copy, Check, Download, X } from 'lucide-react'
import { copyText, downloadBlob, downloadHref } from '@/lib/utils'
import { cn } from '@/lib/cn'

export interface InspectData {
  /** item name — the pop-up title */
  name: string
  /** one or two sentences: what this element is and when to use it */
  explain: string
  /** the token(s) / utility classes this element references (monospace, copyable) */
  token: string
  /** a minimal snippet to reproduce it (monospace, copyable) */
  code: string
  /**
   * The real, usable file this asset downloads to. `href` → a static/public asset
   * (font, logo, PDF); `content` → generated in-memory (icon .svg, colour .css, component .tsx).
   * Omit to fall back to downloading `code` as `<name>.tsx`.
   */
  download?: { filename: string; content?: string; href?: string; mime?: string }
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

type Tab = 'explain' | 'token' | 'code'

const TABS: { key: Tab; label: string; Icon: typeof Info }[] = [
  { key: 'explain', label: 'Explain', Icon: Info },
  { key: 'token', label: 'Tokens', Icon: Braces },
  { key: 'code', label: 'Code', Icon: Code2 },
]

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function Inspectable({
  name,
  explain,
  token,
  code,
  download,
  children,
  className,
}: InspectData & { children: React.ReactNode; className?: string }) {
  const [open, setOpen] = React.useState(false)
  const [tab, setTab] = React.useState<Tab>('explain')
  const [saved, setSaved] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const reduced = useReducedMotion()

  // Resolve the download: explicit payload, else fall back to the code snippet as a .tsx file.
  const dl = download ?? (code ? { filename: `${slug(name)}.tsx`, content: code } : null)
  const fireDownload = React.useCallback(() => {
    if (!dl) return
    if (dl.href) downloadHref(dl.filename, dl.href)
    else if (dl.content != null) downloadBlob(dl.filename, dl.content, dl.mime)
    setSaved(true)
    setTimeout(() => setSaved(false), 1400)
  }, [dl])

  const close = React.useCallback(() => setOpen(false), [])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  const value = tab === 'token' ? token : tab === 'code' ? code : ''
  const copy = async () => {
    if (await copyText(value)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }
  }

  return (
    <div className={cn('group/inspect relative', className)}>
      {children}

      <div className="absolute right-2.5 top-2.5 z-30">
        {/* trigger — small and quiet; rests faint, comes forward on hover/focus/open */}
        <button
          type="button"
          aria-label={open ? `Close ${name} details` : `Inspect ${name}`}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            'grid h-6 w-6 place-items-center rounded-md border border-border bg-surface/90 text-fg-subtle shadow-sm backdrop-blur-[1px]',
            'opacity-50 transition-[opacity,color,border-color,transform] duration-base ease-out',
            'hover:border-border-strong hover:text-fg hover:opacity-100',
            'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
            'group-hover/inspect:opacity-100 group-focus-within/inspect:opacity-100',
            open && 'border-inspect text-inspect opacity-100',
          )}
        >
          <Plus
            className={cn('h-3.5 w-3.5 transition-transform duration-base ease-out', open && 'rotate-45')}
            strokeWidth={2}
            aria-hidden
          />
        </button>

        <AnimatePresence>
          {open && (
            <>
              {/* outside-click catcher */}
              <button
                type="button"
                aria-hidden
                tabIndex={-1}
                onClick={close}
                className="fixed inset-0 z-10 cursor-default"
              />

              {/* the pop-up box */}
              <motion.div
                role="dialog"
                aria-label={`${name} details`}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.18, ease: EASE_OUT }}
                style={{ transformOrigin: 'top right' }}
                className="absolute right-0 top-9 z-20 w-[min(21rem,84vw)] overflow-hidden rounded-lg border border-border bg-elevated text-left shadow-lg"
              >
                {/* header */}
                <div className="flex items-center justify-between gap-3 border-b border-border bg-surface px-3.5 py-2.5">
                  <span className="min-w-0 truncate font-display text-title-sm text-fg">{name}</span>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close"
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-sm text-fg-subtle transition-colors hover:bg-canvas-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                  </button>
                </div>

                {/* segmented tabs */}
                <div role="tablist" aria-label={`${name} detail`} className="flex gap-1 border-b border-border bg-surface px-2 py-2">
                  {TABS.map((t) => {
                    const active = tab === t.key
                    return (
                      <button
                        key={t.key}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => {
                          setTab(t.key)
                          setCopied(false)
                        }}
                        className={cn(
                          'flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 font-mono text-mono-xs transition-colors',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
                          active ? 'bg-inspect text-inspect-fg' : 'text-fg-muted hover:bg-canvas-muted hover:text-fg',
                        )}
                      >
                        <t.Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                        <span>{t.label}</span>
                      </button>
                    )
                  })}
                </div>

                {/* content */}
                <div className="p-3.5">
                  {tab === 'explain' ? (
                    <p className="font-body text-body-sm leading-relaxed text-fg-muted">{explain}</p>
                  ) : (
                    <div className="relative">
                      <pre className="max-h-56 overflow-auto rounded-md bg-inset p-3 pr-10 font-mono text-caption leading-relaxed text-fg">
                        <code>{value}</code>
                      </pre>
                      <button
                        type="button"
                        onClick={copy}
                        aria-label={`Copy ${tab === 'token' ? 'tokens' : 'code'}`}
                        className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-sm text-fg-subtle transition-colors hover:bg-canvas-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {copied ? (
                          <Check className="h-3.5 w-3.5 text-success" strokeWidth={2.5} />
                        ) : (
                          <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* footer — download */}
                {dl && (
                  <div className="border-t border-border bg-surface px-3.5 py-2.5">
                    <button
                      type="button"
                      onClick={fireDownload}
                      aria-label={`Download ${name}`}
                      className={cn(
                        'flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 font-mono text-mono-xs transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
                        saved ? 'border-inspect text-inspect' : 'border-border text-fg-muted hover:border-border-strong hover:text-fg',
                      )}
                    >
                      {saved ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden /> : <Download className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />}
                      <span>{saved ? 'Saved' : 'Download'}</span>
                    </button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
