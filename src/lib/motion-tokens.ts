/**
 * Motion tokens — the Finance OS motion vocabulary as constants for Framer Motion.
 * These mirror the CSS custom properties in `styles/tokens.css` (`--dur-*`, `--ease-*`, `--rise-*`,
 * `--stagger-*`) and the GSAP presets in the `motion-finance` skill, so the browser and the
 * rendered video move with the same numbers. Eases are chosen by ROLE, never by taste.
 */
type Bezier = [number, number, number, number]

export const MOTION = {
  /** seconds */
  dur: { fast: 0.15, base: 0.25, slow: 0.4, slower: 0.6, draw: 1.2 },
  ease: {
    /** arrivals */
    out: [0.22, 1, 0.36, 1] as Bezier,
    /** exits — quicker than the entrance */
    in: [0.55, 0, 1, 0.45] as Bezier,
    /** moves, layout, draw-on */
    inOut: [0.65, 0, 0.35, 1] as Bezier,
    /** the one sanctioned overshoot: ticks, seals, state flips */
    confirm: [0.34, 1.56, 0.64, 1] as Bezier,
  },
  /** px of entrance travel */
  rise: { sm: 8, md: 12, lg: 24 },
  /** seconds between siblings; cap the total at 0.5s */
  stagger: { tight: 0.04, base: 0.07, words: 0.08 },
  /** in-view trigger: a margin (not a visible fraction) so tall blocks on phones still reveal */
  viewport: { once: true, margin: '0px 0px -8% 0px' },
} as const

export const cssBezier = (b: Bezier) => `cubic-bezier(${b.join(', ')})`
