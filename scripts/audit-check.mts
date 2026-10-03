/**
 * check:audit — structural integrity of the client audit question bank.
 *
 * Every rule here exists because breaking it produces a defect that is invisible until
 * an auditor is in front of a client: a duplicate id silently overwrites an answer, a
 * `single` with no choices renders an empty screen, a `showIf` pointing at a renamed
 * question hides a section forever, and a stale AUDIT_SHAPE tells the showcase a number
 * the instrument no longer has.
 *
 * Run: npm run check:audit
 */
import { OTHER_VALUE } from '../src/audit/types'
import { AUDIT_PARTS } from '../src/data/audit/index'
import { AUDIT_PART_SUMMARY, AUDIT_SHAPE } from '../src/data/audit/build-spec'

const problems: string[] = []
const qIds = new Map<string, string>()
const bIds = new Map<string, string>()
const mIds = new Map<string, string>()

let questions = 0
let blocks = 0
let ruleFlags = 0
let choiceFlags = 0
const kinds: Record<string, number> = {}

for (const part of AUDIT_PARTS) {
  for (const mod of part.modules) {
    if (mIds.has(mod.id)) problems.push(`duplicate module id "${mod.id}"`)
    mIds.set(mod.id, part.id)
    if (!mod.Icon) problems.push(`module "${mod.id}" has no Icon`)
    if (!mod.purpose?.trim()) problems.push(`module "${mod.id}" has no purpose`)

    for (const block of mod.blocks) {
      blocks++
      if (bIds.has(block.id)) problems.push(`duplicate block id "${block.id}"`)
      bIds.set(block.id, mod.id)
      if (block.questions.length === 0) problems.push(`block "${block.id}" has no questions`)

      for (const q of block.questions) {
        questions++
        kinds[q.kind] = (kinds[q.kind] ?? 0) + 1

        if (qIds.has(q.id)) problems.push(`duplicate question id "${q.id}" (also in ${qIds.get(q.id)})`)
        qIds.set(q.id, block.id)

        if (!q.prompt?.trim()) problems.push(`${q.id}: empty prompt`)
        if (!q.source) problems.push(`${q.id}: no source — every question must cite db-finance-os`)

        if ((q.kind === 'single' || q.kind === 'multi') && !q.choices?.length) {
          problems.push(`${q.id}: "${q.kind}" with no choices`)
        }
        if (q.kind === 'table' && !q.columns?.length) problems.push(`${q.id}: table with no columns`)

        /* allowOther only means anything on a choice question, and the sentinel it uses
           must not collide with a real choice value or the tile and the option fight. */
        if (q.allowOther && q.kind !== 'single' && q.kind !== 'multi') {
          problems.push(`${q.id}: allowOther on a "${q.kind}" question, which has no choices`)
        }
        if (q.choices?.some((c) => c.value === OTHER_VALUE)) {
          problems.push(`${q.id}: a choice uses the reserved value "${OTHER_VALUE}"`)
        }
        if (q.kind === 'scale' && !q.scaleLabels) problems.push(`${q.id}: scale with no scaleLabels`)

        const seen = new Set<string>()
        for (const c of q.choices ?? []) {
          if (seen.has(c.value)) problems.push(`${q.id}: duplicate choice value "${c.value}"`)
          seen.add(c.value)
          if (!c.label?.trim()) problems.push(`${q.id}: choice "${c.value}" has no label`)
          if (c.flag && !c.flagNote?.trim()) {
            problems.push(`${q.id}: choice "${c.value}" raises a flag with no note`)
          }
          if (c.flag) choiceFlags++
        }

        /* seeded rows must only use declared column keys, or the cell is invisible */
        for (const row of q.seedRows ?? []) {
          for (const key of Object.keys(row)) {
            if (!q.columns?.some((c) => c.key === key)) {
              problems.push(`${q.id}: seedRows uses unknown column "${key}"`)
            }
          }
        }

        for (const f of q.flags ?? []) {
          ruleFlags++
          if (!f.title?.trim() || !f.note?.trim()) problems.push(`${q.id}: flag missing title or note`)
          if ((f.op === 'lt' || f.op === 'gt') && typeof f.value !== 'number') {
            problems.push(`${q.id}: "${f.op}" rule needs a numeric value`)
          }
          if ((f.op === 'eq' || f.op === 'neq' || f.op === 'includes') && f.value === undefined) {
            problems.push(`${q.id}: "${f.op}" rule needs a value`)
          }
          if (f.op === 'eq' || f.op === 'neq') {
            if (q.choices && !q.choices.some((c) => c.value === f.value)) {
              problems.push(`${q.id}: "${f.op}" rule compares against "${f.value}", which is not a choice`)
            }
          }
          if (f.op === 'includes' && q.choices && !q.choices.some((c) => c.value === f.value)) {
            problems.push(`${q.id}: "includes" rule looks for "${f.value}", which is not a choice`)
          }
        }
      }
    }
  }
}

/* Two questions with the same prompt get asked twice on the same call, which is the
   defect a client actually notices. Normalise and compare across the whole instrument. */
const byPrompt = new Map<string, string[]>()
for (const part of AUDIT_PARTS) {
  for (const mod of part.modules) {
    for (const block of mod.blocks) {
      for (const q of block.questions) {
        const key = q.prompt
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
        byPrompt.set(key, [...(byPrompt.get(key) ?? []), q.id])
      }
    }
  }
}
for (const [, ids] of byPrompt) {
  if (ids.length > 1) problems.push(`the same question is asked twice: ${ids.join(' and ')}`)
}

/* showIf must point at a question that exists, or the dependent question never appears */
for (const part of AUDIT_PARTS) {
  for (const mod of part.modules) {
    for (const block of mod.blocks) {
      for (const q of block.questions) {
        if (!q.showIf) continue
        if (!qIds.has(q.showIf.question)) {
          problems.push(`${q.id}: showIf points at unknown question "${q.showIf.question}"`)
        }
      }
    }
  }
}

/* the showcase documents the instrument from constants — pin them to the real thing */
const modules = mIds.size
if (AUDIT_SHAPE.parts !== AUDIT_PARTS.length) {
  problems.push(`AUDIT_SHAPE.parts is ${AUDIT_SHAPE.parts}, the instrument has ${AUDIT_PARTS.length}`)
}
if (AUDIT_SHAPE.modules !== modules) {
  problems.push(`AUDIT_SHAPE.modules is ${AUDIT_SHAPE.modules}, the instrument has ${modules}`)
}
if (AUDIT_SHAPE.blocks !== blocks) {
  problems.push(`AUDIT_SHAPE.blocks is ${AUDIT_SHAPE.blocks}, the instrument has ${blocks}`)
}
if (AUDIT_SHAPE.questions !== questions) {
  problems.push(`AUDIT_SHAPE.questions is ${AUDIT_SHAPE.questions}, the instrument has ${questions}`)
}

for (const s of AUDIT_PART_SUMMARY) {
  const part = AUDIT_PARTS.find((p) => p.id === s.id)
  if (!part) {
    problems.push(`AUDIT_PART_SUMMARY names part "${s.id}", which does not exist`)
    continue
  }
  const n = part.modules.reduce((m, mod) => m + mod.blocks.reduce((b, k) => b + k.questions.length, 0), 0)
  if (s.modules !== part.modules.length) {
    problems.push(`AUDIT_PART_SUMMARY "${s.id}" says ${s.modules} modules, the part has ${part.modules.length}`)
  }
  if (s.questions !== n) {
    problems.push(`AUDIT_PART_SUMMARY "${s.id}" says ${s.questions} questions, the part has ${n}`)
  }
  if (s.title !== part.title) {
    problems.push(`AUDIT_PART_SUMMARY "${s.id}" title does not match the part`)
  }
}

console.log(
  `parts ${AUDIT_PARTS.length} · modules ${modules} · blocks ${blocks} · questions ${questions}`,
)
console.log(`flags ${ruleFlags + choiceFlags} (${ruleFlags} rule, ${choiceFlags} choice)`)
console.log(
  'kinds ' +
    Object.entries(kinds)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k}:${v}`)
      .join(' '),
)

if (problems.length > 0) {
  console.error(`\ncheck:audit FAILED — ${problems.length} problem(s)\n`)
  for (const p of problems) console.error(`  · ${p}`)
  process.exit(1)
}
console.log('\ncheck:audit PASS')
