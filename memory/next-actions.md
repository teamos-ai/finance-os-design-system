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

- **Also done (2026-11-13), committed, NOT yet pushed (2 commits ahead of origin):**
  - **Widgets premium-reveal** — `WidgetsSection` now counts up / fills / sweeps on scroll via shared
    `RingStat` + new `FillBar` + `CountUp` (+ `RingStat` `figureClass` prop). → `7113bce` (pushed)
  - **Bundle split** — `vite.config.ts` `manualChunks` now peels `ds-core` (ui+lib) + `feat-*` chunks;
    entry 500 → 291 kB, no >500 kB chunk, warning gone. React kept in ONE chunk; `ds-core` is a shared
    leaf so no circular chunk deps. Verified against `vite preview`: home + /audit clean console. → `600c20c`
  - **a11y screen-reader pass** — labelled the last unlabelled inputs (audit TableField cells,
    Short/Long/Numeric fields via `question.prompt`, SidePanel notes), named the collapsed Shell GitHub
    link, fixed a TokensSection h2→h4 skip (→h3). Rest of the codebase was already clean. → `8325c0f`

- **NEXT — Tumai pushes** (2 commits: `600c20c` bundle, `8325c0f` a11y):
  ```
  git push origin main
  ```

- **Intentionally LEFT (minor, debatable a11y heading-ranks — don't "fix" without a reason):** the audit
  Start screen h1→h3 (group labels are `MonoLabel` spans by design), PlatformDashboard mock heading
  inversions, lead-magnet template heading inconsistency. Promoting `MonoLabel` to headings is shared-
  component churn for a judgment-call gain.

- **Don't forget:** `npm run check` + `npm run build` before committing; `npm run docs:components`
  after any component change; push `main` → Vercel deploys production. Sources in scratchpad
  (`brand-src`, `zip-dashboard`) are reference only, not in the repo.
