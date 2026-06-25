/**
 * VideoSection — one clean, iOS-inspired video with scroll-to-PiP (docks to a bottom-right
 * mini-player while you scroll and keeps playing). Drop the real file into /public/media.
 */
import { Section } from '@/showcase/Section'
import { VideoPlayer } from '@/components/ui/video-player'

export function VideoSection() {
  return (
    <Section id="video" eyebrow="01 — VIDEO" title="Is Now a Bad Time To...">
      <p className="mx-auto mb-8 max-w-2xl text-center font-body text-body-lg leading-relaxed text-fg-muted">
        Get more finance leads, settle more loans, nurture more clients and get more referrals because
        you have automated more of your back-end operations than ever before?
      </p>
      <div className="mx-auto max-w-4xl">
        <VideoPlayer src="/media/overview.mp4" poster="/media/overview-poster.jpg" />
      </div>
    </Section>
  )
}
