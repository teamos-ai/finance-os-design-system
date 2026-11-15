/**
 * ImageLibrarySection — the visual language. ImageWash tiles carry the image-wash +
 * gradient-overlay tokens across the four reference aspect ratios; a gradient-overlay-over-
 * image pattern shows how copy sits on a photo; an approved / forbidden pair fixes the
 * direction; a closing note covers how images behave per theme. Calm, broker-grade.
 *
 * Self-contained: the wash CSS strings are documented signature-gradient + glow draughts
 * built only from the locked blue/navy family (rgba allowed inside a documented glow).
 */
import * as React from 'react'
import { Building2, LineChart, Handshake, ShieldCheck, Check, X, Search } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { ImageWash } from '@/components/ui/image-wash'
import { Inspectable, type InspectData } from '@/components/ui/inspectable'
import { AuroraBackground, type AuroraTone } from '@/components/ui/aurora-background'
import { ContourField } from '@/components/positioning-hero/ContourField'
import { IMAGE_LIBRARY, IMAGE_LIBRARY_TAGS, libraryImageSrc, type LibraryImage } from '@/data/image-library'
import { cn } from '@/lib/cn'

const OVERLAY_INSPECT: InspectData = {
  name: 'Gradient overlay',
  explain: 'Text never sits on bare photography. A single bottom-anchored scrim guarantees contrast and keeps the eye on the headline. One accent overline max, never a second gradient.',
  token: 'bottom-up scrim · inverse-fg copy',
  code: 'background: linear-gradient(to top, rgba(8,12,18,0.88) 0%, transparent 55%);',
  download: { filename: 'image-overlay.css', content: '.image-scrim {\n  background: linear-gradient(to top, rgba(8,12,18,0.88) 0%, transparent 55%);\n}', mime: 'text/css' },
}

/** Pixel-art backgrounds — production WEBP, tagged for website backdrops. Grouped by kind. */
interface Bg {
  id: string
  label: string
  note: string
}
const BG_GROUPS: ReadonlyArray<{ group: string; blurb: string; items: Bg[] }> = [
  {
    group: 'Scenes',
    blurb: 'Full pixel-art landscapes — section heroes and feature panels.',
    items: [
      { id: 'still-waters', label: 'Still Waters', note: 'lake · central peak' },
      { id: 'dense-range', label: 'Dense Range', note: 'dithered ridgeline' },
      { id: 'river-valley', label: 'River Valley', note: 'valley · winding river' },
      { id: 'rolling-mist', label: 'Rolling Mist', note: 'soft haze layers' },
    ],
  },
  {
    group: 'Horizons',
    blurb: 'Faded ridgelines dissolving into white — calm backdrops that leave room for copy.',
    items: [
      { id: 'mist-pale', label: 'Pale', note: 'pale haze → white' },
      { id: 'mist-sky', label: 'Sky', note: 'sky blue → white' },
      { id: 'mist-blue', label: 'Blue', note: 'blue haze → white' },
      { id: 'mist-navy', label: 'Navy', note: 'navy haze → white' },
    ],
  },
  {
    group: 'Washes',
    blurb: 'Plain vertical gradients fading to white — the quietest backdrop, including two neutral greys.',
    items: [
      { id: 'wash-pale', label: 'Pale', note: 'pale blue → white' },
      { id: 'wash-sky', label: 'Sky', note: 'sky blue → white' },
      { id: 'wash-blue', label: 'Blue', note: 'blue → white' },
      { id: 'wash-navy', label: 'Navy', note: 'navy → white' },
      { id: 'wash-stone', label: 'Stone', note: 'grey #EDEFF2 → white' },
      { id: 'wash-cloud', label: 'Cloud', note: 'grey #F6F7F9 → white' },
    ],
  },
]

/** Each background tile carries its own inspector: a real .webp download. */
function backgroundInspect(b: Bg): InspectData {
  const file = `/images/backgrounds/${b.id}.webp`
  return {
    name: b.label,
    explain:
      'A production-grade pixel-art background in the Atlas Blue palette, for section and hero backdrops. High-resolution WEBP — drop it behind content and add the bottom-up scrim (17.3) whenever copy sits on top.',
    token: 'WEBP · 16/9 · Atlas Blue palette',
    code: `<div className="relative aspect-[16/9] overflow-hidden rounded-md border border-border">\n  <img src="${file}" alt="${b.label}" className="absolute inset-0 h-full w-full object-cover" />\n</div>`,
    download: { filename: `bg-${b.id}.webp`, href: file },
  }
}

/** Aurora backgrounds — the live animated component, two blue + two grey tones. */
const AURORA_TONES: ReadonlyArray<{ tone: AuroraTone; label: string; note: string }> = [
  { tone: 'blue', label: 'Blue', note: 'Atlas Blue aurora' },
  { tone: 'sky', label: 'Sky', note: 'pale blue aurora' },
  { tone: 'slate', label: 'Slate', note: 'neutral grey aurora' },
  { tone: 'mist', label: 'Mist', note: 'pale grey aurora' },
]

function auroraInspect(a: (typeof AURORA_TONES)[number]): InspectData {
  return {
    name: `Aurora — ${a.label}`,
    explain:
      'Animated aurora light-columns drifting over the white canvas — a full-bleed section or hero backdrop that sits behind content. Colours are tokenised (blue ramp / neutral ramp); the 60s drift freezes under prefers-reduced-motion.',
    token: `AuroraBackground · tone="${a.tone}" · animate-aurora 60s`,
    code: `import { AuroraBackground } from '@/components/ui/aurora-background'\n\n<AuroraBackground tone="${a.tone}" className="h-screen">\n  {/* hero content */}\n</AuroraBackground>`,
    download: {
      filename: `aurora-${a.tone}.tsx`,
      content: `<AuroraBackground tone="${a.tone}" className="h-screen">\n  {/* hero content */}\n</AuroraBackground>\n`,
      mime: 'text/plain',
    },
  }
}

/** Contour — the tokenised topographic field, as a reusable website background (drawn, not a raster,
 *  like Aurora). It also backs the Contour Hero under Website Sections. Tagged for metadata. */
const CONTOUR_INSPECT: InspectData = {
  name: 'Contour',
  explain:
    'A tokenised topographic contour field — drawn from the tokens (paper = canvas, ink = fg, lines = accent), not a raster, so it recolours with the system. A calm, full-bleed backdrop for a hero or band, with a pointer-following magnifier loupe. Reduced-motion renders it static. Tags: contour · topographic · map · survey · background · blue · tokenised.',
  token:
    'ContourField · seed=7 · --c-canvas / --c-fg / --c-accent\n' +
    'tags  contour · topographic · map · survey · background · blue · tokenised',
  code:
    "import { ContourField } from '@/components/positioning-hero/ContourField'\n\n" +
    '<ContourField seed={7} className="h-screen">\n  {/* hero content rides on top */}\n</ContourField>',
  download: {
    filename: 'contour-background.tsx',
    content: '<ContourField seed={7} className="h-screen">\n  {/* hero content rides on top */}\n</ContourField>\n',
    mime: 'text/plain',
  },
}

/** Aspect-ratio frames the system ships against — each a draft wash standing in for a shoot. */
const FRAMES: ReadonlyArray<{
  ratio: string
  label: string
  note: string
  background: string
  dark?: boolean
}> = [
  {
    ratio: '16/9',
    label: 'Hero & banner',
    note: '16 / 9 · Atlas Blue glow',
    background:
      'radial-gradient(120% 140% at 0% 0%, rgba(51,72,143,0.20), transparent 60%), linear-gradient(135deg, #1b2433, #0e131c)',
    dark: true,
  },
  {
    ratio: '4/3',
    label: 'Card media',
    note: '4 / 3 · blue wash',
    background:
      'radial-gradient(120% 120% at 100% 0%, rgba(51,72,143,0.18), transparent 55%), linear-gradient(135deg, #EEF2F9, #E2E8F2)',
  },
  {
    ratio: '1/1',
    label: 'Avatar & tile',
    note: '1 / 1 · navy depth',
    background:
      'radial-gradient(110% 110% at 50% 0%, rgba(51,72,143,0.16), transparent 60%), linear-gradient(160deg, #182233, #0c111a)',
    dark: true,
  },
  {
    ratio: '3/4',
    label: 'Portrait',
    note: '3 / 4 · paper warmth',
    background:
      'radial-gradient(120% 120% at 0% 100%, rgba(51,72,143,0.14), transparent 55%), linear-gradient(200deg, #F1F4FA, #E2E8F2)',
  },
]

/** The single overlay recipe used whenever copy must sit on a photo. */
const OVERLAY =
  'linear-gradient(to top, rgba(8,12,18,0.88) 0%, rgba(8,12,18,0.45) 45%, rgba(8,12,18,0) 100%)'

/** The photo standing under the overlay in the live demo (a calm navy draught, not stock). */
const PHOTO = 'linear-gradient(135deg, #233044, #11161f 70%)'

/* ── Photography — the tagged shoot library ──────────────────────────────────── */

/** The "+" inspector for a photo: description, tags, use hints, a copy-ready <img>, and a download. */
function photoInspect(img: LibraryImage): InspectData {
  const file = libraryImageSrc(img.id)
  return {
    name: img.title,
    explain: `${img.alt} Good for: ${img.use.join(', ')}.`,
    token: `tags  ${img.tags.join(' · ')}\nuse   ${img.use.join(' · ')}`,
    code: `<img src="${file}" alt="${img.alt}" loading="lazy" className="h-full w-full object-cover" />`,
    download: { filename: `${img.id}.webp`, href: file },
  }
}

/** Curated "suggested searches" shown when the box is focused but empty. */
const SUGGESTED_SEARCHES = ['portrait', 'meeting', 'boardroom', 'sunlit', 'remote-work', 'collaboration', 'candid', 'city-view']

/** The full text an image is matched against — title, description, tags and use hints. */
const haystack = (img: LibraryImage) => [img.title, img.alt, ...img.tags, ...img.use].join(' ').toLowerCase()

/**
 * PhotoLibrary — a single search box in place of the old tag wall. Focus it (or type) and a dropdown
 * of tag suggestions / suggested searches appears; pick one, or free-type across every field. The
 * grid filters live on title · description · tags · use.
 */
function PhotoLibrary() {
  const [query, setQuery] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [activeIdx, setActiveIdx] = React.useState(-1)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const q = query.trim().toLowerCase()

  const suggestions = React.useMemo(() => {
    if (!q) return IMAGE_LIBRARY_TAGS.filter((t) => SUGGESTED_SEARCHES.includes(t))
    return IMAGE_LIBRARY_TAGS.filter((t) => t.includes(q)).slice(0, 10)
  }, [q])

  const shown = React.useMemo(
    () => (q ? IMAGE_LIBRARY.filter((i) => haystack(i).includes(q)) : IMAGE_LIBRARY),
    [q],
  )

  // close the dropdown on an outside click
  React.useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', onDown)
    return () => window.removeEventListener('mousedown', onDown)
  }, [open])

  const choose = (t: string) => {
    setQuery(t)
    setOpen(false)
    setActiveIdx(-1)
    inputRef.current?.blur()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false)
      setActiveIdx(-1)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActiveIdx((i) => Math.min(suggestions.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter' && activeIdx >= 0 && suggestions[activeIdx]) {
      e.preventDefault()
      choose(suggestions[activeIdx])
    }
  }

  return (
    <div>
      {/* search box + suggestions dropdown (replaces the old tag wall) */}
      <div ref={rootRef} className="relative mb-4 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" strokeWidth={1.75} aria-hidden />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActiveIdx(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={open}
          aria-controls="image-search-suggestions"
          aria-autocomplete="list"
          aria-label="Search images"
          placeholder="Search images — try “sunlit”, “boardroom”, “remote-work”…"
          className="w-full rounded-md border border-border bg-surface py-2.5 pl-9 pr-9 font-body text-body-sm text-fg placeholder:text-fg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-sm text-fg-subtle transition-colors hover:bg-selected hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          </button>
        )}

        {open && suggestions.length > 0 && (
          <div
            id="image-search-suggestions"
            role="listbox"
            className="absolute left-0 right-0 top-full z-20 mt-1.5 overflow-hidden rounded-md border border-border bg-elevated shadow-lg"
          >
            <p className="border-b border-border bg-surface px-3 py-1.5 font-mono text-mono-2xs uppercase tracking-wider text-fg-subtle">
              {q ? 'Matching tags' : 'Suggested searches'}
            </p>
            <ul className="max-h-64 overflow-auto py-1">
              {suggestions.map((t, i) => (
                <li key={t}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === activeIdx}
                    onMouseEnter={() => setActiveIdx(i)}
                    onClick={() => choose(t)}
                    className={cn(
                      'flex w-full items-center gap-2 px-3 py-1.5 text-left font-body text-body-sm transition-colors',
                      i === activeIdx ? 'bg-selected text-fg' : 'text-fg-muted hover:bg-selected hover:text-fg',
                    )}
                  >
                    <Search className="h-3.5 w-3.5 shrink-0 text-fg-subtle" strokeWidth={1.75} aria-hidden />
                    <span className="truncate">{t}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* result count */}
      <p className="mb-5 font-mono text-caption text-fg-subtle" aria-live="polite">
        {shown.length} {shown.length === 1 ? 'image' : 'images'}
        {q && <> · “{query.trim()}”</>}
      </p>

      {/* grid */}
      {shown.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((img) => (
            <Inspectable key={img.id} {...photoInspect(img)}>
              <figure className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition-shadow hover:shadow-md">
                <div className="relative aspect-[3/2]">
                  <img
                    src={libraryImageSrc(img.id)}
                    alt={img.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <figcaption className="flex flex-col gap-2 p-3">
                  <span className="font-display text-body-md font-medium text-fg">{img.title}</span>
                  <span className="flex flex-wrap gap-1">
                    {img.tags.slice(0, 4).map((t) => (
                      <span key={t} className="rounded-sm bg-inset px-1.5 py-0.5 font-mono text-mono-2xs text-fg-subtle">
                        {t}
                      </span>
                    ))}
                  </span>
                </figcaption>
              </figure>
            </Inspectable>
          ))}
        </div>
      ) : (
        <p className="rounded-md border border-border bg-inset px-4 py-10 text-center font-body text-body-sm text-fg-muted">
          No images match “{query.trim()}”. Try a broader term — or clear the search.
        </p>
      )}
    </div>
  )
}

export function ImageLibrarySection() {
  return (
    <Section
      id="imagery"
      eyebrow="Image Library"
      title="Image Library"
      lead="The visual language. The photography library is live — calm, natural-light advisors at work, each shot searchable and captioned so you (or an AI agent) can drop the right image into a page, funnel or blog. Backgrounds are production-grade pixel-art WEBP in the Atlas Blue palette, plus live Aurora and Contour fields; every frame rounds to the 8px ceiling on a hairline border."
    >
      {/* Photography — the tagged shoot library */}
      <div className="mb-14">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <MonoLabel number="17.1" dot>
            Photography
          </MonoLabel>
          <span className="font-mono text-caption text-fg-subtle">{IMAGE_LIBRARY.length} images · search below</span>
        </div>
        <p className="mb-6 max-w-2xl font-body text-body-md leading-relaxed text-fg-muted">
          The real shoot library — calm, considered, natural light. Search by keyword or tag (the box suggests
          matches as you type), then open any image’s <span className="font-mono text-caption">+</span> for its
          description, tags, use hints, a copy-ready <span className="font-mono text-caption">&lt;img&gt;</span>, or a
          download. Every entry is captioned in{' '}
          <span className="font-mono text-caption">src/data/image-library.ts</span> so AI agents can pick the right
          one for assets, funnels, pages and blogs.
        </p>
        <PhotoLibrary />
      </div>

      {/* Backgrounds — pixel-art website backdrops (WEBP) */}
      <div className="mb-14">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <MonoLabel number="17.2" dot>
            Backgrounds
          </MonoLabel>
          <span className="font-mono text-caption text-fg-subtle">WEBP + live aurora · website use</span>
        </div>
        <p className="mb-8 max-w-2xl font-body text-body-md leading-relaxed text-fg-muted">
          Backdrops for sections and heroes — drawn from the Atlas Blue palette. Full{' '}
          <span className="text-fg">Scenes</span>, faded <span className="text-fg">Horizons</span>, plain{' '}
          <span className="text-fg">Washes</span> (all high-resolution WEBP), a live, animated{' '}
          <span className="text-fg">Aurora</span>, and the tokenised <span className="text-fg">Contour</span> field.
          Pair with the bottom-up scrim (17.3) whenever copy sits on top. Open any tile’s{' '}
          <span className="font-mono text-caption">+</span> to download the asset or its usage snippet.
        </p>
        {BG_GROUPS.map((g) => (
          <div key={g.group} className="mb-9 last:mb-0">
            <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-caption font-bold uppercase tracking-[0.1em] text-fg">
                {g.group}
              </span>
              <span className="font-body text-body-sm text-fg-muted">{g.blurb}</span>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {g.items.map((b) => (
                <div key={b.id}>
                  <Inspectable {...backgroundInspect(b)}>
                    <div className="overflow-hidden rounded-md border border-border shadow-md">
                      <div className="relative aspect-[16/9]">
                        <img
                          src={`/images/backgrounds/${b.id}.webp`}
                          alt={`${b.label} — ${g.group} background`}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </Inspectable>
                  <div className="mt-2 flex items-baseline justify-between gap-2">
                    <span className="font-display text-body-md font-medium text-fg">{b.label}</span>
                    <span className="font-mono text-caption text-fg-subtle">{b.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* Aurora — the live animated component (2 blue + 2 grey tones) */}
        <div className="mb-9">
          <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-caption font-bold uppercase tracking-[0.1em] text-fg">
              Aurora
            </span>
            <span className="font-body text-body-sm text-fg-muted">
              Live light-columns (a component, not an image) — drifts gently, freezes under reduced-motion.
            </span>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {AURORA_TONES.map((a) => (
              <div key={a.tone}>
                <Inspectable {...auroraInspect(a)}>
                  <div className="overflow-hidden rounded-md border border-border shadow-md">
                    <div className="relative aspect-[16/9]">
                      <AuroraBackground tone={a.tone} className="absolute inset-0 h-full min-h-0" />
                    </div>
                  </div>
                </Inspectable>
                <div className="mt-2 flex items-baseline justify-between gap-2">
                  <span className="font-display text-body-md font-medium text-fg">{a.label}</span>
                  <span className="font-mono text-caption text-fg-subtle">{a.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Contour — the tokenised topographic field (a component, like Aurora), relocated here from
            its former standalone section so it lives with the other website backgrounds. */}
        <div className="mb-9">
          <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-caption font-bold uppercase tracking-[0.1em] text-fg">
              Contour
            </span>
            <span className="font-body text-body-sm text-fg-muted">
              A tokenised topographic field (a component, not an image) with a pointer-following loupe — drop it behind a hero or band.
            </span>
          </div>
          <Inspectable {...CONTOUR_INSPECT}>
            <div className="overflow-hidden rounded-md border border-border shadow-md">
              <div className="relative aspect-[16/9]">
                <ContourField seed={7} className="absolute inset-0 h-full min-h-0" />
              </div>
            </div>
          </Inspectable>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="font-display text-body-md font-medium text-fg">Contour</span>
            <span className="font-mono text-caption text-fg-subtle">topographic · map · background</span>
          </div>
        </div>
        <p className="mt-6 max-w-2xl font-body text-body-md leading-relaxed text-fg-muted">
          Add a still background by dropping a 16/9 WEBP into{' '}
          <span className="font-mono text-caption">public/images/backgrounds</span> and appending to a group in{' '}
          <span className="font-mono text-caption">BG_GROUPS</span>; the live{' '}
          <span className="font-mono text-caption">&lt;AuroraBackground&gt;</span> takes{' '}
          <span className="font-mono text-caption">blue · sky · slate · mist</span>, and{' '}
          <span className="font-mono text-caption">&lt;ContourField&gt;</span> draws a tokenised contour map.
        </p>
      </div>

      {/* Aspect-ratio frames */}
      <div className="mb-14">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <MonoLabel number="17.3" dot>
            Aspect-ratio frames
          </MonoLabel>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FRAMES.map((frame) => (
            <div key={frame.ratio}>
              <ImageWash
                background={frame.background}
                label={frame.label}
                note={frame.note}
                dark={frame.dark}
                ratio={frame.ratio}
                className="shadow-md"
              />
              <p className="mt-2 font-mono text-caption text-fg-subtle">
                ratio <span className="text-fg-muted">{frame.ratio}</span>
              </p>
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-2xl font-body text-body-md leading-relaxed text-fg-muted">
          Four ratios cover the system: <span className="text-fg">16 / 9</span> for heroes and
          banners, <span className="text-fg">4 / 3</span> for card media,{' '}
          <span className="text-fg">1 / 1</span> for avatars and bento tiles, and{' '}
          <span className="text-fg">3 / 4</span> for portraits. Each tile is a soft CSS wash under a
          hairline border, rounded to the 8px ceiling and gently lifted.
        </p>
      </div>

      {/* Gradient overlay over image */}
      <div className="mb-14">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <MonoLabel number="17.4" dot>
            Gradient overlay
          </MonoLabel>
          <span className="font-mono text-caption text-fg-subtle">copy over photography</span>
        </div>
        <Demo label="Copy over photography · bottom-up scrim" padded={false} inspect={OVERLAY_INSPECT}>
          <div className="grid gap-0 md:grid-cols-2">
            {/* Live pattern: a photo draught with the scrim + copy on top */}
            <div
              className="relative min-h-[280px] overflow-hidden"
              style={{ background: PHOTO }}
            >
              <div className="absolute inset-0" style={{ background: OVERLAY }} aria-hidden />
              <div className="absolute inset-0 z-10 flex flex-col justify-end gap-2 p-6">
                <MonoLabel tone="brand" number="01" dot className="text-inverse-fg/70">
                  Private Credit
                </MonoLabel>
                <h3 className="font-display text-title-md text-inverse-fg">
                  Capital that moves at the speed of the deal
                </h3>
                <p className="font-body text-body-sm leading-relaxed text-inverse-fg/70">
                  A bottom-up scrim keeps display copy AA-legible over any frame, however busy the
                  underlying image.
                </p>
              </div>
            </div>
            {/* Anatomy note */}
            <div className="flex flex-col justify-center gap-4 border-t border-border bg-surface p-6 md:border-l md:border-t-0">
              <p className="font-body text-body-md leading-relaxed text-fg-muted">
                Text never sits on bare photography. A single bottom-anchored scrim, fading to
                transparent at the top, guarantees contrast and keeps the eye on the headline.
              </p>
              <ul className="flex flex-col gap-2 font-mono text-caption text-fg-subtle">
                <li>· overlay anchored to the bottom 55% of the frame</li>
                <li>· copy stacked in the lower-left, inverse-fg tokens</li>
                <li>· one accent overline max, never a second gradient</li>
              </ul>
            </div>
          </div>
        </Demo>
      </div>

      {/* Approved / forbidden */}
      <div className="mb-14">
        <MonoLabel number="17.5" dot className="mb-5">
          Direction — approved &amp; forbidden
        </MonoLabel>
        <div className="grid gap-5 md:grid-cols-2">
          {/* Approved */}
          <div className="overflow-hidden rounded-lg border border-success/40 bg-success-soft/30">
            <div className="flex items-center gap-2 border-b border-success/30 px-4 py-2.5">
              <Check className="h-4 w-4 text-success" strokeWidth={1.5} aria-hidden />
              <span className="font-mono text-caption font-bold uppercase tracking-[0.1em] text-success">
                Approved
              </span>
            </div>
            <div className="p-5">
              <ImageWash
                background="radial-gradient(120% 120% at 100% 0%, rgba(51,72,143,0.16), transparent 55%), linear-gradient(135deg, #1b2433, #0e131c)"
                label="Considered, calm, real"
                note="natural light · muted · on-brand wash"
                icon={Handshake}
                dark
                ratio="16/9"
              />
              <p className="mt-4 font-body text-body-sm leading-relaxed text-fg-muted">
                Documentary tone, restrained colour, advisors mid-work. Warmth comes from a faint
                Atlas Blue glow — never a filter. Subjects look composed, not staged.
              </p>
            </div>
          </div>
          {/* Forbidden */}
          <div className="overflow-hidden rounded-lg border border-danger/40 bg-danger-soft/30">
            <div className="flex items-center gap-2 border-b border-danger/30 px-4 py-2.5">
              <X className="h-4 w-4 text-danger" strokeWidth={1.5} aria-hidden />
              <span className="font-mono text-caption font-bold uppercase tracking-[0.1em] text-danger">
                Forbidden
              </span>
            </div>
            <div className="p-5">
              <ImageWash
                background="linear-gradient(135deg, #ff5fa2, #7a3bff 45%, #14e0c8)"
                label="Stock-smiley, neon, glassy"
                note="saturated gradients · fake handshakes"
                ratio="16/9"
                dark
              />
              <p className="mt-4 font-body text-body-sm leading-relaxed text-fg-muted">
                No rainbow gradients, no glassmorphism, no posed grins or trophy imagery. Loud colour
                and clipart confidence read as hype — the one thing a broker CRM cannot afford.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image treatment */}
      <div>
        <MonoLabel number="17.6" dot className="mb-5">
          Image treatment
        </MonoLabel>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              Icon: ShieldCheck,
              title: 'Framing',
              body: 'Every frame keeps a hairline border-border and an 8px rounded corner, so photography never floats on the white canvas.',
            },
            {
              Icon: Building2,
              title: 'Scrim',
              body: 'A bottom-up dark scrim sits under any overlaid text, so headlines stay legible over the busiest image.',
            },
            {
              Icon: LineChart,
              title: 'Wash',
              body: 'A faint blue wash at one corner ties the image to the accent without a visible border seam.',
            },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="rounded-md border border-border bg-surface p-5">
              <Icon className="h-5 w-5 text-accent-text" strokeWidth={1.5} aria-hidden />
              <h3 className="mt-3 font-display text-title-sm text-fg">{title}</h3>
              <p className="mt-1.5 font-body text-body-sm leading-relaxed text-fg-muted">{body}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-2xl font-body text-body-md leading-relaxed text-fg-muted">
          One recipe everywhere: same ratios, same rounded corner + hairline border, same bottom-up
          scrim — so a single change reflows every frame.
        </p>
      </div>
    </Section>
  )
}
