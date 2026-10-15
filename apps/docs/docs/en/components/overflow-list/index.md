---
layout: component-docs
title: Overflow List
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { overflowListActions, overflowListBadges, overflowListCapped, overflowListCollapseStart, overflowListMultiRow } from '../../../../components/demos/overflow-list'
import { toolbarFilter } from '../../../../components/demos/toolbar'
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


<ComponentAnatomy />

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Let the list take its width from the parent. Extra items move into the menu on their own. |
| <Badge variant="success">Do</Badge> | Set <code>minVisibleItems</code> when a few items must stay visible. |
| <Badge variant="error">Avoid</Badge> | Do not render the same item again outside the menu. Visible items and overflow items are two slices. |

## Examples

<DemoExample
  :demo="overflowListCapped"
  description="maxVisibleItems caps the row at three actions even when more would fit; the rest move to a dropdown."
  locale="en"
  title="Capped toolbar"
/>

<DemoExample
  :demo="overflowListCollapseStart"
  description="Overflow list that hides items from the start, keeping the latest visible."
  locale="en"
  title="Collapse from start"
/>

<DemoExample
  :demo="overflowListMultiRow"
  description="Tags wrap onto up to two rows with maxRows, then collapse the rest into a count badge."
  locale="en"
  title="Multi-row tags"
/>

<DemoExample
  :demo="overflowListBadges"
  description="Resizable row of badges that collapses into a count badge on overflow."
  locale="en"
  title="Badge tags"
/>

<DemoExample
  :demo="overflowListActions"
  description="Action toolbar that collapses overflow buttons into a dropdown menu."
  locale="en"
  title="Dropdown actions"
/>

<DemoExample
  :demo="toolbarFilter"
  description="Filter bar above a table: a search box leads the row, each field beside it is a closed trigger that doubles as its own filter chip, and the clauses fold from the end into a count as the row narrows."
  locale="en"
  title="Table filter"
/>
