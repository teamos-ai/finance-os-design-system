/**
 * Email signature — one model, rendered two ways: the live React block (SignaturePreview.tsx)
 * and the paste-ready, email-safe HTML this file builds. Both read the same SignatureData +
 * variant, so the reference on the showcase cannot drift from what a broker actually pastes into
 * Gmail or Outlook.
 *
 * Email gives the system no CSS variables, no flex, no grid and no web fonts, so the HTML gives
 * those up: table layout, literal hex re-used from the warm-up MAIL palette (re-derived from
 * tokens.css, never hand-tuned), Arial as the web-safe fallback for Spline Sans / Anonymous Pro,
 * and an absolute logo URL — a mail client cannot resolve a relative path. Everything else holds:
 * the ink ramp, one Atlas Blue accent on the links, the mono trust line, the 8px radius ceiling
 * and no pills.
 *
 * Regulated identifiers stay merge fields. The ACR number, the aggregator and the ACL are the
 * broker's to fill from their own licensee — exactly as the warm-up footer leaves
 * {{unsubscribe_link}} to LC Email. The template asserts nothing about a broker's credit
 * authorisation and invents no number.
 */
import { MAIL, SENDER } from '@/data/warmup'

export type SignatureVariant = 'mark' | 'lockup' | 'minimal'

export interface SignatureData {
  name: string
  role: string
  email: string
  phone: string
}

/** The fixed brand side of the signature. The person-specific side is SignatureData. */
export const BRAND = {
  name: 'Finance OS',
  legal: SENDER.legal,
  generalEmail: SENDER.email,
  site: 'financeos.au',
  siteUrl: 'https://www.financeos.au',
  /** The real marks. The live preview uses the app-served asset; email uses the deployed URL. */
  markSrc: '/logo-square-blue.png',
  lockupSrc: '/logo-rect-blue.png',
  markUrl: 'https://ds.financeos.au/logo-square-blue.png',
  lockupUrl: 'https://ds.financeos.au/logo-rect-blue.png',
} as const

/** The one compliance line a broker signature carries, as merge fields the broker fills. */
export const COMPLIANCE =
  'Authorised Credit Representative {{acr_number}} of {{aggregator}} · Australian Credit Licence {{acl_number}}.'

/** A grounded sample: the Finance OS signer from the warm-up sequence. Replaced in the builder. */
export const SAMPLE: SignatureData = {
  name: 'Ariki Meroiti',
  role: 'Director',
  email: SENDER.email,
  phone: '',
}

/* ───────────────────────────── email-safe HTML ───────────────────────────── */

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Web fonts do not survive a paste: Spline Sans / Anonymous Pro fall back to Arial in mail. */
const DISPLAY = `'Spline Sans',Arial,'Helvetica Neue',Helvetica,sans-serif`
const BODY = `Arial,'Helvetica Neue',Helvetica,sans-serif`
const MONO = `'Anonymous Pro',Consolas,'Courier New',monospace`

const NAME_ST = `margin:0;font-family:${DISPLAY};font-size:16px;line-height:1.3;font-weight:600;color:${MAIL.fg};`
const ROLE_ST = `margin:3px 0 0 0;font-family:${BODY};font-size:13px;line-height:1.5;color:${MAIL.body};`
const LINE_ST = `margin:0;font-family:${BODY};font-size:13px;line-height:1.7;color:${MAIL.body};`
const LINK_ST = `color:${MAIL.accent};text-decoration:none;`
const COMPLY_ST = `margin:0;font-family:${MONO};font-size:11px;line-height:1.5;letter-spacing:0.02em;color:${MAIL.meta};`

const divider = () =>
  `        <div style="border-top:1px solid ${MAIL.line};font-size:1px;line-height:1px;margin:12px 0;">&nbsp;</div>`

const telHref = (phone: string) => phone.replace(/[^+\d]/g, '')

function contactHtml(d: SignatureData): string {
  const email = `<a href="mailto:${escapeHtml(d.email)}" style="${LINK_ST}">${escapeHtml(d.email)}</a>`
  const phone = d.phone.trim()
    ? `<a href="tel:${escapeHtml(telHref(d.phone))}" style="${LINK_ST}">${escapeHtml(d.phone.trim())}</a>`
    : ''
  const site = `<a href="${BRAND.siteUrl}" style="${LINK_ST}">${BRAND.site}</a>`
  const first = [email, phone].filter(Boolean).join(' &nbsp;·&nbsp; ')
  return `        <p style="${LINE_ST}">${first}</p>
        <p style="${LINE_ST}">${site}</p>`
}

function headerHtml(d: SignatureData, variant: SignatureVariant): string {
  // Only the square mark needs the brand spelled beside the role — the lockup and the minimal
  // wordmark already carry "Finance OS".
  const roleLine = variant === 'mark' ? `${d.role} · ${BRAND.name}` : d.role
  const nameRole = `              <p style="${NAME_ST}">${escapeHtml(d.name)}</p>
              <p style="${ROLE_ST}">${escapeHtml(roleLine)}</p>`

  if (variant === 'mark') {
    return `        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>
          <td valign="middle" style="padding-right:14px;">
            <img src="${BRAND.markUrl}" width="48" height="48" alt="${BRAND.name}" style="display:block;border:0;border-radius:8px;" />
          </td>
          <td valign="middle">
${nameRole}
          </td>
        </tr></table>`
  }

  if (variant === 'lockup') {
    return `        <img src="${BRAND.lockupUrl}" height="34" alt="${BRAND.name}" style="display:block;border:0;height:34px;width:auto;margin:0 0 12px 0;" />
${nameRole}`
  }

  // minimal — a text wordmark with the small blue rule, no image. Survives reply chains.
  return `        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:0 0 10px 0;"><tr>
          <td valign="middle" style="width:18px;"><div style="width:18px;height:3px;background-color:${MAIL.accent};border-radius:2px;font-size:1px;line-height:3px;">&nbsp;</div></td>
          <td valign="middle" style="padding-left:8px;font-family:${MONO};font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${MAIL.fg};">${BRAND.name}</td>
        </tr></table>
${nameRole}`
}

/** The paste-ready signature fragment — a single table, inline styles, ready for a mail editor. */
export function signatureFragment(d: SignatureData, variant: SignatureVariant): string {
  return `<!-- Finance OS email signature. Paste into Gmail (Settings - Signature) or Outlook (File - Options - Mail - Signatures). Host the logo and point its src at your copy. -->
<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
  <tr>
    <td style="padding:0;">
${headerHtml(d, variant)}
${divider()}
${contactHtml(d)}
${divider()}
        <p style="${COMPLY_ST}">${escapeHtml(COMPLIANCE)}</p>
    </td>
  </tr>
</table>`
}

/** A plain-text sign-off for clients that strip HTML, and for the second format brokers keep. */
export function signaturePlainText(d: SignatureData): string {
  const lines = [d.name, `${d.role} · ${BRAND.name}`, d.email, BRAND.site]
  if (d.phone.trim()) lines.push(d.phone.trim())
  lines.push('', COMPLIANCE, BRAND.legal)
  return lines.join('\n')
}

/** A standalone, viewable document wrapping the fragment on the mail ground — the download file. */
export function signatureDocument(d: SignatureData, variant: SignatureVariant): string {
  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light only" />
<title>${escapeHtml(d.name)} — ${BRAND.name} email signature</title>
</head>
<body style="margin:0;padding:28px;background-color:${MAIL.ground};">
${signatureFragment(d, variant)}
</body>
</html>`
}
