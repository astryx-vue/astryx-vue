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

## Examples

<DemoExample
  :demo="useTableSelectionRowSelection"
  description="Table with row selection checkboxes and a select-all header checkbox."
  locale="en"
  title="useTableSelection — Row Selection"
/>
