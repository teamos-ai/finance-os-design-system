/**
 * Inspectable — wraps any showcase item and floats an "inspect" FAB at its top-right.
 * Press it and three actions bloom out (a speed-dial, à la the reference video): Explain,
 * Token, Code. Pick one and a popover shows that detail — so the page stays clean and the
 * token / code references live INSIDE the button instead of cluttering every demo.
 *
 * Wrap any item:  <Inspectable name=… explain=… token=… code=…><Demo …/></Inspectable>
 * The FAB is a sibling of the wrapped item (not inside its overflow-hidden), so the popover
 * is never clipped, and any future tokenised item gets the same treatment by wrapping it.
 *
 * Colour is theme-pinned via --c-inspect: primary orange (dark + paper), Atlas Blue (light).
 * Motion is transform/opacity only, ease-out, staggered, and reduced-motion safe.
 */
import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Plus, Info, Braces, Code2, Copy, Check, Download } from 'lucide-react'
import { copyText, downloadBlob, downloadHref } from '@/lib/utils'
import { cn } from '@/lib/cn'

export interface InspectData {
  /** item name — the popover title */
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

type Panel = 'explain' | 'token' | 'code'

const ACTIONS: { key: Panel; label: string; Icon: typeof Info }[] = [
  { key: 'explain', label: 'Explain', Icon: Info },
  { key: 'token', label: 'Token', Icon: Braces },
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
  const [panel, setPanel] = React.useState<Panel | null>(null)
  const [saved, setSaved] = React.useState(false)
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

  const close = React.useCallback(() => {
    setOpen(false)
    setPanel(null)
  }, [])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  return (
    <div className={cn('group/inspect relative', className)}>
      {children}

      <div className="absolute right-2.5 top-2.5 z-30">
        {/* the FAB — rests soft, comes forward on hover/focus/open */}
        <button
          type="button"
          aria-label={open ? `Close ${name} inspector` : `Inspect: ${name}`}
          aria-expanded={open}
          onClick={() => (open ? close() : setOpen(true))}
          className={cn(
            'relative z-30 grid h-9 w-9 place-items-center rounded-[50%] bg-inspect text-inspect-fg shadow-md ring-1 ring-black/10',
            'opacity-70 transition-[opacity,transform,box-shadow] duration-base ease-out',
            'hover:scale-105 hover:opacity-100 hover:shadow-lg focus-visible:opacity-100',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
            'group-hover/inspect:opacity-100 group-focus-within/inspect:opacity-100',
            open && 'opacity-100',
          )}
        >
          <Plus
            className={cn('h-5 w-5 transition-transform duration-base ease-out', open && 'rotate-45')}
            strokeWidth={2.25}
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

              {/* menu: action chips bloom down-right, content popover under them */}
              <div className="absolute right-0 top-11 z-20 flex flex-col items-end gap-2">
                {ACTIONS.map((a, i) => {
                  const active = panel === a.key
                  return (
                    <motion.button
                      key={a.key}
                      type="button"
                      onClick={() => setPanel(a.key)}
                      aria-pressed={active}
                      initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.92 }}
                      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                      exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.92 }}
                      transition={{ duration: 0.18, ease: EASE_OUT, delay: reduced ? 0 : i * 0.04 }}
                      className={cn(
                        'flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-mono-xs shadow-sm transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
                        active
                          ? 'border-transparent bg-inspect text-inspect-fg'
                          : 'border-border bg-elevated text-fg hover:border-border-strong',
                      )}
                    >
                      <span>{a.label}</span>
                      <a.Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                    </motion.button>
                  )
                })}

                {dl && (
                  <motion.button
                    type="button"
                    onClick={fireDownload}
                    aria-label={`Download ${name}`}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.92 }}
                    animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.92 }}
                    transition={{ duration: 0.18, ease: EASE_OUT, delay: reduced ? 0 : ACTIONS.length * 0.04 }}
                    className={cn(
                      'flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-mono-xs shadow-sm transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
                      saved
                        ? 'border-transparent bg-inspect text-inspect-fg'
                        : 'border-border bg-elevated text-fg hover:border-border-strong',
                    )}
                  >
                    <span>{saved ? 'Saved' : 'Download'}</span>
                    {saved ? (
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                    ) : (
                      <Download className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                    )}
                  </motion.button>
                )}

                <AnimatePresence mode="wait">
                  {panel && (
                    <motion.div
                      key={panel}
                      initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.16, ease: EASE_OUT }}
                      className="w-[min(20rem,82vw)] overflow-hidden rounded-lg border border-border bg-elevated text-left shadow-lg"
                    >
                      <PanelContent panel={panel} name={name} explain={explain} token={token} code={code} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function PanelContent({ panel, name, explain, token, code }: { panel: Panel } & InspectData) {
  const [copied, setCopied] = React.useState(false)
  const value = panel === 'token' ? token : panel === 'code' ? code : ''
  const title = panel === 'explain' ? 'What it is' : panel === 'token' ? 'Tokens' : 'Code'

  const copy = async () => {
    if (await copyText(value)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface px-3.5 py-2">
        <span className="min-w-0 truncate font-display text-title-sm text-fg">{name}</span>
        <span className="shrink-0 font-mono text-mono-2xs uppercase tracking-[0.12em] text-fg-subtle">{title}</span>
      </div>
      <div className="p-3.5">
        {panel === 'explain' ? (
          <p className="font-body text-body-sm leading-relaxed text-fg-muted">{explain}</p>
        ) : (
          <div className="relative">
            <pre className="max-h-56 overflow-auto rounded-md bg-inset p-3 pr-10 font-mono text-caption leading-relaxed text-fg">
              <code>{value}</code>
            </pre>
            <button
              type="button"
              onClick={copy}
              aria-label={`Copy ${title.toLowerCase()}`}
              className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-sm text-fg-subtle transition-colors hover:bg-canvas-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-success" strokeWidth={2.5} /> : <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
