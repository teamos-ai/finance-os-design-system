/**
 * VideoSection — "the platform, in motion". The promo moment: a broker operating-system
 * window you can FLIP straight to the product demo video (it plays on the flip), mirroring
 * brand.financeos.au. Front = a live app-shell mock (sidebar, stat tiles with sparklines, an
 * enquiries chart, a workspace card, a task checklist, a new-enquiries list); back = the demo
 * video. Reduced-motion: the faces cross-fade instead of rotating; the video still plays.
 *
 * Replaces the old static "video placeholder". Composes from the same tokens + kit as the rest
 * of the system and from src/data/positioning.ts, so the DS and the brand page read as one.
 * Every figure/name on the dashboard is illustrative sample data (brand rule 09).
 */
import * as React from 'react'
import { Play, RotateCw } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MonoLabel } from '@/components/ui/mono-label'
import { BreathingDot } from '@/lib/motion'
import { FlipCard } from '@/components/platform-dashboard/FlipCard'
import { PlatformAppShell } from '@/components/platform-dashboard/PlatformDashboard'
import type { InspectData } from '@/components/ui/inspectable'
import { dashboard } from '@/data/positioning'

/** The product demo video (Finance OS brand CDN) — plays on the flip. */
const DEMO_VIDEO = 'https://assets.cdn.filesafe.space/IFdDIBwoeb3jK7YtcUuh/media/6aab6cab42c38177da7c5ef6.mp4'

/** The flip's back face: the demo video, played when the card is flipped and paused when not. */
function DemoVideoBack({ playing }: { playing: boolean }) {
  const ref = React.useRef<HTMLVideoElement>(null)
  React.useEffect(() => {
    const v = ref.current
    if (!v) return
    if (playing) {
      const p = v.play()
      if (p && p.catch)
        p.catch(() => {
          v.muted = true
          v.play().catch(() => {})
        })
    } else {
      try {
        v.pause()
      } catch {
        /* ignore */
      }
    }
  }, [playing])
  return (
    <video
      ref={ref}
      src={DEMO_VIDEO}
      controls
      playsInline
      preload="none"
      className="aspect-video h-full w-full rounded-lg border border-border bg-inverse object-cover"
      aria-label="Finance OS product demo"
    />
  )
}

const FLIP_INSPECT: InspectData = {
  name: 'Platform flip',
  explain:
    'The promo moment — a broker app-shell that flips straight to the product demo video (it plays on the flip). The flip is a reduced-motion-safe 3D rotate (it cross-fades when motion is reduced). Front and back are one component each, composed from the signed-off positioning; the dashboard figures are illustrative sample data.',
  token: [
    'flip     rotateY 0↔180 · preserve-3d · backface-hidden   → reduced: cross-fade',
    'front    PlatformAppShell — sidebar · stat tiles · chart · tasks',
    'back     <video> demo (brand CDN) · aspect-video · object-cover · plays on flip',
    'figures  font-display · tabular-nums · CountUp on view',
    'at-risk  Badge variant="amber"  (one overdue task · status only)',
  ].join('\n'),
  code: [
    'const [flipped, setFlipped] = React.useState(false)',
    '',
    '<FlipCard',
    '  flipped={flipped}',
    '  front={<PlatformAppShell />}',
    '  back={<DemoVideoBack playing={flipped} />}',
    '/>',
    '<Button onClick={() => setFlipped((f) => !f)}>',
    '  {flipped ? "Show the dashboard" : "Watch the demo video"}',
    '</Button>',
  ].join('\n'),
}

export function VideoSection() {
  const [flipped, setFlipped] = React.useState(false)
  const flip = () => setFlipped((f) => !f)

  return (
    <Section
      id="video"
      eyebrow="The platform, in motion"
      title="Is Now a Bad Time To…"
      lead="Get more finance leads, settle more loans, nurture more clients and get more referrals because you have automated more of your back-end operations than ever before?"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-5">
        <Demo label="The platform, in motion — flip to the demo" inspect={FLIP_INSPECT}>
          <div className="flex flex-col gap-4">
            {/* control row — live cue + the flip/watch gesture */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="inline-flex items-center gap-2">
                <BreathingDot />
                <MonoLabel tone="subtle">Live workspace preview</MonoLabel>
              </span>
              <Button
                variant={flipped ? 'secondary' : 'primary'}
                size="sm"
                onClick={flip}
                aria-pressed={flipped}
                leadingIcon={
                  flipped ? (
                    <RotateCw className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                  ) : (
                    <Play className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                  )
                }
              >
                {flipped ? 'Show the dashboard' : 'Watch the demo video'}
              </Button>
            </div>

            <FlipCard
              flipped={flipped}
              front={<PlatformAppShell />}
              back={<DemoVideoBack playing={flipped} />}
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
    </Section>
  )
}
