/**
 * TestimonialsSection — broker-grade proof, three variations. A quote card with a ★
 * rating and a result metric, a 40/60 portrait testimonial on the accent gradient, and
 * a 3-up wall of short quotes. Quotes are plain fg in the display face; the only colour
 * accents are the quiet blue quote mark, the amber rating stars (the sanctioned status
 * hue) and the green trend glyph on the metric. Emphasis = elevation + a quiet hover
 * lift via `interactive` — no ribbons, no side-rails, 8px squircles.
 */
import { Quote, Star, TrendingUp, User } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/cn'

interface Author {
  name: string
  role: string
  initials: string
}
interface Testimonial {
  quote: string
  author: Author
}

/** Featured quote card — carries a 5-star rating and a result metric. */
const FEATURED: Testimonial = {
  quote:
    'Our enquiries used to sit in three inboxes and a notebook. Now every lead lands in one pipeline with a next action against it — my team stopped dropping follow-ups and settlements kept climbing.',
  author: { name: 'Dani Mercer', role: 'Principal Broker · Meridian Finance, Brisbane', initials: 'DM' },
}

/** Portrait testimonial — larger quote beside the gradient portrait placeholder. */
const PORTRAIT: Testimonial = {
  quote:
    'I came off the aggregator’s reporting completely. The dashboard shows me pipeline, show-up rate and conversion in one view, so I walk into every week knowing exactly where the deals are stuck.',
  author: { name: 'Raj Kapadia', role: 'Director · Northbridge Mortgage Group, Sydney', initials: 'RK' },
}

/** Wall — a 3-up grid of short, single-idea quotes. */
const WALL: Testimonial[] = [
  {
    quote:
      'First tool my whole team actually adopted. Enquiries get triaged the day they arrive — nothing slips to the bottom of the pile anymore.',
    author: { name: 'Steph Olsen', role: 'Broker · Harbourline Lending, Perth', initials: 'SO' },
  },
  {
    quote:
      'Our show-up rate for first appointments climbed once reminders ran automatically. Fewer no-shows, more conversations that go somewhere.',
    author: { name: 'Tom Nguyen', role: 'Associate Broker · Keystone Finance, Adelaide', initials: 'TN' },
  },
  {
    quote:
      'Hand-off between me and my loan writer used to be a mess of spreadsheets. Now the whole file travels with the client through every stage.',
    author: { name: 'Gemma Fitzroy', role: 'Principal · Westgate Mortgage Co, Melbourne', initials: 'GF' },
  },
]

/** Initials disc — token gradient fill, white label. `rounded-full` is the sanctioned avatar round. */
function Avatar({ initials, size = 'lg' }: { initials: string; size?: 'lg' | 'sm' }) {
  return (
    <div
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-gradient-accent font-display font-semibold text-accent-fg shadow-sm',
        size === 'lg' ? 'h-11 w-11 text-body-md' : 'h-9 w-9 text-body-sm',
      )}
    >
      {initials}
    </div>
  )
}

/** Avatar + name + role, shared by all three variations. */
function Attribution({ author, size = 'lg' }: { author: Author; size?: 'lg' | 'sm' }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar initials={author.initials} size={size} />
      <div>
        <div className={cn('font-display font-semibold text-fg', size === 'lg' ? 'text-body-md' : 'text-body-sm')}>
          {author.name}
        </div>
        <div className="mt-0.5 font-body text-body-sm text-fg-subtle">{author.role}</div>
      </div>
    </div>
  )
}

/** Five filled stars — amber is the sanctioned rating/status hue, never on type. */
function Stars() {
  return (
    <span className="inline-flex gap-1 text-amber" aria-label="Rated 5 out of 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
      ))}
    </span>
  )
}

export function TestimonialsSection() {
  return (
    <Section
      id="testimonials"
      eyebrow="19 - Testimonials"
      title="Testimonials"
      lead="Grounded, broker-grade proof — a quote card with a result metric, a portrait testimonial, and a wall of short quotes. Elevation and a quiet lift carry emphasis; no ribbons, no hype."
    >
      <div className="flex flex-col gap-8">
        {/* (a) Quote card — stars, quote and a result metric */}
        <Demo label="Quote card — circular initials, role, quote and a result metric">
          <Card interactive className="mx-auto flex max-w-xl flex-col gap-5">
            <div>
              <Quote className="h-7 w-7 text-accent opacity-50" strokeWidth={1.5} aria-hidden />
              <div className="mt-2.5">
                <Stars />
              </div>
              <p className="mt-3 font-display text-title-md tracking-[-0.01em] text-fg">{FEATURED.quote}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
              <Attribution author={FEATURED.author} />
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 font-display text-display-sm font-semibold text-brand">
                  <TrendingUp className="h-4 w-4 text-success" strokeWidth={2} aria-hidden />
                  +38%
                </span>
                <div className="mt-1.5 font-mono text-caption uppercase tracking-[0.04em] text-fg-subtle">
                  Settlements YoY
                </div>
              </div>
            </div>
          </Card>
        </Demo>

        {/* (b) Portrait — 40/60 split, gradient portrait placeholder */}
        <Demo label="Portrait — 40 / 60 split, blue-gradient portrait placeholder">
          <Card padding="none" interactive className="grid overflow-hidden md:grid-cols-[2fr_3fr]">
            <div
              role="img"
              aria-label="Portrait placeholder"
              className="relative grid min-h-[200px] place-items-center bg-gradient-accent md:min-h-[260px]"
            >
              <User className="h-24 w-24 text-accent-fg opacity-80" strokeWidth={1.25} aria-hidden />
            </div>
            <div className="flex flex-col justify-center gap-6 p-8">
              <div>
                <Quote className="h-7 w-7 text-accent opacity-50" strokeWidth={1.5} aria-hidden />
                <p className="mt-3 font-display text-title-lg tracking-[-0.01em] text-fg">{PORTRAIT.quote}</p>
              </div>
              <Attribution author={PORTRAIT.author} />
            </div>
          </Card>
        </Demo>

        {/* (c) Wall — 3-up grid of short quotes */}
        <Demo label="Wall — 3-up grid of short quotes">
          <div className="grid gap-5 md:grid-cols-3">
            {WALL.map((t) => (
              <Card key={t.author.name} interactive className="flex flex-col gap-4">
                <Quote className="h-5 w-5 text-accent opacity-50" strokeWidth={1.5} aria-hidden />
                <p className="flex-1 font-display text-body-md tracking-[-0.01em] text-fg">{t.quote}</p>
                <Attribution author={t.author} size="sm" />
              </Card>
            ))}
          </div>
        </Demo>
      </div>
    </Section>
  )
}
