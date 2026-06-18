/**
 * BlogsSection — the editorial template. One full sample article on a broker topic,
 * then a small set of related-post cards. Shows the prose rhythm the system writes in:
 * article header (eyebrow / display title / author block + meta), a body of font-body
 * paragraphs broken by font-display subheads, an accent-bordered pull-quote and an
 * inline ImageWash, closed by related Cards. Token-only, theme-aware, responsive.
 */
import { Clock, BookOpen, ArrowUpRight, LineChart, FileText } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MonoLabel } from '@/components/ui/mono-label'
import { ImageWash } from '@/components/ui/image-wash'
import { LogoMark } from '@/components/brand/Logo'
import type { Accent } from '@/lib/accents'

/** Theme-aware diagonal washes built from semantic tokens — no raw hex, adapts per theme. */
const FIGURE_WASH =
  'linear-gradient(135deg, var(--c-accent-soft) 0%, var(--c-elevated) 55%, var(--c-amber-soft) 100%)'

interface RelatedPost {
  eyebrow: string
  title: string
  description: string
  readTime: string
  accent: Accent
}

const RELATED: RelatedPost[] = [
  {
    eyebrow: 'Follow-up',
    title: 'The five-minute lead rule, and why it pays',
    description:
      'Speed-to-lead is the single highest-leverage habit in a broker pipeline. Here is how to automate it.',
    readTime: '4 min read',
    accent: 'amber',
  },
  {
    eyebrow: 'Pipeline',
    title: 'What a clean stage list actually looks like',
    description:
      'Most pipelines carry stages nobody uses. A short, honest list is the one brokers keep up to date.',
    readTime: '6 min read',
    accent: 'amber',
  },
  {
    eyebrow: 'Nurture',
    title: 'Staying top of mind through a long decision cycle',
    description:
      'Refinance and purchase timelines run for months. A calm nurture cadence keeps you in the room.',
    readTime: '5 min read',
    accent: 'blue',
  },
]

export function BlogsSection() {
  return (
    <Section
      id="blogs"
      eyebrow="15 - Blogs"
      title="Blogs"
      lead="The editorial template — article header, a measured prose rhythm with display subheads, an accent pull-quote and inline figure, then a row of related posts."
    >
      <Demo
        label="Article template"
        action={
          <Badge variant="outline" size="sm">
            Sample article
          </Badge>
        }
      >
        <article className="mx-auto max-w-2xl">
          {/* Article header */}
          <header>
            <MonoLabel tone="amber" dot>
              Pipeline
            </MonoLabel>
            <h1 className="mt-4 font-display text-display-md leading-tight text-fg">
              Why your pipeline is leaking
            </h1>

            {/* Author block */}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-border-subtle pt-5">
              <div className="flex items-center gap-3">
                <LogoMark size="sm" />
                <div className="flex flex-col">
                  <MonoLabel tone="fg" size="sm">
                    The Finance OS Desk
                  </MonoLabel>
                  <span className="font-mono text-caption text-fg-subtle">
                    18 June 2026
                  </span>
                </div>
              </div>
              <span aria-hidden className="hidden h-8 w-px bg-border sm:block" />
              <span className="inline-flex items-center gap-1.5 font-mono text-caption text-fg-subtle">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                7 min read
              </span>
            </div>
          </header>

          {/* Lead paragraph */}
          <p className="mt-8 font-body text-body-lg leading-relaxed text-fg">
            Most brokers do not lose deals at the table. They lose them in the gaps — an
            enquiry that sat overnight, a pre-approval that went quiet, a borrower who
            drifted to whoever called back first. The leak is rarely dramatic. It is steady,
            and it compounds.
          </p>

          {/* Body */}
          <h2 className="mt-10 font-display text-title-lg text-fg">
            The leak is in the handoffs
          </h2>
          <p className="mt-3 font-body text-body-md leading-relaxed text-fg-muted">
            A pipeline is a sequence of handoffs: lead to contact, contact to qualified,
            qualified to application. Each one is a moment where attention can slip. When
            those moments live across a spreadsheet, an inbox and a phone, nobody owns the
            gap between them — and the gap is exactly where deals go cold.
          </p>
          <p className="mt-3 font-body text-body-md leading-relaxed text-fg-muted">
            The fix is not more effort. It is fewer places for a lead to fall through. One
            pipeline, with the first follow-up firing automatically, turns a leak into a
            process you can actually see.
          </p>

          {/* Pull-quote */}
          <blockquote className="my-9 border-l-2 border-accent pl-5">
            <p className="font-display text-title-md italic leading-snug text-fg">
              You cannot fix a leak you cannot see. The first job is to make every enquiry
              land somewhere it will be followed up — automatically, every time.
            </p>
            <cite className="mt-3 block font-mono text-caption not-italic text-fg-subtle">
              — Finance OS field notes
            </cite>
          </blockquote>

          {/* Inline figure */}
          <ImageWash
            background={FIGURE_WASH}
            ratio="16/9"
            label="Where pipelines leak"
            note="Enquiry volume vs. contacted, by stage"
            icon={LineChart}
            className="my-8"
          />

          <h2 className="mt-10 font-display text-title-lg text-fg">
            Seal it once, then watch it
          </h2>
          <p className="mt-3 font-body text-body-md leading-relaxed text-fg-muted">
            Once every enquiry routes into a single pipeline and the first touch is
            automated, the leak stops being a mystery. You can read conversion stage by
            stage, see where contact rates drop, and put the next automation exactly where
            it earns its keep. The pipeline stops feeling like luck and starts behaving like
            a system.
          </p>
        </article>
      </Demo>

      {/* Related posts */}
      <div className="mt-12">
        <MonoLabel tone="subtle" number="15.1">
          Related posts
        </MonoLabel>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {RELATED.map((post) => (
            <Card
              key={post.title}
              as="a"
              {...{ href: '#blogs' }}
              tone="surface"
              padding="none"
              interactive
              className="group flex flex-col no-underline"
              image=""
              imageAlt=""
              accent={post.accent}
              placeholderIcon={FileText}
              ratio="16/9"
              meta={[{ icon: BookOpen, label: post.readTime }]}
            >
              <MonoLabel tone="accent" size="sm" className="mb-2">
                {post.eyebrow}
              </MonoLabel>
              <CardTitle className="text-title-md">{post.title}</CardTitle>
              <CardDescription className="mt-2">{post.description}</CardDescription>
              <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-caption text-accent-text">
                Read article
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-base ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </span>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  )
}
