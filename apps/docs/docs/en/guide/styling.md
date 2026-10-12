---
title: Theme and styles
---

# Theme and styles

An app imports two things at minimum: a theme, and structural styles for the components it uses.

```ts
import '@astryx-vue/themes/neutral.css'
import { Button } from '@astryx-vue/core/Button'
```

The `Button` entry loads the structural sheet for `button`. The theme entry loads Neutral's variables, including the `--astryx-button-*` names that button reads. Without the theme, the structure is there and the color and metrics are not. Without the structural sheet, the variables have no rules to feed.

To load every structural sheet once, add this at the entry:

```ts
import '@astryx-vue/core/styles.css'
import '@astryx-vue/themes/neutral.css'
```

`styles.css` gathers the sheets in `packages/core/styles/`, including the shared motion in `motion.css`. `neutral.css` gathers the theme files in `packages/themes/neutral/` and loads JetBrains Mono.

The layer order is:

```css
@layer astryx.reset, astryx.tokens, astryx.base, astryx.components, astryx.overrides;
```

Application overrides belong in `astryx.overrides`. Unlayered global CSS beats these layers, so a bare `button { }` will paint over the component unless that is what you want.

These styles do not require UnoCSS. The docs site uses UnoCSS only so example classes such as `i-carbon-*` can draw icons. That is the icon approach, not a styling dependency. See [Icons](/en/guide/icons).

Variable names, `light-dark()`, and what the theme covers today are in [CSS variables](/en/themes/css-variables) and [Neutral](/en/themes/neutral).
