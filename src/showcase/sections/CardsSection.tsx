/**
 * CardsSection — the card family. Shows the base Card (Header/Title/Description/
 * Content/Footer), the FeatureCard grid (from FEATURES), a ToolCard row (from
 * TOOLS_REPLACED), a Stat-inside-a-Card outcome figure, and the media card with the
 * on-token wash treatment (placeholderIcon + overlay badge + meta + actions). Every
 * variant rides the shared primitives so the whole family stays on the locked tokens —
 * flat hairline surfaces, one shadow on hover, 8px squircles, zero glass.
 */
import {
  Inbox,
  Mail,
  MessageSquare,
  Filter,
  Globe,
  CalendarCheck,
  Workflow,
  Star,
  TrendingUp,
  LineChart,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { FeatureCard } from '@/components/ui/feature-card'
import { ToolCard } from '@/components/ui/tool-card'
import { Stat } from '@/components/ui/stat'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MonoLabel } from '@/components/ui/mono-label'
import type { Accent } from '@/lib/accents'
import { FEATURES, TOOLS_REPLACED } from '@/data/system'

/** Per-tool icon + accent for the ToolCard row, keyed off the TOOLS_REPLACED strings. */
const TOOL_META: Record<string, { icon: LucideIcon; accent: Accent }> = {
  CRM: { icon: Inbox, accent: 'gold' },
  'Email marketing': { icon: Mail, accent: 'amber' },
  'SMS platform': { icon: MessageSquare, accent: 'blue' },
  'Funnel builder': { icon: Filter, accent: 'gold' },
  'Website builder': { icon: Globe, accent: 'amber' },
  'Booking software': { icon: CalendarCheck, accent: 'blue' },
  Automation: { icon: Workflow, accent: 'gold' },
  'Review management': { icon: Star, accent: 'amber' },
}

export function CardsSection() {
  return (
    <Section
      id="cards"
      eyebrow="12 - Cards"
      title="Cards"
      lead="The card family — a flat hairline surface that scales from a plain text block to a feature cell, a tool tile, an outcome figure and a photo-topped record. One shadow on hover, 8px squircles, zero glass."
    >
      <div className="flex flex-col gap-8">
        {/* Base card — full anatomy */}
        <Demo
          label="Base card — Header · Title · Description · Content · Footer"
          action={<MonoLabel tone="subtle" number="01">Card</MonoLabel>}
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <Card interactive>
              <CardHeader>
                <MonoLabel number="01">Pipeline</MonoLabel>
                <CardTitle>One pipeline, every enquiry</CardTitle>
                <CardDescription>
                  First enquiry to settlement, tracked in one place.
                </CardDescription>
              </CardHeader>
              <CardContent>
                Borrowers, deals and follow-ups live on a single surface — nothing chased
                across three disconnected tools, nothing slipping between them.
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="sm">
                  View pipeline
                </Button>
                <Button variant="secondary" size="sm">
                  Add lead
                </Button>
              </CardFooter>
            </Card>

            <Card tone="soft">
              <CardHeader>
                <MonoLabel tone="subtle" number="02">Tone · soft</MonoLabel>
                <CardTitle>Tones, padding & radius</CardTitle>
              </CardHeader>
              <CardContent>
                <code className="font-mono text-mono-xs text-fg-subtle">tone</code>{' '}
                <span className="text-fg-muted">surface · elevated · soft</span>,{' '}
                <code className="font-mono text-mono-xs text-fg-subtle">padding</code>{' '}
                <span className="text-fg-muted">none · sm · md · lg</span>,{' '}
                <code className="font-mono text-mono-xs text-fg-subtle">radius</code>{' '}
                <span className="text-fg-muted">md · lg</span>. Add{' '}
                <code className="font-mono text-mono-xs text-fg-subtle">interactive</code>{' '}
                for the hover lift — the border darkens and a single soft shadow appears.
              </CardContent>
            </Card>
          </div>
          <p className="mt-4 font-mono text-caption text-fg-subtle">
            Default <code className="text-fg-muted">tone=surface · radius=lg · padding=md</code>. The left card sets <code className="text-fg-muted">interactive</code>; the right uses <code className="text-fg-muted">tone=soft</code>.
          </p>
        </Demo>

        {/* Feature cards — from FEATURES */}
        <Demo
          label="Feature cards — icon well · title · body"
          action={<MonoLabel tone="subtle" number="02">FeatureCard</MonoLabel>}
        >
          <div className="grid gap-5 md:grid-cols-3">
            {FEATURES.slice(0, 3).map((f, i) => (
              <FeatureCard
                key={f.title}
                icon={f.Icon}
                number={String(i + 1).padStart(2, '0')}
                eyebrow={f.tagline}
                title={f.title}
                description={f.description}
                accent={f.accent}
              />
            ))}
          </div>
          <p className="mt-4 font-mono text-caption text-fg-subtle">
            The workhorse of feature grids and bento cells. The numbered overline gives the <code className="text-fg-muted">01 02 03</code> rhythm; the icon well takes the card's <code className="text-fg-muted">accent</code>.
          </p>
        </Demo>

        {/* Tool cards — from TOOLS_REPLACED */}
        <Demo
          label="Tool cards — what Finance OS replaces"
          action={<MonoLabel tone="subtle" number="03">ToolCard</MonoLabel>}
        >
          <div className="-mx-2 flex gap-5 overflow-x-auto px-2 pb-2">
            {TOOLS_REPLACED.map((name) => {
              const m = TOOL_META[name]
              return (
                <ToolCard
                  key={name}
                  name={name}
                  meta="Replaced by Finance OS"
                  icon={m?.icon ?? Inbox}
                  accent={m?.accent ?? 'gold'}
                />
              )
            })}
          </div>
          <p className="mt-4 font-mono text-caption text-fg-subtle">
            A fixed-width tile built for a horizontal carousel — coloured icon, name, mono meta line and a small accent <code className="text-fg-muted">Replaces</code> badge. Scrolls on overflow.
          </p>
        </Demo>

        {/* Stat card + media card */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Stat inside a Card */}
          <Demo
            label="Stat card — an outcome figure on a surface"
            action={<MonoLabel tone="subtle" number="04">Stat</MonoLabel>}
          >
            <Card interactive>
              <CardHeader>
                <MonoLabel tone="success" dot>
                  Last 30 days
                </MonoLabel>
              </CardHeader>
              <div className="grid grid-cols-2 gap-6">
                <Stat value={200} suffix="+" label="Hours saved monthly" />
                <Stat value={1315} prefix="$" label="Saved vs. stack" />
              </div>
              <CardFooter className="mt-6 border-t border-border-subtle pt-4">
                <span className="inline-flex items-center gap-1.5 font-mono text-caption text-success">
                  <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                  Trending up
                </span>
              </CardFooter>
            </Card>
            <p className="mt-4 font-mono text-caption text-fg-subtle">
              Drop <code className="text-fg-muted">Stat</code> into any Card for a dashboard figure. <code className="text-fg-muted">value</code> counts up (reduced-motion safe); pass <code className="text-fg-muted">display</code> for non-numeric figures.
            </p>
          </Demo>

          {/* Media card — wash treatment */}
          <Demo
            label="Media card — wash placeholder · badge · meta · actions"
            action={<MonoLabel tone="subtle" number="05">Card · media</MonoLabel>}
          >
            <Card
              accent="gold"
              placeholderIcon={LineChart}
              badge={
                <Badge variant="gold" size="sm">
                  Report
                </Badge>
              }
              meta={[
                { icon: CalendarCheck, label: 'Monthly' },
                { icon: TrendingUp, label: 'Live data' },
              ]}
              actions={[{ label: 'Export' }, { label: 'Open report' }]}
              interactive
            >
              <CardTitle>Pipeline performance</CardTitle>
              <CardDescription className="mt-1.5">
                Lead sources, conversion and settlement velocity — refreshed as deals move.
              </CardDescription>
            </Card>
            <p className="mt-4 font-mono text-caption text-fg-subtle">
              With no <code className="text-fg-muted">image</code>, the media tile renders an on-token diagonal <code className="text-fg-muted">wash</code> from the card's accent and centres the <code className="text-fg-muted">placeholderIcon</code> — a graceful stand-in until real imagery lands. The last action goes solid, the rest secondary.
            </p>
          </Demo>
        </div>
      </div>
    </Section>
  )
}
