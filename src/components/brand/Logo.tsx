/**
 * Logo — the Finance OS "OS" gradient squircle monogram + wordmark.
 * The dark-mode gradient mark is the primary brand lockup (brand book p.12).
 */
import { cn } from '@/lib/cn'

type Size = 'sm' | 'md' | 'lg'

const MARK_SIZE: Record<Size, string> = {
  sm: 'h-8 w-8 text-[0.7rem]',
  md: 'h-10 w-10 text-title-sm',
  lg: 'h-12 w-12 text-title-md',
}
const WORD_SIZE: Record<Size, string> = {
  sm: 'text-title-sm',
  md: 'text-title-md',
  lg: 'text-title-lg',
}

export const LogoMark = ({ size = 'md', className }: { size?: Size; className?: string }) => (
  <span
    aria-hidden
    className={cn(
      'grid place-items-center rounded-lg bg-gradient-accent font-display font-bold text-accent-fg shadow-glow',
      MARK_SIZE[size],
      className,
    )}
  >
    OS
  </span>
)

export interface LogoProps {
  variant?: 'mark' | 'full' | 'wordmark'
  size?: Size
  className?: string
}

export const Logo = ({ variant = 'full', size = 'md', className }: LogoProps) => {
  const wordmark = (
    <span className={cn('font-display font-semibold tracking-tight text-fg', WORD_SIZE[size])}>
      Finance<span className="text-accent-text">OS</span>
    </span>
  )
  if (variant === 'mark') return <LogoMark size={size} className={className} />
  if (variant === 'wordmark') return <span className={className}>{wordmark}</span>
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={size} />
      {wordmark}
    </span>
  )
}
