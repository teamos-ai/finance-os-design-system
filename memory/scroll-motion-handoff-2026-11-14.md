# Amendment 2 — Match Brand Positioning scroll motion

Confirmed by Tumai, 14 November 2026. **✅ IMPLEMENTED 2026-11-14** (verified; awaiting Tumai's push).
Restored the fixed `.bg-stage` colour rhythm (white ↔ `--c-warm #E8EDF7`, 750ms, warm every ~3rd
section via `Shell` `data-bg`, `rootMargin -45%/-45%`) — **colour only, grid stays retired**. Reveal
rise aligned to the reference 12px (duration/easing/70ms stagger already matched). CLAUDE.md
reconciled. See `progress.md` (2026-11-14).

---

Use the Brand Positioning page and its local checkout at f590c34 as the reference. In src/app.css inspect the fixed background stage and reveal styles. In the generated index.html locate the reveal/count-up and background rhythm handlers, and trace their source through build.mjs. Compare the rendered reference and design system while scrolling in both directions.

Port the one-time fade and 12px rise as content enters the viewport, including 70ms staggering within groups where the reference uses it. The reveal uses the 400ms slow duration and reference easing. Preserve existing count-up, chart and fill effects where applicable. Match which elements reveal and when rather than animating entire sections uniformly.

Recreate the white → light blue → white background rhythm using a fixed background layer. The reference picks the first section crossing the centre 10% of the viewport and transitions the background colour over 750ms. Use the reference's section sequencing, blue tint and easing. Scope this request to the colour transition and reveals. The separate decorative grid is outside scope.

Use shared motion and colour tokens. Keep content visible with reduced motion or without observer support. Check desktop and mobile, reverse scrolling and direct section links. The design system previously had background rhythm, so inspect commit d82ce5d and its removal in ba27c3b for reusable code. This amendment supersedes the previous always-white background direction for scroll transitions.
