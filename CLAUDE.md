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
- **ONE theme: Light / Clarity.** The canvas is white with a **subtle scroll-rhythm colour wash** —
  a fixed `.bg-stage` layer cross-fades white ↔ soft blue-grey (`--c-warm #E8EDF7`) over **750ms** as
  every ~3rd section reaches the viewport centre (`Shell.tsx` sets `<html data-bg="plain|warm">`;
  `rootMargin -45%/-45%`), mirroring brand.financeos.au. Restored **2026-11-14** (confirmed by Tumai) —
  this **supersedes the earlier always-white rule**. It is **COLOUR ONLY**: the blue **grid paper stays
  retired** (removed 2026-11-13 — **do not reintroduce the grid**). JS off → plain white; reduced-motion
  keeps content visible. There is no dark mode, no paper mode, and no theme toggle. `src/lib/theme.tsx`
  and `theme-toggle.tsx` do not exist; `tokens.css` has no `[data-theme]` blocks.
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

**Self-documenting specimens (hard rule).** What you see must say what makes it — by eye AND for an
AI agent. Every showcase specimen names the token / class / prop / parts behind it **inline**, not
only inside the "+" inspector: a `<TokenTag>` (`src/components/ui/token-tag.tsx` — shows + copies the
string and writes `data-token` to the DOM) for an atomic class/token/prop, or a `<ComposedFrom>`
(`src/showcase/Section.tsx`) parts row for an assembled design. `npm run check:tokens` gates this; a
few sections are EXEMPT in `scripts/token-coverage.mjs`, each with a reason. See CONTRIBUTING.md.

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
- `npm run check` → typecheck + lint + test (audit + contrast) + **token coverage** — the local gate before a commit
- `node scripts/token-coverage.mjs` → every showcase section names its specimens inline (`<TokenTag>`/`<ComposedFrom>`); a small documented EXEMPT set aside
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
  (`public/packs/lucide-icons-full.zip`, **2713 SVGs** = 2356 core `lucide-static` 1.72.0 + 357 `@lucide/lab`,
  ISC — the complete Lucide library; 21st.dev's "2814" over-counts) and the **animated set**
  (`public/packs/animated-lucide-icons.zip`, 999 components, AnimateIcons MIT + Lucide ISC, @ `23e58d0`).
  **Sidebar icons** re-picked for 10 items: Hero→Rocket, Tokens→Blocks, Radius & Elevation→Layers2,
  Logo→Gem, Icons→Shapes, Buttons & Controls→ToggleLeft, Heroes→Crown, Landscape Table→Table2,
  This vs That→SquareSplitHorizontal, Social Media→Smartphone. All verified in the running app; commits
  await Tumai's push.
- **Current State (2026-11-14 · promo / sidebar / colour):** Three changes, all verified. (1) **Promo
  Video** reframed to the explainer — `VideoSection` is now "Watch the explainer" over the brand "My
  Account" dashboard (`BrandDashboard`: a tokenised 16:9 rebuild of brand.financeos.au's platform-in-motion
  board on a fixed 1280×720 canvas scaled by `ScaleToFit`, with the brand memoji avatars in `/public/dash`)
  that flips to the explainer video (same CDN link). Kept DS rules over the brand page's look (8px squircles,
  solid surfaces, no glass). The old broker `PlatformDashboard` was deleted (orphaned by the swap). (2)
  **Sidebar** — the accent active side-rail is removed from the nav (`Shell`) and the audit `Rail`
  (enforces the NO RIBBONS rule; active state is the filled highlight only); a full ribbon audit is clean.
  The sidebar width is now **drag-resizable** (neutral handle, 208–420px, persisted, keyboard ←/→) on top
  of collapse. Impeccable's binary wasn't run (untrusted download); its audit philosophy was applied by
  hand. (3) **Colour** rebuilt into one coherent system — Anchor & neutrals (Blue/Black/White) + **the
  functional ecosystem** (success · danger · amber · info, each with base/soft/AA-text/role/usage/tokens),
  and **Tokens** reframed as the architecture and cross-linked. No token values changed (contrast 21/21).
  Commits await Tumai's push.
- **Current State (2026-11-14 · webp + both Codex amendments):** **Focus now —** shipped three
  verified pieces (desktop + mobile; `npm run check` 21/21, `build` OK): (1) the 33 library photos are
  now **WebP** (Pillow, 5.18 → 1.51 MB; `libraryImageSrc` → `.webp`); (2) **Video Explainer parity** —
  the flip control sits below the card, relabelled "Watch the demo video / Back to the dashboard", the
  card rests at the reference 3D tilt (rotateX 3° / rotateY -6°, flat ≤600px) and the player focuses on
  flip (`FlipCard.tsx`, `VideoSection.tsx`); (3) **scroll motion** — the white ↔ `--c-warm #E8EDF7`
  background rhythm is **back** (fixed `.bg-stage`, 750ms, warm every ~3rd section via `Shell` `data-bg`),
  and the reveal rise is aligned to the reference 12px (`motion.tsx`). The scroll-rhythm **COLOUR is
  restored; the grid stays retired** — the brand rule + this constitution were reconciled above.
  **Next step —** Tumai commits + runs `git push origin main` (push is blocked for Claude), then confirm
  the gated prod deploy. **Don't-touch —** do NOT reintroduce the blue grid paper. **Open question —**
  none. **Last updated —** 2026-11-14, Claude (Opus 4.8).
- **Current State (2026-11-15 · dashboard hover + grey headers + Overview→Foundations):** **Focus
  now —** shipped + pushed three verified changes [f7bbbf6]. (1) The **Video Explainer** dashboard
  gained the brand's **cursor-follow parallax hover tilt** (FT 10 → ±5°, 180ms follow, settles to the
  rest tilt rotateX 3° / rotateY -6° on leave, mouse-only, off while flipped, flat ≤600px — ported
  from brand.financeos.au `app.js`/`app.css` into `FlipCard` via framer-motion motion values +
  imperative `animate()`, the 700ms ease-out flip preserved). The **memoji "Champ Carter"** no longer
  clips — `padding + object-contain + a tokenised halo` (`radial --c-accent-soft over --c-canvas-muted`),
  keeping the DS 8px squircle. The tokenised **`BrandDashboard` is reused** as the lead "My Account
  workspace" exhibit in **Dashboard Layouts** (the flip stays in Video Explainer). (2) **Grey exhibit
  headers are now a global rule** — the shared `Demo` frame header (`Section.tsx`) went from
  `bg-surface` (pure white) to **`bg-selected` #EDEFF2 + `text-fg-muted` medium**, so every box across
  all 36 sections reads as a grey specimen-drawer strip. (3) **Overview moved from Start into
  Foundations** as its opening section — Start = Hero + Video no longer bleeds into the FOUNDATIONS
  divider; section numbers are nav-index-driven and unchanged. Gate green (check 21/21, build OK,
  docs:components no-op); verified in-browser (real-cursor tilt, mobile flat, divider order, grey
  headers, memoji). **Next step —** confirm the gated prod deploy after Vercel rebuilds. **Don't-touch —**
  keep the blue grid retired; emphasis stays elevation / border / scale / centered-badge (NO RIBBONS);
  the scroll-rhythm colour wash stays. **Open question —** grey-header strength (`bg-selected` #EDEFF2)
  can be dialled to `bg-inset` #F6F7F9 if Tumai wants subtler; "move dashboard" was read as "add to
  Dashboard Layouts" (flip kept). **Last updated —** 2026-11-15, Claude (Opus 4.8).
- **Current State (2026-11-15 · token system + premium Overview):** **Focus now —** shipped + pushed
  three commits, all live behind the gate (ds.financeos.au root → 302 /login.html). (1) **`0ec8752`** —
  Overview "system at a glance" rebuilt as a draggable **CardSphere** + two bentos (re-tokenised from
  dark 21st-dev refs into Light / Atlas-Blue). (2) **`4bceb4d`** — **self-documenting specimens**: new
  `<TokenTag>` (`components/ui/token-tag.tsx` — shows a class/token/prop inline AND writes `data-token`
  for agents) + `<ComposedFrom>` across ~31 sections, so every exhibit names its token BY EYE, not only
  in the "+" inspector; guard `scripts/token-coverage.mjs` in `npm run check` (34 ok · 9 exempt · 0
  missing) fails a new section that skips it; the rule is written above (token-architecture + Checks)
  and in CONTRIBUTING.md. (3) **`2b0d38e`** — **premium Overview** (Light brand, Tumai's call):
  CardSphere **floats** (no box, Atlas-Blue halo, gradient-accent cards); the two bentos **merged** into
  one `sections/overview/SystemBento.tsx`; every cell on a cursor-parallax `<TiltCard>` (`overview/`)
  with layered-shadow lift + count-up/draw-in; catalogued for reuse — new **Card Sphere** library
  section (`CardSphereSection.tsx`, Orbit icon, after Heroes) + "The tilt bento" in Bento Box;
  `GlanceBento`/`FeatureBento` deleted. **Next step —** none pending; await direction. **Don't-touch —**
  keep it Light (no dark tokens); keep the blue grid retired; put a `<TokenTag>`/`<ComposedFrom>` on
  every new specimen (the guard enforces it). **Open question —** none. **Last updated —** 2026-11-15,
  Claude (Opus 4.8).
- **Current State (2026-11-16 · sphere room · true bento · Tokens removed · Typography mixed):** **Focus
  now —** an Overview-polish batch is **built + verified (desktop + mobile), awaiting Tumai's push** (9
  files; `npm run build` OK · `check` 21/21 · token-coverage 34 ok · 8 exempt · 0 missing). (1) **Card
  Sphere** stops clipping — `CardSphere.tsx` container `overflow:hidden; contain:strict` → **`overflow:
  visible; contain:layout`** (frame can't clip a face), hero faces ×0.85, fill factor 0.82 → **0.74**;
  `OverviewSection.tsx` drops the "showing buttons…" caption + state so the sphere just floats on its
  halo. (2) **System Bento** rebuilt — fixed **`md:auto-rows-[188px]`** + `grid-flow-dense`, mixed spans
  (token-arch hero 2×3; Typography / Verified-AA / Three-layer 2×2; Image-Library 4×1; rest 2×1; CTA
  6×1). Heights **locked**: Typography is a 2-row box and its Aa inset has **`min-h-[7rem]`**, so the
  ramp animates without ever reflowing the grid (mobile too). **7 new `NavCell`s** (Buttons · Logo ·
  Colour · This-vs-That · Spacing · Blogs · Lead Magnets) + wide Image-Library strip, each `↗`-linked to
  its section, all on `TiltCard`. (3) **Tokens section DELETED** (`TokensSection.tsx` git-rm'd; dropped
  from `App.tsx`, `nav.ts` + its `Blocks` import, token-coverage EXEMPT) — nav now goes **Overview →
  Colour**; `ColorSection` cards default **expanded** + click-to-copy (lead rewritten). (4) **Typography**
  default is the **Mixed hero-H1 pattern** — ink line + one Atlas-Blue keyword (`text-fg` +
  `text-highlight`, per-row `hl` word) via a new `HeadingText`; the **Mixed / Blue / Black** switcher is
  kept (all three verified). **Next step —** Tumai runs `git push origin main`, then confirm the gated
  prod deploy. **Don't-touch —** keep the blue grid retired; keep it Light (no dark tokens); Overview is
  token-coverage EXEMPT so the new bento cells need no TokenTag. **Open question —** none. **Last updated
  —** 2026-11-16, Claude (Opus 4.8).

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
