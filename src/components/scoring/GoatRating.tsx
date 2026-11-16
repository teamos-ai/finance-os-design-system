/**
 * GoatRating — the Finance OS rating glyph: five voxel goats, one per score, whose expression IS the
 * score (a frown at one, star-eyes at five). Ported from the financeos.au scoring system (owner-supplied
 * artwork in `public/goats/`, see its README) and re-tokenised for the design system:
 *
 *   · GOLD → AMBER. The site grades a score in gold; this DS has no gold and reserves AMBER for exactly
 *     this — "star ratings" (see tokens.css). So the stars, the graded border ramp and the Goated badge
 *     all read in `--c-amber`. Amber here means one thing only: a score.
 *   · The numeral renders with the picture (`n/5`) — one goat cannot say "three" on its own.
 *   · Never below ~40px: the expression is the whole point.
 *
 * MOTION — a documented, scoped exception. Each goat reacts on HOVER in the mood of its score (two sways,
 * three nods, four bounces, five celebrates, one cries), keyed off `data-score`. These are hover-only
 * (never idle) expressive character animations on an illustrated asset — like the hero FloatWobble — and
 * they collapse to a still goat under `prefers-reduced-motion` (one still shows its tears, arrived not
 * run). The reactions are injected once as a scoped stylesheet so every goat inherits them.
 */
import * as React from 'react'
import { type GoatScore, tierFor } from '@/data/scoring'
import { cn } from '@/lib/cn'

const FACES: Record<GoatScore, string> = {
  1: '/goats/goat-1.png',
  2: '/goats/goat-2.png',
  3: '/goats/goat-3.png',
  4: '/goats/goat-4.png',
  5: '/goats/goat-5.png',
}
const CRYING = '/goats/goat-1-cry.png'

/** Native height of the cut assets. Widths vary by a few px per goat. */
const NATIVE = 256
const NATIVE_W = 233

let goatStylesInjected = false
function useGoatStyles() {
  React.useEffect(() => {
    if (goatStylesInjected || typeof document === 'undefined') return
    const el = document.createElement('style')
    el.setAttribute('data-fos-goats', '')
    el.textContent = GOAT_CSS
    document.head.appendChild(el)
    goatStylesInjected = true
  }, [])
}

/** Five stars, n filled — AMBER (the DS rating colour). Decorative; the score is in the alt + `n/5`. */
export function StarRow({ score, size = 13 }: { score: GoatScore; size?: number }) {
  return (
    <span aria-hidden="true" className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width={size} height={size} viewBox="0 0 24 24" className={n <= score ? 'text-amber' : 'text-border-strong'}>
          <path
            fill="currentColor"
            d="M12 2.6l2.7 5.9 6.4.7-4.8 4.4 1.3 6.3L12 16.7 6.4 19.9l1.3-6.3L2.9 9.2l6.4-.7z"
          />
        </svg>
      ))}
    </span>
  )
}

export function GoatRating({
  score,
  size = 48,
  showLabel = false,
  showCount = true,
  showStars = false,
  stacked = false,
  className,
}: {
  score: GoatScore
  /** Rendered height in px. Below ~40 the expressions stop reading. */
  size?: number
  /** Print the tier name — Exceptional, Strong, Capable… */
  showLabel?: boolean
  /** Print `n/5`. On by default; the picture alone does not state a number. */
  showCount?: boolean
  /** Add the five-star row. Decorative reinforcement, never the only signal. */
  showStars?: boolean
  /** Goat above, text below — for narrow columns and the criterion ladder. */
  stacked?: boolean
  className?: string
}) {
  useGoatStyles()
  const tier = tierFor(score)
  const w = Math.round((size * NATIVE_W) / NATIVE)

  const meta = (
    <span className={cn('inline-flex flex-col', stacked ? 'items-center' : 'items-start')}>
      <span className="inline-flex items-center gap-2">
        {showCount ? (
          <span className="font-mono text-body-sm font-semibold tabular-nums text-fg">
            {score}
            <span className="text-fg-subtle">/5</span>
          </span>
        ) : null}
        {showLabel ? <span className="font-mono text-mono-2xs uppercase tracking-[0.06em] text-fg-muted">{tier.label}</span> : null}
      </span>
      {showStars ? <StarRow score={score} /> : null}
    </span>
  )

  return (
    <span
      className={cn('goat-react inline-flex', stacked ? 'flex-col items-center gap-1.5 text-center' : 'items-center gap-2.5', className)}
      data-score={score}
    >
      <span className="relative inline-flex shrink-0">
        <img src={FACES[score]} alt={`${score} out of 5 — ${tier.label}`} width={w} height={size} className="shrink-0" draggable={false} />
        {score === 1 ? (
          <img src={CRYING} alt="" aria-hidden="true" width={w} height={size} className="goat-cry pointer-events-none absolute inset-0" draggable={false} />
        ) : null}
      </span>
      {showCount || showLabel || showStars ? meta : null}
    </span>
  )
}

/** The Goated badge — the five-goat, star-eyed, on amber. One fill-based rating emphasis per view. */
export function GoatedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn('goat-react inline-flex items-center gap-2 rounded-sm bg-amber py-1 pl-1.5 pr-2.5 font-mono text-mono-2xs uppercase tracking-[0.08em] text-fg', className)}
      data-score={5}
    >
      <img src={FACES[5]} alt="" width={26} height={28} aria-hidden="true" className="shrink-0" draggable={false} />
      Goated
    </span>
  )
}

/* Hover reactions, keyed off data-score (Tailwind compiles literals only, so this cannot be a utility).
   Hover-only, reduced-motion-safe — a scoped exception for the illustrated scoring assets. */
const GOAT_CSS = `
.goat-react img { will-change: transform; }
.goat-react[data-score="2"]:hover img { animation: goat-slump 1.6s var(--ease-in-out) infinite; }
@keyframes goat-slump { 0%,100% { transform: translateY(3px) rotate(-3deg); } 50% { transform: translateY(4px) rotate(2deg); } }
.goat-react[data-score="3"]:hover img { animation: goat-nod 1.1s var(--ease-in-out) infinite; }
@keyframes goat-nod { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
.goat-react[data-score="4"]:hover img { animation: goat-bounce 800ms var(--ease-out) infinite; }
@keyframes goat-bounce { 0%,100% { transform: translateY(0) scale(1); } 40% { transform: translateY(-7px) scale(1.04); } 70% { transform: translateY(-2px) scale(1.01); } }
.goat-react[data-score="5"]:hover img { animation: goat-celebrate 1s var(--ease-out) infinite; }
@keyframes goat-celebrate { 0%,100% { transform: translateY(0) rotate(0) scale(1); } 18% { transform: translateY(-11px) rotate(-7deg) scale(1.09); } 42% { transform: translateY(-3px) rotate(6deg) scale(1.04); } 64% { transform: translateY(-9px) rotate(-4deg) scale(1.07); } 85% { transform: translateY(-1px) rotate(2deg) scale(1.02); } }

/* One — no body motion; the tears ARE the reaction. goat-1-cry.png is goat-1.png with streams painted
   on, so a downward clip reveals only the water (identical pixels above the lens line). */
.goat-cry { clip-path: inset(0 0 53% 0); }
.goat-react[data-score="1"]:hover .goat-cry { animation: goat-cry-run 820ms var(--ease-out) forwards; }
@keyframes goat-cry-run { from { clip-path: inset(0 0 53% 0); } to { clip-path: inset(0 0 0 0); } }

/* The Goated trophy — a slow float + a breathing amber glow. One deliberate loop, on the top award. */
.trophy-float { animation: trophy-float 5s var(--ease-in-out) infinite; }
.trophy-glow { animation: trophy-glow 4s var(--ease-in-out) infinite; }
@keyframes trophy-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes trophy-glow { 0%,100% { opacity: .35; transform: scale(.92); } 50% { opacity: .7; transform: scale(1.06); } }

@media (prefers-reduced-motion: reduce) {
  .goat-react img, .trophy-float, .trophy-glow { animation: none !important; }
  /* one still cries on hover — it arrives rather than runs */
  .goat-react[data-score="1"]:hover .goat-cry { animation: none; clip-path: inset(0 0 0 0); }
}
`
