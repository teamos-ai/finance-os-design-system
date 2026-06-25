import { FadeIn, Stagger, StaggerItem, Glow } from '@/lib/motion'
import { LogoMark } from '@/components/brand/Logo'
import { CommandBar } from '@/components/ui/command-bar'
import { CommandChip } from '@/components/ui/command-chip'
import { BRAND, COMMANDS } from '@/data/system'

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[94vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
    >
      <Glow />

      <FadeIn>
        <LogoMark size="lg" className="mx-auto" />
      </FadeIn>

      <FadeIn delay={0.1}>
        <h1 className="mt-8 max-w-3xl font-display text-display-2xl text-fg">
          The operating system for <span className="text-highlight">serious brokers</span>.
        </h1>
      </FadeIn>

      <FadeIn delay={0.15}>
        <p className="mx-auto mt-5 max-w-xl font-body text-body-lg leading-relaxed text-fg-muted">{BRAND.promise}</p>
      </FadeIn>

      {/* AI command widget — search + relevant /commands (design system, plans, docs) */}
      <FadeIn delay={0.2} className="mt-10 w-full max-w-xl">
        <CommandBar aria-label="Search the design system" placeholder="Search anything — type / for commands" />
      </FadeIn>

      <Stagger className="mt-4 flex flex-wrap items-center justify-center gap-2.5" amount={0.4}>
        {COMMANDS.map((c) => (
          <StaggerItem key={c}>
            <CommandChip command={c} />
          </StaggerItem>
        ))}
      </Stagger>

      {/* Smooth fade from the hero canvas into the next section's muted ground — no hard line. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-canvas-muted"
      />
    </section>
  )
}
