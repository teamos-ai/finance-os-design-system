/**
 * VideoSection — documents the VideoPlayer in a squircle frame: poster + hint empty
 * state, a caption row beneath the demo, and a reduced-motion note. The showcase IS
 * the documentation, so the live player sits above small token-named usage notes.
 */
import { Captions, Accessibility, Image as ImageIcon, MonitorPlay } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { VideoPlayer } from '@/components/ui/video-player'
import { BRAND } from '@/data/system'

interface PlayerNote {
  Icon: typeof Captions
  label: string
  body: string
}

const NOTES: PlayerNote[] = [
  {
    Icon: MonitorPlay,
    label: 'VideoPlayer',
    body: 'Hairline squircle frame (rounded-md, border-border, bg-canvas). Native controls, preload="metadata", and scroll-to-PiP that docks to a bottom-right mini-player while playing.',
  },
  {
    Icon: ImageIcon,
    label: 'Poster',
    body: 'A poster frame fills the empty state before playback. Until the file can play, an accent-soft placeholder with a Play glyph stands in — drop overview.mp4 into /public/media.',
  },
  {
    Icon: Captions,
    label: 'Captions',
    body: 'Pair the source with a <track kind="captions"> WebVTT file so every walkthrough is legible without sound. The caption row below mirrors that intent for the demo.',
  },
  {
    Icon: Accessibility,
    label: 'Reduced motion',
    body: 'The docking transition is decorative. Under prefers-reduced-motion the player holds inline — controls, poster and captions still carry the full message.',
  },
]

export function VideoSection() {
  return (
    <Section
      id="video"
      eyebrow="11 - Video"
      title="The system in motion"
      lead="A tokenized video player framed in an 8px squircle — poster, native controls, captions, and a reduced-motion fallback that never hides the message."
    >
      <Demo label="VideoPlayer / overview.mp4" action={<MonoLabel tone="subtle">16:9</MonoLabel>}>
        <VideoPlayer
          src="/media/overview.mp4"
          poster="/media/overview-poster.jpg"
          hint="Your walkthrough goes here — drop overview.mp4 in /public/media"
        />

        {/* Caption row — mirrors the <track kind="captions"> the production player ships with */}
        <div className="mt-4 flex flex-col gap-3 rounded-md border border-subtle bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <Captions className="mt-0.5 h-4 w-4 shrink-0 text-accent-text" strokeWidth={1.5} aria-hidden />
            <p className="font-body text-body-sm text-fg-muted">
              <span className="text-fg">{BRAND.name} — a guided walkthrough.</span>{' '}
              {BRAND.oneLiner} Captions on by default.
            </p>
          </div>
          <MonoLabel tone="success" dot>
            CC · EN
          </MonoLabel>
        </div>
      </Demo>

      {/* Usage notes — player, poster, captions, reduced-motion fallback */}
      <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
        {NOTES.map(({ Icon, label, body }) => (
          <div key={label} className="flex gap-3 bg-canvas p-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent-text">
              <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            </span>
            <div>
              <MonoLabel tone="accent" number="//">
                {label}
              </MonoLabel>
              <p className="mt-1.5 font-body text-body-sm leading-relaxed text-fg-muted">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center font-mono text-caption text-fg-subtle">
        Drop <span className="text-fg-muted">overview.mp4</span> and{' '}
        <span className="text-fg-muted">overview-poster.jpg</span> into{' '}
        <span className="text-fg-muted">/public/media</span> to light up the frame.
      </p>
    </Section>
  )
}
