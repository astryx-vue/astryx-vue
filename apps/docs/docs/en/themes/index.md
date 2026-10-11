---
title: Themes
outline: false
footer: false
---

Neutral is the theme this package ships today. Load it with:

```ts
import '@astryx-vue/themes/neutral.css'
```

`--astryx-font-family-code` names JetBrains Mono first, then `ui-monospace`, `SFMono-Regular`, `Menlo`, `Consolas`, and `monospace`. The theme does not download the font. Import the faces only when you want them:

```ts
import '@astryx-vue/themes/fonts.css'
```

`fonts.css` loads JetBrains Mono at 400, 500, 600, and 700, plus italic at 400. It is not pulled in by `neutral.css`. Those are the faces `font-synthesis: none` can use: the browser does not invent a missing weight or italic.

Semantic tokens live in `packages/themes/neutral/base.css`. Names follow upstream `tokens.stylex.ts` and add an `--astryx-` prefix. Each token writes its light and dark stops with `light-dark()`. A value comes from the Neutral theme when that theme overrides it, and from the upstream default otherwise.

A few of the same names are still declared in component theme files, including the type sizes in `text.css` and the blue `--astryx-color-text-accent`. Those later declarations win, so existing components keep their current appearance. A later theme pass will fold the duplicates back into this layer.

<TokenReference locale="en" />
