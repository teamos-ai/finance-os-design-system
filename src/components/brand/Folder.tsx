/**
 * Folder — a folder you can actually use, drawn as an object.
 *
 * Three layers, back to front: a back panel holding the brand's signature artwork, the files the
 * folder contains, and a frosted front panel. Nothing is a *picture* of a folder; the files are real
 * elements between real panels, so the front frosts them as they move.
 *
 * - **Rest**: flat and closed. The tops of the files only just show.
 * - **Hover / focus**: the front leans toward you on its bottom hinge; the files lift a little.
 * - **Open** (click, Enter, Space): the front falls forward and the files rise and fan, each a button.
 * - **Add** (`+`): a new file drops in, the pocket gives under it, and the count rolls over.
 * - **Download** (↓): first press opens; a second press (or the key) downloads what's inside.
 * - **More** (`···`): a solid popover menu you can drive from the keyboard.
 *
 * BRAND NOTES (how this honours the Finance OS DS while staying an *object*):
 * - The folder is an illustration/asset, like the logo or an icon, so its drawn geometry owns its own
 *   curves. Detached UI chrome still obeys the system: the key is a solid Atlas-Blue 8px squircle, the
 *   menu a solid 8px popover, focus rings are neutral (`--c-ring`).
 * - The frosted front is the folder's *material* — a documented, scoped exception to "no glass" (like
 *   the hero FloatWobble). It is near-opaque, so it reads solid even with backdrop-filter unavailable.
 * - Back-panel art is the signature **halftone clouds** (`@/lib/halftone`) — one field per folder — or
 *   a token wash, or your own image. There is no second hue; blue leads.
 * - Motion is the DS vocabulary: calm `--ease-out` open/close (land and hold, nothing bounces), with
 *   the ONE sanctioned `--ease-confirm` overshoot reserved for a file landing. Reduced-motion safe.
 *
 * Self-contained: React + the shared HalftoneClouds are the only imports. Colour and motion come from
 * the design tokens, so it can never go off-palette.
 */
import * as React from 'react'
import { Plus, Download, MoreHorizontal } from 'lucide-react'
import { HalftoneClouds } from '@/components/brand/HalftoneClouds'
import { paint, recipeOf, type ArtPreset, type ArtRecipe } from '@/components/brand/folder-art'

/**
 * Back-panel artwork: a blue liquid preset (`atlas` marble · `azure` · `tide` · `mist` · `slate`) or a
 * custom recipe (the onestaaack tools look) · the signature `clouds` · a token `wash` · `none` · or an
 * `image`.
 */
export type FolderArt = ArtPreset | ArtRecipe | 'clouds' | 'wash' | 'none'

export type FolderFile = {
  name: string
  /** A short second line: a size, a date, a kind. Any trailing "· +N" is drawn in the accent. */
  meta?: string
  /** A blue liquid preset / recipe cover, a token wash, or a plain sheet of paper when omitted. */
  art?: ArtPreset | ArtRecipe | 'wash' | 'none'
  /** …or an image of your own for the cover. */
  image?: string
  /** Rendered as a link when the folder is open. */
  href?: string
}

export type FolderMenuItem = {
  label: string
  onSelect?: () => void
  /** Drawn in the danger colour, for the one you would want to think twice about. */
  danger?: boolean
}

export type FolderProps = {
  label?: string
  /** The second line. Defaults to the number of files, which rolls as you add. */
  meta?: string
  /** What the back panel holds: the signature clouds, a token wash, or `none`. */
  art?: FolderArt
  /** A different arrangement of the cloud field. */
  seed?: number
  /** Your own picture for the back panel, instead of generated art. */
  image?: string
  /** The folder's contents. Read once; after that the folder owns the list. */
  files?: FolderFile[]
  /** `add` drops files in · `more` opens a menu · `download` saves what's inside · `none` hides the key. */
  action?: 'add' | 'more' | 'download' | 'none'
  /** What `add` puts in the folder. Return nothing for an "Untitled" sheet. */
  onAdd?: (files: FolderFile[]) => FolderFile | void
  onFilesChange?: (files: FolderFile[]) => void
  /** Fired by the `download` key, and by a second press on an already-open download folder. */
  onDownload?: () => void
  /** Items for the `more` menu. An Open / Close item is always first. */
  menu?: FolderMenuItem[]
  /** Where the label sits on the front panel. */
  labelPlacement?: 'bottom-left' | 'top-left' | 'top-right'
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Called when a file is chosen while the folder is open. */
  onFileSelect?: (file: FolderFile, index: number) => void
  /** Width in px. Everything else scales with it; the height is (H + headroom) × width / W. */
  width?: number
  /** Assemble itself the first time it scrolls into view. */
  appear?: boolean
  /** Delay before that entrance, in ms — for staggering a row of folders. */
  appearDelay?: number
  className?: string
  style?: React.CSSProperties
}

// ---------------------------------------------------------------------------
// Geometry, in the folder's own units. The stage is drawn at 340 × 272 and scaled to `width`, so the
// shapes can be fixed paths (illustration geometry — this object owns its own curves).

const W = 340
const H = 272
const HEADROOM = 54 // room above the back panel for the files to rise into
const FRONT_TOP = 74
const FRONT_H = H - FRONT_TOP
const MAX_VISIBLE = 4
const SHEET_W = 272
const SHEET_H = 184

const BACK_PATH =
  'M0 56A22 22 0 0 1 22 34L146 34C170 34 172 0 198 0L318 0A22 22 0 0 1 340 22L340 250A22 22 0 0 1 318 272L22 272A22 22 0 0 1 0 250Z'
const FRONT_PATH =
  'M0 22A22 22 0 0 1 22 0L118 0C144 0 146 32 172 32L318 32A22 22 0 0 1 340 54L340 ' +
  (FRONT_H - 22) +
  'A22 22 0 0 1 318 ' +
  FRONT_H +
  'L22 ' +
  FRONT_H +
  'A22 22 0 0 1 0 ' +
  (FRONT_H - 22) +
  'Z'

const SAMPLE_FILES: FolderFile[] = [
  { name: 'Cover — final', meta: 'PNG · 4.8 MB', art: 'wash' },
  { name: 'Moodboard', meta: '24 images', art: 'wash' },
  { name: 'Brief.pdf', meta: 'PDF · 1.2 MB' },
]

/** -1 … 1 across the visible stack, 0 for one file. */
const fanSlot = (index: number, count: number): number => (count <= 1 ? 0 : (index / (count - 1)) * 2 - 1)

/** a stable small jitter for a file, so its paper sits at a believable angle */
const hashString = (s: string): number => {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return (h >>> 0) / 4294967296
}

/* The one injected stylesheet — kept out of per-instance render so N folders share one <style>. */
let styleInjected = false
function useFolderStyles() {
  React.useEffect(() => {
    if (styleInjected || typeof document === 'undefined') return
    const el = document.createElement('style')
    el.setAttribute('data-fos-folder', '')
    el.textContent = FOLDER_CSS
    document.head.appendChild(el)
    styleInjected = true
  }, [])
}

/** A canvas that paints a blue liquid field (marble/streak) once, via the shared painter queue. */
function ArtCanvas({
  art,
  seed,
  w,
  h,
  density,
  priority,
  className,
}: {
  art: ArtPreset | ArtRecipe
  seed: number
  w: number
  h: number
  density: number
  priority: number
  className?: string
}) {
  const ref = React.useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = React.useState(false)
  const key = JSON.stringify(recipeOf(art))
  const pw = Math.max(1, Math.round(w * density))
  const ph = Math.max(1, Math.round(h * density))

  React.useEffect(() => {
    let live = true
    setReady(false)
    paint(JSON.parse(key) as ArtRecipe, seed, pw, ph, priority).then((src) => {
      const c = ref.current
      if (!live || !c) return
      c.width = src.width
      c.height = src.height
      c.getContext('2d')?.drawImage(src, 0, 0)
      setReady(true)
    })
    return () => {
      live = false
    }
  }, [key, seed, pw, ph, priority])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      data-ready={ready || undefined}
      style={{ width: w, height: h, maxWidth: 'none' }}
    />
  )
}

/**
 * Back-panel artwork. A blue liquid preset/recipe is the default (the onestaaack tools look, painted
 * still); `clouds` is the animated motion signature (one field per folder); `wash` is a token gradient.
 */
function BackArt({ art, seed, image, density }: { art: FolderArt; seed: number; image?: string; density: number }) {
  if (image) return <img className="gf-art" src={image} alt="" draggable={false} />
  if (art === 'clouds')
    return (
      <div className="gf-art">
        <HalftoneClouds tone="sky" shape="dot" cell={7} speed={0.03} seed={seed} className="absolute inset-0 h-full w-full" />
      </div>
    )
  if (art === 'wash') return <div className="gf-art gf-art--wash" />
  if (art === 'none') return null
  return <ArtCanvas className="gf-art" art={art} seed={seed} w={W + 24} h={H + 24} density={density} priority={0} />
}

export function Folder({
  label = 'My Files',
  meta,
  art = 'atlas',
  seed = 3,
  image,
  files: initialFiles = SAMPLE_FILES,
  action = 'add',
  onAdd,
  onFilesChange,
  onDownload,
  menu = [],
  labelPlacement = 'bottom-left',
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onFileSelect,
  width = 340,
  appear = true,
  appearDelay = 0,
  className,
  style,
}: FolderProps) {
  useFolderStyles()
  const uid = React.useId().replace(/:/g, '')
  const rootRef = React.useRef<HTMLDivElement>(null)
  const filesRef = React.useRef<HTMLDivElement>(null)
  const hitRef = React.useRef<HTMLButtonElement>(null)
  const keyRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)

  const [files, setFiles] = React.useState<FolderFile[]>(initialFiles)
  const ids = React.useRef<number[]>(initialFiles.map((_, i) => i))
  const nextId = React.useRef(initialFiles.length)
  const [dropped, setDropped] = React.useState<number | null>(null)
  const [bump, setBump] = React.useState(0)

  const [openState, setOpenState] = React.useState(defaultOpen)
  const open = openProp ?? openState
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenState(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange],
  )
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [entered, setEntered] = React.useState(!appear)

  // Fluid: fill up to `width`, but shrink to fit a narrow container (so the object is never clipped
  // by a Demo frame or a phone gutter). k is derived from the measured width, so the whole stage —
  // geometry, art and chrome — scales together.
  const [renderW, setRenderW] = React.useState(width)
  React.useEffect(() => {
    const el = rootRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => setRenderW(el.clientWidth || width))
    ro.observe(el)
    setRenderW(el.clientWidth || width)
    return () => ro.disconnect()
  }, [width])
  const k = renderW / W
  const density = Math.min(1.5, (typeof window !== 'undefined' ? window.devicePixelRatio : 1) || 1) * k

  // ---- entrance: assemble the first time the folder is on screen ----------
  React.useEffect(() => {
    if (!appear) return
    const el = rootRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setEntered(true)
      return
    }
    let t = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        t = window.setTimeout(() => setEntered(true), appearDelay)
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [appear, appearDelay])

  // ---- pointer: light + parallax follow the cursor, no re-renders ---------
  React.useEffect(() => {
    const el = rootRef.current
    if (!el) return
    let raf = 0
    let px = 0
    let py = 0
    const write = () => {
      raf = 0
      el.style.setProperty('--gf-px', px.toFixed(3))
      el.style.setProperty('--gf-py', py.toFixed(3))
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const r = el.getBoundingClientRect()
      px = ((e.clientX - r.left) / r.width) * 2 - 1
      py = ((e.clientY - r.top) / r.height) * 2 - 1
      if (!raf) raf = requestAnimationFrame(write)
    }
    const leave = () => {
      px = 0
      py = 0
      if (!raf) raf = requestAnimationFrame(write)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(raf)
    }
  }, [])

  // ---- closed files are out of the tab order ------------------------------
  React.useEffect(() => {
    filesRef.current?.toggleAttribute('inert', !open)
  }, [open])

  // ---- Escape and a press outside close whatever is open ------------------
  React.useEffect(() => {
    if (!open && !menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (menuOpen) {
        setMenuOpen(false)
        keyRef.current?.focus()
      } else {
        setOpen(false)
        hitRef.current?.focus()
      }
    }
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (menuOpen && !menuRef.current?.contains(t) && !keyRef.current?.contains(t)) setMenuOpen(false)
      if (open && !menuOpen && !rootRef.current?.contains(t)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open, menuOpen, setOpen])

  // focus the first menu item when the menu opens
  React.useEffect(() => {
    if (menuOpen) menuRef.current?.querySelector<HTMLElement>('[role=menuitem]')?.focus()
  }, [menuOpen])

  const addFile = () => {
    const made = onAdd?.(files)
    const file: FolderFile = made || { name: 'Untitled ' + (files.length + 1), meta: 'Just now' }
    const next = [...files, file]
    const id = nextId.current++
    ids.current = [...ids.current, id]
    setFiles(next)
    setDropped(id)
    setBump((b) => b + 1)
    onFilesChange?.(next)
  }

  // the front is the primary control. For a download folder, a first press opens; a second press
  // (while open) downloads — the second move the brief asks for — and a confirm pulse marks it.
  const pressFront = () => {
    setMenuOpen(false)
    if (action === 'download' && open) {
      onDownload?.()
      setBump((b) => b + 1)
      return
    }
    setOpen(!open)
  }

  const pressKey = () => {
    if (action === 'add') addFile()
    else if (action === 'download') {
      if (!open) setOpen(true)
      onDownload?.()
      setBump((b) => b + 1)
    } else setMenuOpen((m) => !m)
  }

  const menuItems: FolderMenuItem[] = [
    { label: open ? 'Close folder' : 'Open folder', onSelect: () => setOpen(!open) },
    ...menu,
  ]

  const onMenuKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role=menuitem]') ?? [])
    const at = items.indexOf(document.activeElement as HTMLElement)
    const go = (i: number) => {
      e.preventDefault()
      items[(i + items.length) % items.length]?.focus()
    }
    if (e.key === 'ArrowDown') go(at + 1)
    else if (e.key === 'ArrowUp') go(at - 1)
    else if (e.key === 'Home') go(0)
    else if (e.key === 'End') go(items.length - 1)
    else if (e.key === 'Tab') setMenuOpen(false)
  }

  // the newest files sit at the front of the stack, nearest the frosted front
  const start = Math.max(0, files.length - MAX_VISIBLE)
  const visible = files.slice(start)
  const count = files.length
  const metaLine = meta ?? count + (count === 1 ? ' item' : ' items')
  // a download folder, once open, invites the second press
  const liveMeta = action === 'download' && open ? 'Press again to download' : metaLine

  return (
    <div
      ref={rootRef}
      className={'gf-root' + (className ? ' ' + className : '')}
      data-open={open || undefined}
      data-entered={entered || undefined}
      data-place={labelPlacement}
      data-download={action === 'download' && open ? '' : undefined}
      style={{ width: 'min(' + width + 'px, 100%)', height: (H + HEADROOM) * k, ...style }}
    >
      <div className="gf-stage" style={{ transform: 'translateY(' + HEADROOM * k + 'px) scale(' + k + ')' }}>
        <div className="gf-tilt">
          <div className="gf-shadow" aria-hidden="true" />

          {/* back panel and its artwork */}
          <div className="gf-back" style={{ clipPath: "path('" + BACK_PATH + "')" }} aria-hidden="true">
            <BackArt art={art} seed={seed} image={image} density={density} />
            <div className="gf-back-sheen" />
          </div>
          <svg className="gf-rim gf-back-rim" viewBox={'0 0 ' + W + ' ' + H} aria-hidden="true">
            <path d={BACK_PATH} />
          </svg>

          {/* the frosted front panel, hinged on its bottom edge */}
          <div
            key={bump}
            className={'gf-front' + (bump ? ' gf-front--bump' : '')}
            style={{ clipPath: "path('" + FRONT_PATH + "')" }}
          >
            <div className="gf-tint" aria-hidden="true" />
            <div className="gf-spec" aria-hidden="true" />
            <svg className="gf-rim gf-front-rim" viewBox={'0 0 ' + W + ' ' + FRONT_H} aria-hidden="true">
              <defs>
                <linearGradient id={'gf-rim-' + uid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
                  <stop offset="0.35" stopColor="#fff" stopOpacity="0.3" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path d={FRONT_PATH} stroke={'url(#gf-rim-' + uid + ')'} />
            </svg>
            <button
              ref={hitRef}
              type="button"
              className="gf-hit"
              aria-expanded={open}
              aria-label={
                action === 'download' && open
                  ? 'Download ' + label
                  : (open ? 'Close ' : 'Open ') + label + ', ' + count + (count === 1 ? ' item' : ' items')
              }
              onClick={pressFront}
            />
            <div className="gf-label">
              <span className="gf-title">{label}</span>
              <span className="gf-meta" key={liveMeta}>
                {(() => {
                  // draw a trailing "· +N" overflow count in the accent (the onestaaack tools look)
                  const m = /^(.*?)( · \+\d[\d,]*)$/.exec(liveMeta)
                  return m ? (
                    <>
                      {m[1]}
                      <span className="gf-plus">{m[2]}</span>
                    </>
                  ) : (
                    liveMeta
                  )
                })()}
              </span>
            </div>
          </div>

          {/* the contents: after the front in tab order, beneath it on screen */}
          <div ref={filesRef} className="gf-files" role="list" aria-label={label + ' contents'}>
            {visible.map((file, v) => {
              const id = ids.current[start + v]
              const slot = fanSlot(v, visible.length)
              const jitter = hashString(file.name + id)
              const picture = !!(file.image || (file.art && file.art !== 'none'))
              const inner = (
                <>
                  {file.image ? (
                    <img className="gf-sheet-art" src={file.image} alt="" draggable={false} />
                  ) : file.art === 'wash' ? (
                    <span className="gf-sheet-art gf-sheet-art--wash" aria-hidden="true" />
                  ) : file.art && file.art !== 'none' ? (
                    <ArtCanvas
                      className="gf-sheet-art"
                      art={file.art}
                      seed={Math.floor(hashString(file.name) * 997)}
                      w={SHEET_W}
                      h={SHEET_H}
                      density={Math.min(density, 1.25)}
                      priority={1}
                    />
                  ) : (
                    <span className="gf-lines" aria-hidden="true">
                      <i style={{ width: '86%' }} />
                      <i style={{ width: '92%' }} />
                      <i style={{ width: '64%' }} />
                      <i style={{ width: '88%' }} />
                      <i style={{ width: '42%' }} />
                    </span>
                  )}
                  <span className="gf-sheet-head">
                    <span className="gf-sheet-name">{file.name}</span>
                    {file.meta ? <span className="gf-sheet-meta">{file.meta}</span> : null}
                  </span>
                </>
              )
              const common = {
                className: 'gf-sheet' + (picture ? ' gf-sheet--art' : '') + (id === dropped ? ' gf-sheet--drop' : ''),
                style: {
                  '--gf-slot': slot,
                  '--gf-depth': visible.length - 1 - v,
                  '--gf-jx': ((jitter - 0.5) * 10).toFixed(2) + 'px',
                  '--gf-jr': ((jitter - 0.5) * 3.2).toFixed(2) + 'deg',
                  zIndex: v + 1,
                } as React.CSSProperties,
                onAnimationEnd: id === dropped ? () => setDropped(null) : undefined,
              }
              return (
                <div key={id} role="listitem" className="gf-sheet-slot">
                  {file.href ? (
                    <a {...common} href={file.href} onClick={() => onFileSelect?.(file, start + v)}>
                      {inner}
                    </a>
                  ) : (
                    <button {...common} type="button" onClick={() => onFileSelect?.(file, start + v)}>
                      {inner}
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {action !== 'none' ? (
            <button
              ref={keyRef}
              type="button"
              className={'gf-key gf-key--' + action}
              aria-label={
                action === 'add'
                  ? 'Add a file to ' + label
                  : action === 'download'
                    ? 'Download ' + label
                    : 'More options for ' + label
              }
              aria-haspopup={action === 'more' ? 'menu' : undefined}
              aria-expanded={action === 'more' ? menuOpen : undefined}
              aria-controls={action === 'more' ? 'gf-menu-' + uid : undefined}
              onClick={pressKey}
            >
              {action === 'add' ? (
                <Plus key={bump} className="gf-glyph gf-glyph--turn" width={26} height={26} strokeWidth={2} aria-hidden="true" />
              ) : action === 'download' ? (
                <Download key={bump} className="gf-glyph" width={24} height={24} strokeWidth={2} aria-hidden="true" />
              ) : (
                <MoreHorizontal className="gf-glyph" width={26} height={26} strokeWidth={2.5} aria-hidden="true" />
              )}
            </button>
          ) : null}

          {action === 'more' ? (
            <div
              ref={menuRef}
              id={'gf-menu-' + uid}
              role="menu"
              aria-label={label + ' options'}
              className="gf-menu"
              data-open={menuOpen || undefined}
              onKeyDown={onMenuKey}
            >
              {menuItems.map((item, i) => (
                <button
                  key={item.label + i}
                  type="button"
                  role="menuitem"
                  tabIndex={menuOpen ? -1 : undefined}
                  disabled={!menuOpen}
                  className={'gf-menu-item' + (item.danger ? ' gf-menu-item--danger' : '')}
                  onClick={() => {
                    setMenuOpen(false)
                    keyRef.current?.focus()
                    item.onSelect?.()
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

/* Colour + motion are the design tokens (see src/styles/tokens.css). The folder is an illustrated
   object, so its drawn geometry owns its own curves; detached chrome (key, menu) stays on the 8px
   grid and uses solid, token surfaces. The frosted front is near-opaque — a scoped "material", not a
   glass UI surface. */
const FOLDER_CSS = `
.gf-root {
  --gf-px: 0;
  --gf-py: 0;
  --gf-ease: var(--ease-out);
  --gf-confirm: var(--ease-confirm);
  --gf-hinge: 0deg;
  --gf-lift: 42px;
  --gf-spread: 0px;
  --gf-fan: 0deg;
  --gf-stack: 15px;
  position: relative;
  display: inline-block;
  flex: none;
  vertical-align: top;
  font-family: "Spline Sans", system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  isolation: isolate;
}
.gf-root:hover, .gf-root:focus-within { --gf-hinge: -11deg; --gf-lift: -34px; --gf-spread: 8px; --gf-fan: 1.4deg; --gf-stack: 10px; }
.gf-root[data-open] { --gf-hinge: -24deg; --gf-lift: -96px; --gf-spread: 40px; --gf-fan: 5deg; --gf-stack: 30px; }

.gf-stage { position: absolute; left: 0; top: 0; width: 340px; height: 272px; transform-origin: 0 0; }
.gf-tilt {
  position: absolute; inset: 0;
  transform: perspective(1400px) rotateX(calc(var(--gf-py) * -3deg)) rotateY(calc(var(--gf-px) * 4deg));
  transition: transform var(--dur-slower) var(--gf-ease);
}

.gf-shadow {
  position: absolute; left: 18px; right: 18px; bottom: -6px; height: 60px;
  border-radius: 40px; background: rgba(16, 19, 27, .22); filter: blur(22px);
  transform: translateX(calc(var(--gf-px) * -8px));
  transition: transform var(--dur-slower) var(--gf-ease), opacity var(--dur-slower) var(--gf-ease);
}

.gf-back {
  position: absolute; inset: 0; overflow: hidden;
  background: linear-gradient(180deg, var(--c-canvas-muted) 0%, var(--c-selected) 100%);
}
.gf-art {
  position: absolute; left: -12px; top: -12px; width: calc(100% + 24px); height: calc(100% + 24px);
  max-width: none; object-fit: cover;
  transform: translate(calc(var(--gf-px) * -7px), calc(var(--gf-py) * -6px)) scale(1.02);
  transition: transform var(--dur-slower) var(--gf-ease);
}
.gf-art--wash { background: var(--wash-tint); }
canvas.gf-art { opacity: 0; filter: blur(12px); transition: transform var(--dur-slower) var(--gf-ease), opacity var(--dur-slower) var(--gf-ease), filter var(--dur-slower) var(--gf-ease); }
canvas.gf-art[data-ready] { opacity: 1; filter: none; }
.gf-back-sheen {
  position: absolute; inset: 0; pointer-events: none;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, .22) 0%, rgba(255, 255, 255, 0) 22%),
    radial-gradient(120% 80% at 80% 0%, rgba(255, 255, 255, .16), rgba(255, 255, 255, 0) 60%);
}

.gf-rim { position: absolute; left: 0; top: 0; max-width: none; overflow: visible; pointer-events: none; fill: none; }
.gf-back-rim { width: 340px; height: 272px; }
.gf-back-rim path { stroke: rgba(255, 255, 255, .45); stroke-width: 1; }

/* ---- files ---------------------------------------------------------------- */
.gf-files {
  position: absolute; inset: 0; z-index: 5; pointer-events: none;
  clip-path: inset(-400px -400px 10px -400px);
}
.gf-sheet-slot { display: contents; }
.gf-sheet {
  all: unset; box-sizing: border-box;
  position: absolute; left: 34px; top: 96px; width: 272px; height: 184px;
  border-radius: 14px; overflow: hidden; cursor: pointer; pointer-events: auto;
  background: linear-gradient(180deg, var(--c-surface) 0%, var(--c-canvas-muted) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .9),
    0 0 0 .5px var(--c-border-subtle),
    var(--shadow-md);
  transform-origin: 50% 100%;
  transform:
    translate(calc(var(--gf-jx) + var(--gf-slot) * var(--gf-spread)), calc(var(--gf-lift) + var(--gf-depth) * var(--gf-stack) * -1))
    rotate(calc(var(--gf-jr) + var(--gf-slot) * var(--gf-fan)));
  transition:
    transform var(--dur-slow) var(--gf-confirm) calc(var(--gf-depth) * 40ms),
    box-shadow var(--dur-base) var(--gf-ease);
}
.gf-sheet--art { background: var(--c-canvas-muted); }
.gf-root[data-open] .gf-sheet:hover,
.gf-root[data-open] .gf-sheet:focus-visible {
  transform:
    translate(calc(var(--gf-jx) + var(--gf-slot) * var(--gf-spread)), calc(var(--gf-lift) + var(--gf-depth) * var(--gf-stack) * -1 - 18px))
    rotate(calc(var(--gf-slot) * var(--gf-fan) * .6));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .9), 0 0 0 .5px var(--c-border-subtle), var(--shadow-lg);
  transition-delay: 0s;
}
.gf-sheet:focus-visible { outline: var(--ring-width) solid var(--c-ring); outline-offset: var(--ring-offset); }
.gf-sheet-art { position: absolute; left: 0; top: 0; width: 272px; height: 184px; max-width: none; object-fit: cover; }
.gf-sheet-art--wash { display: block; background: var(--wash-tint); }
canvas.gf-sheet-art { opacity: 0; filter: blur(8px); transition: opacity var(--dur-slow) var(--gf-ease), filter var(--dur-slow) var(--gf-ease); }
canvas.gf-sheet-art[data-ready] { opacity: 1; filter: none; }
.gf-sheet--art::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  background: linear-gradient(180deg, rgba(16, 19, 27, .14) 0%, rgba(16, 19, 27, 0) 40%);
  box-shadow: inset 0 0 0 1px var(--c-border-subtle);
}
.gf-sheet-head {
  position: absolute; left: 14px; right: 14px; top: 11px; z-index: 1;
  display: flex; align-items: baseline; justify-content: space-between; gap: 10px; white-space: nowrap;
}
.gf-sheet-name {
  overflow: hidden; text-overflow: ellipsis;
  font-size: 12.5px; font-weight: 560; letter-spacing: -.005em; color: var(--c-fg);
}
.gf-sheet-meta {
  flex: none; font-family: "Anonymous Pro", ui-monospace, monospace;
  font-size: 10px; letter-spacing: .02em; color: var(--c-fg-subtle);
}
.gf-lines { position: absolute; left: 14px; right: 14px; top: 40px; display: flex; flex-direction: column; gap: 9px; }
.gf-lines i { display: block; height: 5px; border-radius: 3px; background: rgba(20, 22, 27, .08); }
.gf-lines i:first-child { height: 9px; margin-bottom: 4px; background: rgba(20, 22, 27, .14); }

.gf-sheet--drop { animation: gf-drop .72s var(--gf-confirm) both; }
@keyframes gf-drop {
  0% { translate: 0 -190px; rotate: -9deg; opacity: 0; }
  35% { opacity: 1; }
  72% { translate: 0 8px; rotate: 1deg; }
  100% { translate: 0 0; rotate: 0deg; opacity: 1; }
}

/* ---- frosted front (the folder's material — near-opaque, a scoped exception, not a glass UI surface) */
.gf-front {
  position: absolute; left: 0; top: 74px; width: 340px; height: 198px; z-index: 10;
  -webkit-backdrop-filter: blur(14px) saturate(1.2); backdrop-filter: blur(14px) saturate(1.2);
  transform-origin: 50% 100%;
  transform: perspective(760px) rotateX(var(--gf-hinge));
  transition: transform var(--dur-slow) var(--gf-ease);
}
.gf-front--bump { animation: gf-bump .6s var(--gf-confirm) .3s both; }
@keyframes gf-bump {
  0% { scale: 1; }
  40% { scale: 1.016 .978; }
  70% { scale: .997 1.005; }
  100% { scale: 1; }
}
.gf-tint {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, .55) 0%, rgba(255, 255, 255, .82) 42%, var(--c-surface) 100%);
}
.gf-spec {
  position: absolute; inset: 0; pointer-events: none; mix-blend-mode: soft-light; opacity: .9;
  background: radial-gradient(260px 200px at calc(50% + var(--gf-px) * 46%) calc(30% + var(--gf-py) * 40%), rgba(255, 255, 255, .5), rgba(255, 255, 255, 0) 70%);
}
.gf-front-rim { width: 340px; height: 198px; }
.gf-front-rim path { stroke-width: 2.4; transition: stroke-width var(--dur-base) var(--gf-ease); }

.gf-hit { all: unset; position: absolute; inset: 0; z-index: 1; cursor: pointer; }
.gf-hit:focus-visible ~ .gf-label .gf-title { text-decoration: underline; text-decoration-thickness: 1.5px; text-underline-offset: 4px; }
.gf-front:has(.gf-hit:focus-visible) .gf-front-rim path { stroke-width: 5; }

.gf-label {
  position: absolute; z-index: 2; display: flex; flex-direction: column; gap: 4px;
  max-width: 200px; pointer-events: none; color: var(--c-fg);
}
.gf-root[data-place="bottom-left"] .gf-label { left: 28px; bottom: 32px; }
.gf-root[data-place="top-left"] .gf-label { left: 28px; top: 34px; }
.gf-root[data-place="top-right"] .gf-label { right: 32px; top: 52px; align-items: flex-start; }
.gf-title {
  font-size: 18px; font-weight: 500; line-height: 1.15; letter-spacing: -.012em;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.gf-meta {
  font-family: "Anonymous Pro", ui-monospace, monospace; font-size: 12px; letter-spacing: .03em;
  color: var(--c-fg-subtle); white-space: nowrap; animation: gf-roll var(--dur-base) var(--gf-ease) both;
}
.gf-root[data-download] .gf-meta { color: var(--c-accent-text); }
.gf-plus { color: var(--c-accent-text); }
@keyframes gf-roll {
  from { opacity: 0; translate: 0 7px; filter: blur(3px); }
  to { opacity: 1; translate: 0 0; filter: blur(0); }
}

/* ---- the key: + / ↓ / ··· — a solid Atlas-Blue 8px squircle (blue leads) ---- */
.gf-key {
  all: unset; box-sizing: border-box;
  position: absolute; right: 22px; bottom: 22px; z-index: 12;
  width: 56px; height: 56px; border-radius: var(--radius-lg);
  display: grid; place-items: center; cursor: pointer;
  color: var(--c-accent-fg); background: var(--c-accent);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .22), var(--shadow-md), 0 2px 6px -2px var(--c-glow-accent);
  transition: transform var(--dur-fast) var(--gf-ease), background-color var(--dur-fast) var(--gf-ease), box-shadow var(--dur-fast) var(--gf-ease);
}
.gf-key:hover { transform: translateY(-2px); background: var(--c-accent-hover); }
.gf-key:active { transform: translateY(0) scale(.93); transition-duration: 120ms; }
.gf-key:focus-visible { outline: var(--ring-width) solid var(--c-ring); outline-offset: 3px; }
.gf-key--more[aria-expanded="true"] { transform: scale(.96); background: var(--c-accent-press); }
.gf-glyph { display: block; fill: none; }
.gf-glyph--turn { animation: gf-turn var(--dur-slow) var(--gf-confirm); }
@keyframes gf-turn { from { rotate: -90deg; } to { rotate: 0deg; } }

/* ---- menu — a solid 8px popover (no glass) --------------------------------- */
.gf-menu {
  position: absolute; right: 22px; bottom: 88px; z-index: 20; min-width: 176px; padding: 6px;
  border-radius: var(--radius-lg); display: flex; flex-direction: column;
  background: var(--c-elevated); box-shadow: 0 0 0 .5px var(--c-border), var(--shadow-lg);
  transform-origin: 100% 100%; opacity: 0; visibility: hidden; transform: translateY(6px) scale(.96);
  transition: opacity var(--dur-base) var(--gf-ease), transform var(--dur-slow) var(--gf-ease), visibility 0s var(--dur-slow);
}
.gf-menu[data-open] { opacity: 1; visibility: visible; transform: none; transition-delay: 0s; }
.gf-menu-item {
  all: unset; box-sizing: border-box; padding: 9px 12px; border-radius: var(--radius-md);
  font-size: 13.5px; font-weight: 450; color: var(--c-fg); cursor: pointer;
}
.gf-menu-item:hover, .gf-menu-item:focus-visible { background: var(--c-canvas-muted); }
.gf-menu-item:focus-visible { outline: var(--ring-width) solid var(--c-ring); outline-offset: -2px; }
.gf-menu-item--danger { color: var(--c-danger); }

/* ---- entrance: the folder assembles itself --------------------------------- */
.gf-root:not([data-entered]) .gf-back,
.gf-root:not([data-entered]) .gf-back-rim { translate: 0 22px; opacity: 0; }
.gf-root:not([data-entered]) .gf-sheet { translate: 0 -120px; opacity: 0; }
.gf-root:not([data-entered]) .gf-front { translate: 0 46px; opacity: 0; }
.gf-root:not([data-entered]) .gf-key { opacity: 0; scale: .6; }
.gf-root:not([data-entered]) .gf-shadow { opacity: 0; }
.gf-back, .gf-back-rim { transition: translate var(--dur-slower) var(--gf-ease), opacity var(--dur-slow) var(--gf-ease); }
.gf-root[data-entered] .gf-sheet { transition-delay: calc(var(--gf-depth) * 40ms), 0s; }
.gf-key { transition: transform var(--dur-fast) var(--gf-ease), background-color var(--dur-fast) var(--gf-ease), box-shadow var(--dur-fast) var(--gf-ease), opacity var(--dur-slow) var(--gf-ease) .7s, scale var(--dur-slow) var(--gf-confirm) .7s; }

@media (prefers-reduced-motion: reduce) {
  .gf-root *, .gf-root *::before, .gf-root *::after {
    transition-duration: 0s !important; transition-delay: 0s !important; animation: none !important;
  }
  .gf-tilt { transform: none; }
}
`

export default Folder
