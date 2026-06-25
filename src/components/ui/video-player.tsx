/**
 * VideoPlayer — a clean, iOS-inspired video frame. Empty state shows a soft poster wash
 * with a centred play button; once a real file + poster load, a white play overlay sits
 * over the poster (tap to play). Scroll-to-PiP: while playing and scrolled past, it docks
 * to a bottom-right mini-player and keeps playing, then returns inline. 8px squircle, zero glass.
 */
import * as React from 'react'
import { Play, X, Minimize2 } from 'lucide-react'
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
  const [ready, setReady] = React.useState(false)

  // dock to PiP only while playing AND the inline frame is mostly scrolled away
  const floating = playing && !visible

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
    <div
      ref={anchorRef}
      className={cn(
        'relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-canvas shadow-lg',
        className,
      )}
    >
      {/* placeholder shown in the inline frame while the video is docked away */}
      {floating && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-canvas-muted font-mono text-caption text-fg-subtle">
          <Minimize2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          Playing in mini-player
        </div>
      )}

      <div
        className={cn(
          floating
            ? 'fixed bottom-6 right-6 z-50 aspect-video w-[min(360px,82vw)] overflow-hidden rounded-lg border border-border bg-inverse shadow-lg'
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
          onCanPlay={() => setReady(true)}
          className="h-full w-full bg-inverse object-contain"
        />

        {/* empty state — soft poster wash + theme-aware play button (no video yet) */}
        {!ready && (
          <button
            type="button"
            aria-label="Play video"
            onClick={play}
            className="group absolute inset-0 grid place-items-center bg-gradient-to-br from-surface to-canvas-muted focus-visible:outline-none"
          >
            <span className="grid h-20 w-20 place-items-center rounded-full bg-fg/10 ring-1 ring-fg/20 transition-transform duration-base ease-out group-hover:scale-105">
              <Play className="ml-1 h-8 w-8 fill-current text-fg" strokeWidth={0} aria-hidden />
            </span>
          </button>
        )}

        {/* loaded poster — white play overlay (tap to play), hides once playing */}
        {ready && !playing && (
          <button
            type="button"
            aria-label="Play video"
            onClick={play}
            className="group absolute inset-0 grid place-items-center bg-black/10 focus-visible:outline-none"
          >
            <span className="grid h-20 w-20 place-items-center rounded-full bg-white/25 ring-1 ring-white/40 transition-transform duration-base ease-out group-hover:scale-105">
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
  )
}
