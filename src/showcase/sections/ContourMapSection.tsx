/**
 * ContourMapSection — the topographic contour background on its own (Library → Images &
 * Backgrounds → Contour Map). The same pure-canvas field that powers the Contour Hero, shown as a
 * reusable background you can drop behind any section. Token-driven (paper = canvas, ink = fg,
 * lines = accent), reduced-motion safe (static map, no loupe). No image asset — it is drawn.
 */
import { Section, Demo } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { ContourField } from '@/components/positioning-hero/ContourField'
import type { InspectData } from '@/components/ui/inspectable'

const INSPECT: InspectData = {
  name: 'Contour Map',
  explain:
    'A pure-canvas topographic survey map, drawn from the tokens — there is no image file. A pointer-following magnifier loupe reveals a finer grid beneath. Use it as a full-bleed background behind a hero or a band; it also backs the Contour Hero under Website Sections. Reduced-motion renders it static with no loupe.',
  token: [
    '--c-canvas → paper (map fill)',
    '--c-fg     → ink (loupe rim, fine grid)',
    '--c-accent → contour lines',
    'seed       → deterministic terrain (same seed = same map)',
    'motion     → loupe follows pointer · reduced-motion → static',
  ].join('\n'),
  code: [
    "import { ContourField } from '@/components/positioning-hero/ContourField'",
    '',
    '<ContourField seed={7}>',
    '  {/* any content rides on top */}',
    '</ContourField>',
  ].join('\n'),
}

export function ContourMapSection() {
  return (
    <Section
      id="contour-map"
      eyebrow="Contour Map"
      title="Contour Map"
      lead="The topographic background that powers the Contour Hero, on its own — a reusable, fully-tokenised canvas you can place behind any section. It is drawn from the tokens, not an image, so it scales and recolours with the system."
    >
      <Demo label="Contour map — tokenised canvas background · pointer loupe" padded={false} inspect={INSPECT}>
        <ContourField seed={7}>
          <div className="flex min-h-[22rem] flex-col items-center justify-center gap-3 px-6 py-16 text-center md:min-h-[26rem]">
            <MonoLabel>Images &amp; Backgrounds · Contour Map</MonoLabel>
            <p className="max-w-md font-body text-body-md text-fg-muted">
              Move your pointer across the map — the magnifier reveals the grid beneath. Drop any content on top.
            </p>
          </div>
        </ContourField>
      </Demo>
    </Section>
  )
}
