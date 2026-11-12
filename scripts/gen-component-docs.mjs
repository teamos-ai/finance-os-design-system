// Generates docs/COMPONENTS.md — the component index — from src/components/**.
// Run: `npm run docs:components`. Output is deterministic (no timestamp), so it only
// changes when a component does. The living API (props, variants, states) is the showcase;
// this file is the catalogue that keeps it discoverable for the next person.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const SRC = join(ROOT, 'src/components')

const GROUPS = [
  { dir: 'ui', title: 'UI kit', blurb: 'The reusable primitives. Compose only from `--c-*` tokens.' },
  { dir: 'brand', title: 'Brand', blurb: 'Logo marks — the provided assets only (see CLAUDE.md).' },
  { dir: 'lead-magnets', title: 'Lead magnets', blurb: 'Opt-in templates and their primitives.' },
]

/** First sentence of the leading `/** ... *\/` JSDoc, flattened to one line. */
function purpose(code) {
  const m = code.match(/^\s*\/\*\*([\s\S]*?)\*\//)
  if (!m) return '—'
  const text = m[1]
    .replace(/^\s*\*\s?/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
  // Drop a leading "Name — " / "Name:" label, then take the first sentence.
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

let md = `# Component reference

> **Generated** by \`npm run docs:components\` from \`src/components/**\`. Do not hand-edit —
> re-run the generator after adding or changing a component (see CONTRIBUTING.md). The living
> API — props, variants, states, tokens and copy-paste code — is the **showcase** at \`/\`,
> where every demo carries an inspector (Explain · Tokens · Code · Download). This file is the
> index that keeps the kit discoverable.

`

for (const group of GROUPS) {
  const dir = join(SRC, group.dir)
  let files
  try {
    files = walk(dir).sort()
  } catch {
    continue
  }
  md += `## ${group.title} \`src/components/${group.dir}\`\n\n${group.blurb}\n\n`
  md += `| Component(s) | Purpose | Variants | Source |\n|---|---|:---:|---|\n`
  for (const file of files) {
    const code = readFileSync(file, 'utf8')
    const names = exports(code)
    if (names.length === 0) continue
    const rel = relative(join(ROOT, 'src/components'), file)
    const hasVariants = /\bcva\(/.test(code) ? '✓' : ''
    md += `| ${names.map((n) => `\`${n}\``).join(' ')} | ${purpose(code)} | ${hasVariants} | \`${rel}\` |\n`
  }
  md += `\n`
}

md += `_Regenerate with \`npm run docs:components\`._\n`

mkdirSync(join(ROOT, 'docs'), { recursive: true })
writeFileSync(join(ROOT, 'docs/COMPONENTS.md'), md)
const count = (md.match(/^\| `/gm) || []).length
console.log(`docs/COMPONENTS.md written — ${count} component rows.`)
