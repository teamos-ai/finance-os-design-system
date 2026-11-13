# Next Actions

<!-- Read this FIRST to pick up where you left off. Keep it to the current focus + next step. -->

- **Focus:** Brand-alignment pass is done and **PUSHED** — Tumai ran `git push origin main`
  2026-11-13 (`9d8ab7e..7113bce`); Vercel auto-deploys prod. The DS access gate is **ACTIVE**
  (env `PORTAL_SESSION_SECRET` + `PORTAL_PASSWORD` set; ds.financeos.au → login; "Password works"),
  and it inherits across deploys, so the real positioning data is safely gated.

- **PUSH IS BLOCKED FOR CLAUDE** by the auto-mode classifier ("Unsanctioned Communication") — Tumai
  runs every `git push` himself (or adds a Bash allow-rule / leaves auto mode to let Claude push).

- **NEXT — after a deploy, confirm the gate still holds:** ds.financeos.au should 302 → /login.html
  (not 200). Gate inherits env vars across deploys, so it should stay active; just sanity-check.

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
