# Next Actions

<!-- Read this FIRST to pick up where you left off. Keep it to the current focus + next step. -->

- **Focus:** Brand-alignment pass is done. The DS access gate is **ACTIVE** (ds.financeos.au →
  302 /login.html; wrong password → 401; Tumai confirmed "Password works"), so the real positioning
  data is safe to ship. Everything is **committed locally, 6 commits ahead of `origin/main`, NOT
  pushed** — `git push` is blocked for Claude by the auto-mode classifier, so **Tumai runs the push.**

- **NEXT — Tumai pushes** (gate is active, so this is safe):
  ```
  git push origin main
  ```
  Then re-verify ds.financeos.au still gates after the Vercel deploy.

- **Done (2026-11-13) — the 5-part brand-alignment request, all committed:**
  1. White reset + 2. scroll rhythm (fixed `.bg-stage`: white ↔ grey-blue `--c-warm` ↔ blue grid
     paper, driven by `Shell.tsx` IO on nav group) + 5. Spline Sans body (Anonymous Pro → mono only).
     → `d82ce5d`
  3. Promo Video is now the **flip dashboard** (front = PlatformAppShell, back = demo video, plays
     on flip); removed the duplicate PlatformDashboardSection. → `4aefda5`
  4. **Market Evidence** section (Positioning group, after Section Folders) — ports brand §02 graph
     vocabulary: new reusable primitives `RingStat`, `RankedBarChart`, `SplitTrack` in
     `components/dashboards/charts.tsx`; stat tiles w/ `unverified` flags; AU keyword data table;
     source/method disclosures. Real AXL/MFAA figures added to `positioning.ts` (`marketEvidence`),
     every figure reported-not-verified — admissible because the DS is now gated like the brand page.
     `CountUp` gained an opt-in `group` prop (thousands). → `d0656a2`
  - Verified desktop + mobile; build + check green (contrast 21/21); docs regenerated (45 rows/12
    families). 42 sections total now.

- **Optional next (flag, don't assume):**
  - **Widgets premium-reveal consistency:** `WidgetsSection.tsx` still renders its ring/bars/figures
    STATICALLY (no count-up / fill reveal). Could reuse `RingStat` + `CountUp` + in-view fills so the
    DS's own graph showcase loads as premium as Market Evidence. Touches stable code — ask first.
  - **Bundle:** main `index` chunk is ~500 kB (135 kB gzip), just over Vite's soft warning; audit is
    already split. Only act if it matters.
  - **a11y / alt-text sweep** — Tumai deferred this to the very end.

- **Don't forget:** `npm run check` + `npm run build` before committing; `npm run docs:components`
  after any component change; push `main` → Vercel deploys production. Sources in scratchpad
  (`brand-src`, `zip-dashboard`) are reference only, not in the repo.
