---
layout: component-docs
title: Context Menu Item
outline: false
footer: false
---

<script setup lang="ts">
import { contextMenuItemBasic } from '../../../../components/demos/context-menu-item'
</script>

## Usage

Menu item component for compound mode. Re-exported from `DropdownMenuItem` for discoverability.

```ts
import { ContextMenuItem } from '@astryx-vue/core/ContextMenu'
```

One action row inside a [Context Menu](/en/components/context-menu). Reach for it when the panel is written by hand with the `content` slot instead of the `items` array; both forms draw the same row, so the styling cannot drift.

## Examples

Common configurations, variations, and states.

<DemoExample :demo="contextMenuItemBasic" title="Basic" description="Context menu items with labels and secondary descriptions. Use ContextMenuItem to render custom menu entries with consistent styling." locale="en" />
