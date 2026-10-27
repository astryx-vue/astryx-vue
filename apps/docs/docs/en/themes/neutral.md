---
title: Neutral
---

# Neutral

Neutral is the theme `@astryx-vue/themes` ships today. Load it with:

```ts
import '@astryx-vue/themes/neutral.css'
```

That entry loads `fonts.css`, then each file under `neutral/` in name order, including `base.css`. `fonts.css` loads Figtree and JetBrains Mono at 400, 500, 600, 700, and 400 italic. Figtree also includes 600 italic. Those are the faces `font-synthesis: none` can use. The browser does not invent a missing weight or italic.

`--astryx-font-family-body` and `--astryx-font-family-heading` name Figtree first, then `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `Helvetica`, `Arial`, and `sans-serif`. `--astryx-font-family-code` follows upstream and names the platform monospace stack first: `ui-monospace`, `SF Mono`, `Monaco`, `Consolas`, `Liberation Mono`, `Courier New`, and `monospace`.

Override those three variables to use your own fonts. You can also skip the bundled `fonts.css` and load Figtree yourself, for example with `<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">` in the document head.

Semantic tokens live in `packages/themes/neutral/base.css`. Names follow upstream `tokens.stylex.ts` and add an `--astryx-` prefix. Each token writes its light and dark stops with `light-dark()`. A value comes from the Neutral theme when that theme overrides it, and from the upstream default otherwise.

Every color, radius, and shadow matches upstream v0.7.1 `neutralTheme.ts`. Palettes come from the approved grey, text, icon, border, background, status, and categorical stops. `--astryx-radius-none` is `0px` and the light stop of `--astryx-color-text-secondary` is `#474747`, as upstream ships them.

Component colors reference the semantic variables instead of repeating hex values. `--astryx-badge-info-background` points at the approved status fill, for example, so changing one semantic variable updates every component that reads it.

The variables sit on `:root` and `[data-astryx-theme='neutral']`, with `color-scheme: light dark`. Light and dark follow the element's `color-scheme`. Force one side with `data-astryx-color-mode="light"` or `"dark"` on an ancestor. See [Dark mode](/en/guide/dark-mode).

On a touch device (coarse pointer) narrower than the `lg` breakpoint (1024px), the body size floor rises from 14px to 16px and the type ratio changes from 1.2 to 1.1736. Body text stays readable and Display 1 keeps its desktop 42px. Desktop sizes do not change.
