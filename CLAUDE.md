# CLAUDE.md — Finance OS Design System

## What this is
A reusable, faithfully-tokenized design system for **Finance OS** (a broker-specific CRM /
operating system), delivered as a living React + Vite + TS + Tailwind + Framer Motion
**showcase / reference site**. The showcase IS the documentation. **Tokens are ground truth —
never hardcode a value a token should own.**

It also hosts a working tool: the **client audit instrument at `/audit`** (see below), which is
not a showcase exhibit — it is used live on client calls.

## Brand (as the code actually is)
- Archetype: **Ruler 70% + Sage 30%**. Voice: Calm · Clear · Grounded · Authoritative. Never hyped.
- **ONE theme: Light / Clarity.** Pure white canvas, `#F6F7F9` rhythm ground. There is no dark
  mode, no paper mode, and no theme toggle. `src/lib/theme.tsx` and `theme-toggle.tsx` do not
  exist; `tokens.css` has no `[data-theme]` blocks.
- **BLUE-ONLY.** The sole brand accent is **Atlas Blue `#33488F`** (ramp `--p-blue-50…500`).
  **There is no Signal Gold, no Momentum Amber, no orange and no gold anywhere.** They were
  removed in `bc4297a` (theme unification) and `ec1384f` (blue-only migration) to match the
  production site financeos.au. Do not reintroduce them, and do not trust any doc that says
  otherwise.
- Semantic state hues (success green, danger red) remain — they are functional signals, not
  brand colour. `warning` is deliberately a neutral grey tint, not a warm hue.
- Buttons: primary = solid blue fill with a white label; secondary = blue outline. **Focus rings
  are NEUTRAL (`--c-ring` = `--c-fg-subtle`), never the accent.**
- Type: **Spline Sans** (display/headings) + **Anonymous Pro** (body/mono), self-hosted via
  `@fontsource`, imported in `main.tsx`. No Google Fonts request at runtime.
- Foundations: **8px-max squircles** (radius scale is 2/4/6/8 only — no pills, no full rounds) ·
  gentle Framer motion · **NO glassmorphism**.

## Token architecture (3 layers)
`primitive` (`--p-*`, raw brand ramps) → `semantic` (`--c-*`, intent: canvas/surface/elevated/
fg/border/accent/state) → `component` (`--btn-*`, `--card-*`, `--input-*`, radius, motion).
Components compose from `--c-*` only. Wired via `tailwind.config.ts`, where **`colors` and
`borderRadius` are REPLACED, not extended** — a stray `bg-gray-500` or `rounded-3xl` fails to
compile, which is what enforces token-only and the 8px ceiling.

**Gotcha:** custom `text-{size}` tokens must be registered in tailwind-merge's font-size group
in `src/lib/cn.ts`, or `cn()` reads them as text-COLOUR classes and silently drops real colours
like `text-fg`.

## Routes
Two surfaces, split in `src/main.tsx` with `react-router-dom`:
- **`/`** — the showcase. One long scroll, anchor-based sidebar nav (`src/lib/nav.ts` is the
  single source: add an entry there and render the section in `App.tsx`). 21 sections.
- **`/audit`** — the client audit instrument, full-screen, outside the showcase chrome. It is
  **lazy-loaded** so its question bank stays out of the showcase bundle. Deep links need the SPA
  rewrite in `vercel.json`.

## The audit instrument (`src/audit/`, `src/data/audit/`)
A two-call diagnostic for a mortgage or finance brokerage — Discovery, Diagnosis, Handoff —
clicked through live on a client call. Content is data (`src/data/audit/modules/*.ts`), the
instrument is code (`src/audit/`). Every question cites the `db-finance-os` file behind it.

**`npm run check:audit` gates the build** (`scripts/audit-check.mts`). It fails on duplicate
ids, choice-less selects, `showIf` pointing at a renamed question, flag rules comparing against
a value that is not a choice, two questions sharing a normalised prompt, `seedRows` using an
undeclared column, and `AUDIT_SHAPE` drifting from the real counts. Those constants in
`build-spec.ts` exist so the showcase can document the instrument without importing it and
undoing the code split.

**Rules the content obeys, and any edit must keep:** the form asks about the *client's* business
and asserts nothing about ours. No turnaround, guarantee, trial, SLA or outcome figure anywhere.
Compliance flags route the client to their own licensee rather than stating a breach. The export
marks every figure as reported, not verified.

## Build environment
Developed on macOS locally and originally on the Team OS network share. The share workflow needs
a space-free `subst` drive (`cmd.exe` can't use a UNC working dir, esbuild can't resolve paths
with spaces); Vite keeps `usePolling` and `preserveSymlinks` for that case.

**Gotcha that costs an hour:** `preserveSymlinks` defeats Vite's automatic React deduping. Adding
any dependency that imports React can pre-bundle a second copy and throw
`Invalid hook call … Cannot read properties of null (reading 'useRef')` at runtime. `vite.config.ts`
pins `resolve.dedupe: ['react','react-dom']` and `optimizeDeps.include` for the router. If you add
such a dependency, clear `node_modules/.vite` afterwards.

Commit/push with the correct author identity (`211211395+teamos-ai@users.noreply.github.com`) so
Vercel accepts the deploy.

## Checks
- `npm run build` → `tsc --noEmit` + `check:audit` + `vite build`
- `node scripts/contrast-audit.mjs` → WCAG AA over the semantic pairs (currently 21/21)

---

# Operating principles (Andrej Karpathy — appended per project brief T1)

Behavioral guidelines to reduce common LLM coding mistakes. Bias toward caution over speed; use
judgment on trivial tasks.

## 1. Think Before Coding
Don't assume. Don't hide confusion. Surface tradeoffs.
- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.

## 2. Simplicity First
Minimum code that solves the problem. Nothing speculative.
- No features beyond what was asked. No abstractions for single-use code.
- No "flexibility"/"configurability" that wasn't requested.
- If you write 200 lines and it could be 50, rewrite it.

## 3. Surgical Changes
Touch only what you must. Clean up only your own mess.
- Don't "improve" adjacent code, comments, or formatting. Don't refactor what isn't broken.
- Match existing style. Remove only the orphans YOUR changes created.
- Every changed line should trace directly to the request. *(This powers iteration mode after S9.)*

## 4. Goal-Driven Execution
Define success criteria. Loop until verified.
- Turn each stage's Definition of Done into a verifiable check, then loop toward it.
- For multi-step tasks, state a brief plan with a `verify:` check per step.
- Strong success criteria let the model loop independently.
