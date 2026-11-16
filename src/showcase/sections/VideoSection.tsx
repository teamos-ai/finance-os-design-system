/**
 * VideoSection — "the platform, in motion". The front-door explainer moment: the Finance OS
 * "My Account" workspace (BrandDashboard, mirroring brand.financeos.au) FLOATING on its own — no
 * demo box, no inspector, no token chrome — that you FLIP straight to the product explainer video
 * (it plays on the flip). This copy exists purely for a viewer to interact with; it is NOT a DS
 * specimen, so it carries no tokens. The tokenised, documented copy lives in Dashboard Layouts
 * (`#dashboards` → "My Account workspace"). Reduced-motion: the faces cross-fade instead of rotating.
 */
import * as React from 'react'
import { Play, RotateCw } from 'lucide-react'
import { Section } from '@/showcase/Section'
import { Button } from '@/components/ui/button'
import { FlipCard } from '@/components/platform-dashboard/FlipCard'
import { BrandDashboard } from '@/components/platform-dashboard/BrandDashboard'
import { ScaleToFit } from '@/components/platform-dashboard/ScaleToFit'

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
      {/* The dashboard floats on its own — card → control, nothing around it (brand.financeos.au parity). */}
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5">
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
    </Section>
  )
}
