#!/usr/bin/env node
/**
 * token-coverage — the self-documenting-specimen guardrail.
 *
 * The DS rule (see CONTRIBUTING.md): every showcase section that renders a reproducible specimen
 * must name the token(s) / prop(s) / parts behind it INLINE and by eye — never only inside the "+"
 * inspector. The two tools are <TokenTag> (atomic: a class / token / prop, also written to the DOM
 * as data-token) and <ComposedFrom> (assembled designs: the DS parts it's built from). This check
 * fails if a section has neither, so a future addition can't silently skip its annotation.
 *
 * A small, DOCUMENTED exempt set covers sections that self-document another accepted way, or that
 * render no reproducible specimen. Adding a new section without an annotation (and without a reason
 * here) fails the build — that is the point.
 *
 * Static by design (no browser): it greps the section source. For a deeper, rendered check, a
 * Playwright sweep can assert `document.querySelectorAll('[data-token]')` coverage per <section id>.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const SECTIONS_DIR = join(here, '..', 'src', 'showcase', 'sections')

/** Sections that legitimately carry no <TokenTag>/<ComposedFrom> — each with its reason. */
const EXEMPT = {
  'HeroSection.tsx': 'front door — the hero, not a parts exhibit',
  'VideoSection.tsx': 'front door — the explainer/promo, not a parts exhibit',
  'OverviewSection.tsx': 'narrative "system at a glance" showreel, not a parts catalogue',
  'ColorSection.tsx': 'prints hex + --c-* inline via swatches — the gold standard',
  'BannersSection.tsx': 'self-documents via Demo variant labels ("Banner · black", …)',
  'FunnelsSection.tsx': "self-documents via its own per-card 'Built from' anchor rows",
  'WebsiteAuditFormsSection.tsx': 'status/placeholder — no rendered design specimen',
}

const files = readdirSync(SECTIONS_DIR)
  .filter((f) => f.endsWith('.tsx'))
  .sort()

const rows = []
let missing = 0
for (const f of files) {
  const src = readFileSync(join(SECTIONS_DIR, f), 'utf8')
  const tokenTags = (src.match(/<TokenTag[\s/>]/g) || []).length
  const composed = (src.match(/<ComposedFrom[\s/>]/g) || []).length
  const covered = tokenTags + composed > 0
  const exempt = f in EXEMPT
  let verdict
  if (covered) verdict = 'ok'
  else if (exempt) verdict = 'exempt'
  else {
    verdict = 'MISSING'
    missing++
  }
  rows.push({ f, tokenTags, composed, verdict })
}

const pad = (s, n) => String(s).padEnd(n)
console.log('\n  token-coverage — inline specimen annotations (<TokenTag> / <ComposedFrom>)\n')
console.log('  ' + pad('section', 32) + pad('TokenTag', 10) + pad('ComposedFrom', 14) + 'verdict')
console.log('  ' + '-'.repeat(66))
for (const r of rows) {
  console.log(
    '  ' +
      pad(r.f.replace('.tsx', ''), 32) +
      pad(r.tokenTags || '·', 10) +
      pad(r.composed || '·', 14) +
      r.verdict,
  )
}

const ok = rows.filter((r) => r.verdict === 'ok').length
const ex = rows.filter((r) => r.verdict === 'exempt').length
console.log('\n  ' + `${ok} annotated · ${ex} exempt · ${missing} missing\n`)

if (missing > 0) {
  console.error('  token-coverage FAIL — the sections marked MISSING render specimens with no inline')
  console.error('  annotation. Add a <TokenTag> (atomic class/token/prop) or <ComposedFrom> (assembled')
  console.error('  design) per the convention in CONTRIBUTING.md — or, if the section truly has no')
  console.error('  reproducible specimen, add it to EXEMPT in this script with a one-line reason.\n')
  process.exit(1)
}
console.log('  token-coverage PASS\n')
