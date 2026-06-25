/**
 * HeroAura — soft, gently-drifting gradient hues hugging the LEFT and RIGHT sides of
 * the hero (efficient.app-style). Two warm blooms bleed off the left edge, two cool
 * blooms off the right; the centre stays clear (the base canvas) so hero copy never
 * fights the colour. Hues are the brand primitives (amber · gold · blue) via color-mix.
 * Each bloom drifts on its own loop; honours prefers-reduced-motion (holds still).
 *
 * NOTE: the parent hero <section> MUST establish a stacking context (`isolate`), or the
 * -z-10 layer escapes and the ancestor `bg-canvas` paints right over these hues.
 */
import { motion, useReducedMotion } from 'framer-motion'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/cn'

const mix = (v: string, pct: number) => `color-mix(in srgb, ${v} ${pct}%, transparent)`

interface Bloom {
  pos: Record<string, string>
  color: string
  dur: number
  x: number[]
  y: number[]
}

// Warm hues hug the LEFT, cool hues hug the RIGHT — both bleed off-edge so colour sits
// on the sides and falls away toward the clean centre.
const BLOOMS: Bloom[] = [
  { pos: { top: '-16%', left: '-14%' },     color: mix('var(--p-amber-300)', 62), dur: 16, x: [0, 26, -12, 0], y: [0, 18, -10, 0] },
  { pos: { bottom: '-20%', left: '-12%' },  color: mix('var(--p-gold-300)', 56),  dur: 19, x: [0, 20, -10, 0], y: [0, -16, 10, 0] },
  { pos: { top: '-14%', right: '-14%' },    color: mix('var(--p-blue-300)', 60),  dur: 18, x: [0, -24, 12, 0], y: [0, 16, -12, 0] },
  { pos: { bottom: '-16%', right: '-12%' }, color: mix('var(--p-blue-400)', 56),  dur: 21, x: [0, -20, 14, 0], y: [0, -14, 12, 0] },
]

export function HeroAura({ className }: { className?: string }) {
  const reduced = useReducedMotion()
  const { theme } = useTheme()
  // Rich on true black; soft-but-present on ivory; calm + crisp on pure white.
  const intensity = theme === 'dark' ? 'opacity-100' : theme === 'paper' ? 'opacity-75' : 'opacity-60'

  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', intensity, className)}>
      {BLOOMS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute h-[58%] w-[48%] rounded-full blur-[100px]"
          style={{ ...b.pos, background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)` }}
          animate={reduced ? undefined : { x: b.x, y: b.y, scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
