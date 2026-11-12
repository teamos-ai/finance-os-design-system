/* ------------------------------------------------------------------ *
 * api/logout.mjs — clear the session cookie (Vercel Node function).
 * ------------------------------------------------------------------ */
import { SESSION_COOKIE } from '../_session.mjs'

export default function handler(req, res) {
  res.setHeader('cache-control', 'no-store')
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
  )
  res.status(200).json({ ok: true })
}
