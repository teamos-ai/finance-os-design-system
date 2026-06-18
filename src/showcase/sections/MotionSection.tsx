import { Section, Demo } from '@/showcase/Section'

const SLOTS = ['Entrance', 'Stagger', 'Hover', 'Reveal', 'Counter', 'Background']

export function MotionSection() {
  return (
    <Section
      id="motion"
      eyebrow="09 — Motion"
      title="Motion"
      lead="Cleared for a fresh motion direction. The slots below are reserved — durations, easings and presets will be defined here next."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SLOTS.map((label) => (
          <Demo key={label} label={label}>
            <div className="grid min-h-[120px] place-items-center">
              <span className="font-mono text-caption text-fg-subtle">awaiting motion direction</span>
            </div>
          </Demo>
        ))}
      </div>
      <p className="mt-8 text-center font-mono text-caption text-fg-subtle">
        Motion intentionally blank — pending direction.
      </p>
    </Section>
  )
}
