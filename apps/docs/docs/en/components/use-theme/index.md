---
layout: component-docs
title: useTheme
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useThemeTokenValues } from '../../../../components/demos/use-theme'
</script>

## Usage

Programmatic access to theme tokens for non-CSS consumers like SVG, canvas, Vega, D3, maps, or chart libraries that need values in JavaScript instead of CSS custom property references.

```ts
import { useTheme } from '@astryx-vue/core/Theme'
```

```ts
const { mode, token, tokens } = useTheme()

const accent = token('--color-accent')
const categorical = tokens.value['--color-data-categorical-blue']
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use `tokens` or `token(name)` when integrating theme colors into SVG attributes, canvas drawing, chart options, or other non-CSS configuration objects inside Vue components. |
| <Badge variant="success">Do</Badge> | Prefer CSS variables for ordinary component styling; use this hook only when JavaScript needs token values. |
| <Badge variant="success">Do</Badge> | Use data visualization tokens such as `--color-data-categorical-blue` for chart series instead of arbitrary UI colors. |
| <Badge variant="error">Don't</Badge> | Hardcode light/dark colors in data visualizations: resolve them through the current theme instead. |
| <Badge variant="error">Don't</Badge> | Assume the hook reflects every CSS cascade override. It resolves tokens for the current `Theme` mode; local media-surface overrides and arbitrary external CSS may not be represented. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useThemeTokenValues"
  description="Read resolved theme token values with useTheme for non-CSS consumers like SVG charts."
  locale="en"
  title="useTheme — Token Values"
/>
