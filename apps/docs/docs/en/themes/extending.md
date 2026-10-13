---
title: Extending a theme
---

# Extending a theme

`@astryx-vue/themes` exports `neutral.css`, `fonts.css`, and the stylesheets under `neutral/`. There is no second theme, and no runtime theme registry. The butter, chocolate, and other themes in the upstream docs are not part of this package.

Change the look by overriding CSS variables. Put the override in the `astryx.overrides` layer so it beats the token layer without rewriting structural styles:

```css
@layer astryx.overrides {
  :root {
    --astryx-color-text-primary: light-dark(#1a1a1a, #f5f5f5);
    --astryx-radius-element: 0.5rem;
  }
}
```

Load that sheet after `@astryx-vue/themes/neutral.css`. To change one subtree in Vue, wrap it in [`Theme`](/en/components/theme) and pass a `defineTheme()` object. That writes the variables on the subtree and rebinds text, heading, and button aliases that would otherwise stay stuck on the `:root` values. Neutral's selectors already include `[data-astryx-theme='neutral']`, so the attribute can mark a subtree. The selectors also include `:root`, so once the theme is imported the variables are global by default.

When one component has to diverge, override the variable from `packages/themes/neutral/<component>.css`, for example `--astryx-button-primary-background`. Use the names in that file.

Copying `neutral.css` and rewriting the selector is not a supported theme. The component theme files select `neutral`. The supported extension approach is overriding `--astryx-*` variables.

Do not keep a separate dark palette. Colors are already `light-dark()`. Switching is described in [Dark mode](/en/guide/dark-mode).
