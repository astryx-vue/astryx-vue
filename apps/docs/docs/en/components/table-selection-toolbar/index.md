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

## Select every matching row across server pages

When rows load one server page at a time, the app can keep the selection as "every matching row, minus the ones the person unticked", so rows on pages that never loaded count as selected too. The table and the toolbar only show that selection: pass your own `TableSelectionState`, with your own count, instead of the one `useTableSelectionState` returns.

```ts
const isAllMatching = ref(false)
const picked = ref(new Set<string>()) // chosen one by one
const excluded = ref(new Set<string>()) // unticked in all mode

const isSelected = (row: User) => isAllMatching.value ? !excluded.value.has(row.id) : picked.value.has(row.id)
const isPageSelected = computed(() => pageRows.value.every(isSelected))
const selectedCount = computed(() => isAllMatching.value ? total.value - excluded.value.size : picked.value.size)

const selectionPlugin = useTableSelection<User>(() => ({
  getIsItemSelected: isSelected,
  // setRows adds to or removes from `excluded` in all mode, `picked` otherwise.
  onSelectItem: ({ item, isSelected }) => setRows([item], isSelected),
  onSelectAll: ({ isAllSelected }) => setRows(pageRows.value, isAllSelected),
  getIsAllSelected: () => isPageSelected.value,
}))

const selection = computed<TableSelectionState>(() => ({
  // Only the loaded rows: the full set is not on the client.
  selectedKeys: new Set(pageRows.value.filter(isSelected).map(row => row.id)),
  selectedCount: selectedCount.value,
  hasSelection: selectedCount.value > 0,
  clearSelection: () => {
    isAllMatching.value = false
    picked.value = new Set()
    excluded.value = new Set()
  },
}))
```

```vue
<TableSelectionToolbar :selection="selection">
  <template #start>
    <Button label="Archive" variant="ghost" @click="archive" />
    <!-- Beside the action, not in its place. Once used, the offer stays as the command that undoes it,
         so focus stays on it and a second press can never run Archive. -->
    <Button
      v-if="isAllMatching || isPageSelected"
      :label="isAllMatching ? 'Select only this page' : `Select all ${total} matching`"
      variant="ghost"
      @click="toggleAllMatching"
    />
  </template>
</TableSelectionToolbar>
```

"Select only this page" selects every row on the page, so its label stays true and the focused button stays mounted. For the bulk action, send the server the query and the excluded ids, not a list of selected ids.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Pass `selectionState` straight from `useTableSelectionState`, so the count and the clear command stay synchronized with row selection. |
| <Badge variant="success">Do</Badge> | Provide product actions in the `start` slot instead of encoding them as configuration objects. |
| <Badge variant="error">Don't</Badge> | Inject the toolbar through the Table plugin or its horizontal scroll wrapper. |
