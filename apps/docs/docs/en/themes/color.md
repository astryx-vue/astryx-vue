---
title: Color
---

# Color

Neutral colors are `--astryx-color-*`. Each one uses `light-dark()` for the light stop and the dark stop. In the grid below, the left chip is light and the right chip is dark. Translucent colors sit on a checkerboard.

The set covers surfaces, text, icons, success, warning, error, and the blue, cyan, gray, green, orange, pink, purple, red, teal, and yellow groups for background, border, icon, and text. `Badge` variants use those names, for example `variant="blue"`.

There is no charts package yet. The palette still lives on the themes, under `--astryx-color-data-*`. Categorical colors give one color to each series, for example `--astryx-color-data-categorical-blue`, and the light and dark stops are the same hex. Sequential ramps run from 5 to 1, 5 darkest and 1 lightest, for example `--astryx-color-data-blue-5`. The gray ramp and `--astryx-color-data-neutral` change with the color scheme. The neutral one is for labels and reference lines. All seven themes declare these same stops. The other themes do not recolor them.

<TokenReference locale="en" :headings="false" :sections="['color']" />
