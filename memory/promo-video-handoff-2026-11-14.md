# Amendment 1 — Video Explainer

**Confirmed by Tumai, 14 November 2026. ✅ IMPLEMENTED 2026-11-14** (verified desktop + mobile;
awaiting Tumai's push). Closed the parity gaps vs the reference flipwrap: control below the card,
"Watch the demo video / Back to the dashboard", reference 3D rest-tilt (flat ≤600px), player focuses
on flip. Flip geometry/timing, play-on-flip + muted retry, pause-on-return and the BrandDashboard
composition already matched. See `progress.md` (2026-11-14).

---

Port the complete Promo Video section from [Brand Positioning](https://brand.financeos.au/) into the design system. Use the [Brand Positioning repository](https://github.com/teamos-ai/financeos-brand-positioning) and its local checkout as the source. In that checkout, locate the dashboard renderer in build.mjs, its styles in src/app.css and the flip/playback handlers in the generated index.html or its source script. Compare against the rendered brand page and Tumai’s screenshot.

Bring over the dashboard composition, sidebar, cards, charts, avatars, gradients, shadows, sizing and layout, and the full flip and video sequence. Preserve the visible sample-data label and the Watch the demo video control below the dashboard. Match the source's flip geometry, timing and easing. Start video playback after the flip, carry over the reference’s muted retry when autoplay with sound is blocked and focus the player. Pause playback on return to the dashboard. Preserve accessible controls and reduced-motion behaviour.

The current design-system entry is VideoSection, backed by BrandDashboard, ScaleToFit and FlipCard. Its watch control sits above the dashboard. Reuse or adapt those components where they can deliver reference parity. Use shared design tokens for reusable values and document how the parts map to tokens. Preserve exact visual values when adding any needed tokens.

Verify the two rendered sections side by side at matching desktop and mobile widths. Check the dashboard face, button position, transition, video playback, and return path. Run the repository checks and build, and record any remaining differences.
