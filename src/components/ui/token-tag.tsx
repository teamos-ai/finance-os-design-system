/**
 * TokenTag — the system's inline "what produces this" chip.
 *
 * The DS rule: every specimen names the token, utility class or prop a builder would type to
 * reproduce it — visible BY EYE (not hidden behind the "+" inspector) and readable BY AN AGENT.
 * TokenTag is how. It renders a small, quiet mono chip of that string, copies it on click, and
 * carries `data-token` so a crawler (or `scripts/token-coverage` / a Playwright sweep) can read
 * every specimen's token straight off the DOM.
 *
 *   <TokenTag>text-body-md</TokenTag>                       // a utility class
 *   <TokenTag>--c-accent</TokenTag>                         // a semantic token
 *   <TokenTag copy='variant="primary"'>variant="primary"</TokenTag>   // a component prop
 *
 * Drop it in a specimen's caption/label row, or pass it to a <Demo> `action` slot (it sits in the
 * grey header band). Place it BESIDE interactive specimens, never nested inside a <button>/<a>.
 * Token-only, 8px-max radius, reduced-motion safe (transition is colour/opacity only).
 */
import * as React from 'react'
import { Check, Copy } from 'lucide-react'
import { copyText } from '@/lib/utils'
import { cn } from '@/lib/cn'

export interface TokenTagProps {
  /** The visible token / utility-class / prop string, e.g. "text-body-md", "--c-accent". */
  children: string
  /** Value copied to the clipboard, if it differs from the visible text. */
  copy?: string
  /** Hover/title hint for what kind of token this is (e.g. "utility class", "semantic token"). */
  title?: string
  size?: 'sm' | 'md'
  className?: string
}

export function TokenTag({ children, copy, title, size = 'sm', className }: TokenTagProps) {
  const value = copy ?? children
  const [copied, setCopied] = React.useState(false)
  const fire = React.useCallback(async () => {
    if (await copyText(value)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }
  }, [value])

  return (
    <button
      type="button"
      onClick={fire}
      data-token={value}
      title={title ? `${title} · click to copy` : `Copy ${value}`}
      aria-label={`Copy token ${value}`}
      className={cn(
        'group/tt inline-flex max-w-full items-center gap-1.5 rounded-sm border border-border bg-inset font-mono text-fg-muted',
        'transition-colors duration-fast ease-out hover:border-border-strong hover:text-fg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
        size === 'sm' ? 'px-1.5 py-0.5 text-mono-2xs' : 'px-2 py-1 text-mono-xs',
        className,
      )}
    >
      <span className="truncate">{children}</span>
      {copied ? (
        <Check className="h-3 w-3 shrink-0 text-success" strokeWidth={2.5} aria-hidden />
      ) : (
        <Copy className="h-3 w-3 shrink-0 opacity-0 transition-opacity duration-fast group-hover/tt:opacity-60" strokeWidth={1.75} aria-hidden />
      )}
    </button>
  )
}
