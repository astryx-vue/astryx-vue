---
title: Themes
---

# Themes

A theme decides the color, type, radius, shadow, and motion duration the components use. Structural styles live in `@astryx-vue/core`. Themes live in `@astryx-vue/themes`. Install and import them separately.

Neutral is the default theme: neutral gray, with light and dark stops on the same CSS variables, and no brand hue locked in. Customizations and overrides follow the same variable names and structure.

To use it:

1. Install `@astryx-vue/themes`.
2. Import `@astryx-vue/themes/neutral.css` once from the app entry.
3. When something has to change, override the `--astryx-*` variable. Leave the structural styles alone.

```ts
import '@astryx-vue/themes/neutral.css'
```

That import loads JetBrains Mono. The body and heading stacks name Figtree first, then system sans fonts. Figtree is not in the theme package. Load it yourself if you want that face.

Next: what [Neutral](/en/themes/neutral) overrides today, how [design tokens](/en/themes/tokens) map onto [CSS variables](/en/themes/css-variables), or the [color](/en/themes/color), [typography](/en/themes/typography), and [motion](/en/themes/motion) pages. To change the look, read [Extending a theme](/en/themes/extending). To apply a theme object to one subtree, use the [Theme](/en/components/theme), [Media Theme](/en/components/media-theme), and [Syntax Theme](/en/components/syntax-theme) components.
