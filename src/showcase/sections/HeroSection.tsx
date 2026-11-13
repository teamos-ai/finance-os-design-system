import { FadeIn, FloatWobble, Stagger, StaggerItem } from '@/lib/motion'
import { LogoMark } from '@/components/brand/Logo'
import { CommandBar } from '@/components/ui/command-bar'
import { CommandChip } from '@/components/ui/command-chip'
import { COMMANDS } from '@/data/system'

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[94vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
    >
      <FadeIn>
        <FloatWobble className="w-fit">
          <LogoMark size="lg" className="mx-auto" />
        </FloatWobble>
      </FadeIn>

      <FadeIn delay={0.1}>
        <h1 className="mt-8 max-w-4xl font-display text-display-3xl text-fg">
          Your shortcut to our <span className="text-highlight">design system</span>
        </h1>
      </FadeIn>

      <FadeIn delay={0.15}>
        <p className="mx-auto mt-5 max-w-xl font-body text-body-lg leading-relaxed text-fg-muted">
          Use the tokens in this system to build the coolest shit ever...
        </p>
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
    </section>
  )
}
