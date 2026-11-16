# Decisions

<!-- Architecture / strategy calls + the reason behind each, so we don't re-litigate them.
     Date each entry (YYYY-MM-DD). -->

- **2026-11-16 — The glass folder is admitted as an illustrated OBJECT, not a UI surface.** Tumai pasted a
  glassmorphism "folder cards" component into a system whose hard rule is "no glass". Resolved it the way the
  system already handles tensions (amber = status-only, FloatWobble = the one idle loop): the folder is an
  *object/illustration* (owns its geometry like the logo), and its frosted front is the folder's **material** —
  kept but **near-opaque** so it reads solid even with backdrop-filter unavailable. Glass never touches real UI
  chrome (key = solid Atlas-Blue squircle, menu = solid popover). Flagged to Tumai with a one-line flip to fully
  opaque if he wants "no glass" held strictly. Rejected both extremes (paste verbatim = breaks 5 rules; strip
  the frost = loses what makes it a folder).
- **2026-11-16 — Folder back-panel art = the BLUE marble/streak engine (the onestaaack tools look), clouds as
  a second option.** REVERSES an earlier same-day call. First pass dropped the paste's marble engine (its
  presets were orange/red/plum = off-brand) and used the halftone clouds instead. Then Tumai pointed to his
  live folders (tools.onestaaack.ai · `teamos-ai/dictionary-finovate-v2` · `GlassFolder` + `Overview`) — the
  SAME engine, but driven by BLUE recipes that are literally the Atlas Blue ramp (`#33488f`=--p-blue-400,
  `#5c6da5`=-300, `#1f2b56`=-500 …). So the marble was only ever off-brand because of the *colours*. Restored
  the engine as `src/components/brand/folder-art.ts` with those exact blue recipes (`atlas`/`azure` marble ·
  `tide`/`mist`/`slate` streak); **`art="atlas"` is the default** (matches the tools), **`art="clouds"` stays**
  as the animated motion signature. Also adopted their **`· +N` meta** (the overflow count, drawn in
  `--c-accent-text`). The marble paints a STILL image (via a shared frame-sliced painter queue) — calmer and
  cheaper at rest than the drifting clouds. Lesson: look at the owner's real reference before deciding a motif
  is "off-brand".
- **2026-11-16 — Engine in a pure `.ts`, the canvas component inside `Folder.tsx`.** Keeping `ArtCanvas`
  beside the engine in one `.tsx` tripped `react-refresh/only-export-components` (8→12 warnings). Split: the
  pure engine is `folder-art.ts` (no React, no component export → no warning), and `ArtCanvas` is an internal
  (non-exported) component in `Folder.tsx`, its only consumer. Back to 8 warnings.
- **2026-11-16 — Download = a folder, not a button, where Tumai asked ("instead of a button").** Built
  `DownloadFolder` (press → opens + fans the contents as a preview → press again → saves) and used it to replace
  the plain download buttons on Icons (both packs) and Motion (the skill). Centered / floating / minimal per the
  brief; the label spells the second press out so the two-step gesture is never a guess. The base `Folder` keeps
  `action="add" | "more" | "download" | "none"` so the object stays general (storage / templates / docs too).
- **2026-11-16 — Folders live in Library › Images & Backgrounds.** It's a generated-art visual-object asset, so
  it sits with Image Library / Scrollers / Scroll Blue Band rather than in Components (atomic UI parts). Easy to
  move if Tumai wants a dedicated "Files" category later.

- **2026-11-15 — Every specimen names its token inline (`<TokenTag>` / `<ComposedFrom>`), enforced.**
  Tumai's goal: the showcase must be referenceable by eye AND by an AI agent via tokens. The "+"
  inspector hid tokens behind a click, so `<TokenTag>` surfaces them inline + emits `data-token` for
  machine reads. `scripts/token-coverage.mjs` gates it in `npm run check`. Chose a **static check with
  a documented 9-section EXEMPT allowlist** (sections that self-document another way) over a perfect
  per-specimen crawl — honest and cheap; a Playwright DOM sweep is the deeper option, deferred.
- **2026-11-15 — Charts' inline `<p>` labels → `<TokenTag>`.** Charts already named its primitives
  inline but as plain text (no copy, no `data-token`). Unified to TokenTag so the whole system uses one
  mechanism and the coverage guard counts them, rather than exempting Charts.
- **2026-11-15 — "Totally premium" stays in the Light brand (confirmed with Tumai).** His references
  were dark / high-contrast; the constitution is single Light/Clarity. Asked, he chose Light → kept
  white + Atlas Blue and translated the refs' ENERGY (depth, parallax, density) via gradient-accent +
  `<Glow>` + layered shadow + a cursor-tilt `<TiltCard>` — never their palette. No dark tokens added.
- **2026-11-15 — Overview = floating sphere + ONE merged bento.** Removed the sphere's container box
  and both bento headers; fused `GlanceBento` + `FeatureBento` into `SystemBento` so it reads as one
  board (Tumai's ask). Reusable assets catalogued in their own homes: CardSphere → a **new "Card
  Sphere" library section** (he chose a dedicated section over an exhibit-in-Heroes); the bento → "The
  tilt bento" in Bento Box. Trade-off accepted: sphere/bento now render in two places each (minor extra
  animation on a showcase; lazy-pause later if perf ever matters).
- **2026-11-15 — Don't edit a file a running subagent owns.** Fanning the annotation sweep out to
  parallel subagents was fast, but editing `MarketEvidenceSection` mid-flight raced its edits into a
  broken `<div>` balance. Rule: wait for the agent to finish, then reconcile from the final state.

- **2026-11-15 — Exhibit-box headers are a grey band (`bg-selected` #EDEFF2).** The shared `Demo`
  frame header (`Section.tsx`) was `bg-surface` = pure white, so it read white-on-white. Chose the
  system's cool neutral grey over the fainter `--c-inset` (#F6F7F9) so Tumai's "make it grey" rule is
  unmistakable; label bumped to `text-fg-muted` + medium for legibility. One change governs all 36
  sections. Dial to `bg-inset` if a subtler band is wanted.
- **2026-11-15 — Hover tilt lives in `FlipCard`, ported 1:1 from the brand reference.** Cursor-follow
  parallax (FT 10 → ±5°, 180ms follow, rest on leave, mouse-only) matches brand.financeos.au exactly.
  framer-motion motion values + imperative `animate()` so the 700ms ease-out flip is preserved and the
  follow retargets without re-renders; reduced-motion / flat (≤600px) safe.
- **2026-11-15 — Memoji fix = breathing room, not a zoom.** `object-contain` + padding + a tokenised
  halo, keeping the DS 8px squircle (not the brand's 34px radius), so the full memoji shows with margin.
- **2026-11-15 — Overview joins Foundations (don't merge the two groups).** Overview is foundational
  content, and the page skips the divider before the first group, so it bled into FOUNDATIONS. Moving
  it to open Foundations fixes the bleed while keeping Start a tight 2-item front door (Hero + Video).
  A full Start+Foundations merge was the alternative; rejected — Hero/Video aren't "Foundations".
- **2026-11-15 — "Move dashboard to Dashboard Layouts" = add, not relocate.** Removing `BrandDashboard`
  from Video Explainer would break the dashboard→video flip, so it is featured in both: the flip in
  Video Explainer, a static lead exhibit in Dashboard Layouts.

- **2026-11-14 — Scroll-rhythm COLOUR is back; the grid is NOT.** The confirmed Amendment 2 handoff
  supersedes the 2026-11-13 "pure white everywhere" rule: the fixed `.bg-stage` cross-fades white ↔
  `--c-warm #E8EDF7` (750ms) on every ~3rd section, mirroring brand.financeos.au. The blue **grid
  paper stays retired** — the handoff scoped it out and CLAUDE.md bans it most emphatically. CLAUDE.md
  was updated so the constitution stops contradicting the shipped feature.
- **2026-11-14 — Reveal rhythm = align, don't blanket-wrap.** The handoff cautions against animating
  entire sections uniformly, and the DS already reveals every section header + 15 sections' content
  with the reference easing/duration. So we only nudged the rise 10px → 12px (reference value); no new
  section-level wrappers. Keeps motion calm and avoids double-animation.
- **2026-11-14 — Library images are WebP, matching the backgrounds.** Converted with Pillow (no
  cwebp/ImageMagick on this host); JPEGs removed, not kept as fallbacks — the site is gated and every
  target browser supports webp, so dual files would just add weight.
- **2026-11-14 — The reference 3D flip tilt lives in FlipCard directly.** FlipCard is VideoSection-only,
  so baking the rest tilt (rotateX 3° / rotateY -6°, flat ≤600px) in is safe and avoids a new prop.

- **2026-11-12 — Blue is the only brand colour; amber is a status signal only.** All typographic
  highlight is Atlas Blue. Amber (`--c-amber`) marks attention/pending state (overdue, awaiting,
  at-risk) and ★ ratings, used sparingly — never on type, never a CTA, never a ribbon.
- **2026-11-12 — Gold is fully removed.** No `--p-gold-*`, no gold in the favicon or the warm-up
  email. (A leftover gold `favicon.png` was found and deleted.)
- **2026-11-12 — Logos are the provided assets only.** Never draw, recolour or fabricate a logo or
  favicon. Square → `/logo-square-blue.png`; rect → `/logo-rect-blue.png` / `/logo-rect-white.png`.
- **2026-11-12 — Menu IA = Start · Foundations · Components · Patterns · Templates · Tools.** The
  `/audit` tool lives in its own "Tools" group. Section numbers derive from `nav.ts` order.
- **2026-11-12 — Inspector is a single pop-up box** (small ghost `+` → tabbed card), not a
  speed-dial. Fixed the old full-round radius violation.
- **2026-11-12 — Add exactly 6 new sections** (Tokens, Icons, Calculators, Dashboards, Emails,
  Signature), built **under Ultra Code** in parallel. Keep all existing sections. Reference set:
  Health OS DS v2.
- **2026-11-12 — Prettier is configured but not force-applied.** An 87-file reformat was left for
  the team / the Ultra Code pass to avoid burying real diffs and un-aligning intentional comments.
- **(historical) — One Light theme only.** No dark/paper themes, no theme toggle. Matches
  financeos.au. See `HANDOVER.md` for the migration history.

## 2026-11-16 — Motion direction and stack
- **Motion personality = calm precision + ONE signature flourish** (Tumai's choice). Flourish = **Atlas Blue
  halftone clouds** (from the Pinterest board's dithered-cloud pins). Why: keeps the Ruler/Sage voice while
  giving the brand one ownable visual; built as code so it can never go off-palette.
- **Stack = Framer Motion/CSS for UI + HyperFrames for film.** Why: no new runtime in the app, HTML we already
  write, deterministic renders. Remotion (second renderer + licence), Blender MCP, physics, mascots and style
  prompt packs rejected; three.js / librosa / Tegaki deferred until a concrete need.
- **Skill lives in its own private repo** (`teamos-ai/motion-finance`), linked + downloadable from the DS.
- **No white or gold logo exists.** The blue lockup is used on every surface. Why: the file named
  `logo-rect-white.png` was the retired gold lockup.
- **Tailwind token colours are alpha-aware by config**, not per-class. Why: fixes the whole class of silent
  no-op `/NN` modifiers at the root.
