---
layout: component-docs
title: Resize Handle
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { resizeHandleSidebar } from '../../../../components/demos/resize-handle'
</script>

## Usage

`ResizeHandle` is the separator between two regions. `useResizable` owns the size. Pass `sidebar.props` to both the handle and the panel.

```vue
<script setup lang="ts">
import { useResizable } from '@astryx-vue/core'
import { Layout, LayoutPanel } from '@astryx-vue/core/Layout'
import { ResizeHandle } from '@astryx-vue/core/Resizable'

const sidebar = useResizable({
  defaultSize: 240,
  minSize: 160,
  maxSize: 360,
})
</script>

<template>
  <Layout>
    <template #start>
      <LayoutPanel :has-divider="false" :width="sidebar.size" />
      <ResizeHandle direction="horizontal" has-divider :resizable="sidebar.props" />
    </template>
  </Layout>
</template>
```

`direction` is `horizontal` (width) or `vertical` (height). `position` is `inline` or `overlay`. `isReversed` flips the drag when the panel sits on the end edge. `hasDivider` draws the 1px line; the line is the handle. `isAlwaysVisible` keeps the grip visible at rest. `pillPlacement` is `auto`, `start`, `end`, or `center`.

The handle is `role="separator"`. A horizontal handle sets `aria-orientation="vertical"`. Arrow keys move 10px, and Shift moves 50px. With snap points, an arrow jumps to the next point and Shift jumps two. Home and End jump to the limits. End does nothing when no maximum is set; the separator then reports the window or container size as its maximum. While collapsed, only the arrow that grows the pane reopens it. Enter and double-click restore the size from before the collapse.

`useResizable` accepts one region, or a `regions` map. `snaps` keeps the size on the nearest listed point. An equal distance stays on the earlier point. A drag below `collapsedSize` (default 40) collapses a collapsible region to 0. `autoSaveId` stores the size under `astryx-resizable:` in `localStorage`. `percent()` builds a percentage size with a pixel minimum or maximum.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Give the handle a `label` that names the region it resizes. |
| <Badge variant="success">Do</Badge> | Turn the panel divider off when the handle draws one. |
| <Badge variant="error">Don't</Badge> | Store the size in a separate ref and forget to pass `resizable`. The handle and the panel both read `props`. |

## Examples

<DemoExample :demo="resizeHandleSidebar" description="Dragging snaps to preset widths. Dragging past the minimum collapses the sidebar, and Expand restores it." locale="en" title="Collapsible with snap points" />
