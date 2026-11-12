# Finance OS DS — Energize Plan

The plan for taking the design system from "complete and correct" to "beautifully designed, fully
energized" — the right motion, the right graphs, the right assets — built under Ultra Code. This
doc is the brief the build agents read and the roadmap the team follows.

## Governing rule (read first)

**`CLAUDE.md` is ground truth.** We mine the GitHub skills for *technique*, and override their
house-opinions wherever they collide with the Finance OS brand:

- Atlas Blue is the only brand colour; **amber is a status signal only**; no gold/orange.
- **No ribbons.** 8px-max radius. No glassmorphism. Neutral focus rings.
- **Mono eyebrows are ours** (the `Section` eyebrow / `MonoLabel`). taste-skill and hallmark *ban*
  eyebrows — we **do not** follow that here. One eyebrow per section is the system.
- **lucide-react is our icon set** (taste-skill discourages it — overridden).
- Fonts: Spline Sans (display) + Anonymous Pro (body/mono). Logos: the provided assets only.
- Tokens are truth; compose from `--c-*`. No raw hex, no off-scale radius.

## The skills, and how each is used

| Skill | Used for |
|---|---|
| **make-interfaces-feel-better** | The polish + motion review of every section (concentric radius, optical alignment, tabular-nums, scale-on-press 0.96, interruptible transitions, motion restraint). Works with our tokens. |
| **frontend-ui-engineering** | The build standard for new sections (composition, container/presentation, states, a11y) + the anti-"AI aesthetic" acceptance bar (no purple, flat, consistent radius, content-first, subtle shadows). |
| **taste-skill** | Motion recipes (`whileInView` reveals, sticky-stack, horizontal-pan) + image-asset strategy. *Techniques only* — not its eyebrow/lucide bans. |
| **hallmark** | Reserved for the **marketing website + campaign pages** (not the DS itself — its Floor bans our eyebrows). Its `sloplint` + data-viz/imagery references are a QA source. |
| **openui** | Long-term engine — wrap the DS as an OpenUI component library so pages/app surfaces can be AI-generated on-brand. Separate track, after energize. |

## Energize dials (calm premium financial — Ruler 70 / Sage 30)

`DESIGN_VARIANCE 5 · MOTION 4 · DENSITY 4`. Motion is **motivated** (hierarchy, feedback, state,
sequence) — never decorative. Every animated change also has a static cue. Everything
reduced-motion safe and visible without JS.

## Agent build rules (every section-build agent follows these)

1. **Write only your own files:** `src/showcase/sections/<Name>Section.tsx`, and any supporting
   components under a **section-specific new path** (e.g. `src/components/calculators/*`). Follow
   the existing section pattern — read `src/showcase/sections/FeaturedSection.tsx` first.
2. **Never edit shared files:** `nav.ts`, `App.tsx`, `tokens.css`, `tailwind.config.ts`, `cn.ts`,
   `main.tsx`. If you need a new token or shared change, describe it in `requests` — the integrator
   adds it centrally. (This avoids parallel conflicts and the tailwind/dedup gotchas.)
3. **Compose from existing tokens + components.** Read `docs/COMPONENTS.md` for the inventory and
   `src/styles/tokens.css` for tokens. Use the `Section` / `Demo` / `Inspectable` API from
   `src/showcase/Section.tsx`; pass the eyebrow as a plain label (no number).
4. **No new npm dependencies.** Charts/graphs are **tokenised inline SVG** (bar/line/donut) — never
   add a charting library (preserveSymlinks React-dedup risk).
5. **Add an `inspect` payload** (Explain / Tokens / Code) to the key demos.
6. **Figures use `tabular-nums`.** Interactive controls get `active:scale-[0.96]` + focus-visible.
7. Reduced-motion safe; mobile layout explicit; WCAG AA contrast.

## The six sections

### Tokens — Foundations
The 3-layer token system made visible: the primitive ramps (blue 50–500, neutrals, amber, state),
the semantic intents (canvas/surface/elevated/fg/border/accent/state) as live swatches, and example
component tokens. Explain "tokens are truth; tailwind replaces colours/radius." Reuse `Swatch`.

### Icons — Foundations
Document the lucide-react set + conventions: stroke matches text weight (1.5 / 2), one family,
`currentColor` states, the sizing scale, outline-default / fill-active. A searchable/curated grid of
the icons the DS actually uses, with copyable names. Reuse `IconButton`.

### Calculators — Patterns
Broker calculators as reusable components: **repayments, borrowing power, stamp duty (AU)**. Real
interactive state (inputs → computed output), labels-above-inputs, `tabular-nums` figures, a
tokenised inline-SVG breakdown (e.g. principal/interest donut). Build on the existing Lead Magnets
interactive calculator pattern — extract, don't duplicate. Put calculators in
`src/components/calculators/`.

### Dashboards — Patterns
Assembled broker dashboards from the existing widgets + new tokenised charts: a pipeline overview, a
settlements view, a commission view. Stat tiles + one or two inline-SVG charts (bar/line/donut) + a
compact table. Amber marks at-risk/pending **sparingly** (~one moment per view). Reuse `Stat`,
`Card`, and the `WidgetsSection` vocabulary.

### Client Emails — Templates
Client transactional email templates, distinct from the domain warm-up sequence: pre-approval
confirmation, settlement, annual-review / rate-change nudge, review request. Rendered as on-brand
email mockups (follow the warm-up render approach). Same compliance discipline — no guarantees, no
invented figures, every figure "reported, not verified". Sender entity is **ONESTAAACK A.I PTY LTD**.

### Email Signature — Templates
A broker email-signature block component: name, title, the **real brand mark** (`/logo-square-blue.png`
or the rect lockup — never a fabricated logo), contact details, a compliance line. On-brand, with
copyable HTML. Pairs with Client Emails + Warm-up.

## Ultra phases

0. **Direction lock** — this doc (the dials + governing rule + briefs).
1. **Build the 6 sections** — one agent each, in parallel; each reviewed (make-interfaces) and
   refined before acceptance. *(This workflow.)*
2. **Energize sweep** — a polish + motion review across all ~34 sections; apply HIGH/MEDIUM findings;
   adversarially verify no slop/ribbon/off-token crept in.
3. **Assets** — on-brand imagery/illustration/icon treatments for the new sections (light/blue
   palette; no fabricated logos; alt text where meaningful).
4. **QA gate** — anti-AI acceptance table + `sloplint`-style checks + `npm run check` + `build` +
   playwright screenshots + contrast 21/21. Nothing merges that fails.
5. **openui track (later)** — wrap the DS as an OpenUI library + library-driven prompts.

## Definition of done (every phase)

`npm run build` green · `npm run check` green (typecheck + lint + contrast 21/21) · playwright
screenshot inspected · make-interfaces verdict = **Approve** · on-brand (blue-primary, amber-status,
no ribbons, 8px, real logos).
