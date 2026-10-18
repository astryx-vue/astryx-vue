---
layout: component-docs
title: Table Selection Toolbar
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

`TableSelectionToolbar` is the bulk-action bar for a table with row selection. Feed it what `useTableSelectionState` holds: pass the size of `selectedKeys` as `count`, and empty that set when the bar emits `clear`. The count and the clear command then stay in step with the row checkboxes.

Product actions go in the default slot. The bar owns no table or sticky layout: place it in flow above the table, or pin it yourself with `class` or `style`.

```ts
import { TableSelectionToolbar } from '@astryx-vue/core/Table'
```

<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Take the count straight from `useTableSelectionState`, so the count and the clear command stay synchronized with row selection. |
| <Badge variant="success">Do</Badge> | Provide product actions in the default slot instead of encoding them as configuration objects. |
| <Badge variant="error">Don't</Badge> | Inject the toolbar through the Table plugin or its horizontal scroll wrapper. |
