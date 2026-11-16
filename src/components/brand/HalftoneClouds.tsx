/**
 * HalftoneClouds — the Finance OS signature texture as a live canvas: a slow-drifting cloud field
 * drawn as an Atlas Blue halftone screen. Colours are read from the design tokens at runtime
 * (`--p-blue-400`, `--p-blue-300`, `--c-canvas`), so the texture can never go off-palette.
 *
 * Calm by construction: it drifts and does nothing else. It pauses when off-screen, caps at
 * ~24fps, and renders a single still frame under `prefers-reduced-motion`.
 * `reveal` runs the "cloud dissolve" (dots bloom in) once, the first time it scrolls into view;
 * change `replayKey` to run it again.
 *
 * Rules: one field per view · type never sits on dense dots (use a white card on `sky`; let
 * `paper` fade out before the headline) · blue and white only.
 */
import * as React from 'react'
import { useReducedMotion } from 'framer-motion'
import { drawHalftoneClouds, type CloudShape, type CloudTone } from '@/lib/halftone'
import { cn } from '@/lib/cn'

export interface HalftoneCloudsProps {
  tone?: CloudTone
  shape?: CloudShape
  /** dot pitch in px (6–8 fine · 9–12 standard · 14+ poster) */
  cell?: number
  /** drift speed (0.02 still-ish · 0.05 gentle · never above 0.08) */
  speed?: number
  seed?: number
  /** 'paper' only — 0..1 of the height where the ink has fully dissolved */
  fade?: number
  /** run the cloud dissolve on first view */
  reveal?: boolean
  /** change to replay the dissolve */
  replayKey?: number
  className?: string
}

const REVEAL_MS = 1600
const FRAME_MS = 1000 / 24

export function HalftoneClouds({
  tone = 'sky',
  shape = 'dot',
  cell = 9,
  speed = 0.05,
  seed = 7,
  fade,
  reveal = false,
  replayKey = 0,
  className,
}: HalftoneCloudsProps) {
  const reduced = useReducedMotion()
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const css = getComputedStyle(document.documentElement)
    const token = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback
    const blue = token('--p-blue-400', '#33488F')
    const blueLight = token('--p-blue-300', '#5C6DA5')
    const white = token('--c-canvas', '#FFFFFF')
    const colors =
      tone === 'paper' ? { ground0: white, ground1: white, ink: blue } : { ground0: blue, ground1: blueLight, ink: white }

    let w = 0
    let h = 0
    let raf = 0
    let visible = false
    let last = 0
    let time = 0
    let revealStart: number | null = null
    let revealed = !reveal || !!reduced

    const paint = (now: number) => {
      let r = 1
      if (!revealed && !visible) {
        r = 0 // hold the dissolve until the field is actually on screen
      } else if (!revealed) {
        if (revealStart == null) revealStart = now
        const t = Math.min(1, (now - revealStart) / REVEAL_MS)
        // ease-in-out, matching --ease-in-out
        r = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        if (t >= 1) revealed = true
      }
      drawHalftoneClouds(ctx, w, h, time, { tone, shape, cell, speed, seed, fade, reveal: r, colors })
    }

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      w = Math.max(1, Math.round(rect.width))
      h = Math.max(1, Math.round(rect.height))
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      paint(performance.now())
    }

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (now - last < FRAME_MS) return
      time += Math.min(0.1, (now - last) / 1000)
      last = now
      paint(now)
    }
    const start = () => {
      if (raf || reduced) return
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(wrap)
    resize()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
    }
  }, [tone, shape, cell, speed, seed, fade, reveal, replayKey, reduced])

  return (
    <div ref={wrapRef} aria-hidden className={cn('relative overflow-hidden', className)}>
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  )
}
