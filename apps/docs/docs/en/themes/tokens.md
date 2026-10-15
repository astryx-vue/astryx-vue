---
title: Design tokens
---

# Design tokens

A design token is a decision the system can reuse: a color, a space step, a radius, a duration. Components read tokens instead of hard-coding those numbers. Changing theme means changing the numbers.

astryx-vue follows upstream Astryx `tokens.stylex.ts`. The public form is a CSS variable, not a StyleX object. Every semantic token has an `--astryx-` prefix. Color tokens use `light-dark()` so both schemes live in one declaration.

Where a value comes from:

1. If Neutral overrides it, that override is used.
2. If Neutral does not override it, the upstream default is used.
3. If a component theme file declares the same name again, the later declaration wins. Style extensions should target the semantic layer.

The token name is the stable interface. The current number lives in `packages/themes/neutral/base.css`. The swatches and bars in these docs are parsed from that file. There is no second list to keep in sync.

| Page | Variables |
| --- | --- |
| [Color](/en/themes/color) | `--astryx-color-*`, including `--astryx-color-data-*` for chart categories and sequential ramps |
| [Typography](/en/themes/typography) | `--astryx-font-*`, `--astryx-text-*` |
| [Motion](/en/themes/motion) | `--astryx-duration-*`, `--astryx-ease-*`, and the shared keyframes |
| [Space, radius, shadow](/en/themes/scale) | `--astryx-spacing-*`, `--astryx-size-*`, `--astryx-radius-*`, `--astryx-shadow-*`, border and focus |

Outside a component, reference `var(--astryx-color-text-primary)`. Naming and cascade layers are in [CSS variables](/en/themes/css-variables).
