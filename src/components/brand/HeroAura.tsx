/**
 * HeroAura — soft, gently-drifting gradient hues in the FOUR corners of the hero
 * (efficient.app-style). The centre stays clear (the base canvas) so hero copy never
 * fights the colour. Hues are the brand primitives (amber · blue · gold) via color-mix.
 * Each bloom drifts on its own loop; honours prefers-reduced-motion (holds still).
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

const BLOOMS: Bloom[] = [
  { pos: { top: '-18%', left: '-12%' }, color: mix('var(--p-amber-300)', 55), dur: 15, x: [0, 26, -14, 0], y: [0, 18, -10, 0] },
  { pos: { top: '-14%', right: '-12%' }, color: mix('var(--p-blue-300)', 55), dur: 19, x: [0, -22, 12, 0], y: [0, 16, -12, 0] },
  { pos: { bottom: '-20%', left: '-10%' }, color: mix('var(--p-gold-300)', 50), dur: 17, x: [0, 20, -10, 0], y: [0, -16, 10, 0] },
  { pos: { bottom: '-16%', right: '-14%' }, color: mix('var(--p-blue-400)', 55), dur: 21, x: [0, -18, 14, 0], y: [0, -14, 12, 0] },
]

export function HeroAura({ className }: { className?: string }) {
  const reduced = useReducedMotion()
  const { theme } = useTheme()
  // Subtler on light grounds so the white centre stays calm; richer on true black.
  const intensity = theme === 'dark' ? 'opacity-90' : theme === 'paper' ? 'opacity-60' : 'opacity-50'

  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', intensity, className)}>
      {BLOOMS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute h-[48%] w-[48%] rounded-full blur-[90px]"
          style={{ ...b.pos, background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)` }}
          animate={reduced ? undefined : { x: b.x, y: b.y, scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
