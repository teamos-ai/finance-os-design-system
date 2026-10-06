/**
 * PixelMountains — Finance OS vector website backgrounds.
 *
 * A parametric generator for calm, retro-pixel blue mountain scenes, built entirely in-code
 * as SVG so every background is: true vector (scales to any hero), tokenised to the Atlas
 * Blue ramp (no warm colour anywhere), and able to carry a gentle twinkle — a handful of
 * light pixels breathing on/off, almost below notice.
 *
 * The "pixel" look is honest vector: ridge silhouettes are stepped to a coarse grid and
 * painted with shape-rendering:crispEdges, so the stair-steps ARE the pixels — no raster,
 * no autotrace. One `buildScene()` feeds two renderers: the React <PixelMountains/> tile
 * and `mountainSvg()`, which serialises a standalone, self-animating .svg for download.
 *
 * Twinkle honours prefers-reduced-motion (the global guard in index.css freezes the
 * in-app class; the standalone file carries its own reduced-motion media query).
 */
import { useMemo } from 'react'

/* ── Canvas & grid. 1600×900 (16/9); GRID is the pixel size, 80×45 cells. ───────────── */
const W = 1600
const H = 900
const GRID = 20
const COLS = W / GRID

/* ── Palette — Atlas Blue ramp (primitives) + cool tints of the same family. ─────────── */
const SKY_TOP = '#F6F7F9' // canvas-muted, near white
const SKY_BOT = '#EEF2F9' // --p-blue-50
const FAR = '#C7CEE1' //      far haze (50↔100 tint)
const MID1 = '#ADB6D2' // --p-blue-100
const MID2 = '#8591BC' // --p-blue-200
const NEAR = '#5C6DA5' // --p-blue-300
const FRONT = '#33488F' // --p-blue-400 (base accent)
const DEEP = '#1F2B56' // --p-blue-500
const SNOW = '#FFFFFF'
const WATER = '#DCE3F0' // light water band (blue tint)
const RIVER = '#E2E8F2' // winding river (blue tint)
const GLINT = '#EEF2F9' // twinkle pixel

export type MountainFeature = 'lake' | 'dense' | 'valley' | 'mist'

export interface MountainVariant {
  id: string
  label: string
  note: string
  seed: number
  feature: MountainFeature
}

/** The four shipped backgrounds. Add an entry here to add a background to the library. */
export const MOUNTAIN_VARIANTS: readonly MountainVariant[] = [
  { id: 'still-waters', label: 'Still Waters', note: 'lake · central peak', seed: 1337, feature: 'lake' },
  { id: 'dense-range', label: 'Dense Range', note: 'dithered ridgeline', seed: 4242, feature: 'dense' },
  { id: 'river-valley', label: 'River Valley', note: 'valley · winding river', seed: 8891, feature: 'valley' },
  { id: 'rolling-mist', label: 'Rolling Mist', note: 'soft haze layers', seed: 2026, feature: 'mist' },
]

/* ── Deterministic RNG (mulberry32) so a variant always renders identically. ─────────── */
function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const snap = (n: number) => Math.round(n / GRID) * GRID

interface Poly {
  points: string
  fill: string
  opacity?: number
}
interface Rect {
  x: number
  y: number
  w: number
  h: number
  fill: string
  opacity?: number
}
interface Star {
  x: number
  y: number
  s: number
  delay: number
  dur: number
  min: number
  max: number
}
interface Scene {
  polys: Poly[] // back-to-front silhouettes (ridges, water, river, trees)
  rects: Rect[] // snow caps, haze bands, ripples
  stars: Star[]
}

/** A single stepped ridgeline: per-column tops, quantised to the grid (the pixel steps). */
function ridgeTops(
  r: () => number,
  o: { baseY: number; rise: number; rough: number; peakX?: number; peakRise?: number },
): Array<[number, number]> {
  const phase = r() * Math.PI * 2
  const freq = 1 + r() * 1.6
  const tops: Array<[number, number]> = []
  let walk = 0
  for (let c = 0; c <= COLS; c++) {
    const frac = c / COLS
    walk = walk * 0.84 + (r() - 0.5) * o.rough
    const sine = Math.sin(frac * Math.PI * 2 * freq + phase) * o.rise * 0.3
    const peak = o.peakRise ? Math.max(0, 1 - Math.abs(frac - (o.peakX ?? 0.5)) / 0.18) * o.peakRise : 0
    let y = o.baseY - o.rise * 0.35 - sine - peak - walk * GRID
    y = Math.max(GRID, Math.min(H - GRID, snap(y)))
    tops.push([c * GRID, y])
  }
  return tops
}

/** Turn column tops into a closed stepped polygon down to a baseline (default: canvas floor). */
function toPoly(tops: Array<[number, number]>, floor = H): string {
  const pts: string[] = []
  for (const [x, y] of tops) pts.push(`${x},${y}`, `${x + GRID},${y}`)
  pts.push(`${W},${floor}`, `0,${floor}`)
  return pts.join(' ')
}

/** Snow caps: white cells hugging each summit — measured from the ridge's own highest point,
 *  so a cap always lands on the peak (and tapers as the ridge falls away). */
function snowCaps(tops: Array<[number, number]>, cells: number, opacity = 0.92): Rect[] {
  const summit = Math.min(...tops.map(([, y]) => y))
  const snowLine = summit + cells * GRID
  const caps: Rect[] = []
  for (const [x, y] of tops) {
    if (y < snowLine) caps.push({ x, y, w: GRID, h: snowLine - y, fill: SNOW, opacity })
  }
  return caps
}

/** Dither fringe: the ridge's own tone dotted up into the lighter band above its crest —
 *  the retro halftone transition between two flat tones. */
function ditherFringe(tops: Array<[number, number]>, fill: string, dense = false): Rect[] {
  const out: Rect[] = []
  tops.forEach(([x, y], i) => {
    if (i % 2 === 0) out.push({ x, y: y - GRID, w: GRID, h: GRID, fill })
    if (i % 4 === (dense ? 2 : 0)) out.push({ x, y: y - 2 * GRID, w: GRID, h: GRID, fill })
    if (dense && i % 4 === 0) out.push({ x, y: y - 3 * GRID, w: GRID, h: GRID, fill })
  })
  return out
}

/** A serrated pine-forest silhouette: a triangle-wave treeline rolling gently across the width.
 *  Reads as a row of pines with none of the occlusion a stamped sprite suffers. */
function pineRidgeTops(r: () => number, baseY: number, roll: number): Array<[number, number]> {
  const tops: Array<[number, number]> = []
  let walk = 0
  for (let c = 0; c <= COLS; c++) {
    walk = walk * 0.8 + (r() - 0.5) * roll
    const tooth = 3 - Math.abs((c % 6) - 3) // 0,1,2,3,2,1 → pines, period 6 cells
    const y = baseY - walk * GRID - tooth * GRID
    tops.push([c * GRID, Math.min(H - GRID, snap(y))])
  }
  return tops
}

function buildScene(variant: MountainVariant): Scene {
  const r = rng(variant.seed)
  const polys: Poly[] = []
  const rects: Rect[] = []
  const stars: Star[] = []
  const { feature } = variant
  const mist = feature === 'mist'
  const dense = feature === 'dense'
  const lake = feature === 'lake'

  // Four graduated ridges, far → near. The hero (near) ridge carries the dominant peak.
  const roughBase = dense ? 3.2 : mist ? 1.1 : 2.0
  const peakX = 0.36 + r() * 0.28
  const far = ridgeTops(r, { baseY: 0.5 * H, rise: 0.2 * H, rough: roughBase * 0.7 })
  const mid = ridgeTops(r, { baseY: 0.62 * H, rise: 0.3 * H, rough: roughBase })
  const near2 = ridgeTops(r, { baseY: 0.74 * H, rise: 0.34 * H, rough: roughBase })
  const hero = ridgeTops(r, {
    baseY: 0.84 * H,
    rise: 0.44 * H,
    rough: roughBase,
    peakX,
    peakRise: mist ? 0.18 * H : 0.34 * H,
  })

  polys.push({ points: toPoly(far), fill: FAR })
  polys.push({ points: toPoly(mid), fill: MID1 })
  polys.push({ points: toPoly(near2), fill: MID2 })
  polys.push({ points: toPoly(hero), fill: NEAR })

  // Dithered halftone edges feather every tone seam (heavier on the dense range, light in mist
  // so the layers melt into haze rather than banding).
  rects.push(...ditherFringe(mid, MID1, dense))
  rects.push(...ditherFringe(near2, MID2, dense))
  rects.push(...ditherFringe(hero, NEAR, dense))

  // Snow on the hero summit, plus a lighter cap on the dense range's second peak.
  rects.push(...snowCaps(hero, mist ? 1 : 3))
  if (dense) rects.push(...snowCaps(near2, 2, 0.5))

  // Mist: one soft pale veil drifting across the lower slopes.
  if (mist) rects.push({ x: 0, y: snap(0.64 * H), w: W, h: 3 * GRID, fill: SNOW, opacity: 0.3 })

  if (lake) {
    // Still water across the bottom, a faint mirrored summit, a few ripple lines.
    const waterY = snap(0.72 * H)
    const forest = pineRidgeTops(r, waterY, roughBase * 0.6)
    polys.push({ points: toPoly(forest, waterY), fill: DEEP })
    polys.push({ points: `0,${waterY} ${W},${waterY} ${W},${H} 0,${H}`, fill: WATER })
    const refl: string[] = []
    for (const [x, y] of hero) {
      refl.push(`${x},${snap(waterY + (waterY - y) * 0.5)}`, `${x + GRID},${snap(waterY + (waterY - y) * 0.5)}`)
    }
    refl.push(`${W},${H}`, `0,${H}`)
    polys.push({ points: refl.join(' '), fill: NEAR, opacity: 0.16 })
    for (const t of [0.8, 0.88, 0.95]) {
      rects.push({ x: 0, y: snap(t * H), w: W, h: GRID, fill: SNOW, opacity: 0.16 })
    }
  } else {
    // Foreground hills, then a serrated pine forest standing in front of them.
    polys.push({ points: toPoly(ridgeTops(r, { baseY: 0.86 * H, rise: 0.16 * H, rough: roughBase * 0.8 })), fill: FRONT })
    if (!mist) polys.push({ points: toPoly(pineRidgeTops(r, 0.96 * H, roughBase * 0.7)), fill: DEEP })
  }

  if (feature === 'valley') {
    // A thin river winding down the valley floor, water-tinted.
    const left: string[] = []
    const right: string[] = []
    let cx = W / 2
    const top = snap(0.56 * H)
    for (let y = top; y <= H; y += GRID) {
      cx += (r() - 0.5) * GRID * 2.2
      const t = (y - top) / (H - top)
      const halfW = snap((0.5 + t * 1.6) * GRID)
      left.push(`${snap(cx) - halfW},${y}`)
      right.unshift(`${snap(cx) + halfW},${y}`)
    }
    polys.push({ points: [...left, ...right].join(' '), fill: RIVER, opacity: 0.9 })
  }

  // Twinkle: a handful of light pixels breathing on the mid/near ridges. Deliberately faint.
  const bands = [mid, near2, hero]
  for (let i = 0; i < 14; i++) {
    const band = bands[Math.floor(r() * bands.length)]
    const c = Math.max(0, Math.min(band.length - 1, Math.floor(r() * (COLS + 1))))
    const [bx, by] = band[c]
    stars.push({
      x: bx,
      y: snap(by + (0.5 + r() * 3) * GRID),
      s: GRID,
      delay: +(r() * 6).toFixed(2),
      dur: +(3.4 + r() * 3).toFixed(2),
      min: +(0.06 + r() * 0.08).toFixed(2),
      max: +(0.32 + r() * 0.16).toFixed(2),
    })
  }

  return { polys, rects, stars }
}

export interface PixelMountainsProps {
  variant: MountainVariant
  className?: string
}

/** In-app tile. Twinkle rides the global `.fos-twinkle` keyframes (frozen by reduced-motion). */
export function PixelMountains({ variant, className }: PixelMountainsProps) {
  const scene = useMemo(() => buildScene(variant), [variant])
  const gid = `sky-${variant.id}`
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      style={{ display: 'block', shapeRendering: 'crispEdges' }}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${variant.label} — pixel mountain background`}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SKY_TOP} />
          <stop offset="100%" stopColor={SKY_BOT} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={W} height={H} fill={`url(#${gid})`} />
      {scene.polys.map((p, i) => (
        <polygon key={`p${i}`} points={p.points} fill={p.fill} opacity={p.opacity} />
      ))}
      {scene.rects.map((rc, i) => (
        <rect key={`r${i}`} x={rc.x} y={rc.y} width={rc.w} height={rc.h} fill={rc.fill} opacity={rc.opacity} />
      ))}
      {scene.stars.map((s, i) => (
        <rect
          key={`s${i}`}
          className="fos-twinkle"
          x={s.x}
          y={s.y}
          width={s.s}
          height={s.s}
          fill={GLINT}
          style={
            {
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
              '--tw-min': s.min,
              '--tw-max': s.max,
            } as React.CSSProperties
          }
        />
      ))}
    </svg>
  )
}

/** Serialise a standalone, self-animating .svg (reduced-motion safe) for download. */
export function mountainSvg(variant: MountainVariant): string {
  const scene = buildScene(variant)
  const polys = scene.polys
    .map((p) => `<polygon points="${p.points}" fill="${p.fill}"${p.opacity != null ? ` opacity="${p.opacity}"` : ''}/>`)
    .join('')
  const rects = scene.rects
    .map(
      (r) =>
        `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${r.fill}"${r.opacity != null ? ` opacity="${r.opacity}"` : ''}/>`,
    )
    .join('')
  const stars = scene.stars
    .map(
      (s) =>
        `<rect class="tw" x="${s.x}" y="${s.y}" width="${s.s}" height="${s.s}" fill="${GLINT}" style="animation-delay:${s.delay}s;animation-duration:${s.dur}s;--mn:${s.min};--mx:${s.max}"/>`,
    )
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges" role="img" aria-label="${variant.label} — Finance OS pixel mountain background">
<title>Finance OS — ${variant.label}</title>
<style>
  .tw{opacity:var(--mn,0.1);animation-name:fos-twinkle;animation-iteration-count:infinite;animation-timing-function:ease-in-out}
  @keyframes fos-twinkle{0%,100%{opacity:var(--mn,0.1)}50%{opacity:var(--mx,0.4)}}
  @media (prefers-reduced-motion:reduce){.tw{animation:none;opacity:var(--mn,0.1)}}
</style>
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${SKY_TOP}"/><stop offset="100%" stop-color="${SKY_BOT}"/></linearGradient></defs>
<rect x="0" y="0" width="${W}" height="${H}" fill="url(#sky)"/>
${polys}${rects}${stars}
</svg>`
}
