---
layout: component-docs
title: Dropdown Menu Item
outline: false
footer: false
---

## Usage

Helper component for custom item rendering with consistent styling. Host attributes and DOM event handlers (`aria-`, `data-`, `id`, drag and drop) reach the row root, the element carrying `role="menuitem"`.

```ts
import { DropdownMenuItem } from '@astryx-vue/core/DropdownMenu'
```

```vue
<script setup lang="ts">
import { DropdownMenu, DropdownMenuItem } from '@astryx-vue/core/DropdownMenu'
import { Kbd } from '@astryx-vue/core/Kbd'
</script>

<template>
  <DropdownMenu :button="{ label: 'Actions' }">
    <DropdownMenuItem description="Rename, move, or change the cover" label="Edit project" />
    <DropdownMenuItem label="Duplicate project">
      <template #endContent>
        <Kbd keys="mod+d" />
      </template>
    </DropdownMenuItem>
    <DropdownMenuItem label="Delete project" variant="destructive" />
  </DropdownMenu>
</template>
```
