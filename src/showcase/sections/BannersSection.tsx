import * as React from 'react'
import { Megaphone, Clock, Sparkles, Zap } from 'lucide-react'
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
      lead="Alert, announcement and promo strips for websites, funnels, countdowns and timers — three brand surfaces (gradient, dark, paper) plus a scrolling ticker. Drop one at the top of any page."
    >
      <div className="space-y-6">
        <Demo label="Banner · gradient (promo / CTA)" padded={false}>
          <Banner
            variant="gradient"
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

        <Demo label="Banner · dark (announcement, dismissible)" padded={false}>
          {dismissed ? (
            <div className="px-4 py-3 text-center font-mono text-caption text-fg-subtle">Dismissed — reload to restore.</div>
          ) : (
            <Banner
              variant="dark"
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

        <Demo label="Banner · paper (notice)" padded={false}>
          <Banner variant="paper" icon={Megaphone}>
            Scheduled maintenance — Sunday 02:00–04:00 AEST
          </Banner>
        </Demo>

        <Demo label="Banner · countdown / timer" padded={false}>
          <Banner
            variant="soft"
            icon={Clock}
            action={
              <Button variant="primary" size="sm">
                Claim now
              </Button>
            }
          >
            Early-bird pricing ends in
            <span className="ml-2 inline-flex items-center gap-1 rounded-sm bg-canvas px-2 py-0.5 font-bold tabular-nums text-fg">
              23 : 59 : 48
            </span>
          </Banner>
        </Demo>

        <div>
          <MonoLabel tone="subtle">Ticker — scrolling marquee (dark · gradient · paper)</MonoLabel>
          <div className="mt-3 space-y-3">
            <Ticker items={TICKER_ITEMS} variant="dark" />
            <Ticker items={TICKER_ITEMS} variant="gradient" reverse />
            <Ticker items={TICKER_ITEMS} variant="paper" />
          </div>
        </div>

        <p className="text-center font-mono text-caption text-fg-subtle">
          Backgrounds: <code className="text-accent-text">bg-gradient-accent</code> ·{' '}
          <code className="text-accent-text">bg-inverse</code> · <code className="text-accent-text">bg-canvas-muted</code> — AA over their text.
        </p>
      </div>
    </Section>
  )
}
