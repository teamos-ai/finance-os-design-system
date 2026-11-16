# The goats

Five voxel goat faces, one per score, supplied by the owner on 7 September 2026
as a single 1983×793 strip (`Goated Stars.png`) with the five heads in a row
above a star rating and a numeral.

## How they were cut

The strip's content bands and per-goat column bounds were detected by scanning
for non-white pixels rather than eyeballed: the heads occupy rows 137–571, and
the five columns fall at 12–393, 404–781, 796–1177, 1187–1567 and 1579–1972.

The background was removed by **flood-filling inward from the border**, not by
keying out white. That distinction matters — the goats are cream and their
eyes, teeth and glasses highlights are near-white, so a global "white becomes
transparent" would have punched holes straight through the animal. A pixel
counts as background only if every channel is ≥ 244 *and* the channel spread is
≤ 8, which separates the (254,254,254) backdrop from the (253,246,226) forehead.

Exported at 256px tall with alpha. Next's image pipeline handles WebP/AVIF
negotiation and the responsive sizes, so no hand-made variants are kept here.

## Rules

- **Never render below ~40px.** The expression is the whole point and at 32px a
  frown and a smile are the same grey smudge.
- **The numeral renders with the picture.** One goat cannot say "three" on its
  own; `GoatRating` prints `n/5` beside it.
- Goat 5 is the Goated badge. It is the only one that appears on Signal Gold.

## The trophy

`trophy.png` — generated 7 September 2026 with the Higgsfield CLI (`gpt_image_2`,
1:1, `--background transparent`, 1k), prompted to match the goats' chunky voxel
look. Trimmed and exported at 320px tall, 33KB.

The model's `background: transparent` produced a genuine alpha channel, so no
flood fill was needed here — but the RGB behind the alpha still carries the
render's glow, which is why it looks dark in an image viewer and clean on the
page. Verified on white, canvas-muted and Signal Gold.

Used once, in the Goated panel, with a slow float and a blurred gold glow
behind it. Both animations stop under `prefers-reduced-motion` and the trophy
rests — that is the correct still state, not a degraded one.

## Hover reactions

Every goat reacts on hover in the mood of its own score — one sinks, two
shudders, three nods, four bounces, five celebrates. Defined in `globals.css`
and keyed off `data-score` on the `.goat-react` wrapper, **not** off a utility
class: Tailwind v4 compiles literal strings only, so `animate-goat-${score}`
would generate no CSS and no error.

`GoatRating` is the only component that renders a goat, so this is automatically
consistent everywhere a goat appears now or later — nothing has to be wired up
per page.

Score one runs once and holds rather than looping. A sad thing that loops
forever stops reading as sad and starts reading as a bug.

All five collapse under `prefers-reduced-motion` and the goat sits still. A
hover that does nothing is not a broken hover.

## The gold ramp

`GOLD_RAMP` in `GoatRating.tsx` grades a score into a border colour: five
carries the trophy's own gold, one is barely warm. `scoreBorder(score)` returns
the `color-mix()` string.

This is a deliberate expansion of the design canon's "Signal Gold, fill-based
emphasis, roughly once per view". The justification is that gold on this site
now means exactly one thing — a score — from the goats' glasses through the
stars to the trophy to these borders. **Do not borrow it for anything that is
not a rating.**

## The one-goat's tears

`goat-1-cry.png` is **`goat-1.png` with tear streams painted onto it** — the
same face, pixel for pixel. That is the whole trick, and the reason the first
two attempts failed.

The streams were generated with the Higgsfield CLI (`gpt_image_2`, `--image`
the resting goat as reference), then colour-keyed out of that render — they are
the only saturated blue in the frame — and composited back onto the real
`goat-1.png`. Each stream is anchored by measurement, not by eye: its ribbon
centre a few rows below the top is placed at the goat's lens centre (33.5% and
67.0% of width) with its top at the lens bottom (53.1% of height).

Because the two files are identical above the tear line, the hover needs **no
crossfade**. The layer sits at full opacity and a `clip-path` reveals it
downward from the lens line; everything it uncovers above the water is the same
pixels that were already there, so only the tears appear. It runs once and
holds — a tear that restarts from the eye every second reads as a loop, not as
crying.

Under `prefers-reduced-motion` the animation collapses but keeps its `forwards`
end state, so the goat still cries on hover; it arrives rather than runs.

### One is the only score with no body motion

Deliberately. It used to sink and tilt like the others, and the two halves came
apart: `.goat-react[data-score="1"]:hover img` matched the base goat *and* the
tear layer, but `.goat-react[data-score="1"]:hover .goat-cry` is a class more
specific, so its `animation` won outright and the tears never inherited the
sink. The face slid down and rotated out from under water that stayed put.

Either both layers move or neither does. Neither is right here — the tears
**are** the reaction, and a face sinking behind them competes with the thing you
are meant to watch. If a sink is ever wanted back, apply it to the wrapper so
both layers travel as one.

### Two approaches that failed, so nobody repeats them

**CSS `border-radius` teardrops.** Scaled with the goat, weighed nothing,
looked like blue jellybeans stuck to a face.

**Layering an independently generated crying goat.** The tears themselves were
right, but the two renders draw the ears and horns in slightly different places,
so both silhouettes showed at once — a ghosted double edge that read as broken
rather than as crying. Diagnosing that needed a frame-by-frame capture at the
48px these actually render at; it is invisible in a full-size preview.
