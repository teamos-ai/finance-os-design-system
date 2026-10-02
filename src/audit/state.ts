/**
 * Audit state — answers, notes, sessions and autosave.
 *
 * The instrument is used live on a client call, so nothing may be lost to a refresh,
 * a dropped connection or a closed laptop. Every change is written to localStorage
 * immediately; sessions are keyed per client so several audits can be in flight.
 *
 * Storage is best-effort: a private window or blocked site data must not break the
 * form, so every read and write is guarded and the instrument runs fine from memory.
 */
import * as React from 'react'
import type { Answers, AnswerValue, Session } from './types'

const KEY = 'fos-audit-sessions'
const ACTIVE = 'fos-audit-active'
const VIEW = 'fos-audit-view'

/* ── Storage (guarded) ─────────────────────────────────────────────────────── */

function readAll(): Session[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Session[]) : []
  } catch {
    return []
  }
}

function writeAll(sessions: Session[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(sessions))
  } catch {
    /* storage unavailable — the session still runs from memory */
  }
}

function readActiveId(): string | null {
  try {
    return localStorage.getItem(ACTIVE)
  } catch {
    return null
  }
}

function writeActiveId(id: string): void {
  try {
    localStorage.setItem(ACTIVE, id)
  } catch {
    /* ignore */
  }
}

/* ── View position ─────────────────────────────────────────────────────────────
   Where the auditor was. A refresh or a crash mid-call must not drop them back at the
   opening frame — the answers survive, and so should the place in the conversation. */

export interface View {
  started: boolean
  partId: string
  blockId: string
}

export function readView(): View | null {
  try {
    const raw = localStorage.getItem(VIEW)
    if (!raw) return null
    const v: unknown = JSON.parse(raw)
    if (v && typeof v === 'object' && 'blockId' in v) return v as View
    return null
  } catch {
    return null
  }
}

export function writeView(v: View): void {
  try {
    localStorage.setItem(VIEW, JSON.stringify(v))
  } catch {
    /* ignore */
  }
}

/* ── Session helpers ───────────────────────────────────────────────────────── */

let seq = 0
/** Ids must be unique per session but never need to be unguessable. */
function newId(): string {
  seq += 1
  return `a${Date.now().toString(36)}${seq.toString(36)}`
}

export function blankSession(client = ''): Session {
  const now = new Date().toISOString()
  return {
    id: newId(),
    client,
    contact: '',
    auditor: '',
    createdAt: now,
    updatedAt: now,
    answers: {},
    notes: {},
  }
}

/* ── The hook ──────────────────────────────────────────────────────────────── */

export interface AuditStore {
  session: Session
  sessions: Session[]
  setAnswer: (questionId: string, value: AnswerValue) => void
  setNote: (blockId: string, note: string) => void
  setMeta: (patch: Partial<Pick<Session, 'client' | 'contact' | 'auditor'>>) => void
  newSession: () => void
  openSession: (id: string) => void
  deleteSession: (id: string) => void
  /** wipe the answers on the current session, keeping who it is with */
  resetAnswers: () => void
  answers: Answers
}

export function useAudit(): AuditStore {
  const [sessions, setSessions] = React.useState<Session[]>(() => {
    const all = readAll()
    return all.length > 0 ? all : [blankSession()]
  })

  const [activeId, setActiveId] = React.useState<string>(() => {
    const all = readAll()
    const stored = readActiveId()
    if (stored && all.some((s) => s.id === stored)) return stored
    return all[0]?.id ?? ''
  })

  /* The first render may have created a blank session that is not yet persisted. */
  const session = React.useMemo(
    () => sessions.find((s) => s.id === activeId) ?? sessions[0],
    [sessions, activeId],
  )

  React.useEffect(() => {
    if (session && session.id !== activeId) setActiveId(session.id)
  }, [session, activeId])

  React.useEffect(() => {
    writeAll(sessions)
  }, [sessions])

  React.useEffect(() => {
    if (activeId) writeActiveId(activeId)
  }, [activeId])

  const patchActive = React.useCallback(
    (fn: (s: Session) => Session) => {
      setSessions((all) =>
        all.map((s) => (s.id === activeId ? { ...fn(s), updatedAt: new Date().toISOString() } : s)),
      )
    },
    [activeId],
  )

  const setAnswer = React.useCallback(
    (questionId: string, value: AnswerValue) => {
      patchActive((s) => ({ ...s, answers: { ...s.answers, [questionId]: value } }))
    },
    [patchActive],
  )

  const setNote = React.useCallback(
    (blockId: string, note: string) => {
      patchActive((s) => ({ ...s, notes: { ...s.notes, [blockId]: note } }))
    },
    [patchActive],
  )

  const setMeta = React.useCallback(
    (patch: Partial<Pick<Session, 'client' | 'contact' | 'auditor'>>) => {
      patchActive((s) => ({ ...s, ...patch }))
    },
    [patchActive],
  )

  const newSession = React.useCallback(() => {
    const s = blankSession()
    setSessions((all) => [s, ...all])
    setActiveId(s.id)
  }, [])

  const openSession = React.useCallback((id: string) => setActiveId(id), [])

  const deleteSession = React.useCallback(
    (id: string) => {
      setSessions((all) => {
        const next = all.filter((s) => s.id !== id)
        const safe = next.length > 0 ? next : [blankSession()]
        if (id === activeId) setActiveId(safe[0].id)
        return safe
      })
    },
    [activeId],
  )

  const resetAnswers = React.useCallback(() => {
    patchActive((s) => ({ ...s, answers: {}, notes: {} }))
  }, [patchActive])

  return {
    session,
    sessions,
    answers: session?.answers ?? {},
    setAnswer,
    setNote,
    setMeta,
    newSession,
    openSession,
    deleteSession,
    resetAnswers,
  }
}
