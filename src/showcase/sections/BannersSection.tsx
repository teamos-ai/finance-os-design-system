import * as React from 'react'
import { Megaphone, Clock, Sparkles, Zap, BadgePercent } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { Banner, Ticker } from '@/components/ui/banner'
import { Button } from '@/components/ui/button'
import { TICKER_ITEMS } from '@/data/system'

export function BannersSection() {
  const [dismissed, setDismissed] = React.useState(false)

  return (
    <Section
      id="banners"
      eyebrow="14 — Banners"
      title="Banners"
      lead="Alert, announcement and promo strips for websites, funnels, countdowns and timers. The fixed brand set — black, orange-gradient, blue-gradient, paper and white — is theme-independent: a blue banner stays blue whether the page is dark, light or paper. Drop one at the top of any page."
    >
      <div className="space-y-6">
        <MonoLabel tone="subtle">The fixed five — identical in dark · light · paper</MonoLabel>

        <Demo label="Banner · black  ·  --banner-black-*" padded={false}>
          {dismissed ? (
            <div className="px-4 py-3 text-center font-mono text-caption text-fg-subtle">Dismissed — reload to restore.</div>
          ) : (
            <Banner
              variant="black"
              icon={Zap}
              onDismiss={() => setDismissed(true)}
              action={
                <a href="#demos" className="font-mono text-mono-xs uppercase underline underline-offset-4">
                  See it live
                </a>
              }
            >
              New — the Finance OS design system is now live
            </Banner>
          )}
        </Demo>

        <Demo label="Banner · orange gradient (promo / CTA)  ·  --banner-orange-*" padded={false}>
          <Banner
            variant="orange"
            icon={Sparkles}
            action={
              <Button as="a" href="#hero" variant="dark" size="sm">
                Get started
              </Button>
            }
          >
            Launch offer — replace your whole tech stack for $297/mo
          </Banner>
        </Demo>

        <Demo label="Banner · blue gradient (announcement)  ·  --banner-blue-*" padded={false}>
          <Banner
            variant="blue"
            icon={BadgePercent}
            action={
              <Button as="a" href="#pricing" variant="dark" size="sm">
                Claim
              </Button>
            }
          >
            Atlas tier unlocked — annual plans now include unlimited seats
          </Banner>
        </Demo>

        <Demo label="Banner · paper (notice)  ·  --banner-paper-*" padded={false}>
          <Banner variant="paper" icon={Megaphone}>
            Scheduled maintenance — Sunday 02:00–04:00 AEST
          </Banner>
        </Demo>

        <Demo label="Banner · white (notice)  ·  --banner-white-*" padded={false}>
          <Banner
            variant="white"
            icon={Megaphone}
            action={
              <a href="#changelog" className="font-mono text-mono-xs uppercase underline underline-offset-4">
                Read more
              </a>
            }
          >
            Changelog — 12 new sections shipped this release
          </Banner>
        </Demo>

        <MonoLabel tone="subtle">Countdown / timer — pair any fixed banner with a live timer chip</MonoLabel>
        <Demo label="Banner · countdown / timer" padded={false}>
          <Banner
            variant="orange"
            icon={Clock}
            action={
              <Button variant="dark" size="sm">
                Claim now
              </Button>
            }
          >
            Early-bird pricing ends in
            <span className="ml-2 inline-flex items-center gap-1 rounded-sm bg-black/15 px-2 py-0.5 font-bold tabular-nums">
              23 : 59 : 48
            </span>
          </Banner>
        </Demo>

        <div>
          <MonoLabel tone="subtle">Ticker — scrolling marquee (black · orange · blue)</MonoLabel>
          <div className="mt-3 space-y-3">
            <Ticker items={TICKER_ITEMS} variant="black" />
            <Ticker items={TICKER_ITEMS} variant="orange" reverse />
            <Ticker items={TICKER_ITEMS} variant="blue" />
          </div>
        </div>

        <p className="text-center font-mono text-caption text-fg-subtle">
          Fixed surfaces draw from theme-independent <code className="text-accent-text">--banner-*</code> tokens — each chosen
          for AA over its own text, so the set is consistent in every mode.
        </p>
      </div>
    </Section>
  )
}
