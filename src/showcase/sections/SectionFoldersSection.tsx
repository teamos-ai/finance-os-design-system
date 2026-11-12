/**
 * SectionFoldersSection — the Positioning surface that files the brand positioning's ten sections
 * as folders. It reads as one system with the rest of the showcase (the DS Section frame, a mono
 * eyebrow, an inspect payload) and with the brand positioning itself (the real `sections` data).
 * Each folder shows its number, title and a Decided/Open status chip, and lifts open on hover,
 * focus or press. Amber is the one status signal; everything else is --c-* tokens and mist washes.
 */
import { Section, Demo } from '@/showcase/Section'
import { Stagger, StaggerItem } from '@/lib/motion'
import { Badge } from '@/components/ui/badge'
import type { InspectData } from '@/components/ui/inspectable'
import { sections } from '@/data/positioning'
import { SectionFolder } from '@/components/section-folders/SectionFolder'

const INSPECT: InspectData = {
  name: 'Section folder',
  explain:
    'One folder per positioning section — a mist tab, a Decided/Open status chip, and a calm raise-and-hinge on hover, focus or press that cracks a sliver of mist and reveals the section’s status. Amber is the single status signal (sections still carrying open or deferred blocks); everything else composes from the --c-* tokens and the shared mist washes. Use it as the overview that files the brand positioning inside the design system.',
  token: [
    'tab        bg-wash-mist / bg-wash-haze   (--wash-mist · --wash-haze)',
    'body       bg-elevated · border-border → border-border-strong',
    'elevation  shadow-sm → shadow-md         (--shadow-sm · --shadow-md)',
    'open chip  amber-soft / amber-text        (--c-amber-soft · --c-amber-text)',
    'radius     rounded-lg (8px ceiling) · rounded-t-md tab',
    'motion     transform + opacity · var(--ease-out) · ≤ 400ms · reduced-motion safe',
  ].join('\n'),
  code: `import { sections } from '@/data/positioning'
import { SectionFolder } from '@/components/section-folders/SectionFolder'

<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
  {sections.map((s, i) => (
    <SectionFolder key={s.n} n={s.n} title={s.title} status={s.status} index={i} />
  ))}
</div>`,
}

export function SectionFoldersSection() {
  return (
    <Section
      id="section-folders"
      eyebrow="Positioning"
      title="Section folders"
      lead="The ten sections of the signed-off brand positioning, filed as folders. Hover, focus or open one to lift it; amber marks the sections still carrying open or deferred items, the rest are decided."
    >
      <div className="flex flex-col gap-6">
        <Demo label="Positioning sections · folder overview" inspect={INSPECT}>
          <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section, i) => (
              <StaggerItem key={section.n}>
                <SectionFolder n={section.n} title={section.title} status={section.status} index={i} />
              </StaggerItem>
            ))}
          </Stagger>
        </Demo>

        {/* legend — the two states in the same amber / neutral language as the chips */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5">
          <span className="inline-flex items-center gap-2">
            <Badge variant="neutral" size="sm" dot>
              Decided
            </Badge>
            <span className="font-body text-body-sm text-fg-subtle">Signed off, no open blocks</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <Badge variant="amber" size="sm" dot>
              Open
            </Badge>
            <span className="font-body text-body-sm text-fg-subtle">Still carries deferred or illustrative blocks</span>
          </span>
        </div>
      </div>
    </Section>
  )
}
