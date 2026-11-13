/**
 * QuizRunner — a reusable, no-backend quiz: single-choice questions that tally toward a set of
 * stages and reveal a result in the browser (no email, nothing submitted). Option i of each
 * question scores stage i; the stage with the most answers wins, and every stage's score is shown.
 * Token-only, keyboard-accessible, reduced-motion safe. Seed it with any question/stage set.
 */
import * as React from 'react'
import { RotateCcw, Check } from 'lucide-react'
import { FadeIn } from '@/lib/motion'
import { cn } from '@/lib/cn'

export interface QuizQuestion {
  prompt: string
  /** options[i] scores stage i — keep the count equal to `stages.length` */
  options: string[]
}
export interface QuizStage {
  name: string
  blurb: string
}

export function QuizRunner({ questions, stages }: { questions: QuizQuestion[]; stages: QuizStage[] }) {
  const [answers, setAnswers] = React.useState<(number | null)[]>(() => questions.map(() => null))
  const answered = answers.filter((a) => a !== null).length
  const complete = answered === questions.length

  const tally = stages.map((_, s) => answers.filter((a) => a === s).length)
  const max = Math.max(1, ...tally)
  const winner = complete ? tally.indexOf(Math.max(...tally)) : -1

  const select = (qi: number, oi: number) =>
    setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)))
  const reset = () => setAnswers(questions.map(() => null))

  return (
    <div className="flex flex-col gap-5">
      {/* progress */}
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-mono-xs uppercase tracking-[0.12em] text-fg-subtle">
          {answered} of {questions.length} answered
        </span>
        {answered > 0 && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-mono-xs text-fg-subtle transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            Reset
          </button>
        )}
      </div>

      {/* questions */}
      <ol className="flex flex-col gap-6">
        {questions.map((q, qi) => (
          <li key={q.prompt}>
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-1 flex gap-2.5 font-display text-title-sm text-fg">
                <span className="font-mono text-mono-xs tabular-nums text-accent-text">{String(qi + 1).padStart(2, '0')}</span>
                <span>{q.prompt}</span>
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {q.options.map((opt, oi) => {
                  const on = answers[qi] === oi
                  return (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={on}
                      onClick={() => select(qi, oi)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-md border px-3.5 py-2.5 text-left font-body text-body-sm transition-colors duration-fast ease-out',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        on
                          ? 'border-accent bg-accent-soft text-accent-text'
                          : 'border-border text-fg-muted hover:border-border-strong hover:text-fg',
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'grid h-4 w-4 shrink-0 place-items-center rounded-xs border',
                          on ? 'border-accent bg-accent text-accent-fg' : 'border-border-strong',
                        )}
                      >
                        {on && <Check className="h-3 w-3" strokeWidth={3} />}
                      </span>
                      {opt}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>

      {/* result */}
      {complete && (
        <FadeIn>
          <div className="flex flex-col gap-4 rounded-lg border border-border-strong bg-accent-soft p-5">
            <div>
              <p className="font-mono text-caption uppercase tracking-[0.12em] text-accent-text">Your stage</p>
              <p className="font-display text-title-lg text-fg">{stages[winner].name}</p>
              <p className="mt-1 font-body text-body-sm leading-relaxed text-fg-muted">{stages[winner].blurb}</p>
            </div>
            <div className="flex flex-col gap-2 border-t border-border-strong/40 pt-3.5">
              <span className="font-mono text-mono-2xs uppercase tracking-wider text-fg-subtle">Every stage’s score</span>
              {stages.map((s, i) => (
                <div key={s.name} className="grid grid-cols-[8rem_1fr_1.5rem] items-center gap-3">
                  <span className={cn('truncate font-body text-caption', i === winner ? 'text-accent-text' : 'text-fg-muted')}>{s.name}</span>
                  <span className="h-2 overflow-hidden rounded-xs bg-surface">
                    <span
                      className={cn('block h-full rounded-xs transition-[width] duration-base ease-out', i === winner ? 'bg-accent' : 'bg-border-strong')}
                      style={{ width: `${(tally[i] / max) * 100}%` }}
                    />
                  </span>
                  <span className="text-right font-mono text-mono-xs tabular-nums text-fg-subtle">{tally[i]}</span>
                </div>
              ))}
            </div>
            <p className="font-body text-caption text-fg-subtle">No email, nothing submitted — it runs in your browser.</p>
          </div>
        </FadeIn>
      )}
    </div>
  )
}
