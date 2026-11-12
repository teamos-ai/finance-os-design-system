import {
  MAIL,
  MERGE_GLOSS,
  SENDER,
  type Block,
  type ClientEmail,
  type StatusTone,
} from '@/components/emails/templates'

/**
 * Renders one client template into the two artefacts a broker pastes into Finance OS: a plain-text
 * body and a standalone HTML document. Both come off the same `blocks`, so the versions cannot
 * drift. The approach follows `src/lib/warmup-render.ts` — what email forces the system to give up
 * (CSS variables, web fonts, flex/grid, remote images, the elevation tokens) and what it keeps (the
 * white card on the off-white ground, the ink ramp, the 2/4/6/8 radius ladder capped at 8px with no
 * pills, one Atlas Blue fill per message, the mono eyebrow, a 600px measure).
 *
 * Transactional additions over the warm-up: a status pill (amber is attention/pending only), an
 * inset summary box of merge-field rows, and a footer that names the credit licensee. Anonymous Pro
 * is kept for the eyebrow and trust line only; body copy falls back to a system sans, as mail
 * clients do not carry the webfont and Courier for whole paragraphs reads as broken mail.
 */

const WRAP = 72

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Greedy wrap at `WRAP` columns. Plain-text mail is still read in fixed-width clients. */
function wrap(text: string, width = WRAP): string {
  const out: string[] = []
  let line = ''
  for (const word of text.split(' ')) {
    if (line === '') line = word
    else if (`${line} ${word}`.length <= width) line += ` ${word}`
    else {
      out.push(line)
      line = word
    }
  }
  if (line !== '') out.push(line)
  return out.join('\n')
}

/** Status pill colours — the soft/text token pair for each tone, resolved to the email palette. */
const STATUS_COLOUR: Record<StatusTone, { bg: string; fg: string }> = {
  amber: { bg: MAIL.amberSoft, fg: MAIL.amberText },
  success: { bg: MAIL.successSoft, fg: MAIL.successText },
  blue: { bg: MAIL.blueSoft, fg: MAIL.accent },
  neutral: { bg: MAIL.well, fg: MAIL.meta },
}

/* ------------------------------------------------------------------ plain text */

function plainBlock(b: Block): string {
  switch (b.kind) {
    case 'p':
      return wrap(b.text)
    case 'h':
      return wrap(b.text.toUpperCase())
    case 'summary':
      return [wrap(b.title.toUpperCase()), ...b.rows.map((r) => `${r.label}: ${r.value}`)].join('\n')
    case 'cta':
      return `${wrap(b.trust)}\n${b.label}: ${b.url}`
  }
}

export function toPlainText(e: ClientEmail): string {
  return [
    `[ ${e.status.label} ]`,
    e.blocks.map(plainBlock).join('\n\n'),
    e.signoff.join('\n'),
    '--',
    wrap(e.compliance),
    `${SENDER.legal}\n${SENDER.address}\n${SENDER.email}`,
    `Manage email preferences: {{contact.manage_link}}`,
  ].join('\n\n')
}

/* ------------------------------------------------------------------------ html */

const DISPLAY = `'Spline Sans','Helvetica Neue',Helvetica,Arial,sans-serif`
const BODY = `'Anonymous Pro','Helvetica Neue',Helvetica,Arial,sans-serif`
const MONO = `'Anonymous Pro',Consolas,'Courier New',monospace`

const P_STYLE = `margin:0 0 20px 0;font-family:${BODY};font-size:16px;line-height:1.65;color:${MAIL.body};`
const H_STYLE = `margin:32px 0 8px 0;font-family:${DISPLAY};font-size:18px;line-height:1.35;font-weight:600;color:${MAIL.fg};`

function htmlBlock(b: Block): string {
  switch (b.kind) {
    case 'p':
      return `        <p style="${P_STYLE}">${escapeHtml(b.text)}</p>`
    case 'h':
      return `        <h2 style="${H_STYLE}">${escapeHtml(b.text)}</h2>`
    case 'summary':
      // An inset box at the 6px radius, not a card: it carries the reported figures, not a CTA.
      return `        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%;margin:0 0 24px 0;background-color:${MAIL.well};border-radius:6px;">
          <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0 0 12px 0;font-family:${MONO};font-size:12px;line-height:1.35;letter-spacing:0.08em;text-transform:uppercase;color:${MAIL.meta};">${escapeHtml(b.title)}</p>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%;">
${b.rows
  .map(
    (r) => `                <tr>
                  <td style="padding:4px 0;font-family:${BODY};font-size:15px;line-height:1.5;color:${MAIL.meta};">${escapeHtml(r.label)}</td>
                  <td align="right" style="padding:4px 0;font-family:${BODY};font-size:15px;line-height:1.5;font-weight:700;color:${MAIL.fg};">${escapeHtml(r.value)}</td>
                </tr>`,
  )
  .join('\n')}
              </table>
            </td>
          </tr>
        </table>`
    case 'cta':
      // The message's one accent fill. 8px radius: the system has no pills on UI boxes.
      return `        <p style="margin:28px 0 12px 0;font-family:${MONO};font-size:12px;line-height:1.35;letter-spacing:0.08em;text-transform:uppercase;color:${MAIL.meta};">${escapeHtml(b.trust)}</p>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
          <tr>
            <td align="center" bgcolor="${MAIL.accent}" style="border-radius:8px;">
              <a href="${b.url}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:${BODY};font-size:16px;line-height:16px;font-weight:700;color:${MAIL.accentFg};text-decoration:none;border-radius:8px;">${escapeHtml(b.label)}</a>
            </td>
          </tr>
        </table>`
  }
}

function statusPill(label: string, tone: StatusTone): string {
  const c = STATUS_COLOUR[tone]
  return `        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
          <tr>
            <td style="padding:5px 12px;background-color:${c.bg};border-radius:4px;font-family:${MONO};font-size:11px;line-height:1.3;letter-spacing:0.08em;text-transform:uppercase;font-weight:700;color:${c.fg};">${escapeHtml(label)}</td>
          </tr>
        </table>`
}

export function toHtml(e: ClientEmail): string {
  // Zero-width spacers stop Gmail pulling body copy into the inbox snippet after the preheader.
  const spacer = '&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;'.repeat(6)
  const signoff = e.signoff.map((l) => escapeHtml(l)).join('<br />')
  return `<!DOCTYPE html>
<html lang="en-AU" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light only" />
<title>${escapeHtml(e.subject)}</title>
<!--[if mso]>
<style type="text/css">body,table,td,p,h1,h2,a{font-family:Arial,Helvetica,sans-serif !important;}</style>
<![endif]-->
<style type="text/css">
  body{margin:0 !important;padding:0 !important;width:100% !important;}
  a{color:${MAIL.accent};}
  @media only screen and (max-width:620px){
    .fos-shell{width:100% !important;}
    .fos-pad{padding-left:24px !important;padding-right:24px !important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${MAIL.ground};">
<div style="display:none;font-size:1px;color:${MAIL.ground};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(e.preheader)}${spacer}</div>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%;background-color:${MAIL.ground};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="fos-shell" style="width:600px;max-width:600px;">

        <!-- wordmark: a blue rule and the name. No remote image on a cold domain. -->
        <tr>
          <td class="fos-pad" style="padding:0 40px 20px 40px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td width="18" style="width:18px;">
                  <div style="width:18px;height:3px;background-color:${MAIL.accent};border-radius:2px;font-size:1px;line-height:3px;">&nbsp;</div>
                </td>
                <td style="padding-left:10px;font-family:${MONO};font-size:12px;line-height:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${MAIL.fg};">Finance OS</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- the card: white surface, 8px radius, hairline, no elevation -->
        <tr>
          <td>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%;background-color:${MAIL.surface};border:1px solid ${MAIL.line};border-radius:8px;">
              <tr>
                <td class="fos-pad" style="padding:40px 40px 32px 40px;">
${statusPill(e.status.label, e.status.tone)}
${e.blocks.map(htmlBlock).join('\n')}
                  <p style="${P_STYLE}margin-bottom:0;">${signoff}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- footer: compliance line, sender block, preferences -->
        <tr>
          <td class="fos-pad" style="padding:24px 40px 8px 40px;font-family:${BODY};font-size:13px;line-height:1.6;color:${MAIL.meta};">
            ${escapeHtml(e.compliance)}<br /><br />
            ${escapeHtml(SENDER.legal)}<br />
            ${escapeHtml(SENDER.address)}<br />
            <a href="mailto:${SENDER.email}" style="color:${MAIL.meta};text-decoration:underline;">${escapeHtml(SENDER.email)}</a><br /><br />
            <a href="{{contact.manage_link}}" style="color:${MAIL.meta};text-decoration:underline;">Manage email preferences</a>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

/** Every unique merge field the rendered email uses, in order of first appearance, each glossed. */
export function mergeFieldsIn(e: ClientEmail): { token: string; gloss: string }[] {
  const text = toPlainText(e)
  const re = /\{\{[^}]+\}\}/g
  const seen = new Set<string>()
  const out: { token: string; gloss: string }[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const token = m[0]
    if (seen.has(token)) continue
    seen.add(token)
    out.push({ token, gloss: MERGE_GLOSS[token] ?? 'Merge field' })
  }
  return out
}

/** Every template in one plain-text file, for pasting the whole set somewhere at once. */
export const allPlainText = (emails: ClientEmail[]) =>
  emails
    .map((e) => `SUBJECT: ${e.subject}\nPREHEADER: ${e.preheader}\nMOMENT: ${e.moment}\n\n${toPlainText(e)}`)
    .join('\n\n\n========================================\n\n\n')
