/**
 * ComponentsSection — the interactive UI library. Live, labelled demo frames for the
 * button system (all nine variants, three sizes, a disabled state), the icon-only
 * button, the full badge taxonomy, inputs (default / hint / error), the segmented
 * control and pagination (both stateful), a two-item disclosure, the command bar with
 * /command chips, the save & celebrate buttons, and a couple of outcome stats. Every
 * example is on-token and reduced-motion safe — the showcase is the documentation.
 */
import { useState } from 'react'
import { Mail, Play, ArrowRight } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
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
  { variant: 'amber', label: 'amber' },
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

  return (
    <Section
      id="components"
      eyebrow="11 - Components"
      title="Components"
      lead="The interactive UI library — buttons, inputs, badges and controls. Every variant, state and size, live and on-token. Flat hairline surfaces, the dark-luxury pill, and one disciplined amber accent throughout."
    >
      <div className="flex flex-col gap-4">
        {/* Buttons — all nine variants */}
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

        {/* Buttons — sizes + disabled */}
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
              <MonoLabel tone="subtle">opacity 50 · pointer-events none</MonoLabel>
            </div>
          </div>
        </Demo>

        {/* Icon buttons — five variants, three sizes */}
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

        {/* Badges — every variant */}
        <Demo label="Badge — every variant">
          <div className="flex flex-wrap items-center gap-2.5">
            {BADGE_VARIANTS.map((b) => (
              <Badge key={b.variant} variant={b.variant} dot>
                {b.label}
              </Badge>
            ))}
          </div>
        </Demo>

        {/* Inputs — default / hint / error */}
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

        {/* Segmented control + pagination — both live */}
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

        {/* Disclosure — two items */}
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

        {/* Command bar + chips */}
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

        {/* Save + celebrate */}
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

        {/* Stats — outcome figures */}
        <Demo label="Stat — outcome figures">
          <div className="flex flex-wrap items-end gap-12">
            <Stat value={1284} prefix="$" suffix="M" label="Settled this quarter" />
            <Stat value={98} suffix="%" label="On-time settlements" />
            <Stat display="30 days" label="Live on the platform" />
          </div>
        </Demo>
      </div>
    </Section>
  )
}
