# Finance OS — Design System

A reusable, faithfully-tokenized **dark-mode luxury** design system for **Finance OS**,
delivered as a living **showcase / reference site** that *is* the documentation.

> Direction: *Dark-mode Luxury SAAS Software Bespoke.*
> Archetype: Ruler (70%) + Sage (30%). Voice: calm, clear, grounded, authoritative.

## Stack
React 18 · Vite 6 · TypeScript · Tailwind CSS 3 · Framer Motion · react-router

## Themes (one semantic layer drives all three)
- **Dark — OLED** (primary, luxury marketing surface)
- **Light — Clarity** (product-dashboard surface)
- **Paper** (warm off-white, editorial / long-form)

## Run
This project is built on the Team OS network share. The Vite/npm toolchain is run
through a **space-free `subst` drive** because `cmd.exe` can't use a UNC working
directory and esbuild can't resolve module paths that contain spaces.

```powershell
# one-time per session: map a clean drive letter to the marketing folder
subst Q: "W:\3-Finance OS\01 Marketing - Finance OS"
cd Q:\finance-os-design-system
npm install        # use npm.cmd from PowerShell
npm run dev        # http://localhost:5173
npm run build      # tsc --noEmit && vite build
```

## Token layers
`primitive` (raw brand values) → `semantic` (intent: bg/surface/fg/border/accent/state, per theme)
→ `component` (component-scoped, references semantic). Wired through `tailwind.config.ts` + CSS
variables so switching themes only ever touches the semantic layer. *(Lands in S4.)*

## Architecture
20 documented sections: Hero · Promo Video · Quick-Start · Overview · Color · Typography ·
Spacing · Radius & Elevation · Motion · Icons & Logo · Components · Cards · Bento · Banners ·
Blogs · Lead Magnets · Image Library · Notion · Social Media · Live Demo Pages.
