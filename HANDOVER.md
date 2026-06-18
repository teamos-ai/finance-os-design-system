# Finance OS Design System — Handover

A reusable, faithfully-tokenized **dark-mode luxury** design system for **Finance OS**
(a broker operating system / CRM), delivered as a living **showcase / reference site**.
The showcase IS the documentation.

- **Repo:** `teamos-ai/finance-os-design-system` (private) · branch `main`
- **Direction:** Dark-mode Luxury SAAS · Archetype Ruler 70% + Sage 30% · voice calm/authoritative
- **Modeled on:** the Health OS v2 design system (structure/UI), reskinned to the Finance OS brand
- **Live:** import to Vercel from `main` (manual) — see §Ship

## Stack
React 18 · Vite 6 · TypeScript (strict) · Tailwind CSS 3 · Framer Motion 11 · lucide-react ·
class-variance-authority · self-hosted fonts (@fontsource: Spline Sans + Anonymous Pro).

## Run (IMPORTANT — builds on the network share)
`cmd.exe` can't use a UNC working dir and Vite/esbuild can't resolve paths with spaces, so the
toolchain runs through a **space-free `subst` drive** + Vite `preserveSymlinks`:
```powershell
subst Q: "W:\3-Finance OS\01 Marketing - Finance OS"   # once per session
cd Q:\finance-os-design-system
npm install            # via npm.cmd from PowerShell (~3 min over SMB)
npm run dev            # http://localhost:5173  (usePolling watcher for SMB HMR)
npm run build          # tsc --noEmit && vite build  (~4 min over SMB)
```
> Verify screenshots against a **static serve of `dist/`** (launch.json `finance-os-static`,
> port 5174) — `preview_screenshot` is unreliable against Vite's polling HMR over SMB.

## Token architecture (three layers)
`src/styles/tokens.css`:
- **primitive** `--p-*` — raw brand ramps (Signal Gold, Momentum Amber, Atlas Blue, Neutral; brand book p.4)
- **semantic** `--c-*` — intent (canvas/surface/elevated/fg/border/accent/state) defined per theme via `[data-theme]`
- **component** — `--btn-*`, `--card-*`, radius/motion, fixed inverse + danger-solid surfaces

Wired through `tailwind.config.ts` (colours + radius **replaced**, not extended, to enforce
token-only + 8px-max squircles). `cn()` (`src/lib/cn.ts`) extends tailwind-merge's font-size
group so custom `text-{size}` tokens never drop text colours. **Switching theme touches only the
semantic layer.** Themes: **Dark-OLED (primary) · Light-Clarity · Paper**.

### Add a theme
1. Add a `[data-theme="x"] { --c-…: … }` block in `tokens.css` (override the semantic layer only).
2. Add it to `THEMES`/`THEME_LABELS` in `src/lib/theme.tsx` and a mode in `theme-toggle.tsx`.
3. Run the contrast audit (below) to confirm AA.

## File map
```
src/
  lib/        cn · utils · theme(Provider/useTheme) · motion(Framer presets) · accents · nav
  data/       system.ts  (brand copy: FEATURES, STATS, PILLARS, PRICING, TESTIMONIAL)
  components/
    brand/    Logo (+ LogoMark)
    ui/       button badge card input icon-button segmented disclosure stat swatch counters
              pagination command-bar command-chip feature-card tool-card save-button
              celebration-button image-wash video-player mono-label theme-toggle
  showcase/   Shell (sidebar nav) · Section/Demo · sections/<20 sections>
  App.tsx     Shell wrapping the 20 sections in order
```

## Architecture sections — status (all 20 present)
1 Hero ✓ · 2 Promo Video ✓ · 3 Quick Start ✓ · 4 Overview ✓ · 5 Color ✓ · 6 Typography ✓ ·
7 Spacing ✓ · 8 Radius & Elevation ✓ · 9 Motion ✓ · 10 Icons & Logo ✓ · 11 Components ✓ ·
12 Cards ✓ · 13 Bento ✓ · 14 Banners ✓ · 15 Blogs ✓ · 16 Lead Magnets (working calculator) ✓ ·
17 Image Library ✓ · 18 Notion ✓ · 19 Social Media (interactive Social Post Studio) ✓ ·
20 Live Demo Pages (dark landing + light CRM) ✓

## Quality status (S7 self-audit)
- ✅ Build clean (tsc strict + vite) · ✅ Console clean (no runtime errors)
- ✅ WCAG AA: **63/63** semantic pairs across dark/light/paper (`node scripts/contrast-audit` — see refs)
- ✅ Token-only enforced (Tailwind palette replaced); responsive verified at mobile + desktop, all 3 themes
- ⏳ **Deep Impeccable critique + audit: pending (user-led sweep)** — the next pass

## Backlog (for the Impeccable sweep)
- ColorSection: move the gold "★ Main" marker from `#BE9522` (500) to the true Signal Gold base `#EEBA2B` (400).
- celebration-button: tokenize the JS particle palette (currently inline hex).
- swatch: replace the `ring-black/[0.06]` default with a token hairline.
- Consider a lead-form backend hook for Lead Magnets / Social Post Studio export (PNG).
- Provided 3D/memoji assets to drop into the Image Library + Hero (asset slots are wired).

## Ship → Vercel (manual import by user)
Build passes locally and is pushed to `main`. Import **`teamos-ai/finance-os-design-system`**,
branch **`main`** (Vite preset, output `dist`). Commit author is the required
`211211395+teamos-ai@users.noreply.github.com` so the deploy is accepted.
