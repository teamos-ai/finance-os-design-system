# Progress Log

<!-- What was done, errors hit, tests run, results. Newest on top. Date each entry (YYYY-MM-DD). -->

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
