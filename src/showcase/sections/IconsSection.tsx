/**
 * IconsSection — Icons & Logo.
 * A curated Lucide line set drawn at strokeWidth 1.5 with token colours, the three
 * size steps (16 / 20 / 24), the IconButton variant set, and the Finance OS logo
 * lockups with clear-space rules and a do / avoid pair. Reference reads like the system.
 */
import type { ReactNode } from 'react'
import {
  LayoutDashboard, Wallet, TrendingUp, PieChart, Receipt, Landmark,
  FileText, Briefcase, Users, ShieldCheck, BadgeDollarSign, Banknote,
  Calculator, Bell, Mail, Search, Calendar, Settings,
  Download, Filter, ArrowUpRight, CircleCheck, Lock, Sparkles,
  Plus, ChevronRight, Play, MoreHorizontal,
} from 'lucide-react'
import { Section, Demo } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { IconButton } from '@/components/ui/icon-button'
import { Badge } from '@/components/ui/badge'
import { Logo, LogoMark } from '@/components/brand/Logo'
import { FadeIn, Stagger, StaggerItem } from '@/lib/motion'

type IconEntry = { icon: typeof Wallet; name: string }

const ICONS: IconEntry[] = [
  { icon: LayoutDashboard, name: 'layout-dashboard' },
  { icon: Wallet, name: 'wallet' },
  { icon: TrendingUp, name: 'trending-up' },
  { icon: PieChart, name: 'pie-chart' },
  { icon: Receipt, name: 'receipt' },
  { icon: Landmark, name: 'landmark' },
  { icon: FileText, name: 'file-text' },
  { icon: Briefcase, name: 'briefcase' },
  { icon: Users, name: 'users' },
  { icon: ShieldCheck, name: 'shield-check' },
  { icon: BadgeDollarSign, name: 'badge-dollar-sign' },
  { icon: Banknote, name: 'banknote' },
  { icon: Calculator, name: 'calculator' },
  { icon: Bell, name: 'bell' },
  { icon: Mail, name: 'mail' },
  { icon: Search, name: 'search' },
  { icon: Calendar, name: 'calendar' },
  { icon: Settings, name: 'settings' },
  { icon: Download, name: 'download' },
  { icon: Filter, name: 'filter' },
  { icon: ArrowUpRight, name: 'arrow-up-right' },
  { icon: CircleCheck, name: 'circle-check' },
  { icon: Lock, name: 'lock' },
  { icon: Sparkles, name: 'sparkles' },
]

const SIZES: { px: number; cls: string; label: string }[] = [
  { px: 16, cls: 'h-4 w-4', label: 'sm' },
  { px: 20, cls: 'h-5 w-5', label: 'md' },
  { px: 24, cls: 'h-6 w-6', label: 'lg' },
]

const ICON_BUTTONS = [
  { variant: 'dark', label: 'Play track', icon: Play },
  { variant: 'outline', label: 'Next', icon: ChevronRight },
  { variant: 'soft', label: 'Add item', icon: Plus },
  { variant: 'ghost', label: 'More options', icon: MoreHorizontal },
  { variant: 'accent', label: 'Confirm', icon: CircleCheck },
] as const

export function IconsSection() {
  return (
    <Section
      id="icons"
      eyebrow="10 - Icons & Logo"
      title="Icons & Logo"
      lead="A calm Lucide line set drawn at a constant 1.5px stroke, plus the Finance OS lockups and the clear-space rules that keep the brand composed across every theme."
    >
      {/* ─── Icon library ─────────────────────────────────────────── */}
      <FadeIn>
        <div className="mb-4 flex items-center justify-between gap-3">
          <MonoLabel tone="accent" number="01">
            Library
          </MonoLabel>
          <span className="font-mono text-caption text-fg-subtle">lucide-react · strokeWidth 1.5</span>
        </div>
      </FadeIn>

      <Stagger className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4 md:grid-cols-6">
        {ICONS.map(({ icon: Icon, name }) => (
          <StaggerItem
            key={name}
            className="flex aspect-square flex-col items-center justify-center gap-2.5 bg-surface px-2 text-center transition-colors duration-fast ease-out hover:bg-elevated"
          >
            <Icon className="h-6 w-6 text-fg" strokeWidth={1.5} aria-hidden />
            <span className="truncate font-mono text-[0.625rem] tracking-wide text-fg-subtle">{name}</span>
          </StaggerItem>
        ))}
      </Stagger>

      <p className="mt-4 font-body text-body-sm leading-relaxed text-fg-muted">
        Icons inherit <code className="font-mono text-mono-xs text-accent-text">currentColor</code>, so they pick up
        the surrounding token — <code className="font-mono text-mono-xs text-fg">text-fg</code> for default,{' '}
        <code className="font-mono text-mono-xs text-accent-text">text-accent-text</code> for emphasis. Decorative icons
        carry <code className="font-mono text-mono-xs text-fg">aria-hidden</code>; meaningful ones get a label.
      </p>

      {/* ─── Sizes ────────────────────────────────────────────────── */}
      <div className="mt-12">
        <FadeIn>
          <MonoLabel tone="accent" number="02" className="mb-4">
            Sizes
          </MonoLabel>
        </FadeIn>
        <Demo label="16 / 20 / 24 px — one stroke weight at every step">
          <div className="flex flex-wrap items-end gap-10">
            {SIZES.map(({ px, cls, label }) => (
              <div key={px} className="flex flex-col items-center gap-3">
                <div className="grid h-16 w-16 place-items-center rounded-md border border-border bg-surface">
                  <Wallet className={cls + ' text-accent-text'} strokeWidth={1.5} aria-hidden />
                </div>
                <div className="text-center">
                  <p className="font-display text-title-sm text-fg">{px}px</p>
                  <p className="font-mono text-caption text-fg-subtle">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </Demo>
      </div>

      {/* ─── Icon buttons ─────────────────────────────────────────── */}
      <div className="mt-12">
        <FadeIn>
          <MonoLabel tone="accent" number="03" className="mb-4">
            Icon buttons
          </MonoLabel>
        </FadeIn>
        <Demo label="IconButton — dark · outline · soft · ghost · accent">
          <div className="flex flex-wrap items-center gap-8">
            {ICON_BUTTONS.map(({ variant, label, icon: Icon }) => (
              <div key={variant} className="flex flex-col items-center gap-2.5">
                <IconButton variant={variant} aria-label={label}>
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </IconButton>
                <span className="font-mono text-caption text-fg-subtle">{variant}</span>
              </div>
            ))}
          </div>
        </Demo>
        <p className="mt-4 font-body text-body-sm leading-relaxed text-fg-muted">
          Icon-only controls are square with a fixed target and a required{' '}
          <code className="font-mono text-mono-xs text-accent-text">aria-label</code>. The icon child sits at the{' '}
          <code className="font-mono text-mono-xs text-fg">md</code> step (20px) inside the default{' '}
          <code className="font-mono text-mono-xs text-fg">h-11 w-11</code> box.
        </p>
      </div>

      {/* ─── Logo lockups ─────────────────────────────────────────── */}
      <div className="mt-14">
        <FadeIn>
          <div className="mb-5 flex items-center justify-between gap-3">
            <MonoLabel tone="accent" number="04">
              Logo lockups
            </MonoLabel>
            <Badge variant="gold" dot>
              Brand
            </Badge>
          </div>
        </FadeIn>

        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
          {/* Mark */}
          <LockupTile label="Mark · LogoMark">
            <LogoMark size="lg" />
          </LockupTile>
          {/* Full */}
          <LockupTile label="Full · Logo">
            <Logo size="md" />
          </LockupTile>
          {/* Wordmark */}
          <LockupTile label="Wordmark · Logo variant='wordmark'">
            <Logo variant="wordmark" size="md" />
          </LockupTile>
        </div>

        {/* On-surface companion row */}
        <div className="mt-px grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
          <LockupTile label="On surface" surface>
            <LogoMark size="lg" />
          </LockupTile>
          <LockupTile label="On surface" surface>
            <Logo size="md" />
          </LockupTile>
          <LockupTile label="On surface" surface>
            <Logo variant="wordmark" size="md" />
          </LockupTile>
        </div>

        {/* Clear space */}
        <div className="mt-6">
          <Demo label="Clear space — keep one mark-height of clearance on every side">
            <div className="flex flex-wrap items-center gap-8">
              <div className="relative grid place-items-center rounded-md border border-dashed border-border-strong p-10">
                <span aria-hidden className="absolute left-3 top-3 font-mono text-[0.625rem] text-fg-subtle">
                  1×
                </span>
                <Logo size="md" />
              </div>
              <p className="max-w-sm font-body text-body-sm leading-relaxed text-fg-muted">
                Reserve a minimum clear space equal to the height of the{' '}
                <code className="font-mono text-mono-xs text-accent-text">OS</code> mark around the full lockup. Never
                let type, rules or imagery cross that boundary.
              </p>
            </div>
          </Demo>
        </div>

        {/* Do / Avoid */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="overflow-hidden rounded-lg border border-success/40 bg-success-soft/40">
            <div className="flex items-center gap-2 border-b border-success/30 px-4 py-2.5">
              <CircleCheck className="h-4 w-4 text-success" strokeWidth={1.5} aria-hidden />
              <MonoLabel tone="success">Do</MonoLabel>
            </div>
            <div className="grid place-items-center p-8">
              <Logo size="md" />
            </div>
            <p className="border-t border-border px-4 py-3 font-body text-body-sm leading-relaxed text-fg-muted">
              Use the locked gradient mark beside the wordmark, with the supplied spacing intact.
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-danger/40 bg-danger-soft/30">
            <div className="flex items-center gap-2 border-b border-danger/30 px-4 py-2.5">
              <Lock className="h-4 w-4 text-danger" strokeWidth={1.5} aria-hidden />
              <MonoLabel tone="subtle" className="text-danger">
                Avoid
              </MonoLabel>
            </div>
            <div className="grid place-items-center p-8">
              <span className="inline-flex items-center gap-2.5 opacity-90">
                <LogoMark size="lg" className="rotate-6 scale-90 shadow-none saturate-50" />
                <span className="font-body font-semibold tracking-tight text-fg-subtle">FinanceOS</span>
              </span>
            </div>
            <p className="border-t border-border px-4 py-3 font-body text-body-sm leading-relaxed text-fg-muted">
              Don't rotate or recolour the mark, drop the glow, or set the wordmark in a non-display face.
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}

/** A single logo lockup tile — canvas by default, surface when `surface`. */
function LockupTile({
  label,
  surface = false,
  children,
}: {
  label: string
  surface?: boolean
  children: ReactNode
}) {
  return (
    <div className={surface ? 'bg-surface' : 'bg-canvas'}>
      <div className="grid min-h-[7.5rem] place-items-center px-6 py-10">{children}</div>
      <div className="border-t border-border px-4 py-2.5">
        <span className="font-mono text-caption text-fg-subtle">{label}</span>
      </div>
    </div>
  )
}
