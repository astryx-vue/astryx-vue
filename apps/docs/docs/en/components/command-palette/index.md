---
layout: component-docs
title: Command Palette
outline: false
footer: false
---

<script setup lang="ts">
import {
  commandPaletteAsync,
  commandPaletteFooter,
  commandPaletteGrouped,
  commandPalettePicker,
  commandPaletteRich,
} from '../../../../components/demos/command-palette'
</script>

## Usage

`CommandPalette` is a searchable command list. It owns the dialog, the search field, grouping, the empty state, and keyboard movement. The commands themselves come from a `SearchSource`. An empty query calls `bootstrap`; a typed query calls `search`.

`isInline` draws the palette in the page instead of a modal. Production palettes leave it off. Opening from a shortcut is the page's job: `useHotkeys` already handles `mod+k`.

```vue
<script setup lang="ts">
import { createStaticSource, useHotkeys } from '@astryx-vue/core'
import { CommandPalette } from '@astryx-vue/core/CommandPalette'
import { ref } from 'vue'

const isOpen = ref(false)
const source = createStaticSource([
  { id: 'home', label: 'Home' },
  { id: 'settings', label: 'Settings' },
])

function openPalette() {
  isOpen.value = true
}

useHotkeys([{ keys: 'mod+k', onPress: openPalette }])
</script>

<template>
  <CommandPalette
    :is-open="isOpen"
    :search-source="source"
    @open-change="isOpen = $event"
  />
</template>
```

`v-model:value` turns the palette into a picker: the matching row stays selected, and choosing a row writes that id. `auxiliaryData.group` splits the list into groups in first-seen order. The `item` slot replaces the row label; `footer` replaces the hint row.

Arrow keys, Home, End, Page Up, and Page Down move the highlight and do not wrap. Enter selects the highlighted row. Escape closes the palette and drops an in-flight search. The highlight stays empty until the pointer or the keyboard moves it.


<ComponentAnatomy />

## Examples

<DemoExample
  :demo="commandPaletteAsync"
  description="Search waits briefly, then filters filenames. An empty query asks for a filename."
  locale="en"
  title="Async search"
/>

<DemoExample
  :demo="commandPaletteGrouped"
  description="Home and Settings sit under Navigation. New File and Save sit under Actions."
  locale="en"
  title="Grouped"
/>

<DemoExample
  :demo="commandPaletteFooter"
  description="The hint row is replaced with a short note."
  locale="en"
  title="Custom footer"
/>

<DemoExample
  :demo="commandPalettePicker"
  description="Light, Dark, and System. The current theme keeps a check mark."
  locale="en"
  title="Picker mode"
/>

<DemoExample
  :demo="commandPaletteRich"
  description="Rows show the command and, when one is set, its shortcut."
  locale="en"
  title="Rich items"
/>
