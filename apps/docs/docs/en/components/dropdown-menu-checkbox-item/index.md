---
layout: component-docs
title: Dropdown Menu Checkbox Item
outline: false
footer: false
---

## Usage

`DropdownMenuCheckboxItem` is one checkable row inside a [Dropdown Menu](/en/components/dropdown-menu). Its role is `menuitemcheckbox`. It toggles its own boolean and leaves the menu open, so several settings can change in one visit. A one-of-N choice belongs in a [Dropdown Menu Radio Group](/en/components/dropdown-menu-radio-group).

```vue
<script setup lang="ts">
import { DropdownMenu, DropdownMenuCheckboxItem } from '@astryx-vue/core/DropdownMenu'
import { ref } from 'vue'

const archived = ref(false)
</script>

<template>
  <DropdownMenu :button="{ label: 'View' }">
    <DropdownMenuCheckboxItem v-model="archived" label="Show archived" />
  </DropdownMenu>
</template>
```

The mark is decorative. The whole row is the control, and the checked state is `aria-checked`. A disabled row stays in the menu, the arrow keys skip it, and a click does not toggle it.
