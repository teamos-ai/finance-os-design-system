# Next Actions

<!-- Read this FIRST to pick up where you left off. Keep it to the current focus + next step. -->

- **Focus:** Three big pieces are DONE — the information-architecture restructure, the website-assets
  pass, and a **hero + brand polish** (2026-11-13): flat **pure-white background** (scroll-rhythm + grid
  removed — do NOT reintroduce the grid), hero headline matched to financeos.au on a new `display-3xl`
  token ("Your shortcut to our design system") with a new subtitle, the top-of-page ticker banner
  removed, the hero OS mark floats + gently wobbles (`FloatWobble`), a downloadable **animated-Lucide
  pack** at `public/packs/animated-lucide-icons.zip` surfaced on the Icons section, and **10 sidebar
  icons re-picked** (Rocket · Blocks · Layers2 · Gem · Shapes · ToggleLeft · Crown · Table2 ·
  SquareSplitHorizontal · Smartphone). The showcase is four groups — **Start · Foundations · Components ·
  Library** — rendered data-driven from `SHOWCASE_NAV` (`App.tsx`), so the sidebar and page order always
  match (group / category / Comparisons dividers on the page). The DS is login-gated (ds.financeos.au).

- **PUSH IS BLOCKED FOR CLAUDE** (auto-mode classifier → "Unsanctioned Communication"). **Tumai runs
  every `git push origin main`.** Hand him the push and say how many commits are ahead.

- **DONE — IA restructure:** `nav.ts` model `{ group, category?, subcategory? }`; `Shell.tsx` renders
  3-level nesting; `App.tsx` data-driven from nav + auto dividers; `Section.tsx` `ComposedFrom`
  cross-links. Relocated the 7 former-Positioning designs (Hero→Website Sections›Heroes + standalone
  Contour Map; Section Folders→Components; Market Evidence→Dashboards & Data Displays›Evidence Layouts;
  Landscape/From-and-To/This-vs-That→Website Sections›Comparisons; Scroll Blue→Images & Backgrounds).
  New Charts entry. Removed Notion, Domain Warm-up, Client-Audit nav entry (the `/audit` instrument
  stays). Relabels aligned.

- **DONE — website-assets pass:**
  - **Calculators 20/20**, grouped as the site groups them, validated against the live figures (mostly
    to the dollar; Refinance/Compare within ~$4 as the site's default rates are undisclosed). Engine +
    helpers in `finance.ts`: `amortise`, `balanceAfter`, `interestOverPeriods`, `totalInterest`,
    `durationLabel`, `pct2`; stamp duty **6 states** (NSW/VIC/QLD refreshed + WA/SA/TAS added),
    `firstHomeDuty`, `FHG_CAPS`, `lmiPremium` (indicative band). Shared `CalcLayout`
    (`CalcShell`/`ResultHeadline`/`MetricRow`/`CompareBars`). Validation scripts in scratchpad
    (`verify-calc.mjs`, `verify2.mjs`, `verify3.mjs`). **Shared calc defaults: $600k · 6.25% · 30yr ·
    3% buffer.**
  - **Quiz:** reusable `components/quizzes/QuizRunner.tsx` + the Stack Audit (5 Qs verbatim; DS's own
    4 stages + scoring, since the site's result logic isn't published).
  - **Funnels:** `FunnelsSection` = catalogue of the site's 10 funnel types (flow + "built from"
    cross-links); faithful, since the site says they're brand-configured, not self-serve templates.

- **REMAINING (small / needs input):**
  - **Website Audit Forms** is still a placeholder cross-referencing the live `/audit` instrument. The
    named **"weekly leakage assessment" is NOT on the site** → **ask Tumai for a source** before building.
  - **Stamp duty ACT & NT** not included (ACT page 403; NT uses an unusual quadratic formula). Source
    their brackets to reach all 8 states, then add to `DUTY`/`STATES`/`FHB_DUTY`/`FHG_CAPS`.
  - Optional depth: fuller per-item token-reference tables / variants / states across Library items.

- **Don't forget:** `npm run check` + `npm run build` before committing; `npm run docs:components`
  after any component change. Scratchpad `brand-src` / `zip-dashboard` are reference only, not in repo.
