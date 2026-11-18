---
aside: false
title: Theming
---

# Theming

A theme sets the color, type, radius, shadow, and motion the components use. Structural styles stay in `@astryx-vue/core`.

```ts
import '@astryx-vue/themes/neutral.css'
```

Put `data-astryx-theme="neutral"` on the element that should take the theme. On `html`, that is the whole app. On a smaller element, only that subtree. Neutral also writes the same variables on `:root`, so importing `neutral.css` is enough for a single-theme app. The other themes do not touch `:root`.

Figtree and JetBrains Mono load with every theme. Butter, Chocolate, Gothic, Matcha, Stone, and Y2K also load their own text faces.

The [theme gallery](/en/themes/) shows every theme on the same storefront page.

[Neutral](/en/guide/themes/neutral), [Butter](/en/guide/themes/butter), [Chocolate](/en/guide/themes/chocolate), [Gothic](/en/guide/themes/gothic), [Matcha](/en/guide/themes/matcha), [Stone](/en/guide/themes/stone), and [Y2K](/en/guide/themes/y2k) each have an import snippet. Token names are shared; see [CSS variables](/en/guide/css-variables). How [design tokens](/en/guide/tokens) map onto those variables, and the [color](/en/guide/color), [typography](/en/guide/typography), and [motion](/en/guide/motion) pages, sit next to that. To change one value, read [Extending a theme](/en/guide/extending-themes). To apply a theme object to one subtree, use the [Theme](/en/components/theme), [Media Theme](/en/components/media-theme), and [Syntax Theme](/en/components/syntax-theme) components.
