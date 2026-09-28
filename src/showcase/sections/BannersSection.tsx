import * as React from 'react'
import { Megaphone, Clock, Zap, BadgePercent } from 'lucide-react'
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
const BLUE = bannerInspect('blue', 'blue gradient', 'linear-gradient(135deg, #5C6DA5 0%, #33488F 100%)', '#FFFFFF')
const WHITE = bannerInspect('white', 'white', '#FFFFFF', '#14161B')
const TICKER_INSPECT: InspectData = {
  name: 'Ticker',
  explain: 'A scrolling marquee of short proof points. Pairs any fixed banner surface (black · blue · white) with a continuous, reduced-motion-safe scroll.',
  token: 'items[] · variant: black · blue · white · reverse',
  code: '<Ticker items={TICKER_ITEMS} variant="black" />\n<Ticker items={TICKER_ITEMS} variant="blue" reverse />',
}

export function BannersSection() {
  const [dismissed, setDismissed] = React.useState(false)

  return (
    <Section
      id="banners"
      eyebrow="14 — Banners"
      title="Banners"
      lead="Alert, announcement and promo strips for websites, funnels, countdowns and timers. The fixed brand set — black, blue-gradient and white — plus the signature blue-gradient top-of-page banner."
    >
      <div className="space-y-6">
        <MonoLabel tone="subtle">The fixed set — black · blue · white</MonoLabel>

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

        <Demo label="Banner · blue gradient (promo / announcement)" padded={false} inspect={BLUE}>
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
        <Demo label="Banner · countdown / timer" padded={false} inspect={BLUE}>
          <Banner
            variant="blue"
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
          <MonoLabel tone="subtle">Ticker — scrolling marquee (black · white · blue)</MonoLabel>
          <Demo label="Ticker · scrolling marquee" padded={false} inspect={TICKER_INSPECT} className="mt-3">
            <div className="space-y-3 p-3">
              <Ticker items={TICKER_ITEMS} variant="black" />
              <Ticker items={TICKER_ITEMS} variant="white" reverse />
              <Ticker items={TICKER_ITEMS} variant="blue" />
            </div>
          </Demo>
        </div>
      </div>
    </Section>
  )
}
