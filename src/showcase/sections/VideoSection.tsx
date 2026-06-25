/**
 * VideoSection — a single clean, iOS-inspired placeholder video. Header + frame only;
 * drop the real <video> into the frame later. No chrome, captions or usage notes.
 */
import { Play } from 'lucide-react'
import { Section } from '@/showcase/Section'

export function VideoSection() {
  return (
    <Section id="video" eyebrow="01 — VIDEO" title="Is Now a Bad Time To...">
      <div className="mx-auto max-w-4xl">
        <div className="group relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-gradient-to-br from-surface to-canvas-muted shadow-lg">
          <button
            type="button"
            aria-label="Play video"
            className="absolute inset-0 grid place-items-center"
          >
            <span className="grid h-20 w-20 place-items-center rounded-full bg-fg/10 ring-1 ring-fg/20 transition-transform duration-base ease-out group-hover:scale-105">
              <Play className="ml-1 h-8 w-8 fill-current text-fg" strokeWidth={0} aria-hidden />
            </span>
          </button>
        </div>
      </div>
    </Section>
  )
}
