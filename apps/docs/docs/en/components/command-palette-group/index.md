---
layout: component-docs
title: Command Palette Group
outline: false
footer: false
---

<script setup lang="ts">
import { commandPaletteGroupBasic } from '../../../../components/demos/command-palette-group'
</script>

## Usage

Visual grouping with a heading label. Place inside `CommandPaletteList`.

```ts
import { CommandPaletteGroup } from '@astryx-vue/core/CommandPalette'
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="commandPaletteGroupBasic" title="Basic" description="Command palette items organized under group headings using the composed CommandPaletteGroup form. Use to separate related commands into labeled sections." locale="en" />
