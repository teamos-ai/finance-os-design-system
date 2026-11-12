/**
 * ContourField — the React host for the vendored topographic survey map (./contour-map).
 * It paints a seeded contour field on a background <canvas>, tracks the pointer with a
 * magnifier <canvas> loupe, and renders its children on top. The algorithm is fed LIVE DS
 * token colours (canvas = paper, fg = ink, accent = contour lines) read from CSS vars, so the
 * map can never drift from the palette. A soft gradient fades the map into white at the fold.
 *
 * Reduced-motion is handled inside the algorithm: the map renders static and the loupe never
 * appears. Pure canvas + cleanup on unmount — no new dependencies.
 */
import * as React from 'react'
import { createContourMap } from './contour-map'
import { cn } from '@/lib/cn'

/** Resolve a CSS custom property to a #rrggbb hex via a probe element (resolves var() chains,
 *  so semantic tokens like --c-accent that point at a primitive still come back as hex for the
 *  canvas, which needs real colour values). Falls back to the token's literal on any failure. */
function readHex(prop: string, fallback: string): string {
  try {
    const probe = document.createElement('span')
    probe.style.color = `var(${prop})`
    probe.style.position = 'absolute'
    probe.style.opacity = '0'
    probe.style.pointerEvents = 'none'
    document.body.appendChild(probe)
    const rgb = getComputedStyle(probe).color
    document.body.removeChild(probe)
    const m = rgb.match(/\d+(?:\.\d+)?/g)
    if (!m || m.length < 3) return fallback
    const hex = m
      .slice(0, 3)
      .map((n) => Math.round(Number(n)).toString(16).padStart(2, '0'))
      .join('')
    return `#${hex}`
  } catch {
    return fallback
  }
}

export interface ContourFieldProps {
  className?: string
  /** noise seed for the generated field (default 7 — the brand hero's map) */
  seed?: number
  children?: React.ReactNode
}

export function ContourField({ className, seed = 7, children }: ContourFieldProps) {
  const hostRef = React.useRef<HTMLDivElement>(null)
  const mapRef = React.useRef<HTMLCanvasElement>(null)
  const loupeRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const host = hostRef.current
    const map = mapRef.current
    const loupe = loupeRef.current
    if (!host || !map || !loupe) return
    const handle = createContourMap(map, loupe, host, {
      paper: readHex('--c-canvas', '#FFFFFF'),
      paper2: readHex('--c-canvas', '#FFFFFF'),
      ink: readHex('--c-fg', '#14161B'),
      contour: readHex('--c-accent', '#33488F'),
    }, seed)
    return () => handle.destroy()
  }, [seed])

  return (
    <div ref={hostRef} className={cn('relative isolate overflow-hidden bg-canvas', className)}>
      {/* art layer — clipped; the map sits behind the loupe, both non-interactive */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <canvas ref={mapRef} className="absolute inset-0 h-full w-full" />
        <canvas ref={loupeRef} className="absolute left-0 top-0 will-change-transform" style={{ opacity: 0 }} />
      </div>

      {/* gentle fade into white at the fold — the contour dissolves toward the bottom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: '80%',
          zIndex: 1,
          background:
            'linear-gradient(to bottom, transparent 0%, transparent 14%, color-mix(in srgb, var(--c-canvas) 58%, transparent) 48%, var(--c-canvas) 78%, var(--c-canvas) 100%)',
        }}
      />

      {/* content, above the art + fade */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
