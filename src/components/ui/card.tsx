/**
 * Card — flat hairline surface. 1px border, soft neutral shadow on hover only.
 * Zero glass. `interactive` adds the hover lift + border darken.
 *
 * Compose with CardHeader / CardTitle / CardDescription / CardContent / CardFooter,
 * or drop children in. Opt-in PHOTOGRAPHY: pass `image` (+ `imageAlt`) for a photo with
 * `mediaPosition="top"` (default) or `"side"`; an optional pill `badge` overlays it, a
 * typed `meta` row sits under it, and an `actions` footer renders an outline+solid pair.
 * Without a photo the media tile shows a graceful on-token wash placeholder. Every CVA
 * prop (tone/radius/padding/interactive) is preserved; a card with no media prop renders
 * exactly as before. Token-only — zero rogue hex. 8px radius ceiling.
 */
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react'
import { ACCENTS, type Accent } from '@/lib/accents'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/cn'

const card = cva('relative border transition-all duration-base ease-out', {
  variants: {
    tone: {
      surface: 'bg-surface border-border',
      elevated: 'bg-elevated border-border',
      soft: 'bg-elevated border-border-subtle',
    },
    radius: { md: 'rounded-md', lg: 'rounded-lg' },
    padding: { none: 'p-0', sm: 'p-4', md: 'p-6', lg: 'p-8' },
    interactive: { true: 'hover:border-border-strong hover:shadow-md', false: '' },
  },
  defaultVariants: { tone: 'surface', radius: 'lg', padding: 'md', interactive: false },
})

/** One item in the meta row — a small mono caption, optionally led by an icon. */
export interface MetaItem {
  icon?: LucideIcon
  label: string
}

/** One footer action. The LAST action defaults to the solid primary, the rest outline. */
export interface ActionItem {
  label: string
  href?: string
  onClick?: () => void
  variant?: ButtonProps['variant']
}

export type CardMeta = MetaItem[] | React.ReactNode
export type CardActions = ActionItem[] | React.ReactNode

const isMetaArray = (m: CardMeta): m is MetaItem[] =>
  Array.isArray(m) && m.every((x) => x != null && typeof x === 'object' && 'label' in (x as object))
const isActionArray = (a: CardActions): a is ActionItem[] =>
  Array.isArray(a) && a.every((x) => x != null && typeof x === 'object' && 'label' in (x as object))

/** The clock-icon + "6–8 hours" row. Mono caption, subtle ink, hairline icons. */
const MetaRow = ({ items, className }: { items: MetaItem[]; className?: string }) => (
  <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5', className)}>
    {items.map((m, i) => (
      <span key={i} className="inline-flex items-center gap-1.5 font-mono text-caption text-fg-subtle">
        {m.icon && <m.icon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />}
        {m.label}
      </span>
    ))}
  </div>
)

/** The outline + solid footer. Last action solid (primary), the rest secondary. */
const ActionsRow = ({ items, className }: { items: ActionItem[]; className?: string }) => (
  <div className={cn('flex flex-wrap items-center gap-3', className)}>
    {items.map((a, i) => (
      <Button
        key={i}
        size="sm"
        variant={a.variant ?? (i === items.length - 1 ? 'primary' : 'secondary')}
        onClick={a.onClick}
        {...(a.href ? { as: 'a' as const, href: a.href } : {})}
      >
        {a.label}
      </Button>
    ))}
  </div>
)

export interface CardMediaProps {
  src?: string
  alt?: string
  ratio?: string
  accent?: Accent
  placeholderIcon?: LucideIcon
  badge?: React.ReactNode
  badgeAlign?: 'start' | 'end'
  zoom?: boolean
  fill?: boolean
  className?: string
  imgClassName?: string
}

export const CardMedia = ({
  src,
  alt = '',
  ratio = '16/9',
  accent = 'gold',
  placeholderIcon: Icon,
  badge,
  badgeAlign = 'start',
  zoom = true,
  fill = false,
  className,
  imgClassName,
}: CardMediaProps) => {
  const a = ACCENTS[accent]
  return (
    <div
      className={cn('relative overflow-hidden rounded-md border border-border bg-elevated', fill ? 'h-full w-full' : 'w-full', className)}
      style={fill ? undefined : { aspectRatio: ratio }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={cn(
            'h-full w-full object-cover',
            zoom &&
              'transition-transform duration-slow ease-out group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none',
            imgClassName,
          )}
        />
      ) : (
        <div aria-hidden className={cn('relative flex h-full w-full items-center justify-center', a.wash)}>
          {Icon && <Icon className={cn('h-9 w-9', a.washIcon)} strokeWidth={1.5} />}
        </div>
      )}
      {badge && (
        <div className={cn('absolute top-3 z-10', badgeAlign === 'end' ? 'right-3' : 'left-3')}>{badge}</div>
      )}
    </div>
  )
}
CardMedia.displayName = 'CardMedia'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof card> {
  as?: React.ElementType
  image?: string
  imageAlt?: string
  ratio?: string
  mediaPosition?: 'top' | 'side'
  badge?: React.ReactNode
  badgeAlign?: 'start' | 'end'
  meta?: CardMeta
  actions?: CardActions
  accent?: Accent
  placeholderIcon?: LucideIcon
  zoom?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      tone,
      radius,
      padding,
      interactive,
      as: Comp = 'div',
      image,
      imageAlt,
      ratio,
      mediaPosition = 'top',
      badge,
      badgeAlign,
      meta,
      actions,
      accent = 'gold',
      placeholderIcon,
      zoom,
      children,
      ...props
    },
    ref,
  ) => {
    const hasMedia = image !== undefined || badge !== undefined || meta !== undefined || actions !== undefined

    if (!hasMedia) {
      return (
        <Comp ref={ref} className={cn(card({ tone, radius, padding, interactive }), className)} {...props}>
          {children}
        </Comp>
      )
    }

    const side = mediaPosition === 'side'
    const pad = padding ?? 'md'

    const media = (
      <CardMedia
        src={image}
        alt={imageAlt}
        ratio={ratio ?? (side ? '1/1' : '16/9')}
        accent={accent}
        placeholderIcon={placeholderIcon}
        badge={badge}
        badgeAlign={badgeAlign}
        zoom={zoom}
        fill={side}
        className={cn('rounded-none border-0', side ? 'sm:rounded-l-md' : 'rounded-t-md')}
      />
    )

    const content = (
      <div className={cn('flex flex-1 flex-col', card({ padding: pad }))}>
        {meta &&
          (isMetaArray(meta) ? (
            meta.length > 0 && <MetaRow items={meta} className="mb-3" />
          ) : (
            <div className="mb-3 flex items-center gap-2 font-mono text-caption text-fg-subtle">{meta}</div>
          ))}
        {children}
        {actions &&
          (isActionArray(actions) ? (
            actions.length > 0 && <ActionsRow items={actions} className="mt-5" />
          ) : (
            <div className="mt-5 flex flex-wrap items-center gap-3">{actions}</div>
          ))}
      </div>
    )

    return (
      <Comp
        ref={ref}
        className={cn(
          'group',
          card({ tone, radius, padding: 'none', interactive }),
          'overflow-hidden',
          side ? 'flex flex-col sm:flex-row' : 'flex flex-col',
          className,
        )}
        {...props}
      >
        {side ? <div className="w-full shrink-0 sm:w-2/5">{media}</div> : media}
        {content}
      </Comp>
    )
  },
)
Card.displayName = 'Card'

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-4 flex flex-col gap-1.5', className)} {...props} />
)
export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('font-display text-title-lg text-fg', className)} {...props} />
)
export const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('font-body text-body-sm leading-relaxed text-fg-subtle', className)} {...props} />
)
export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('font-body text-body-md text-fg-muted', className)} {...props} />
)
export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-5 flex items-center gap-3', className)} {...props} />
)

export { MetaRow, ActionsRow }

export interface BadgeShorthand {
  label: string
  variant?: BadgeProps['variant']
  emoji?: string
}
export const renderBadge = (badge: BadgeShorthand | React.ReactNode): React.ReactNode => {
  if (badge != null && typeof badge === 'object' && !React.isValidElement(badge) && 'label' in (badge as object)) {
    const b = badge as BadgeShorthand
    return (
      <Badge variant={b.variant ?? 'gold'} size="sm" emoji={b.emoji}>
        {b.label}
      </Badge>
    )
  }
  return badge as React.ReactNode
}
