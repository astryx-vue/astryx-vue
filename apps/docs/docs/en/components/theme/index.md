---
layout: component-docs
title: Theme
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { themeApply, themeNested, themeSwitcher } from '../../../../components/demos/theme'
</script>

## Usage

`Theme` is the theme provider. It applies a `defineTheme()` object to its subtree with CSS variables, and descendants read that theme with `useTheme()`. There is no separate provider component.

Token names are the upstream names (`--color-accent`) or this package's names (`--astryx-color-accent`). A `[light, dark]` tuple becomes `light-dark()`. `mode` is `system` by default, or `light` / `dark`. A `system` Theme takes the light or dark scheme of the page around it: the page root's `color-scheme`, else its `<meta name="color-scheme">`, and the reader's setting when the root names both (`reset.css` does). It declares no scheme of its own, so a host that draws the page dark gets the dark theme inside too. Under a `Theme` that forces light or dark, a `system` Theme follows the reader again. See [Dark mode](/en/guide/dark-mode). The outermost `Theme` also writes `data-astryx-theme` and `data-astryx-color-mode` on `document.documentElement`. Nested themes do not.

`syntax` on the theme object sets code colors for the subtree. A closer `SyntaxTheme` wins. Import the component from `@astryx-vue/core/Theme`.

```vue
<script setup lang="ts">
import { defineTheme, Theme } from '@astryx-vue/core/Theme'

const ocean = defineTheme({
  name: 'ocean',
  tokens: {
    '--color-accent': ['#0077B6', '#48CAE4'],
    '--color-background-surface': ['#F0F8FF', '#0A1628'],
    '--color-text-primary': ['#0A1317', '#FFFFFF'],
    '--radius-container': '16px',
  },
})
</script>

<template>
  <Theme :theme="ocean">
    <p>Ocean</p>
  </Theme>
</template>
```

`neutralTheme` is the empty theme. Its colors still come from `@astryx-vue/themes/neutral.css`. The seven shipped themes stay handwritten CSS. They are not rebuilt from the generators below.

Text inside a `Theme` that sets no size or line height of its own takes the theme's body size and body leading (`--text-body-leading`), so plain text in a Card or Stack moves when a theme changes them. To keep a different line height, set one on your own container.

## Generated from a few numbers

`color`, `typography`, `radius`, and `motion` fill tokens on the theme object. A matching `tokens` entry wins. A reference such as `var(--color-accent)` is rewritten to the `--astryx-` name.

`color.accent` is one hex color, or `[light, dark]`. The palette is HCT: hue and chroma come from the seed, tone walks a fixed ramp, and the stops are paired into light and dark. Omit the accent and set `neutralStyle` to recolor only the neutrals. `--color-on-accent` is baked from the seed so the contrast holds. The muted, text, and icon accent tokens reference `--color-accent`, so a later accent override carries them along.

Type sizes come from `typography.scale` `base` and `ratio`, rounded from `base × ratio` at each step. Radii come from `radius` `base` and `multiplier`. `none` and `full` stay fixed. Durations come from `motion` `fast`, `medium`, `slow`, and `ratio`. The min step multiplies the base by the ratio, and the max step divides by it. Both round to 5 milliseconds. `motion` also takes `tempo` (overall pace, 0.75 to 1.5) and `character` (the entrance and move curves: `'crisp'`, `'standard'`, `'expressive'`); see [Motion](/en/guide/motion).

`palette` takes the colors from a few seeds. `themePalette()` from `@astryx-vue/core/palette` grows a palette from `accent`, `neutral`, `success`, `warning`, `danger` and `info` seeds (plus `vibrancy`, 0 to 100, and `recipe`), then maps it to the color tokens: surfaces, text, borders, icons, the accent, the four status colors, and the content on each fill. It also lifts secondary text on the accent tint, the neutral track and the colored cards, as Neutral does. Explicit `tokens` and `components` still win, one by one. A palette that names no `recipe` runs `astryx-oklch-v1`; name `astryx-oklch-v2` for pale stops that follow the vibrancy. With a `neutral` seed, a pinned recipe keeps the generated shades across upgrades. Without one, the surfaces are the defaults, so shades picked against them follow the installed version. The generator ships only in apps that import `@astryx-vue/core/palette`. Pass anything else (a plain object of seeds) to `palette` and `defineTheme()` throws.

```ts
import { themePalette } from '@astryx-vue/core/palette'

const acme = defineTheme({
  name: 'acme',
  palette: themePalette({ accent: '#5b3cc4', neutral: '#6b6b70', danger: '#d1242f', vibrancy: 50 }),
  // An explicit token still wins over the palette.
  tokens: { '--color-on-accent': ['#ffffff', '#000000'] },
})
```

`components` overrides styles by theme target, written `<component-kebab>-<part>`, such as `button` or `card-header`. `base` hits the target itself. `variant:secondary` hits `[data-variant="secondary"]`. `Theme` puts the compiled rules in the `astryx.overrides` layer, scoped to its `data-astryx-theme` subtree and stopping at a nested theme. `localTokens`, `adaptations`, removed target names, and `extends` are covered in [Extending a theme](/en/guide/extending-themes). The semantic icon table is still `icons`: a name points at an Iconify id.

```ts
const brand = defineTheme({
  name: 'brand',
  color: { accent: '#0064E0' },
  typography: { scale: { base: 14, ratio: 1.2 } },
  radius: { base: 4, multiplier: 1 },
  motion: { fast: 125, medium: 300, slow: 700, ratio: 0.75 },
})
```

For the tokens alone, call `expandColorScale`, `expandTypeScale`, `expandRadiusScale`, or `expandMotionScale`. They return the unprefixed names. Pass that object to `defineTheme()` as `tokens`.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Pass token names with the `--` prefix, such as `--color-accent` or `--astryx-color-accent`. |
| <Badge variant="success">Do</Badge> | Use a `[light, dark]` tuple when the two modes differ. |
| <Badge variant="success">Do</Badge> | Nest `Theme` when one region needs a different theme. |
| <Badge variant="error">Don't</Badge> | Use `Theme` to flip a single image overlay. That is `MediaTheme`. |

## Examples


<DemoExample
  :demo="themeApply"
  description="Wrap a subtree in Theme to apply a theme to every child component in that region."
  locale="en"
  title="Theme — Apply Theme"
/>

<DemoExample
  :demo="themeNested"
  description="Nested Theme providers let a local region use a different theme without affecting the rest of the page."
  locale="en"
  title="Theme — Nested Theme"
/>

<DemoExample
  :demo="themeSwitcher"
  description="Use state to switch the theme object passed to Theme and preview a different visual treatment."
  locale="en"
  title="Theme — Switch Themes"
/>
