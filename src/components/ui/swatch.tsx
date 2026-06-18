/**
 * Swatch — a click-to-copy colour chip. Shows the colour, a label, its HEX and its RGB,
 * and copies the hex (or any `copyValue`) to the clipboard on click with a brief
 * "Copied" confirmation. Flat hairline card, 8px squircle, gold focus ring. Reduced-motion
 * safe (no JS motion). The colours shown are the brand's fixed hexes, so they read the
 * same in every theme; the surrounding card flips with the theme.
 */
import * as React from 'react'
import { Check, Copy, Star } from 'lucide-react'
import { cn } from '@/lib/cn'

/** "#E85BA8" → "rgb(232, 91, 168)" (supports 3- or 6-digit hex). */
export function hexToRgb(hex: string): string {
  let h = hex.replace('#', '').trim()
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h, 16)
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`
}

/** Copy with a graceful fallback for non-secure / older contexts. */
export async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
    } catch {
      /* ignore */
    }
    document.body.removeChild(ta)
  }
}

function useCopied(timeout = 1300): { copied: boolean; fire: (value: string) => void } {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => window.clearTimeout(timer.current), [])
  const fire = React.useCallback(
    (value: string) => {
      copyText(value)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), timeout)
    },
    [timeout],
  )
  return { copied, fire }
}

export interface SwatchProps {
  hex: string
  /** step or name shown above the codes, e.g. "400" or "canvas" */
  label: string
  /** value copied on click — defaults to the upper-cased hex */
  copyValue?: string
  /** marks this as the main brand shade — adds a ring + a "★ Main" tag */
  primary?: boolean
  className?: string
}

export const Swatch = ({ hex, label, copyValue, primary, className }: SwatchProps) => {
  const { copied, fire } = useCopied()
  const HEX = hex.toUpperCase()
  const rgb = hexToRgb(hex)
  const value = copyValue ?? HEX

  return (
    <button
      type="button"
      onClick={() => fire(value)}
      title={primary ? `Main brand colour — copy ${value}` : `Copy ${value}`}
      aria-label={`${label}${primary ? ' (main brand colour)' : ''} — ${HEX}, ${rgb}. Click to copy ${value}.`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-md border bg-surface text-left',
        'transition-all duration-fast ease-out hover:shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
        primary
          ? 'border-border-strong shadow-sm ring-2 ring-ring ring-offset-2 ring-offset-canvas'
          : 'border-border hover:border-border-strong',
        className,
      )}
    >
      <span
        className="relative block h-14 w-full ring-1 ring-inset ring-black/[0.06]"
        style={{ background: hex }}
      >
        {primary && (
          <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-sm bg-surface/90 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-fg shadow-sm">
            <Star className="h-2.5 w-2.5 fill-current" strokeWidth={0} aria-hidden />
            Main
          </span>
        )}
        <span
          className={cn(
            'absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-sm bg-surface/90 shadow-sm',
            'opacity-0 transition-opacity duration-fast group-hover:opacity-100',
            copied ? 'text-success opacity-100' : 'text-fg-muted',
          )}
        >
          {copied ? <Check className="h-3.5 w-3.5" strokeWidth={2} /> : <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />}
        </span>
      </span>
      <span className="flex flex-col gap-0.5 px-2.5 py-2">
        <span className={cn('font-mono text-[11px] uppercase tracking-[0.1em]', primary ? 'text-fg' : 'text-fg-subtle')}>
          {label}
          {primary && ' · main'}
        </span>
        <span className="font-mono text-caption text-fg">{copied ? 'Copied ✓' : HEX}</span>
        <span className="font-mono text-[10px] leading-tight text-fg-subtle">{rgb}</span>
      </span>
    </button>
  )
}

export interface GradientSwatchProps {
  label: string
  /** the CSS value to display + copy, e.g. "linear-gradient(...)" */
  css: string
  className?: string
}

export const GradientSwatch = ({ label, css, className }: GradientSwatchProps) => {
  const { copied, fire } = useCopied()
  return (
    <button
      type="button"
      onClick={() => fire(css)}
      title={`Copy ${css}`}
      aria-label={`${label}. Click to copy the CSS gradient.`}
      className={cn('group block w-full text-left focus-visible:outline-none', className)}
    >
      <span
        className="relative block h-24 w-full overflow-hidden rounded-md border border-border ring-1 ring-inset ring-black/[0.06] transition-shadow duration-fast group-hover:shadow-sm group-focus-visible:ring-2 group-focus-visible:ring-ring"
        style={{ background: css }}
      >
        <span
          className={cn(
            'absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-sm bg-surface/90 shadow-sm',
            'opacity-0 transition-opacity duration-fast group-hover:opacity-100',
            copied ? 'text-success opacity-100' : 'text-fg-muted',
          )}
        >
          {copied ? <Check className="h-3.5 w-3.5" strokeWidth={2} /> : <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />}
        </span>
      </span>
      <span className="mt-2 block font-mono text-caption text-fg-muted">{copied ? 'Copied ✓' : label}</span>
    </button>
  )
}
