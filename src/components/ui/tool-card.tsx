/**
 * ToolCard — a single "thing Finance OS replaces" card for the horizontal carousel
 * (app-card craft). Coloured icon tile + tool name + meta line + a small accent badge.
 * Rounded hairline, soft hover lift, zero glass — reskinned to Finance OS dark-luxury tokens.
 */
import type { LucideIcon } from 'lucide-react'
import { ACCENTS, type Accent } from '@/lib/accents'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/cn'

export interface ToolCardProps {
  name: string
  meta: string
  icon: LucideIcon
  accent?: Accent
  badge?: string
  className?: string
}

export const ToolCard = ({ name, meta, icon: Icon, accent = 'amber', badge = 'Replaces', className }: ToolCardProps) => {
  const a = ACCENTS[accent]
  return (
    <article
      className={cn(
        'flex w-72 shrink-0 flex-col gap-4 rounded-lg border border-border bg-surface p-5',
        'transition-all duration-base ease-out hover:border-border-strong hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <span className={cn('flex h-12 w-12 items-center justify-center rounded-md', a.well)}>
          <Icon width={22} height={22} strokeWidth={1.5} aria-hidden />
        </span>
        <Badge variant={a.badge as never} size="sm">
          {badge}
        </Badge>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-title-lg text-fg">{name}</h3>
        <p className="font-mono text-body-sm text-fg-muted">{meta}</p>
      </div>
    </article>
  )
}
