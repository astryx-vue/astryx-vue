---
layout: component-docs
title: Command Palette Empty
outline: false
footer: false
---

<script setup lang="ts">
import { commandPaletteEmptyBasic } from '../../../../components/demos/command-palette-empty'
</script>

## Usage

Empty state display for the results area. `CommandPalette` renders it automatically when a search returns no results, or when there is no query and `bootstrap()` returns nothing. A long unbroken token, such as a path echoed into the message, wraps instead of widening the centered line. While the first search is still loading, the palette keeps one blank line of height here instead of a message.

```ts
import { CommandPaletteEmpty } from '@astryx-vue/core/CommandPalette'
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="commandPaletteEmptyBasic" title="Basic" description="A command palette with no results, showing a custom empty message via emptyBootstrapText. Use to explain why the palette is empty and what the user can do next." locale="en" />
