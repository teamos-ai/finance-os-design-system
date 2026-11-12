/* ------------------------------------------------------------------ *
 * api/login.mjs — validate the shared access password (Vercel Node function)
 * On success, set our own signed, expiring, HttpOnly session cookie.
 * Env: PORTAL_SESSION_SECRET, PORTAL_PASSWORD, PORTAL_SESSION_HOURS (default 12).
 * The password is compared in constant time; it lives only in the Vercel env.
 * ------------------------------------------------------------------ */
import crypto from 'node:crypto'
import { signSession, SESSION_COOKIE } from '../_session.mjs'

const SECRET = process.env.PORTAL_SESSION_SECRET || ''
const PASSWORD = process.env.PORTAL_PASSWORD || ''
const HOURS = Number(process.env.PORTAL_SESSION_HOURS || 12) || 12

/* crude per-instance rate limit: 10 attempts / 10 min / IP */
const hits = new Map()
function limited(ip) {
  const now = Date.now()
  const rec = hits.get(ip) || { n: 0, t: now }
  if (now - rec.t > 10 * 60 * 1000) {
    rec.n = 0
    rec.t = now
  }
  rec.n += 1
  hits.set(ip, rec)
  return rec.n > 10
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default async function handler(req, res) {
  res.setHeader('cache-control', 'no-store')
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }
  if (!SECRET || !PASSWORD) {
    res.status(503).json({ error: 'not_configured' })
    return
  }
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown'
  if (limited(ip)) {
    res.status(429).json({ error: 'too_many_attempts' })
    return
  }
  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }
  const password = String((body || {}).password || '')
  const a = Buffer.from(password)
  const b = Buffer.from(PASSWORD)
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b)
  if (!ok) {
    await sleep(500)
    res.status(401).json({ error: 'invalid_credentials' })
    return
  }
  const token = signSession(SECRET, HOURS)
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${HOURS * 3600}; HttpOnly; Secure; SameSite=Lax`,
  )
  res.status(200).json({ ok: true })
}
