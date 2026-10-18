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

`TableSelectionToolbar` is the bulk-action bar for a table with row selection. `useTableSelectionState` returns two pieces that go to matching consumers: `selectionConfig` to `useTableSelection`, `selectionState` to this bar. The bar reads the count from that state and clears every selected key, so it stays in step with the row checkboxes. Passing a plain `count` and handling `clear` yourself still works.

Product actions go in the `start` slot and the bar owns the count text and the clear command on the trailing side. The bar owns no table or sticky layout: place it in flow above the table, or pin it yourself with `class` or `style`.

```ts
import { TableSelectionToolbar } from '@astryx-vue/core/Table'
```

<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Pass `selectionState` straight from `useTableSelectionState`, so the count and the clear command stay synchronized with row selection. |
| <Badge variant="success">Do</Badge> | Provide product actions in the `start` slot instead of encoding them as configuration objects. |
| <Badge variant="error">Don't</Badge> | Inject the toolbar through the Table plugin or its horizontal scroll wrapper. |
