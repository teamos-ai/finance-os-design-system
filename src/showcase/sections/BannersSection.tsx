import * as React from 'react'
import { Megaphone, Clock, Sparkles, Zap, BadgePercent } from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { Banner, Ticker } from '@/components/ui/banner'
import { Button } from '@/components/ui/button'
import type { InspectData } from '@/components/ui/inspectable'
import { TICKER_ITEMS } from '@/data/system'

/** Fixed brand banner surfaces — theme-independent. The token/CSS lives in each banner's "+". */
function bannerInspect(key: string, label: string, bg: string, fg: string): InspectData {
  const css = `.banner-${key} {\n  background: ${bg};\n  color: ${fg};\n}`
  return {
    name: `Banner · ${label}`,
    explain: 'A fixed brand banner surface — identical in dark, light and paper, and chosen for AA over its own text.',
    token: `--banner-${key}-bg  ·  --banner-${key}-fg`,
    code: `background: ${bg};\ncolor: ${fg};`,
    download: { filename: `banner-${key}.css`, content: css, mime: 'text/css' },
  }
}

const BLACK = bannerInspect('black', 'black', '#000000', '#F4F4F5')
const ORANGE = bannerInspect('orange', 'orange gradient', 'linear-gradient(135deg, #F0B966 0%, #E68A00 100%)', '#1A1206')
const BLUE = bannerInspect('blue', 'blue gradient', 'linear-gradient(135deg, #5C6DA5 0%, #33488F 100%)', '#FFFFFF')
const PAPER = bannerInspect('paper', 'paper', '#F9F6F2', '#2A2419')
const PAPER_GRAD = bannerInspect('paper-grad', 'paper gradient', 'linear-gradient(135deg, #FBF8F3 0%, #EFD9B0 100%)', '#2A2419')
const WHITE = bannerInspect('white', 'white', '#FFFFFF', '#14161B')
const TICKER_INSPECT: InspectData = {
  name: 'Ticker',
  explain: 'A scrolling marquee of short proof points. Pairs any fixed banner surface (black · orange · blue) with a continuous, reduced-motion-safe scroll.',
  token: 'items[] · variant: black · orange · blue · reverse',
  code: '<Ticker items={TICKER_ITEMS} variant="black" />\n<Ticker items={TICKER_ITEMS} variant="orange" reverse />',
}

export function BannersSection() {
  const [dismissed, setDismissed] = React.useState(false)

  return (
    <Section
      id="banners"
      eyebrow="14 — Banners"
      title="Banners"
      lead="Alert, announcement and promo strips for websites, funnels, countdowns and timers. The fixed brand set — black, orange-gradient, blue-gradient, paper, paper-gradient and white — is theme-independent: a blue banner stays blue whether the page is dark, light or paper. The top-of-page banner is theme-aware (orange in dark, blue in light, paper-gradient in paper)."
    >
      <div className="space-y-6">
        <MonoLabel tone="subtle">The fixed six — identical in dark · light · paper</MonoLabel>

        <Demo label="Banner · black" padded={false} inspect={BLACK}>
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

        <Demo label="Banner · orange gradient (promo / CTA)" padded={false} inspect={ORANGE}>
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

        <Demo label="Banner · blue gradient (announcement)" padded={false} inspect={BLUE}>
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

        <Demo label="Banner · paper (notice)" padded={false} inspect={PAPER}>
          <Banner variant="paper" icon={Megaphone}>
            Scheduled maintenance — Sunday 02:00–04:00 AEST
          </Banner>
        </Demo>

        <Demo label="Banner · paper gradient" padded={false} inspect={PAPER_GRAD}>
          <Banner
            variant="paper-gradient"
            icon={Sparkles}
            action={
              <Button as="a" href="#hero" variant="dark" size="sm">
                Explore
              </Button>
            }
          >
            Warm paper edition — the calm operating system for serious brokers
          </Banner>
        </Demo>

        <Demo label="Banner · white (notice)" padded={false} inspect={WHITE}>
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
        <Demo label="Banner · countdown / timer" padded={false} inspect={ORANGE}>
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
          <Demo label="Ticker · scrolling marquee" padded={false} inspect={TICKER_INSPECT} className="mt-3">
            <div className="space-y-3 p-3">
              <Ticker items={TICKER_ITEMS} variant="black" />
              <Ticker items={TICKER_ITEMS} variant="orange" reverse />
              <Ticker items={TICKER_ITEMS} variant="blue" />
            </div>
          </Demo>
        </div>
      </div>
    </Section>
  )
}
