# Progress Log

<!-- What was done, errors hit, tests run, results. Newest on top. Date each entry (YYYY-MM-DD). -->

## 2026-11-16 (later) — Motion system, motion-finance skill, logo + inspector fixes (built + verified, awaiting push)

- **Research:** three parallel read-only scans (5 teamos-ai forks, 8 third-party kits, the YouTube video's 10
  repos). Outcome in the skill's `references/stack.md`. Nothing cloned or executed from third parties.
- **motion-finance skill** → `~/1-Tumai-Second-Brain/1-projects/motion-finance` (own git repo, commit `09da6eb`,
  not yet on GitHub). Films authored as single-file HyperFrames compositions; `lint` 0 errors, `calm-audit` 0
  errors (negative-tested: it fails on bounce / infinite repeat / gold logo / two blue keywords), contact sheets
  reviewed, 4 MP4s rendered and durations verified with ffprobe. Bug found + fixed in review: SVG arrowheads
  collapsed because GSAP overwrote the positioning `<g>` transform (now animates the child path — documented).
  HyperFrames telemetry kept off (`HYPERFRAMES_NO_TELEMETRY=1`).
- **Design system:** motion tokens (CSS + Tailwind + `motion-tokens.ts`), `MaskReveal` / `DrawLine`,
  `HalftoneClouds`, rebuilt `MotionSection`, `public/motion/*` (web copies ≈1.3 MB total) and the skill zip.
- **Sweep / polish:** Section body + Demo reveals; `transition-calm`; in-view margin instead of fraction;
  Tailwind `alphaAware()` (opacity modifiers on token colours were silently no-ops — 54 uses in 23 files).
- **Logo:** `logo-rect-white.png`, `logo-rect.png`, `logo-square.png` were all gold → `git rm`; middleware
  allow-list + README + CLAUDE.md updated. **Inspector:** `demo-head` hook pads the header under the "+".
- **Checks:** `npm run check` exit 0 (contrast 21/21, coverage 0 missing), `npm run build` OK, in-browser desktop
  pass (151 inspectors / 0 overlaps / no horizontal scroll / nothing left hidden at normal scroll). Mobile:
  DOM overflow check clean; screenshots limited because the preview pane runs as a hidden page (IO throttled).
- **Not done / blocked:** 21st.dev list shows empty when signed out; Pinterest board is behind a login wall
  (only the first rows visible). Chrome extension was not connected.

## 2026-11-16 — Overview polish batch: sphere room, true bento, Tokens removed, Typography mixed default (built + verified, awaiting Tumai's push)

Four changes, one working set (9 files), gate-green (`npm run build` 1.4s · `npm run check`
21/21 · token-coverage 34 ok · 8 exempt · 0 missing), verified in-browser on **desktop + mobile**.
NOT yet committed/pushed — **Tumai runs the push** (push blocked for Claude).

- **(1) Card Sphere — stop the clipping.** `CardSphere.tsx`: container `overflow:hidden; contain:strict`
  → **`overflow:visible; contain:layout`** (the real fix — the frame can no longer clip a card), hero
  faces ×0.85, fill factor 0.82 → **0.74** (cards orbit tighter / more central). `OverviewSection.tsx`:
  removed the "showing buttons…" caption + its state — the sphere now just floats on its halo, no box,
  no caption. Verified across idle-drift frames: big "Cards"/"Typography" faces render whole, no cut-off.
- **(2) System Bento — locked heights + a true, varied bento.** Rebuilt `overview/SystemBento.tsx`:
  fixed **`md:auto-rows-[188px]`** + `grid-flow-dense` with mixed spans (token-architecture hero 2×3;
  Typography / Verified-AA / Three-layer-tokens 2×2; Image-Library wide 4×1; the rest 2×1; CTA 6×1).
  The resize bug is gone: **Typography is a fixed 2-row box** so the animated Aa ramp cycles inside it
  without ever reflowing the grid (confirmed body-md→display-lg with the Verified-AA cell staying
  top-aligned). Added a **`min-h-[7rem]`** on the Aa inset so it also holds steady on mobile
  (single-column, auto-height). **Seven new cells** communicate the rest of the system, each a compact
  `NavCell` with an `↗` link: Buttons (#components), Logo (#logo), Colour (#color), This-vs-That
  (#this-vs-that), Spacing & Layout (#spacing), Blogs (#blogs), Lead Magnets (#leadmagnets), plus a wide
  **Image Library** strip (#imagery, wash swatches). All on `TiltCard`.
- **(3) Tokens section deleted.** `TokensSection.tsx` removed (git rm); dropped from `App.tsx` SECTIONS,
  `nav.ts` (+ its `Blocks` import), and the token-coverage EXEMPT list. Nav now goes **Overview → Colour**
  directly. **Colour made the single colour home:** `ColorSection.tsx` cards default **expanded**
  (`useState(true)`) with "SHADES — CLICK TO COPY" and the existing click-to-copy (verified — swatch
  shows a copied overlay); lead rewritten ("Every family is expanded below — click any swatch to copy").
- **(4) Typography — tokenised mixed black+blue default.** `TypographySection.tsx`: new `HeadingText`
  renders the **hero-H1 pattern** — ink line with ONE Atlas-Blue keyword (`text-fg` + `text-highlight`),
  via a per-row `hl` word ("Predictable", "settlements", "Less", "calm", "Unified", "Automated").
  Toggle is now **Mixed (default) / Blue / Black**; the full-blue + full-black switcher kept (all three
  verified live). Mixed shows two token chips, the others one.

## 2026-11-15 — Overview premium rebuild + self-documenting token system (3 commits, shipped + pushed, all live)

Three commits, each gate-green (`npm run check` incl. the new token-coverage, `npm run build`),
verified in-browser (desktop + mobile), pushed to `main`, each confirmed live on ds.financeos.au
(root → 302 /login.html).

- **`0ec8752` — Overview "system at a glance" rebuilt** as a showreel: a draggable **CardSphere**
  (`sections/overview/CardSphere.tsx`) of tokenised SVG/CSS card faces (drag / flick / arrow-keys +
  a gentle idle drift, reduced-motion safe) over two bentos. **Re-tokenised from dark 21st-dev
  references into the Light / Atlas-Blue brand** (no lime, no glass, no dark).
- **`4bceb4d` — self-documenting specimens.** New **`<TokenTag>`** (`components/ui/token-tag.tsx`):
  a copy-able mono chip that shows a class / token / prop inline AND writes **`data-token`** to the DOM,
  so an agent reads every specimen via `document.querySelectorAll('[data-token]')`. Paired with the
  existing `<ComposedFrom>` for assembled designs. Swept **~31 sections** so every exhibit names its
  token BY EYE (previously only inside the "+" inspector). New guard **`scripts/token-coverage.mjs`**
  wired into `npm run check` — fails if a section renders specimens with neither; **9 documented
  EXEMPT** (Tokens/Colour print live swatches, Banners/Funnels self-document, Hero/Video/Overview are
  narrative, Motion blank, AuditForms placeholder). Coverage **34 ok · 9 exempt · 0 missing**.
  Convention added to CONTRIBUTING.md + CLAUDE.md. Charts' plain `<p>` labels unified to TokenTag.
  Ran the audit + the annotation as **parallel subagents**; one JSX-imbalance race on
  `MarketEvidenceSection` when I edited a file a subagent still owned → healed (lesson in decisions).
- **`2b0d38e` — premium Overview (Light brand, Tumai's explicit call).** CardSphere **floats** (no
  container, soft Atlas-Blue halo, gradient-accent blue cards); the two bentos **merged into one**
  `sections/overview/SystemBento.tsx` (both headers removed); every cell rides a cursor-parallax
  **`<TiltCard>`** (`overview/TiltCard.tsx` — spring, mouse-only, reduced-motion safe) with
  layered-shadow lift + count-up / draw-in. **Catalogued for reuse:** new **Card Sphere** library
  section (`CardSphereSection.tsx`, after Heroes, Orbit icon) + the premium bento as "The tilt bento"
  in Bento Box. Old `GlanceBento` / `FeatureBento` deleted.

## 2026-11-15 — Sidebar log-out button (shipped + pushed, 9878e90; live on prod)

Added a **Log out** control to the showcase sidebar footer (`Shell.tsx`), under the GitHub link —
expanded shows `⟲ Log out`, collapsed is icon-only. Neutral, token-only, no ribbon.

- **Mechanism (reused the existing gate):** the `fos_gate` cookie is HttpOnly, so JS can't clear it;
  the button POSTs `/api/logout` (Set-Cookie Max-Age=0), then `window.location = '/login.html'`.
  `middleware.js` then re-checks the now-cleared cookie and holds every showcase/`/audit` request at
  the password gate until the access password is re-entered. Navigates regardless of the fetch result,
  so a dormant gate / offline endpoint (e.g. Vite dev) still lands on login.
- **Verify.** In-browser: button renders expanded + collapsed; real click → landed on `/login.html`
  ("Enter the access password to continue"). Gate green (`npm run check` 21/21, `npm run build` OK).
  Deploy `dpl_DX67Lmua…` for `9878e90` READY, aliased to ds.financeos.au; live curl: root → 302
  /login.html, /login.html → 200.
- Prior prod deploys this session confirmed READY: `f7bbbf6` (three DS changes) and `9029364` (memory).

## 2026-11-15 — Dashboard hover + memoji, grey exhibit headers, Overview → Foundations (shipped + pushed, f7bbbf6)

Three changes, all verified in the running app (desktop + mobile, real-cursor), gate green
(`npm run check` 21/21, `npm run build` OK, `docs:components` no-op), committed + pushed to `main`.

- **Video Explainer dashboard.** Ported the brand's hover interaction from the reference checkout
  (`financeos-brand-positioning` `assets/app.js` + `src/app.css`): a **cursor-follow parallax tilt**
  on the flip card — `FT 10` (±5°), 180ms follow (`is-following`), settles to the rest tilt
  (rotateX 3° / rotateY -6°) on `pointerleave`, mouse-only, off while flipped and **flat ≤600px**.
  Rebuilt `FlipCard` with framer-motion **motion values + imperative `animate()`** so the 700ms
  ease-out flip is preserved exactly and the follow retargets without React re-renders. Fixed the
  **memoji "Champ Carter"** clipping — the 500×500 art sat edge-to-edge in the 150px / 8px box, so the
  squircle cut the hair/beard; now `padding 14 + object-contain + a tokenised halo`
  (`radial --c-accent-soft over --c-canvas-muted`) so it floats with breathing room (DS 8px squircle
  kept, not the brand's 34px).
- **Reuse.** `BrandDashboard` was already token-only; added it as the **lead "My Account workspace"
  exhibit in Dashboard Layouts** (own inspector), keeping the flip in Video Explainer. Same asset,
  two homes.
- **Grey exhibit headers (global).** The shared `Demo` frame header (`Section.tsx`) was `bg-surface`
  = pure white `#FFF` (white-on-white). Now **`bg-selected` `#EDEFF2` + `text-fg-muted` medium** label
  — one change, every exhibit box across all 36 sections reads as a grey specimen-drawer strip.
- **IA.** **Overview moved from Start into Foundations** as its opening section. The page skips the
  divider before the first group, so Start (Hero + Video + Overview) had Overview bleeding into the
  FOUNDATIONS divider. Now Start = Hero + Video; FOUNDATIONS opens with Overview → Tokens. Section
  numbers are nav-index-driven, unchanged (Video 01 · Overview 02 · Tokens 03).
- **Verify.** Real-cursor tilt tracked left −4.5° / right +4.5° / top +4.5° / bottom −4.5°, returned
  to rest (3°, −6°) on leave, disabled while flipped, flat on mobile; memoji breathing room confirmed
  in both homes; grey headers on Components / Cards / Dashboards / Video; the FOUNDATIONS divider now
  sits between Video and Overview. No console errors. (A synthetic `pointerleave` didn't reach React's
  delegated listener — a test artifact; the real cursor returns to rest fine.)

## 2026-11-14 — WebP conversion + both Codex handoff amendments (verified; awaiting Tumai's push)

Three pieces, all verified in the running app (desktop + mobile), gate green (`npm run check` 21/21,
`npm run build` OK, `docs:components` no-op).

- **Library images → WebP.** The 33 shoot photos were JPEG (the old `sips` can't encode webp). Used
  **Pillow 11.3.0** (q82, method 6): 5.18 MB → **1.51 MB (71% smaller)**. Removed the JPEGs, rewired
  `libraryImageSrc` + the download filename + doc comments to `.webp`. All 33 serve 200, no console
  errors, crisp. (cwebp/ImageMagick/sharp/vips still absent; ffmpeg present but Pillow was cleaner.)
- **Amendment 1 — Video Explainer parity** (`promo-video-handoff-2026-11-14.md`). Reference checkout
  at `scratchpad/bp` @ f590c34. Gaps closed vs the reference flipwrap: the watch control now sits
  **below** the card (was above); relabelled **"Watch the demo video" / "Back to the dashboard"**;
  the card rests at the reference **3D tilt (rotateX 3° / rotateY -6°, flat ≤600px)**, perspective
  1600; the player **focuses on flip**. Already-correct and kept: 700ms+EASE_OUT flip, plays-on-flip
  + muted-retry, pause-on-return, BrandDashboard composition, sample-data caption + disclosure,
  reduced-motion cross-fade. FlipCard is VideoSection-only, so the tilt is scoped safely.
- **Amendment 2 — Brand Positioning scroll motion** (`scroll-motion-handoff-2026-11-14.md`, ref
  @ f590c34). Restored the **background colour rhythm** removed in `ba27c3b`: a fixed `.bg-stage`
  cross-fades white ↔ `--c-warm #E8EDF7` over **750ms**; `Shell` sets `<html data-bg>` to the section
  owning the viewport centre (`rootMargin -45%/-45%`), warming **every ~3rd section** (matches the
  brand's `bgOf 02/05/08`). **Grid stays retired** (colour only). Aligned the reveal vocabulary to the
  reference: `FadeIn`/`Stagger` rise **10px → 12px** (duration 0.4s = 400ms and `EASE_OUT`
  [.22,1,.36,1] already matched; 70ms stagger already matched). Verified the rhythm with
  `scrollIntoView` centre-tests: **0 mismatches** over 11 sections. Reconciled CLAUDE.md (the
  "pure-white / no scroll-rhythm / do not reintroduce" rule now documents the restored colour wash;
  grid ban kept).
- **Gotcha:** a synthetic `window.scrollTo` sweep read the rhythm as "all warm / 0 transitions" — a
  **test artifact** of `scroll-behavior: smooth` + instant jumps racing the IntersectionObserver, not
  a bug. `scrollIntoView({block:'center'})` with a settle gave the true (correct) reading.

## 2026-11-12 — Energize Phase 1: 6 new sections via Ultra Code (`e046712`)

Ran an Ultra Code workflow (14 agents: 6 build + 6 make-interfaces review + 2 refine) to build
Tokens, Icons, Calculators, Dashboards, Client Emails, Email Signature — governed by
`docs/ENERGIZE-PLAN.md` with CLAUDE.md as ground truth. Agents wrote only their own files;
integration (nav + App wiring, auto-numbering → 34 sections, distinct icons, a SegmentedControl
`transition-all` fix, generator auto-discovery) done centrally. Verified: build green, check 21/21,
console clean, playwright screenshots on-brand (blue-primary, amber-status, no ribbons, 8px, real
logos). Also fixed the two sweep flags (video placeholder, ONESTAAACK A.I PTY LTD sender).
Highlights: Tokens shows the 3-layer resolution + compile guardrail; Dashboards ships a tokenised
bar/line/donut chart kit; Calculators compute live (repayment $4,399/mo on the sample inputs).

## 2026-11-12 — Handoff hardening (13-item audit) + docs

Shipped and pushed to `main` (through `6788425`), build green, `npm run check` 21/21:

- Purged the last gold (favicon + warm-up email → Atlas Blue); deleted two fabricated favicon
  placeholders (incl. a gold one) — the real square logo is the favicon.
- Regrouped the menu → Start · Foundations · Components · Patterns · Templates · Tools.
- Section numbers now derive from nav order (self-healing 01→27, no gaps); stripped legacy
  hardcoded eyebrows; fixed Warm-up's stale "Applied" eyebrow.
- Removed two dead hero chips → one live "run a client audit"; removed a hardcoded hex in
  celebration-button.
- Redesigned the inspector as a single pop-up box (tabbed Explain/Tokens/Code + Download).
- Split vendor chunks: entry JS 631KB → 314KB (react-vendor / motion / icons). React dedupe
  verified intact at runtime.
- Added ESLint + Prettier + `test`/`check` scripts. `npm run lint` passes.
- Docs pass: rewrote README, added CONTRIBUTING, generated `docs/COMPONENTS.md`
  (`npm run docs:components`), filled + git-tracked `memory/`, fixed HANDOVER's stale amber.

Open: the 6 new sections (Ultra Code), the a11y sweep (deferred), and a maturity sweep later.
Known: `/media/overview.mp4` + poster 404 locally — confirm prod has them or they're external.
