/**
 * Export — turn a filled session into something that leaves the browser.
 *
 * Two shapes. Markdown carries the db-finance-os frontmatter contract so the record can
 * be committed straight into a client folder; JSON is the lossless copy for re-import.
 *
 * The export states what the client said and what was flagged. It never states an
 * outcome, a saving, a turnaround or a recommendation dressed as a fact — the same rule
 * that governs every other Finance OS surface.
 */
import type { Answers, Part, Question, RaisedFlag, Row, Session } from './types'
import { isAnswered, isVisible, raisedFlags } from './flags'

/* ── Formatting ────────────────────────────────────────────────────────────── */

function formatValue(q: Question, v: Answers[string]): string {
  if (!isAnswered(v)) return '—'

  if (q.kind === 'table' && Array.isArray(v) && typeof v[0] === 'object') {
    const rows = v as Row[]
    const cols = q.columns ?? []
    const head = `| ${cols.map((c) => c.label).join(' | ')} |`
    const rule = `|${cols.map(() => '---').join('|')}|`
    const body = rows.map((r) => `| ${cols.map((c) => r[c.key] || '—').join(' | ')} |`).join('\n')
    return `\n\n${head}\n${rule}\n${body}\n`
  }

  if (Array.isArray(v)) {
    const labels = (v as string[]).map((x) => q.choices?.find((c) => c.value === x)?.label ?? x)
    return labels.join(', ')
  }

  if (typeof v === 'number') {
    return q.kind === 'scale' ? `${v} of 5` : String(v)
  }

  const label = q.choices?.find((c) => c.value === v)?.label
  if (label) return label

  const s = String(v)
  if (q.kind === 'currency') return `$${s}`
  if (q.kind === 'percent') return `${s}%`
  if (q.unit) return `${s} ${q.unit}`
  return s
}

const LEVEL_LABEL: Record<RaisedFlag['level'], string> = {
  risk: 'Risk',
  watch: 'Watch',
  opportunity: 'Opportunity',
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function slug(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'client'
  )
}

/* ── Markdown ──────────────────────────────────────────────────────────────── */

export function toMarkdown(session: Session, parts: Part[]): string {
  const { answers } = session
  const flags = raisedFlags(parts, answers)
  const client = session.client || 'Unnamed brokerage'
  const out: string[] = []

  /* Frontmatter — the db-finance-os contract. `confidence: reported` because every
     answer is the client's own account, not something we have verified. */
  out.push('---')
  out.push(`id: audit-${slug(client)}-${today()}`)
  out.push(`title: Audit — ${client}`)
  out.push('type: audit')
  out.push('status: draft')
  out.push('confidence: reported')
  out.push(`source: Client audit interview conducted by ${session.auditor || 'Finance OS'}${session.contact ? ` with ${session.contact}` : ''}`)
  out.push(`as_of: ${today()}`)
  out.push(`owner: ${session.auditor || 'Tumai'}`)
  out.push('tags: [audit, client, discovery, diagnosis]')
  out.push('claim_risk: gated')
  out.push('audience: internal-only')
  out.push('provenance: client_reported')
  out.push('---')
  out.push('')
  out.push(`# Audit — ${client}`)
  out.push('')
  out.push('## What this is')
  out.push('')
  out.push(
    'A record of what the client said on the audit call. Every figure below is **reported by ' +
      'the client and not independently verified**. Nothing here is a finding about Finance OS, ' +
      'and nothing here may be used as a claim, a testimonial or an outcome.',
  )
  out.push('')

  /* Header facts */
  out.push('| | |')
  out.push('|---|---|')
  out.push(`| Brokerage | ${client} |`)
  if (session.contact) out.push(`| Spoke with | ${session.contact} |`)
  if (session.auditor) out.push(`| Conducted by | ${session.auditor} |`)
  out.push(`| Date | ${today()} |`)
  out.push('')

  /* Flags first — the reason the call happened */
  if (flags.length > 0) {
    out.push('## What was flagged')
    out.push('')
    for (const level of ['risk', 'watch', 'opportunity'] as const) {
      const group = flags.filter((f) => f.level === level)
      if (group.length === 0) continue
      out.push(`### ${LEVEL_LABEL[level]}`)
      out.push('')
      for (const f of group) {
        const where = f.context ? ` _(${f.context})_` : ''
        out.push(`- **${f.title}**${where} — ${f.note}${f.action ? ` **Next:** ${f.action}` : ''}`)
      }
      out.push('')
    }
  }

  /* The record */
  for (const part of parts) {
    const partAnswered = part.modules
      .flatMap((m) => m.blocks)
      .flatMap((b) => b.questions)
      .some((q) => isVisible(q, answers) && isAnswered(answers[q.id]))
    if (!partAnswered) continue

    out.push(`## ${part.title}`)
    out.push('')

    for (const mod of part.modules) {
      const modQuestions = mod.blocks
        .flatMap((b) => b.questions)
        .filter((q) => isVisible(q, answers) && isAnswered(answers[q.id]))
      const modNotes = mod.blocks.map((b) => session.notes[b.id]).filter(Boolean)
      if (modQuestions.length === 0 && modNotes.length === 0) continue

      out.push(`### ${mod.number} · ${mod.title}`)
      out.push('')

      for (const block of mod.blocks) {
        const qs = block.questions.filter((q) => isVisible(q, answers) && isAnswered(answers[q.id]))
        const note = session.notes[block.id]
        if (qs.length === 0 && !note) continue

        for (const q of qs) {
          out.push(`**${q.prompt}**`)
          out.push('')
          out.push(formatValue(q, answers[q.id]))
          out.push('')
        }

        if (note) {
          out.push(`> **Notes — ${block.title}.** ${note.replace(/\n+/g, ' ')}`)
          out.push('')
        }
      }
    }
  }

  /* Provenance */
  out.push('## What is excluded')
  out.push('')
  out.push('- Anything the client did not say. Unanswered questions are absent, not assumed.')
  out.push('- Any outcome, saving or turnaround. None was measured and none may be inferred.')
  out.push('- Anything found by logging into the client\'s software. That is a separate, hands-on pass.')
  out.push('')

  return out.join('\n')
}

/* ── JSON ──────────────────────────────────────────────────────────────────── */

export function toJSON(session: Session, parts: Part[]): string {
  return JSON.stringify(
    {
      schema: 'finance-os-audit/1',
      exportedAt: new Date().toISOString(),
      session: {
        client: session.client,
        contact: session.contact,
        auditor: session.auditor,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
      answers: session.answers,
      notes: session.notes,
      flags: raisedFlags(parts, session.answers),
    },
    null,
    2,
  )
}

/* ── Delivery ──────────────────────────────────────────────────────────────── */

export function download(filename: string, contents: string, mime: string): void {
  const blob = new Blob([contents], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportFilename(session: Session, ext: string): string {
  return `audit-${slug(session.client || 'client')}-${today()}.${ext}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
