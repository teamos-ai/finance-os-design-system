// WCAG AA contrast audit for the Finance OS semantic tokens (resolved per theme).
// AA: >=4.5 for normal text, >=3.0 for large text / UI components.

function hex(h) {
  h = h.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}
function blend(rgba, bgHex) {
  // rgba = [r,g,b,a] over opaque bgHex
  const bg = hex(bgHex)
  return rgba.slice(0, 3).map((c, i) => Math.round(c * rgba[3] + bg[i] * (1 - rgba[3])))
}
function lum([r, g, b]) {
  const a = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]
}
function ratio(fg, bg) {
  const f = Array.isArray(fg) ? fg : hex(fg)
  const b = Array.isArray(bg) ? bg : hex(bg)
  const L1 = lum(f), L2 = lum(b)
  const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1]
  return (hi + 0.05) / (lo + 0.05)
}

const themes = {
  dark: {
    canvas: '#0A0C12', surface: '#10131B', elevated: '#181B22',
    fg: '#F6F7F9', fgMuted: '#AEB5C2', fgSubtle: '#8B93A3',
    accent: '#EEBA2B', accentText: '#F1C855', accentFg: '#1A1206',
    amberText: '#EBA133', brand: '#8591BC',
    success: '#5FE0A6', warning: '#EBA133', danger: '#FF8A8E', info: '#8591BC',
    soft: { success: [47,182,122,0.16], warning: [235,161,51,0.16], danger: [255,97,102,0.16], info: [133,145,188,0.16], accent: [238,186,43,0.12] },
  },
  light: {
    canvas: '#F6F7F9', surface: '#FFFFFF', elevated: '#FFFFFF',
    fg: '#10131B', fgMuted: '#474E5C', fgSubtle: '#646C7D',
    accent: '#EEBA2B', accentText: '#8A5300', accentFg: '#1A1206',
    amberText: '#8A5300', brand: '#33488F',
    success: '#0E6B49', warning: '#8A5300', danger: '#A81E23', info: '#33488F',
    soft: { success: [19,138,94,0.12], warning: [138,83,0,0.12], danger: [213,41,47,0.10], info: [51,72,143,0.10], accent: [238,186,43,0.16] },
  },
  paper: {
    canvas: '#FBF6EA', surface: '#FFFDF8', elevated: '#FFFFFF',
    fg: '#2A2419', fgMuted: '#6B6149', fgSubtle: '#71674B',
    accent: '#E68A00', accentText: '#8A5300', accentFg: '#1A1206',
    amberText: '#8A5300', brand: '#293A72',
    success: '#0E6B49', warning: '#8A5300', danger: '#A81E23', info: '#293A72',
    soft: { success: [14,107,73,0.12], warning: [138,83,0,0.12], danger: [168,30,35,0.10], info: [41,58,114,0.10], accent: [230,138,0,0.14] },
  },
}

let fails = 0, total = 0
for (const [name, t] of Object.entries(themes)) {
  console.log(`\n===== THEME: ${name.toUpperCase()} =====`)
  const checks = [
    ['fg / canvas', t.fg, t.canvas, 4.5],
    ['fg / surface', t.fg, t.surface, 4.5],
    ['fg / elevated', t.fg, t.elevated, 4.5],
    ['fg-muted / canvas', t.fgMuted, t.canvas, 4.5],
    ['fg-muted / surface', t.fgMuted, t.surface, 4.5],
    ['fg-subtle / canvas', t.fgSubtle, t.canvas, 4.5],
    ['fg-subtle / surface', t.fgSubtle, t.surface, 4.5],
    ['accent-text / canvas', t.accentText, t.canvas, 4.5],
    ['accent-text / surface', t.accentText, t.surface, 4.5],
    ['amber-text / surface', t.amberText, t.surface, 4.5],
    ['accent-fg / accent (btn)', t.accentFg, t.accent, 4.5],
    ['brand / surface', t.brand, t.surface, 3.0],
    ['success / surface', t.success, t.surface, 3.0],
    ['warning / surface', t.warning, t.surface, 3.0],
    ['danger / surface', t.danger, t.surface, 3.0],
    ['info / surface', t.info, t.surface, 3.0],
    // state chips: state text on soft-blended-over-canvas
    ['success chip', t.success, blend(t.soft.success, t.canvas), 4.5],
    ['warning chip', t.warning, blend(t.soft.warning, t.canvas), 4.5],
    ['danger chip', t.danger, blend(t.soft.danger, t.canvas), 4.5],
    ['info chip', t.info, blend(t.soft.info, t.canvas), 4.5],
    ['accent-text on soft', t.accentText, blend(t.soft.accent, t.canvas), 4.5],
  ]
  for (const [label, fg, bg, min] of checks) {
    total++
    const r = ratio(fg, bg)
    const ok = r >= min
    if (!ok) fails++
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(6)} (min ${min})  ${label}`)
  }
}
console.log(`\n${total - fails}/${total} pass · ${fails} fail`)
