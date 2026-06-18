import { FadeIn, Stagger, StaggerItem, CountUp, Glow } from '@/lib/motion'
import { Badge } from '@/components/ui/badge'
import { LogoMark } from '@/components/brand/Logo'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { CommandBar } from '@/components/ui/command-bar'
import { CommandChip } from '@/components/ui/command-chip'
import { BRAND, STATS, COMMANDS } from '@/data/system'

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[94vh] flex-col items-center justify-center overflow-hidden border-b border-border px-6 py-24 text-center"
    >
      <Glow />

      <FadeIn>
        <LogoMark size="lg" className="mx-auto" />
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="mt-6 flex justify-center">
          <Badge variant="amber" dot>
            Dark-mode luxury design system
          </Badge>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <h1 className="mt-6 max-w-3xl font-display text-display-2xl text-fg">
          The operating system for <span className="text-amber-text">serious brokers</span>.
        </h1>
      </FadeIn>

      <FadeIn delay={0.15}>
        <p className="mx-auto mt-5 max-w-xl font-body text-body-lg leading-relaxed text-fg-muted">{BRAND.promise}</p>
      </FadeIn>

      {/* AI command widget — search + relevant /commands (design system, plans, docs) */}
      <FadeIn delay={0.2} className="mt-9 w-full max-w-xl">
        <CommandBar aria-label="Search the design system" placeholder="Search anything — type / for commands" />
      </FadeIn>

      <Stagger className="mt-4 flex flex-wrap items-center justify-center gap-2.5" amount={0.4}>
        {COMMANDS.map((c) => (
          <StaggerItem key={c}>
            <CommandChip command={c} />
          </StaggerItem>
        ))}
      </Stagger>

      <FadeIn delay={0.25}>
        <div className="mt-7 flex items-center justify-center gap-3 text-caption text-fg-subtle">
          <span className="font-mono uppercase tracking-wide">Switch theme</span>
          <ThemeToggle />
        </div>
      </FadeIn>

      <Stagger className="mt-14 grid w-full max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
        {STATS.map((s) => (
          <StaggerItem key={s.label} className="bg-surface p-5">
            <p className="font-display text-display-sm text-accent-text">
              <CountUp to={s.value} prefix={s.prefix} suffix={s.suffix} />
            </p>
            <p className="mt-1 font-mono text-caption leading-snug text-fg-subtle">{s.label}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
