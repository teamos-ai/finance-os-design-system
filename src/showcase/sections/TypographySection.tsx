import { Section } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { cn } from '@/lib/cn'

type Row = { token: string; cls: string; spec: string; sample: string }

const DISPLAY: Row[] = [
  { token: 'display-2xl', cls: 'text-display-2xl', spec: '44–72px · 600 · -0.02em', sample: 'Predictable pipeline' },
  { token: 'display-xl', cls: 'text-display-xl', spec: '36–56px · 600 · -0.02em', sample: 'More settlements' },
  { token: 'display-lg', cls: 'text-display-lg', spec: '40px · 600 · -0.015em', sample: 'Less admin' },
  { token: 'display-md', cls: 'text-display-md', spec: '32px · 600', sample: 'The calm operator' },
  { token: 'title-lg', cls: 'text-title-lg', spec: '20px · 600', sample: 'Unified CRM' },
  { token: 'title-md', cls: 'text-title-md', spec: '18px · 600', sample: 'Automated follow-up' },
]

const BODY: Row[] = [
  { token: 'body-lg', cls: 'text-body-lg', spec: '17px · 1.7', sample: 'A broker-specific system that captures every enquiry and follows up instantly.' },
  { token: 'body-md', cls: 'text-body-md', spec: '15px · 1.65', sample: 'It replaces fragmented tools with one dependable operating layer.' },
  { token: 'body-sm', cls: 'text-body-sm', spec: '13px · 1.6', sample: 'Predictable pipeline. More settlements. Less admin.' },
  { token: 'caption', cls: 'text-caption', spec: '12px · 1.4', sample: 'Replaces 8 tools · $297/mo' },
  { token: 'mono-xs', cls: 'text-mono-xs uppercase', spec: '11px · 700 · 0.04em', sample: 'Theme accent · pinned per mode' },
]

const BODY_COPY = `Most brokers don't lose deals because they're bad at their job. They lose them in the gaps — the enquiry that lands at 9pm and gets a reply at noon, the pre-approval that goes quiet, the past client who refinances with someone else because no one followed up.

Finance OS closes those gaps. Every enquiry is captured the moment it arrives, every follow-up fires on time, and every conversation — SMS, email, social — lives in one place. You stay the trusted adviser; the system handles the chase. The result is a pipeline you can actually predict: more settlements, less admin, and a business that runs whether you're in the office or not.`

export function TypographySection() {
  return (
    <Section
      id="typography"
      eyebrow="06 — Typography"
      title="Typography"
      lead="Spline Sans carries every heading and figure; Anonymous Pro carries body, captions and the mono overline. Highlighted headings take the THEME ACCENT automatically — orange in dark, blue in light, gold in paper — so type stays on-brand in every mode. Switch the theme (top-right) to preview."
    >
      <div className="space-y-8">
        {/* display specimens — highlighted in the theme accent (text-highlight) */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <MonoLabel tone="accent" dot>Display · Spline Sans</MonoLabel>
            <span className="font-mono text-caption text-fg-subtle">font-display · text-highlight</span>
          </div>
          <div className="divide-y divide-border-subtle rounded-lg border border-border bg-surface">
            {DISPLAY.map((r) => (
              <div key={r.token} className="grid grid-cols-1 gap-3 px-5 py-5 md:grid-cols-[160px_1fr] md:items-baseline">
                <div className="flex flex-col gap-1">
                  <code className="font-mono text-mono-xs text-accent-text">.{r.token}</code>
                  <span className="font-mono text-caption text-fg-subtle">{r.spec}</span>
                </div>
                <p className={cn('font-display text-highlight transition-colors duration-base', r.cls)}>{r.sample}</p>
              </div>
            ))}
          </div>
        </div>

        {/* body specimens */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <MonoLabel tone="subtle">Body &amp; mono · Anonymous Pro</MonoLabel>
            <span className="font-mono text-caption text-fg-subtle">font-body</span>
          </div>
          <div className="divide-y divide-border-subtle rounded-lg border border-border bg-surface">
            {BODY.map((r) => (
              <div key={r.token} className="grid grid-cols-1 gap-3 px-5 py-5 md:grid-cols-[160px_1fr] md:items-baseline">
                <div className="flex flex-col gap-1">
                  <code className="font-mono text-mono-xs text-accent-text">.{r.token}</code>
                  <span className="font-mono text-caption text-fg-subtle">{r.spec}</span>
                </div>
                <p className={cn('font-body text-fg', r.cls)}>{r.sample}</p>
              </div>
            ))}
          </div>
        </div>

        {/* full body copy specimen */}
        <div className="rounded-lg border border-border bg-surface p-6 md:p-8">
          <MonoLabel tone="subtle">Body copy · a full paragraph at body-md</MonoLabel>
          <div className="mt-4 max-w-2xl space-y-4">
            {BODY_COPY.split('\n\n').map((para, i) => (
              <p key={i} className="font-body text-body-md leading-relaxed text-fg-muted">{para}</p>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <MonoLabel tone="subtle">Pairing rules</MonoLabel>
          <ul className="mt-4 grid gap-2 font-body text-body-sm text-fg-muted sm:grid-cols-2">
            <li>• Headings &amp; figures → Spline Sans, tight tracking.</li>
            <li>• Body, captions, labels → Anonymous Pro.</li>
            <li>• Overlines → uppercase mono with a tone dot.</li>
            <li>• Numerics → tabular-nums for stats &amp; tables.</li>
          </ul>
        </div>
      </div>
    </Section>
  )
}
