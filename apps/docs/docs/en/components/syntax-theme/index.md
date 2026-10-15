---
layout: component-docs
title: Syntax Theme
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { syntaxThemeDark, syntaxThemeLight } from '../../../../components/demos/syntax-theme'
</script>

## Usage

`SyntaxTheme` is the provider for code colors. It sets `--astryx-code-syntax-*` and `--astryx-code-block-background` for every `CodeBlock` inside it. `useSyntaxTheme()` reads the nearest syntax theme, including one set with `defineTheme({ syntax })`.

A single block can take the `syntaxTheme` prop instead of a wrapper. Use the wrapper when a region of code should share one preset.

Presets are exported from `@astryx-vue/core/Code`: `oneDarkPro`, `dracula`, `monokai`, `nord`, `tokyoNight`, `catppuccinMocha`, `githubDark`, `githubLight`, `solarizedLight`, `oneLight`, `catppuccinLatte`, and `tokyoNightLight`. `defineSyntaxTheme()` builds another one. All 14 color tokens are required. Five diff slots are optional and use the same `--astryx-code-syntax-*` names: `added`, `removed`, `diff-header`, `added-marker`, and `removed-marker`. Leave them out and the markers follow the punctuation color, with no extra header paint. A `[light, dark]` tuple is stored as `light-dark()`.

```vue
<script setup lang="ts">
import { CodeBlock, dracula, SyntaxTheme } from '@astryx-vue/core/Code'

const code = `const status = response.ok ? 'success' : 'error'`
</script>

<template>
  <SyntaxTheme :theme="dracula">
    <CodeBlock :code="code" language="ts" />
  </SyntaxTheme>
</template>
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Set <code>syntax</code> on <code>defineTheme()</code> when the whole app should share one code palette. |
| <Badge variant="success">Do</Badge> | Use <code>SyntaxTheme</code> when one section needs a different preset. |
| <Badge variant="success">Do</Badge> | Pass <code>syntaxTheme</code> on a single <code>CodeBlock</code> instead of wrapping that one block. |
| <Badge variant="error">Don't</Badge> | Recolor a code block with one-off CSS. A preset keeps the token colors and the background together. |

## Examples


<DemoExample
  :demo="syntaxThemeDark"
  description="Wrap a code block in SyntaxTheme to apply a dark syntax preset such as Dracula."
  locale="en"
  title="SyntaxTheme — Dark Preset"
/>

<DemoExample
  :demo="syntaxThemeLight"
  description="Use a light syntax preset for code examples that need to sit on light documentation surfaces."
  locale="en"
  title="SyntaxTheme — Light Preset"
/>
