/**
 * Icon — renders a Finance OS icon from the icon-system data (src/data/icons.ts).
 * Single `currentColor` fill, so the glyph inherits the brand colour from text colour.
 * Decorative by default (aria-hidden); pass a `title` for a labelled icon.
 */
import { ICONS } from '@/data/icons'
import { cn } from '@/lib/cn'

const MAP: Record<string, { body: string; viewBox: string }> = Object.fromEntries(
  ICONS.map((i) => [i.name, { body: i.body, viewBox: i.viewBox }]),
)

export interface IconProps {
  name: string
  size?: number
  title?: string
  className?: string
}

export function Icon({ name, size = 24, title, className }: IconProps) {
  const icon = MAP[name]
  if (!icon) return null
  return (
    <svg
      viewBox={icon.viewBox}
      width={size}
      height={size}
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={cn('inline-block shrink-0', className)}
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  )
}

/** Serialise an icon to a standalone SVG string (for copy / download). */
export function iconToSvg(name: string, color = 'currentColor'): string {
  const icon = MAP[name]
  if (!icon) return ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}" width="24" height="24" fill="${color}">${icon.body}</svg>`
}
