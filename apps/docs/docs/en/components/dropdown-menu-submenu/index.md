---
layout: component-docs
title: Dropdown Menu Submenu
outline: false
footer: false
---

## Usage

A single menu row that reveals a nested flyout of its own items. The row adopts `DropdownMenuItem` semantics (`label` / `icon` / `description` / `isDisabled`); its children become the flyout content. Opens inline-end with viewport auto-flip; Right/Enter/Space opens and focuses the first item, Left/Escape closes and returns focus to the trigger (Right/Left swap in RTL). On a phone (a coarse pointer, decided when the menu opened) the row drills in instead: its rows replace the menu's rows in the same box, led by a Back row named "Back to \<parent\>", and Back, Escape or ArrowLeft return to the row. Host attributes and DOM event handlers (`aria-`, `data-`, `id`) reach the trigger row, the element carrying `role="menuitem"` and `aria-haspopup="menu"`; a caller's handlers run after the row's own, except for the keys that open the flyout (the open arrow, Enter, Space) and a click on a disabled row. For data-driven menus, give a menu item a nested `items` array instead of using this component directly.

```ts
import { DropdownMenuSubMenu } from '@astryx-vue/core/DropdownMenu'
```

```vue
<script setup lang="ts">
import { DropdownMenu, DropdownMenuItem, DropdownMenuSubMenu } from '@astryx-vue/core/DropdownMenu'
</script>

<template>
  <DropdownMenu :button="{ label: 'Actions' }">
    <DropdownMenuItem label="Rename" />
    <DropdownMenuSubMenu label="Move to">
      <DropdownMenuItem label="Projects" />
      <DropdownMenuItem label="Archive" />
      <DropdownMenuItem label="Trash" />
    </DropdownMenuSubMenu>
  </DropdownMenu>
</template>
```
