---
title: Space, radius, and shadow
---

# Space, radius, and shadow

Spacing runs from `--astryx-spacing-0` through `--astryx-spacing-12`, in 4px steps, with `0.5` and `1.5` in between. Control heights are `--astryx-size-element-sm` (28px), `md` (32px), and `lg` (36px).

Radii run from `--astryx-radius-none` to `--astryx-radius-full`. `--astryx-radius-none` stays `0` in this package. It does not adopt upstream Neutral's `0.25rem`. `--astryx-radius-chat` is 28px. Neutral does not override it. At a 16px root that equals the `1.75rem` page radius.

Shadows have three elevations, `low`, `med`, and `high`, plus inset shadows for hover, selected, success, warning, and error. The outer shadows use offset and blur, and the light and dark stops differ.

The focus ring uses `--astryx-focus-outline-width`, `style`, `color`, and `offset`. The color follows `--astryx-color-accent`.

<TokenReference :headings="true" locale="en" :sections="['spacing', 'size', 'border', 'focus', 'radius', 'shadow']" />
