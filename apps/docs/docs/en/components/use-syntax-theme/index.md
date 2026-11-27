---
layout: component-docs
title: useSyntaxTheme
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useSyntaxThemeKeywordColor } from '../../../../components/demos/use-syntax-theme'
</script>

## Usage

Reads syntax colors for a canvas, SVG, or other drawing that cannot use the CSS variables `SyntaxTheme` sets. Call it under a `SyntaxTheme`, or under a `Theme` whose `defineTheme({ syntax })` sets one. It returns `null` when neither is present, so the caller can skip drawing.

```ts
import { useSyntaxTheme } from '@astryx-vue/core/Code'
```

```ts
const syntax = useSyntaxTheme()

const keyword = syntax?.token('keyword')
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Render the drawing under the same `SyntaxTheme` that colors the surrounding code. |
| <Badge variant="success">Do</Badge> | Check for `null` before reading `token`. The hook returns `null` with no syntax theme above it. |
| <Badge variant="error">Don't</Badge> | Copy syntax colors into the canvas by hand. They drift from the active syntax theme. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useSyntaxThemeKeywordColor"
  description="Read the keyword color of the nearest SyntaxTheme with useSyntaxTheme, for drawing that cannot use CSS variables."
  locale="en"
  title="useSyntaxTheme — Keyword Color"
/>
