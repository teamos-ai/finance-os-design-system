import { Compass, Square, Sparkle, Gauge } from 'lucide-react'
import { Section } from '@/showcase/Section'
import { Card } from '@/components/ui/card'
import { MonoLabel } from '@/components/ui/mono-label'
import { Stagger, StaggerItem } from '@/lib/motion'
import { ACCENTS } from '@/lib/accents'
import { PILLARS } from '@/data/system'

const PRINCIPLES = [
  { Icon: Compass, title: 'Open Design leads', body: 'The look is set by reference systems and the brand book — then tokenized faithfully. No guesswork.' },
  { Icon: Square, title: 'No glassmorphism', body: 'Flat hairline surfaces and solid fills. Depth comes from a coloured glow, never frosted glass.' },
  { Icon: Sparkle, title: '8px-max squircles', body: 'A tight, precise corner system. Crisp and software-grade, never bubbly.' },
  { Icon: Gauge, title: 'Gentle motion', body: 'Quiet fades, small translates and a calm glow. Everything honours reduced-motion.' },
]


export function OverviewSection() {
  return (
    <Section
      id="overview"
      eyebrow="04 — Overview"
      title="The system at a glance"
      lead="Finance OS is built Ruler-first: structure, order and authority, softened by the Sage's clarity. Every surface assembles from one locked semantic token layer — matched to the production site."
    >
      {/* principles */}
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <StaggerItem key={p.title}>
            <Card tone="surface" padding="md" interactive className="h-full">
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent-soft text-accent-text">
                  <p.Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-title-md text-fg">{p.title}</h3>
                  <p className="mt-1 font-body text-body-sm leading-relaxed text-fg-muted">{p.body}</p>
                </div>
              </div>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>

      {/* archetype blend */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PILLARS.map((pillar) => {
          const a = ACCENTS[pillar.accent]
          return (
            <Card key={pillar.name} tone="surface" padding="lg">
              <div className="flex items-center justify-between">
                <MonoLabel tone={pillar.accent === 'amber' ? 'accent' : 'brand'} dot>
                  {pillar.name}
                </MonoLabel>
                <span className={`font-display text-display-sm ${a.text}`}>{pillar.weight}</span>
              </div>
              <p className="mt-3 font-body text-body-md leading-relaxed text-fg-muted">{pillar.blurb}</p>
            </Card>
          )
        })}
      </div>

      {/* single theme */}
      <div className="mt-10 rounded-lg border border-border bg-surface p-6">
        <MonoLabel tone="subtle">One theme · one semantic layer</MonoLabel>
        <p className="mt-3 font-display text-title-sm text-fg">Light · Clarity</p>
        <p className="mt-1 font-body text-body-md leading-relaxed text-fg-muted">
          Pure white with the Atlas Blue accent — matched to the production site. Every surface
          composes from one semantic token layer on <code className="font-mono text-body-sm text-fg">:root</code>.
        </p>
      </div>

    </Section>
  )
}
