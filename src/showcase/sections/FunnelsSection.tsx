/**
 * FunnelsSection — the home for complete, reusable funnel designs (Library → Marketing & Content →
 * Funnels). The website publishes a "Funnels and landing pages" asset catalogue
 * (financeos.au/discover/assets/funnels); mirroring those complete designs here is the next (assets)
 * pass. This establishes the home alongside the other Marketing & Content entries.
 */
import { Section, Demo } from '@/showcase/Section'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MonoLabel } from '@/components/ui/mono-label'

export function FunnelsSection() {
  return (
    <Section
      id="funnels"
      eyebrow="Funnels"
      title="Funnels"
      lead="End-to-end funnel and landing-page designs the team can lift whole — opt-in, VSL, application and launch flows — built from the same sections, cards and forms in this library."
    >
      <Demo label="Funnels — to be mirrored from the website catalogue">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <MonoLabel tone="subtle">financeos.au/discover/assets/funnels</MonoLabel>
          <Card className="flex flex-col gap-3">
            <p className="font-body text-body-md leading-relaxed text-fg-muted">
              The website publishes a <span className="text-highlight">Funnels &amp; landing pages</span> catalogue. The
              complete funnel designs will be inventoried and rebuilt here from this library&rsquo;s own sections, cards
              and forms, so each page links back to the parts it is assembled from.
            </p>
          </Card>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="amber" size="sm">
              Inventory &amp; build — next (assets) pass
            </Badge>
            <a
              href="https://www.financeos.au/discover/assets/funnels"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-mono-xs text-accent-text underline-offset-4 hover:underline"
            >
              View the catalogue ↗
            </a>
          </div>
        </div>
      </Demo>
    </Section>
  )
}
