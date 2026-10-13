---
title: Extending a theme
---

# Extending a theme

`@astryx-vue/themes` ships Neutral, Butter, Chocolate, Gothic, Matcha, Stone, and Y2K. Each one is a CSS entry such as `butter.css` plus the stylesheets in that theme's directory. There is no runtime theme registry.

Change the look by overriding CSS variables. Put the override in the `astryx.overrides` layer so it beats the token layer without rewriting structural styles:

```css
@layer astryx.overrides {
  :root {
    --astryx-color-text-primary: light-dark(#1a1a1a, #f5f5f5);
    --astryx-radius-element: 0.5rem;
  }
}
```

Load that sheet after the theme CSS, for example `@astryx-vue/themes/neutral.css`. To change one subtree in Vue, wrap it in [`Theme`](/en/components/theme) and pass a `defineTheme()` object. That writes the variables on the subtree and rebinds text, heading, and button aliases that would otherwise stay stuck on the `:root` values. Every theme selects `[data-astryx-theme='…']`. Neutral also selects `:root`, so importing `neutral.css` applies it globally. The other themes stay on the attribute.

When one component has to diverge, override the variable from that theme's component file, for example `--astryx-button-primary-background` in `packages/themes/neutral/button.css`. Use the names in that file.

Overriding `--astryx-*` variables is the extension path. The shipped themes already do that under their own attribute.

Do not keep a separate dark palette. Colors are already `light-dark()`. Switching is described in [Dark mode](/en/guide/dark-mode).
