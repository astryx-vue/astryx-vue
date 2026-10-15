---
layout: component-docs
title: Dropdown Menu Radio Item
outline: false
footer: false
---

## Usage

`DropdownMenuRadioItem` is one option in a [Dropdown Menu Radio Group](/en/components/dropdown-menu-radio-group). Its role is `menuitemradio`. It has to sit inside that group. The group's value matches this option's `value` to decide which row is checked.

```vue
<script setup lang="ts">
import { DropdownMenu, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@astryx-vue/core/DropdownMenu'
import { ref } from 'vue'

const sort = ref('option-1')
</script>

<template>
  <DropdownMenu :button="{ label: 'Sort' }">
    <DropdownMenuRadioGroup v-model="sort" label="Radio group">
      <DropdownMenuRadioItem value="option-1" label="Option 1" />
    </DropdownMenuRadioGroup>
  </DropdownMenu>
</template>
```

The radio dot is decorative. The whole row is the control. A disabled option stays in the group and cannot be selected.
