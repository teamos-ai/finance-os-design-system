import * as React from 'react'
import { RefreshCw } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import {
  FadeIn, Stagger, StaggerItem, HoverLift, CountUp, Reveal,
  BreathingDot, GradientShimmer, BorderGlow,
} from '@/lib/motion'

const DURATIONS = [
  { token: '--dur-fast', value: '150ms', use: 'hovers, taps' },
  { token: '--dur-base', value: '250ms', use: 'theme + layout transitions' },
  { token: '--dur-slow', value: '400ms', use: 'reveals, image zoom' },
]
const EASINGS = [
  { token: '--ease-out', value: 'cubic-bezier(.22,1,.36,1)', use: 'enter / reveal' },
  { token: '--ease-in-out', value: 'cubic-bezier(.65,0,.35,1)', use: 'looping drift' },
  { token: '--ease-spring', value: 'cubic-bezier(.34,1.56,.64,1)', use: 'playful accents' },
]

/** Replayable demo frame — remounts its children when the replay button is pressed. */
function ReplayDemo({ label, name, children }: { label: string; name: string; children: React.ReactNode }) {
  const [k, setK] = React.useState(0)
  return (
    <Demo
      label={label}
      action={
        <button
          aria-label={`Replay ${name}`}
          onClick={() => setK((v) => v + 1)}
          className="grid h-7 w-7 place-items-center rounded-md text-fg-subtle transition-colors hover:bg-accent-soft hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      }
    >
      <div key={k} className="grid min-h-[120px] place-items-center">
        {children}
      </div>
    </Demo>
  )
}

const Tile = ({ children }: { children?: React.ReactNode }) => (
  <div className="grid h-16 w-full place-items-center rounded-md border border-border bg-elevated font-mono text-caption text-fg-subtle">
    {children}
  </div>
)

export function MotionSection() {
  return (
    <Section
      id="motion"
      eyebrow="09 — Motion"
      title="Motion"
      lead="A quiet vocabulary — fade, small translate, soft lift, calm glow. No bounce or autoplay; durations stay under 480ms; every primitive honours reduced-motion."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ReplayDemo label="FadeIn" name="FadeIn">
          <FadeIn>
            <Tile>fade + rise</Tile>
          </FadeIn>
        </ReplayDemo>

        <ReplayDemo label="Stagger" name="Stagger">
          <Stagger className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <StaggerItem key={i}>
                <span className="grid h-12 w-12 place-items-center rounded-md bg-accent-soft text-accent-text">{i + 1}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </ReplayDemo>

        <ReplayDemo label="Reveal" name="Reveal">
          <Reveal>
            <Tile>blur reveal</Tile>
          </Reveal>
        </ReplayDemo>

        <Demo label="HoverLift">
          <div className="grid min-h-[120px] place-items-center">
            <HoverLift>
              <Tile>hover me</Tile>
            </HoverLift>
          </div>
        </Demo>

        <ReplayDemo label="CountUp" name="CountUp">
          <p className="font-display text-display-sm text-accent-text">
            <CountUp to={1315} prefix="$" />
          </p>
        </ReplayDemo>

        <Demo label="BreathingDot + Shimmer">
          <div className="flex min-h-[120px] flex-col items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 font-mono text-caption text-fg-muted">
              <BreathingDot /> live
            </span>
            <GradientShimmer className="font-display text-title-lg">Finance OS</GradientShimmer>
          </div>
        </Demo>

        <Demo label="BorderGlow" className="sm:col-span-2 lg:col-span-3">
          <div className="grid min-h-[120px] place-items-center">
            <BorderGlow>
              <div className="rounded-lg border border-border bg-surface px-6 py-4 font-display text-title-md text-fg">
                Signature gold sweep
              </div>
            </BorderGlow>
          </div>
        </Demo>
      </div>

      {/* token tables */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-6">
          <MonoLabel tone="subtle">Durations</MonoLabel>
          <ul className="mt-4 space-y-2">
            {DURATIONS.map((d) => (
              <li key={d.token} className="flex items-baseline justify-between gap-4 border-b border-border-subtle pb-2 last:border-0">
                <code className="font-mono text-caption text-accent-text">{d.token}</code>
                <span className="font-mono text-caption text-fg">{d.value}</span>
                <span className="font-mono text-caption text-fg-subtle">{d.use}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6">
          <MonoLabel tone="subtle">Easings</MonoLabel>
          <ul className="mt-4 space-y-2">
            {EASINGS.map((e) => (
              <li key={e.token} className="flex items-baseline justify-between gap-4 border-b border-border-subtle pb-2 last:border-0">
                <code className="font-mono text-caption text-accent-text">{e.token}</code>
                <span className="font-mono text-caption text-fg-subtle">{e.use}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-6 text-center font-mono text-caption text-fg-subtle">
        All primitives short-circuit under <code className="text-accent-text">prefers-reduced-motion</code>.
      </p>
    </Section>
  )
}
