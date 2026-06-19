/**
 * Flip templates — lead magnets that turn pages (Flipbook primitive): Ebook + Magazine.
 * Each page is a PaperPage sheet; the book hinges with the page-flip motion.
 */
import { BookOpen, Newspaper, Sparkles, TrendingUp, ArrowRight, Quote } from 'lucide-react'
import { Flipbook } from '@/components/lead-magnets/primitives'
import { LeadMagnetFrame, PaperPage, TemplateKicker } from '@/components/lead-magnets/Frame'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/* ── Ebook / Flipbook ──────────────────────────────────────────────────────── */
export function EbookTemplate() {
  const pages = [
    <PaperPage key="cover" className="justify-between bg-gradient-accent text-accent-fg">
      <div className="flex items-center gap-2 font-mono text-mono-xs uppercase tracking-[0.14em]">
        <Sparkles className="h-3.5 w-3.5" strokeWidth={2} /> Finance OS
      </div>
      <div>
        <p className="font-mono text-mono-xs uppercase tracking-[0.14em] opacity-80">The ebook</p>
        <h3 className="mt-2 font-display text-display-sm leading-tight">The Broker's Growth Playbook</h3>
        <p className="mt-3 font-body text-body-sm opacity-90">Nine systems for a pipeline that runs without you.</p>
      </div>
      <p className="font-mono text-caption opacity-80">2026 edition · 24 pages</p>
    </PaperPage>,
    <PaperPage key="toc">
      <TemplateKicker>What's inside</TemplateKicker>
      <ol className="mt-4 flex flex-col gap-3">
        {['Capture every enquiry', 'Follow up in 60 seconds', 'Nurture the slow yes', 'Reactivate past clients', 'Forecast with confidence'].map((t, i) => (
          <li key={t} className="flex items-baseline gap-3 border-b border-border-subtle pb-3 font-body text-body-sm text-fg">
            <span className="font-mono text-caption text-accent-text">{String(i + 1).padStart(2, '0')}</span>
            {t}
          </li>
        ))}
      </ol>
    </PaperPage>,
    <PaperPage key="chapter">
      <TemplateKicker>Chapter 02</TemplateKicker>
      <h4 className="mt-2 font-display text-title-lg text-fg">Follow up in 60 seconds</h4>
      <p className="mt-3 font-body text-body-sm leading-relaxed text-fg-muted">
        Speed-to-lead is the single biggest lever in your funnel. The first broker to reply wins the
        conversation roughly 8 times out of 10 — long before rate or product enters the picture.
      </p>
      <div className="mt-auto rounded-md border border-border bg-canvas-muted p-4">
        <div className="flex items-baseline gap-2">
          <TrendingUp className="h-5 w-5 text-accent-text" strokeWidth={1.75} />
          <span className="font-display text-display-sm text-fg">8×</span>
        </div>
        <p className="mt-1 font-mono text-caption text-fg-muted">more likely to convert when you reply first</p>
      </div>
    </PaperPage>,
    <PaperPage key="cta" className="justify-center text-center">
      <Quote className="mx-auto h-7 w-7 text-accent-text" strokeWidth={1.5} />
      <p className="mt-4 font-display text-title-md leading-snug text-fg">"It paid for itself in the first fortnight."</p>
      <p className="mt-2 font-mono text-caption text-fg-subtle">— keep reading in the full edition</p>
    </PaperPage>,
  ]

  return (
    <LeadMagnetFrame
      meta={{ kind: 'Ebook / Flipbook', title: "The Broker's Growth Playbook", format: 'Flipbook · 24 pages', Icon: BookOpen, motion: 'Page-flip' }}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-caption text-fg-subtle">PDF · instant download</span>
          <Button variant="primary" size="sm" leadingIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />}>
            Get the ebook
          </Button>
        </div>
      }
    >
      <Flipbook pages={pages} />
    </LeadMagnetFrame>
  )
}

/* ── Magazine ──────────────────────────────────────────────────────────────── */
export function MagazineTemplate() {
  const pages = [
    <PaperPage key="cover" className="justify-between bg-inverse text-inverse-fg">
      <div className="flex items-center justify-between font-mono text-mono-xs uppercase tracking-[0.14em]">
        <span>Settlement Quarterly</span>
        <span>Q2 ’26</span>
      </div>
      <div>
        <Badge variant="amber" size="sm">
          Cover story
        </Badge>
        <h3 className="mt-3 font-display text-display-sm leading-tight">The 30-minute broker workday</h3>
        <p className="mt-2 font-body text-body-sm opacity-80">How automation gave back the afternoon.</p>
      </div>
      <p className="font-mono text-caption opacity-70">+ rate outlook · 5 tools we love · reader Q&amp;A</p>
    </PaperPage>,
    <PaperPage key="feature">
      <TemplateKicker>Feature</TemplateKicker>
      <h4 className="mt-2 font-display text-title-lg text-fg">The afternoon, returned</h4>
      <div className="mt-3 gap-4 font-body text-body-sm leading-relaxed text-fg-muted sm:columns-2 sm:[column-rule:1px_solid_var(--c-border-subtle)]">
        <p className="mb-3">
          When every enquiry routes itself and every follow-up fires on time, the broker's day stops
          being reactive.
        </p>
        <p>The result isn't fewer deals — it's the same volume, run calmly, in half the hours.</p>
      </div>
    </PaperPage>,
    <PaperPage key="grid">
      <TemplateKicker>Five tools we love</TemplateKicker>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {['Auto-router', 'Smart replies', 'Pipeline forecast', 'Review engine'].map((t) => (
          <div key={t} className="rounded-md border border-border bg-canvas-muted p-3">
            <div className="h-1.5 w-8 rounded-sm bg-accent" />
            <p className="mt-2 font-display text-title-sm text-fg">{t}</p>
          </div>
        ))}
      </div>
    </PaperPage>,
  ]

  return (
    <LeadMagnetFrame
      meta={{ kind: 'Magazine', title: 'Settlement Quarterly', format: 'Flipbook · 4 spreads', Icon: Newspaper, motion: 'Page-flip' }}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-caption text-fg-subtle">Issue 04 · free for subscribers</span>
          <Button variant="secondary" size="sm">
            Read the issue
          </Button>
        </div>
      }
    >
      <Flipbook pages={pages} aspect="aspect-[4/5]" />
    </LeadMagnetFrame>
  )
}
