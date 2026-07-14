/**
 * CardsSection — the card family. Base Card (Header/Title/Description/Content/Footer),
 * the FeatureCard grid, a ToolCard row, a Stat-inside-a-Card figure, and the media card
 * with the on-token wash. The prop docs / tokens live inside each demo's "+" inspector,
 * so the page shows the cards themselves — flat hairline surfaces, one hover shadow, 8px
 * squircles, zero glass.
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
import type { InspectData } from '@/components/ui/inspectable'
import type { Accent } from '@/lib/accents'
import { FEATURES, TOOLS_REPLACED } from '@/data/system'

/** Per-tool icon + accent for the ToolCard row, keyed off the TOOLS_REPLACED strings. */
const TOOL_META: Record<string, { icon: LucideIcon; accent: Accent }> = {
  CRM: { icon: Inbox, accent: 'amber' },
  'Email marketing': { icon: Mail, accent: 'amber' },
  'SMS platform': { icon: MessageSquare, accent: 'blue' },
  'Funnel builder': { icon: Filter, accent: 'amber' },
  'Website builder': { icon: Globe, accent: 'amber' },
  'Booking software': { icon: CalendarCheck, accent: 'blue' },
  Automation: { icon: Workflow, accent: 'amber' },
  'Review management': { icon: Star, accent: 'amber' },
}

const CARD_INSPECT: InspectData = {
  name: 'Card',
  explain: 'The base surface — Header, Title, Description, Content, Footer. Flat hairline, one soft shadow on hover, 8px radius. The workhorse the rest of the family is built on.',
  token: 'tone: surface · elevated · soft\npadding: none · sm · md · lg\nradius: md · lg\ninteractive → hover lift (border darkens + one shadow)',
  code: '<Card interactive>\n  <CardHeader>\n    <CardTitle>One pipeline, every enquiry</CardTitle>\n    <CardDescription>…</CardDescription>\n  </CardHeader>\n  <CardContent>…</CardContent>\n  <CardFooter>\n    <Button variant="primary" size="sm">View pipeline</Button>\n  </CardFooter>\n</Card>',
}
const FEATURE_INSPECT: InspectData = {
  name: 'FeatureCard',
  explain: 'The workhorse of feature grids and bento cells. A numbered overline gives the 01·02·03 rhythm; the icon well takes the card accent.',
  token: 'icon · number · eyebrow · title · description · accent',
  code: '<FeatureCard\n  icon={Icon}\n  number="01"\n  eyebrow={tagline}\n  title={title}\n  description={description}\n  accent="amber"\n/>',
}
const TOOL_INSPECT: InspectData = {
  name: 'ToolCard',
  explain: 'A fixed-width tile built for a horizontal carousel — coloured icon, name, mono meta line and a small accent “Replaces” badge. Scrolls on overflow.',
  token: 'name · meta · icon · accent',
  code: '<ToolCard name="CRM" meta="Replaced by Finance OS" icon={Inbox} accent="amber" />',
}
const STAT_INSPECT: InspectData = {
  name: 'Stat',
  explain: 'Drop a Stat into any Card for a dashboard figure. The value counts up (reduced-motion safe); pass a display string for non-numeric figures.',
  token: 'value (counts up) · prefix · suffix · label · display',
  code: '<Stat value={200} suffix="+" label="Hours saved monthly" />\n<Stat value={1315} prefix="$" label="Saved vs. stack" />',
}
const MEDIA_INSPECT: InspectData = {
  name: 'Card · media',
  explain: 'With no image, the media tile renders an on-token diagonal wash from the card accent and centres the placeholder icon — a graceful stand-in until real imagery lands. The last action goes solid, the rest secondary.',
  token: 'image · wash · placeholderIcon · badge · meta[] · actions[] · accent',
  code: '<Card\n  accent="amber"\n  placeholderIcon={LineChart}\n  badge={<Badge variant="amber" size="sm">Report</Badge>}\n  meta={[{ icon: CalendarCheck, label: "Monthly" }]}\n  actions={[{ label: "Export" }, { label: "Open report" }]}\n  interactive\n>…</Card>',
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
        <Demo label="Base card — Header · Title · Description · Content · Footer" inspect={CARD_INSPECT}>
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
                <CardTitle>A calmer surface for context</CardTitle>
              </CardHeader>
              <CardContent>
                The soft tone recedes a step — ideal for supporting notes, empty states and
                secondary panels that should sit quietly beside the primary card.
              </CardContent>
            </Card>
          </div>
        </Demo>

        {/* Feature cards — from FEATURES */}
        <Demo label="Feature cards — icon well · title · body" inspect={FEATURE_INSPECT}>
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
        </Demo>

        {/* Tool cards — from TOOLS_REPLACED */}
        <Demo label="Tool cards — what Finance OS replaces" inspect={TOOL_INSPECT}>
          <div className="-mx-2 flex gap-5 overflow-x-auto px-2 pb-2">
            {TOOLS_REPLACED.map((name) => {
              const m = TOOL_META[name]
              return (
                <ToolCard
                  key={name}
                  name={name}
                  meta="Replaced by Finance OS"
                  icon={m?.icon ?? Inbox}
                  accent={m?.accent ?? 'amber'}
                />
              )
            })}
          </div>
        </Demo>

        {/* Stat card + media card */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Stat inside a Card */}
          <Demo label="Stat card — an outcome figure on a surface" inspect={STAT_INSPECT}>
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
          </Demo>

          {/* Media card — wash treatment */}
          <Demo label="Media card — wash placeholder · badge · meta · actions" inspect={MEDIA_INSPECT}>
            <Card
              accent="amber"
              placeholderIcon={LineChart}
              badge={
                <Badge variant="amber" size="sm">
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
          </Demo>
        </div>
      </div>
    </Section>
  )
}
