/**
 * The audit instrument's data model.
 *
 * An audit is three PARTS (Discovery, Diagnosis, Handoff). Each part holds MODULES
 * (chapters of the conversation), each module holds BLOCKS (one screen — the unit the
 * auditor clicks through), each block holds QUESTIONS.
 *
 * Content lives in `src/data/audit/*`. Nothing here knows any Finance OS fact: this file
 * is the shape, the data files are the substance. Every question carries the database
 * path it came from so an answer can be traced back to why it was asked.
 */
import type { LucideIcon } from 'lucide-react'

/* ── Answers ───────────────────────────────────────────────────────────────── */

/** One repeating-table row: column key → cell value. */
export type Row = Record<string, string>

/** Every value the instrument can hold. `undefined` means unanswered. */
export type AnswerValue = string | number | string[] | Row[] | undefined

export type Answers = Record<string, AnswerValue>

/** The reserved choice value that means "the auditor typed it in". */
export const OTHER_VALUE = '__other'

/** Where the typed text for `allowOther` lives, alongside the question's own answer. */
export const otherKey = (questionId: string): string => `${questionId}:other`

/* ── Questions ─────────────────────────────────────────────────────────────── */

export type FieldKind =
  /** one line of text */
  | 'short'
  /** free prose — the box the best intel actually lands in */
  | 'long'
  | 'number'
  /** number rendered with a $ affix and thousands separators */
  | 'currency'
  | 'percent'
  /** pick one */
  | 'single'
  /** pick any */
  | 'multi'
  /** yes / no / unsure — three states, because "unsure" is itself a finding */
  | 'yesno'
  /** a 1–5 maturity read, captured by the auditor not the client */
  | 'scale'
  /** repeating rows */
  | 'table'

export type FlagLevel = 'risk' | 'watch' | 'opportunity'

export interface Choice {
  value: string
  label: string
  /** a short clarifier shown under the label */
  hint?: string
  /** raise this flag when the choice is selected */
  flag?: FlagLevel
  /** what the flag means and what to do about it */
  flagNote?: string
}

/** A declarative rule evaluated against one answer. */
export interface FlagRule {
  op: 'eq' | 'neq' | 'lt' | 'gt' | 'includes' | 'empty' | 'notEmpty'
  /** compared against the answer; omitted for `empty` / `notEmpty` */
  value?: string | number
  level: FlagLevel
  title: string
  /** what it means for the build or the sale */
  note: string
  /** the next thing to ask, out loud */
  action?: string
}

export interface TableColumn {
  key: string
  label: string
  kind: 'short' | 'number' | 'currency' | 'percent'
  width?: 'sm' | 'md' | 'lg'
}

export interface Question {
  id: string
  /** asked out loud, in AU English, the way a consultant actually speaks */
  prompt: string
  kind: FieldKind
  /** why this is being asked — shown to the auditor, never to the client */
  why?: string
  placeholder?: string
  hint?: string
  choices?: Choice[]
  /**
   * Add a typed "Something else" option to a `single` or `multi` question.
   *
   * On a live call the client names a tool, a lender, a person or a reason that is not on
   * the list, and the auditor has to catch it without breaking the conversation. Selecting
   * it reveals a text box; the text is stored under `otherKey(question.id)` so the choice
   * value stays clean for flags and the export prints what was actually said.
   */
  allowOther?: boolean
  /** Overrides the default "Something else" label. */
  otherLabel?: string
  columns?: TableColumn[]
  /** Rows the table opens with, for a structure that is already known — a four-step
   *  funnel, the six benchmark pipelines. Saves the auditor typing the scaffolding
   *  while a client is talking. Editing any cell commits the whole seeded set. */
  seedRows?: Row[]
  /** unit suffix for number fields, e.g. "per month" */
  unit?: string
  min?: number
  max?: number
  /** endpoint captions for a scale, e.g. ['Nothing in place', 'Fully systemised'] */
  scaleLabels?: [string, string]
  /** the follow-up to ask once they've answered */
  followUp?: string
  flags?: FlagRule[]
  /** the db-finance-os path that justifies this question */
  source?: string
  /** only show when another question holds one of these values */
  showIf?: { question: string; equals: string[] }
}

export interface Block {
  id: string
  title: string
  /** a line the auditor can say to open this screen */
  intro?: string
  questions: Question[]
}

export interface Module {
  id: string
  /** "01", "02" … — shown in the rail */
  number: string
  title: string
  /** one line on what this chapter is for */
  purpose: string
  Icon: LucideIcon
  blocks: Block[]
}

export type PartId = 'discovery' | 'diagnosis' | 'handoff'

export interface Part {
  id: PartId
  title: string
  /** "Part one" */
  kicker: string
  summary: string
  /** what this part is NOT for — keeps the two calls distinct */
  excludes?: string
  Icon: LucideIcon
  modules: Module[]
}

/* ── Derived ───────────────────────────────────────────────────────────────── */

/** A flag raised by a live answer. */
export interface RaisedFlag {
  questionId: string
  moduleId: string
  partId: PartId
  level: FlagLevel
  /** the short headline — a choice label, or the rule's own title */
  title: string
  /** what was being asked, shown small above the title so the flag reads in place */
  context?: string
  note: string
  action?: string
}

/** One line of the live diagnosis panel. */
export interface Finding {
  level: FlagLevel | 'info'
  title: string
  detail: string
}

/** The session the auditor is filling in. */
export interface Session {
  id: string
  /** the brokerage */
  client: string
  /** who is on the call */
  contact: string
  /** who is running it */
  auditor: string
  createdAt: string
  updatedAt: string
  answers: Answers
  /** free notes, keyed by block id, plus a 'general' bucket */
  notes: Record<string, string>
}
