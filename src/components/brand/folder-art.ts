/**
 * folder-art — the liquid back-panel artwork engine for the Folder object (pure, no React).
 *
 * A domain-warped noise field shaded as a liquid surface (`marble` folds the colours through each
 * other; `streak` pulls them into a long exposure), painted once into a canvas over a few frames and
 * shared between every folder that uses the same recipe. The engine is the one Tumai supplied to the
 * onestaaack tools app (teamos-ai/dictionary-finovate-v2 · GlassFolder); the recipes here are its
 * BLUE recipes — every colour is an Atlas Blue ramp value (#33488f = --p-blue-400, #5c6da5 = -300,
 * #1f2b56 = -500 …), so the texture is on-palette by construction. No gold, no second hue.
 *
 * It paints a STILL image (no idle motion) — calmer than the drifting clouds, and cheap at rest.
 * `paint()` is the entry point the Folder's canvas calls; it caches by recipe + seed + size.
 */

export type ArtPreset = 'atlas' | 'azure' | 'tide' | 'mist' | 'slate'

export type ArtRecipe = {
  /** `marble` folds the colours through each other; `streak` pulls them into a long exposure. */
  style: 'marble' | 'streak'
  /** Two or more colours, in the order they appear through the field. */
  colors: string[]
  /** Size of the forms. Lower is larger and calmer. */
  scale?: number
  /** How hard the field folds into itself. */
  warp?: number
  /** Direction of the flow, in radians. */
  angle?: number
  /** Specular highlight on the liquid surface, 0–1. */
  gloss?: number
  /** Dark veins along the folds, 0–1. */
  veins?: number
}

/**
 * The blue recipes, lifted from the onestaaack tools folders. Each ramp is Atlas Blue:
 * deep navy (--p-blue-500 / darker) → base (#33488f / --p-blue-400) → pale (--p-blue-50) → white.
 */
export const ART_PRESETS: Record<ArtPreset, ArtRecipe> = {
  // deep navy → Atlas Blue → white: the hero marble
  atlas: { style: 'marble', colors: ['#0f1830', '#1f2b56', '#33488f', '#5c6da5', '#8591bc', '#cdd6ea', '#f2f5fb'], scale: 0.66, warp: 3.0, angle: 0.6, gloss: 0.5, veins: 0.4 },
  // a brighter, lighter blue marble
  azure: { style: 'marble', colors: ['#141a33', '#28356a', '#4756a0', '#6f7fc0', '#aeb8de', '#dfe6f5', '#ffffff'], scale: 0.72, warp: 3.4, angle: 1.9, gloss: 0.48, veins: 0.4 },
  // blue striations pulled long (a streak / long-exposure)
  tide: { style: 'streak', colors: ['#eef2f9', '#adb6d2', '#5c6da5', '#33488f', '#1f2b56', '#5c6da5', '#eef2f9'], scale: 0.7, warp: 1.5, angle: -0.5, gloss: 0.22, veins: 0 },
  // a paler blue streak
  mist: { style: 'streak', colors: ['#f2f5fb', '#c3cde6', '#8591bc', '#4a5a9a', '#2a3a74', '#5c6da5', '#e9edf7'], scale: 0.68, warp: 1.7, angle: 0.3, gloss: 0.26, veins: 0 },
  // neutral blue-grey streak — a calm "before"/archival tone
  slate: { style: 'streak', colors: ['#edecec', '#d4d4d6', '#acadb1', '#83848a', '#5d5e63', '#9a9b9f', '#e8e8e9'], scale: 0.7, warp: 1.7, angle: -0.4, gloss: 0.12, veins: 0 },
}

export const recipeOf = (art: ArtPreset | ArtRecipe): ArtRecipe => (typeof art === 'string' ? ART_PRESETS[art] : art)

/** `#rgb` or `#rrggbb` to a triple. Anything unreadable comes back mid-grey. */
function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, '')
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  const n = /^[0-9a-f]{6}$/i.test(h) ? parseInt(h, 16) : 0x808080
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** A small, fast, seedable PRNG (mulberry32). */
function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** A stable small integer for a string, so a file's art follows its name. */
export function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

/** Seeded gradient noise, summed into fractal octaves with a rotation between each. */
function makeFbm(seed: number): (x: number, y: number, octaves: number) => number {
  const r = rng(seed)
  const perm = new Uint8Array(512)
  const grad = new Float32Array(512)
  const p: number[] = []
  for (let i = 0; i < 256; i++) p.push(i)
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    const t = p[i]
    p[i] = p[j]
    p[j] = t
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
  for (let i = 0; i < 256; i++) {
    const a = r() * Math.PI * 2
    grad[i * 2] = Math.cos(a)
    grad[i * 2 + 1] = Math.sin(a)
  }
  const noise = (x: number, y: number): number => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const xf = x - xi
    const yf = y - yi
    const X = xi & 255
    const Y = yi & 255
    const h00 = perm[X + perm[Y]] * 2
    const h10 = perm[X + 1 + perm[Y]] * 2
    const h01 = perm[X + perm[Y + 1]] * 2
    const h11 = perm[X + 1 + perm[Y + 1]] * 2
    const d00 = grad[h00] * xf + grad[h00 + 1] * yf
    const d10 = grad[h10] * (xf - 1) + grad[h10 + 1] * yf
    const d01 = grad[h01] * xf + grad[h01 + 1] * (yf - 1)
    const d11 = grad[h11] * (xf - 1) + grad[h11 + 1] * (yf - 1)
    const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10)
    const v = yf * yf * yf * (yf * (yf * 6 - 15) + 10)
    return d00 + u * (d10 - d00) + v * (d01 - d00 + u * (d11 - d01 - d10 + d00))
  }
  return (x, y, octaves) => {
    let sum = 0
    let amp = 0.5
    for (let i = 0; i < octaves; i++) {
      sum += amp * noise(x, y)
      const nx = 1.6 * x + 1.2 * y + 7.1
      y = -1.2 * x + 1.6 * y + 3.3
      x = nx
      amp *= 0.5
    }
    return sum
  }
}

export type ArtJob = {
  width: number
  height: number
  pixels: Uint8ClampedArray
  /** Paint up to `rows` more rows. Returns true once the picture is finished. */
  step: (rows: number) => boolean
}

/** The artwork, as a job that can be spread over several frames. */
export function createArtJob(width: number, height: number, recipe: ArtRecipe, seed: number): ArtJob {
  const w = Math.max(1, Math.round(width))
  const h = Math.max(1, Math.round(height))
  const colors = recipe.colors.length >= 2 ? recipe.colors : ['#1f2b56', '#f2f5fb']
  const stops = colors.map((c, i) => ({ t: i / (colors.length - 1), c: hexToRgb(c) }))
  const scale = recipe.scale ?? 0.7
  const warp = recipe.warp ?? 3
  const gloss = recipe.gloss ?? 0.4
  const veins = recipe.veins ?? 0
  const streak = recipe.style === 'streak'
  const fbm = makeFbm(seed * 977 + 13)
  const r = rng(seed + 1)
  const ox = r() * 50
  const oy = r() * 50
  const angle = (recipe.angle ?? 0) + (r() - 0.5) * 0.5
  const ca = Math.cos(angle)
  const sa = Math.sin(angle)
  const m = Math.min(w, h)
  const gw = Math.ceil(w / 2) + 3
  const gh = Math.ceil(h / 2) + 3
  const G = new Float32Array(gw * gh)
  const GQ = new Float32Array(gw * gh)
  const F = new Float32Array(w * h)
  const Q = new Float32Array(w * h)
  const pixels = new Uint8ClampedArray(w * h * 4)
  let row = 0

  const field = (gy: number) => {
    for (let gx = 0; gx < gw; gx++) {
      const u = ((gx - 1) * 2 - w / 2) / m
      const v = ((gy - 1) * 2 - h / 2) / m
      let px = (u * ca - v * sa) * scale
      let py = (u * sa + v * ca) * scale
      if (streak) {
        px *= 0.14
        py *= 2.2
      }
      px += ox
      py += oy
      const qx = fbm(px, py, 3)
      const qy = fbm(px + 5.2, py + 1.3, 3)
      const rx = fbm(px + warp * qx + 1.7, py + warp * qy + 9.2, 3)
      const ry = fbm(px + warp * qx + 8.3, py + warp * qy + 2.8, 3)
      G[gy * gw + gx] = fbm(px + warp * rx, py + warp * ry, 4)
      GQ[gy * gw + gx] = Math.sqrt(qx * qx + qy * qy)
    }
  }

  const upsample = () => {
    const cr = (a: number, b: number, c: number, d: number) => (-a + 9 * b + 9 * c - d) / 16
    const T = new Float32Array(w * gh)
    for (let gy = 0; gy < gh; gy++) {
      const rr = gy * gw
      for (let x = 0; x < w; x++) {
        const c = (x >> 1) + 1
        T[gy * w + x] = x & 1 ? cr(G[rr + c - 1], G[rr + c], G[rr + c + 1], G[rr + c + 2]) : G[rr + c]
      }
    }
    for (let y = 0; y < h; y++) {
      const c = (y >> 1) + 1
      for (let x = 0; x < w; x++) {
        F[y * w + x] = y & 1 ? cr(T[(c - 1) * w + x], T[c * w + x], T[(c + 1) * w + x], T[(c + 2) * w + x]) : T[c * w + x]
        const gx = (x >> 1) + 1
        const q0 = GQ[c * gw + gx]
        const qx = x & 1 ? (q0 + GQ[c * gw + gx + 1]) / 2 : q0
        const q1 = y & 1 ? (x & 1 ? (GQ[(c + 1) * gw + gx] + GQ[(c + 1) * gw + gx + 1]) / 2 : GQ[(c + 1) * gw + gx]) : qx
        Q[y * w + x] = (qx + q1) / 2
      }
    }
  }

  const colorize = () => {
    const sample: number[] = []
    const stride = Math.max(1, Math.floor(F.length / 4096))
    for (let i = 0; i < F.length; i += stride) sample.push(F[i])
    sample.sort((a, b) => a - b)
    const lo = sample[Math.floor(sample.length * 0.02)]
    const hi = sample[Math.floor(sample.length * 0.98)]
    const k = 1 / (hi - lo || 1)
    const lx = -0.55
    const ly = -0.65
    const lz = 0.52
    const slope = k * m * 0.012
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x
        let t = (F[i] - lo) * k
        t = t < 0 ? 0 : t > 1 ? 1 : t
        let j = 1
        while (j < stops.length - 1 && stops[j].t < t) j++
        const a = stops[j - 1]
        const b = stops[j]
        let f = (t - a.t) / (b.t - a.t || 1)
        f = f < 0 ? 0 : f > 1 ? 1 : f
        f = f * f * (3 - 2 * f)
        const gx = (F[x < w - 1 ? i + 1 : i] - F[x > 0 ? i - 1 : i]) * slope
        const gy = (F[y < h - 1 ? i + w : i] - F[y > 0 ? i - w : i]) * slope
        const nd = (-gx * lx - gy * ly + lz) / Math.sqrt(gx * gx + gy * gy + 1)
        const spec = Math.pow(nd > 0 ? nd : 0, 24) * gloss * 255
        const silk = 1 + 0.035 * Math.sin(t * 150 + Q[i] * 24)
        const vein = veins * Math.max(0, 1 - Math.abs(Q[i] - 0.42) * 14) * 0.6
        const lit = (0.82 + 0.28 * nd) * silk * (1 - vein)
        pixels[i * 4] = (a.c[0] + (b.c[0] - a.c[0]) * f) * lit + spec
        pixels[i * 4 + 1] = (a.c[1] + (b.c[1] - a.c[1]) * f) * lit + spec
        pixels[i * 4 + 2] = (a.c[2] + (b.c[2] - a.c[2]) * f) * lit + spec
        pixels[i * 4 + 3] = 255
      }
    }
  }

  const step = (rows: number): boolean => {
    if (row >= gh) return true
    const end = Math.min(gh, row + Math.max(1, rows))
    while (row < end) field(row++)
    if (row < gh) return false
    upsample()
    colorize()
    return true
  }

  return { width: w, height: h, pixels, step }
}

// One shared painter: every folder queues its art here and the queue spends a few ms a frame, so a
// row of folders never janks. The result is cached by recipe+seed+size and reused.
type Painted = HTMLCanvasElement
const artCache = new Map<string, Promise<Painted>>()
const queue: { job: ArtJob; priority: number; done: (c: Painted) => void }[] = []
let pumping = false

function pump() {
  if (pumping) return
  pumping = true
  const tick = () => {
    const until = performance.now() + 7
    while (queue.length && performance.now() < until) {
      const head = queue[0]
      if (head.job.step(4)) {
        queue.shift()
        const c = document.createElement('canvas')
        c.width = head.job.width
        c.height = head.job.height
        const cx = c.getContext('2d')
        if (cx) {
          const img = cx.createImageData(c.width, c.height)
          img.data.set(head.job.pixels)
          cx.putImageData(img, 0, 0)
        }
        head.done(c)
      }
    }
    if (queue.length) requestAnimationFrame(tick)
    else pumping = false
  }
  requestAnimationFrame(tick)
}

/** Lower priority paints first: back panels (0) before the files tucked behind the front (1). */
export function paint(recipe: ArtRecipe, seed: number, w: number, h: number, priority: number): Promise<Painted> {
  const key = JSON.stringify([recipe, seed, w, h])
  let p = artCache.get(key)
  if (!p) {
    p = new Promise<Painted>((done) => {
      let at = queue.length
      while (at > 1 && queue[at - 1].priority > priority) at--
      queue.splice(at, 0, { job: createArtJob(w, h, recipe, seed), priority, done })
      pump()
    })
    artCache.set(key, p)
  }
  return p
}
