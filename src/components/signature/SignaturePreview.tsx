/**
 * SignaturePreview — the live Finance OS email-signature block, the on-brand twin of the
 * email-safe HTML in signature.ts. Three layouts off one model: the square MARK beside the name,
 * the full LOCKUP on top, and an image-free MINIMAL wordmark for reply chains and strict filters.
 *
 * Composition only, tokens only: ink ramp for the type, --c-border for the hairline rules, and
 * the single Atlas Blue moment on the contact links (the minimal wordmark adds the small blue
 * rule the warm-up header uses). No amber — a signature carries no status. No ribbon: emphasis is
 * the mark and a full-width rule, never an edge strip.
 */
import { LogoMark, Logo } from '@/components/brand/Logo'
import { BRAND, COMPLIANCE, type SignatureData, type SignatureVariant } from '@/components/signature/signature'
import { cn } from '@/lib/cn'

const LINK = 'text-accent-text no-underline hover:underline focus-visible:underline focus-visible:outline-none'

const Dot = () => (
  <span aria-hidden className="px-1.5 text-fg-subtle">
    ·
  </span>
)

const Rule = () => <div aria-hidden className="my-3 h-px w-full bg-border" />

function Contact({ data }: { data: SignatureData }) {
  const phone = data.phone.trim()
  return (
    <div className="flex flex-col gap-0.5">
      <p className="font-body text-body-sm leading-relaxed text-fg-muted">
        <a href={`mailto:${data.email}`} className={LINK}>
          {data.email}
        </a>
        {phone && (
          <>
            <Dot />
            <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className={cn(LINK, 'tabular-nums')}>
              {phone}
            </a>
          </>
        )}
      </p>
      <p className="font-body text-body-sm leading-relaxed">
        <a href={BRAND.siteUrl} className={LINK}>
          {BRAND.site}
        </a>
      </p>
    </div>
  )
}

export function SignaturePreview({
  data,
  variant,
  className,
}: {
  data: SignatureData
  variant: SignatureVariant
  className?: string
}) {
  const roleLine = variant === 'mark' ? `${data.role} · ${BRAND.name}` : data.role

  return (
    <div className={cn('max-w-[26rem] text-left', className)}>
      {variant === 'mark' && (
        <div className="flex items-center gap-3.5">
          <LogoMark size="lg" />
          <div className="min-w-0">
            <p className="font-display text-title-sm font-semibold text-fg">{data.name}</p>
            <p className="font-body text-body-sm text-fg-muted">{roleLine}</p>
          </div>
        </div>
      )}

      {variant === 'lockup' && (
        <div>
          <Logo variant="rect" size="md" />
          <p className="mt-3 font-display text-title-sm font-semibold text-fg">{data.name}</p>
          <p className="font-body text-body-sm text-fg-muted">{roleLine}</p>
        </div>
      )}

      {variant === 'minimal' && (
        <div>
          <div className="flex items-center gap-2">
            <span aria-hidden className="h-[3px] w-[18px] rounded-xs bg-accent" />
            <span className="font-mono text-mono-xs font-bold uppercase tracking-[0.08em] text-fg">{BRAND.name}</span>
          </div>
          <p className="mt-2.5 font-body text-body-sm">
            <span className="font-display text-title-sm font-semibold text-fg">{data.name}</span>
            <Dot />
            <span className="text-fg-muted">{data.role}</span>
          </p>
        </div>
      )}

      <Rule />
      <Contact data={data} />
      <Rule />
      <p className="font-mono text-mono-2xs leading-normal tracking-[0.02em] text-fg-subtle">{COMPLIANCE}</p>
    </div>
  )
}
