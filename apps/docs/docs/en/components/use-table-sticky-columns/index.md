---
layout: component-docs
title: useTableStickyColumns
outline: false
footer: false
---

<script setup lang="ts">
import { useTableStickyColumnsPinned } from '../../../../components/demos/use-table-sticky-columns'
</script>

## Usage

Hook that returns a TablePlugin which pins a contiguous run of columns to the start and/or end edge of the table. Pinned columns get cumulative offsets and a soft, scroll-aware shadow over the scrolling content. An empty config (`{}`) is a valid no-op that pins nothing.

```ts
import { useTableStickyColumns } from '@astryx-vue/core/Table'
```

## Examples

<DemoExample
  :demo="useTableStickyColumnsPinned"
  description="Name stays on the left and Friday stays on the right while the days in between scroll. The shadow over the scrolling content tells you which side still has hidden columns."
  locale="en"
  title="useTableStickyColumns — Pinned Columns"
/>
