/**
 * PlatformDashboardSection — "the platform in motion". A broker operating-system window you
 * can FLIP: the front is a live app-shell mock (sidebar nav, stat tiles with sparklines, an
 * enquiries bar chart, a workspace card, an interactive task checklist and a new-enquiries
 * list); the back is a plain-language overview drawn from the brand positioning. A "Watch the
 * demo video" button opens the product demo in a modal.
 *
 * This is the bridge between the Design System and the Brand Positioning: it reuses the same
 * tokens and kit as every other section, and composes its content from src/data/positioning.ts
 * (the signed-off positioning), so the two documents read as ONE system. The flip is a
 * reduced-motion-safe 3D rotate; every figure, task and name is illustrative sample data.
 *
 * Brand: Atlas Blue is the only accent and owns all data + type highlight; green marks one
 * movement; amber marks exactly one at-risk moment (the overdue task · status only); neutral
 * focus rings; 8px-max squircles; hairline borders + layered shadows; no glass, no ribbons.
 */
import * as React from 'react'
import { Play, RotateCw } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MonoLabel } from '@/components/ui/mono-label'
import { BreathingDot } from '@/lib/motion'
import { FlipCard } from '@/components/platform-dashboard/FlipCard'
import { DemoVideoModal } from '@/components/platform-dashboard/DemoVideoModal'
import { PlatformAppShell, PlatformOverview } from '@/components/platform-dashboard/PlatformDashboard'
import type { InspectData } from '@/components/ui/inspectable'
import { dashboard } from '@/data/positioning'

/** The product demo video (Finance OS brand CDN). Opened in a modal, never autoplayed inline. */
const DEMO_VIDEO = 'https://assets.cdn.filesafe.space/IFdDIBwoeb3jK7YtcUuh/media/6aab6cab42c38177da7c5ef6.mp4'

const PLATFORM_INSPECT: InspectData = {
  name: 'Platform dashboard',
  explain:
    'The platform in motion — a broker app-shell (sidebar nav, stat tiles with sparklines, an enquiries bar chart, a workspace card, an interactive task checklist and a new-enquiries list) that flips to a plain-language overview. The flip is a reduced-motion-safe 3D rotate (it cross-fades instead when motion is reduced); the Watch button opens the product demo in a modal. Content is composed from the signed-off positioning; the figures, tasks and names are illustrative sample data.',
  token: [
    'window     rounded-lg · border-border · bg-canvas-muted   (product ground)',
    'cards      bg-surface · border-border · shadow-sm         (hairline + lift, no glass)',
    'figures    font-display · tabular-nums · CountUp on view',
    'data       text-accent (Atlas Blue via currentColor)      bar chart + sparklines',
    'movement   Badge variant="success"                        (green · one per view)',
    'at-risk    Badge variant="amber"                          (one overdue task · status only)',
    'flip       rotateY 0↔180 · preserve-3d · backface-hidden  → reduced: cross-fade',
  ].join('\n'),
  code: [
    'const [flipped, setFlipped] = React.useState(false)',
    'const [videoOpen, setVideoOpen] = React.useState(false)',
    '',
    '<FlipCard',
    '  flipped={flipped}',
    '  front={<PlatformAppShell />}',
    '  back={<PlatformOverview onWatch={() => setVideoOpen(true)} onFlip={() => setFlipped(f => !f)} />}',
    '/>',
    '<DemoVideoModal open={videoOpen} onClose={() => setVideoOpen(false)} title="…" src={DEMO_VIDEO} />',
  ].join('\n'),
  download: {
    filename: 'platform-dashboard-usage.tsx',
    content: [
      "import * as React from 'react'",
      "import { FlipCard } from '@/components/platform-dashboard/FlipCard'",
      "import { DemoVideoModal } from '@/components/platform-dashboard/DemoVideoModal'",
      "import { PlatformAppShell, PlatformOverview } from '@/components/platform-dashboard/PlatformDashboard'",
      '',
      'export function PlatformInMotion() {',
      '  const [flipped, setFlipped] = React.useState(false)',
      '  const [videoOpen, setVideoOpen] = React.useState(false)',
      '  return (',
      '    <>',
      '      <FlipCard',
      '        flipped={flipped}',
      '        front={<PlatformAppShell />}',
      '        back={<PlatformOverview onWatch={() => setVideoOpen(true)} onFlip={() => setFlipped((f) => !f)} />}',
      '      />',
      '      <DemoVideoModal',
      '        open={videoOpen}',
      '        onClose={() => setVideoOpen(false)}',
      '        title="Finance OS — product demo"',
      "        src='https://assets.cdn.filesafe.space/IFdDIBwoeb3jK7YtcUuh/media/6aab6cab42c38177da7c5ef6.mp4'",
      '      />',
      '    </>',
      '  )',
      '}',
    ].join('\n'),
  },
}

export function PlatformDashboardSection() {
  const [flipped, setFlipped] = React.useState(false)
  const [videoOpen, setVideoOpen] = React.useState(false)
  const openVideo = () => setVideoOpen(true)
  const flip = () => setFlipped((f) => !f)

  return (
    <Section
      id="platform-dashboard"
      eyebrow="Platform"
      title="Platform Dashboard"
      lead="The platform in motion — a broker operating-system window built from the same tokens as the rest of the kit. Flip it to see what Finance OS does in plain language, or watch the product demo. It composes its content from the signed-off positioning, so the design system and the brand page read as one."
    >
      <div className="flex flex-col gap-5">
        <Demo label="Platform in motion — flip the card, or watch the demo" inspect={PLATFORM_INSPECT}>
          <div className="flex flex-col gap-4">
            {/* control row — live cue + the two gestures the user loves */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="inline-flex items-center gap-2">
                <BreathingDot />
                <MonoLabel tone="subtle">Live workspace preview</MonoLabel>
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openVideo}
                  leadingIcon={<Play className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />}
                >
                  Watch the demo video
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={flip}
                  aria-pressed={flipped}
                  leadingIcon={<RotateCw className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />}
                >
                  {flipped ? 'Show the dashboard' : 'Flip the card'}
                </Button>
              </div>
            </div>

            <FlipCard
              flipped={flipped}
              front={<PlatformAppShell />}
              back={<PlatformOverview onWatch={openVideo} onFlip={flip} />}
            />
          </div>
        </Demo>

        {/* illustrative-data disclosure (brand rule 09) */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Badge variant="outline" size="sm">
            Illustrative product interface · sample data
          </Badge>
          <p className="max-w-3xl font-body text-caption leading-relaxed text-fg-subtle">{dashboard.note}</p>
        </div>
      </div>

      <DemoVideoModal open={videoOpen} onClose={() => setVideoOpen(false)} title="Finance OS — product demo" src={DEMO_VIDEO} />
    </Section>
  )
}
