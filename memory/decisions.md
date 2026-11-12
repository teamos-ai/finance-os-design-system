# Decisions

<!-- Architecture / strategy calls + the reason behind each, so we don't re-litigate them.
     Date each entry (YYYY-MM-DD). -->

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
