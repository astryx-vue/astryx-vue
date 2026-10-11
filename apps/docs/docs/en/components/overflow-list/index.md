---
layout: component-docs
title: Overflow List
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { overflowListBasic } from '../../../../components/demos/overflow-list'
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

<DemoExample
  :demo="overflowListBasic"
  description="As the container gets narrower, trailing items move into More. Opening the menu still reaches them."
  locale="en"
  title="Collapse into More"
/>
