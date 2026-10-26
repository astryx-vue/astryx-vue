---
title: Principles
---

# Design principles

Every decision in this library follows from four sentences.

- **Components before raw HTML.** For anything a component already covers, don't hand-write the markup and restyle it.
- **Semantic tokens, not hardcoded values.** Colors, spacing, and radii are named by purpose, not by appearance. The name says "body text primary", not "dark grey".
- **App code knows nothing about the theme.** No hex colors and no pixel values in your own styles, so a theme swap or dark mode follows automatically.
- **The internals are open.** Every component is exported and composable. Build on top of one instead of fighting it.

## Eight hard rules

1. If a component covers it, don't hand-write it.
2. Lay out from the outside in: pick the frame and the regions before writing content. See [Page layout](/en/guide/layout).
3. Dense data renders as rows: `Table`, or a `List` with dividers, one item per row. `Card` is for self-contained widgets, galleries, and groups of settings.
4. Custom styles are plain CSS in `@layer astryx.overrides`. To mix in utility classes, see [Theme and styles](/en/guide/styling).
5. Colors, spacing, and radii come from semantic variables: `var(--astryx-color-text-primary)`, `var(--astryx-spacing-4)`.
6. Forms bind with `v-model`. `TextInput` and `CheckboxInput` require a value; there is no uncontrolled mode.
7. Navigation uses `as` to render `RouterLink` as the root element, or a `LinkProvider` at the top of the app. Don't hard-code `<a href>`.
8. When a prop is unclear, look it up: `astryx-vue component Button`. Don't guess, and don't invent props.

## How theme independence works

A theme file holds variables and no structure. Every color variable reads like this.

```css
--astryx-color-text-primary: light-dark(#171717, #fafafa);
```

`light-dark()` picks the light or the dark value from the current `color-scheme`, so writing `var(--astryx-color-text-primary)` is all your code needs; dark mode comes for free and there is no second stylesheet to keep in sync.

Component structure uses the same variables. Swap the theme to Gothic and every color in the page changes, with no edit to app code.

## Do and don't

| Guidance | Practice |
| --- | --- |
| Do | Place content with `HStack`, `VStack`, and `Grid`; they carry no color and no border. |
| Do | Write colors as `var(--astryx-color-*)` and spacing as `var(--astryx-spacing-*)`. |
| Do | When a component's behavior is unclear, run `astryx-vue component <Name>` first. |
| Don't | Stack inline styles on raw elements to get around a component. |
| Don't | Hardcode colors (`#fff`) or spacing (`16px`). |
| Don't | Write `<a href="/orders">` by hand; in-app navigation then reloads the page. |
| Don't | Wrap every list item and every page section in a `Card`. |
| Don't | Use `Badge` as decoration. It carries meaning: status, category, count. For a decorative value chip use `Token`; for a single status dot use `StatusDot`. |

## About styling

Upstream Astryx supports StyleX; we don't. Our approach is plain CSS plus CSS variables: component styles live in `@layer`, so a rule you write in the `astryx.overrides` layer wins without out-specificity tricks.

The full layer order, how to arrange `@layer`, and how to use Tailwind or UnoCSS alongside: [Theme and styles](/en/guide/styling).
