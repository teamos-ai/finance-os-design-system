'use client'

/**
 * AuroraBackground — Finance OS.
 *
 * Soft aurora light-columns drifting over the white canvas, for full-bleed section
 * and hero backdrops. Adapted from the shadcn/Aceternity "Aurora Background" to the
 * Finance OS system:
 *   · ONE light theme (no `dark:` variants), `bg-canvas` / `text-fg`.
 *   · BLUE-ONLY: colour stops come from the Atlas Blue ramp (blue tones) and the
 *     neutral ramp (grey tones) — no violet/indigo, no warm colour, no `invert`
 *     filter, so what renders is exactly the tokenised blue/grey.
 *   · `cn` from `@/lib/cn`; no `<main>` wrapper (the host owns page structure).
 * The 60s drift is wired via the `aurora` keyframes in tailwind.config.ts and is
 * frozen for `prefers-reduced-motion` by the global guard in index.css.
 */
import * as React from 'react'
import { cn } from '@/lib/cn'

export type AuroraTone = 'blue' | 'sky' | 'slate' | 'mist'

/** Five repeating colour stops per tone — all drawn from the Finance OS palette. */
const TONES: Record<AuroraTone, string> = {
  blue: '#5C6DA5 10%, #33488F 15%, #8591BC 20%, #ADB6D2 25%, #5C6DA5 30%',
  sky: '#ADB6D2 10%, #8591BC 15%, #ADB6D2 20%, #EEF2F9 25%, #ADB6D2 30%',
  slate: '#8B93A3 10%, #C9CDD6 15%, #8B93A3 20%, #F4F5F7 25%, #8B93A3 30%',
  mist: '#C9CDD6 10%, #EDEFF2 15%, #F6F7F9 20%, #F4F5F7 25%, #C9CDD6 30%',
}

export interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode
  /** Colour family: two blue (`blue`, `sky`) + two grey (`slate`, `mist`). */
  tone?: AuroraTone
  showRadialGradient?: boolean
}

export const AuroraBackground = ({
  className,
  children,
  tone = 'blue',
  showRadialGradient = true,
  style,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        'relative flex h-[100vh] flex-col items-center justify-center bg-canvas text-fg',
        className,
      )}
      style={
        {
          '--aurora': `repeating-linear-gradient(100deg, ${TONES[tone]})`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          aria-hidden
          className={cn(
            `pointer-events-none absolute -inset-[10px] opacity-60 blur-[10px] will-change-transform
             [--cols:repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)]
             [background-image:var(--cols),var(--aurora)]
             [background-size:300%,_200%]
             [background-position:50%_50%,50%_50%]
             after:absolute after:inset-0 after:content-['']
             after:[background-image:var(--cols),var(--aurora)]
             after:[background-size:200%,_100%]
             after:[background-position:50%_50%,50%_50%]
             after:mix-blend-multiply after:animate-aurora`,
            showRadialGradient &&
              '[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]',
          )}
        />
      </div>
      {children}
    </div>
  )
}
