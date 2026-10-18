---
layout: component-docs
title: useTableTreeData
outline: false
footer: false
---

<script setup lang="ts">
import { useTableTreeDataTree } from '../../../../components/demos/use-table-tree-data'
</script>

## Usage

Headless tree plugin for Table: renders nested rows with per-level indentation and expand/collapse chevrons in the tree column (the first column by default), and reflects hierarchy on body rows via `aria-level` and `aria-expanded`. Composable with the other Table plugins: the canonical plugin order places tree before selection, so the checkbox column lands left of the indented tree column. Feed it the config that `useTableTreeState` builds for you, or construct the config directly for server-driven or pre-flattened trees. When no row is expandable (flat data), every transform is a pass-through and the table renders identically to one without the plugin. Known limitation: the tree column wraps its cell content, so `textOverflow="truncate"` tooltips do not apply within the tree column.

```ts
import { useTableTreeData } from '@astryx-vue/core/Table'
```

## Examples

<DemoExample
  :demo="useTableTreeDataTree"
  description="Child rows reuse the same columns, indented per level, with an expand/collapse chevron in the tree column. The header control expands every branch."
  locale="en"
  title="useTableTreeData — Tree Table"
/>
