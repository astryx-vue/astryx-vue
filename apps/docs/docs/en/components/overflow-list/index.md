---
layout: component-docs
title: Overflow List
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { overflowListActions, overflowListBadges, overflowListCapped, overflowListCollapseStart, overflowListMultiRow } from '../../../../components/demos/overflow-list'
</script>

## Usage

`OverflowList` decides how many items fit in the container and moves the rest into a More menu. It collapses from the end by default. `collapseFrom="start"` collapses from the start. `visibleCount` skips measurement and is what tests use.

Each item is `{ label, href?, iconClass? }`. Customize a row with the `item` slot and the overflow menu with the `overflow` slot.

```vue
<script setup lang="ts">
import { OverflowList } from '@astryx-vue/core/OverflowList'

const items = [
  { href: '/home', label: 'Home' },
  { href: '/files', label: 'Files' },
  { href: '/settings', label: 'Settings' },
]
</script>

<template>
  <OverflowList :items="items" />
</template>
```

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Let the list take its width from the parent. Extra items move into the menu on their own. |
| <Badge variant="success">Do</Badge> | Set <code>minVisibleItems</code> when a few items must stay visible. |
| <Badge variant="error">Avoid</Badge> | Do not render the same item again outside the menu. Visible items and overflow items are two slices. |

## Examples

<DemoExample :demo="overflowListBadges" description="Badges sit in a row. The ones that do not fit collapse into a count." locale="en" title="Badge Tags" />

<DemoExample :demo="overflowListCapped" description="The row stays capped at three actions. The rest move into a menu." locale="en" title="Capped Toolbar" />

<DemoExample :demo="overflowListCollapseStart" description="Items collapse from the start, so the latest steps stay visible." locale="en" title="Collapse From Start" />

<DemoExample :demo="overflowListActions" description="Buttons that do not fit move into a dropdown." locale="en" title="Dropdown Actions" />

<DemoExample :demo="overflowListMultiRow" description="Tags fill two rows, then the rest collapse into a count." locale="en" title="Multi-row Tags" />
