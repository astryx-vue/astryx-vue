---
layout: component-docs
title: useTableTreeState
outline: false
footer: false
---

<script setup lang="ts">
import { useTableTreeStateTree } from '../../../../components/demos/use-table-tree-state'
</script>

## Usage

State management companion for `useTableTreeData`. Owns the expanded set (controlled or uncontrolled) and flattens nested data into the visible row array; collapsed subtrees are unmounted, not hidden, so the table body contains exactly the visible rows. Returns `expandAll` / `collapseAll` helpers, the aggregate `isAllExpanded` state (true/false/indeterminate) for a header expand-all control, and a ready-to-use `plugin` for the tree. Note: because collapsed rows unmount, local component state inside collapsed subtrees is lost on collapse; lift state that must survive.

```ts
import { useTableTreeState } from '@astryx-vue/core/Table'
```

## Examples

<DemoExample
  :demo="useTableTreeStateTree"
  description="Nested rows are flattened into the visible rows, and the expanded set lives in the hook. The header control expands every branch, and a row click expands a node that has children."
  locale="en"
  title="useTableTreeState — Tree Table"
/>
