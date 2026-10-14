---
aside: false
title: Themes
---

# Themes

A theme sets the color, type, radius, shadow, and motion the components use. Structural styles stay in `@astryx-vue/core`.

```ts
import '@astryx-vue/themes/neutral.css'
```

Put `data-astryx-theme="neutral"` on the element that should take the theme. On `html`, that is the whole app. On a smaller element, only that subtree. Neutral also writes the same variables on `:root`, so importing `neutral.css` is enough for a single-theme app. The other themes do not touch `:root`.

Figtree and JetBrains Mono load with every theme. Butter, Chocolate, Gothic, Matcha, Stone, and Y2K also load their own text faces.

<ThemeGallery />

[Neutral](/en/themes/neutral), [Butter](/en/themes/butter), [Chocolate](/en/themes/chocolate), [Gothic](/en/themes/gothic), [Matcha](/en/themes/matcha), [Stone](/en/themes/stone), and [Y2K](/en/themes/y2k) each have an import snippet. Token names are shared; see [CSS variables](/en/themes/css-variables). How [design tokens](/en/themes/tokens) map onto those variables, and the [color](/en/themes/color), [typography](/en/themes/typography), and [motion](/en/themes/motion) pages, sit next to that. To change one value, read [Extending a theme](/en/themes/extending). To apply a theme object to one subtree, use the [Theme](/en/components/theme), [Media Theme](/en/components/media-theme), and [Syntax Theme](/en/components/syntax-theme) components.
