---
title: Themes
outline: false
footer: false
---

Neutral is the theme this package ships today. Load it with:

```ts
import '@astryx-vue/themes/neutral.css'
```

Semantic tokens live in `packages/themes/neutral/base.css`. Names follow upstream `tokens.stylex.ts` and add an `--astryx-` prefix. Each token writes its light and dark stops with `light-dark()`. A value comes from the Neutral theme when that theme overrides it, and from the upstream default otherwise.

A few of the same names are still declared in component theme files, including the type sizes in `text.css` and the blue `--astryx-color-text-accent`. Those later declarations win, so existing components keep their current appearance. A later theme pass will fold the duplicates back into this layer.

<TokenReference locale="en" />
