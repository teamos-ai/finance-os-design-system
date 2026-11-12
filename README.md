# Finance OS — Design System

A reusable, faithfully-tokenised design system for **Finance OS** (a broker-specific CRM /
operating system), delivered as a living **React + Vite showcase** that *is* the documentation.
It also hosts a working **client audit instrument** at `/audit`, used live on client calls.

- **Live:** [ds.financeos.au](https://ds.financeos.au)
- **Repo:** `teamos-ai/finance-os-design-system` · branch `main` → Vercel (production)
- **Direction:** one **Light / Clarity** theme · **Atlas Blue** (`#33488F`) is the only brand
  colour · archetype Ruler 70% + Sage 30% · voice calm, clear, grounded, authoritative — never hyped.

> **Tokens are ground truth.** Never hardcode a value a token should own. `colors` and
> `borderRadius` are *replaced* in `tailwind.config.ts`, so a stray `bg-gray-500` or
> `rounded-3xl` fails to compile — that is what enforces token-only styling and the 8px ceiling.

## Quickstart

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # tsc --noEmit + check:audit + vite build  →  dist/
```

```bash
npm run check      # the full local gate: typecheck + lint + test (audit + WCAG contrast)
```

> **Legacy share note:** the project was originally developed on the Team OS SMB share, which
> needs a space-free `subst` drive (see `CLAUDE.md` → Build environment). On a normal local
> clone you can ignore that — the commands above are all you need.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server (HMR) |
| `npm run build` | typecheck → audit-content check → production build to `dist/` |
| `npm run preview` | serve the built `dist/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` / `lint:fix` | ESLint (flat config) |
| `npm run format` / `format:check` | Prettier |
| `npm run test` | `check:audit` + `check:contrast` |
| `npm run check` | typecheck + lint + test — run before every commit |
| `npm run check:contrast` | WCAG AA over the semantic colour pairs (21/21) |
| `npm run docs:components` | regenerate `docs/COMPONENTS.md` from source |

## The two surfaces

Split in `src/main.tsx` with `react-router-dom`:

- **`/`** — the **showcase**: one long scroll, anchor-based sidebar nav. `src/lib/nav.ts` is the
  single source of truth (Start · Foundations · Components · Patterns · Templates · Tools). Add an
  entry there and render its section in `src/App.tsx`; the section number derives from nav order.
- **`/audit`** — the **client audit instrument**: a two-call diagnostic for a mortgage/finance
  brokerage, run full-screen outside the showcase chrome. **Lazy-loaded** so its question bank
  stays out of the showcase bundle. Deep links need the SPA rewrite in `vercel.json`.

## Structure

```
src/
  main.tsx              router: / (showcase) and /audit (lazy)
  App.tsx               renders one <Section/> per nav entry, in order
  lib/
    nav.ts              single source of truth for the showcase menu
    cn.ts               tailwind-merge wrapper (register custom text-{size} tokens here)
    motion.ts           Framer motion presets (FadeIn, Stagger…)
  styles/tokens.css     the 3-layer token system (see below)
  components/
    ui/                 the reusable kit (Button, Card, Badge, Input, …) — see docs/COMPONENTS.md
    brand/Logo.tsx      the ONLY logo component (uses the provided assets)
    lead-magnets/       opt-in templates + their primitives
  showcase/
    Shell.tsx           the showcase chrome (sidebar derives groups from nav order)
    Section.tsx         section frame + the Inspectable "+" pop-up
    sections/*.tsx      one file per showcase section
  audit/                the /audit instrument (code)
  data/audit/           the audit content (data) — gated by scripts/audit-check.mts
public/                 fonts, logos (logo-square*/logo-rect*), background imagery, /docs PDFs
scripts/                audit-check.mts · contrast-audit.mjs · gen-component-docs.mjs
docs/COMPONENTS.md      generated component index
```

## Token architecture (3 layers)

`primitive` (`--p-*`, raw brand ramps) → `semantic` (`--c-*`, intent: canvas / surface / elevated
/ fg / border / accent / state) → `component` (`--btn-*`, `--card-*`, radius, motion). Components
compose from `--c-*` only, wired through `tailwind.config.ts`.

## The rules (any change must keep these)

- **Blue-primary.** Atlas Blue `#33488F` owns *all* typographic highlight. No gold, no orange.
- **Amber is a status signal only** (`--c-amber`): overdue / awaiting / at-risk badges and ★
  ratings — used sparingly (~one amber moment per view). Never on type, never a CTA, never a ribbon.
- **No ribbons.** No accent side-rails, left-edge strips, corner banners or edge-clipped tags.
  Emphasis comes from elevation, a full border, scale, or a centred top badge only.
- **8px-max squircles** (radius scale 2/4/6/8 — no pills, no full rounds). No glassmorphism.
- **Neutral focus rings** (`--c-ring`), never the accent.
- **Logos: the provided assets only** — `/logo-square-blue.png` + `/logo-rect-blue.png` /
  `/logo-rect-white.png`. Never draw, recolour or fabricate a logo or favicon.
- **Fonts:** Spline Sans (display) + Anonymous Pro (body/mono), self-hosted via `@fontsource`.

## Deploy

Push to `main` → Vercel builds (Vite preset, output `dist/`) and deploys to production. Commit with
the author identity `211211395+teamos-ai@users.noreply.github.com` so Vercel accepts the deploy.

## Where to go next

- **[CONTRIBUTING.md](CONTRIBUTING.md)** — how to add a section or component and keep the docs in sync.
- **[docs/COMPONENTS.md](docs/COMPONENTS.md)** — the generated component index.
- **[CLAUDE.md](CLAUDE.md)** — the full project constitution (brand, tokens, gotchas) for AI agents.
- **`memory/`** — current plan, decisions, progress and next actions (read `next-actions.md` first).
