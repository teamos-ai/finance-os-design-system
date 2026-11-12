/* ------------------------------------------------------------------ *
 * _session.mjs — shared session-cookie helpers (Node runtime)
 * Used by middleware.js (the gate) and the api/ functions.
 * The cookie is a signed, expiring token: `<payload>.<hmac>`.
 * Signing secret lives ONLY in PORTAL_SESSION_SECRET (server env).
 * Rotating that secret invalidates every existing session.
 * ------------------------------------------------------------------ */
import crypto from 'node:crypto'

export const SESSION_COOKIE = 'fos_gate'

const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url')
const hmac = (data, secret) => crypto.createHmac('sha256', secret).update(data).digest('base64url')

/** Create a signed token valid for `hours`. */
export function signSession(secret, hours = 12) {
  const payload = b64({ exp: Date.now() + hours * 3600 * 1000, v: 1 })
  return `${payload}.${hmac(payload, secret)}`
}

/** True only for an untampered, unexpired token. */
export function verifySession(token, secret) {
  if (!token || !secret) return false
  const i = token.lastIndexOf('.')
  if (i <= 0) return false
  const payload = token.slice(0, i)
  const sig = token.slice(i + 1)
  const expected = hmac(payload, secret)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    return typeof exp === 'number' && exp > Date.now()
  } catch {
    return false
  }
}

/** Read one cookie value from a Cookie header. */
export function readCookie(header, name) {
  if (!header) return null
  for (const part of String(header).split(/;\s*/)) {
    const eq = part.indexOf('=')
    if (eq > 0 && part.slice(0, eq) === name) {
      try {
        return decodeURIComponent(part.slice(eq + 1))
      } catch {
        return part.slice(eq + 1)
      }
    }
  }
  return null
}
