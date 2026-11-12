/**
 * ThisVsThatSection — the green/red "this vs that" positioning surface. Two paired comparisons
 * drawn straight from the signed-off positioning: how the brand SOUNDS (voice — sounds like us
 * vs does not) and how it BEHAVES (brand rules — what we always do vs the lines we do not cross).
 *
 * Green is --c-success, red is --c-danger: functional signals that carry the comparison, while
 * Atlas Blue stays the only brand accent and owns the single type highlight in the copy. Content
 * is imported verbatim from src/data/positioning.ts — never retyped here. No ribbons, full
 * hairline borders, 8px squircles, calm reveals: one system with the rest of the showcase.
 */
import type { ReactNode } from 'react'
import { Section, Demo } from '@/showcase/Section'
import { ComparePair } from '@/components/this-vs-that/ThisVsThat'
import { voice, rules } from '@/data/positioning'

/** Inline blue highlight pill — blue owns every typographic highlight in the system. */
function Hl({ children }: { children: ReactNode }) {
  return (
    <span className="whitespace-nowrap rounded-sm border border-border bg-surface px-1.5 font-semibold text-accent-text">
      {children}
    </span>
  )
}

/** The inspect payload floated over the key (voice) demo. */
const VOICE_INSPECT = {
  name: 'This vs That — Voice comparison',
  explain:
    'The green/red this-vs-that: a success "keep" column of tick rows beside a danger "avoid" column of cross rows, each led by a count chip. Green and red are functional signals only — the sole brand accent stays Atlas Blue, which owns the one type highlight in the copy.',
  token: [
    '--c-success        green KEEP signal (tick glyphs + count chip)',
    '--c-success-soft   soft green header band + row tiles',
    '--c-danger         red AVOID signal (cross glyphs + count chip)',
    '--c-danger-soft    soft red header band + row tiles',
    '--c-accent #33488F the only brand accent (type highlight)',
    '--radius-sm 4px    glyph tiles · --radius-lg 8px  panel',
  ].join('\n'),
  code: [
    "import { ComparePair } from '@/components/this-vs-that/ThisVsThat'",
    "import { voice } from '@/data/positioning'",
    '',
    '<ComparePair',
    "  keep={{ tone: 'keep', title: 'Sounds like us', countWord: 'to keep', items: voice.soundsLike }}",
    "  avoid={{ tone: 'avoid', title: 'Does not sound like us', countWord: 'to avoid', items: voice.doesNot }}",
    '/>',
  ].join('\n'),
}

export function ThisVsThatSection() {
  return (
    <Section
      id="this-vs-that"
      eyebrow="This vs That"
      title="This vs That"
      lead="Two comparisons, drawn straight from the signed-off positioning: how the brand sounds, and how it behaves — each line set against its opposite. Green marks what we keep, red what we avoid. Both are functional signals; the one brand accent stays Atlas Blue."
    >
      <div className="flex flex-col gap-8">
        {/* Voice — the key demo, carries the inspector */}
        <Demo label="Voice — how we sound, and how we never sound" inspect={VOICE_INSPECT}>
          <ComparePair
            keep={{ tone: 'keep', title: 'Sounds like us', countWord: 'to keep', items: voice.soundsLike }}
            avoid={{ tone: 'avoid', title: 'Does not sound like us', countWord: 'to avoid', items: voice.doesNot }}
          />
          <p className="mt-3 font-body text-caption leading-relaxed text-fg-subtle">
            Wording shown verbatim from <Hl>Voice &amp; tone</Hl> — positioning section 07.
          </p>
        </Demo>

        {/* Brand rules — what we always do, and the lines we do not cross */}
        <Demo label="Brand rules — what we always do, and the lines we do not cross">
          <ComparePair
            keep={{ tone: 'keep', title: 'What we will always do', countWord: 'to keep', items: rules.alwaysDo }}
            avoid={{ tone: 'avoid', title: 'The lines we do not cross', countWord: 'to avoid', items: rules.doNotCross }}
          />
          <p className="mt-3 font-body text-caption leading-relaxed text-fg-subtle">
            Wording shown verbatim from <Hl>Brand rules</Hl> — positioning section 09. These govern our own
            marketing conduct, not a claim about anyone else.
          </p>
        </Demo>
      </div>
    </Section>
  )
}
