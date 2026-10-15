---
layout: component-docs
title: Dropdown Menu Radio Group
outline: false
footer: false
---

## Usage

`DropdownMenuRadioGroup` is a single-select set of radio rows inside a [Dropdown Menu](/en/components/dropdown-menu). Its role is `group`, and each option is a [Dropdown Menu Radio Item](/en/components/dropdown-menu-radio-item) with role `menuitemradio`. The group owns the selected value and lays the options out with the menu's own gap. Choosing one closes the menu, because the choice is made.

```vue
<script setup lang="ts">
import { DropdownMenu, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@astryx-vue/core/DropdownMenu'
import { ref } from 'vue'

const sort = ref('newest')
</script>

<template>
  <DropdownMenu :button="{ label: 'Sort' }">
    <DropdownMenuRadioGroup v-model="sort" label="Sort by">
      <DropdownMenuRadioItem value="newest" label="Newest" />
      <DropdownMenuRadioItem value="oldest" label="Oldest" />
    </DropdownMenuRadioGroup>
  </DropdownMenu>
</template>
```

`label` is the accessible name of the set, so the options are announced together. Leave the value unset when nothing is selected yet.
