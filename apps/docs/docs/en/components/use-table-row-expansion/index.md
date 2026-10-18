---
layout: component-docs
title: useTableRowExpansion
outline: false
footer: false
---

<script setup lang="ts">
import { useTableRowExpansionDetail } from '../../../../components/demos/use-table-row-expansion'
</script>

## Usage

Hook that returns a TablePlugin which expands a full-width detail panel below a row, rendered by the consumer via renderExpanded(item). Adds a leading chevron column and a right-click "Expand/Collapse row" action; the consumer owns the expandedKeys set. The panel spans the row but starts its content at the first column, past the chevron, so detail lines up with the labels above it; the inset follows the table density. Use it for master-detail rows (order details, forms, charts, nested tables). For hierarchical data where child rows reuse the parent columns, use useTableTreeData + useTableTreeState instead.

```ts
import { useTableRowExpansion } from '@astryx-vue/core/Table'
```

`renderExpanded` returns a `VNodeChild`, so build the panel with `h()` or render a component you imported. The config is read again on every access: pass a getter, and replace the expanded set with a new one instead of mutating it.

```ts
const expansion = useTableRowExpansion(() => ({
  expandedKeys: expanded.value,
  onToggle: toggle,
  getRowKey: order => order.id,
  renderExpanded: order => h('p', order.note),
}))
```

The chevron column is prepended to your columns under the key `__expansion`. It is 40px wide, its header is hidden from sight but kept for screen readers, and it cannot be resized.

## Examples

<DemoExample
  :demo="useTableRowExpansionDetail"
  description="A table where each row opens a full-width detail panel. Click the chevron, or right-click a row for the expand action."
  locale="en"
  title="useTableRowExpansion — Detail Panel"
/>
