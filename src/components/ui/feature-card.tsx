/**
 * FeatureCard — icon well + title + body. The workhorse of feature grids and bento
 * cells. Optional numbered overline for the "01 02 03" rhythm. Flat hairline, soft
 * hover lift (shadow + border strengthen), zero glass. Sentence-case copy, Finance voice.
 *
 * PHOTOGRAPHY (prop-driven): pass `image` (+ `imageAlt`) to turn the card into a
 * photo-topped tour/feature card — a photo (or graceful on-token wash placeholder)
 * sits on top with an optional overlay `badge`, then an optional `meta` row (typed
 * `{ icon?, label }[]`, e.g. a clock + "6–8 hours"), then the title + body and an
 * optional `actions` footer (the outline + solid pair). The icon well is hidden in
 * image mode (the photo carries the visual weight). With no `image` the card is
 * unchanged. All existing props (icon/title/description/accent/number/eyebrow) keep
 * working. The hover zoom is reduced-motion safe via the native `motion-reduce:`
 * variant inside CardMedia (no framer-motion).
 */
import type { LucideIcon } from 'lucide-react'
import { ACCENTS, type Accent } from '@/lib/accents'
import { MonoLabel } from '@/components/ui/mono-label'
import {
  CardMedia,
  MetaRow,
  ActionsRow,
  type CardMeta,
  type CardActions,
} from '@/components/ui/card'
import { cn } from '@/lib/cn'
import * as React from 'react'

const isMetaArray = (m: CardMeta): m is { icon?: LucideIcon; label: string }[] =>
  Array.isArray(m) && m.every((x) => x != null && typeof x === 'object' && 'label' in (x as object))

const isActionArray = (
  a: CardActions,
): a is { label: string; href?: string; onClick?: () => void }[] =>
  Array.isArray(a) && a.every((x) => x != null && typeof x === 'object' && 'label' in (x as object))

export interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  accent?: Accent
  number?: string
  eyebrow?: string
  /** photo src — when set the card becomes photo-topped (icon well hidden). */
  image?: string
  imageAlt?: string
  /** aspect ratio for the photo, e.g. '16/9' (default), '4/3', '1/1'. */
  ratio?: string
  /** node overlaid on the top-left of the image (typically a <Badge />). */
  badge?: React.ReactNode
  /** small meta row under the photo — typed `{ icon?, label }[]` or any node. */
  meta?: CardMeta
  /** footer actions — typed `{ label, href?, onClick?, variant? }[]` or any node. */
  actions?: CardActions
  /** gentle zoom-on-hover for the image. Default true. */
  zoom?: boolean
  className?: string
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  accent = 'amber',
  number,
  eyebrow,
  image,
  imageAlt,
  ratio,
  badge,
  meta,
  actions,
  zoom,
  className,
}: FeatureCardProps) => {
  const a = ACCENTS[accent]
  const hasImage = image !== undefined || badge !== undefined

  return (
    <div
      className={cn(
        'group flex h-full flex-col rounded-lg border border-border bg-surface',
        'transition-all duration-base ease-out hover:border-border-strong hover:shadow-md',
        hasImage ? 'overflow-hidden' : 'gap-4 p-6',
        className,
      )}
    >
      {hasImage ? (
        <CardMedia
          src={image}
          alt={imageAlt}
          ratio={ratio ?? '16/9'}
          accent={accent}
          placeholderIcon={Icon}
          badge={badge}
          zoom={zoom}
          className="rounded-none rounded-t-md border-0"
        />
      ) : (
        <span className={cn('flex h-12 w-12 items-center justify-center rounded-md', a.well)}>
          <Icon width={22} height={22} strokeWidth={1.5} aria-hidden />
        </span>
      )}

      <div className={cn('flex flex-1 flex-col gap-2', hasImage && 'p-6')}>
        {meta &&
          (isMetaArray(meta) ? (
            meta.length > 0 && <MetaRow items={meta} className="mb-1" />
          ) : (
            <div className="flex items-center gap-2 font-mono text-caption text-fg-subtle">{meta}</div>
          ))}
        {(number || eyebrow) && <MonoLabel number={number}>{eyebrow}</MonoLabel>}
        <h3 className="font-display text-title-lg text-fg">{title}</h3>
        <p className="font-body text-body-md leading-relaxed text-fg-muted">{description}</p>
        {actions &&
          (isActionArray(actions) ? (
            actions.length > 0 && <ActionsRow items={actions} className="mt-auto pt-5" />
          ) : (
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">{actions}</div>
          ))}
      </div>
    </div>
  )
}
