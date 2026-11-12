# Contributing to the Finance OS Design System

The showcase **is** the documentation. Keep the system and its docs in lockstep — a change that
ships without its showcase entry and its regenerated index is only half done.

## Before every commit

```bash
npm run check    # typecheck + lint + test (content audit + WCAG AA contrast)
npm run build    # must stay green — this is what Vercel runs
```

Both must pass. `tailwind.config.ts` *replaces* `colors` and `borderRadius`, so an off-token
value (`bg-gray-500`, `rounded-3xl`) fails the build by design — fix it with a token, don't widen
the config.

## The non-negotiables

See **[CLAUDE.md](CLAUDE.md)** for the full brand contract. The short version:

- Tokens are ground truth. Compose components from `--c-*` only.
- Atlas Blue owns all type highlight. No gold, no orange. Amber is a **status** signal only.
- No ribbons. 8px-max radius. No glassmorphism. Neutral focus rings.
- Logos are the **provided assets only** — never draw, recolour or fabricate one (incl. the favicon).

## Add or change a **component**

1. Put reusable primitives in `src/components/ui/`. Follow the house pattern: a leading `/** … */`
   describing it in one sentence (the docs generator reads this), `class-variance-authority` for
   variants, and `cn()` from `src/lib/cn.ts` for class merging.
2. Compose only from semantic tokens (`--c-*` / the Tailwind token classes). No raw hex, no
   arbitrary radii above 8px.
3. **Document it — this is a required, normal step, not optional:**
   - **Regenerate the index:** `npm run docs:components` (writes `docs/COMPONENTS.md` — never
     hand-edit it; it is generated from source so it can't drift).
   - **Show it in the showcase:** add or update the component's demo in its `src/showcase/sections/*`
     file, and give the demo an `inspect={…}` payload (Explain / Tokens / Code / Download) so the
     live API stays complete.
4. Run `npm run check`. Commit the component, its showcase change, and the regenerated
   `docs/COMPONENTS.md` **together**.

> Rule of thumb: if `git diff` touches a component but not `docs/COMPONENTS.md` or a showcase
> section, the change isn't finished.

## Add a **showcase section**

1. Add one entry to `src/lib/nav.ts` (`id`, `label`, `Icon`, `accent`, `group`). Keep it next to
   its group so the sidebar's consecutive-run grouping stays intact. The section **number is
   derived from nav order** — don't hardcode it in the eyebrow.
2. Create `src/showcase/sections/<Name>Section.tsx` using the `<Section id=… eyebrow=… title=…>`
   frame (pass the eyebrow as a plain label, no leading number).
3. Render it in `src/App.tsx` in the same position as the nav entry.

## Add a **token**

Add it bottom-up: a `--p-*` primitive, then the `--c-*` semantic that references it, then any
component token. Wire new colour/radius keys in `tailwind.config.ts`. **Gotcha:** a custom
`text-{size}` token must be registered in tailwind-merge's font-size group in `src/lib/cn.ts`, or
`cn()` mistakes it for a text-*colour* class and silently drops real colours. Re-run
`npm run check:contrast` if you touch a semantic colour pair (must stay 21/21).

## The `/audit` instrument

Content is data (`src/data/audit/modules/*.ts`); the instrument is code (`src/audit/`).
`npm run check:audit` gates the build. The content rules are strict — the form asks about the
*client's* business and asserts nothing about ours; no turnaround / guarantee / SLA / outcome
figure anywhere; compliance flags route the client to their own licensee; every exported figure is
marked *reported, not verified*. Keep them.

## Gotchas

- **React dedupe:** `vite.config.ts` keeps `preserveSymlinks` (for the SMB-share build), which
  defeats Vite's automatic React deduping. `resolve.dedupe` + `optimizeDeps.include` pin one React
  instance. If you add a dependency that imports React, clear `node_modules/.vite` afterwards.
- **Vendor chunks:** `react` + `react-dom` + `react-router` must stay in one chunk
  (`manualChunks` in `vite.config.ts`) — never split them, or the dedupe can't prevent an
  "Invalid hook call".

## Commit & deploy

Run `npm run check`, keep changes focused (one concern per commit), and use the author identity
`211211395+teamos-ai@users.noreply.github.com`. Push to `main` → Vercel deploys production.
