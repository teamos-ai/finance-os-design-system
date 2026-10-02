/**
 * Start — the screen the audit opens on, and the frame for the whole conversation.
 *
 * The audit is a comparison, not an open-ended chat: it measures a brokerage against a
 * specific, already-built configuration. So the first thing on screen is that
 * configuration — six pipelines, forty-four stages — and the boundary that says what it
 * deliberately does not touch. The auditor can turn the laptop around at this screen and
 * the client understands what is about to be measured.
 *
 * It is also where the session is named and where a previous audit is reopened.
 */
import * as React from 'react'
import { ArrowRight, ChevronDown, Clock, ShieldAlert, Trash2 } from 'lucide-react'
import type { Session } from '@/audit/types'
import { AUDIT_PARTS } from '@/data/audit'
import {
  BENCHMARK_PIPELINES,
  BENCHMARK_STAGE_COUNT,
  BOUNDARY,
  REGULATORY_TOUCHPOINTS,
  TOUCHPOINT_CAVEAT,
} from '@/data/audit/build-spec'
import { Logo } from '@/components/brand/Logo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MonoLabel } from '@/components/ui/mono-label'
import { FadeIn, Glow } from '@/lib/motion'
import { cn } from '@/lib/cn'

function totalQuestions(): number {
  return AUDIT_PARTS.reduce(
    (n, p) =>
      n + p.modules.reduce((m, mod) => m + mod.blocks.reduce((b, blk) => b + blk.questions.length, 0), 0),
    0,
  )
}

export interface StartProps {
  session: Session
  sessions: Session[]
  onMeta: (patch: Partial<Pick<Session, 'client' | 'contact' | 'auditor'>>) => void
  onBegin: () => void
  onNew: () => void
  onOpen: (id: string) => void
  onDelete: (id: string) => void
}

const field =
  'w-full rounded-md border border-border bg-surface px-4 py-3 font-body text-body-md text-fg ' +
  'placeholder:text-fg-subtle transition-colors duration-fast ease-out ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-border-strong'

export function Start({
  session,
  sessions,
  onMeta,
  onBegin,
  onNew,
  onOpen,
  onDelete,
}: StartProps) {
  const [showSpec, setShowSpec] = React.useState(false)
  const others = sessions.filter((s) => s.id !== session.id && (s.client || Object.keys(s.answers).length > 0))
  const qCount = React.useMemo(totalQuestions, [])

  return (
    <div className="min-h-screen bg-canvas">
      {/* ── Frame ───────────────────────────────────────────────────────────── */}
      <header className="relative isolate overflow-hidden border-b border-border px-6 pb-14 pt-10 md:px-10 md:pb-20 md:pt-14">
        <Glow />
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <Logo size="sm" />
            <MonoLabel className="mt-8" dot>
              Client audit · Discovery and diagnosis
            </MonoLabel>
            <h1 className="mt-4 max-w-2xl font-display text-display-xl leading-[1.05] text-fg">
              What is actually running,
              <br />
              <span className="text-accent-text">and what it is costing them.</span>
            </h1>
            <p className="mt-5 max-w-2xl font-body text-body-lg leading-relaxed text-fg-muted">
              Two conversations. The first maps the business and its numbers. The second measures the
              machine against the build below, system by system. A third pass — the team inside their
              software — happens after, and this instrument produces its checklist.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Badge variant="blue" size="sm">
                {AUDIT_PARTS.length} parts
              </Badge>
              <Badge variant="outline" size="sm">
                {AUDIT_PARTS.reduce((n, p) => n + p.modules.length, 0)} modules
              </Badge>
              <Badge variant="outline" size="sm">
                {qCount} questions
              </Badge>
              <Badge variant="outline" size="sm">
                <Clock className="h-3 w-3" strokeWidth={2} aria-hidden />
                60–90 min per call
              </Badge>
            </div>
          </FadeIn>
        </div>
      </header>

      <div className="mx-auto grid max-w-4xl gap-12 px-6 py-14 md:px-10 md:py-16">
        {/* ── Session ─────────────────────────────────────────────────────────── */}
        <FadeIn>
          <section>
            <MonoLabel tone="subtle">Who this audit is with</MonoLabel>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <label className="flex flex-col gap-1.5">
                <span className="font-body text-caption text-fg-muted">Brokerage</span>
                <input
                  className={field}
                  value={session.client}
                  onChange={(e) => onMeta({ client: e.target.value })}
                  placeholder="e.g. Harper & Vale Finance"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-body text-caption text-fg-muted">Speaking with</span>
                <input
                  className={field}
                  value={session.contact}
                  onChange={(e) => onMeta({ contact: e.target.value })}
                  placeholder="Name and role"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-body text-caption text-fg-muted">Conducted by</span>
                <input
                  className={field}
                  value={session.auditor}
                  onChange={(e) => onMeta({ auditor: e.target.value })}
                  placeholder="You"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={onBegin}>
                Begin the audit
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </Button>
              <Button variant="ghost" size="lg" onClick={onNew}>
                Start a fresh one
              </Button>
              <span className="font-mono text-caption text-fg-subtle">
                Saves as you go, in this browser.
              </span>
            </div>
          </section>
        </FadeIn>

        {/* ── Previous ────────────────────────────────────────────────────────── */}
        {others.length > 0 && (
          <FadeIn>
            <section>
              <MonoLabel tone="subtle">Earlier audits</MonoLabel>
              <ul className="mt-4 flex flex-col gap-2">
                {others.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3"
                  >
                    <button
                      type="button"
                      onClick={() => onOpen(s.id)}
                      className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="block truncate font-display text-body-md text-fg">
                        {s.client || 'Unnamed brokerage'}
                      </span>
                      <span className="mt-0.5 block font-mono text-caption text-fg-subtle">
                        {Object.keys(s.answers).length} answered · {s.updatedAt.slice(0, 10)}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete the audit for ${s.client || 'this brokerage'}`}
                      onClick={() => onDelete(s.id)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-fg-subtle transition-colors duration-fast hover:bg-danger-soft hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </FadeIn>
        )}

        {/* ── The parts ───────────────────────────────────────────────────────── */}
        <FadeIn>
          <section>
            <MonoLabel tone="subtle">How it runs</MonoLabel>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {AUDIT_PARTS.map((p) => {
                const n = p.modules.reduce(
                  (m, mod) => m + mod.blocks.reduce((b, blk) => b + blk.questions.length, 0),
                  0,
                )
                return (
                  <div key={p.id} className="rounded-lg border border-border bg-surface p-5">
                    <p.Icon className="h-5 w-5 text-accent-text" strokeWidth={1.5} aria-hidden />
                    <p className="mt-3 font-mono text-mono-2xs uppercase tracking-[0.14em] text-fg-subtle">
                      {p.kicker}
                    </p>
                    <h3 className="mt-1 font-display text-title-md text-fg">{p.title}</h3>
                    <p className="mt-2 font-body text-body-sm leading-relaxed text-fg-muted">
                      {p.summary}
                    </p>
                    <p className="mt-3 font-mono text-caption text-fg-subtle">
                      {p.modules.length} modules · {n} questions
                    </p>
                  </div>
                )
              })}
            </div>
          </section>
        </FadeIn>

        {/* ── The benchmark ───────────────────────────────────────────────────── */}
        <FadeIn>
          <section>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <MonoLabel tone="subtle">What we measure against</MonoLabel>
              <span className="font-mono text-caption text-fg-subtle">
                {BENCHMARK_PIPELINES.length} pipelines · {BENCHMARK_STAGE_COUNT} stages
              </span>
            </div>
            <p className="mt-3 font-body text-body-md leading-relaxed text-fg-muted">
              The broker configuration as it is built. Diagnosis walks their business against these
              six, one at a time, and the gaps become the scope.
            </p>

            <button
              type="button"
              onClick={() => setShowSpec((s) => !s)}
              aria-expanded={showSpec}
              className="mt-4 inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 font-body text-body-sm text-fg-muted transition-colors duration-fast hover:border-border-strong hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {showSpec ? 'Hide the stages' : 'Show every stage'}
              <ChevronDown
                className={cn('h-3.5 w-3.5 transition-transform duration-base ease-out', showSpec && 'rotate-180')}
                strokeWidth={1.75}
                aria-hidden
              />
            </button>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {BENCHMARK_PIPELINES.map((p) => (
                <div key={p.number} className="rounded-lg border border-border bg-surface p-5">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono text-mono-xs tabular-nums text-accent-text">{p.number}</span>
                    <h3 className="font-display text-title-sm text-fg">{p.name}</h3>
                  </div>
                  <p className="mt-2 font-body text-body-sm leading-relaxed text-fg-muted">{p.purpose}</p>
                  {showSpec ? (
                    <ol className="mt-3 flex flex-col gap-1">
                      {p.stages.map((s, i) => (
                        <li key={s} className="flex items-baseline gap-2 font-mono text-caption text-fg-subtle">
                          <span className="tabular-nums opacity-60">{String(i + 1).padStart(2, '0')}</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="mt-3 font-mono text-caption text-fg-subtle">{p.stages.length} stages</p>
                  )}
                </div>
              ))}
            </div>

            {/* the caveat that must never be dropped */}
            <div className="mt-4 rounded-md border border-border-strong bg-inset p-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-fg-muted" strokeWidth={1.75} aria-hidden />
                <div>
                  <p className="font-body text-body-sm leading-relaxed text-fg">{TOUCHPOINT_CAVEAT}</p>
                  <ul className="mt-2 flex flex-col gap-1">
                    {REGULATORY_TOUCHPOINTS.map((t) => (
                      <li key={t.stage} className="font-mono text-caption leading-relaxed text-fg-subtle">
                        <span className="text-fg-muted">{t.stage}</span> — {t.what}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ── The boundary ────────────────────────────────────────────────────── */}
        <FadeIn>
          <section>
            <MonoLabel tone="subtle">And what it deliberately does not touch</MonoLabel>
            <p className="mt-3 font-body text-body-md leading-relaxed text-fg-muted">
              Say this early. A broker who knows their aggregator is safe stops evaluating a
              replacement and starts evaluating an addition.
            </p>
            <dl className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
              {BOUNDARY.map((b) => (
                <div key={b.subject} className="grid gap-1 px-5 py-4 sm:grid-cols-[13rem_1fr] sm:gap-5">
                  <dt className="font-display text-body-md text-fg">{b.subject}</dt>
                  <dd className="font-body text-body-sm leading-relaxed text-fg-muted">{b.position}</dd>
                </div>
              ))}
            </dl>
          </section>
        </FadeIn>

        <FadeIn>
          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-8">
            <Button size="lg" onClick={onBegin}>
              Begin the audit
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </Button>
            <span className="font-mono text-caption text-fg-subtle">
              ⌘K jumps anywhere · ⌘. opens notes · 1–9 picks an answer
            </span>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
