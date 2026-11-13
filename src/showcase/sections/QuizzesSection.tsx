/**
 * QuizzesSection — interactive, no-email quizzes (Library → Marketing & Content → Quizzes). The
 * exhibit is the website's "Stack Audit" (financeos.au/quiz): five single-choice questions that
 * place a brokerage at a stage, running entirely in the browser. Questions are verbatim from the
 * live quiz; the stages and scoring are the design system's interpretation (the site's result logic
 * isn't published). Built on the reusable QuizRunner so the team can seed new quizzes the same way.
 */
import { Section, Demo } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { QuizRunner, type QuizQuestion, type QuizStage } from '@/components/quizzes/QuizRunner'
import type { InspectData } from '@/components/ui/inspectable'

/** The Stack Audit — questions verbatim from financeos.au/quiz. Option i scores stage i. */
const QUESTIONS: QuizQuestion[] = [
  {
    prompt: 'How many people touch a loan file?',
    options: ['Just me', 'Me and support', 'Two to five of us', 'More than five'],
  },
  {
    prompt: 'Roughly how many settlements a month?',
    options: ['Under five', 'Five to twenty', 'Twenty to fifty', 'More than fifty'],
  },
  {
    prompt: 'Which part of the week would you most like back?',
    options: [
      'Answering new enquiries fast enough',
      'Chasing documents',
      'Retyping the same data into three systems',
      'Nothing arriving in the first place',
    ],
  },
  {
    prompt: 'Where does most new business come from?',
    options: ['Referrals and repeat clients', 'Accountants, agents and partners', 'Website, ads or social', 'A bit of everything'],
  },
  {
    prompt: 'How much of the admin would you hand to software tomorrow?',
    options: [
      'Everything that is not the actual advice',
      'Notes and follow-up, not client conversations',
      'Very little, I want to see it first',
      'None of it',
    ],
  },
]

const STAGES: QuizStage[] = [
  { name: 'Solo operator', blurb: 'Just you, or you and a hand. The win is capturing every enquiry and never dropping a follow-up.' },
  { name: 'Small team', blurb: 'A few of you. The win is shared visibility — who owns each deal, and what happens next.' },
  { name: 'Established brokerage', blurb: 'A real team and steady volume. The win is a consistent process and handovers that don’t leak.' },
  { name: 'Scaling operation', blurb: 'High volume, many hands. The win is automation and reporting across the whole pipeline.' },
]

const INSPECT: InspectData = {
  name: 'QuizRunner (Stack Audit)',
  explain:
    'A reusable, no-backend quiz: single-choice questions tally toward stages and reveal the result in the browser (no email, nothing submitted). Option i of each question scores stage i; the top stage wins and every stage’s score is shown. Seed it with any question/stage set.',
  token: [
    'option    border-border → selected border-accent · bg-accent-soft · text-accent-text',
    'tick      bg-accent · text-accent-fg (selected)',
    'result    border-border-strong · bg-accent-soft · FadeIn on complete',
    'bars      bg-accent (your stage) · bg-border-strong · progress "N of M answered"',
  ].join('\n'),
  code: [
    '<QuizRunner questions={QUESTIONS} stages={STAGES} />',
    '// QUESTIONS: { prompt, options[] }[]  ·  STAGES: { name, blurb }[]  (option i → stage i)',
  ].join('\n'),
}

export function QuizzesSection() {
  return (
    <Section
      id="quizzes"
      eyebrow="Quizzes"
      title="Quizzes"
      lead="Short, no-email quizzes that place a visitor and hand them a tailored next step. The exhibit is the brokerage Stack Audit; the same QuizRunner seeds any quiz."
    >
      <Demo label="Stack Audit — which stage is your brokerage at?" inspect={INSPECT}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <MonoLabel tone="subtle">financeos.au/quiz · questions verbatim</MonoLabel>
            <p className="max-w-2xl font-body text-body-md leading-relaxed text-fg-muted">
              Five questions about how the brokerage runs. No email, nothing submitted — the stage you’re at appears when
              all five are answered.{' '}
              <a href="https://www.financeos.au/quiz" target="_blank" rel="noreferrer" className="text-accent-text underline-offset-4 hover:underline">
                See the live quiz ↗
              </a>
            </p>
          </div>
          <QuizRunner questions={QUESTIONS} stages={STAGES} />
        </div>
      </Demo>
    </Section>
  )
}
