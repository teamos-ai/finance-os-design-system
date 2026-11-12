# Next Actions

<!-- Read this FIRST to pick up where you left off. Keep it to the current focus + next step. -->

- **Focus:** finishing the handoff-hardening pass, then the 6 new sections under Ultra Code.

- **Waiting on Tumai:** enable **Ultra Code** → then build the 6 new sections in parallel (like the
  prior 7-section build): **Tokens, Icons, Calculators, Dashboards, Emails, Signature**. Calculators
  extracts/expands the existing Lead Magnets interactive calculator — don't duplicate. Keep all
  current sections. Each slots into `nav.ts` (auto-numbers) + renders in `App.tsx` + gets an
  `inspect` payload + a row in `docs/COMPONENTS.md` where relevant.

- **Next (no Ultra Code needed):**
  1. Maturity sweep (item 13): confirm the `/media/overview.*` 404s (prod vs external); scan for
     other stale copy/assets. Note a second deeper sweep for when the library matures.
  2. a11y / alt-text sweep (item 10) — **deferred to the very end** per Tumai.

- **Don't forget:** run `npm run check` + `npm run build` before committing; `npm run docs:components`
  after any component change; push `main` → Vercel deploys production.
