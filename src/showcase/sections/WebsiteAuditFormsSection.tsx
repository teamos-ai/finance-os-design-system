/**
 * WebsiteAuditFormsSection — the home for public audit / assessment forms (Library → Calculators &
 * Assessments → Website Audit Forms). The live internal audit instrument (the real assessment used
 * on client calls) stays at its own /audit route; this library home is where reusable, embeddable
 * assessment forms will live. The named "weekly leakage assessment" could not be found on the site
 * (flagged for the handover); the closest public artefact is the Stack Audit quiz.
 */
import { Section, Demo } from '@/showcase/Section'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MonoLabel } from '@/components/ui/mono-label'

export function WebsiteAuditFormsSection() {
  return (
    <Section
      id="audit-forms"
      eyebrow="Website Audit Forms"
      title="Website Audit Forms"
      lead="Reusable, embeddable assessment forms a brokerage can put on a site to qualify and route a visitor. The full client audit instrument lives on its own at /audit; this is the home for the lighter public forms."
    >
      <Demo label="Audit & assessment forms — sources and what's outstanding">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <Card className="flex flex-col gap-2">
            <MonoLabel tone="subtle">Live now</MonoLabel>
            <p className="font-body text-body-sm leading-relaxed text-fg-muted">
              The <span className="text-highlight">client audit instrument</span> — the two-call Discovery · Diagnosis ·
              Handoff diagnostic used on client calls — runs full-screen at{' '}
              <a href="/audit" className="text-accent-text underline-offset-4 hover:underline">/audit</a>. It stays a
              standalone tool, outside the showcase chrome.
            </p>
          </Card>
          <Card className="flex flex-col gap-2">
            <MonoLabel tone="subtle">To mirror</MonoLabel>
            <p className="font-body text-body-sm leading-relaxed text-fg-muted">
              A lightweight public assessment, patterned on the website&rsquo;s Stack Audit quiz, will be rebuilt here as
              an embeddable form.
            </p>
          </Card>
          <Card className="flex flex-col gap-2">
            <MonoLabel tone="subtle">Not located</MonoLabel>
            <p className="font-body text-body-sm leading-relaxed text-fg-muted">
              The &ldquo;weekly leakage assessment&rdquo; mentioned in the review could not be found on financeos.au
              (checked /audit, /assessment, the assets index, nav and footer). Flagged for the handover — a source link
              is needed before it can be rebuilt.
            </p>
          </Card>
          <div className="flex justify-center">
            <Badge variant="amber" size="sm">
              Embeddable forms — next (assets) pass
            </Badge>
          </div>
        </div>
      </Demo>
    </Section>
  )
}
