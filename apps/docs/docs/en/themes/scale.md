---
title: Space, radius, and shadow
---

# Space, radius, and shadow

Spacing runs from `--astryx-spacing-0` through `--astryx-spacing-12`, with `0.5` and `1.5` in between. The values are rem: `--astryx-spacing-2` is `0.5rem` and `--astryx-spacing-4` is `1rem`. At the browser's default 16px root font size each step is 4px times the step, so `--astryx-spacing-2` is 8px. When a reader raises the browser font size, or a page sets `html { font-size }`, gaps and padding grow with the text in the same ratio. At a 20px root, `--astryx-spacing-4` is 20px instead of 16px.

These tokens used to be fixed px. Nothing looks different at the default root. A custom theme that writes spacing in px keeps fixed px; write rem to follow the root font size.

Control heights are `--astryx-size-element-sm` (28px), `md` (32px), and `lg` (36px). They stay px.

Radii run from `--astryx-radius-none` to `--astryx-radius-full`. `--astryx-radius-none` stays `0` in this package. It does not adopt upstream Neutral's `0.25rem`. `--astryx-radius-chat` is 28px. Neutral does not override it. At a 16px root that equals the `1.75rem` page radius.

Shadows have three elevations, `low`, `med`, and `high`, plus inset shadows for hover, selected, success, warning, and error. The outer shadows use offset and blur, and the light and dark stops differ.

The focus ring uses `--astryx-focus-outline-width`, `style`, `color`, and `offset`. The color follows `--astryx-color-accent`.

<TokenReference :headings="true" locale="en" :sections="['spacing', 'size', 'border', 'focus', 'radius', 'shadow']" />
