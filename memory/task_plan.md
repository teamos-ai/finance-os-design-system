# Task Plan

<!-- Phases, goals, checklists. The approved Blueprint lives here before building starts. -->

## Blueprint

- **North Star:** a faithfully-tokenised, professional-handoff-ready design system + living
  showcase for Finance OS, that an external build team can build the production website from.
- **Integrations:** GitHub (`teamos-ai/finance-os-design-system`, source of truth) · Vercel
  (deploys `main` → ds.financeos.au). No runtime integrations.
- **Source of truth:** `src/styles/tokens.css` (tokens) + `src/lib/nav.ts` (showcase menu). The
  showcase site *is* the documentation.
- **Delivery payload:** the deployed showcase at ds.financeos.au + the working `/audit` tool, plus
  README / CONTRIBUTING / docs for the handoff.
- **Behavioural rules:** the brand contract in CLAUDE.md — Atlas Blue only (amber = status), no
  ribbons, 8px-max radius, no glassmorphism, neutral focus rings, provided logos only. Tokens are
  ground truth. Verify (build + screenshot) before calling anything done.

## Phases

- [x] Build the showcase, 3-layer token system, and 28 sections (incl. the `/audit` instrument).
- [~] **Handoff hardening** (13-item audit) — 9/13 shipped + pushed; docs pass in progress.
- [ ] **6 new sections** — Tokens, Icons, Calculators, Dashboards, Emails, Signature — built in
      parallel **under Ultra Code** (waiting on Tumai to enable it).
- [ ] a11y / alt-text sweep (deferred to the very end, per Tumai).
- [ ] Second maturity sweep once the library matures.
- [ ] Hand to the professional build team.
