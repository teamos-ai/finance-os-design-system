/**
 * Logo — the real Finance OS brand marks (PNG assets in /public). Single Light theme:
 *   • mark      → the square "OS" monogram, BLUE (matches the Atlas-Blue accent).
 *   • full/rect → the FINANCE OS rectangle lockup, BLUE solid-plate on white.
 */
import { cn } from '@/lib/cn'

type Size = 'sm' | 'md' | 'lg'

const MARK: Record<Size, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
}
const RECT: Record<Size, string> = {
  sm: 'h-7',
  md: 'h-9',
  lg: 'h-12',
}

export const LogoMark = ({ size = 'md', className }: { size?: Size; className?: string }) => {
  const src = '/logo-square-blue.png'
  return (
    <img
      src={src}
      alt="Finance OS"
      width={48}
      height={48}
      className={cn('block shrink-0 object-contain', MARK[size], className)}
    />
  )
}

export interface LogoProps {
  variant?: 'mark' | 'full' | 'rect' | 'wordmark'
  size?: Size
  className?: string
}

export const Logo = ({ variant = 'full', size = 'md', className }: LogoProps) => {
  if (variant === 'mark') return <LogoMark size={size} className={className} />
  // Rectangle lockup — blue solid-plate on white.
  const src = '/logo-rect-blue.png'
  return (
    <img
      src={src}
      alt="Finance OS"
      className={cn('block w-auto shrink-0 object-contain', RECT[size], className)}
    />
  )
}
