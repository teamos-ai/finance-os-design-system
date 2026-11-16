/**
 * MotionSection — the Finance OS motion system, documented by running it.
 *
 *   1 · The five laws          how the brand moves
 *   2 · Tokens                 duration · easing · distance · stagger (each one playable)
 *   3 · Patterns               the reusable UI moves, live and replayable
 *   4 · Signature              the Atlas Blue halftone clouds
 *   5 · Motion graphics        four films rendered by the motion-finance skill
 *   6 · The skill              install, pipeline and stack
 *
 * Every number on this page comes from `lib/motion-tokens.ts` / `styles/tokens.css` — the same
 * values the `motion-finance` skill uses for video, so web and film move identically.
 */
import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Copy, Download, Github, RotateCw } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { TokenTag } from '@/components/ui/token-tag'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { SegmentedControl } from '@/components/ui/segmented'
import { Inspectable, type InspectData } from '@/components/ui/inspectable'
import { Logo } from '@/components/brand/Logo'
import { HalftoneClouds } from '@/components/brand/HalftoneClouds'
import { CountUp, DrawLine, FadeIn, HoverLift, MaskReveal, Stagger, StaggerItem } from '@/lib/motion'
import { MOTION, cssBezier } from '@/lib/motion-tokens'
import type { CloudShape, CloudTone } from '@/lib/halftone'
import { cn } from '@/lib/cn'

const REPO = 'https://github.com/teamos-ai/motion-finance'

/* ── small shared parts ──────────────────────────────────────────────────────────────────────── */

function ReplayButton({ onClick, label = 'Replay' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-2 py-1 font-mono text-mono-2xs uppercase tracking-[0.1em] text-fg-muted transition-colors duration-fast ease-out hover:border-border-strong hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCw className="h-3 w-3" strokeWidth={2} aria-hidden />
      {label}
    </button>
  )
}

function GroupLabel({ children, note }: { children: string; note?: string }) {
  return (
    <div className="mb-4 mt-14 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 first:mt-0">
      <MonoLabel tone="accent" dot>{children}</MonoLabel>
      {note && <span className="font-body text-body-sm text-fg-subtle">{note}</span>}
    </div>
  )
}

/** A replayable specimen: remounts its children on Replay so in-view primitives run again. */
function Specimen({
  label,
  tokens,
  inspect,
  children,
  replay = true,
}: {
  label: string
  tokens: string[]
  inspect: InspectData
  children: React.ReactNode
  replay?: boolean
}) {
  const [run, setRun] = React.useState(0)
  return (
    <Demo label={label} inspect={inspect} action={replay ? <ReplayButton onClick={() => setRun((r) => r + 1)} /> : undefined}>
      <div key={run} className="grid min-h-[168px] place-items-center">
        {children}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-1.5 border-t border-border-subtle pt-4">
        {tokens.map((t) => (
          <TokenTag key={t}>{t}</TokenTag>
        ))}
      </div>
    </Demo>
  )
}

/* ── 1 · the five laws ───────────────────────────────────────────────────────────────────────── */
const LAWS = [
  { n: '01', title: 'Land and hold', body: 'Things arrive, settle and stay still. Nothing drifts, breathes or pulses once it has landed.' },
  { n: '02', title: 'One move per moment', body: 'At most two things in motion at once, and one reveal per viewport band.' },
  { n: '03', title: 'Leave faster than you arrive', body: 'An exit runs 40–50% shorter than the entrance it reverses.' },
  { n: '04', title: 'Nothing bounces', body: 'No elastic, no overshoot — except one sanctioned confirm: a tick, a seal, a state flip.' },
  { n: '05', title: 'Blue leads', body: 'One Atlas Blue keyword per headline. Motion points at it and never competes with it.' },
]

/* ── 2 · tokens ──────────────────────────────────────────────────────────────────────────────── */
const DURATIONS = [
  { token: 'duration-fast', css: '--dur-fast', s: MOTION.dur.fast, use: 'Hover, press, colour, focus' },
  { token: 'duration-base', css: '--dur-base', s: MOTION.dur.base, use: 'Small state change, exits' },
  { token: 'duration-slow', css: '--dur-slow', s: MOTION.dur.slow, use: 'The default entrance' },
  { token: 'duration-slower', css: '--dur-slower', s: MOTION.dur.slower, use: 'Headline reveal, large surfaces' },
  { token: 'duration-draw', css: '--dur-draw', s: MOTION.dur.draw, use: 'Count-ups, chart lines' },
]

const EASINGS = [
  { token: 'ease-out', role: 'Arrive', curve: MOTION.ease.out, gsap: 'power3.out', note: 'Fast in, soft landing. Every entrance.' },
  { token: 'ease-in', role: 'Leave', curve: MOTION.ease.in, gsap: 'power2.in', note: 'Gathers pace on the way out. Every exit.' },
  { token: 'ease-in-out', role: 'Move', curve: MOTION.ease.inOut, gsap: 'power2.inOut', note: 'Layout shifts, colour floods, lines drawing on.' },
  { token: 'ease-confirm', role: 'Confirm', curve: MOTION.ease.confirm, gsap: 'back.out(1.6)', note: 'The one sanctioned overshoot. Once per view.' },
]

function DurationTable() {
  const reduced = useReducedMotion()
  const [run, setRun] = React.useState(0)
  return (
    <Demo
      label="Duration — five steps, each with one job"
      action={<ReplayButton onClick={() => setRun((r) => r + 1)} />}
      padded={false}
      inspect={{
        name: 'Duration tokens',
        explain: 'Five durations cover every case. High-frequency interactions get `fast` and animate opacity or colour only; a single entrance never exceeds 800ms.',
        token: DURATIONS.map((d) => `${d.css}: ${Math.round(d.s * 1000)}ms  ·  .${d.token}`).join('\n'),
        code: `<div className="transition-opacity duration-fast ease-out" />\n\nimport { MOTION } from '@/lib/motion-tokens'\ntransition={{ duration: MOTION.dur.slow, ease: MOTION.ease.out }}`,
      }}
    >
      <div className="divide-y divide-border-subtle">
        {DURATIONS.map((d) => (
          <div key={d.token} className="grid grid-cols-1 items-center gap-x-6 gap-y-2 px-5 py-4 md:grid-cols-[170px_70px_1fr_220px]">
            <div><TokenTag>{d.token}</TokenTag></div>
            <span className="font-mono text-caption tabular-nums text-fg">{Math.round(d.s * 1000)}ms</span>
            <div className="h-1.5 overflow-hidden rounded-sm bg-inset">
              <motion.div
                key={run}
                className="h-full origin-left rounded-sm bg-accent"
                initial={reduced ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={MOTION.viewport}
                transition={{ duration: d.s, ease: MOTION.ease.out, delay: 0.2 }}
              />
            </div>
            <span className="font-body text-body-sm text-fg-muted">{d.use}</span>
          </div>
        ))}
      </div>
    </Demo>
  )
}

function EasingCard({ e, run }: { e: (typeof EASINGS)[number]; run: number }) {
  const reduced = useReducedMotion()
  const [x1, y1, x2, y2] = e.curve
  // plot in a 100×100 box, y flipped; the viewBox leaves headroom for the confirm overshoot
  const d = `M0 100 C ${x1 * 100} ${100 - y1 * 100}, ${x2 * 100} ${100 - y2 * 100}, 100 0`
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-title-sm text-fg">{e.role}</span>
        <TokenTag>{e.token}</TokenTag>
      </div>
      <svg viewBox="-8 -34 116 146" className="h-28 w-full" role="img" aria-label={`${e.role} easing curve`}>
        <rect x="0" y="0" width="100" height="100" className="fill-inset" rx="2" />
        <line x1="0" y1="100" x2="100" y2="0" className="stroke-border-strong" strokeWidth="1" strokeDasharray="3 3" />
        <path d={d} fill="none" className="stroke-accent" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="0" cy="100" r="3" className="fill-accent" />
        <circle cx="100" cy="0" r="3" className="fill-accent" />
      </svg>
      <div className="h-1.5 overflow-hidden rounded-sm bg-inset">
        <motion.div
          key={run}
          className="h-full origin-left rounded-sm bg-accent"
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={MOTION.viewport}
          transition={{ duration: 0.9, ease: e.curve, delay: 0.25 }}
        />
      </div>
      <p className="font-body text-body-sm leading-relaxed text-fg-muted">{e.note}</p>
      <span className="font-mono text-caption text-fg-subtle">{cssBezier(e.curve)} · GSAP {e.gsap}</span>
    </div>
  )
}

function EasingGrid() {
  const [run, setRun] = React.useState(0)
  return (
    <div>
      <div className="mb-3 flex justify-end">
        <ReplayButton onClick={() => setRun((r) => r + 1)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {EASINGS.map((e) => (
          <EasingCard key={e.token} e={e} run={run} />
        ))}
      </div>
    </div>
  )
}

const SPACE_ROWS = [
  { token: '--rise-sm', value: '8px', use: 'Labels, captions, small parts' },
  { token: '--rise', value: '12px', use: 'The default entrance travel' },
  { token: '--rise-lg', value: '24px', use: 'Hero blocks, large cards' },
  { token: '--stagger-tight', value: '40ms', use: 'Dense lists, table rows, chips' },
  { token: '--stagger', value: '70ms', use: 'Cards and grid cells — cap the total at 500ms' },
]

/* ── 3 · patterns ────────────────────────────────────────────────────────────────────────────── */
const SAMPLE_LINE = 'M4 100 L58 84 L112 90 L166 56 L220 62 L316 14'
const BARS = [
  { v: 33, label: 'Photos', cls: 'bg-accent' },
  { v: 20, label: 'Calculators', cls: 'bg-accent/70' },
  { v: 10, label: 'Funnel types', cls: 'bg-accent/40' },
]

function BarsDemo() {
  const reduced = useReducedMotion()
  return (
    <div className="w-full max-w-[320px]">
      <div className="flex h-[120px] items-end gap-4 border-b border-border">
        {BARS.map((b, i) => (
          <motion.div
            key={b.label}
            className={cn('flex-1 origin-bottom rounded-t-md', b.cls)}
            style={{ height: `${(b.v / 33) * 100}%` }}
            initial={reduced ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={MOTION.viewport}
            transition={{ duration: MOTION.dur.slower, ease: MOTION.ease.out, delay: 0.15 + i * 0.12 }}
          />
        ))}
      </div>
      <div className="mt-2 flex gap-4">
        {BARS.map((b, i) => (
          <motion.span
            key={b.label}
            className="flex-1 font-mono text-mono-2xs uppercase tracking-[0.08em] text-fg-muted"
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={MOTION.viewport}
            transition={{ duration: MOTION.dur.base, delay: 0.75 + i * 0.12 }}
          >
            <span className="tabular-nums text-fg">{b.v}</span> {b.label}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

type Stage = 'pre' | 'settled'
const STAGES: Record<Stage, { title: string; note: string }> = {
  pre: { title: 'Pre-approval', note: 'Documents in, lender reviewing.' },
  settled: { title: 'Settled', note: 'Funds released, file closed.' },
}
function BlurSwapDemo() {
  const reduced = useReducedMotion()
  const [stage, setStage] = React.useState<Stage>('pre')
  return (
    <div className="flex w-full max-w-[320px] flex-col items-center gap-5">
      <SegmentedControl
        aria-label="Deal stage"
        size="sm"
        value={stage}
        onValueChange={(v) => setStage(v as Stage)}
        options={[
          { value: 'pre', label: 'Pre-approval' },
          { value: 'settled', label: 'Settled' },
        ]}
      />
      <div className="grid h-[72px] w-full place-items-center rounded-lg border border-border bg-surface px-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stage}
            className="text-center"
            initial={reduced ? false : { opacity: 0, y: MOTION.rise.sm, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.24, ease: MOTION.ease.out } }}
            exit={reduced ? undefined : { opacity: 0, y: -MOTION.rise.sm, filter: 'blur(8px)', transition: { duration: 0.16, ease: MOTION.ease.in } }}
          >
            <div className="font-display text-title-sm text-fg">{STAGES[stage].title}</div>
            <div className="font-body text-body-sm text-fg-muted">{STAGES[stage].note}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function ConfirmDemo() {
  const reduced = useReducedMotion()
  const [done, setDone] = React.useState(false)
  React.useEffect(() => {
    if (!done) return
    const t = setTimeout(() => setDone(false), 1800)
    return () => clearTimeout(t)
  }, [done])
  return (
    <Button
      variant="secondary"
      onClick={() => {
        void navigator.clipboard?.writeText('--ease-confirm').catch(() => {})
        setDone(true)
      }}
      className="min-w-[190px]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.span
            key="done"
            className="inline-flex items-center gap-2"
            initial={reduced ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.36, ease: MOTION.ease.confirm } }}
            exit={{ opacity: 0, transition: { duration: MOTION.dur.fast } }}
          >
            <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden /> Copied
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            className="inline-flex items-center gap-2"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: MOTION.dur.fast } }}
            exit={{ opacity: 0, transition: { duration: MOTION.dur.fast } }}
          >
            <Copy className="h-4 w-4" strokeWidth={1.75} aria-hidden /> Copy token
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  )
}

/* ── 4 · signature clouds ────────────────────────────────────────────────────────────────────── */
function CloudsExhibit() {
  const [tone, setTone] = React.useState<CloudTone>('sky')
  const [shape, setShape] = React.useState<CloudShape>('dot')
  const [run, setRun] = React.useState(0)
  return (
    <Demo
      label="Halftone clouds — the one signature flourish"
      padded={false}
      inspect={{
        name: 'HalftoneClouds',
        explain:
          'A procedural cloud field drawn as an Atlas Blue halftone screen. It is code, not an image: always on-palette (colours are read from the tokens), resolution-independent, and identical in the browser and in rendered video. It drifts and does nothing else; the "cloud dissolve" (dots blooming in) is the brand flourish, used once per piece.',
        token: `tone: sky · paper\nshape: dot · pixel\ncell: 9 (dot pitch, px)\nspeed: 0.05 (drift)\nink / ground → --p-blue-400 · --p-blue-300 · --c-canvas`,
        code: `import { HalftoneClouds } from '@/components/brand/HalftoneClouds'\n\n<HalftoneClouds tone="sky" reveal className="h-72 rounded-lg" />\n<HalftoneClouds tone="paper" className="absolute inset-0" />`,
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle px-5 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl
            aria-label="Cloud tone"
            size="sm"
            value={tone}
            onValueChange={(v) => setTone(v as CloudTone)}
            options={[
              { value: 'sky', label: 'Sky' },
              { value: 'paper', label: 'Paper' },
            ]}
          />
          <SegmentedControl
            aria-label="Dot shape"
            size="sm"
            value={shape}
            onValueChange={(v) => setShape(v as CloudShape)}
            options={[
              { value: 'dot', label: 'Halftone' },
              { value: 'pixel', label: 'Pixel' },
            ]}
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <TokenTag>{`<HalftoneClouds tone="${tone}" shape="${shape}">`}</TokenTag>
          <ReplayButton label="Dissolve" onClick={() => setRun((r) => r + 1)} />
        </div>
      </div>
      <div className="relative h-[340px] overflow-hidden rounded-b-lg md:h-[400px]">
        <HalftoneClouds tone={tone} shape={shape} cell={shape === 'pixel' ? 10 : 9} reveal replayKey={run} fade={0.62} className="absolute inset-0" />
        {tone === 'sky' ? (
          <div className="absolute inset-0 grid place-items-center p-6">
            <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-canvas px-10 py-8 text-center shadow-lg">
              <Logo variant="full" size="lg" />
              <p className="max-w-xs font-body text-body-sm leading-relaxed text-fg-muted">
                On the sky, type always sits on a white card — never on the dots.
              </p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <p className="font-display text-display-md text-fg md:text-display-lg">
              One <span className="text-highlight">calm</span> pipeline.
            </p>
            <p className="mt-2 max-w-md font-body text-body-sm leading-relaxed text-fg-muted">
              On paper, the sky dissolves before the headline begins.
            </p>
          </div>
        )}
      </div>
    </Demo>
  )
}

/* ── 5 · films ───────────────────────────────────────────────────────────────────────────────── */
const FILMS = [
  {
    id: 'brand-sting',
    title: 'Brand sting',
    length: '7s',
    beats: 'The sky blooms in, the lockup lands on its card, the tagline rises, everything holds.',
    tokens: ['FOS.clouds', 'FOS.rise', 'FOS.maskLines'],
  },
  {
    id: 'kinetic-headline',
    title: 'Kinetic headline',
    length: '6s',
    beats: 'Three masked lines, one blue keyword, an underline drawn after the line has landed.',
    tokens: ['FOS.maskLines', 'FOS.draw', "tone: 'paper'"],
  },
  {
    id: 'data-story',
    title: 'Data story',
    length: '8s',
    beats: 'Stat cards land, the numbers run, bars grow from the baseline, labels arrive last.',
    tokens: ['FOS.countUp', 'FOS.grow', 'FOS.rise'],
  },
  {
    id: 'flow-diagram',
    title: 'Flow diagram',
    length: '8s',
    beats: 'Five acts: establish, build, connect, one pulse along the chain, resolve with the confirm.',
    tokens: ['FOS.draw', 'FOS.confirm', 'FOS.rise'],
  },
]

function FilmCard({ film }: { film: (typeof FILMS)[number] }) {
  return (
    <Inspectable
      name={`Film — ${film.title}`}
      explain={`${film.beats} Rendered from HTML + a paused GSAP timeline by HyperFrames using the motion-finance kit: real fonts, real logo assets, token colours.`}
      token={film.tokens.join('\n')}
      code={`bash skills/motion-finance/scripts/new-video.sh ./${film.id}\n# source: examples/${film.id}/index.html\nnpx hyperframes render --quality looks --output ${film.id}.mp4`}
      download={{ filename: `${film.id}.mp4`, href: `/motion/${film.id}.mp4` }}
    >
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <video
          className="block aspect-video w-full bg-inset"
          src={`/motion/${film.id}.mp4`}
          poster={`/motion/${film.id}.jpg`}
          controls
          muted
          playsInline
          preload="none"
          aria-label={`${film.title} — motion example`}
        />
        <div className="flex flex-col gap-3 border-t border-border p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="font-display text-title-sm text-fg">{film.title}</h4>
            <span className="font-mono text-caption tabular-nums text-fg-subtle">{film.length} · 1080p</span>
          </div>
          <p className="font-body text-body-sm leading-relaxed text-fg-muted">{film.beats}</p>
          <div className="flex flex-wrap gap-1.5">
            {film.tokens.map((t) => (
              <TokenTag key={t}>{t}</TokenTag>
            ))}
          </div>
        </div>
      </div>
    </Inspectable>
  )
}

/* ── 6 · the skill ───────────────────────────────────────────────────────────────────────────── */
const INSTALL = `git clone ${REPO}.git
ln -s "$(pwd)/motion-finance/skills/motion-finance" ~/.claude/skills/motion-finance`

const PIPELINE = [
  { n: '01', title: 'Brief', body: 'A tone sentence and a beat-by-beat ledger. No figure without a source.' },
  { n: '02', title: 'Scaffold', body: 'new-video.sh copies the kit: fonts, logos, tokens, clouds.' },
  { n: '03', title: 'Build', body: 'HTML plus one paused timeline, written with the FOS helpers.' },
  { n: '04', title: 'Gate', body: 'Lint, the calm audit, then a contact sheet you actually open.' },
  { n: '05', title: 'Render', body: 'MP4 at 1080p; the duration is verified against the timeline.' },
]

const STACK = [
  { head: 'Depend on', items: ['Framer Motion + CSS tokens for the interface', 'HyperFrames (HTML + GSAP → MP4) for film', 'FFmpeg for web copies and posters', 'Our own halftone cloud canvas'] },
  { head: 'Add when a real need appears', items: ['three.js for a genuinely 3D chart', 'librosa (offline) to cut a film to music', 'Tegaki for one handwritten accent'] },
  { head: 'Rejected', items: ['Physics and bounce kits — read as playful', 'A second renderer (Remotion)', 'Blender, mascots, style prompt packs', 'Generated people — use the photo library'] },
]

function CopyBlock({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false)
  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-md bg-inset p-4 pr-12 font-mono text-caption leading-relaxed text-fg">{text}</pre>
      <button
        type="button"
        aria-label="Copy install commands"
        onClick={() => {
          void navigator.clipboard?.writeText(text).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1400)
          })
        }}
        className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-sm text-fg-subtle transition-colors duration-fast ease-out hover:bg-canvas-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-success" strokeWidth={2.5} /> : <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />}
      </button>
    </div>
  )
}

const DO = [
  'Start from a token. Add a token before you add a number.',
  'Reveal in reading order, then be still.',
  'Let cards land before their numbers run.',
  'Test with reduced motion switched on.',
  'Use the real logo files and move them as one piece.',
]
const DONT = [
  'Loop, float, breathe or pulse content.',
  'Bounce an interface element.',
  'Animate a figure nobody stated.',
  'Put type directly on the halftone dots.',
  'Use the cloud dissolve more than once per piece.',
]

/* ── section ─────────────────────────────────────────────────────────────────────────────────── */
export function MotionSection() {
  return (
    <Section
      id="motion"
      eyebrow="Motion"
      title="Motion"
      lead="Finance OS moves the way it speaks: calm, clear and exact. Things arrive in reading order, land, and hold. One signature flourish — the Atlas Blue halftone cloud — is the only place the brand shows off."
    >
      {/* 1 — the five laws */}
      <GroupLabel>The five laws</GroupLabel>
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {LAWS.map((l) => (
          <StaggerItem key={l.n} className="h-full">
            <div className="flex h-full flex-col gap-2 rounded-lg border border-border bg-surface p-5">
              <span className="font-mono text-mono-2xs tracking-[0.14em] text-accent-text">{l.n}</span>
              <h4 className="font-display text-title-sm text-fg text-balance">{l.title}</h4>
              <p className="font-body text-body-sm leading-relaxed text-fg-muted text-pretty">{l.body}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      {/* 2 — tokens */}
      <GroupLabel note="The same numbers drive CSS, Framer Motion and rendered video.">Motion tokens</GroupLabel>
      <div className="space-y-6">
        <DurationTable />
        <EasingGrid />
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="divide-y divide-border-subtle">
            {SPACE_ROWS.map((r) => (
              <div key={r.token} className="grid grid-cols-1 items-center gap-x-6 gap-y-1.5 px-5 py-3.5 sm:grid-cols-[190px_70px_1fr]">
                <div><TokenTag>{r.token}</TokenTag></div>
                <span className="font-mono text-caption tabular-nums text-fg">{r.value}</span>
                <span className="font-body text-body-sm text-fg-muted">{r.use}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 — patterns */}
      <GroupLabel note="Each is a primitive in lib/motion.tsx. Press Replay to run it again.">Patterns</GroupLabel>
      <div className="grid gap-4 md:grid-cols-2">
        <Specimen
          label="Rise-in — the default entrance"
          tokens={['<FadeIn>', 'duration-slow', 'ease-out', '--rise']}
          inspect={{
            name: 'Rise-in',
            explain: 'Opacity plus a 12px upward travel, once, as the block enters view. Use it for almost everything — variety comes from order and timing, not from effects. In a grid, <Stagger> spaces the arrivals 70ms apart.',
            token: 'duration → --dur-slow (400ms)\nease → --ease-out\ntravel → --rise (12px)\nstagger → --stagger (70ms)',
            code: `<Stagger className="grid grid-cols-3 gap-3">\n  <StaggerItem>…</StaggerItem>\n</Stagger>`,
          }}
        >
          <Stagger className="grid w-full max-w-[340px] grid-cols-3 gap-3">
            {['Capture', 'Follow up', 'Settle'].map((t, i) => (
              <StaggerItem key={t}>
                <div className="flex h-[92px] flex-col justify-between rounded-lg border border-border bg-surface p-3 shadow-sm">
                  <span className="font-mono text-mono-2xs text-accent-text">0{i + 1}</span>
                  <span className="font-display text-body-sm font-semibold text-fg">{t}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Specimen>

        <Specimen
          label="Masked headline — one blue keyword"
          tokens={['<MaskReveal>', 'duration-slower', 'text-highlight']}
          inspect={{
            name: 'Masked headline',
            explain: 'Each line slides up from behind its own mask, 100ms apart. Break lines by sense — one idea per line — and give the headline exactly one Atlas Blue keyword.',
            token: 'duration → --dur-slower (600ms)\nease → --ease-out\nkeyword → text-highlight',
            code: `<MaskReveal\n  as="h2"\n  className="font-display text-display-md text-fg"\n  lines={[<>More <span className="text-highlight">settlements</span>.</>, 'Less admin.']}\n/>`,
          }}
        >
          <MaskReveal
            as="h3"
            className="text-center font-display text-display-md text-fg"
            lines={[
              <>More <span className="text-highlight">settlements</span>.</>,
              'Less admin.',
            ]}
          />
        </Specimen>

        <Specimen
          label="Count-up — the number runs once"
          tokens={['<CountUp>', 'duration-draw', 'tabular-nums']}
          inspect={{
            name: 'Count-up',
            explain: 'A figure runs to its value the first time it is seen: 1.2s, ease-out, tabular numerals, no overshoot. The card lands first; the number runs next. Only ever a real, sourced figure.',
            token: 'duration → --dur-draw (1200ms)\nnumerals → tabular-nums',
            code: `<CountUp to={2713} group />`,
          }}
        >
          <div className="flex items-end gap-8">
            <div className="text-center">
              <div className="font-display text-display-lg text-fg"><CountUp to={2713} group /></div>
              <div className="mt-1 font-body text-body-sm text-fg-muted">icons in the library</div>
            </div>
            <div className="text-center">
              <div className="font-display text-display-lg text-highlight"><CountUp to={21} />/21</div>
              <div className="mt-1 font-body text-body-sm text-fg-muted">colour pairs pass AA</div>
            </div>
          </div>
        </Specimen>

        <Specimen
          label="Line draw-on — charts and connectors"
          tokens={['<DrawLine>', 'duration-draw', 'ease-in-out']}
          inspect={{
            name: 'Line draw-on',
            explain: 'A chart line, underline or connector draws from its start to its end. The end point and its label appear only when the line arrives. Direct labels — no legend, no gridlines.',
            token: 'duration → --dur-draw (1200ms)\nease → --ease-in-out\nstroke → text-accent (currentColor)',
            code: `<svg viewBox="0 0 320 120" className="text-accent">\n  <DrawLine d="M4 100 L58 84 …" strokeWidth={3} />\n</svg>`,
          }}
        >
          <div className="w-full max-w-[340px]">
            <svg viewBox="0 0 320 120" className="h-[120px] w-full overflow-visible text-accent" role="img" aria-label="Sample line chart drawing on">
              <line x1="4" y1="110" x2="316" y2="110" className="stroke-border" strokeWidth="1" />
              <DrawLine d={SAMPLE_LINE} strokeWidth={3} delay={0.15} />
              <motion.circle
                cx="316" cy="14" r="5" className="fill-accent"
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={MOTION.viewport}
                transition={{ duration: MOTION.dur.base, ease: MOTION.ease.out, delay: 0.15 + MOTION.dur.draw }}
              />
            </svg>
            <span className="mt-2 block font-mono text-mono-2xs uppercase tracking-[0.1em] text-fg-subtle">Sample data — for the motion only</span>
          </div>
        </Specimen>

        <Specimen
          label="Bars — grow from the baseline"
          tokens={['origin-bottom', 'duration-slower', 'ease-out']}
          inspect={{
            name: 'Bars from the baseline',
            explain: 'Bars are real-height blocks scaled up from their baseline, 120ms apart; each label fades in after its bar has landed. The figures here are real counts from this design system.',
            token: 'duration → --dur-slower (600ms)\nease → --ease-out\ntransform-origin → bottom',
            code: `<motion.div\n  className="origin-bottom bg-accent"\n  initial={{ scaleY: 0 }}\n  whileInView={{ scaleY: 1 }}\n  transition={{ duration: MOTION.dur.slower, ease: MOTION.ease.out }}\n/>`,
          }}
        >
          <BarsDemo />
        </Specimen>

        <Specimen
          replay={false}
          label="Blur swap — content changes in place"
          tokens={['<AnimatePresence>', 'ease-in', 'ease-out']}
          inspect={{
            name: 'Blur swap',
            explain: 'When content is replaced in place, the old leaves fast (160ms, ease-in) and the new arrives soft (240ms, ease-out), each with a small blur. The exit is shorter than the entrance. Try the switch.',
            token: 'exit → 160ms · --ease-in · blur 8px\nenter → 240ms · --ease-out · blur 8px',
            code: `<AnimatePresence mode="wait" initial={false}>\n  <motion.div key={value}\n    initial={{ opacity: 0, y: 8, filter: 'blur(8px)' }}\n    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}\n    exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }} />\n</AnimatePresence>`,
          }}
        >
          <BlurSwapDemo />
        </Specimen>

        <Specimen
          replay={false}
          label="Press and hover — instant feedback"
          tokens={['active:scale-[0.97]', 'duration-fast', '<HoverLift>']}
          inspect={{
            name: 'Press and hover',
            explain: 'Interactive state uses CSS transitions so it can be interrupted. A press scales to 0.97 in 150ms; hover changes colour or shadow at the same speed; a card lift takes 250ms. Never `transition: all`.',
            token: 'press → scale(0.97) · --dur-fast\nhover colour → --dur-fast\nlift → translateY(-4px) · --dur-base',
            code: `<Button>Book a call</Button>\n<HoverLift><Card /></HoverLift>`,
          }}
        >
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Button>
              Book a call
              <ArrowRight width={18} height={18} strokeWidth={1.5} aria-hidden />
            </Button>
            <HoverLift>
              <div className="rounded-lg border border-border bg-surface px-5 py-4 shadow-sm transition-shadow duration-base ease-out hover:shadow-lg">
                <div className="font-display text-title-sm text-fg">Hover this card</div>
                <div className="font-body text-body-sm text-fg-muted">It lifts 4px and settles.</div>
              </div>
            </HoverLift>
          </div>
        </Specimen>

        <Specimen
          replay={false}
          label="Confirm — the one sanctioned overshoot"
          tokens={['ease-confirm', '--ease-confirm']}
          inspect={{
            name: 'Confirm',
            explain: 'The only place an overshoot is allowed: acknowledging that something worked — a tick, a seal, a state flip. 360ms on the confirm curve, at most once per view. Press the button.',
            token: 'ease → --ease-confirm · cubic-bezier(0.34, 1.56, 0.64, 1)\nduration → 360ms',
            code: `animate={{ opacity: 1, scale: 1 }}\ntransition={{ duration: 0.36, ease: MOTION.ease.confirm }}`,
          }}
        >
          <ConfirmDemo />
        </Specimen>
      </div>

      {/* 4 — the signature */}
      <GroupLabel note="Code, not an image — always on-palette, the same in the browser and on film.">Signature texture</GroupLabel>
      <CloudsExhibit />

      {/* 5 — films */}
      <GroupLabel note="Rendered from HTML by the motion-finance skill. Press play.">Motion graphics</GroupLabel>
      <div className="grid gap-4 md:grid-cols-2">
        {FILMS.map((f) => (
          <FilmCard key={f.id} film={f} />
        ))}
      </div>

      {/* 6 — the skill */}
      <GroupLabel note="Everything on this page, packaged for Claude Code, Codex or any agent.">The motion-finance skill</GroupLabel>
      <FadeIn>
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="grid gap-8 p-6 md:grid-cols-[1.1fr_1fr] md:p-8">
            <div className="flex min-w-0 flex-col gap-4">
              <Badge variant="blue" size="sm" dot className="self-start">Agent skill</Badge>
              <h3 className="font-display text-display-sm text-fg">
                Make it move the <span className="text-highlight">Finance OS</span> way.
              </h3>
              <p className="font-body text-body-md leading-relaxed text-fg-muted">
                The tokens, the UI rules, a branded HyperFrames kit with the real fonts and logos, the halftone clouds,
                and a calm audit that fails a film for bouncing, looping, off-palette colour or a fabricated logo.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a href="/packs/motion-finance-skill.zip" download className={buttonVariants({ variant: 'primary', size: 'md' })}>
                  <Download width={18} height={18} strokeWidth={1.5} aria-hidden />
                  Download the skill
                </a>
                <a href={REPO} target="_blank" rel="noreferrer" className={buttonVariants({ variant: 'secondary', size: 'md' })}>
                  <Github width={18} height={18} strokeWidth={1.5} aria-hidden />
                  Open the repo
                </a>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <TokenTag title="skill name">motion-finance</TokenTag>
                <TokenTag title="repository">teamos-ai/motion-finance</TokenTag>
              </div>
            </div>
            <div className="flex min-w-0 flex-col gap-3">
              <MonoLabel tone="subtle">Install</MonoLabel>
              <CopyBlock text={INSTALL} />
              <p className="font-body text-body-sm leading-relaxed text-fg-muted">
                Then ask for “a Finance OS brand sting” or “review this page’s motion with motion-finance”. Films need
                Node 22+ and FFmpeg.
              </p>
            </div>
          </div>

          <div className="border-t border-border bg-canvas-muted p-6 md:p-8">
            <MonoLabel tone="subtle">How a film gets made</MonoLabel>
            <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {PIPELINE.map((p) => (
                <li key={p.n} className="flex flex-col gap-1.5 rounded-lg border border-border bg-surface p-4">
                  <span className="font-mono text-mono-2xs tracking-[0.14em] text-accent-text">{p.n}</span>
                  <span className="font-display text-title-sm text-fg">{p.title}</span>
                  <span className="font-body text-body-sm leading-relaxed text-fg-muted">{p.body}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid gap-6 border-t border-border p-6 md:grid-cols-3 md:p-8">
            {STACK.map((col) => (
              <div key={col.head}>
                <MonoLabel tone="subtle">{col.head}</MonoLabel>
                <ul className="mt-3 space-y-2 font-body text-body-sm leading-relaxed text-fg-muted">
                  {col.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* do / don't */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-6">
          <Badge variant="success" size="sm" dot>Do</Badge>
          <ul className="mt-4 space-y-2 font-body text-body-sm leading-relaxed text-fg-muted">
            {DO.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6">
          <Badge variant="danger" size="sm" dot>Don’t</Badge>
          <ul className="mt-4 space-y-2 font-body text-body-sm leading-relaxed text-fg-muted">
            {DONT.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </div>
      </div>
    </Section>
  )
}
