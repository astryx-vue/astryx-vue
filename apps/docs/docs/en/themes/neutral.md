---
title: Neutral
---

# Neutral

Neutral is the theme `@astryx-vue/themes` ships today. Load it with:

```ts
import '@astryx-vue/themes/neutral.css'
```

That entry loads `fonts.css`, then each file under `neutral/` in name order, including `base.css`. `fonts.css` loads JetBrains Mono at 400, 500, 600, 700, and 400 italic. Those are the faces `font-synthesis: none` can use. The browser does not invent a missing weight or italic.

`--astryx-font-family-code` names JetBrains Mono first, then `ui-monospace`, `SFMono-Regular`, `Menlo`, `Consolas`, and `monospace`.

Semantic tokens live in `packages/themes/neutral/base.css`. Names follow upstream `tokens.stylex.ts` and add an `--astryx-` prefix. Each token writes its light and dark stops with `light-dark()`. A value comes from the Neutral theme when that theme overrides it, and from the upstream default otherwise.

Two values stay where this package already shipped them, so existing components do not change appearance:

- `--astryx-radius-none` stays `0`. Upstream Neutral uses `0.25rem`. Square avatars and skeletons with radius none use this token for a square corner.
- The light stop of `--astryx-color-text-secondary` stays `#525252`. Upstream Neutral uses `#737373`. Inputs, selectors, and supporting text already use this value.

The variables sit on `:root` and `[data-astryx-theme='neutral']`, with `color-scheme: light dark`. Light and dark follow the element's `color-scheme`. Force one side with `data-astryx-color-mode="light"` or `"dark"` on an ancestor. See [Dark mode](/en/guide/dark-mode).

A few of the same names are still declared in component theme files, including the type sizes in `text.css` and the blue `--astryx-color-text-accent`. Those later declarations take precedence, preserving current component appearances.
