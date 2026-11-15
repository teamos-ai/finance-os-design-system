# Decisions

<!-- Architecture / strategy calls + the reason behind each, so we don't re-litigate them.
     Date each entry (YYYY-MM-DD). -->

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
