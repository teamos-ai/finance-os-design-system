/* ------------------------------------------------------------------ *
 * middleware.js — the access gate (Vercel Routing Middleware, Node runtime)
 * Runs on EVERY request (deny-by-default). It serves the login page and the
 * login/logout endpoints + the brand marks publicly; everything else — the
 * showcase, its assets, the /audit tool — requires a valid signed session.
 *
 * The gate is DORMANT until PORTAL_SESSION_SECRET is set in the environment,
 * so deploying this file does not lock the site before you configure it.
 * Configure (Vercel → the DS project → Settings → Environment Variables):
 *   PORTAL_SESSION_SECRET  — a long random string (e.g. `openssl rand -hex 32`)
 *   PORTAL_PASSWORD        — the shared access password
 * ------------------------------------------------------------------ */
import { next } from '@vercel/functions'
import { verifySession, readCookie, SESSION_COOKIE } from './_session.mjs'

export const config = { runtime: 'nodejs' }

// Paths reachable without a session (the login flow + its brand marks).
const PUBLIC = new Set([
  '/login.html',
  '/api/login',
  '/api/logout',
  '/favicon.ico',
  '/logo-square-blue.png',
  '/logo-rect-blue.png',
  '/logo-rect-white.png',
  '/robots.txt',
])

export default function middleware(request) {
  const secret = process.env.PORTAL_SESSION_SECRET || ''
  if (!secret) return next() // gate not configured → behave as before (public)

  const { pathname } = new URL(request.url)
  if (PUBLIC.has(pathname)) return next()

  const token = readCookie(request.headers.get('cookie'), SESSION_COOKIE)
  if (verifySession(token, secret)) {
    return next({ headers: { 'cache-control': 'private, no-store' } })
  }

  // Not signed in.
  if (pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    })
  }
  const login = new URL('/login.html', request.url)
  return new Response(null, {
    status: 302,
    headers: { location: login.toString(), 'cache-control': 'no-store' },
  })
}
