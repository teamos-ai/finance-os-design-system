import { MAIL, MERGE, SENDER, type Block, type WarmupEmail } from '@/data/warmup'

/**
 * Renders one warm-up email into the two artefacts that get pasted into LC Email: a plain-text
 * body and a standalone HTML document. Both come off the same `blocks`, so the versions cannot
 * drift apart.
 *
 * What email forces the system to give up, and what it keeps.
 *
 * Give up: CSS variables, web fonts, flex and grid (Outlook has neither), `<head>` styles that
 * survive a forward, remote images, and the glow, gradient and elevation tokens, which either do
 * not render or read as bulk to a spam filter. Keep: the white card on the off-white rhythm
 * ground, the ink ramp, the 2/4/6/8 radius ladder capped at 8px with no pills anywhere, one
 * Atlas Blue fill per message, the mono uppercase eyebrow, and a 600px measure.
 *
 * One documented departure. Anonymous Pro carries body copy in the system, and no email client
 * has it. Falling back to Courier for whole paragraphs reads as broken mail rather than as the
 * Finance OS texture, so body copy falls back to a system sans and the mono stack is kept for the
 * eyebrow and the trust line, where the texture survives at short lengths and the fallback costs
 * nothing.
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

/* ------------------------------------------------------------------ plain text */

function plainBlock(b: Block): string {
  switch (b.kind) {
    case 'p':
      return wrap(b.text)
    case 'h':
      return wrap(b.text.toUpperCase())
    case 'tool':
      return `${wrap(b.name)}\n${b.url}\n${wrap(b.text)}`
    case 'cta':
      return `${wrap(b.trust)}\n${b.label}: ${b.url}`
  }
}

export function toPlainText(e: WarmupEmail): string {
  return [
    e.blocks.map(plainBlock).join('\n\n'),
    e.signoff.join('\n'),
    '--',
    wrap(`You are receiving this because ${e.reason}.`),
    `${SENDER.legal}\n${SENDER.address}\n${SENDER.email}`,
    `Unsubscribe: ${MERGE.unsubscribe}`,
  ].join('\n\n')
}

/* ------------------------------------------------------------------------ html */

const DISPLAY = `'Spline Sans','Helvetica Neue',Helvetica,Arial,sans-serif`
/** See the header note: the sans fallback is deliberate, the mono stack is kept for short text. */
const BODY = `'Anonymous Pro','Helvetica Neue',Helvetica,Arial,sans-serif`
const MONO = `'Anonymous Pro',Consolas,'Courier New',monospace`

const P_STYLE = `margin:0 0 20px 0;font-family:${BODY};font-size:16px;line-height:1.65;color:${MAIL.body};`
const H_STYLE = `margin:32px 0 8px 0;font-family:${DISPLAY};font-size:18px;line-height:1.35;font-weight:600;color:${MAIL.fg};`
const LINK_STYLE = `color:${MAIL.accent};text-decoration:underline;`

function htmlBlock(b: Block): string {
  switch (b.kind) {
    case 'p':
      return `        <p style="${P_STYLE}">${escapeHtml(b.text)}</p>`
    case 'h':
      return `        <h2 style="${H_STYLE}">${escapeHtml(b.text)}</h2>`
    case 'tool':
      // An inset row at the 6px radius, not a card. Cards imply a CTA; these are references.
      return `        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%;margin:0 0 16px 0;background-color:${MAIL.well};border-radius:6px;">
          <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0 0 6px 0;font-family:${DISPLAY};font-size:17px;line-height:1.35;font-weight:600;color:${MAIL.fg};">${escapeHtml(b.name)}</p>
              <p style="margin:0 0 10px 0;font-family:${BODY};font-size:15px;line-height:1.6;color:${MAIL.body};">${escapeHtml(b.text)}</p>
              <a href="${b.url}" target="_blank" style="font-family:${BODY};font-size:15px;line-height:1.5;${LINK_STYLE}">${escapeHtml(b.url.replace(/^https:\/\/(www\.)?/, ''))}</a>
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

export function toHtml(e: WarmupEmail): string {
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

        <!-- wordmark: a gold rule and the name. No remote image on a cold domain. -->
        <tr>
          <td class="fos-pad" style="padding:0 40px 20px 40px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td width="18" style="width:18px;">
                  <div style="width:18px;height:3px;background-color:${MAIL.gold};border-radius:2px;font-size:1px;line-height:3px;">&nbsp;</div>
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
${e.blocks.map(htmlBlock).join('\n')}
                  <p style="${P_STYLE}margin-bottom:0;">${signoff}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- footer: reason line, sender block, unsubscribe -->
        <tr>
          <td class="fos-pad" style="padding:24px 40px 8px 40px;font-family:${BODY};font-size:13px;line-height:1.6;color:${MAIL.meta};">
            ${escapeHtml(`You are receiving this because ${e.reason}.`)}<br /><br />
            ${escapeHtml(SENDER.legal)}<br />
            ${escapeHtml(SENDER.address)}<br />
            <a href="mailto:${SENDER.email}" style="color:${MAIL.meta};text-decoration:underline;">${escapeHtml(SENDER.email)}</a><br /><br />
            <a href="${MERGE.unsubscribe}" style="color:${MAIL.meta};text-decoration:underline;">Unsubscribe</a>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

/** Every email in one plain-text file, for pasting the whole sequence somewhere at once. */
export const allPlainText = (emails: WarmupEmail[]) =>
  emails
    .map((e) => `SUBJECT: ${e.subject}\nPREHEADER: ${e.preheader}\nSEND: day ${e.day}\n\n${toPlainText(e)}`)
    .join('\n\n\n========================================\n\n\n')
