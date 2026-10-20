---
layout: component-docs
title: useResizable
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useResizableCollapsible, useResizableSplit } from '../../../../components/demos/use-resizable'
</script>

## Usage

Hook for adding drag-to-resize behavior to layout regions. Supports single-region and multi-region configurations with snap points, collapsible panels, localStorage persistence, and cascade resize ordering.

```ts
import { useResizable } from '@astryx-vue/core'
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use `percent(40, { min: pixel(333) })` for a 40% size with a 333px floor, or `percent(10, { max: pixel(400) })` for a 10% size with a 400px ceiling. The options argument is required and carries a floor XOR a ceiling. |
| <Badge variant="success">Do</Badge> | A structured default is an initial choice only; a structured `minSize` or `maxSize` remains live. State, persistence, callbacks, `resize()`, paint, and ARIA all use resolved pixel numbers. |
| <Badge variant="success">Do</Badge> | Import `percent` from `@astryx-vue/core` and Table's `pixel` from `@astryx-vue/core/Table`. They are the same pixel binding, exposed once from each entry. |
| <Badge variant="success">Do</Badge> | Use with `Layout` or `AppShell` sidebar for resizable navigation panels. |
| <Badge variant="success">Do</Badge> | Set `autoSaveId` to persist user-chosen sizes across page reloads. |
| <Badge variant="error">Don't</Badge> | Set `minSize` too small; content becomes unreadable. Prefer `collapsible` for panels that can hide entirely. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useResizableSplit"
  description="Horizontal resizable split with a draggable handle between two panels."
  locale="en"
  title="Resizable"
/>

<DemoExample
  :demo="useResizableCollapsible"
  description="A collapsible sidebar with snap points, driven by useResizable. Dragging snaps to preset widths, dragging past the minimum collapses the panel, and the expand method restores it programmatically."
  locale="en"
  title="Resizable — Collapsible with snap points"
/>
