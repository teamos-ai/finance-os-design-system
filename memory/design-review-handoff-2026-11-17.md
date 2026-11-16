# Design review handoff — 17 November 2026

## 1. Tables

Use white table surfaces in place of the grey shading highlighted in Tumai’s screenshot. Use semantic green check and red cross tokens for binary comparison cells, with accessible text labels. Include variants for software ratings with goat icons and clearly labelled sample scores, side-by-side software comparisons, and platform or CRM plan inclusions. Include plain tables for information that needs neither status icon, and expandable rows for supporting details.

Use [How We Score](https://www.financeos.au/how-we-score) and the [website repository](https://github.com/teamos-ai/financeos-website-main) as the reference for the rating artwork and presentation. Start with `src/components/scoring/GoatRating.tsx`, `src/components/scoring/GoatScorecard.tsx` and `src/data/scoring.ts` in the website checkout. Match the distinct goat artwork for each level, with its visible score and label. Use the scoring source for any eligibility logic. Keep table specimens clearly labelled as samples.

## 2. Typography

[Typography screenshot](references/typography-2026-11-17.png) — current design-system view captured in Brave at 140% zoom. Tumai identified Spline Sans for H1 headings and full body paragraphs. Use the corresponding heading and body typography tokens for those roles.

[Body paragraph screenshot](references/typography-paragraph-2026-11-17.png).

Make font roles explicit in the Typography showcase. Group the specimens into **Headings — Spline Sans**, **Body paragraphs — Spline Sans**, and **Utility typography — Anonymous Pro**. Show an actual paragraph and representative mono labels, tags and indicators. Check each example against its component styling, since some tags or badges may use a different font. Beside each specimen, show the role, font family, size, weight, line height and relevant tokens. Keep this visible alongside the example so a builder can identify the font without opening the token inspector.

**Confirmed font roles:** Spline Sans for headings and body paragraphs. Anonymous Pro for utility typography such as mono labels, overlines, tags and counts. Keep these roles explicit in the Typography reference.

**Downloadable font folders:** Tumai downloaded the source archive at `/Users/tumai-os/Downloads/Anonymous_Pro,Spline_Sans.zip`. Verified that this one ZIP contains two family folders: `Anonymous_Pro/` (regular, bold and italic variants) and `Spline_Sans/` (variable font and static weights). Create one download ZIP per family from its matching folder, preserving the files and each family's OFL notice. Leave the original Downloads archive available as the source. Store them in the design system’s existing download asset store, alongside the other downloadable packs, and give each a stable URL served directly by the design system. In Typography, render each font as an instance of the existing Section Folder component. Make the folder itself a keyboard-accessible download link, with a visible download cue and an accessible name such as “Download Spline Sans ZIP”. Activating either folder downloads its matching archive directly. Verify that each folder downloads the matching archive and that both ZIPs open correctly.

## 3. Bold Icon Removal

[Icons screenshot](references/bold-icons-2026-11-17.png) — current Icons view in Brave at 175% zoom. Tumai confirmed: remove the bold stroke-weight option from the design system and use the existing standard stroke weight wherever the bold variant was applied. Remove the bold specimen and its label from the Icons showcase. Keep the existing icon size scale and size tokens intact. Verify that the remaining size examples use the standard stroke.

## 4. Icon Variants

[Icon Variants screenshot](references/icon-variants-2026-11-17.png) — reference captured during Tumai’s walkthrough.

Add semantic icon variants for a green check and red cross, shared with the Tables examples. Include a warning variant where applicable. Use the standard icon stroke and existing size scale from item 3. Pair status colours with recognisable shapes and accessible labels.

Use [How We Score](https://www.financeos.au/how-we-score) and the [website repository](https://github.com/teamos-ai/financeos-website-main) as the source for the five goat rating illustrations and the trophy artwork. Inspect the scoring page, GoatRating, GoatScorecard and their styles and assets. Port the reusable React cards, criteria and ranking presentation, matching the source hover and animation behaviour. Preserve artwork fidelity, accessible labels and reduced-motion support. Use clearly labelled sample scores in the showcase.

Expose the same artwork under Icons and Image Library through shared asset references. Fully tokenise the presentation: semantic status colours, sizing, spacing, typography, borders, radius, elevation and motion. Document the token mapping and verify that the icon specimens, image previews and scoring cards use the same source assets.
