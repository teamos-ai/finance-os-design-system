# Findings

<!-- Research, prior art, constraints, gotchas. Newest on top. Date each entry (YYYY-MM-DD). -->

- **2026-11-12 — Health OS DS v2 comparison.** `teamos-ai/health-os-design-system-v2` has 33
  sections. Gaps worth filling for a broker DS (not duplicates): Tokens, Icons, Calculators,
  Dashboards, Emails, Signature. Duplicates we already cover: Blocks/Elements (Components),
  Stories (Social), LivePage (Demos), Headlines (Typography). Skipped: Music.
- **2026-11-12 — Binary assets evade text greps.** The gold `favicon.png` survived a text-only
  `rg gold|eeba2b` sweep because it's a PNG. Check images/manifests separately when purging a colour.
- **2026-11-12 — Lint is clean.** ESLint 9 flat config: 0 errors, 8 warnings (all the standard cva
  variant-export / react-refresh pattern — benign). `npm run lint` exits 0.
- **2026-11-12 — Prettier would reformat 87 files.** The code is consistent but predates Prettier
  and uses hand-aligned token comments; left unformatted on purpose (see decisions.md).
- **Gotcha — React dedupe vs preserveSymlinks.** `vite.config.ts` keeps `preserveSymlinks` (SMB
  share), which defeats auto React-deduping. `resolve.dedupe` + `optimizeDeps.include` pin one
  instance; `manualChunks` keeps react/react-dom/react-router in ONE chunk. Clear
  `node_modules/.vite` after adding a React-importing dep.
- **Gotcha — `cn.ts` font-size group.** Custom `text-{size}` tokens must be registered in
  tailwind-merge's font-size group or `cn()` drops real colour classes.
