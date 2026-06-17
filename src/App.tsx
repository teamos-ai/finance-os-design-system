import { useTheme, THEME_LABELS } from './lib/theme'
import { cn } from './lib/cn'

// S4 token-preview — verifies the semantic layer drives every theme.
// Uses ONLY tokens (zero rogue hex). Replaced by the showcase site in S6.

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={cn('h-14 rounded-lg border border-border', className)} />
      <span className="text-mono-xs uppercase text-fg-subtle">{name}</span>
    </div>
  )
}

export default function App() {
  const { theme, cycle } = useTheme()
  return (
    <main className="min-h-screen bg-canvas text-fg">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-accent font-display text-title-sm font-bold text-accent-fg shadow-glow">
              OS
            </div>
            <div>
              <p className="text-mono-xs uppercase tracking-widest text-accent-text">Finance OS</p>
              <h1 className="text-display-sm">Token System · S4</h1>
            </div>
          </div>
          <button
            onClick={cycle}
            className="rounded-md border border-border-strong bg-surface px-4 py-2 text-label text-fg transition-colors duration-base hover:border-accent"
          >
            Theme: {THEME_LABELS[theme]}
          </button>
        </header>

        <section className="mt-12">
          <h2 className="text-title-md">Surfaces &amp; accent</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <Swatch name="canvas" className="bg-canvas" />
            <Swatch name="surface" className="bg-surface" />
            <Swatch name="elevated" className="bg-elevated" />
            <Swatch name="accent" className="bg-accent" />
            <Swatch name="gradient" className="bg-gradient-accent" />
          </div>
        </section>

        <section className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-6 shadow-md">
            <h2 className="text-title-md">Foreground</h2>
            <p className="mt-3 text-body-md text-fg">Primary — Anonymous Pro body.</p>
            <p className="text-body-md text-fg-muted">Muted — secondary text.</p>
            <p className="text-body-sm text-fg-subtle">Subtle — tertiary / captions.</p>
            <p className="mt-2 text-body-md text-accent-text">Accent text — passes AA.</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-6 shadow-md">
            <h2 className="text-title-md">Type scale</h2>
            <p className="mt-2 text-display-sm">Display</p>
            <p className="text-title-md">Title — Spline Sans</p>
            <p className="text-body-md">Body — the calm operator voice.</p>
            <p className="mt-1 text-mono-xs uppercase text-fg-subtle">MONO · ANONYMOUS PRO</p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-title-md">Accent &amp; states</h2>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button className="rounded-md bg-accent px-5 py-2.5 text-label text-accent-fg transition-colors duration-base hover:bg-accent-hover">
              Primary
            </button>
            <button className="rounded-md border border-border-strong bg-surface px-5 py-2.5 text-label text-fg transition-colors duration-base hover:border-accent">
              Secondary
            </button>
            <button className="rounded-md bg-accent-soft px-5 py-2.5 text-label text-accent-text">Soft</button>
            <span className="rounded-pill bg-success-soft px-3 py-1 text-caption text-success">Success</span>
            <span className="rounded-pill bg-warning-soft px-3 py-1 text-caption text-warning">Warning</span>
            <span className="rounded-pill bg-danger-soft px-3 py-1 text-caption text-danger">Danger</span>
            <span className="rounded-pill bg-info-soft px-3 py-1 text-caption text-info">Info</span>
          </div>
        </section>
      </div>
    </main>
  )
}
