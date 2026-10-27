---
title: Browser support
---

# Browser support

These components solve styling and layering with what browsers ship, not with JavaScript patches. The upside is small code, good accessibility, and no extra dependency. The cost is a floor: older browsers lose pieces.

The floor first.

| Browser | Minimum version |
| --- | --- |
| Chrome, Edge | 123 |
| Safari (including iOS) | 17.5 |
| Firefox | 120 |

`light-dark()` sets that floor, because nearly every color variable is written as `light-dark(light value, dark value)`. An older browser does not understand the function, drops the whole declaration, and the page is left without its colors.

## What we actually use

Every row below appears in `packages/core/styles`; none of it is copied from the upstream checklist.

| Feature | Where it is used | Chrome | Safari | Firefox |
| --- | --- | --- | --- | --- |
| `light-dark()` | Every theme color variable | 123 | 17.5 | 120 |
| `@layer` | First line of every stylesheet, declaring the five `astryx.*` layers | 99 | 15.4 | 97 |
| `:has()` | Form state, lists, chat, and tabs, where a parent style depends on a child | 105 | 15.4 | 121 |
| `color-mix()` | Hover tints, sliders, code blocks, and other derived colors | 111 | 16.2 | 113 |
| `@property` | Registers the custom property behind the press animation so it can animate as a number | 85 | 16.4 | 128 |
| Popover API | Menus, tooltips, the command palette, and the toast viewport use native `popover` and `popovertarget` | 114 | 17 | 125 |
| `<dialog>` and `showModal()` | Dialogs, bottom sheets, and the lightbox | 37 | 15.4 | 98 |
| `@starting-style` | Entry animation start values for overlays, sheets, and toasts | 117 | 17.5 | 129 |
| Container queries `@container` | Pagination, steppers, and chat adapting to their own width | 105 | 16 | 110 |
| `text-wrap: balance` / `pretty` | Balanced headings, and body text that avoids a lone last word | 114 | 17.5 | 121 |
| `:dir()` | Direction checks in a few places, such as the slider | 120 | 16.4 | 49 |
| Logical properties | Padding, margin, radius, and offsets written as `padding-inline-start` and friends | 87 | 14.1 | 66 |

`@property` and `@starting-style` are "missing is fine": without them the press animation and the entry animation simply do not play, and the interface still works. `light-dark()` is what actually sets the floor.

The versions follow MDN and caniuse as of when this page was written. When in doubt, search caniuse for the feature name.

## Below the floor

- **Colors drop out.** `light-dark()` is not understood, `--astryx-color-*` resolves to nothing, and text may fall back to default black.
- **Overlays open, but may not sit next to the trigger.** Without the native popover API, menus and tooltips still open; CSS fallback positioning is less exact.
- **Dialogs may not open at all.** There is no fallback path when `showModal()` is unavailable.
- **Animations stop.** Entry and press motion disappear; content still shows.

Nothing goes to a blank page. The visuals just stop matching the design, which is why older browsers are not supported.

## Supporting older browsers anyway

We do not ship a fallback build for old browsers, and there is no bundled polyfill. Three options.

**1. If your audience is old, hold the floor.** Internal tools can usually push a browser update. That is the cheapest path.

**2. Detect with `@supports` and supply your own colors.** Check for `light-dark()` at the app entry and write fixed light values when it is missing:

```css
@supports not (color: light-dark(#fff, #000)) {
  :root {
    --astryx-color-text-primary: #000000;
    --astryx-color-background-surface: #ffffff;
  }
}
```

That restores colors only. Overlay positioning and animation do not improve.

**3. Needing full function on an old browser means changing code.** That covers a popover fallback, a `@starting-style` fallback, or rewriting the affected overlays in your project. That work is outside this library.

## Compatibility details already handled

- **iOS zooms the page on focus.** On iOS, focusing an input whose font size is below 16px zooms the page. Every input component lifts its font size to at least `1rem` on touch devices, using `@supports (-webkit-touch-callout: none)` so the rule only applies on iOS.
- **Reduced motion.** One global `prefers-reduced-motion: reduce` rule flattens the distance, scale, and opacity deltas of entry and exit motion, and components add their own opt-outs. With the system setting on, animation does not play.
- **Scrollbars.** Scrollbar styling lives in one file, `scrollbars.css`, implemented with the `overlayscrollbars` runtime dependency. Colors are derived from the text color with `color-mix()`, so dark mode follows.

## Check your own browser

Paste this in the console to see which pieces your browser lacks.

```js
const checks = {
  'light-dark()': CSS.supports('color', 'light-dark(#fff, #000)'),
  '@layer': CSS.supports('at-rule', '@layer a, b;'),
  ':has()': CSS.supports('selector(:has(*))'),
  'color-mix()': CSS.supports('color', 'color-mix(in oklab, red, blue)'),
  'Popover API': typeof HTMLElement.prototype.showPopover === 'function',
  '@container': CSS.supports('container-type', 'inline-size'),
}
console.table(checks)
```

Any `false` maps to a row in the table above. When `light-dark()` is `false`, page colors are effectively unusable.
