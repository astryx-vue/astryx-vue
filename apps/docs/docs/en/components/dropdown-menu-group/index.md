---
layout: component-docs
title: Dropdown Menu Group
outline: false
footer: false
---

## Usage

A titled group of rows in a compound menu. Renders `role="group"` named by its heading; the heading is plain text, not a `menuitem`, so arrow keys and typeahead skip it. The data-driven equivalent is the `{type: "section", title, items}` entry in `items`; the heading shares its typography and theme target.

```ts
import { DropdownMenuGroup } from '@astryx-vue/core/DropdownMenu'
```

```vue
<script setup lang="ts">
import { DropdownMenu, DropdownMenuGroup, DropdownMenuItem } from '@astryx-vue/core/DropdownMenu'
</script>

<template>
  <DropdownMenu :button="{ label: 'View' }">
    <DropdownMenuGroup title="View">
      <DropdownMenuItem label="Show archived" />
      <DropdownMenuItem label="Compact rows" />
    </DropdownMenuGroup>
  </DropdownMenu>
</template>
```
