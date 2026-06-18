/**
 * ThemeToggle — 3-position Light / Paper / Dark radiogroup with a sliding thumb.
 * Paper sits in the middle — the warm in-between of clean white and true black.
 */
import { Moon, Sun, FileText } from 'lucide-react'
import { useTheme, type Theme } from '@/lib/theme'
import { cn } from '@/lib/cn'

const MODES: { theme: Theme; label: string; Icon: typeof Moon }[] = [
  { theme: 'light', label: 'Light', Icon: Sun },
  { theme: 'paper', label: 'Paper', Icon: FileText },
  { theme: 'dark', label: 'Dark', Icon: Moon },
]

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme()
  const idx = Math.max(0, MODES.findIndex((m) => m.theme === theme))
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={cn('relative inline-flex items-center rounded-sm border border-border bg-surface p-1', className)}
    >
      <span
        aria-hidden
        className="absolute left-1 top-1 h-8 w-8 rounded-sm bg-accent-soft transition-transform duration-base ease-out"
        style={{ transform: `translateX(${idx * 100}%)` }}
      />
      {MODES.map((m) => {
        const active = m.theme === theme
        return (
          <button
            key={m.theme}
            role="radio"
            aria-checked={active}
            aria-label={m.label}
            onClick={() => setTheme(m.theme)}
            className={cn(
              'relative z-10 grid h-8 w-8 place-items-center rounded-sm transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              active ? 'text-accent-text' : 'text-fg-subtle hover:text-fg',
            )}
          >
            <m.Icon className="h-4 w-4" strokeWidth={1.75} />
          </button>
        )
      })}
    </div>
  )
}
