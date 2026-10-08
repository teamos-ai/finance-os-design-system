/**
 * ScrollersSection — the scroll-driven imagery family. Three patterns for the marketing
 * site: a SCROLL-SYNCED SPLIT (a sticky 40/60 media panel whose product view swaps as you
 * scroll through four steps), a PRODUCT MARQUEE (six screens on a continuous loop, paused on
 * hover or focus) and a SIGNAL STRIP (partner marks + headline figures on a slow loop).
 *
 * Scroll-sync is a React IntersectionObserver (not a DOM script): the step crossing the
 * viewport centre becomes active and drives the pinned media. The two marquees are a scoped
 * CSS animation that pauses on hover/focus and FREEZES under prefers-reduced-motion (where the
 * strip also becomes horizontally scrollable). Image slots are on-token wash / inset placeholders
 * with a neutral --c-img-outline hairline — real imagery isn't required. Token-only, 8px radius,
 * no ribbons, no glass.
 */
import * as React from 'react'
import {
  Inbox,
  Columns3,
  CalendarCheck,
  CalendarDays,
  ReceiptText,
  Coins,
  Gauge,
  Scale,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/cn'

/* ── Scoped keyframes + reduced-motion guard. One <style> per section, namespaced under
      #scrollers so nothing leaks into the rest of the showcase. ───────────────────────── */
const SCROLLER_CSS = `
#scrollers .fos-scr-marquee,
#scrollers .fos-scr-strip {
  -webkit-mask-image: linear-gradient(90deg, transparent, black 7%, black 93%, transparent);
  mask-image: linear-gradient(90deg, transparent, black 7%, black 93%, transparent);
}
#scrollers .fos-scr-track,
#scrollers .fos-scr-strip-track {
  display: flex;
  width: max-content;
  will-change: transform;
}
#scrollers .fos-scr-track { animation: fos-scr-marq 48s linear infinite; }
#scrollers .fos-scr-strip-track { animation: fos-scr-strip 40s linear infinite; }
#scrollers .fos-scr-marquee:hover .fos-scr-track,
#scrollers .fos-scr-marquee:focus-within .fos-scr-track,
#scrollers .fos-scr-strip:hover .fos-scr-strip-track,
#scrollers .fos-scr-strip:focus-within .fos-scr-strip-track {
  animation-play-state: paused;
}
@keyframes fos-scr-marq { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes fos-scr-strip { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) {
  #scrollers .fos-scr-track,
  #scrollers .fos-scr-strip-track { animation: none; }
  #scrollers .fos-scr-marquee,
  #scrollers .fos-scr-strip { overflow-x: auto; }
  #scrollers .fos-scr-screen { transition: none; }
}
`

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas'

/* Media-slot hairline — the neutral, never-tinted image outline token, applied via `outline`. */
const IMG_OUTLINE: React.CSSProperties = { outline: '1px solid var(--c-img-outline)', outlineOffset: '-1px' }

/* ── Mock product screens for the sticky split — one per step, visually distinct so the
      scroll-synced swap reads clearly. Built from token bars on a surface card. ─────────── */
const Bar = ({ className }: { className?: string }) => (
  <div aria-hidden className={cn('h-1.5 rounded-sm bg-border', className)} />
)

const SCREEN_BOX = 'w-[82%] rounded-md border border-border bg-surface p-3.5 shadow-sm'
const ICON_WELL = 'grid h-7 w-7 shrink-0 place-items-center rounded-sm bg-brand-soft'

const ScreenInbox = () => (
  <div className={SCREEN_BOX}>
    <div className="flex items-center gap-2.5">
      <span className={ICON_WELL}>
        <Inbox className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} aria-hidden />
      </span>
      <div className="flex-1 space-y-1.5">
        <Bar className="w-1/2 bg-border-strong" />
        <Bar className="w-2/3" />
      </div>
    </div>
    <div className="mt-3 space-y-1.5">
      {[0, 1, 2].map((r) => (
        <div key={r} className={cn('flex items-center gap-2 rounded-sm px-2 py-1.5', r === 1 ? 'bg-accent-soft' : 'bg-inset')}>
          <span className={cn('h-4 w-4 shrink-0 rounded-sm', r === 1 ? 'bg-accent' : 'bg-border-strong')} />
          <div className="flex-1 space-y-1">
            <Bar className={cn('w-3/4', r === 1 && 'bg-accent')} />
            <Bar className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

const ScreenPipeline = () => (
  <div className={SCREEN_BOX}>
    <div className="flex items-center gap-2.5">
      <span className={ICON_WELL}>
        <Columns3 className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} aria-hidden />
      </span>
      <Bar className="w-1/3 bg-border-strong" />
    </div>
    <div className="mt-3 grid grid-cols-3 gap-2">
      {[0, 1, 2].map((c) => (
        <div key={c} className="space-y-2 rounded-sm bg-inset p-2">
          <Bar className="w-2/3" />
          <div className={cn('h-8 rounded-sm border bg-surface', c === 1 ? 'border-accent' : 'border-border')} />
          <div className="h-8 rounded-sm border border-border bg-surface" />
        </div>
      ))}
    </div>
  </div>
)

const ScreenAnalytics = () => (
  <div className={SCREEN_BOX}>
    <div className="flex items-center gap-2.5">
      <span className={ICON_WELL}>
        <CalendarCheck className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} aria-hidden />
      </span>
      <Bar className="w-2/5 bg-border-strong" />
    </div>
    <div className="mt-3 flex items-center gap-4">
      <svg viewBox="0 0 80 80" className="h-16 w-16 shrink-0" aria-hidden>
        <circle cx="40" cy="40" r="30" fill="none" stroke="var(--c-inset)" strokeWidth="12" />
        <circle
          cx="40"
          cy="40"
          r="30"
          fill="none"
          stroke="var(--c-accent)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="188.5"
          strokeDashoffset="56"
          transform="rotate(-90 40 40)"
        />
      </svg>
      <div className="flex h-16 flex-1 items-end gap-2">
        <div className="h-[40%] w-full rounded-sm bg-inset" />
        <div className="h-[65%] w-full rounded-sm bg-accent-soft" />
        <div className="h-[90%] w-full rounded-sm bg-accent" />
      </div>
    </div>
  </div>
)

const ScreenLedger = () => (
  <div className={SCREEN_BOX}>
    <div className="flex items-center gap-2.5">
      <span className={ICON_WELL}>
        <Scale className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} aria-hidden />
      </span>
      <Bar className="w-1/2 bg-border-strong" />
    </div>
    <div className="mt-3 space-y-2">
      {['success', 'accent', 'success'].map((tone, i) => (
        <div key={i} className="flex items-center justify-between gap-3 border-b border-border-subtle pb-2 last:border-0 last:pb-0">
          <Bar className="w-1/3 bg-border-strong" />
          <span className={cn('h-4 w-12 shrink-0 rounded-sm', tone === 'success' ? 'bg-success-soft' : 'bg-accent-soft')} />
        </div>
      ))}
    </div>
  </div>
)

const SCREENS: React.ComponentType[] = [ScreenInbox, ScreenPipeline, ScreenAnalytics, ScreenLedger]

interface Step {
  title: string
  body: string
  tag: string
}
const STEPS: Step[] = [
  {
    title: 'Capture every enquiry',
    body: 'Web forms, inbound calls and referral partners land in one shared inbox, tagged and assigned before anything slips.',
    tag: 'Unified inbox',
  },
  {
    title: 'A pipeline that keeps moving',
    body: 'From enquiry to pre-approval to settlement — stages update as documents arrive, so you always know what is waiting on you.',
    tag: 'Stage automation',
  },
  {
    title: 'Know your show-up rate',
    body: 'Track booked versus attended appointments by channel and broker, and see where leads go quiet.',
    tag: 'Appointment analytics',
  },
  {
    title: 'Reconcile settlements and commission',
    body: 'Match aggregator statements to settled loans, and surface clawback risk before it reaches your P&L.',
    tag: 'Aggregator reconciliation',
  },
]

/* ── Product marquee cards ───────────────────────────────────────────────────────────── */
interface MarqueeCard {
  icon: LucideIcon
  title: string
  text: string
  badge?: string
}
const CARDS: MarqueeCard[] = [
  { icon: Inbox, title: 'Shared enquiry inbox', text: 'Every web, phone and referral lead in one queue.' },
  { icon: Columns3, title: 'Loan pipeline board', text: 'Drag deals from enquiry through to settlement.' },
  { icon: CalendarDays, title: 'Appointment calendar', text: 'Bookings, reminders and no-show tracking.', badge: 'New' },
  { icon: ReceiptText, title: 'Settlement register', text: 'Funded loans matched to the right lender.' },
  { icon: Coins, title: 'Commission & clawback', text: 'Reconcile upfronts, trail and clawback risk.' },
  { icon: Gauge, title: 'Broker scorecard', text: 'Conversion and show-up, broker by broker.' },
]

const ScreenTile = ({ icon: Icon }: { icon: LucideIcon }) => (
  <div
    className="relative flex items-center justify-center overflow-hidden rounded-md bg-inset"
    style={{ aspectRatio: '16 / 9', ...IMG_OUTLINE }}
    aria-hidden
  >
    <Icon className="h-7 w-7 text-brand" strokeWidth={1.5} />
  </div>
)

/* ── Signal strip — partner marks + headline figures. Marks use currentColor. ─────────── */
type StripItem =
  | { kind: 'stat'; value: string; label: string }
  | { kind: 'logo'; name: string; mark: React.ReactNode }
  | { kind: 'divider' }

const markClass = 'h-6 w-6'
const STRIP: StripItem[] = [
  { kind: 'stat', value: '1,240', label: 'loans settled this quarter' },
  { kind: 'divider' },
  {
    kind: 'logo',
    name: 'Meridian',
    mark: (
      <svg viewBox="0 0 28 28" className={markClass} aria-hidden>
        <rect x="4" y="4" width="13" height="13" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="11" y="11" width="13" height="13" rx="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    kind: 'logo',
    name: 'Northpoint',
    mark: (
      <svg viewBox="0 0 28 28" className={markClass} aria-hidden>
        <path d="M14 5 L24 23 L14 18 L4 23 Z" fill="currentColor" />
      </svg>
    ),
  },
  { kind: 'divider' },
  { kind: 'stat', value: '68%', label: 'enquiry to appointment' },
  { kind: 'divider' },
  {
    kind: 'logo',
    name: 'Harbour FG',
    mark: (
      <svg viewBox="0 0 28 28" className={markClass} aria-hidden>
        <rect x="4" y="16" width="5" height="8" rx="1.5" fill="currentColor" />
        <rect x="12" y="10" width="5" height="14" rx="1.5" fill="currentColor" />
        <rect x="20" y="4" width="5" height="20" rx="1.5" fill="currentColor" />
      </svg>
    ),
  },
  { kind: 'stat', value: '4', label: 'aggregators reconciled' },
  { kind: 'divider' },
  {
    kind: 'logo',
    name: 'Keystone',
    mark: (
      <svg viewBox="0 0 28 28" className={markClass} aria-hidden>
        <path d="M9 5 H19 L24 23 H4 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  { kind: 'stat', value: '92%', label: 'appointment show-up' },
  { kind: 'divider' },
  {
    kind: 'logo',
    name: 'Lumen',
    mark: (
      <svg viewBox="0 0 28 28" className={markClass} aria-hidden>
        <path d="M14 4 L24 14 L14 24 L4 14 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M14 10 L18 14 L14 18 L10 14 Z" fill="currentColor" />
      </svg>
    ),
  },
  { kind: 'divider' },
]

const StripContent = ({ dup = false }: { dup?: boolean }) => (
  <>
    {STRIP.map((item, i) => {
      const key = `${dup ? 'b' : 'a'}-${i}`
      if (item.kind === 'divider') return <span key={key} aria-hidden className="h-7 w-px shrink-0 bg-border" />
      if (item.kind === 'stat')
        return (
          <div key={key} className="flex shrink-0 flex-col leading-tight" aria-hidden={dup || undefined}>
            <span className="font-display text-title-lg tabular-nums text-fg">{item.value}</span>
            <span className="mt-0.5 whitespace-nowrap font-body text-caption text-fg-subtle">{item.label}</span>
          </div>
        )
      return (
        <span key={key} className="inline-flex shrink-0 items-center gap-2.5 text-fg-muted" aria-hidden={dup || undefined}>
          {item.mark}
          <span className="whitespace-nowrap font-display text-title-sm text-fg-muted">{item.name}</span>
        </span>
      )
    })}
  </>
)

export function ScrollersSection() {
  const [active, setActive] = React.useState(0)
  const stepRefs = React.useRef<Array<HTMLElement | null>>([])

  React.useEffect(() => {
    const nodes = stepRefs.current.filter((n): n is HTMLElement => n !== null)
    if (nodes.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-step-index'))
            if (!Number.isNaN(idx)) setActive(idx)
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [])

  return (
    <Section
      id="scrollers"
      eyebrow="20 - Scroller Images"
      title="Scroller Images"
      lead="Three scroll-driven ways to show the product on the marketing site — a sticky split that walks the pipeline as you scroll, a continuous screen marquee, and a partner signal strip. Every tile is an on-token placeholder; motion pauses on hover and freezes under reduced motion."
    >
      <style>{SCROLLER_CSS}</style>

      <div className="flex flex-col gap-8">
        {/* Variation 1 — scroll-synced sticky split. overflow-visible so the sticky media
            can pin to the viewport inside the Demo frame. */}
        <Demo
          label="Scroll-synced split — sticky media swaps across four steps"
          className="overflow-visible"
        >
          <div className="grid gap-7 lg:grid-cols-[2fr_3fr]">
            {/* media cell stretches to the steps' height; the inner wrapper sticks within it */}
            <div className="relative">
              <div className="lg:sticky lg:top-24">
                <div
                  className="relative overflow-hidden rounded-lg bg-wash-tint"
                  style={{ aspectRatio: '4 / 3', ...IMG_OUTLINE }}
                >
                  {SCREENS.map((Screen, i) => (
                    <div
                      key={i}
                      aria-hidden
                      className={cn(
                        'fos-scr-screen pointer-events-none absolute inset-0 flex items-center justify-center p-5',
                        'transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none',
                        active === i ? 'scale-100 opacity-100' : 'scale-[0.98] opacity-0',
                      )}
                    >
                      <Screen />
                    </div>
                  ))}
                </div>
                <p className="mt-3 font-body text-caption text-fg-subtle">
                  Illustrative product views — sample data, not reported results.
                </p>
              </div>
            </div>

            {/* steps — the one crossing the viewport centre is active */}
            <div className="flex flex-col gap-4">
              {STEPS.map((step, i) => {
                const on = active === i
                return (
                  <article
                    key={step.title}
                    ref={(el) => {
                      stepRefs.current[i] = el
                    }}
                    data-step-index={i}
                    aria-current={on ? 'true' : undefined}
                    className={cn(
                      'rounded-lg border bg-surface p-5 transition-all duration-base ease-out motion-reduce:transition-none',
                      on ? '-translate-y-0.5 border-accent shadow-sm' : 'translate-y-0 border-border shadow-none',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'grid h-7 w-7 shrink-0 place-items-center rounded-sm font-display text-body-sm tabular-nums transition-colors duration-base motion-reduce:transition-none',
                          on ? 'bg-accent text-accent-fg' : 'bg-inset text-fg-muted',
                        )}
                      >
                        {i + 1}
                      </span>
                      <h3 className="font-display text-title-md text-fg">{step.title}</h3>
                    </div>
                    <p className="mt-2.5 font-body text-body-sm leading-relaxed text-fg-muted">{step.body}</p>
                    <div className="mt-3">
                      <Badge variant="neutral" size="sm">
                        {step.tag}
                      </Badge>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </Demo>

        {/* Variation 2 — product marquee */}
        <Demo label="Product marquee — six screens, pause on hover or focus, frozen under reduced motion">
          <div
            className={cn('fos-scr-marquee relative overflow-hidden rounded-sm', FOCUS_RING)}
            tabIndex={0}
            role="group"
            aria-label="Finance OS product screens, auto-scrolling"
          >
            <div className="fos-scr-track gap-5 py-2">
              {[false, true].map((dup) =>
                CARDS.map((c) => (
                  <Card
                    key={`${dup ? 'b' : 'a'}-${c.title}`}
                    padding="sm"
                    className="w-72 shrink-0"
                    aria-hidden={dup || undefined}
                  >
                    <ScreenTile icon={c.icon} />
                    <div className="mt-3.5 flex items-center justify-between gap-2">
                      <h4 className="font-display text-title-sm text-fg">{c.title}</h4>
                      {c.badge && (
                        <Badge variant="blue" size="sm">
                          {c.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1.5 font-body text-body-sm leading-relaxed text-fg-subtle">{c.text}</p>
                  </Card>
                )),
              )}
            </div>
          </div>
          <p className="mt-3 font-body text-caption text-fg-subtle">
            Hover, or focus the strip, to pause. Motion is frozen when reduced motion is on.
          </p>
        </Demo>

        {/* Variation 3 — signal strip */}
        <Demo label="Signal strip — partner marks and headline figures on a slow loop">
          <div
            className={cn('fos-scr-strip relative overflow-hidden border-y border-border py-5', FOCUS_RING)}
            tabIndex={0}
            role="group"
            aria-label="Partners and headline figures, auto-scrolling"
          >
            <div className="fos-scr-strip-track items-center gap-10">
              {[false, true].map((dup) => (
                <StripContent key={dup ? 'b' : 'a'} dup={dup} />
              ))}
            </div>
          </div>
          <p className="mt-3 font-body text-caption text-fg-subtle">Figures are illustrative demo data for the showcase.</p>
        </Demo>
      </div>
    </Section>
  )
}
