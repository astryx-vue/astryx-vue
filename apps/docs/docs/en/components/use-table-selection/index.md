---
layout: component-docs
title: useTableSelection
outline: false
footer: false
---

<script setup lang="ts">
import { useTableSelectionRowSelection } from '../../../../components/demos/use-table-selection'
</script>

## Usage

Hook that returns a TablePlugin implementing row selection with checkboxes, select-all, and `aria-selected`. The table adds the checkbox column itself. Selection state is read through the getters on every render, so the checkbox cells follow whatever reactive state those getters read; there is no provider to wrap the table in.

```ts
import { useTableSelection } from '@astryx-vue/core/Table'
```

Two getters decide what a row looks like. `getIsItemSelectable` removes the checkbox from a row that has nothing to select, and `getIsItemEnabled` keeps the checkbox in place but disabled, for a row that cannot be picked right now.

```ts
const selection = useTableSelection({
  getIsItemSelected: item => selectedKeys.value.has(item.id),
  onSelectItem: ({ item, isSelected }) => { /* ... */ },
  onSelectAll: ({ isAllSelected }) => { /* ... */ },
  getIsAllSelected: () => /* ... */ false,
  getIsItemSelectable: item => item.role !== 'System',
  getIsItemEnabled: item => item.status !== 'Locked',
})
```

`hasRowHighlight` only controls the accent wash on checked rows. `aria-selected` stays on them either way, so the selection is still announced when the surrounding UI already uses row background for something else.

## Examples

<DemoExample
  :demo="useTableSelectionRowSelection"
  description="Table with row selection checkboxes and a select-all header checkbox."
  locale="en"
  title="useTableSelection — Row Selection"
/>
