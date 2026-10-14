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

Token names are the upstream names (`--color-accent`) or this package's names (`--astryx-color-accent`). A `[light, dark]` tuple becomes `light-dark()`. `mode` is `system` by default, or `light` / `dark`. The outermost `Theme` also writes `data-astryx-theme` and `data-astryx-color-mode` on `document.documentElement`. Nested themes do not.

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

`neutralTheme` is the empty theme. Its colors still come from `@astryx-vue/themes/neutral.css`.

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
