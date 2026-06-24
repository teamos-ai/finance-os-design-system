/**
 * Logo — the real Finance OS brand marks (PNG assets in /public). Theme-aware:
 *   • mark      → the square "OS" monogram. Amber on dark/paper, BLUE in light mode
 *     (matches the light-mode accent). Used across the chrome + favicon.
 *   • full/rect → the FINANCE OS rectangle lockup: white-outline on dark, BLUE solid-plate
 *     in light, amber gradient-plate on paper.
 */
import { useTheme } from '@/lib/theme'
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
  const { theme } = useTheme()
  const src = theme === 'light' ? '/logo-square-blue.png' : '/logo-square.png'
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
  const { theme } = useTheme()
  if (variant === 'mark') return <LogoMark size={size} className={className} />
  // Rectangle lockup — white-outline reads on dark, blue solid-plate in light, amber plate on paper.
  const src =
    theme === 'dark' ? '/logo-rect-white.png' : theme === 'light' ? '/logo-rect-blue.png' : '/logo-rect.png'
  return (
    <img
      src={src}
      alt="Finance OS"
      className={cn('block w-auto shrink-0 object-contain', RECT[size], className)}
    />
  )
}
