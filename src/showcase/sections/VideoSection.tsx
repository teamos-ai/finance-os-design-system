/**
 * VideoSection — "the platform, in motion". The explainer-video moment: the Finance OS
 * "My Account" workspace (BrandDashboard, mirroring brand.financeos.au) that you FLIP straight
 * to the product explainer video — it plays on the flip. Dashboard and video are a 16:9 landscape
 * card. Reduced-motion: the faces cross-fade instead of rotating; the video still plays.
 *
 * The dashboard is drawn on a fixed 16:9 canvas and scaled to the board by ScaleToFit, so it
 * stays faithful at any width. Every figure/name/avatar on it is illustrative sample data (brand
 * rule 09). Composed from Finance OS tokens, so the DS and the brand page read as one.
 */
import * as React from 'react'
import { Play, RotateCw } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FlipCard } from '@/components/platform-dashboard/FlipCard'
import { BrandDashboard } from '@/components/platform-dashboard/BrandDashboard'
import { ScaleToFit } from '@/components/platform-dashboard/ScaleToFit'
import type { InspectData } from '@/components/ui/inspectable'
import { dashboard } from '@/data/positioning'

/** The product explainer video (Finance OS brand CDN) — plays on the flip. */
const DEMO_VIDEO = 'https://assets.cdn.filesafe.space/IFdDIBwoeb3jK7YtcUuh/media/6aab6cab42c38177da7c5ef6.mp4'

/** The flip's back face: the explainer video, played when flipped and paused when not. 16:9. */
function DemoVideoBack({ playing }: { playing: boolean }) {
  const ref = React.useRef<HTMLVideoElement>(null)
  React.useEffect(() => {
    const v = ref.current
    if (!v) return
    if (playing) {
      // move keyboard focus to the player as it flips in (reference parity)
      try {
        v.focus({ preventScroll: true })
      } catch {
        /* ignore */
      }
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
      className="aspect-video w-full rounded-lg border border-border bg-inverse object-cover shadow-lg"
      aria-label="Finance OS product explainer video"
    />
  )
}

const FLIP_INSPECT: InspectData = {
  name: 'Platform flip',
  explain:
    'The explainer moment — the Finance OS "My Account" workspace (mirroring brand.financeos.au) that flips straight to the product explainer video (it plays on the flip). The flip is a reduced-motion-safe 3D rotate (it cross-fades when motion is reduced). The dashboard is a fixed 16:9 canvas scaled to fit; its figures, names and avatars are illustrative sample data.',
  token: [
    'frame    aspect-video (16:9) · both faces fill it',
    'front    BrandDashboard — fixed 1280×720 canvas, ScaleToFit to board width',
    'back     <video> demo (brand CDN) · object-cover · plays + focuses on flip',
    'rest     subtle 3D tilt rotateX 3° / rotateY -6° · flat ≤600px',
    'order    card → caption → toggle, all below (reference parity)',
    'surfaces --c-surface cards · hairline --c-border · 8px squircles · no glass',
  ].join('\n'),
  code: [
    'const [flipped, setFlipped] = React.useState(false)',
    '',
    '<FlipCard',
    '  flipped={flipped}',
    '  front={<ScaleToFit width={1280} height={720}><BrandDashboard /></ScaleToFit>}',
    '  back={<DemoVideoBack playing={flipped} />}',
    '/>',
    '<Badge variant="outline">Illustrative product interface · sample data</Badge>',
    '<Button onClick={() => setFlipped((f) => !f)}>',
    '  {flipped ? "Back to the dashboard" : "Watch the demo video"}',
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
      title="Video Explainer"
      lead="The Finance OS workspace brokers actually use — flip it to the explainer video for a quick look at how it captures every enquiry, follows up automatically, and nurtures clients through to settlement."
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-5">
        <Demo label="The platform, in motion — flip to the demo video" inspect={FLIP_INSPECT}>
          {/* card → caption → control, stacked top-to-bottom (brand.financeos.au parity) */}
          <div className="flex flex-col items-center gap-4">
            <FlipCard
              className="w-full"
              flipped={flipped}
              front={
                <ScaleToFit width={1280} height={720} className="rounded-lg border border-border shadow-lg">
                  <BrandDashboard />
                </ScaleToFit>
              }
              back={<DemoVideoBack playing={flipped} />}
            />

            <Badge variant="outline" size="sm">
              Illustrative product interface · sample data
            </Badge>

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
              {flipped ? 'Back to the dashboard' : 'Watch the demo video'}
            </Button>
          </div>
        </Demo>

        {/* fuller illustrative-data disclosure (brand rule 09) */}
        <p className="mx-auto max-w-3xl text-center font-body text-caption leading-relaxed text-fg-subtle">
          {dashboard.note}
        </p>
      </div>
    </Section>
  )
}
