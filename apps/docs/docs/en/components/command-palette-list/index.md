---
layout: component-docs
title: Command Palette List
outline: false
footer: false
---

<script setup lang="ts">
import { commandPaletteListBasic } from '../../../../components/demos/command-palette-list'
</script>

## Usage

Scrollable results container. Renders as a listbox standalone, and inside `CommandPalette` while selectable results exist. Contains `CommandPaletteItem` and `CommandPaletteGroup` children.

```ts
import { CommandPaletteList } from '@astryx-vue/core/CommandPalette'
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="commandPaletteListBasic" title="Item States" description="Flat list showing the highlighted, selected, and disabled item states. Use CommandPaletteGroup to add section headings." locale="en" />
