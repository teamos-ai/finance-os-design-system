/**
 * VideoPlayer — an iOS-inspired video held in a soft matte frame. The frame is a white
 * passe-partout on the dark ground, and a bordered elevated surface on light/paper
 * (where a pure-white frame would vanish into the canvas, so a hairline border + shadow
 * defines it instead). A frosted-glass play button — Apple-style: translucent white +
 * backdrop-blur + a crisp white triangle — sits centred until playback.
 * Scroll-to-PiP: while playing AND scrolled past, the single <video> relocates to a fixed
 * bottom-right mini-player and keeps playing, then returns inline. 6/8px squircles.
 */
import * as React from 'react'
import { Play, X, Minimize2 } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/cn'

export interface VideoPlayerProps {
  /** path to the video, e.g. "/media/overview.mp4" (drop the file in /public/media) */
  src?: string
  poster?: string
  className?: string
}

export const VideoPlayer = ({ src, poster, className }: VideoPlayerProps) => {
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = React.useState(false)
  const [visible, setVisible] = React.useState(true)
  const { theme } = useTheme()

  // dock to PiP only while playing AND the inline frame is mostly scrolled away
  const floating = playing && !visible

  // Matte frame, theme-aware: a clean white mat on the dark ground; on light/paper a
  // pure-white mat would disappear, so we define the frame with a hairline border + lift.
  const frameTone = theme === 'dark' ? 'bg-white' : 'bg-surface border border-border'

  React.useEffect(() => {
    const el = anchorRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.intersectionRatio >= 0.5), {
      threshold: [0, 0.5, 1],
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const play = () => videoRef.current?.play().catch(() => {})

  return (
    <div className={cn('w-full', className)}>
      {/* matte frame — wraps every video on all three grounds */}
      <div className={cn('rounded-lg p-2.5 shadow-lg sm:p-3', frameTone)}>
        {/* aspect box stays inline so the frame keeps its height while the video is docked */}
        <div ref={anchorRef} className="relative aspect-video w-full overflow-hidden rounded-md bg-inverse">
          {/* placeholder shown inline while the video is docked away to the mini-player */}
          {floating && (
            <div className="absolute inset-0 flex items-center justify-center gap-2 font-mono text-caption text-fg-subtle">
              <Minimize2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              Playing in mini-player
            </div>
          )}

          {/* the single relocating <video> — inline (absolute) or docked (fixed) */}
          <div
            className={cn(
              floating
                ? 'fixed bottom-6 right-6 z-50 aspect-video w-[min(360px,82vw)] overflow-hidden rounded-lg bg-inverse shadow-lg ring-1 ring-white/15'
                : 'absolute inset-0',
            )}
          >
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              controls
              playsInline
              preload="metadata"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              className="h-full w-full bg-inverse object-contain"
            />

            {/* frosted-glass play button (Apple/iOS) — sits over poster or dark panel until playing */}
            {!playing && (
              <button
                type="button"
                aria-label="Play video"
                onClick={play}
                className="group absolute inset-0 grid place-items-center focus-visible:outline-none"
              >
                {/* rounded-[50%] (not rounded-full — the token-locked config drops `full`):
                    a circular media control is the deliberate exception to the squircle scale. */}
                <span className="grid h-20 w-20 place-items-center rounded-[50%] bg-white/20 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.55)] ring-1 ring-white/40 backdrop-blur-md transition duration-base ease-out group-hover:scale-105 group-hover:bg-white/30 group-focus-visible:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-white">
                  <Play className="ml-1 h-8 w-8 fill-white text-white" strokeWidth={0} aria-hidden />
                </span>
              </button>
            )}

            {/* close the mini-player (pauses, returns inline) */}
            {floating && (
              <button
                type="button"
                aria-label="Close mini player"
                onClick={() => videoRef.current?.pause()}
                className="absolute right-1.5 top-1.5 z-10 grid h-7 w-7 place-items-center rounded-md bg-inverse/80 text-inverse-fg transition-colors hover:bg-inverse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              >
                <X className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
