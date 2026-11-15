# Decisions

<!-- Architecture / strategy calls + the reason behind each, so we don't re-litigate them.
     Date each entry (YYYY-MM-DD). -->

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
