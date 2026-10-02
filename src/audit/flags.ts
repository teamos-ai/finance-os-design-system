/**
 * Flag evaluation and progress.
 *
 * Flags are the point of the instrument. An answer on its own is a note; an answer that
 * trips a rule is a finding the auditor can act on while still on the call. Rules are
 * declarative (see `FlagRule`) so the question bank stays data, not code.
 *
 * Nothing here asserts anything about Finance OS. A flag describes what the CLIENT said
 * and what to ask next — it never states an outcome, a saving or a promise.
 */
import type {
  Answers,
  AnswerValue,
  Block,
  FlagRule,
  Part,
  Question,
  RaisedFlag,
} from './types'

/* ── Answer predicates ─────────────────────────────────────────────────────── */

export function isAnswered(v: AnswerValue): boolean {
  if (v === undefined || v === null) return false
  if (typeof v === 'string') return v.trim().length > 0
  if (typeof v === 'number') return !Number.isNaN(v)
  if (Array.isArray(v)) return v.length > 0
  return false
}

function asNumber(v: AnswerValue): number | null {
  if (typeof v === 'number') return Number.isNaN(v) ? null : v
  if (typeof v === 'string') {
    const n = Number(v.replace(/[^0-9.-]/g, ''))
    return v.trim() === '' || Number.isNaN(n) ? null : n
  }
  return null
}

function matches(rule: FlagRule, v: AnswerValue): boolean {
  switch (rule.op) {
    case 'empty':
      return !isAnswered(v)
    case 'notEmpty':
      return isAnswered(v)
    case 'eq':
      return typeof v === 'string' && v === rule.value
    case 'neq':
      return isAnswered(v) && typeof v === 'string' && v !== rule.value
    case 'includes':
      return Array.isArray(v) && (v as string[]).includes(String(rule.value))
    case 'lt': {
      const n = asNumber(v)
      return n !== null && typeof rule.value === 'number' && n < rule.value
    }
    case 'gt': {
      const n = asNumber(v)
      return n !== null && typeof rule.value === 'number' && n > rule.value
    }
    default:
      return false
  }
}

/* ── Visibility ────────────────────────────────────────────────────────────── */

/** A question with an unmet `showIf` is neither shown nor counted toward progress. */
export function isVisible(q: Question, answers: Answers): boolean {
  if (!q.showIf) return true
  const v = answers[q.showIf.question]
  if (typeof v === 'string') return q.showIf.equals.includes(v)
  if (Array.isArray(v)) return (v as string[]).some((x) => q.showIf!.equals.includes(x))
  return false
}

export function visibleQuestions(block: Block, answers: Answers): Question[] {
  return block.questions.filter((q) => isVisible(q, answers))
}

/* ── Flags ─────────────────────────────────────────────────────────────────── */

/** Every flag tripped by the current answers, across a set of parts. */
export function raisedFlags(parts: Part[], answers: Answers): RaisedFlag[] {
  const out: RaisedFlag[] = []

  for (const part of parts) {
    for (const mod of part.modules) {
      for (const block of mod.blocks) {
        /* An `empty` rule means "they were asked and there was no answer", which is only
           true once the auditor has actually worked this screen. Firing it on load would
           raise every gap in the instrument before a word was spoken. */
        const touched = block.questions.some(
          (q) => isVisible(q, answers) && isAnswered(answers[q.id]),
        )

        for (const q of block.questions) {
          if (!isVisible(q, answers)) continue
          const v = answers[q.id]

          /* rule-driven flags */
          for (const rule of q.flags ?? []) {
            if (rule.op === 'empty' && !touched) continue
            if (matches(rule, v)) {
              out.push({
                questionId: q.id,
                moduleId: mod.id,
                partId: part.id,
                level: rule.level,
                title: rule.title,
                context: q.prompt,
                note: rule.note,
                action: rule.action,
              })
            }
          }

          /* choice-driven flags — a selected option can carry its own */
          const selected: string[] =
            typeof v === 'string' ? [v] : Array.isArray(v) ? (v as string[]) : []
          for (const value of selected) {
            const choice = q.choices?.find((c) => c.value === value)
            if (choice?.flag) {
              out.push({
                questionId: q.id,
                moduleId: mod.id,
                partId: part.id,
                level: choice.flag,
                title: choice.label,
                context: q.prompt,
                note: choice.flagNote ?? '',
              })
            }
          }
        }
      }
    }
  }

  return out
}

/** Flags tripped by one block only — what the auditor sees while on that screen. */
export function blockFlags(
  block: Block,
  answers: Answers,
  partId: Part['id'],
  moduleId: string,
): RaisedFlag[] {
  const stub: Part = {
    id: partId,
    title: '',
    kicker: '',
    summary: '',
    Icon: (() => null) as unknown as Part['Icon'],
    modules: [
      {
        id: moduleId,
        number: '',
        title: '',
        purpose: '',
        Icon: (() => null) as unknown as Part['Icon'],
        blocks: [block],
      },
    ],
  }
  return raisedFlags([stub], answers)
}

/* ── Progress ──────────────────────────────────────────────────────────────── */

export interface Progress {
  answered: number
  total: number
  /** 0–1 */
  ratio: number
}

export function blockProgress(block: Block, answers: Answers): Progress {
  const qs = visibleQuestions(block, answers)
  const answered = qs.filter((q) => isAnswered(answers[q.id])).length
  return { answered, total: qs.length, ratio: qs.length === 0 ? 1 : answered / qs.length }
}

export function moduleProgress(
  blocks: Block[],
  answers: Answers,
): Progress {
  let answered = 0
  let total = 0
  for (const b of blocks) {
    const p = blockProgress(b, answers)
    answered += p.answered
    total += p.total
  }
  return { answered, total, ratio: total === 0 ? 1 : answered / total }
}

export function partProgress(part: Part, answers: Answers): Progress {
  return moduleProgress(
    part.modules.flatMap((m) => m.blocks),
    answers,
  )
}
