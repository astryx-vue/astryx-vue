---
title: CSS variables
---

# CSS variables

Themes and component styles use CSS variables and cascade layers. You do not install UnoCSS or StyleX to use them.

`packages/themes/neutral/base.css` declares the layer order:

```css
@layer astryx.reset, astryx.tokens, astryx.base, astryx.components, astryx.overrides;
```

Semantic tokens sit in `astryx.tokens`. Structural component styles sit in `astryx.components` and come from `@astryx-vue/core`. Application overrides belong in the last layer, `astryx.overrides`. Unlayered styles, and later layers, both beat earlier layers.

Names follow the upstream tokens and add `--astryx-`. The primary text color is `--astryx-color-text-primary`. Colors are written as:

```css
--astryx-color-text-primary: light-dark(#171717, #fafafa);
```

`light-dark()` reads the element's `color-scheme`. Neutral sets `color-scheme: light dark` on `:root` and `[data-astryx-theme='neutral']`, so the result follows the system or whatever the docs site already set. Forcing one side is described in [Dark mode](/en/guide/dark-mode). [`Theme`](/en/components/theme) can set the same variables on one subtree.

Components also have their own variables, such as `--astryx-button-primary-background`. Those names are defined in `packages/themes/neutral/<component>.css` and usually point at a semantic token. Prefer overriding the semantic token. Override the component variable only when that component has to diverge.

`@astryx-vue/core/reset.css` is a single declaration, `@layer astryx.reset`. It is not a browser reset. Import it only when you need that layer to exist first.

Load every structural sheet at once with:

```ts
import '@astryx-vue/core/styles.css'
```

Importing a component from a subpath such as `@astryx-vue/core/Button` loads that component's structural sheet. The theme is still a separate import. See [Theme and styles](/en/guide/styling).
