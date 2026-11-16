/**
 * CardSphere — an interactive, draggable sphere of flat "design-system" cards, refashioned
 * from Cue's cue200 into THIS system.
 *
 * Faithful to the constitution, not the reference's look:
 *  · Atlas-Blue + neutral tokens ONLY (no lime, no photos, no gradients-as-fill, no glass).
 *  · 8px squircles (fixed --radius-lg on every card) · Spline Sans + Anonymous Pro.
 *  · SINGLE Light theme — the reference's white↔#111 double-click toggle is removed entirely.
 *  · Depth from a calm layered shadow (and a soft Atlas-Blue glow on the blue cards), never frost.
 *
 * Each hero card NAMES a part of the system (Typography, Cards, Buttons, Widgets, Charts, Heroes,
 * Icons, Funnels…) over a tokenised glyph; smaller cards carry glyph / swatch marks. Drag, flick,
 * scroll or arrow-key to turn it; it coasts and settles one card to the front, reports it through
 * `onSettle`, then drifts gently. That idle drift is a deliberate, reduced-motion-safe exception
 * to the "no autoplay" rule for this one showcase centrepiece — frozen under prefers-reduced-motion.
 *
 * The loop writes transforms straight to DOM nodes in one requestAnimationFrame — no React
 * re-renders; only the settled label lifts to React through onSettle.
 */
import { useEffect, useRef, type CSSProperties } from 'react'

export type CardSphereProps = {
  /** fired when a card settles at the front, with its label (heroes only) */
  onSettle?: (label: string) => void
  className?: string
  style?: CSSProperties
}

/* ---------- maths (verbatim from the reference physics) ---------- */
type Vec = { x: number; y: number; z: number }
type Quat = [number, number, number, number]
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const bez = (x1: number, y1: number, x2: number, y2: number) => (x: number) => {
  let t = x
  for (let i = 0; i < 6; i++) {
    const cx = 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + t ** 3 - x
    const d = 3 * x1 * (1 - t) ** 2 + 6 * (x2 - x1) * t * (1 - t) + 3 * (1 - x2) * t * t
    if (Math.abs(d) < 1e-6) break
    t = clamp(t - cx / d)
  }
  return 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t * t * (1 - t) + t ** 3
}
const SETTLE = bez(0.25, 0.75, 0.2, 1) // fast start, long glide
const V = (x: number, y: number, z: number): Vec => ({ x, y, z })
const norm = (a: Vec) => { const n = Math.hypot(a.x, a.y, a.z) || 1; return V(a.x / n, a.y / n, a.z / n) }
const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y + a.z * b.z
const cross = (a: Vec, b: Vec) => V(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x)
const qmul = (a: Quat, b: Quat): Quat => [
  a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3], a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
  a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1], a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0]]
const qaxis = (axis: Vec, ang: number): Quat => { const s = Math.sin(ang / 2), a = norm(axis); return [Math.cos(ang / 2), a.x * s, a.y * s, a.z * s] }
const qnorm = (q: Quat): Quat => { const n = Math.hypot(q[0], q[1], q[2], q[3]); return [q[0] / n, q[1] / n, q[2] / n, q[3] / n] }
const qrot = (q: Quat, v: Vec): Vec => {
  const [w, x, y, z] = q
  return V(
    (w * w + x * x - y * y - z * z) * v.x + 2 * (x * y - w * z) * v.y + 2 * (x * z + w * y) * v.z,
    2 * (x * y + w * z) * v.x + (w * w - x * x + y * y - z * z) * v.y + 2 * (y * z - w * x) * v.z,
    2 * (x * z - w * y) * v.x + 2 * (y * z + w * x) * v.y + (w * w - x * x - y * y + z * z) * v.z,
  )
}
const qslerp = (a: Quat, b: Quat, t: number): Quat => {
  let c = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
  if (c < 0) { b = [-b[0], -b[1], -b[2], -b[3]]; c = -c }
  if (c > 0.9995) return qnorm([lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t)])
  const th = Math.acos(c), s = Math.sin(th), ka = Math.sin((1 - t) * th) / s, kb = Math.sin(t * th) / s
  return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb, a[3] * ka + b[3] * kb]
}
const qbetween = (from: Vec, to: Vec): Quat => {
  const c = clamp(dot(from, to), -1, 1)
  if (c > 0.99999) return [1, 0, 0, 0]
  return qaxis(c < -0.99999 ? V(0, 1, 0) : cross(from, to), Math.acos(c))
}
const fib = (n: number, i: number, off = 0) => {
  const y = 1 - (2 * (i + 0.5)) / n, r = Math.sqrt(1 - y * y), t = Math.PI * (3 - Math.sqrt(5)) * i + off
  return V(Math.cos(t) * r, y, Math.sin(t) * r)
}

/* ---------- content — each card is a part of the Finance OS system ---------- */
type Role = 'surface' | 'blue' | 'ink' | 'soft'
type Kind =
  | 'type' | 'cards' | 'buttons' | 'widgets' | 'charts' | 'heroes' | 'icons' | 'pricing'
  | 'funnels' | 'fromto' | 'thisvsthat' | 'blogs' | 'tokens' | 'colour' | 'layout' | 'radius' | 'motion'

type Card = {
  kind: Kind; role: Role; label: string
  w: number; h: number; rz: number; p: Vec; hero?: boolean
  el?: HTMLDivElement; hv?: number
}

/* Hairline lucide-grade glyph markup (24-box). Blue on white cards, white on blue/ink cards —
   it inherits `currentColor` from the card's role class. */
const GLYPH: Record<Kind, string> = {
  type: '', // rendered as an "Aa" specimen instead
  cards: '<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="3.3" y="8" width="12" height="11" rx="2.5"/><rect x="8.7" y="4" width="12" height="11" rx="2.5"/></g>',
  buttons: '<rect x="3" y="8.3" width="18" height="7.4" rx="2.5" fill="currentColor"/><rect x="6" y="10.6" width="7" height="2.8" rx="1.4" fill="var(--c-canvas)" opacity="0.92"/>',
  widgets: '<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 16a8 8 0 0 1 16 0"/><path d="M12 16l4.6-4.2"/></g><circle cx="12" cy="16" r="1.4" fill="currentColor"/>',
  charts: '<g fill="currentColor"><rect x="3.8" y="12" width="3.6" height="7" rx="1"/><rect x="10.2" y="6.5" width="3.6" height="12.5" rx="1"/><rect x="16.6" y="9.5" width="3.6" height="9.5" rx="1"/></g>',
  heroes: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 7h16"/><path d="M4 12h11"/><path d="M4 17h7"/></g>',
  icons: '<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><circle cx="7" cy="7" r="3"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="3"/><path d="M7 13.6l3.3 6.4H3.7z"/></g>',
  pricing: '<path d="M12.6 3.6H5.6a2 2 0 0 0-2 2v7l9 9 9-9-9-9z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" transform="translate(-0.2 -0.1)"/><circle cx="8.1" cy="8.1" r="1.4" fill="currentColor"/>',
  funnels: '<path d="M3.6 5.4h16.8l-6.1 7.6v5l-4.6 2.3v-7.3z" fill="currentColor"/>',
  fromto: '<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"><rect x="3" y="9" width="6" height="6" rx="1.5"/><rect x="15" y="9" width="6" height="6" rx="1.5"/><path d="M9.6 12h4.8M12.7 9.6l2.6 2.4-2.6 2.4"/></g>',
  thisvsthat: '<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="3.4" y="5" width="17.2" height="14" rx="2"/><path d="M12 5v14"/></g>',
  blogs: '<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"><rect x="4.4" y="3.5" width="15.2" height="17" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></g>',
  tokens: '<g fill="currentColor"><rect x="4" y="5" width="16" height="3.4" rx="1.3"/><rect x="4" y="10.3" width="11" height="3.4" rx="1.3" opacity="0.66"/><rect x="4" y="15.6" width="14" height="3.4" rx="1.3" opacity="0.4"/></g>',
  colour: '', // rendered as a 3-band swatch
  layout: '<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="3.4" y="3.4" width="7" height="7" rx="1.5"/><rect x="13.6" y="3.4" width="7" height="7" rx="1.5"/><rect x="3.4" y="13.6" width="17.2" height="7" rx="1.5"/></g>',
  radius: '<path d="M5 20.5V11a6 6 0 0 1 6-6h9.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  motion: '<circle cx="6.5" cy="12" r="3" fill="currentColor"/><path d="M11 12h9.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="1.6 3.6"/>',
}

const TITLE_COLOR: Record<Role, string> = {
  surface: 'var(--c-fg)', soft: 'var(--c-fg)', blue: '#FFFFFF', ink: '#FFFFFF',
}

const SPLINE = "'Spline Sans', system-ui, -apple-system, sans-serif"

/** Centre glyph markup for a card (sized to its width). */
const glyphFor = (o: Card): string => {
  const g = o.w * 0.44
  if (o.kind === 'type') {
    return `<div style="font-family:${SPLINE};font-weight:600;font-size:${o.w * 0.42}px;letter-spacing:-0.03em;line-height:1;color:currentColor">Aa</div>`
  }
  if (o.kind === 'colour') {
    const bar = o.w * 0.5
    return `<div style="width:${bar}px;height:${bar}px;border-radius:8px;overflow:hidden;display:grid;grid-template-rows:1.3fr 1fr 1fr;border:1px solid var(--c-border)">
      <div style="background:var(--c-accent)"></div><div style="background:var(--c-fg)"></div><div style="background:var(--c-canvas)"></div></div>`
  }
  return `<svg viewBox="0 0 24 24" width="${g}" height="${g}" aria-hidden="true">${GLYPH[o.kind]}</svg>`
}

/** Full card face: the glyph and (on larger cards) a Spline Sans title, centred as one group so the
 *  card reads balanced — not top-heavy with a footer label. */
const faceHTML = (o: Card): string => {
  const pad = o.w * 0.12
  const title = o.label && o.w >= 150
    ? `<div style="font-family:${SPLINE};font-weight:600;font-size:${o.w * 0.095}px;letter-spacing:-0.01em;line-height:1.15;text-align:center;color:${TITLE_COLOR[o.role]}">${o.label}</div>`
    : ''
  return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;box-sizing:border-box;padding:${pad}px;gap:${o.w * 0.07}px">
      <div style="display:grid;place-items:center;min-height:0">${glyphFor(o)}</div>${title}</div>`
}

/* The 8 "hero" cards that settle to the front — the headline parts of the system. */
const HEROES: { kind: Kind; role: Role; label: string }[] = [
  { kind: 'type', role: 'surface', label: 'Typography' },
  { kind: 'cards', role: 'surface', label: 'Cards' },
  { kind: 'buttons', role: 'blue', label: 'Buttons' },
  { kind: 'widgets', role: 'surface', label: 'Widgets' },
  { kind: 'charts', role: 'surface', label: 'Charts' },
  { kind: 'heroes', role: 'ink', label: 'Heroes' },
  { kind: 'icons', role: 'surface', label: 'Icons' },
  { kind: 'funnels', role: 'blue', label: 'Funnels' },
]
const HERO_SIZE: [number, number, number][] = [ // w, h, rz
  [406, 508, -1.5], [414, 520, 0.6], [398, 500, -0.8], [410, 512, 1.1],
  [404, 505, -0.5], [416, 522, 1.4], [408, 510, -1], [412, 515, 0.8],
]

/* The smaller orbiting cards — the rest of the vocabulary, drawn from the real nav. */
const SMALL_POOL: { kind: Kind; label: string }[] = [
  { kind: 'tokens', label: 'Tokens' }, { kind: 'colour', label: 'Colour' },
  { kind: 'layout', label: 'Layout' }, { kind: 'pricing', label: 'Pricing' },
  { kind: 'fromto', label: 'From & To' }, { kind: 'thisvsthat', label: 'This vs That' },
  { kind: 'blogs', label: 'Blogs' }, { kind: 'radius', label: 'Radius' },
  { kind: 'motion', label: 'Motion' }, { kind: 'icons', label: 'Icons' },
  { kind: 'charts', label: 'Charts' }, { kind: 'cards', label: 'Cards' },
  { kind: 'widgets', label: 'Widgets' }, { kind: 'type', label: 'Type' },
  { kind: 'funnels', label: 'Funnels' }, { kind: 'heroes', label: 'Heroes' },
  { kind: 'buttons', label: 'Buttons' }, { kind: 'tokens', label: 'Tokens' },
  { kind: 'layout', label: 'Layout' }, { kind: 'colour', label: 'Colour' },
]
const NS = 56 // small-card slots on the sphere

/** Build the same seeded field every time. */
function buildCards(): Card[] {
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  const heroes: Card[] = HEROES.map((o, i) => ({
    ...o, w: HERO_SIZE[i][0], h: HERO_SIZE[i][1], rz: HERO_SIZE[i][2], p: fib(8, i, 1.1), hero: true, hv: 1,
  }))
  const small: Card[] = []
  for (let i = 0; i < NS; i++) {
    const p = fib(NS, i, 0.37)
    p.x += (rnd() - 0.5) * 0.08; p.y += (rnd() - 0.5) * 0.08; p.z += (rnd() - 0.5) * 0.08
    const q = norm(p)
    if (heroes.some((h) => dot(h.p, q) > 0.9)) continue // keep air around each hero
    const pick = SMALL_POOL[Math.floor(rnd() * SMALL_POOL.length)]
    const w = 116 + rnd() * 116
    const r = rnd()
    const role: Role = r < 0.12 ? 'blue' : r < 0.2 ? 'ink' : r < 0.32 ? 'soft' : 'surface'
    small.push({ ...pick, role, w, h: w * (1.02 + rnd() * 0.28), p: q, rz: (rnd() - 0.5) * 7, hv: 1 })
  }
  return [...heroes, ...small]
}

const CSS = `
.csph{position:relative;width:100%;height:100%;min-height:320px;overflow:hidden;contain:strict;user-select:none;-webkit-user-select:none;outline:none;touch-action:pan-y;cursor:grab}
.csph.grabbing{cursor:grabbing}
.csph-c{position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform,opacity;overflow:hidden;backface-visibility:hidden;box-sizing:border-box;border-radius:8px}
.csph-surface{background:var(--c-surface);color:var(--c-accent);border:1px solid var(--c-border);box-shadow:var(--shadow-md)}
.csph-soft{background:var(--c-accent-soft);color:var(--c-accent-text);border:1px solid var(--c-border)}
.csph-blue{background:var(--c-gradient-accent);color:#fff;box-shadow:var(--shadow-glow),var(--shadow-md)}
.csph-ink{background:var(--c-inverse-bg);color:#fff;box-shadow:var(--shadow-lg)}
.csph:focus-visible{box-shadow:0 0 0 2px var(--c-ring)}
@media (prefers-reduced-motion:reduce){.csph-c{will-change:auto}}
`

const P = 2 // camera distance / sphere radius
const IDLE_DELAY = 2200 // ms of calm before the gentle drift resumes
const IDLE_SPEED = 0.14 // rad/s — slow, calm
const IDLE_AXIS = V(0.12, 1, 0)

export default function CardSphere({ onSettle, className, style }: CardSphereProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const cb = useRef(onSettle)
  cb.current = onSettle

  useEffect(() => {
    const root = rootRef.current!
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ALL = buildCards()
    const heroes = ALL.filter((o) => o.hero)
    for (const o of ALL) {
      const e = document.createElement('div')
      e.className = 'csph-c csph-' + o.role
      e.style.width = o.w + 'px'; e.style.height = o.h + 'px'
      e.innerHTML = faceHTML(o)
      root.appendChild(e); o.el = e
    }

    let W = 0, H = 0, u = 1, F = 1, Ax = 1, Ay = 1
    const size = () => {
      const r = root.getBoundingClientRect(); W = r.width; H = r.height
      u = Math.min(W, H * 0.82) / 720; F = 502 * u
      // 0.82 (was 0.97) leaves a clear margin around the sphere so no card clips at any rotation.
      Ax = Math.max(1, (W / 2) / (F * 0.577) * 0.82); Ay = Math.max(1, (H / 2) / (F * 0.577) * 0.82)
    }
    size()
    const ro = new ResizeObserver(size); ro.observe(root)

    const FRONT = V(0, 0, 1)
    let rot = qbetween(heroes[0].p, FRONT)
    let wv = V(0, 0, 0)
    let drag: { x: number; y: number; moved: number } | null = null
    let snap: { from: Quat; to: Quat; t0: number; ms: number; hero: number } | null = null
    let hover: Card | null = null, lastInput = 0, settled = true

    const startSnap = (target?: Card | null) => {
      const sp = Math.hypot(wv.x, wv.y, wv.z)
      const ahead = sp > 0 ? qnorm(qmul(qaxis(wv, Math.min(2.4, sp * 0.3)), rot)) : rot
      let best = target || heroes[0], bz = -2
      if (!target) for (const h of heroes) { const z = qrot(ahead, h.p).z; if (z > bz) { bz = z; best = h } }
      const to = qnorm(qmul(qbetween(qrot(rot, best.p), FRONT), rot))
      const ang = 2 * Math.acos(clamp(Math.abs(rot[0] * to[0] + rot[1] * to[1] + rot[2] * to[2] + rot[3] * to[3]), 0, 1))
      snap = { from: rot, to, t0: performance.now(), ms: reduced ? 1 : 420 + ang * 260, hero: heroes.indexOf(best) }
      settled = false
    }

    const render = (dt: number) => {
      const now = performance.now()
      const cx = W / 2, cy = H / 2
      if (!drag && !snap) {
        const sp = Math.hypot(wv.x, wv.y, wv.z)
        if (sp > 0.02) { rot = qnorm(qmul(qaxis(wv, sp * dt), rot)); const k = Math.pow(0.88, dt * 30); wv = V(wv.x * k, wv.y * k, wv.z * k) }
        if (!settled && sp < 1.6 && now - lastInput > 60) startSnap()
        else if (settled && !reduced && now - lastInput > IDLE_DELAY) rot = qnorm(qmul(qaxis(IDLE_AXIS, IDLE_SPEED * dt), rot))
      }
      if (snap) {
        const t = clamp((now - snap.t0) / snap.ms)
        rot = qslerp(snap.from, snap.to, SETTLE(t))
        if (t >= 1) { const h = snap.hero; snap = null; wv = V(0, 0, 0); settled = true; cb.current?.(heroes[h].label) }
      }
      for (const o of ALL) {
        const e = o.el!
        const q = qrot(rot, o.p), d = P - q.z, s = 1 / d
        const sx = cx + q.x * F * s * Ax, sy = cy - q.y * F * s * Ay
        const k = clamp((q.z - 0.2) / 0.55)
        const hf = o.hero ? lerp(0.5, 1, k * k * (3 - 2 * k)) : 0.5 // heroes grow only near the front
        const sc = s * u * hf
        const ry = Math.atan2(q.x, Math.max(0.2, q.z)) * 57.3 * 0.35, rx = Math.atan2(q.y, Math.max(0.2, q.z)) * 57.3 * 0.35
        o.hv = lerp(o.hv ?? 1, o === hover && !reduced ? 1.05 : 1, 1 - Math.pow(0.001, dt))
        const ew = o.w * sc * o.hv, eh = o.h * sc * o.hv
        if (sx + ew < -40 || sx - ew > W + 40 || sy + eh < -40 || sy - eh > H + 40) { if (e.style.display !== 'none') e.style.display = 'none'; continue }
        if (e.style.display === 'none') e.style.display = ''
        e.style.transform = `translate(${sx}px,${sy}px) scale(${sc * o.hv}) perspective(${o.w * 2.6}px) rotateX(${rx}deg) rotateY(${ry}deg) rotate(${o.rz}deg) translate(${-o.w / 2}px,${-o.h / 2}px)`
        e.style.zIndex = String(Math.round((3 - d) * 1000))
        e.style.opacity = String(o.hero ? clamp((q.z + 0.9) / 0.3) : clamp((q.z + 0.8) / 0.35))
      }
    }

    const samples: [number, number, number][] = []
    const turn = (dx: number, dy: number) => {
      const ang = Math.hypot(dx / Ax, dy / Ay) / (F * 0.5)
      if (ang > 0) rot = qnorm(qmul(qaxis(V(dy / Ay, dx / Ax, 0), ang), rot))
    }
    const flick = (vx: number, vy: number) => { const k = 1 / (F * 0.5); wv = V((vy / Ay) * k, (vx / Ax) * k, 0) }
    const cardAt = (t: EventTarget | null) => {
      const el = (t as Element | null)?.closest?.('.csph-c') as HTMLElement | null
      return el ? ALL.find((o) => o.el === el) ?? null : null
    }

    const onDown = (e: PointerEvent) => {
      root.setPointerCapture(e.pointerId); drag = { x: e.clientX, y: e.clientY, moved: 0 }; snap = null; wv = V(0, 0, 0); settled = false
      samples.length = 0; root.classList.add('grabbing')
    }
    const onMove = (e: PointerEvent) => {
      if (!drag) { hover = cardAt(e.target); return }
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y
      drag.x = e.clientX; drag.y = e.clientY; drag.moved += Math.abs(dx) + Math.abs(dy)
      turn(dx, dy)
      const now = performance.now(); samples.push([now, dx, dy])
      while (samples.length && now - samples[0][0] > 90) samples.shift()
    }
    const onUp = (e: PointerEvent) => {
      if (!drag) return
      root.classList.remove('grabbing')
      const moved = drag.moved; drag = null; lastInput = performance.now()
      if (moved < 6) { const o = cardAt(e.target); startSnap(o && o.hero ? o : null); return } // click → bring it forward
      const span = samples.length > 1 ? Math.max(0.016, (samples[samples.length - 1][0] - samples[0][0]) / 1000) : 0.016
      flick(samples.reduce((a, sm) => a + sm[1], 0) / span, samples.reduce((a, sm) => a + sm[2], 0) / span)
    }
    const onLeave = () => { if (!drag) hover = null }
    const onKey = (e: KeyboardEvent) => {
      const m = ({ ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] } as Record<string, number[]>)[e.key]
      if (m) { e.preventDefault(); snap = null; settled = false; flick(-m[0] * 1500 * u, -m[1] * 1500 * u); lastInput = performance.now() }
    }
    root.addEventListener('pointerdown', onDown)
    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerup', onUp)
    root.addEventListener('pointercancel', onUp)
    root.addEventListener('pointerleave', onLeave)
    root.addEventListener('keydown', onKey)

    cb.current?.(heroes[0].label) // seed the caption

    let raf = 0, last = performance.now()
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min(0.05, (now - last) / 1000); last = now
      if (!document.hidden) render(dt)
    }
    render(0)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf); ro.disconnect()
      root.removeEventListener('pointerdown', onDown)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerup', onUp)
      root.removeEventListener('pointercancel', onUp)
      root.removeEventListener('pointerleave', onLeave)
      root.removeEventListener('keydown', onKey)
      ALL.forEach((o) => o.el?.remove())
    }
  }, [])

  return (
    <>
      <style>{CSS}</style>
      <div
        ref={rootRef}
        className={['csph', className].filter(Boolean).join(' ')}
        style={style}
        tabIndex={0}
        role="application"
        aria-label="A sphere of Finance OS design-system cards. Drag or use the arrow keys to turn it and bring a card to the front."
      />
    </>
  )
}
