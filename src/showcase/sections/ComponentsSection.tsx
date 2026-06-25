/**
 * ComponentsSection — the interactive UI library. Live, labelled demo frames for the
 * button system (all nine variants, three sizes, a disabled state), the icon-only
 * button, the full badge taxonomy, inputs (default / hint / error), the segmented
 * control and pagination (both stateful), a two-item disclosure, the command bar with
 * /command chips, the save & celebrate buttons, and a couple of outcome stats. Every
 * example is on-token and reduced-motion safe — the showcase is the documentation.
 *
 * Each demo is wrapped in <Inspectable>: the token + code references that used to clutter
 * the page now live inside the floating inspect FAB at each item's top-right (Explain /
 * Token / Code).
 */
import { useState } from 'react'
import { Mail, Play, ArrowRight } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { Inspectable } from '@/components/ui/inspectable'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { SegmentedControl } from '@/components/ui/segmented'
import { Disclosure } from '@/components/ui/disclosure'
import { Pagination } from '@/components/ui/pagination'
import { CommandBar } from '@/components/ui/command-bar'
import { CommandChip } from '@/components/ui/command-chip'
import { SaveButton } from '@/components/ui/save-button'
import { CelebrationButton } from '@/components/ui/celebration-button'
import { Stat } from '@/components/ui/stat'
import { MonoLabel } from '@/components/ui/mono-label'

type Period = 'daily' | 'weekly' | 'monthly'

const BADGE_VARIANTS: { variant: NonNullable<BadgeProps['variant']>; label: string }[] = [
  { variant: 'neutral', label: 'Neutral' },
  { variant: 'amber', label: 'Amber' },
  { variant: 'blue', label: 'Blue' },
  { variant: 'success', label: 'Funded' },
  { variant: 'warn', label: 'Review' },
  { variant: 'danger', label: 'Overdue' },
  { variant: 'info', label: 'Info' },
  { variant: 'outline', label: 'Outline' },
]

export function ComponentsSection() {
  const [period, setPeriod] = useState<Period>('weekly')
  const [page, setPage] = useState(1)
  const [intent, setIntent] = useState<'primary' | 'secondary'>('primary')

  return (
    <Section
      id="components"
      eyebrow="11 - Components"
      title="Components"
      lead="The interactive UI library — buttons, inputs, badges and controls. Every variant, state and size, live and on-token. Flat hairline surfaces, the dark-luxury pill, and a theme-pinned accent — orange (dark), blue (light), gold (paper) — throughout. Tap the inspect button on any item for its explanation, tokens and code."
    >
      <div className="flex flex-col gap-4">
        {/* Button intents — primary (solid accent) vs secondary (outline); accent is theme-pinned */}
        <Inspectable
          name="Button intents"
          explain="Primary is the single solid call-to-action per view; secondary is its outline-only supporting action. Both ride the theme-pinned accent — orange (dark), blue (light), amber (paper)."
          token={`primary    → bg-accent · text-accent-fg\nsecondary  → border-accent-text · text-accent-text\n--c-accent (theme-pinned: orange / blue / amber)`}
          code={`<Button variant="primary">Book a call</Button>\n<Button variant="secondary">Compare plans</Button>`}
        >
          <Demo label="Button intents — primary (solid) &amp; secondary (outline)">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <MonoLabel tone="subtle">Accent follows the theme · orange (dark) · blue (light) · gold (paper)</MonoLabel>
                <SegmentedControl
                  aria-label="Button intent"
                  value={intent}
                  onValueChange={(v) => setIntent(v as 'primary' | 'secondary')}
                  options={[
                    { value: 'primary', label: 'Primary' },
                    { value: 'secondary', label: 'Secondary' },
                  ]}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-border bg-canvas p-8">
                  <Button variant={intent} size="lg">
                    {intent === 'primary' ? 'Book a call' : 'Compare plans'}
                  </Button>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button variant={intent} size="md">Medium</Button>
                    <Button variant={intent} size="sm">Small</Button>
                    <Button variant={intent} size="md" disabled>Disabled</Button>
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-3 rounded-md border border-border bg-surface p-6">
                  <div className="flex items-center gap-2">
                    <span
                      className={intent === 'primary' ? 'h-3 w-3 rounded-sm bg-accent' : 'h-3 w-3 rounded-sm border border-accent-text'}
                      aria-hidden
                    />
                    <span className="font-display text-title-sm text-fg">
                      {intent === 'primary' ? 'Primary · solid accent fill' : 'Secondary · accent outline'}
                    </span>
                  </div>
                  <p className="font-body text-body-sm leading-relaxed text-fg-muted">
                    {intent === 'primary'
                      ? 'The main call to action — one per view. Solid, in the theme accent (orange · blue · gold).'
                      : 'The supporting action — outline only, transparent inside, in the same theme accent.'}
                  </p>
                </div>
              </div>
            </div>
          </Demo>
        </Inspectable>

        {/* Buttons — all nine variants */}
        <Inspectable
          name="Button — variants"
          explain="The full button family — from the solid primary to the gradient, dark-luxury, soft, outline, ghost, danger and inline link. One component, nine intents; one is plenty per view."
          token={`variant: primary · gradient · secondary · dark · soft · outline · ghost · danger · link\nfill → bg-accent / bg-gradient-accent / bg-inverse`}
          code={`<Button variant="gradient">Start free</Button>\n<Button variant="ghost">Learn more</Button>`}
        >
          <Demo label="Button — nine variants">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Book a call</Button>
              <Button variant="gradient">Start free</Button>
              <Button variant="secondary">Compare plans</Button>
              <Button variant="dark" leadingIcon={<Play className="h-3 w-3 fill-current" strokeWidth={0} />}>
                Watch the tour
              </Button>
              <Button variant="soft">Submit</Button>
              <Button variant="outline">Export</Button>
              <Button variant="ghost">Learn more</Button>
              <Button variant="danger">Cancel plan</Button>
              <Button variant="link">
                See pricing
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </Button>
            </div>
          </Demo>
        </Inspectable>

        {/* Buttons — sizes + disabled */}
        <Inspectable
          name="Button sizes"
          explain="Three sizes — sm, md, lg — share one type ramp and the 8px-max radius. The disabled state drops to 50% opacity and switches off pointer events."
          token={`size: sm · md · lg\ndisabled → opacity-50 · pointer-events-none\nradius → --radius-lg (8px)`}
          code={`<Button size="lg">Large</Button>\n<Button disabled>Disabled</Button>`}
        >
          <Demo label="Button — sizes &amp; disabled state">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" disabled>
                  Disabled
                </Button>
                <Button variant="secondary" disabled>
                  Disabled
                </Button>
              </div>
            </div>
          </Demo>
        </Inspectable>

        {/* Icon buttons — five variants, three sizes */}
        <Inspectable
          name="IconButton"
          explain="An icon-only button for compact actions. It always needs an aria-label so screen readers can name it. Five variants and three sizes match the text button system."
          token={`variant: dark · accent · soft · outline · ghost\nsize: sm · md · lg`}
          code={`<IconButton variant="accent" aria-label="Confirm">\n  <ArrowRight className="h-4 w-4" />\n</IconButton>`}
        >
          <Demo label="IconButton — icon-only, aria-label required">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-3">
                <IconButton variant="dark" aria-label="Play the tour">
                  <Play className="h-4 w-4 fill-current" strokeWidth={0} />
                </IconButton>
                <IconButton variant="accent" aria-label="Confirm">
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </IconButton>
                <IconButton variant="soft" aria-label="Email us">
                  <Mail className="h-4 w-4" strokeWidth={1.5} />
                </IconButton>
                <IconButton variant="outline" aria-label="Next">
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </IconButton>
                <IconButton variant="ghost" aria-label="Open mail">
                  <Mail className="h-4 w-4" strokeWidth={1.5} />
                </IconButton>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <IconButton size="sm" variant="dark" aria-label="Play small">
                  <Play className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
                </IconButton>
                <IconButton size="md" variant="dark" aria-label="Play medium">
                  <Play className="h-4 w-4 fill-current" strokeWidth={0} />
                </IconButton>
                <IconButton size="lg" variant="dark" aria-label="Play large">
                  <Play className="h-5 w-5 fill-current" strokeWidth={0} />
                </IconButton>
              </div>
            </div>
          </Demo>
        </Inspectable>

        {/* Badges — every variant */}
        <Inspectable
          name="Badge"
          explain="A small status pill for state and taxonomy. Each variant maps to a semantic colour, and an optional leading dot reinforces the meaning at a glance."
          token={`variant: neutral · amber · blue · success · warn · danger · info · outline\n--c-success / --c-warning / --c-danger / --c-info (soft fills)`}
          code={`<Badge variant="success" dot>Funded</Badge>`}
        >
          <Demo label="Badge — every variant">
            <div className="flex flex-wrap items-center gap-2.5">
              {BADGE_VARIANTS.map((b) => (
                <Badge key={b.variant} variant={b.variant} dot>
                  {b.label}
                </Badge>
              ))}
            </div>
          </Demo>
        </Inspectable>

        {/* Inputs — default / hint / error */}
        <Inspectable
          name="Input"
          explain="The text field across three states — default, with a hint, and with an error. A leading icon and label are optional; an error message replaces the hint."
          token={`bg-surface · border-border-strong\nradius → --radius-md (6px)\nerror → text-danger`}
          code={`<Input label="Work email" icon={Mail} />\n<Input label="ABN" error="Enter a valid ABN." />`}
        >
          <Demo label="Input — default, with hint, with error">
            <div className="grid max-w-2xl gap-5 md:grid-cols-2">
              <Input label="Full name" placeholder="Jordan broker" />
              <Input label="Work email" type="email" icon={Mail} placeholder="jordan@firm.com.au" />
              <Input
                label="Brokerage"
                placeholder="Meridian Capital"
                hint="Shown to your clients on every statement."
              />
              <Input label="ABN" placeholder="51 824 753 556" error="Enter a valid 11-digit ABN." />
            </div>
          </Demo>
        </Inspectable>

        {/* Segmented control + pagination — both live */}
        <Inspectable
          name="Segmented + Pagination"
          explain="Two stateful controls — a segmented switch for mutually-exclusive options and pagination for paged data. Both are keyboard-navigable; the active state is the dark-luxury pill."
          token={`active pill → bg-inverse · text-inverse-fg\ntrack → bg-surface · border-border`}
          code={`<SegmentedControl value={period} onValueChange={setPeriod} options={…} />\n<Pagination page={page} total={8} onChange={setPage} />`}
        >
          <Demo label="SegmentedControl + Pagination — live state">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-8">
                <SegmentedControl
                  aria-label="Reporting period"
                  value={period}
                  onValueChange={setPeriod}
                  options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                  ]}
                />
                <Pagination page={page} total={8} onChange={setPage} />
              </div>
              <p className="font-body text-body-sm text-fg-muted">
                Period: <span className="font-mono text-accent-text">{period}</span> · Page{' '}
                <span className="font-mono text-accent-text">{page}</span> of 8. Both controls are
                keyboard-navigable; the active state is the dark-luxury pill.
              </p>
            </div>
          </Demo>
        </Inspectable>

        {/* Disclosure — two items */}
        <Inspectable
          name="Disclosure"
          explain="A calm accordion that reveals answers on demand. Its height animates via grid-template-rows, so the motion stays smooth and reduced-motion safe."
          token={`animation → grid-rows-[0fr] ⇆ grid-rows-[1fr]\nborder-border · text-fg-muted`}
          code={`<Disclosure title="How is data secured?" defaultOpen>\n  …\n</Disclosure>`}
        >
          <Demo label="Disclosure — calm accordion">
            <div className="flex flex-col gap-3">
              <Disclosure title="How is client data secured?" defaultOpen>
                Every record is encrypted at rest and in transit. Access is role-scoped, and a full
                audit trail records who viewed or changed each file — defensible by design.
              </Disclosure>
              <Disclosure title="Can I migrate from my current CRM?">
                Yes. We import contacts, pipelines and document history, then run a reconciliation pass
                so nothing is dropped. Most brokerages are live within thirty days.
              </Disclosure>
            </div>
          </Demo>
        </Inspectable>

        {/* Command bar + chips */}
        <Inspectable
          name="CommandBar"
          explain="The AI command field with suggestion chips — type a slash command or tap a chip to prefill it. It is the hero's centrepiece, reusable anywhere in the product."
          token={`bg-surface · border-border\nchip → bg-canvas-muted · text-fg-muted`}
          code={`<CommandBar />\n<CommandChip command="import my loan book" />`}
        >
          <Demo label="CommandBar + /command chips">
            <div className="flex flex-col gap-4">
              <CommandBar />
              <div className="flex flex-wrap gap-2.5">
                <CommandChip command="import my loan book" />
                <CommandChip command="draft a settlement letter" />
                <CommandChip command="run a serviceability check" />
              </div>
            </div>
          </Demo>
        </Inspectable>

        {/* Save + celebrate */}
        <Inspectable
          name="Confirmation buttons"
          explain="Two buttons with built-in feedback motion — Save sends up a few green check chips, Mark settled throws a brief shower of amber streamers. Both honour prefers-reduced-motion."
          token={`success chips → --c-success\nstreamers → --p-amber-* primitives`}
          code={`<SaveButton>Save changes</SaveButton>\n<CelebrationButton>Mark settled</CelebrationButton>`}
        >
          <Demo label="SaveButton + CelebrationButton — confirmation motion">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <SaveButton>Save changes</SaveButton>
                <CelebrationButton>Mark settled</CelebrationButton>
              </div>
              <p className="font-body text-body-sm text-fg-muted">
                Save sends up a few green check chips; Mark settled throws a brief shower of amber
                streamers. Both honour <span className="font-mono">prefers-reduced-motion</span>.
              </p>
            </div>
          </Demo>
        </Inspectable>

        {/* Stats — outcome figures */}
        <Inspectable
          name="Stat"
          explain="An outcome figure that counts up as it scrolls into view. It takes a prefix, a suffix, or a fully custom display string for non-numeric values."
          token={`value → font-display · text-fg\nlabel → text-fg-subtle`}
          code={`<Stat value={1284} prefix="$" suffix="M" label="Settled this quarter" />`}
        >
          <Demo label="Stat — outcome figures">
            <div className="flex flex-wrap items-end gap-12">
              <Stat value={1284} prefix="$" suffix="M" label="Settled this quarter" />
              <Stat value={98} suffix="%" label="On-time settlements" />
              <Stat display="30 days" label="Live on the platform" />
            </div>
          </Demo>
        </Inspectable>
      </div>
    </Section>
  )
}
