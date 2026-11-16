/**
 * GoatScorecard — the five-criterion scorecard for one product, ported from financeos.au and tokenised
 * for the design system (DS type + 8px radius; amber lives inside GoatRating). Each row names what THIS
 * criterion's score means, not a generic label. Scores shown in the DS are clearly-labelled samples.
 */
import { GoatedBadge, GoatRating } from '@/components/scoring/GoatRating'
import { CRITERIA, GOATED_RULE, type GoatScore, type ScoreCard, isGoated, totalScore } from '@/data/scoring'
import { cn } from '@/lib/cn'

export function GoatScorecard({
  card,
  title = 'The scorecard',
  className,
}: {
  card: ScoreCard
  title?: string
  className?: string
}) {
  const total = totalScore(card)
  const goated = isGoated(card)
  const max = CRITERIA.length * 5

  return (
    <section className={cn('rounded-lg border border-border bg-surface p-5 md:p-6', className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
        <h3 className="font-display text-display-sm text-fg">{title}</h3>
        <p className="font-mono text-body-sm text-fg-muted">
          <span className="text-title-md font-bold tabular-nums text-fg">{total}</span>
          <span className="text-fg-subtle">/{max} goats</span>
        </p>
      </div>

      {goated ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <GoatedBadge />
          <p className="font-body text-body-sm leading-relaxed text-fg-muted">{GOATED_RULE}</p>
        </div>
      ) : null}

      <ul className="mt-6 divide-y divide-border border-t border-border">
        {CRITERIA.map((criterion) => {
          const score = card[criterion.id] as GoatScore
          return (
            <li key={criterion.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4">
              <div className="min-w-0 max-w-[46ch]">
                <h4 className="font-display text-title-sm text-fg">{criterion.name}</h4>
                <p className="mt-1 font-body text-body-sm leading-relaxed text-fg-muted">{criterion.levels[score]}</p>
              </div>
              <GoatRating score={score} size={44} showLabel />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
