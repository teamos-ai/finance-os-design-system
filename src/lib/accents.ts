/**
 * Accent recipes — the per-accent tonal indirection. Components (Card, FeatureCard,
 * ToolCard, MonoLabel…) never hand-write per-accent colour sets; they read ACCENTS[accent].
 * Every value is a SEMANTIC token class — zero rogue hex.
 *
 * The legacy gold accent has been retired; Momentum Amber is primary, Atlas Blue secondary.
 */
export type Accent = 'amber' | 'blue' | 'green' | 'neutral'
export const ACCENTS_LIST: Accent[] = ['amber', 'blue', 'green', 'neutral']

export interface AccentRecipe {
  /** soft tinted background well */
  well: string
  /** accent text colour (AA on canvas/surface) */
  text: string
  /** solid dot / marker */
  dot: string
  /** Badge variant name to use for this accent */
  badge: string
  /** diagonal wash for media placeholders */
  wash: string
  /** icon colour on the wash */
  washIcon: string
  /** focus / glow ring colour */
  ring: string
}

export const ACCENTS: Record<Accent, AccentRecipe> = {
  amber: {
    well: 'bg-amber-soft',
    text: 'text-amber-text',
    dot: 'bg-amber',
    badge: 'amber',
    wash: 'bg-gradient-to-br from-amber-soft to-transparent',
    washIcon: 'text-amber-text',
    ring: 'ring-amber',
  },
  blue: {
    well: 'bg-brand-soft',
    text: 'text-brand',
    dot: 'bg-brand',
    badge: 'blue',
    wash: 'bg-gradient-to-br from-brand-soft to-transparent',
    washIcon: 'text-brand',
    ring: 'ring-brand',
  },
  green: {
    well: 'bg-success-soft',
    text: 'text-success',
    dot: 'bg-success',
    badge: 'success',
    wash: 'bg-gradient-to-br from-success-soft to-transparent',
    washIcon: 'text-success',
    ring: 'ring-success',
  },
  neutral: {
    well: 'bg-elevated',
    text: 'text-fg-muted',
    dot: 'bg-fg-subtle',
    badge: 'neutral',
    wash: 'bg-gradient-to-br from-elevated to-transparent',
    washIcon: 'text-fg-subtle',
    ring: 'ring-border',
  },
}
