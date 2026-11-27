---
layout: component-docs
title: Dropdown Menu Item
outline: false
footer: false
---

## Usage

One action or destination row of a compound `DropdownMenu`. The parent menu owns keyboard navigation; the row owns activation, disabled state, destination behavior, and content layout. Keep `label`, `description`, `icon`, and `endContent` non-interactive: each row is one interactive target, and controls belong in separate rows or the menu `header` or `footer`. Use `href` for a destination so link providers, modified clicks, and middle clicks keep working, and `hasCloseOnSelect=false` only when activation reports a result in place on the same row. Host attributes and DOM event handlers (`aria-`, `data-`, `id`, drag and drop) reach the row root, the element carrying `role="menuitem"`.

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
