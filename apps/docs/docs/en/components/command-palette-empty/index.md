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

Empty state display for the results area. Rendered automatically by `CommandPalette` for no-results and no-query states.

```ts
import { CommandPaletteEmpty } from '@astryx-vue/core/CommandPalette'
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="commandPaletteEmptyBasic" title="Basic" description="A command palette with no results, showing a custom empty message via emptyBootstrapText. Use to explain why the palette is empty and what the user can do next." locale="en" />
