/**
 * Audit — the route. Owns the audit store and the one piece of state that decides which
 * surface shows: the opening frame, or the instrument.
 *
 * The store is created HERE and passed down. Calling `useAudit()` in both this component
 * and the instrument would create two stores over the same localStorage key, and they
 * would diverge the moment either wrote.
 */
import * as React from 'react'
import { AuditApp } from './AuditApp'
import { Start } from './parts/Start'
import { readView, useAudit, writeView } from './state'

export function Audit() {
  const store = useAudit()
  const [started, setStarted] = React.useState(() => readView()?.started ?? false)

  const begin = React.useCallback(() => {
    setStarted(true)
    const v = readView()
    writeView({ started: true, partId: v?.partId ?? '', blockId: v?.blockId ?? '' })
  }, [])

  const leave = React.useCallback(() => {
    setStarted(false)
    const v = readView()
    writeView({ started: false, partId: v?.partId ?? '', blockId: v?.blockId ?? '' })
  }, [])

  React.useEffect(() => {
    document.title = 'Client audit — Finance OS'
  }, [])

  if (!store.session) return null

  if (!started) {
    return (
      <Start
        session={store.session}
        sessions={store.sessions}
        onMeta={store.setMeta}
        onBegin={begin}
        onNew={store.newSession}
        onOpen={store.openSession}
        onDelete={store.deleteSession}
      />
    )
  }

  return <AuditApp store={store} onExit={leave} />
}
