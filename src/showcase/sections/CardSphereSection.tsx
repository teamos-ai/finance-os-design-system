/**
 * CardSphereSection — the interactive Card Sphere, catalogued as a reusable Library asset.
 *
 * A draggable sphere of flat, tokenised cards (one per part of the system). It is the Overview's
 * floating centrepiece; here it is documented as a grabbable component — a live demo, its token/prop
 * reference inline, and the "+" inspector with usage + code. Reusable as a hero or feature centrepiece.
 */
import * as React from 'react'
import { Section, Demo } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { TokenTag } from '@/components/ui/token-tag'
import type { InspectData } from '@/components/ui/inspectable'
import CardSphere from './overview/CardSphere'

const INSPECT: InspectData = {
  name: 'Card sphere',
  explain:
    'A draggable sphere of flat cards — one per part of the system. Drag, flick or arrow-key to turn it; it coasts and settles a card to the front, reports it through onSettle, then drifts gently. Card faces are tokenised SVG / CSS (no photos, no glass); prefers-reduced-motion freezes the idle drift. Pairs with <TiltCard> for the bento beside it.',
  token: [
    '<CardSphere onSettle={(label) => …} />',
    'faces   --c-surface · --c-gradient-accent · --c-inverse-bg',
    'glyphs  currentColor · radius --radius-lg (8px)',
    'depth   --shadow-md / --shadow-glow / --shadow-lg  (never glass)',
    'a11y    role=application · drag / arrow-keys · reduced-motion safe',
  ].join('\n'),
  code: [
    "import CardSphere from '@/showcase/sections/overview/CardSphere'",
    '',
    'const [showing, setShowing] = React.useState("Typography")',
    '',
    '<div className="h-[clamp(360px,52vw,520px)]">',
    '  <CardSphere onSettle={setShowing} />',
    '</div>',
  ].join('\n'),
}

export function CardSphereSection() {
  const [showing, setShowing] = React.useState('Typography')

  return (
    <Section
      id="card-sphere"
      eyebrow="Card Sphere"
      title="Card sphere"
      lead="An interactive sphere of flat, tokenised cards — one per part of the system. Drag, flick or use the arrow keys to turn it; it settles a card to the front and drifts gently. Lift it as a hero or feature centrepiece; every face composes from the same tokens, with no photos and no glass."
    >
      <Demo
        label="Interactive card sphere — drag, flick or arrow-key to turn"
        padded={false}
        action={<TokenTag>{'<CardSphere onSettle>'}</TokenTag>}
        inspect={INSPECT}
      >
        <div className="relative h-[clamp(360px,52vw,520px)] bg-canvas-muted">
          <CardSphere onSettle={setShowing} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 p-4 text-center">
            <MonoLabel tone="subtle" size="sm">Showing</MonoLabel>
            <span className="font-display text-title-sm text-fg">{showing}</span>
          </div>
        </div>
      </Demo>
    </Section>
  )
}
