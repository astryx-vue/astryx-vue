---
title: Color
---

# Color

Neutral colors are `--astryx-color-*`. Each one uses `light-dark()` for the light stop and the dark stop. In the grid below, the left chip is light and the right chip is dark. Translucent colors sit on a checkerboard.

The set covers surfaces, text, icons, success, warning, error, and the blue, cyan, gray, green, orange, pink, purple, red, teal, and yellow groups for background, border, icon, and text. `Badge` variants use those names, for example `variant="blue"`.

Chart colors are `--astryx-color-data-*`, 56 of them, with the same names and values as upstream. Categorical colors give one color to each series, for example `--astryx-color-data-categorical-blue`, and the light and dark stops are the same hex. Sequential ramps run from 5 to 1, 5 darkest and 1 lightest, for example `--astryx-color-data-blue-5`. The gray ramp and `--astryx-color-data-neutral` change with the color scheme. The neutral one is for labels and reference lines.

The defaults live once in `@astryx-vue/themes/data.css`, on `:root`, and every theme entry imports that file. A theme's own stylesheet does not repeat them. To recolor a series, set only that variable, on `:root` or inside a theme, and a nested theme keeps whatever its parent set. Code that paints outside CSS, such as a canvas chart, can read the same defaults from `DATA_TOKEN_DEFAULTS` in `@astryx-vue/core/Theme`, or call `useTheme().token('--color-data-categorical-blue')`.

<TokenReference locale="en" :headings="false" :sections="['color']" />
