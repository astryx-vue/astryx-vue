---
layout: component-docs
title: Toggle Button Group
outline: false
footer: false
---

<script setup lang="ts">
import { toggleButtonGroupSelection, toggleButtonGroupVertical } from '../../../../components/demos/toggle-button-group'
</script>

## Usage

`ToggleButtonGroup` keeps the pressed state of its `ToggleButton` children. Each child needs a `value`. The group's `v-model:value` replaces that button's own pressed state.

`type="single"` keeps one button pressed. Pressing it again clears the selection, and the value is `null`. `type="multiple"` presses buttons independently, and the value is a list. `orientation` is `horizontal` or `vertical`. `label` is the group's accessible name.

```vue
<script setup lang="ts">
import { ToggleButton, ToggleButtonGroup } from '@astryx-vue/core/ToggleButton'
import { ref } from 'vue'

const view = ref<string | null>('grid')
</script>

<template>
  <ToggleButtonGroup v-model:value="view" label="View mode">
    <ToggleButton label="List" value="list" />
    <ToggleButton label="Grid" value="grid" />
    <ToggleButton label="Board" value="board" />
  </ToggleButtonGroup>
</template>
```

## Examples

<DemoExample
  :demo="toggleButtonGroupSelection"
  description="Toggle button groups in single-select and multi-select modes. Single selection acts as a view mode switcher; multiple selection forms a formatting toolbar."
  locale="en"
  title="Group"
/>

<DemoExample
  :demo="toggleButtonGroupVertical"
  description="A vertically stacked ToggleButtonGroup using the vertical orientation, shown with both single-select and multi-select behavior."
  locale="en"
  title="Vertical"
/>
