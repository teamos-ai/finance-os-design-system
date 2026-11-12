// Generates docs/COMPONENTS.md — the component index — from src/components/**.
// Run: `npm run docs:components`. Output is deterministic (no timestamp), so it only
// changes when a component does. Subdirectories of src/components are auto-discovered, so a
// new component family appears without touching this script. The living API (props, variants,
// states) is the showcase; this file is the catalogue that keeps it discoverable.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const SRC = join(ROOT, 'src/components')

// Title + blurb overrides for known families; any other dir uses its own name.
const KNOWN = {
  ui: { title: 'UI kit', blurb: 'The reusable primitives. Compose only from `--c-*` tokens.' },
  brand: { title: 'Brand', blurb: 'Logo marks — the provided assets only (see CLAUDE.md).' },
  'lead-magnets': { title: 'Lead magnets', blurb: 'Opt-in templates and their primitives.' },
  calculators: { title: 'Calculators', blurb: 'Broker calculators — repayments, borrowing power, stamp duty.' },
  dashboards: { title: 'Dashboards', blurb: 'Tokenised inline-SVG charts for broker dashboards.' },
  signature: { title: 'Email signature', blurb: 'Broker email-signature block + preview.' },
  emails: { title: 'Client emails', blurb: 'Client email templates and their renderer.' },
}
// Preferred order first, then any other discovered dir alphabetically.
const ORDER = ['ui', 'brand', 'lead-magnets', 'calculators', 'dashboards', 'emails', 'signature']

/** First sentence of the leading `/** ... *\/` JSDoc, flattened to one line. */
function purpose(code) {
  const m = code.match(/^\s*\/\*\*([\s\S]*?)\*\//)
  if (!m) return '—'
  const text = m[1]
    .replace(/^\s*\*\s?/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
  const body = text.replace(/^[A-Za-z0-9/ ]+(—|-|:)\s*/, '')
  const sentences = body.split(/(?<=[.。])\s+/).map((s) => s.trim()).filter(Boolean)
  const pick = sentences.find((s) => s.length > 12 && !/^finance os\.?$/i.test(s)) || sentences[0] || '—'
  return pick.slice(0, 170).replace(/\|/g, '\\|')
}

/** Exported, Capitalised component/const/function names. */
function exports(code) {
  const names = new Set()
  for (const m of code.matchAll(/export\s+(?:const|function)\s+([A-Z]\w+)/g)) names.add(m[1])
  for (const m of code.matchAll(/export\s+const\s+([A-Z]\w+)\s*=\s*(?:React\.)?forwardRef/g)) names.add(m[1])
  return [...names]
}

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else if (name.endsWith('.tsx')) out.push(p)
  }
  return out
}

const discovered = readdirSync(SRC).filter((d) => {
  try {
    return statSync(join(SRC, d)).isDirectory()
  } catch {
    return false
  }
})
const dirs = [...ORDER.filter((d) => discovered.includes(d)), ...discovered.filter((d) => !ORDER.includes(d)).sort()]

let md = `# Component reference

> **Generated** by \`npm run docs:components\` from \`src/components/**\` (subdirectories
> auto-discovered). Do not hand-edit — re-run the generator after adding or changing a component
> (see CONTRIBUTING.md). The living API — props, variants, states, tokens and copy-paste code — is
> the **showcase** at \`/\`, where every demo carries an inspector (Explain · Tokens · Code ·
> Download). This file is the index that keeps the kit discoverable.

`

let total = 0
for (const dir of dirs) {
  const meta = KNOWN[dir] || { title: dir, blurb: '' }
  let files
  try {
    files = walk(join(SRC, dir)).sort()
  } catch {
    continue
  }
  const rows = []
  for (const file of files) {
    const code = readFileSync(file, 'utf8')
    const names = exports(code)
    if (names.length === 0) continue
    const rel = relative(SRC, file)
    const hasVariants = /\bcva\(/.test(code) ? '✓' : ''
    rows.push(`| ${names.map((n) => `\`${n}\``).join(' ')} | ${purpose(code)} | ${hasVariants} | \`${rel}\` |`)
  }
  if (rows.length === 0) continue // skip families with no .tsx components (e.g. data-only dirs)
  total += rows.length
  md += `## ${meta.title} \`src/components/${dir}\`\n\n${meta.blurb ? meta.blurb + '\n\n' : ''}`
  md += `| Component(s) | Purpose | Variants | Source |\n|---|---|:---:|---|\n`
  md += rows.join('\n') + '\n\n'
}

md += `_Regenerate with \`npm run docs:components\`._\n`

mkdirSync(join(ROOT, 'docs'), { recursive: true })
writeFileSync(join(ROOT, 'docs/COMPONENTS.md'), md)
console.log(`docs/COMPONENTS.md written — ${total} component rows across ${dirs.length} families.`)
