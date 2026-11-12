/**
 * PositioningHeroSection — the brand-positioning hero, built from the same tokens as the rest of
 * the system so the two documents read as ONE surface. A pure-canvas topographic contour map with
 * a pointer-following magnifier loupe (ported from the brand hero, see
 * src/components/positioning-hero/), a prominent command-bar fuzzy search over the positioning, a
 * mono "Finance OS · Brand Positioning" overline, a headline with a single Atlas-Blue phrase, a
 * calm sign-off, and a gentle fade into the white below the fold.
 *
 * Content is the real positioning (src/data/positioning.ts) — nothing about the hero is hardcoded.
 */
import { Section, Demo } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { FadeIn } from '@/lib/motion'
import { ContourField } from '@/components/positioning-hero/ContourField'
import { PositioningSearch, type SearchEntry } from '@/components/positioning-hero/PositioningSearch'
import { hero, sections } from '@/data/positioning'

/** The fuzzy index: the ten positioning sections (numbered) plus the four positioning options. */
const ENTRIES: SearchEntry[] = [
  ...sections.map((s) => ({ id: `section-${s.n}`, label: s.title, kind: 'Section' as const, meta: s.n })),
  ...hero.searchTags.map((t, i) => ({ id: `option-${i}`, label: t, kind: 'Option' as const })),
]

/** The headline with its one approved phrase carrying the Atlas-Blue type highlight. */
function HeroHeadline() {
  const i = hero.headline.indexOf(hero.highlight)
  if (i < 0) return <>{hero.headline}</>
  return (
    <>
      {hero.headline.slice(0, i)}
      <span className="text-highlight">{hero.highlight}</span>
      {hero.headline.slice(i + hero.highlight.length)}
    </>
  )
}

const INSPECT = {
  name: 'Positioning Hero',
  explain:
    'The brand-positioning hero: a tokenised topographic contour canvas with a pointer-following magnifier loupe, a command-bar fuzzy search across the positioning, and a headline with one Atlas-Blue phrase. Use it to open the positioning as one surface with the design system. Reduced-motion renders the map static with no loupe.',
  token:
    '--c-canvas  → contour paper (map fill)\n' +
    '--c-fg      → contour ink (loupe rim, grid)\n' +
    '--c-accent  → contour lines + text-highlight phrase\n' +
    'CommandBar · Section · Demo · MonoLabel (mono overline)\n' +
    'fade: color-mix(in srgb, var(--c-canvas) …) → to white at the fold\n' +
    'radius: rounded-lg (8px max) · neutral :focus-visible ring',
  code: [
    "import { ContourField } from '@/components/positioning-hero/ContourField'",
    "import { PositioningSearch } from '@/components/positioning-hero/PositioningSearch'",
    "import { hero } from '@/data/positioning'",
    '',
    '<ContourField seed={7}>',
    '  <MonoLabel>{hero.overline}</MonoLabel>',
    '  <h3 className="font-display text-display-xl text-fg">',
    '    Set up your CRM around <span className="text-highlight">{hero.highlight}</span>.',
    '  </h3>',
    '  <PositioningSearch entries={ENTRIES} tags={hero.searchTags} />',
    '</ContourField>',
  ].join('\n'),
}

export function PositioningHeroSection() {
  return (
    <Section
      id="positioning-hero"
      eyebrow="Positioning"
      title="Positioning hero"
      lead="The brand-positioning hero, drawn from the same tokens as every other section: a topographic survey map with a magnifier that follows the pointer, a command-bar search across the positioning, and a single blue-highlighted line. It makes the positioning and the design system read as one system."
    >
      <Demo
        label="Positioning hero — contour map · magnifier loupe · fuzzy positioning search"
        padded={false}
        inspect={INSPECT}
      >
        <ContourField seed={7}>
          <div className="mx-auto flex min-h-[32rem] max-w-3xl flex-col items-center justify-center gap-6 px-6 py-20 text-center md:min-h-[40rem] md:py-28">
            <FadeIn>
              <MonoLabel>{hero.overline}</MonoLabel>
            </FadeIn>

            <FadeIn delay={0.06}>
              <h3 className="max-w-[20ch] font-display text-display-lg leading-[1.06] text-fg md:text-display-xl">
                <HeroHeadline />
              </h3>
            </FadeIn>

            <FadeIn delay={0.12} className="w-full max-w-xl">
              <PositioningSearch entries={ENTRIES} tags={hero.searchTags} placeholder={hero.searchPlaceholder} />
            </FadeIn>

            <FadeIn delay={0.18}>
              <p className="font-mono text-mono-xs uppercase tracking-[0.18em] text-fg-subtle">{hero.signoff}</p>
            </FadeIn>
          </div>
        </ContourField>
      </Demo>
    </Section>
  )
}
