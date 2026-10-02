/**
 * BlockView — one screen of the audit.
 *
 * The centre column. A block's questions, stacked with air, in the order they should be
 * asked out loud. Each question shows the prompt at display size (readable at a glance
 * while looking at a client, not at the screen), a quiet "why we ask" line for the
 * auditor, the field, and — once answered — the follow-up to ask next.
 *
 * Flags raised by this block's answers appear inline, immediately, because a finding is
 * only useful while the client is still on the call.
 */
import { AlertTriangle, ArrowRight, Eye, Lightbulb } from 'lucide-react'
import type { Answers, AnswerValue, Block, FlagLevel, Module, Part } from '@/audit/types'
import { blockFlags, isAnswered, isVisible } from '@/audit/flags'
import { Field } from '@/audit/fields/Field'
import { MonoLabel } from '@/components/ui/mono-label'
import { FadeIn } from '@/lib/motion'
import { cn } from '@/lib/cn'

const FLAG_SKIN: Record<FlagLevel, { wrap: string; Icon: typeof AlertTriangle; ink: string }> = {
  risk: { wrap: 'border-danger/40 bg-danger-soft', Icon: AlertTriangle, ink: 'text-danger' },
  watch: { wrap: 'border-border-strong bg-inset', Icon: Eye, ink: 'text-fg-muted' },
  opportunity: { wrap: 'border-accent/40 bg-accent-soft', Icon: Lightbulb, ink: 'text-accent-text' },
}

export interface BlockViewProps {
  part: Part
  module: Module
  block: Block
  answers: Answers
  onAnswer: (questionId: string, value: AnswerValue) => void
  /** position within the module, for the eyebrow */
  index: number
  count: number
}

export function BlockView({
  part,
  module: mod,
  block,
  answers,
  onAnswer,
  index,
  count,
}: BlockViewProps) {
  const visible = block.questions.filter((q) => isVisible(q, answers))
  const flags = blockFlags(block, answers, part.id, mod.id)

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-12 md:px-10 md:py-16">
      <FadeIn>
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <MonoLabel number={mod.number} tone="accent">
              {mod.title}
            </MonoLabel>
            <span aria-hidden className="h-1 w-1 rounded-sm bg-border-strong" />
            <span className="font-mono text-mono-xs uppercase tracking-[0.12em] text-fg-subtle">
              {index + 1} / {count}
            </span>
          </div>
          <h1 className="mt-4 font-display text-display-sm leading-tight text-fg">{block.title}</h1>
          {block.intro && (
            <p className="mt-3 font-body text-body-lg leading-relaxed text-fg-muted">{block.intro}</p>
          )}
        </header>
      </FadeIn>

      <div className="flex flex-col gap-10">
        {visible.map((q, i) => {
          const answered = isAnswered(answers[q.id])
          return (
            <section key={q.id} id={`q-${q.id}`} className="scroll-mt-24">
              <div className="mb-3">
                <h2 className="font-display text-title-lg leading-snug text-fg">{q.prompt}</h2>
                {q.why && (
                  <p className="mt-1.5 font-mono text-caption leading-relaxed text-fg-subtle">{q.why}</p>
                )}
                {q.hint && (
                  <p className="mt-1.5 font-body text-body-sm leading-relaxed text-fg-muted">{q.hint}</p>
                )}
              </div>

              <Field
                question={q}
                value={answers[q.id]}
                onChange={(v) => onAnswer(q.id, v)}
                autoFocus={i === 0 && !answered && (q.kind === 'short' || q.kind === 'long')}
              />

              {answered && q.followUp && (
                <p className="mt-3 flex items-start gap-2 font-body text-body-sm leading-relaxed text-accent-text">
                  <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
                  <span>{q.followUp}</span>
                </p>
              )}
            </section>
          )
        })}
      </div>

      {flags.length > 0 && (
        <div className="mt-12 flex flex-col gap-2" aria-live="polite">
          <MonoLabel tone="subtle" size="sm">
            Raised on this screen
          </MonoLabel>
          {flags.map((f, i) => {
            const skin = FLAG_SKIN[f.level]
            return (
              <div key={`${f.questionId}-${i}`} className={cn('rounded-md border p-4', skin.wrap)}>
                <div className="flex items-start gap-3">
                  <skin.Icon
                    className={cn('mt-0.5 h-4 w-4 shrink-0', skin.ink)}
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    {f.context && (
                      <p className="mb-1 font-mono text-caption leading-relaxed text-fg-subtle">
                        {f.context}
                      </p>
                    )}
                    <p className={cn('font-display text-body-md leading-snug', skin.ink)}>{f.title}</p>
                    {f.note && (
                      <p className="mt-1 font-body text-body-sm leading-relaxed text-fg-muted">{f.note}</p>
                    )}
                    {f.action && (
                      <p className="mt-2 font-mono text-caption leading-relaxed text-fg-subtle">
                        Ask next — {f.action}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
