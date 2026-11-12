/**
 * Type boundary for the vendored topographic survey-map algorithm (contour-map.js).
 * The implementation is a self-contained canvas module ported verbatim from the
 * Finovate audit map; it stays untyped JS. This declares its public API so the
 * React host (ContourField.tsx) type-checks against a real contract.
 */
export interface ContourColors {
  paper: string
  paper2: string
  ink: string
  contour: string
}

export interface ContourOpts {
  /** 'vignette' (hero) radial fade, or 'none' for CSS-masked edges. */
  fade?: 'vignette' | 'none'
  maxDpr?: number
}

export interface ContourHandle {
  setColors(c: Partial<ContourColors>): void
  resize(): void
  destroy(): void
}

/**
 * Mount the generated contour map (+ optional pointer loupe) onto the given canvases.
 * Pure canvas, progressive enhancement; call `destroy()` on unmount.
 */
export function createContourMap(
  canvas: HTMLCanvasElement,
  loupe: HTMLCanvasElement | null,
  host: HTMLElement,
  initial: ContourColors,
  seed?: number,
  opts?: ContourOpts,
): ContourHandle
