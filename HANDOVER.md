# Finance OS Design System — Handover

A reusable, faithfully-tokenized design system for **Finance OS** (a broker operating system /
CRM), delivered as a living **showcase / reference site** that *is* the documentation — plus a
working client audit instrument at `/audit`.

- **Repo:** `teamos-ai/finance-os-design-system` (private) · branch `main`
- **Direction:** one **Light / Clarity** theme, **Atlas Blue only** · Archetype Ruler 70% +
  Sage 30% · voice calm, clear, grounded, authoritative
- **Modeled on:** the Health OS v2 design system (structure/UI), reskinned to Finance OS
- **Ship:** push to `main` → Vercel (Vite preset, output `dist`)

> **The brand direction changed, and older notes did not.** This system was built as dark-mode
> luxury with Signal Gold and Momentum Amber across three themes. It is now a **single light
> theme with no gold, no amber and no orange**, matched to financeos.au — see `bc4297a` (theme
> unification) and `ec1384f` (blue-only migration). There is no theme toggle, no
> `src/lib/theme.tsx` and no `[data-theme]` block in `tokens.css`. **If a document disagrees with
> the code, the code wins.**

## Stack
React 18 · Vite 6 · TypeScript (strict) · Tailwind CSS 3 · Framer Motion 11 · react-router-dom 6 ·
lucide-react · class-variance-authority · self-hosted fonts (@fontsource: Spline Sans +
Anonymous Pro).

## Run
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc --noEmit && check:audit && vite build
npm run check:audit
node scripts/contrast-audit.mjs
```

On the Team OS network share the toolchain needs a space-free `subst` drive (`cmd.exe` can't use
a UNC working dir, esbuild can't resolve paths with spaces), which is why `vite.config.ts` keeps
`usePolling` and `preserveSymlinks`:
```powershell
subst Q: "W:\3-Finance OS\01 Marketing - Finance OS"   # once per session
cd Q:\finance-os-design-system                          # then npm.cmd ... from PowerShell
```

**`preserveSymlinks` defeats Vite's React deduping.** Adding a dependency that imports React can
pre-bundle a second React copy and throw `Invalid hook call` at runtime — this happened when the
router was added. `vite.config.ts` pins `resolve.dedupe: ['react','react-dom']` plus an
`optimizeDeps.include`. Clear `node_modules/.vite` after touching either.

## Token architecture (three layers)
`src/styles/tokens.css`:
- **primitive** `--p-*` — Atlas Blue ramp (`50`–`500`), neutrals, and two functional state hues
  (green, red). **No gold, amber or orange ramp exists.**
- **semantic** `--c-*` — intent (canvas/surface/elevated/fg/border/accent/state), on `:root`.
  One theme, so there is no per-theme override layer.
- **component** — `--btn-*`, `--card-*`, `--input-*`, radius (2/4/6/8 only), motion, plus fixed
  inverse / danger-solid / banner surfaces.

Wired through `tailwind.config.ts`, where **colours and radius are replaced, not extended**, so
token-only and the 8px squircle ceiling are compile-time guarantees. `cn()` (`src/lib/cn.ts`)
extends tailwind-merge's font-size group so custom `text-{size}` tokens never drop text colours.

## Routes
| Route | What it is |
|---|---|
| `/` | The showcase — one long scroll, anchor sidebar nav, 21 sections |
| `/audit` | The client audit instrument — full screen, no showcase chrome, lazy-loaded |

`vercel.json` carries the SPA rewrite so `/audit` works on a cold load.

## File map
```
src/
  lib/        cn · utils · motion (Framer presets) · accents · nav
  data/       system.ts (brand copy) · warmup.ts
  data/audit/ build-spec.ts (the benchmark + AUDIT_SHAPE) · index.ts · modules/*.ts
  components/
    brand/    Logo (+ LogoMark)
    ui/       badge banner button card celebration-button command-bar command-chip counters
              disclosure feature-card icon-button image-wash input inspectable mono-label
              pagination pdf-modal plan-card save-button segmented stat swatch tool-card
              video-player
    lead-magnets/
  showcase/   Shell (sidebar) · Section/Demo · sections/<21 sections>
  audit/      Audit (route) · AuditApp · state · flags · export · types
              fields/Field · parts/{Start,TopBar,Rail,BlockView,SidePanel,Jumper,ExportDialog}
  App.tsx     Shell wrapping the 21 sections in order
  main.tsx    Router: / → App, /audit → lazy Audit
```

## Showcase sections (21)
1 Hero · 2 Promo Video · 3 Overview · 4 Color · 5 Typography · 6 Spacing & Layout ·
7 Radius & Elevation · 8 Motion · 9 Logo · 10 Components · 11 Cards · 12 Bento ·
13 Banners · 14 Blogs · 15 Domain Warm-up · 16 Lead Magnets · 17 Image Library ·
18 Notion · 19 Social Media · 20 Live Demo Pages · **21 Client Audit**

`src/lib/nav.ts` is the single source — add an entry there and render the section in `App.tsx`.

## The audit instrument
A two-call diagnostic for a brokerage, used live on client calls. Three parts (Discovery,
Diagnosis, Handoff), 21 modules, 82 blocks. Content lives in `src/data/audit/modules/*.ts`;
the instrument is `src/audit/`.

Diagnosis measures the client against the **built broker configuration** — the six-pipeline set
from `db-finance-os/11-operations/pipelines-and-stages.md` (object 1, the one with a build date).
That spec is mirrored in `src/data/audit/build-spec.ts`, which also records a discrepancy in the
source: the prose states 44 stages, the table lists 45. The count derives from the names, with
the stated figure kept beside it.

**Content rules that any edit must keep:** the form asks about the client's business and asserts
nothing about ours — no turnaround, guarantee, trial, SLA or outcome figure. Compliance flags
point the client at their own licensee rather than stating a breach. The Markdown export carries
`db-finance-os` frontmatter and marks every figure as reported, not verified.

## Quality status
- ✅ Build clean (tsc strict + `check:audit` + vite)
- ✅ WCAG AA: **21/21** semantic pairs (`node scripts/contrast-audit.mjs`)
- ✅ Token-only enforced (Tailwind palette replaced); responsive verified mobile + desktop
- ✅ Audit content reviewed across six lenses (promises, compliance overreach, banned language,
  false facts, duplication, sensitivity); 44 confirmed findings applied

## Backlog
- `celebration-button`: tokenize the JS particle palette (currently inline hex).
- `swatch`: replace the `ring-black/[0.06]` default with a token hairline.
- Consider a backend hook for Lead Magnets / Social Post Studio export (PNG).
- 3D/memoji assets to drop into the Image Library + Hero (asset slots are wired).

## Ship → Vercel
Push to `main`; Vercel builds from it (Vite preset, output `dist`). Commit author must be
`211211395+teamos-ai@users.noreply.github.com` so the deploy is accepted.
