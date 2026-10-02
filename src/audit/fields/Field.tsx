/**
 * Field renderers — every input the audit asks for, built from tokens.
 *
 * The design system ships Input but no textarea, radio, checkbox, select or slider, so
 * those are composed here from the same tokens rather than borrowed from anywhere else.
 * Choices are large hit targets with a number key hint: on a live call the auditor should
 * be able to answer without looking at the mouse.
 *
 * Numeric fields hold the TYPED STRING and only parse on read. Parsing on each keystroke
 * normalises "7.05" to "75" the moment the user types the dot, which is invisible in
 * testing and wrong in front of a client.
 */
import * as React from 'react'
import { Check, Plus, X } from 'lucide-react'
import type { AnswerValue, Question, Row, TableColumn } from '@/audit/types'
import { cn } from '@/lib/cn'

export interface FieldProps {
  question: Question
  value: AnswerValue
  onChange: (v: AnswerValue) => void
  /** focus this field when the screen opens */
  autoFocus?: boolean
}

/* ── Shared shells ─────────────────────────────────────────────────────────── */

const inputClass =
  'w-full rounded-md border border-border bg-surface px-4 py-3 font-body text-body-md text-fg ' +
  'placeholder:text-fg-subtle transition-colors duration-fast ease-out ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-border-strong'

/** The keyboard hint chip on a choice tile. */
const KeyHint = ({ index, on }: { index: number; on: boolean }) =>
  index < 9 ? (
    <span
      aria-hidden
      className={cn(
        'grid h-5 w-5 shrink-0 place-items-center rounded-sm font-mono text-mono-2xs transition-colors duration-fast',
        on ? 'bg-accent text-accent-fg' : 'bg-inset text-fg-subtle',
      )}
    >
      {index + 1}
    </span>
  ) : null

/* ── Choice (single / multi) ───────────────────────────────────────────────── */

function ChoiceField({ question, value, onChange, multi }: FieldProps & { multi: boolean }) {
  const selected = React.useMemo<string[]>(
    () => (multi ? ((value as string[]) ?? []) : value ? [value as string] : []),
    [value, multi],
  )

  const toggle = React.useCallback(
    (v: string) => {
      if (!multi) {
        onChange(value === v ? undefined : v)
        return
      }
      const now = (value as string[]) ?? []
      onChange(now.includes(v) ? now.filter((x) => x !== v) : [...now, v])
    },
    [multi, onChange, value],
  )

  /* Number keys pick a choice — but never while the auditor is typing in the notes. */
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const n = Number(e.key)
      if (!Number.isInteger(n) || n < 1 || n > 9) return
      const choice = question.choices?.[n - 1]
      if (!choice) return
      e.preventDefault()
      toggle(choice.value)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [question.choices, toggle])

  const long = (question.choices?.length ?? 0) > 6

  return (
    <div
      role={multi ? 'group' : 'radiogroup'}
      aria-label={question.prompt}
      className={cn('grid gap-2', long ? 'sm:grid-cols-2' : 'sm:grid-cols-1')}
    >
      {question.choices?.map((c, i) => {
        const on = selected.includes(c.value)
        return (
          <button
            key={c.value}
            type="button"
            role={multi ? 'checkbox' : 'radio'}
            aria-checked={on}
            onClick={() => toggle(c.value)}
            className={cn(
              'group flex items-start gap-3 rounded-md border px-4 py-3 text-left transition-all duration-fast ease-out',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
              on
                ? 'border-accent bg-accent-soft'
                : 'border-border bg-surface hover:border-border-strong hover:bg-inset',
            )}
          >
            <KeyHint index={i} on={on} />
            <span className="min-w-0 flex-1">
              <span className={cn('block font-body text-body-md leading-snug', on ? 'text-accent-text' : 'text-fg')}>
                {c.label}
              </span>
              {c.hint && <span className="mt-0.5 block font-body text-caption text-fg-subtle">{c.hint}</span>}
            </span>
            <span
              aria-hidden
              className={cn(
                'mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-xs border transition-colors duration-fast',
                on ? 'border-accent bg-accent text-accent-fg' : 'border-border-strong text-transparent',
              )}
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ── Yes / No / Not sure ───────────────────────────────────────────────────── */

const YESNO = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'unsure', label: 'Not sure' },
] as const

function YesNoField({ question, value, onChange }: FieldProps) {
  return (
    <div role="radiogroup" aria-label={question.prompt} className="flex flex-wrap gap-2">
      {YESNO.map((o) => {
        const on = value === o.value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(on ? undefined : o.value)}
            className={cn(
              'min-w-[7rem] rounded-md border px-5 py-3 font-display text-body-md transition-all duration-fast ease-out',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
              on
                ? 'border-accent bg-accent text-accent-fg'
                : 'border-border bg-surface text-fg-muted hover:border-border-strong hover:bg-inset',
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/* ── Scale (auditor's own 1–5 read) ────────────────────────────────────────── */

function ScaleField({ question, value, onChange }: FieldProps) {
  const [lo, hi] = question.scaleLabels ?? ['Low', 'High']
  const current = typeof value === 'number' ? value : undefined
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const on = current !== undefined && n <= current
          const exact = current === n
          return (
            <button
              key={n}
              type="button"
              aria-label={`${n} of 5`}
              aria-pressed={exact}
              onClick={() => onChange(exact ? undefined : n)}
              className={cn(
                'h-12 flex-1 rounded-md border font-mono text-body-sm tabular-nums transition-all duration-fast ease-out',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
                on
                  ? 'border-accent bg-accent text-accent-fg'
                  : 'border-border bg-surface text-fg-subtle hover:border-border-strong hover:bg-inset',
              )}
            >
              {n}
            </button>
          )
        })}
      </div>
      <div className="flex justify-between font-mono text-caption text-fg-subtle">
        <span>{lo}</span>
        <span>{hi}</span>
      </div>
    </div>
  )
}

/* ── Text ──────────────────────────────────────────────────────────────────── */

function ShortField({ question, value, onChange, autoFocus }: FieldProps) {
  return (
    <input
      type="text"
      autoFocus={autoFocus}
      className={inputClass}
      placeholder={question.placeholder ?? 'Type their answer…'}
      value={(value as string) ?? ''}
      onChange={(e) => onChange(e.target.value || undefined)}
    />
  )
}

function LongField({ question, value, onChange, autoFocus }: FieldProps) {
  const ref = React.useRef<HTMLTextAreaElement>(null)

  /* Grow with the content — a fixed box invites short answers, and the long fields
     are exactly where the useful, unstructured intel lands. */
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.max(el.scrollHeight, 112)}px`
  }, [value])

  return (
    <textarea
      ref={ref}
      autoFocus={autoFocus}
      rows={4}
      className={cn(inputClass, 'resize-none leading-relaxed')}
      placeholder={question.placeholder ?? 'Capture it in their words…'}
      value={(value as string) ?? ''}
      onChange={(e) => onChange(e.target.value || undefined)}
    />
  )
}

/* ── Numeric ───────────────────────────────────────────────────────────────── */

function NumericField({ question, value, onChange, autoFocus }: FieldProps) {
  const affix = question.kind === 'currency' ? '$' : question.kind === 'percent' ? '%' : null
  const trailing = question.kind === 'percent'

  return (
    <div className="flex items-center gap-3">
      <div className="relative max-w-xs flex-1">
        {affix && !trailing && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-body-md text-fg-subtle"
          >
            {affix}
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          autoFocus={autoFocus}
          className={cn(
            inputClass,
            'font-mono tabular-nums',
            affix && !trailing && 'pl-8',
            trailing && 'pr-9',
          )}
          placeholder={question.placeholder ?? '0'}
          /* the raw string is the source of truth — see the file header */
          value={(value as string) ?? ''}
          onChange={(e) => {
            const raw = e.target.value
            if (raw !== '' && !/^-?[\d,]*\.?\d*$/.test(raw)) return
            onChange(raw || undefined)
          }}
        />
        {affix && trailing && (
          <span
            aria-hidden
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-body-md text-fg-subtle"
          >
            {affix}
          </span>
        )}
      </div>
      {question.unit && <span className="font-mono text-body-sm text-fg-subtle">{question.unit}</span>}
    </div>
  )
}

/* ── Table ─────────────────────────────────────────────────────────────────── */

const WIDTH: Record<NonNullable<TableColumn['width']>, string> = {
  sm: 'w-24',
  md: 'w-40',
  lg: 'flex-1 min-w-0',
}

function TableField({ question, value, onChange }: FieldProps) {
  const cols = question.columns ?? []
  /* Uncommitted seed rows show as a normal table; the first edit commits them together
     with the change, so nothing is saved until the auditor actually types. */
  const rows = (value as Row[]) ?? question.seedRows ?? []

  const update = (i: number, key: string, cell: string) => {
    const next = rows.map((r, ri) => (ri === i ? { ...r, [key]: cell } : r))
    onChange(next)
  }
  const add = () => onChange([...rows, Object.fromEntries(cols.map((c) => [c.key, '']))])
  const remove = (i: number) => {
    const next = rows.filter((_, ri) => ri !== i)
    onChange(next.length > 0 ? next : undefined)
  }

  return (
    <div className="flex flex-col gap-2">
      {rows.length > 0 && (
        <div className="hidden gap-2 px-1 sm:flex">
          {cols.map((c) => (
            <span
              key={c.key}
              className={cn(
                'font-mono text-caption uppercase tracking-[0.1em] text-fg-subtle',
                WIDTH[c.width ?? 'lg'],
              )}
            >
              {c.label}
            </span>
          ))}
          <span className="w-9 shrink-0" />
        </div>
      )}

      {rows.map((row, i) => (
        <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {cols.map((c) => (
            <div key={c.key} className={cn('min-w-0', WIDTH[c.width ?? 'lg'])}>
              <label className="mb-1 block font-mono text-caption text-fg-subtle sm:hidden">{c.label}</label>
              <input
                type="text"
                inputMode={c.kind === 'short' ? 'text' : 'decimal'}
                className={cn(inputClass, 'py-2.5', c.kind !== 'short' && 'font-mono tabular-nums')}
                value={row[c.key] ?? ''}
                onChange={(e) => update(i, c.key, e.target.value)}
              />
            </div>
          ))}
          <button
            type="button"
            aria-label={`Remove row ${i + 1}`}
            onClick={() => remove(i)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border text-fg-subtle transition-colors duration-fast hover:border-danger hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="inline-flex w-fit items-center gap-2 rounded-md border border-dashed border-border-strong px-4 py-2.5 font-body text-body-sm text-fg-muted transition-colors duration-fast hover:border-accent hover:text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        {rows.length === 0 ? 'Add the first row' : 'Add another'}
      </button>
    </div>
  )
}

/* ── Dispatcher ────────────────────────────────────────────────────────────── */

export function Field(props: FieldProps) {
  switch (props.question.kind) {
    case 'single':
      return <ChoiceField {...props} multi={false} />
    case 'multi':
      return <ChoiceField {...props} multi />
    case 'yesno':
      return <YesNoField {...props} />
    case 'scale':
      return <ScaleField {...props} />
    case 'long':
      return <LongField {...props} />
    case 'table':
      return <TableField {...props} />
    case 'number':
    case 'currency':
    case 'percent':
      return <NumericField {...props} />
    case 'short':
    default:
      return <ShortField {...props} />
  }
}
