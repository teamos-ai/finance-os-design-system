import { Section } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'

type Row = { token: string; cls: string; spec: string; sample: string; font: 'display' | 'body' }

const DISPLAY: Row[] = [
  { token: 'display-2xl', cls: 'text-display-2xl', spec: '44–72px · 600 · -0.02em', sample: 'Predictable pipeline', font: 'display' },
  { token: 'display-xl', cls: 'text-display-xl', spec: '36–56px · 600 · -0.02em', sample: 'More settlements', font: 'display' },
  { token: 'display-lg', cls: 'text-display-lg', spec: '40px · 600 · -0.015em', sample: 'Less admin', font: 'display' },
  { token: 'display-md', cls: 'text-display-md', spec: '32px · 600 · -0.01em', sample: 'The calm operator', font: 'display' },
  { token: 'display-sm', cls: 'text-display-sm', spec: '24px · 600', sample: 'Built to last', font: 'display' },
  { token: 'title-lg', cls: 'text-title-lg', spec: '20px · 600', sample: 'Unified CRM', font: 'display' },
  { token: 'title-md', cls: 'text-title-md', spec: '18px · 600', sample: 'Automated follow-up', font: 'display' },
  { token: 'title-sm', cls: 'text-title-sm', spec: '16px · 600', sample: 'Smart funnels', font: 'display' },
]

const BODY: Row[] = [
  { token: 'body-lg', cls: 'text-body-lg', spec: '17px · 1.7', sample: 'A broker-specific system that captures every enquiry and follows up instantly.', font: 'body' },
  { token: 'body-md', cls: 'text-body-md', spec: '15px · 1.65', sample: 'It replaces fragmented tools with one dependable operating layer.', font: 'body' },
  { token: 'body-sm', cls: 'text-body-sm', spec: '13px · 1.6', sample: 'Predictable pipeline. More settlements. Less admin.', font: 'body' },
  { token: 'label', cls: 'text-label uppercase', spec: '13px · 700 · 0.02em', sample: 'Get started', font: 'body' },
  { token: 'caption', cls: 'text-caption', spec: '12px · 1.4', sample: 'Replaces 8 tools · $297/mo', font: 'body' },
  { token: 'mono-xs', cls: 'text-mono-xs uppercase', spec: '11px · 700 · 0.04em', sample: 'Signal gold #EEBA2B', font: 'body' },
]

function Specimen({ rows, font }: { rows: Row[]; font: 'display' | 'body' }) {
  return (
    <div className="divide-y divide-border-subtle rounded-lg border border-border bg-surface">
      {rows.map((r) => (
        <div key={r.token} className="grid gap-3 px-5 py-5 md:grid-cols-[160px_1fr] md:items-baseline">
          <div className="flex flex-col gap-1">
            <code className="font-mono text-mono-xs text-accent-text">.{r.token}</code>
            <span className="font-mono text-caption text-fg-subtle">{r.spec}</span>
          </div>
          <p className={`${font === 'display' ? 'font-display' : 'font-body'} ${r.cls} text-fg`}>{r.sample}</p>
        </div>
      ))}
    </div>
  )
}

export function TypographySection() {
  return (
    <Section
      id="typography"
      eyebrow="06 — Typography"
      title="Typography"
      lead="Spline Sans carries every heading and figure; Anonymous Pro carries body, captions and the mono overline — one humanist sans plus one technical mono that signals 'serious software'."
    >
      <div className="space-y-8">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <MonoLabel tone="accent" dot>Display · Spline Sans</MonoLabel>
            <span className="font-mono text-caption text-fg-subtle">font-display</span>
          </div>
          <Specimen rows={DISPLAY} font="display" />
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <MonoLabel tone="brand" dot>Body &amp; mono · Anonymous Pro</MonoLabel>
            <span className="font-mono text-caption text-fg-subtle">font-body</span>
          </div>
          <Specimen rows={BODY} font="body" />
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
