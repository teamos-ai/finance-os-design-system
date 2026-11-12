/**
 * LandscapeTableSection — Positioning · the competitor landscape for arena one, the sale.
 * A real, scrollable <table> matching the Tables family: hairline row rules, mono column
 * heads, zebra-on-hover and a reported-not-verified footnote. Four columns straight from the
 * signed-off positioning data — Who / The line they use / Good at / Weak at.
 *
 * The this-vs-that read the brand sanctions (success green / danger red as FUNCTIONAL signals)
 * lives as a restrained colour key on the two comparison heads and a green strength tick —
 * never a red "fail" stamped across a competitor's row. Honesty is carried by the mandated
 * footnote: founder-identified alternatives, with no measured adoption or comparative outcome
 * claimed. Content is imported from src/data/positioning.ts, never hardcoded. Blue still owns
 * every typographic highlight; green/red appear only as small functional marks and head dots.
 */
import { ArrowLeftRight, Check } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { landscape, landscapeFootnote } from '@/data/positioning'
import { FadeIn } from '@/lib/motion'
import { cn } from '@/lib/cn'

/** Shared head treatments — the small mono overline, matched to TablesSection. */
const TH_OVERLINE = 'font-mono text-mono-xs uppercase tracking-wider text-fg-subtle'

/** A tonal column-head cell carrying the this-vs-that colour key (success · danger). */
function CompareHead({ label, tone }: { label: string; tone: 'success' | 'danger' }) {
  const isGood = tone === 'success'
  return (
    <th
      scope="col"
      className={cn(
        'whitespace-nowrap border-b border-border-strong px-5 py-3.5 text-left align-bottom',
        'font-mono text-mono-xs uppercase tracking-wider',
        isGood ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger',
      )}
    >
      <span className="inline-flex items-center gap-2">
        <span aria-hidden className={cn('h-1.5 w-1.5 rounded-sm', isGood ? 'bg-success' : 'bg-danger')} />
        {label}
      </span>
    </th>
  )
}

export function LandscapeTableSection() {
  return (
    <Section
      id="landscape-table"
      eyebrow="Landscape"
      title="The landscape"
      lead="Arena one, the sale. The alternatives a brokerage already weighs Finance OS against — a general-purpose CRM, or a work-management board pressed into service as an enquiry tracker — what each is genuinely good at, and the gap worth comparing. Founder-identified, with no comparative outcome claimed."
    >
      <FadeIn>
        <Demo
          label="Landscape — who a brokerage compares us with, and on what"
          inspect={{
            name: 'Landscape table',
            explain:
              'The competitor landscape for arena one (the sale): who a brokerage weighs Finance OS against, the category line each one uses, where it is genuinely strong, and the gap to compare. A real, scrollable <table> with hairline rows and a reported-not-verified footnote — the content is the signed-off positioning data, never a claim about us.',
            token:
              'frame: overflow-x-auto · rounded-lg · border-border · bg-surface\ntable: w-full · min-w-[820px] · border-collapse\nhead: font-mono · text-mono-xs · uppercase · tracking-wider · text-fg-subtle\ncompare key: Good at → bg-success-soft/text-success · Weak at → bg-danger-soft/text-danger\nrows: border-b border-border · hover:bg-canvas-muted\nmarks: Check in bg-success-soft · ArrowLeftRight in bg-inset',
            code: `import { landscape, landscapeFootnote } from '@/data/positioning'

<div className="overflow-x-auto rounded-lg border border-border bg-surface">
  <table className="w-full min-w-[820px] border-collapse">
    <thead>
      <tr>
        <th scope="col">Who</th>
        <th scope="col">The line they use</th>
        <th scope="col">Good at</th>
        <th scope="col">Weak at</th>
      </tr>
    </thead>
    <tbody>
      {landscape.map((row) => (
        <tr key={row.who} className="hover:bg-canvas-muted">
          <th scope="row">{row.who}</th>
          <td>{row.line}</td>
          <td>{row.goodAt}</td>
          <td>{row.weakAt}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
<p>{landscapeFootnote}</p>`,
          }}
        >
          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full min-w-[820px] border-collapse">
              <thead>
                <tr>
                  <th scope="col" className={cn('w-[15%] whitespace-nowrap border-b border-border-strong px-5 py-3.5 text-left align-bottom', TH_OVERLINE)}>
                    Who
                  </th>
                  <th scope="col" className={cn('w-[24%] border-b border-border-strong px-5 py-3.5 text-left align-bottom', TH_OVERLINE)}>
                    The line they use
                  </th>
                  <CompareHead label="Good at" tone="success" />
                  <CompareHead label="Weak at" tone="danger" />
                </tr>
              </thead>
              <tbody>
                {landscape.map((row, i) => {
                  const rule = i < landscape.length - 1 ? 'border-b border-border' : ''
                  return (
                    <tr key={row.who} className="group transition-colors hover:bg-canvas-muted">
                      <th
                        scope="row"
                        className={cn('px-5 py-4 text-left align-top font-display text-body-sm font-semibold text-fg', rule)}
                      >
                        {row.who}
                      </th>
                      <td className={cn('px-5 py-4 align-top font-body text-body-sm leading-relaxed text-fg-muted', rule)}>
                        {row.line}
                      </td>
                      <td className={cn('px-5 py-4 align-top', rule)}>
                        <span className="flex items-start gap-3 font-body text-body-sm leading-relaxed text-fg">
                          <span
                            aria-hidden
                            className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-success-soft text-success"
                          >
                            <Check className="h-3 w-3" strokeWidth={2.2} />
                          </span>
                          <span>{row.goodAt}</span>
                        </span>
                      </td>
                      <td className={cn('px-5 py-4 align-top', rule)}>
                        <span className="flex items-start gap-3 font-body text-body-sm leading-relaxed text-fg-muted">
                          <span
                            aria-hidden
                            className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-inset text-fg-subtle"
                            title="What the buyer weighs the alternative against"
                          >
                            <ArrowLeftRight className="h-3 w-3" strokeWidth={2.2} />
                          </span>
                          <span>{row.weakAt}</span>
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2.5 font-body text-caption leading-relaxed text-fg-subtle">{landscapeFootnote}</p>
        </Demo>
      </FadeIn>
    </Section>
  )
}
