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

### Overriding theme tokens

`Theme` writes its tokens into a `<style>` that sits inside the wrapper element. The rule selector is `:scope.astryx-theme`, which weighs as much as two classes, and that `<style>` comes later in the document than your stylesheets. So a plain rule on the wrapper loses when it sits inside `@layer astryx.overrides` and names fewer than three classes. Pick one of these:

- Put the override in CSS that is not inside any `@layer`. Unlayered styles beat every layered style, so this always wins. It is the simplest choice.
- Inside `@layer astryx.overrides`, stack at least three classes on the wrapper (`.wrapper.wrapper.wrapper`), or wrap the `Theme` in your own element with an id and select through it (`#brand .wrapper`). `Theme` does not put an `id` on its wrapper, so `#id` alone does not match it.

The same holds for adapted tokens, with or without a matching condition. A value passed in the wrapper's own `style` attribute also wins.

Theme names must be unique. Two `Theme` components with the same `name` share one set of rules. If their values differ, the one that renders later wins for both. Give different themes different names.

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

A `:hover` style applies to the enabled control only. Disabled and `aria-disabled` elements skip it. For `card`, `dialog`, `bottom-sheet`, `dropdown-menu`, `context-menu`, and `segmented-control`, a themed `borderRadius` or `padding` also reaches the inner parts that follow it, such as a card's header corners. On `chat` a themed `borderRadius` and `padding` land on the composer, and on `progress-bar-mark` a themed `width` and `height` land on the tick itself. On `checkbox-input` and `switch` a themed `gap` sets the room between the control and its label, and leaves the room above the status message alone.

Some parts that paint inside a component have targets of their own: `kbd-key` on each key badge in Kbd, `typeahead-popup` on Typeahead's result popup, `calendar-range` and `calendar-range-preview` on Calendar's range band and its hover preview (with `start` and `end` on the band's first and last day), `bottom-sheet-handle` on BottomSheet's grab bar, `mobile-nav-drawer` on MobileNav's drawer panel (reflecting `side`: `start` or `end`, so a theme can paint the panel without the overlay behind it), and `alert-dialog-title` and `alert-dialog-description` on AlertDialog's title and description. Pagination exposes `pagination-list` on its control row (reflecting `variant` and `size`), `pagination-item` on every button cell (the current page's cell reflects `selected`), and `pagination-ellipsis` on the gap marker. The selected tab's underline is the `tab-indicator` target, so a nested theme can run it edge to edge with `insetInline: '0'`. `top-nav` reflects `mode` (`mobile-bar` on the phone bar) and `top-nav-item` reflects `mode` (`drawer` inside the phone menu). `layout-header` and `layout-footer` reflect `container` (`card`, `dialog`, or `bottom-sheet`), so `'container:dialog'` styles a dialog's header without a card's. `toggle-button` reflects `grouped` inside a ToggleButtonGroup. An accent Link takes `--link-hover-color` on hover when a container or theme sets it.

### Status colors

A theme can set only a status fill and still get readable content and text. When a theme sets `--color-<status>`, `--color-<status>-muted`, a surface (`--color-background-surface` or `--color-background-card`), or its content colors (`--color-on-dark`, `--color-on-light`), `defineTheme` works out the roles measured against those colors that the theme leaves unset:

- `--color-on-<status>`: `--color-on-dark` or `--color-on-light`, whichever contrasts more with the fill; pure white or black when neither reaches 4.5:1.
- `--color-text-<status>`: the fill's hue, made lighter or darker until it reaches 4.5:1 on the surface and on cards.
- `--color-on-<status>-muted`: the fill's hue at 4.5:1 on the pale fill.
- `--color-icon-<status>` and `--color-border-<status>` follow the text role.

```ts
const brand = defineTheme({
  name: 'brand',
  tokens: { '--color-success': '#16a34a' },
})
// brand.tokens['--astryx-color-on-success'], ['--astryx-color-text-success'],
// and ['--astryx-color-on-success-muted'] are filled in for both modes.
```

A role you set is never replaced, and fills are never worked out: a fill you leave unset keeps the default. A color you leave unset is read from `STATUS_COLOR_DEFAULTS`. A status whose measured colors are not plain hex or `rgb()`, such as `oklch()`, is left as it is. The worked-out names are listed in `theme.derivedTokens`; a theme that `extends` this one works them out again from its own colors. Adaptation rules do not work them out. To keep a component's previous color, set the matching role yourself, for example `--color-icon-success`.

### Local tokens

`localTokens` holds values only one theme family uses, keyed by their full custom-property name. The name is kept exactly as written; no prefix is added. A shared token name such as `--color-accent` is refused here, because components already read it. A theme that extends this one inherits the local tokens and may change their values. A reference loop among them is an error.

### Adaptations

`adaptations.rules` is an ordered list of `{ when, value }`. `when` can hold a width range by named breakpoint (`sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536 CSS px; change them with `widthBreakpoints`), a `pointer` of `coarse` or `fine`, a `contrast` preference, and a reduced-`motion` preference. Every field in one `when` must match. `value` can set the same things a theme does. A partial type scale, radius, or motion is completed from the theme's own config. Rules apply after the theme, in order, so a later matching rule wins. They apply through CSS only: `useTheme().token()` keeps returning the theme's root values. An adapted token sits after the root tokens with the same selector, so while its condition matches it wins by cascade order; no `!important` is involved. To override an adapted token, follow the rules in [Overriding theme tokens](#overriding-theme-tokens).

### `extends`

`extends` starts from everything another theme resolved to: tokens, local tokens, component styles, `onDark` and `onLight`, adaptations, icons, and indicators. The new theme's own values win. Inherited adaptation rules are worked out again against the new theme's scale.

### Bad values

A token or style value that would end its CSS declaration early, such as `red; } body { display: none`, is dropped with a console warning. The rest of the theme still applies. Valid CSS that only looks unusual, such as a `;` inside a quoted string or a data URL, is kept.

## Tailwind

This package does not ship a Tailwind bridge. Styles are plain CSS variables and `@layer`, so a Tailwind or UnoCSS project can read them directly, for example `bg-[var(--astryx-color-background-surface)]`, or map them in its own theme config.
