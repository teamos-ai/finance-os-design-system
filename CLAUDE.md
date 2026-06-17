# CLAUDE.md — Finance OS Design System

## What this is
A reusable, faithfully-tokenized **dark-mode luxury** design system for **Finance OS** (a
broker-specific CRM/operating system), delivered as a living React + Vite + TS + Tailwind +
Framer Motion **showcase/reference site**. The showcase IS the documentation. **Tokens are
ground truth — never hardcode a value a token should own.**

## Brand (locked — see ../DS-FinanceOS/SPEC.md)
- Archetype: **Ruler 70% + Sage 30%**. Voice: Calm · Clear · Grounded · Authoritative. Never hyped.
- Colour: Atlas/Corporate Blue `#33488F→#0A0E1D` · **Signal Gold `#EEBA2B`** · **Momentum Amber `#E68A00`** · Off-Black `#2D2D2D` · Clarity White.
- Signature: **Signal Gold → Momentum Amber gradient + gold glow** (glow elevation, not heavy drop-shadows).
- Type: **Spline Sans** (display/headings) + **Anonymous Pro** (body/mono).
- Themes: **Dark-OLED (primary)** · Light-Clarity · Paper — all driven by ONE semantic layer.
- Foundations: 8px-max squircles · gentle Framer motion · **NO glassmorphism**.

## Token architecture (3 layers)
`primitive` (raw values) → `semantic` (bg/surface/elevated/fg/border/accent/state, per theme)
→ `component` (component-scoped, references semantic). Wired via `tailwind.config.ts` + CSS
variables. Switching theme touches ONLY the semantic layer. Custom `text-{size}` tokens require
extending tailwind-merge's font-size group so `cn()` doesn't drop text colours.

## Build environment (IMPORTANT)
Project lives on the Team OS network share. Because `cmd.exe` can't use a UNC working directory
and esbuild can't resolve paths with spaces, **run the toolchain through a space-free `subst`
drive**:
```
subst Q: "W:\3-Finance OS\01 Marketing - Finance OS"
cd Q:\finance-os-design-system   # then npm.cmd ... from PowerShell
```
Vite uses `usePolling` so HMR works over SMB. Commit/push with the provided SSH key + correct
author identity so Vercel accepts the deploy. Vercel import is done manually by the user.

---

# Operating principles (Andrej Karpathy — appended per project brief T1)

Behavioral guidelines to reduce common LLM coding mistakes. Bias toward caution over speed; use
judgment on trivial tasks.

## 1. Think Before Coding
Don't assume. Don't hide confusion. Surface tradeoffs.
- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.

## 2. Simplicity First
Minimum code that solves the problem. Nothing speculative.
- No features beyond what was asked. No abstractions for single-use code.
- No "flexibility"/"configurability" that wasn't requested.
- If you write 200 lines and it could be 50, rewrite it.

## 3. Surgical Changes
Touch only what you must. Clean up only your own mess.
- Don't "improve" adjacent code, comments, or formatting. Don't refactor what isn't broken.
- Match existing style. Remove only the orphans YOUR changes created.
- Every changed line should trace directly to the request. *(This powers iteration mode after S9.)*

## 4. Goal-Driven Execution
Define success criteria. Loop until verified.
- Turn each stage's Definition of Done into a verifiable check, then loop toward it.
- For multi-step tasks, state a brief plan with a `verify:` check per step.
- Strong success criteria let the model loop independently.
