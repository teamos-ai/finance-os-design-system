/**
 * halftone.ts — the Finance OS signature texture: a procedural cloud field drawn as a halftone
 * dot screen. Deterministic (a pure function of time + options): the same algorithm ships in the
 * `motion-finance` skill as `fos-clouds.js`, so the web canvas and rendered video match exactly.
 */
export type CloudTone = 'sky' | 'paper'
export type CloudShape = 'dot' | 'pixel'

export interface CloudOptions {
  /** 'sky' = blue ground, white clouds · 'paper' = white ground, blue sky that dissolves downward */
  tone?: CloudTone
  shape?: CloudShape
  /** dot pitch in px */
  cell?: number
  /** drift, noise-units per second (0.02 still-ish · 0.05 gentle) */
  speed?: number
  /** 0..1 — the cloud dissolve: dots bloom in as it runs 0 → 1 */
  reveal?: number
  seed?: number
  /** 'paper' only: 0..1 of the height at which the ink has fully dissolved */
  fade?: number
  colors: { ground0: string; ground1: string; ink: string }
}

const hash = (x: number, y: number, seed: number) => {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 1442695041)) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}
const vnoise = (x: number, y: number, seed: number) => {
  const xi = Math.floor(x), yi = Math.floor(y)
  const xf = x - xi, yf = y - yi
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf)
  const a = hash(xi, yi, seed), b = hash(xi + 1, yi, seed)
  const c = hash(xi, yi + 1, seed), d = hash(xi + 1, yi + 1, seed)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}
const fbm = (x: number, y: number, seed: number) => {
  let s = 0, a = 0.5, f = 1
  for (let i = 0; i < 4; i++) {
    s += a * vnoise(x * f, y * f, seed + i * 17)
    f *= 2.02
    a *= 0.5
  }
  return s / 0.9375
}
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const density = (nx: number, ny: number, aspect: number, t: number, speed: number, seed: number) => {
  const n = fbm(nx * 2.1 * aspect - t * speed, ny * 3.1, seed)
  const m = fbm(nx * 1.1 * aspect - t * speed * 0.6 + 40, ny * 1.7 + 9, seed + 101)
  return smooth(0.44, 0.74, n * 0.72 + m * 0.34)
}

export function drawHalftoneClouds(ctx: CanvasRenderingContext2D, w: number, h: number, time: number, o: CloudOptions) {
  const tone = o.tone ?? 'sky'
  const shape = o.shape ?? 'dot'
  const cell = Math.max(3, o.cell ?? 9)
  const speed = o.speed ?? 0.02
  const reveal = o.reveal ?? 1
  const seed = o.seed ?? 7
  const fade = o.fade ?? 0.72
  const aspect = w / h
  const paper = tone === 'paper'

  if (o.colors.ground0 === o.colors.ground1) {
    ctx.fillStyle = o.colors.ground0
  } else {
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, o.colors.ground0)
    g.addColorStop(1, o.colors.ground1)
    ctx.fillStyle = g
  }
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = o.colors.ink
  ctx.beginPath()
  const cols = Math.ceil(w / cell) + 1, rows = Math.ceil(h / cell) + 1
  const half = cell / 2
  for (let j = 0; j < rows; j++) {
    const off = shape === 'dot' && j % 2 ? half : 0
    for (let i = 0; i < cols; i++) {
      const cx = i * cell + off, cy = j * cell
      const nx = cx / w, ny = cy / h
      const d = density(nx, ny, aspect, time, speed, seed)
      let a = paper ? (1 - d) * 0.6 * (1 - smooth(0.08, fade, ny)) : 0.035 + d * 0.9
      if (reveal < 1) {
        const th = hash(i, j, seed + 999) * 0.7 + nx * 0.3
        a *= smooth(th - 0.12, th + 0.12, reveal * 1.24 - 0.12)
      }
      if (a <= 0.02) continue
      const r = half * Math.sqrt(a) * 0.98
      if (shape === 'pixel') {
        const s = Math.round(r * 2 * 0.9)
        if (s > 0) ctx.rect(Math.round(cx - s / 2), Math.round(cy - s / 2), s, s)
      } else {
        ctx.moveTo(cx + r, cy)
        ctx.arc(cx, cy, r, 0, 6.2832)
      }
    }
  }
  ctx.fill()
}
