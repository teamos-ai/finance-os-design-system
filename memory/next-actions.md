# Next Actions

<!-- Read this FIRST to pick up where you left off. Keep it to the current focus + next step. -->

- **Focus:** Information-architecture restructure DONE (nav + page). The showcase is now four
  top-level groups — **Start · Foundations · Components · Library** — with Library nested into
  browsable categories. The page is rendered data-driven from `SHOWCASE_NAV` (see `App.tsx`), so the
  sidebar and page order always match, with group/category/Comparisons dividers on the page.

- **PUSH IS BLOCKED FOR CLAUDE** (auto-mode classifier) — Tumai runs every `git push origin main`.
  Currently **1 commit ahead of origin** (the restructure). Earlier brand-alignment + bundle + a11y
  commits are already pushed and live (gate active).

- **Done this pass (2026-11-13), committed, unpushed:**
  - New `nav.ts` model `{ group, category?, subcategory? }`; `Shell.tsx` renders the 3-level nesting
    (group → category → Comparisons), icon-only when collapsed; scroll-rhythm bg keyed by category.
  - `App.tsx` is data-driven from the nav + auto dividers; `Section.tsx` gained `ComposedFrom`
    (assembled-design → parts cross-links, used on Dashboard Layouts, Evidence Layouts, Heroes).
  - **Relocations (former Positioning):** Positioning Hero → Website Sections › **Heroes** (Contour
    Hero); contour background also standalone as Images & Backgrounds › **Contour Map** (new),
    cross-linked both ways. Section Folders → Components. Market Evidence → Dashboards & Data Displays
    › **Evidence Layouts**. Landscape Table / From and To / This vs That → Website Sections ›
    **Comparisons**. Scroll Blue Band → Images & Backgrounds (referenced from Motion).
  - **New Components entry:** **Charts** — showcases the chart primitives (BarChart, LineChart,
    DonutChart, RingStat, RankedBarChart, SplitTrack, FillBar).
  - **New Library homes (placeholders this pass):** Quizzes (Stack Audit 5-Q flow previewed), Funnels
    (points at the site catalogue), Website Audit Forms (cross-refs /audit; flags leakage-not-found).
  - **Removals:** Positioning / Patterns / Templates / Tools groups dissolved; **Notion** and
    **Domain Warm-up** removed; **Client Audit** removed from the showcase nav (the `/audit`
    instrument + `src/audit/**` stay). Relabels aligned (Colour, Buttons & Controls, Forms & Inputs,
    Featured Sections, Dashboard Layouts, Evidence Layouts, Finance Calculators, Email Signatures).
  - Verified: build + check green (contrast 21/21); sidebar tree matches the spec exactly; page
    dividers + order match; relocated/new sections render; clean console (desktop).

- **DEFERRED — the website-assets pass (Tumai chose "structure + relocations now"):**
  - **17 missing Finance Calculators.** DS has 3 (Repayment, Borrowing Power, Stamp Duty). The site
    lists **20** (financeos.au/discover/assets/calculators): Paying it off (6), Buying (7), Comparing
    & switching (5), Property & equity (2). Each needs its AU calc logic/assumptions rebuilt. Full
    slug list captured in the 2026-11-13 web-fetch (in transcript).
  - **Stack Audit quiz** — build interactive (5 single-choice Qs captured) + the stage-scoring +
    result screen (result content wasn't visible on the site; re-fetch /quiz result or infer).
  - **Funnels** — inventory financeos.au/discover/assets/funnels and rebuild designs from DS parts.
  - **Website Audit Forms** — embeddable assessment form(s). ⚠ The named **"weekly leakage
    assessment" was NOT found on the site** (checked /audit, /assessment, assets index, nav, footer) —
    **ask Tumai for the source link** before building it.

- **ONGOING depth (Phase 2):** each relocated item has Inspectable Explain/Token/Code/Download; a
  fuller per-part token-reference table + variants + states + responsive rules could be completed
  across all items. Example content is swappable where it already reads from `src/data/**`.

- **Don't forget:** `npm run check` + `npm run build` before committing; `npm run docs:components`
  after any component change. Sources in scratchpad (`brand-src`, `zip-dashboard`) are reference only.
