---
title: Extending a theme
---

# Extending a theme

`@astryx-vue/themes` ships Neutral, Butter, Chocolate, Gothic, Matcha, Stone, and Y2K. Each one is a CSS entry such as `butter.css` plus the stylesheets in that theme's directory. There is no runtime theme registry.

## Override variables

Change the look by overriding CSS variables. Put the override in the `astryx.overrides` layer so it beats the token layer without rewriting structural styles:

```css
@layer astryx.overrides {
  :root {
    --astryx-color-text-primary: light-dark(#1a1a1a, #f5f5f5);
    --astryx-radius-element: 0.5rem;
  }
}
```

Load that sheet after the theme CSS, for example `@astryx-vue/themes/neutral.css`.

Every theme selects `[data-astryx-theme='…']`. Neutral also selects `:root`, so importing `neutral.css` applies it globally. The other themes stay on the attribute.

When one component has to diverge, override the variable from that theme's component file, for example `--astryx-button-primary-background` in `packages/themes/neutral/button.css`. Use the names in that file.

Do not keep a separate dark palette. Colors are already `light-dark()`. Switching is described in [Dark mode](/en/guide/dark-mode).

## Build a theme in Vue

To change one subtree, wrap it in [`Theme`](/en/components/theme) and pass a `defineTheme()` object. `color`, `typography`, `radius`, and `motion` generate a token set from a few numbers. The seven shipped themes stay handwritten CSS.

```ts
import { defineTheme } from '@astryx-vue/core/Theme'

const brand = defineTheme({
  name: 'brand',
  // One hex, or a light seed and a dark seed.
  color: { accent: ['#0064E0', '#48CAE4'] },
  typography: { scale: { base: 14, ratio: 1.2 } },
  // Values only this theme family uses. Names stay as written.
  localTokens: { '--brand-ink': ['#0A2540', '#E6F0FF'] },
  components: {
    'button': { 'variant:primary': { borderRadius: '999px' } },
    'card-header': { base: { color: 'var(--brand-ink)' } },
  },
  // Larger body text on touch screens narrower than the lg breakpoint.
  adaptations: {
    rules: [{
      when: { pointer: 'coarse', width: { below: 'lg' } },
      value: { typography: { scale: { base: 16, ratio: 1.1736 } } },
    }],
  },
})
```

### Theme targets

Keys under `components` are theme targets, named `<component-kebab>-<part>`: `button`, `card-header`, `radio-indicator`, `progress-bar-fill`. Each target is a stable `astryx-*` class on one element. Style keys under a target match the attributes that element reflects: `variant:primary` matches `[data-variant="primary"]`, a state such as `checked` matches `[data-checked="checked"]`, and `+` joins two keys.

Run-together and camelCase names are not targets. `defineTheme()` throws for `buttonIcon` or `Card`, and a run-together name such as `progressbar` matches nothing. Upstream removed these spellings in 0.7.0; this package follows. The old names and their replacements:

| Removed | Use |
| --- | --- |
| `base-table` | `table` |
| `checkbox` | `checkbox-indicator` |
| `codeblock`, `codeblock-copy-button`, `codeblock-header`, `codeblock-title` | `code-block`, `code-block-copy-button`, `code-block-header`, `code-block-title` |
| `date-input-clear-icon`, `date-range-input-clear-icon`, `multi-selector-clear-icon`, `selector-clear-icon` | `input-clear-icon` |
| `hovercard` | `hover-card` |
| `navicon` | `nav-icon` |
| `popover-surface` | `popover` |
| `progressbar`, `progressbar-fill`, `progressbar-mark`, `progressbar-track` | `progress-bar`, `progress-bar-fill`, `progress-bar-mark`, `progress-bar-track` |
| `radio`, `radio-dot` | `radio-indicator`, `radio-indicator-dot` |
| `statusdot` | `status-dot` |
| `textarea` | `text-area` |

Components also do not render bare value classes such as `.primary` or `.sm`. A selector like `.astryx-button.primary` in your own CSS becomes `.astryx-button[data-variant="primary"]`.

A `:hover` style applies to the enabled control only. Disabled and `aria-disabled` elements skip it. For `card`, `dialog`, `bottom-sheet`, `dropdown-menu`, `context-menu`, and `segmented-control`, a themed `borderRadius` or `padding` also reaches the inner parts that follow it, such as a card's header corners. On `chat` a themed `borderRadius` and `padding` land on the composer, and on `progress-bar-mark` a themed `width` and `height` land on the tick itself.

### Local tokens

`localTokens` holds values only one theme family uses, keyed by their full custom-property name. The name is kept exactly as written; no prefix is added. A shared token name such as `--color-accent` is refused here, because components already read it. A theme that extends this one inherits the local tokens and may change their values. A reference loop among them is an error.

### Adaptations

`adaptations.rules` is an ordered list of `{ when, value }`. `when` can hold a width range by named breakpoint (`sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536 CSS px; change them with `widthBreakpoints`), a `pointer` of `coarse` or `fine`, a `contrast` preference, and a reduced-`motion` preference. Every field in one `when` must match. `value` can set the same things a theme does. A partial type scale, radius, or motion is completed from the theme's own config. Rules apply after the theme, in order, so a later matching rule wins. They apply through CSS only: `useTheme().token()` keeps returning the theme's root values. An adapted token is written with `!important`, so while its condition matches it overrides stylesheet declarations and plain inline values for the same token on the `Theme` wrapper. To override it, set the value on a child element, or use `!important` yourself.

### `extends`

`extends` starts from everything another theme resolved to: tokens, local tokens, component styles, `onDark` and `onLight`, adaptations, icons, and indicators. The new theme's own values win. Inherited adaptation rules are worked out again against the new theme's scale.

### Bad values

A token or style value that would end its CSS declaration early, such as `red; } body { display: none`, is dropped with a console warning. The rest of the theme still applies. Valid CSS that only looks unusual, such as a `;` inside a quoted string or a data URL, is kept.

## Tailwind

This package does not ship a Tailwind bridge. Styles are plain CSS variables and `@layer`, so a Tailwind or UnoCSS project can read them directly, for example `bg-[var(--astryx-color-background-surface)]`, or map them in its own theme config.
