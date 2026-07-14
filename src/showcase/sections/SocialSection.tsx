/**
 * SocialSection — the social toolkit plus an interactive Social Post Studio.
 *
 * Three reference surfaces: (1) the Studio — a controlled mini-app where you pick a
 * platform (Instagram / LinkedIn / X) and a post type (Quote / Stat / Announcement),
 * type a headline, and watch a live, on-brand preview render at the right aspect ratio
 * (square for IG, 1.91:1 wide for LinkedIn / X); (2) static templates — a quote card, a
 * stat card and an OG / share card with a safe-zone note; (3) a closing note on the
 * surface recipes posts are built from. Calm, broker-grade — never hyped.
 */
import * as React from 'react'
import { Section, Demo } from '@/showcase/Section'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { SegmentedControl } from '@/components/ui/segmented'
import { MonoLabel } from '@/components/ui/mono-label'
import { Inspectable, type InspectData } from '@/components/ui/inspectable'
import { LogoMark } from '@/components/brand/Logo'
import { Quote, TrendingUp, Megaphone } from 'lucide-react'
import { BRAND } from '@/data/system'

const STUDIO_INSPECT: InspectData = {
  name: 'Social Post Studio',
  explain: 'A client-side mini-app: pick a platform and post type, type a headline, and the preview renders on-brand at the right aspect ratio. Square feed posts use the larger display size; wide timeline cards step down so the headline never crowds the frame.',
  token: 'platform: instagram · linkedin · x\ntype: quote · stat · announcement\nsurface: gradient (1:1) · dark · paper (1.91:1)',
  code: '// live preview swaps surface recipe + aspect ratio per platform\nconst surface = meta.surface === "gradient"\n  ? "bg-gradient-accent shadow-glow"\n  : meta.surface === "dark" ? "bg-inverse" : "bg-surface border"',
}
const QUOTE_INSPECT: InspectData = {
  name: 'Quote card',
  explain: 'A feed quote on the signature amber gradient. 1:1 for Instagram.',
  token: 'bg-gradient-accent · shadow-glow · 1:1',
  code: '<div class="aspect-square rounded-lg bg-gradient-accent shadow-glow p-6">…</div>',
}
const STAT_CARD_INSPECT: InspectData = {
  name: 'Stat card',
  explain: 'A data post on the carbon (inverse) surface, with the figure in the accent. 1:1.',
  token: 'bg-inverse · text-accent-text · 1:1',
  code: '<div class="aspect-square rounded-lg bg-inverse p-6">…</div>',
}
const OG_INSPECT: InspectData = {
  name: 'OG / share card',
  explain: 'A link-unfurl preview at 1.91:1 with an 8% safe-zone inset — keep the headline, wordmark and URL inside it so nothing crops behind an avatar or platform chrome. Standard size 1200 × 628.',
  token: 'aspect 1.91/1 · 8% safe-zone inset',
  code: '<div style="aspect-ratio: 1.91/1" class="rounded-lg border bg-surface">…</div>',
}

type Platform = 'instagram' | 'linkedin' | 'x'
type PostType = 'quote' | 'stat' | 'announcement'

const PLATFORMS: { value: Platform; label: React.ReactNode }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'x', label: 'X' },
]

const POST_TYPES: { value: PostType; label: React.ReactNode }[] = [
  { value: 'quote', label: 'Quote' },
  { value: 'stat', label: 'Stat' },
  { value: 'announcement', label: 'Announcement' },
]

/** Per-platform geometry + the surface recipe the preview renders on. */
const PLATFORM_META: Record<
  Platform,
  { name: string; aspect: string; dims: string; surface: 'gradient' | 'dark' | 'paper' }
> = {
  instagram: { name: 'Instagram', aspect: '1 / 1', dims: '1080 × 1080', surface: 'gradient' },
  linkedin: { name: 'LinkedIn', aspect: '1.91 / 1', dims: '1200 × 628', surface: 'dark' },
  x: { name: 'X', aspect: '1.91 / 1', dims: '1200 × 628', surface: 'paper' },
}

/** Default headline per post type — used as the live preview placeholder. */
const DEFAULT_HEADLINE: Record<PostType, string> = {
  quote: 'I saved 100s of hours and 1,000s of dollars per month.',
  stat: '200+ hours saved every month',
  announcement: 'AI conversations now answer and book 24/7',
}

const TYPE_META: Record<PostType, { Icon: typeof Quote; kicker: string }> = {
  quote: { Icon: Quote, kicker: 'From our brokers' },
  stat: { Icon: TrendingUp, kicker: 'By the numbers' },
  announcement: { Icon: Megaphone, kicker: "What's new" },
}

export function SocialSection() {
  const [platform, setPlatform] = React.useState<Platform>('instagram')
  const [postType, setPostType] = React.useState<PostType>('quote')
  const [headline, setHeadline] = React.useState('')

  const meta = PLATFORM_META[platform]
  const typeMeta = TYPE_META[postType]
  const TypeIcon = typeMeta.Icon
  const text = headline.trim() || DEFAULT_HEADLINE[postType]
  const isPlaceholder = headline.trim().length === 0

  // Surface recipe → token classes for the live preview canvas.
  const surface =
    meta.surface === 'gradient'
      ? { wrap: 'bg-gradient-accent shadow-glow', kicker: 'text-accent-fg/70', body: 'text-accent-fg', sub: 'text-accent-fg/80', mark: 'dark' as const }
      : meta.surface === 'dark'
        ? { wrap: 'bg-inverse', kicker: 'text-inverse-fg/60', body: 'text-inverse-fg', sub: 'text-inverse-fg/70', mark: 'light' as const }
        : { wrap: 'bg-surface border border-border', kicker: 'text-fg-subtle', body: 'text-fg', sub: 'text-fg-muted', mark: 'light' as const }

  return (
    <Section
      id="social"
      eyebrow="19 - Social Media"
      title="Social media"
      lead="The social toolkit plus a client-side Social Post Studio. Pick a platform and a post type, write a headline, and a live preview renders on-brand at the right aspect ratio — square for the feed, wide for the timeline."
    >
      <div className="flex flex-col gap-12">
        {/* ── 1 · Social Post Studio ──────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <MonoLabel tone="amber" number="01">Social Post Studio</MonoLabel>
          <Demo label={`${meta.name} · ${meta.dims} · ${meta.aspect}`} padded={false} inspect={STUDIO_INSPECT}>
            <div className="grid gap-0 lg:grid-cols-[minmax(0,20rem)_1fr]">
              {/* Controls */}
              <div className="flex flex-col gap-6 border-b border-border bg-surface p-6 lg:border-b-0 lg:border-r md:p-8">
                <div className="flex flex-col gap-2">
                  <MonoLabel tone="subtle" size="sm">Platform</MonoLabel>
                  <SegmentedControl<Platform>
                    options={PLATFORMS}
                    value={platform}
                    onValueChange={setPlatform}
                    size="sm"
                    aria-label="Choose a platform"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <MonoLabel tone="subtle" size="sm">Post type</MonoLabel>
                  <SegmentedControl<PostType>
                    options={POST_TYPES}
                    value={postType}
                    onValueChange={setPostType}
                    size="sm"
                    aria-label="Choose a post type"
                  />
                </div>

                <Input
                  label="Headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder={DEFAULT_HEADLINE[postType]}
                  hint="Leave blank to preview the suggested copy."
                  maxLength={120}
                />

                <p className="font-mono text-caption leading-relaxed text-fg-subtle">
                  All rendering is client-side. The canvas swaps its surface and aspect ratio for each
                  platform — {meta.surface} at {meta.aspect}.
                </p>
              </div>

              {/* Live preview */}
              <div className="flex items-center justify-center bg-canvas p-6 md:p-8">
                <div className="w-full max-w-md">
                  <figure
                    className="relative flex flex-col justify-between overflow-hidden rounded-lg p-7 transition-colors duration-base ease-out md:p-9"
                    style={{ aspectRatio: meta.aspect }}
                    aria-label={`${meta.name} ${postType} preview`}
                  >
                    <div className={`absolute inset-0 -z-10 ${surface.wrap}`} aria-hidden />
                    <figcaption className={`inline-flex items-center gap-2 font-mono text-mono-xs font-bold uppercase tracking-[0.12em] ${surface.kicker}`}>
                      <TypeIcon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                      {typeMeta.kicker}
                    </figcaption>

                    <p
                      className={`max-w-[26ch] font-display font-semibold leading-tight ${surface.body} ${
                        meta.aspect === '1 / 1' ? 'text-display-sm' : 'text-title-lg'
                      } ${isPlaceholder ? 'opacity-80' : ''}`}
                    >
                      {postType === 'quote' ? `“${text}”` : text}
                    </p>

                    <div className="flex items-center justify-between gap-3">
                      <span className={`font-body text-body-sm ${surface.sub}`}>{BRAND.name}</span>
                      <LogoMark size="sm" className={surface.mark === 'dark' ? 'shadow-none' : undefined} />
                    </div>
                  </figure>
                </div>
              </div>
            </div>
          </Demo>
        </div>

        {/* ── 2 · Static templates ────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <MonoLabel tone="amber" number="02">Templates</MonoLabel>
            <Badge variant="outline" size="sm">3 layouts</Badge>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {/* Quote card */}
            <Inspectable {...QUOTE_INSPECT}>
              <div className="relative flex aspect-square flex-col justify-between overflow-hidden rounded-lg bg-gradient-accent p-6 shadow-glow">
                <Quote className="h-6 w-6 text-accent-fg/70" strokeWidth={1.5} aria-hidden />
                <p className="font-display text-title-md font-semibold leading-snug text-accent-fg">
                  Best business decision ever — hands down.
                </p>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-body text-caption text-accent-fg/80">{BRAND.name}</span>
                  <LogoMark size="sm" className="shadow-none" />
                </div>
              </div>
            </Inspectable>

            {/* Stat card */}
            <Inspectable {...STAT_CARD_INSPECT}>
              <div className="relative flex aspect-square flex-col justify-between overflow-hidden rounded-lg bg-inverse p-6">
                <MonoLabel tone="subtle" size="sm" className="text-inverse-fg/60">By the numbers</MonoLabel>
                <div className="flex flex-col gap-1">
                  <span className="font-display text-display-lg font-semibold leading-none text-accent-text">200+</span>
                  <span className="font-body text-body-sm text-inverse-fg/70">hours saved every month</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-body text-caption text-inverse-fg/70">{BRAND.name}</span>
                  <LogoMark size="sm" />
                </div>
              </div>
            </Inspectable>

            {/* OG / share card */}
            <Inspectable {...OG_INSPECT}>
              <div
                className="relative overflow-hidden rounded-lg border border-border bg-surface"
                style={{ aspectRatio: '1.91 / 1' }}
              >
                {/* Safe-zone guide — inset where avatars/UI chrome may crop on link unfurls. */}
                <div
                  className="pointer-events-none absolute inset-[8%] rounded-md border border-dashed border-accent/40"
                  aria-hidden
                />
                <div className="relative flex h-full flex-col justify-between p-6">
                  <MonoLabel tone="subtle" size="sm">Link preview</MonoLabel>
                  <p className="max-w-[22ch] font-display text-title-md font-semibold leading-tight text-fg">
                    {BRAND.oneLiner}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-body text-caption text-fg-muted">financeos.app</span>
                    <LogoMark size="sm" />
                  </div>
                </div>
              </div>
            </Inspectable>
          </div>

          <p className="max-w-3xl font-body text-body-sm leading-relaxed text-fg-muted">
            The OG card carries an <span className="text-fg">8% safe-zone inset</span> — keep the
            headline, wordmark and URL inside it so nothing crops when the link unfurls behind an
            avatar or platform chrome. Standard size is <span className="text-fg">1200 × 628</span>.
          </p>
        </div>

        {/* ── 3 · Surface recipes note ────────────────────────────────────── */}
        <div className="rounded-lg border border-border bg-canvas p-6 md:p-8">
          <MonoLabel tone="subtle">Surface recipes</MonoLabel>
          <p className="mt-3 max-w-3xl font-body text-body-md leading-relaxed text-fg-muted">
            Every post is one of three on-brand canvases — never a raw photo behind copy. Pair each
            with its guaranteed-contrast text token so the headline reads on any feed.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { name: 'Gradient', wrap: 'bg-gradient-accent', fg: 'text-accent-fg', note: 'Signature amber — feed quotes & hero posts.' },
              { name: 'Dark', wrap: 'bg-inverse', fg: 'text-inverse-fg', note: 'Carbon — stat cards & data posts.' },
              { name: 'Paper', wrap: 'bg-surface border border-border', fg: 'text-fg', note: 'Quiet light — timeline & link cards.' },
            ].map((recipe) => (
              <div key={recipe.name} className="flex flex-col gap-2">
                <div className={`flex h-20 items-end rounded-md p-3 ${recipe.wrap}`} aria-hidden>
                  <span className={`font-display text-title-sm font-semibold ${recipe.fg}`}>{recipe.name}</span>
                </div>
                <p className="font-mono text-caption leading-relaxed text-fg-subtle">{recipe.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
