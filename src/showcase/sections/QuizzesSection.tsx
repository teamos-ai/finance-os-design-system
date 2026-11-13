/**
 * QuizzesSection — the home for interactive quizzes (Library → Marketing & Content → Quizzes).
 * The first planned entry is the website's "Stack Audit" (financeos.au/quiz): five single-choice
 * questions that place a brokerage at a stage, no email, runs in the browser. The interactive build
 * and the stage-scoring logic are the next (assets) pass — this establishes the home and previews
 * the real question flow captured from the live site.
 */
import { Section, Demo } from '@/showcase/Section'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MonoLabel } from '@/components/ui/mono-label'

/** The Stack Audit question flow, as captured from financeos.au/quiz (5 single-choice questions). */
const STACK_AUDIT = [
  'How many people touch a loan file?',
  'Roughly how many settlements a month?',
  'Which part of the week would you most like back?',
  'Where does most new business come from?',
  'How much of the admin would you hand to software tomorrow?',
]

export function QuizzesSection() {
  return (
    <Section
      id="quizzes"
      eyebrow="Quizzes"
      title="Quizzes"
      lead="Short, no-email quizzes that place a visitor and hand them a tailored next step. The first is the brokerage Stack Audit from the website; more can follow the same pattern."
    >
      <Demo label="Stack Audit — five questions → a brokerage stage">
        <div className="mx-auto flex max-w-2xl flex-col gap-5">
          <div className="flex flex-col gap-2 text-center">
            <MonoLabel tone="subtle">financeos.au/quiz · captured flow</MonoLabel>
            <h3 className="font-display text-title-lg text-fg">Which stage is your brokerage at?</h3>
            <p className="font-body text-body-md leading-relaxed text-fg-muted">
              Five single-choice questions, four options each. No email, submits nothing, runs in the browser; the
              result is the set of roles a brokerage at your stage must fill.
            </p>
          </div>
          <Card className="flex flex-col gap-3">
            <ol className="flex flex-col gap-2.5">
              {STACK_AUDIT.map((q, i) => (
                <li key={q} className="flex gap-3">
                  <span className="font-mono text-mono-xs tabular-nums text-accent-text">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-body text-body-sm text-fg">{q}</span>
                </li>
              ))}
            </ol>
          </Card>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="amber" size="sm">
              Interactive build &amp; scoring — next (assets) pass
            </Badge>
            <a
              href="https://www.financeos.au/quiz"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-mono-xs text-accent-text underline-offset-4 hover:underline"
            >
              View the live quiz ↗
            </a>
          </div>
        </div>
      </Demo>
    </Section>
  )
}
