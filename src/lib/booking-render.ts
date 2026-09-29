import { MAIL, SENDER } from '@/data/warmup'
import { APPT, CALENDAR, SAMPLE, type Block, type BookingEmail } from '@/data/booking'

/**
 * Renders one booking email into a standalone HTML document for GHL calendar notifications and
 * workflow emails. Same email rules as `warmup-render.ts`: inline styles, tables, no web-font
 * dependency, no remote images, one Atlas Blue fill per message, 8px radius cap, 600px measure.
 *
 * Merge fields are left in place. `withSample` swaps them for sample values for the Preview tab.
 */

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const DISPLAY = `'Spline Sans','Helvetica Neue',Helvetica,Arial,sans-serif`
const BODY = `'Anonymous Pro','Helvetica Neue',Helvetica,Arial,sans-serif`
const MONO = `'Anonymous Pro',Consolas,'Courier New',monospace`

const P_STYLE = `margin:0 0 20px 0;font-family:${BODY};font-size:16px;line-height:1.65;color:${MAIL.body};`
const H_STYLE = `margin:32px 0 12px 0;font-family:${DISPLAY};font-size:18px;line-height:1.35;font-weight:600;color:${MAIL.fg};`
const LINK_STYLE = `color:${MAIL.accent};text-decoration:underline;`

const detailRow = (label: string, value: string, last = false) => `              <tr>
                <td width="96" style="width:96px;padding:0 0 ${last ? 0 : 12}px 0;vertical-align:top;font-family:${MONO};font-size:12px;line-height:22px;letter-spacing:0.08em;text-transform:uppercase;color:${MAIL.meta};">${label}</td>
                <td style="padding:0 0 ${last ? 0 : 12}px 0;vertical-align:top;font-family:${DISPLAY};font-size:16px;line-height:22px;font-weight:500;color:${MAIL.fg};">${value}</td>
              </tr>`

function htmlBlock(b: Block): string {
  switch (b.kind) {
    case 'p':
      return `        <p style="${P_STYLE}">${escapeHtml(b.text)}</p>`
    case 'h':
      return `        <h2 style="${H_STYLE}">${escapeHtml(b.text)}</h2>`
    case 'details':
      // Inset well at the 6px radius, a hairline on the left in Atlas Blue.
      return `        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%;margin:0 0 24px 0;background-color:${MAIL.well};border-radius:6px;border-left:3px solid ${MAIL.accent};">
          <tr>
            <td style="padding:20px 24px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%;">
${detailRow('Call', escapeHtml(CALENDAR.name))}
${detailRow('When', `${APPT.date}<br />${APPT.time} (${APPT.timezone})`)}
${detailRow('Length', escapeHtml(CALENDAR.length))}
${detailRow('Where', `<a href="${APPT.location}" target="_blank" style="${LINK_STYLE}font-weight:500;word-break:break-all;">${APPT.location}</a>`, true)}
              </table>
            </td>
          </tr>
        </table>`
    case 'list':
      return `        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%;margin:0 0 20px 0;">
${b.items
  .map(
    (item, i) => `          <tr>
            <td width="32" style="width:32px;padding:0 0 12px 0;vertical-align:top;font-family:${MONO};font-size:13px;line-height:26px;font-weight:700;color:${MAIL.accent};">${String(i + 1).padStart(2, '0')}</td>
            <td style="padding:0 0 12px 0;vertical-align:top;font-family:${BODY};font-size:16px;line-height:26px;color:${MAIL.body};">${escapeHtml(item)}</td>
          </tr>`,
  )
  .join('\n')}
        </table>`
    case 'cta':
      return `        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:4px 0 16px 0;">
          <tr>
            <td align="center" bgcolor="${MAIL.accent}" style="border-radius:8px;">
              <a href="${b.url}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:${DISPLAY};font-size:16px;line-height:16px;font-weight:600;color:${MAIL.accentFg};text-decoration:none;border-radius:8px;">${escapeHtml(b.label)}</a>
            </td>
          </tr>
        </table>`
    case 'links':
      return `        <p style="margin:0 0 24px 0;font-family:${BODY};font-size:14px;line-height:1.6;color:${MAIL.meta};">${b.items
        .map((l) => `<a href="${l.url}" target="_blank" style="${LINK_STYLE}">${escapeHtml(l.label)}</a>`)
        .join('&nbsp;&nbsp;·&nbsp;&nbsp;')}</p>`
  }
}

export function toHtml(e: BookingEmail): string {
  // Zero-width spacers stop Gmail pulling body copy into the inbox snippet after the preheader.
  const spacer = '&#847;&zwnj;&nbsp;'.repeat(30)
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

        <!-- wordmark: an Atlas Blue rule and the name. No remote image. -->
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
${e.blocks.map(htmlBlock).join('\n')}
                  <p style="${P_STYLE}margin-bottom:0;">${signoff}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- footer: reason line and sender block -->
        <tr>
          <td class="fos-pad" style="padding:24px 40px 8px 40px;font-family:${BODY};font-size:13px;line-height:1.6;color:${MAIL.meta};">
            You are receiving this because you booked a call with Finance OS.<br /><br />
            ${escapeHtml(SENDER.legal)}<br />
            ${escapeHtml(SENDER.address)}<br />
            <a href="mailto:${SENDER.email}" style="color:${MAIL.meta};text-decoration:underline;">${escapeHtml(SENDER.email)}</a>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

/** Swap merge fields for sample values. Preview only; the copied HTML keeps the merge fields. */
export const withSample = (s: string) =>
  Object.entries(SAMPLE).reduce((out, [field, value]) => out.split(field).join(value), s)
