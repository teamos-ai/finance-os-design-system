/**
 * BentoSection — the bento grid. ONE polished, liftable composition: a responsive
 * asymmetric grid (grid-cols-1 → md:grid-cols-3 with col/row spans) that pairs a
 * gradient + Glow hero tile with feature cells, an outcome stat, a media wash and a
 * closing CTA. Calm Finance voice, token-only, 8px radius ceiling. Motion is a single
 * Stagger band over FadeIn so the panel assembles quietly and reduced-motion safe.
 */
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'
import { Section } from '@/showcase/Section'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Stat } from '@/components/ui/stat'
import { FeatureCard } from '@/components/ui/feature-card'
import { ImageWash } from '@/components/ui/image-wash'
import { MonoLabel } from '@/components/ui/mono-label'
import { FadeIn, Stagger, StaggerItem, Glow } from '@/lib/motion'
import { FEATURES, STATS, BRAND } from '@/data/system'

/** Two feature cells lifted from the content data — follow-up + insights read well at this scale. */
const TILE_FEATURES = [FEATURES[1], FEATURES[8]] as const
/** The headline outcome figure for the stat cell. */
const OUTCOME = STATS[0]

export function BentoSection() {
  return (
    <Section
      id="bento"
      eyebrow="13 - Bento Box"
      title="Bento box"
      lead="The responsive bento grid — a hero, feature cells, an outcome figure, a media wash and a closing CTA composed into one expressive panel. Lift the whole arrangement, or any single cell."
    >
      <FadeIn>
        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[minmax(0,1fr)]">
          {/* Hero tile — gradient + Glow, spans two columns and two rows on desktop. */}
          <StaggerItem className="md:col-span-2 md:row-span-2">
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-lg border border-border bg-gradient-accent p-8 md:p-10">
              <Glow />
              <div className="flex flex-col gap-4">
                <MonoLabel tone="accent" dot>
                  {BRAND.oneLiner}
                </MonoLabel>
                <h3 className="max-w-md font-display text-display-sm leading-tight text-accent-fg">
                  Every enquiry captured, followed up and nurtured — from one calm surface.
                </h3>
                <p className="max-w-md font-body text-body-md leading-relaxed text-accent-fg/85">
                  {BRAND.promise}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button variant="dark" size="md">
                  Explore the platform
                </Button>
                <span className="inline-flex items-center gap-2 font-mono text-caption text-accent-fg/75">
                  <Sparkles width={14} height={14} strokeWidth={1.5} aria-hidden />
                  Eight tools, one system
                </span>
              </div>
            </div>
          </StaggerItem>

          {/* Feature cell — top-right. */}
          <StaggerItem className="md:col-span-1">
            <FeatureCard
              icon={TILE_FEATURES[0].Icon}
              title={TILE_FEATURES[0].title}
              description={TILE_FEATURES[0].description}
              accent={TILE_FEATURES[0].accent}
              eyebrow={TILE_FEATURES[0].tagline}
              number="01"
              className="h-full"
            />
          </StaggerItem>

          {/* Stat cell — the outcome figure, right column. */}
          <StaggerItem className="md:col-span-1">
            <div className="flex h-full flex-col justify-between gap-6 rounded-lg border border-border bg-surface p-6">
              <MonoLabel tone="amber">Outcome</MonoLabel>
              <Stat
                value={OUTCOME.value}
                suffix={OUTCOME.suffix}
                label={OUTCOME.label}
              />
            </div>
          </StaggerItem>

          {/* Media wash cell — spans two columns on desktop. */}
          <StaggerItem className="md:col-span-2">
            <ImageWash
              dark
              ratio="16/6"
              icon={ShieldCheck}
              label="Pipeline view"
              note="First enquiry → settlement, tracked in one place"
              background="radial-gradient(120% 140% at 12% 0%, rgba(238,186,43,0.22), transparent 60%), linear-gradient(135deg, var(--c-inset), var(--c-canvas))"
              className="h-full"
            />
          </StaggerItem>

          {/* Feature cell — bottom-right of the media band. */}
          <StaggerItem className="md:col-span-1">
            <FeatureCard
              icon={TILE_FEATURES[1].Icon}
              title={TILE_FEATURES[1].title}
              description={TILE_FEATURES[1].description}
              accent={TILE_FEATURES[1].accent}
              eyebrow={TILE_FEATURES[1].tagline}
              number="02"
              className="h-full"
            />
          </StaggerItem>

          {/* CTA cell — full width, closes the panel. */}
          <StaggerItem className="md:col-span-3">
            <div className="flex h-full flex-col items-start justify-between gap-5 rounded-lg border border-border bg-elevated p-6 md:flex-row md:items-center md:p-8">
              <div className="flex flex-col gap-2">
                <Badge variant="amber" size="sm" dot>
                  Replaces 8 tools
                </Badge>
                <h3 className="font-display text-title-lg text-fg">
                  See the whole system in one walkthrough.
                </h3>
                <p className="max-w-xl font-body text-body-md leading-relaxed text-fg-muted">
                  Predictable pipeline, more settlements, less admin — booked around your week.
                </p>
              </div>
              <Button variant="primary" size="lg" className="shrink-0">
                Book a walkthrough
                <ArrowRight width={18} height={18} strokeWidth={1.5} aria-hidden />
              </Button>
            </div>
          </StaggerItem>
        </Stagger>
      </FadeIn>
    </Section>
  )
}
