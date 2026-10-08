/**
 * AuditSection — the client audit instrument, documented in the system that dresses it.
 *
 * The instrument itself runs at `/audit`, full-screen and outside this chrome, because on
 * a client call the showcase sidebar is noise. This section is the reference entry: what
 * it is, how it is shaped, and the field vocabulary it added to the library.
 */
import { ArrowUpRight, Compass, PackageCheck, Stethoscope } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MonoLabel } from '@/components/ui/mono-label'
import { Stat } from '@/components/ui/stat'
import {
  AUDIT_PART_SUMMARY,
  AUDIT_SHAPE,
  BENCHMARK_PIPELINES,
  BENCHMARK_STAGE_COUNT,
} from '@/data/audit/build-spec'
import { FadeIn } from '@/lib/motion'

const PART_ICON = { discovery: Compass, diagnosis: Stethoscope, handoff: PackageCheck } as const

/** The field kinds the audit needed and the library did not ship. */
const NEW_FIELDS = [
  { name: 'single / multi', note: 'Large choice tiles with a 1–9 key hint. Not a radio dot — the auditor answers without looking down.' },
  { name: 'allowOther', note: 'A typed “something else” on any open choice set. Selecting it focuses the box, so a name nobody anticipated still gets captured mid-sentence.' },
  { name: 'yesno', note: 'Three states. “Not sure” is itself a finding, so it is a first-class answer.' },
  { name: 'scale', note: 'A 1–5 read the auditor makes, not the client. Endpoint captions, no slider.' },
  { name: 'currency / number / percent', note: 'Holds the typed string and parses on read, so “7.05” survives the keystroke after the dot.' },
  { name: 'table', note: 'Repeating rows for a stack list, a loan-type split or a conversion funnel.' },
  { name: 'long', note: 'Auto-growing prose. A fixed box invites short answers, and this is where the real intel lands.' },
]

/* The question bank is NOT imported here: it is the bulk of the audit chunk, and the
   showcase should not download 435 questions to render four numbers. The counts come from
   AUDIT_SHAPE, which `npm run check:audit` pins to the real data. */
export function AuditSection() {
  return (
    <Section
      id="audit"
      eyebrow="28 - Client Audit"
      title="The client audit instrument"
      lead="A two-call diagnostic for a mortgage or finance brokerage, clicked through live on the conversation. It measures the business against the built broker configuration and produces both a written record and the access checklist for the hands-on pass."
    >
      <div className="flex flex-col gap-10">
        <FadeIn>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button as="a" href="/audit" size="lg">
              Open the audit
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </Button>
            <span className="font-mono text-caption text-fg-subtle">Runs at /audit, full screen.</span>
          </div>
        </FadeIn>

        <FadeIn>
          <Demo label="Shape">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <Stat value={AUDIT_SHAPE.parts} label="parts" />
              <Stat value={AUDIT_SHAPE.modules} label="modules" />
              <Stat value={AUDIT_SHAPE.questions} label="questions" />
              <Stat
                display={`${BENCHMARK_PIPELINES.length} / ${BENCHMARK_STAGE_COUNT}`}
                label="benchmark pipelines / stages"
              />
            </div>
          </Demo>
        </FadeIn>

        <FadeIn>
          <div className="grid gap-4 md:grid-cols-3">
            {AUDIT_PART_SUMMARY.map((p) => {
              const Icon = PART_ICON[p.id]
              return (
                <div key={p.id} className="rounded-lg border border-border bg-surface p-6">
                  <Icon className="h-5 w-5 text-accent-text" strokeWidth={1.5} aria-hidden />
                  <p className="mt-4 font-mono text-mono-2xs uppercase tracking-[0.14em] text-fg-subtle">
                    {p.kicker}
                  </p>
                  <h3 className="mt-1 font-display text-title-md text-fg">{p.title}</h3>
                  <p className="mt-2 font-body text-body-sm leading-relaxed text-fg-muted">{p.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <Badge variant="outline" size="sm">
                      {p.modules} modules
                    </Badge>
                    <Badge variant="outline" size="sm">
                      {p.questions} questions
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </FadeIn>

        <FadeIn>
          <Demo label="Field vocabulary added for this instrument">
            <dl className="divide-y divide-border">
              {NEW_FIELDS.map((f) => (
                <div key={f.name} className="grid gap-1 py-3.5 first:pt-0 last:pb-0 sm:grid-cols-[13rem_1fr] sm:gap-5">
                  <dt className="font-mono text-body-sm text-accent-text">{f.name}</dt>
                  <dd className="font-body text-body-sm leading-relaxed text-fg-muted">{f.note}</dd>
                </div>
              ))}
            </dl>
          </Demo>
        </FadeIn>

        <FadeIn>
          <div className="rounded-lg border border-border bg-inset p-6">
            <MonoLabel tone="subtle">One rule the instrument enforces</MonoLabel>
            <p className="mt-3 font-body text-body-md leading-relaxed text-fg-muted">
              The form asks about the client&rsquo;s business. It never asserts anything about ours —
              no outcome, no saving, no turnaround, no guarantee, and nothing that suggests a
              configuration carries a licensee&rsquo;s obligations. Flags say what was heard and what
              to ask next; the export says the same, and marks every figure as reported rather than
              verified.
            </p>
          </div>
        </FadeIn>
      </div>
    </Section>
  )
}
