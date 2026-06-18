/**
 * QuickStartSection — "use it in five minutes".
 *
 * Four numbered steps with copy-paste code blocks (clone → import tokens →
 * wrap in ThemeProvider → drop in a Button), the token-layer file tree behind a
 * Disclosure, and two short notes (the cn()/tailwind-merge font-size fix and how
 * to add a new theme). Self-contained: a small CodeBlock helper lives in-file.
 */
import * as React from 'react'
import { Check, Copy, FolderTree, Layers, Palette } from 'lucide-react'
import { Section } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { Disclosure } from '@/components/ui/disclosure'
import { IconButton } from '@/components/ui/icon-button'
import { FadeIn, Stagger, StaggerItem } from '@/lib/motion'
import { copyText } from '@/lib/utils'
import { cn } from '@/lib/cn'

/* -------------------------------------------------------------------------- */
/* CodeBlock — a framed <pre> with a copy IconButton.                          */
/* -------------------------------------------------------------------------- */

interface CodeBlockProps {
  /** The literal code shown and copied. */
  code: string
  /** Mono caption shown top-left, e.g. a file path or shell. */
  caption?: string
  className?: string
}

const CodeBlock = ({ code, caption, className }: CodeBlockProps) => {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const onCopy = async () => {
    const ok = await copyText(code)
    if (!ok) return
    setCopied(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className={cn('overflow-hidden rounded-md border border-border bg-inset', className)}>
      <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-2">
        <span className="font-mono text-mono-xs uppercase tracking-[0.12em] text-fg-subtle">
          {caption ?? 'shell'}
        </span>
        <IconButton
          variant="ghost"
          size="sm"
          aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
          onClick={onCopy}
        >
          {copied ? (
            <Check className="h-4 w-4 text-success" strokeWidth={1.5} aria-hidden />
          ) : (
            <Copy className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          )}
        </IconButton>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-body-sm leading-relaxed text-fg">
        <code>{code}</code>
      </pre>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Steps                                                                       */
/* -------------------------------------------------------------------------- */

interface Step {
  n: string
  title: string
  note: string
  caption: string
  code: string
}

const STEPS: Step[] = [
  {
    n: '01',
    title: 'Clone the system',
    note: 'Pull the repo and install. React, Vite, Tailwind and Framer Motion are the only runtime peers.',
    caption: 'terminal',
    code: `git clone git@github.com:teamos-ai/finance-os-design-system.git
cd finance-os-design-system
npm install`,
  },
  {
    n: '02',
    title: 'Import the tokens',
    note: 'One stylesheet ships every CSS variable — surfaces, type scale, motion, radii — across all three themes.',
    caption: 'src/main.tsx',
    code: `import '@/styles/tokens.css'
import '@/styles/global.css'`,
  },
  {
    n: '03',
    title: 'Wrap in the provider',
    note: 'ThemeProvider sets the data-theme attribute and persists the choice. Dark-OLED is the default.',
    caption: 'src/App.tsx',
    code: `import { ThemeProvider } from '@/lib/theme'

export function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Showcase />
    </ThemeProvider>
  )
}`,
  },
  {
    n: '04',
    title: 'Drop in a component',
    note: 'Every component reads from tokens, so it inherits the active theme with no extra wiring.',
    caption: 'anywhere',
    code: `import { Button } from '@/components/ui/button'

<Button variant="primary" size="md">
  Approve transfer
</Button>`,
  },
]

/* -------------------------------------------------------------------------- */
/* Token-layer file tree (text content for the Disclosure)                     */
/* -------------------------------------------------------------------------- */

const FILE_TREE = `src/
├─ styles/
│  ├─ tokens.css        primitives → semantic vars (per theme)
│  └─ global.css        base reset + font faces
├─ lib/
│  ├─ cn.ts             clsx + tailwind-merge (font-size fix)
│  ├─ theme.tsx         ThemeProvider + useTheme
│  ├─ motion.tsx        FadeIn, Stagger, reduced-motion safe
│  └─ accents.ts        amber | amber | blue | green | neutral
├─ components/ui/       Button, Card, Badge, Input, …
└─ data/system.ts       BRAND, FEATURES, STATS, PRICING`

/* -------------------------------------------------------------------------- */

export function QuickStartSection() {
  return (
    <Section
      id="quickstart"
      eyebrow="03 - Quick Start"
      title="Use it in five minutes"
      lead="Clone the repo, import the token layer, wrap your app in the provider, then drop in a component. It inherits the active theme with no extra wiring."
    >
      {/* Numbered steps */}
      <Stagger className="grid gap-5 md:grid-cols-2">
        {STEPS.map((step) => (
          <StaggerItem key={step.n}>
            <article className="flex h-full flex-col gap-4 rounded-lg border border-border bg-surface p-6">
              <div className="flex items-start gap-4">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-soft font-mono text-body-sm font-bold tabular-nums text-accent-text"
                  aria-hidden
                >
                  {step.n}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-title-md text-fg">{step.title}</h3>
                  <p className="mt-1 font-body text-body-sm leading-relaxed text-fg-muted">{step.note}</p>
                </div>
              </div>
              <CodeBlock code={step.code} caption={step.caption} className="mt-auto" />
            </article>
          </StaggerItem>
        ))}
      </Stagger>

      {/* Token-layer file tree */}
      <FadeIn>
        <div className="mt-12">
          <div className="mb-4 flex items-center gap-2">
            <FolderTree className="h-4 w-4 text-fg-subtle" strokeWidth={1.5} aria-hidden />
            <MonoLabel tone="subtle" number="·">
              Token layer
            </MonoLabel>
          </div>
          <Disclosure title="How the token layer is organised" defaultOpen>
            <p className="mb-4">
              Primitives resolve into semantic variables in <code className="font-mono text-body-sm text-accent-text">tokens.css</code>,
              every component reads only the semantic layer, and the three themes simply swap the
              variable values. Override a token, not a component.
            </p>
            <pre className="overflow-x-auto rounded-md border border-border bg-inset p-4 font-mono text-body-sm leading-relaxed text-fg-muted">
              <code>{FILE_TREE}</code>
            </pre>
          </Disclosure>
        </div>
      </FadeIn>

      {/* Short notes */}
      <FadeIn>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <article className="rounded-lg border border-border bg-surface p-6">
            <div className="mb-3 flex items-center gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-amber-soft text-amber-text"
                aria-hidden
              >
                <Layers className="h-4 w-4" strokeWidth={1.5} />
              </span>
              <h3 className="font-display text-title-sm text-fg">The cn() font-size fix</h3>
            </div>
            <p className="font-body text-body-sm leading-relaxed text-fg-muted">
              Custom <code className="font-mono text-body-sm text-accent-text">text-*</code> tokens
              (<code className="font-mono text-body-sm text-accent-text">text-body-md</code> and
              friends) must be registered in tailwind-merge&rsquo;s font-size group. Without it,
              tailwind-merge reads them as colour classes and silently drops real colours like
              <code className="font-mono text-body-sm text-accent-text"> text-fg</code>. The patched
              <code className="font-mono text-body-sm text-accent-text"> cn()</code> in
              <code className="font-mono text-body-sm text-accent-text"> lib/cn.ts</code> registers
              them — always import from there.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-surface p-6">
            <div className="mb-3 flex items-center gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent-text"
                aria-hidden
              >
                <Palette className="h-4 w-4" strokeWidth={1.5} />
              </span>
              <h3 className="font-display text-title-sm text-fg">Adding a new theme</h3>
            </div>
            <p className="font-body text-body-sm leading-relaxed text-fg-muted">
              Add a <code className="font-mono text-body-sm text-accent-text">[data-theme=&quot;…&quot;]</code> block
              in <code className="font-mono text-body-sm text-accent-text">tokens.css</code> and
              redefine the semantic variables — surfaces, text, borders, accent. Register the name in
              <code className="font-mono text-body-sm text-accent-text"> lib/theme.tsx</code>. No
              component changes: they all read the semantic layer, so the new theme flows through
              everywhere at once.
            </p>
          </article>
        </div>
      </FadeIn>
    </Section>
  )
}
