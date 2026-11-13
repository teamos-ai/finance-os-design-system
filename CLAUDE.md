# CLAUDE.md — Finance OS Design System

## How to drive this project (commands)

Run these in **Claude Code** (or paste the prompt in Codex). In **ChatGPT**, feed it this
file + the `memory/` files first, then use the same words — it can't run commands, but it
will understand them.

- `/new-project` — start a new build the System Pilot way (5 questions → writes CLAUDE.md + memory/). *New projects only.*
- `/brainstorm` — read `memory/`, catch up, then think it through with me (one question at a time).
- `/save` — checkpoint: update progress, decisions, next-actions + the Current State block below.
- `/handoff` — write a portable brief to paste into ChatGPT or another agent.

## What this is
A reusable, faithfully-tokenized design system for **Finance OS** (a broker-specific CRM /
operating system), delivered as a living React + Vite + TS + Tailwind + Framer Motion
**showcase / reference site**. The showcase IS the documentation. **Tokens are ground truth —
never hardcode a value a token should own.**

It also hosts a working tool: the **client audit instrument at `/audit`** (see below), which is
not a showcase exhibit — it is used live on client calls.

## Brand (as the code actually is)
- Archetype: **Ruler 70% + Sage 30%**. Voice: Calm · Clear · Grounded · Authoritative. Never hyped.
- **ONE theme: Light / Clarity.** Pure white canvas **everywhere** — no scroll-rhythm, no grey-blue
  shift and no grid paper (the grid/rhythm was removed 2026-11-13; **do not reintroduce**). There is no dark
  mode, no paper mode, and no theme toggle. `src/lib/theme.tsx` and `theme-toggle.tsx` do not
  exist; `tokens.css` has no `[data-theme]` blocks.
- **BLUE-PRIMARY.** The sole brand accent is **Atlas Blue `#33488F`** (ramp `--p-blue-50…500`),
  and **it owns ALL typographic highlight** — headings and any emphasised word inside a header or
  body copy use `text-highlight` / `--c-accent-text` (blue), never a second hue. **There is no gold
  and no orange anywhere**, and blue is never traded out of type emphasis.
- **AMBER is a functional STATUS signal only** — `#D99A3E` base / `#8A5A0F` AA text /
  `rgba(217,154,62,.16)` soft (tokens `--p-amber-*` and `--c-amber` / `--c-amber-text` /
  `--c-amber-soft`; Tailwind `amber` / `amber-text` / `amber-soft`; `Badge variant="amber"`). It
  marks attention/pending state (overdue, awaiting, at-risk) and star ratings, used **sparingly
  (≈ one amber moment per view)**. Never a brand accent, never a CTA, never applied to type or
  headings, never a ribbon. (This reinstates a narrow amber that `ec1384f` had removed —
  intentional, approved 2026-10-08; any doc still saying "no amber anywhere" is stale.)
- Semantic state hues (success green, danger red) remain — functional signals, not brand colour.
  `warning` now resolves to **amber** (attention/pending), reversing the earlier neutral-grey tint.
- **NO RIBBONS (hard rule).** Never put an accent side-rail, vertical bar, left-edge strip, corner
  or diagonal banner, or edge-clipped tag on any card, box, panel or button — anywhere in the DS or
  the site. Emphasis comes from elevation, a full border, scale, or a CENTERED top badge only.
- Buttons: primary = solid blue fill with a white label; secondary = blue outline. **Focus rings
  are NEUTRAL (`--c-ring` = `--c-fg-subtle`), never the accent.**
- Type: **Spline Sans** (display/headings) + **Anonymous Pro** (body/mono), self-hosted via
  `@fontsource`, imported in `main.tsx`. No Google Fonts request at runtime.
- **Logos: use ONLY the provided real assets — never draw, recolour, fabricate or AI-generate a
  logo, monogram or favicon.** Square mark → `/logo-square-blue.png`; rectangle long lockup →
  `/logo-rect-blue.png` (on light) / `/logo-rect-white.png` (on dark/photo). The favicon is the
  real square logo, set in `index.html`. `src/components/brand/Logo.tsx` is the only logo component.
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
- **`/`** — the showcase. One long scroll, anchor-based sidebar nav. **`src/lib/nav.ts` is the
  single source of truth** (`NavItem { group, category?, subcategory? }`); `App.tsx` renders the
  sections **data-driven from that nav, in order**, inserting group/category/Comparisons dividers —
  so the sidebar and the page always match. Add a nav entry + register the section in `App.tsx`'s
  `SECTIONS` map and it slots in (section number derived from nav order, never gaps). Four groups:
  **Start · Foundations · Components · Library**, where Library nests into Images & Backgrounds ·
  Website Sections (with a Comparisons cluster) · Dashboards & Data Displays · Marketing & Content ·
  Demos & Templates · Calculators & Assessments. ~43 sections. (The former Positioning / Patterns /
  Templates / Tools groups were dissolved into these on 2026-11-13.)
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
- `npm run check` → typecheck + lint + test (audit + contrast) — the local gate before a commit
- `npm run docs:components` → regenerates `docs/COMPONENTS.md` after any component change

## Memory Map & Current State

- **Docs:** `README.md` (entry) · `CONTRIBUTING.md` (how to work + keep component docs in sync) ·
  `docs/COMPONENTS.md` (generated index) · this file (the agent constitution) · `HANDOVER.md`
  (migration history). `AGENTS.md` points Codex here.
- **Memory:** `memory/` — read `next-actions.md` first, then `task_plan.md`, `decisions.md`,
  `progress.md`, `findings.md`. Keeping them current is what `/save` does.
- **Current State (2026-11-13):** Brand-alignment pass complete — the showcase now mirrors
  brand.financeos.au: white reset + a scroll-rhythm background (**since removed — see the hero/brand-polish entry below**) (white ↔ grey-blue ↔ blue grid), Spline
  Sans body, the Promo Video flip-to-demo dashboard, and a new **Market Evidence** section porting
  the brand's graph/table vocabulary (`RingStat` · `RankedBarChart` · `SplitTrack`, stat tiles with
  `unverified` flags, keyword table, source disclosures) on real AXL/MFAA data, plus a premium
  scroll-reveal pass over the Dashboard Widgets. **Shipped** — pushed to `main` and live on the prod
  deploy (commit `7113bce`); the DS access gate is **active** (ds.financeos.au → 302 /login.html), so
  the real positioning data stays gated. Since then: Dashboard-Widgets premium-reveal pass, a
  **bundle split** (`manualChunks` → entry 500→291 kB, warning gone), and an **a11y screen-reader
  pass** (labelled the last inputs, named the collapsed GitHub link, fixed one heading skip). `git
  push` is blocked for Claude (auto-mode classifier), so **Tumai runs every push**. Those earlier
  commits are pushed and live. **Then (2026-11-13): the IA restructure** — Positioning / Patterns /
  Templates / Tools dissolved into a four-group nav (Start · Foundations · Components · Library) with
  a browsable, nested Library; the 7 Positioning designs relocated; Notion, Domain Warm-up and the
  Client-Audit nav entry removed (the `/audit` instrument stays); new Charts / Contour Map / Quizzes /
  Funnels / Website Audit Forms homes added; page rendered data-driven from the nav so it matches the
  sidebar. **Then (2026-11-13): the website-assets pass** — all **20 Finance Calculators** built from
  the site and validated to the dollar (shared engine in `finance.ts`, shared `CalcLayout`; stamp duty
  now 6 states, ACT/NT pending); the **interactive Stack Audit quiz** (reusable `QuizRunner`); and the
  **Funnels catalogue** (10 types, cross-linked to the parts). **Next:** Website Audit Forms (the
  "weekly leakage assessment" needs a source link); ACT/NT stamp duty. Several commits await Tumai's
  push. See `memory/next-actions.md`.
- **Current State (2026-11-13 · hero + brand polish):** Page background is now flat **pure white** —
  the scroll-rhythm stage, grey-blue shift and blue grid are all gone from `Shell.tsx` / `index.css` /
  `tokens.css` (**do not reintroduce the grid**). The hero mirrors financeos.au: headline **"Your
  shortcut to our design system"** on a new `display-3xl` token (≈88px/700/-0.025em, in
  `tailwind.config.ts` + registered in `cn.ts`), a new subtitle, and the top-of-page ticker banner
  removed (the Banners *library exhibit* stays). The hero OS mark floats + gently wobbles
  (`FloatWobble` in `motion.tsx` — a deliberate, reduced-motion-safe exception to the no-wobble rule).
  Added **two downloadable icon packs** on the Icons section: the **full static Lucide set**
  (`public/packs/lucide-icons-full.zip`, 2356 SVGs, lucide-static 1.72.0, ISC) and the **animated set**
  (`public/packs/animated-lucide-icons.zip`, 999 components, AnimateIcons MIT + Lucide ISC, @ `23e58d0`).
  **Sidebar icons** re-picked for 10 items: Hero→Rocket, Tokens→Blocks, Radius & Elevation→Layers2,
  Logo→Gem, Icons→Shapes, Buttons & Controls→ToggleLeft, Heroes→Crown, Landscape Table→Table2,
  This vs That→SquareSplitHorizontal, Social Media→Smartphone. All verified in the running app; commits
  await Tumai's push.

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
