---
title: TransferList
---

# TransferList

Moves options between available and selected panels with search, grouping, and reordering. Selected options reorder on core `List`'s engine: drag the handle at the row end with a mouse, press and hold then drag on touch, or click it to enter reorder mode and move with the arrow keys. Reordering pauses while searching.

<script setup lang="ts">
import { labTransferList } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labTransferList" description="Both panels share search; selected options can be reordered, added in bulk, or cleared." locale="en" title="Dual-panel selection" /></ClientOnly>

## Import

```ts
import { TransferList } from '@astryx-vue/lab'
```

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `readonly T[]` | `[]` | Selected values in order, bound with `v-model`. |
| `options` | `readonly TransferListOption<T>[]` | Required | All options with unique values. |
| `label` | `string` | Required | Accessible control name. |
| `selectedLabel` / `availableLabel` | `string` | Built-in text | Panel headings. |
| `description` | `string` | `undefined` | Supporting text below the label. |
| `isLabelHidden` | `boolean` | `false` | Hides the label visually. |
| `isDisabled` | `boolean` | `false` | Disables every transfer, reorder, Clear, Add all and search control. Row controls and the search field stay focusable. |
| `hasSearch` | `boolean` | `false` | Shows shared search. |
| `searchLabel` / `searchPlaceholder` | `string` | Built-in text | Search label and placeholder. |
| `reorderable` | `Reorderable<T>` | `undefined` | Takes over selected-option reordering: an object from `useReorderable` or `createReorderable` gets each move through its `onReorder` (`to` is the place in the whole value), and its `isReorderable` decides which values move. When passed, `isReorderable` is ignored. |
| `isReorderable` | `boolean` | `true` | Without `reorderable`, whether the built-in reordering runs, committing through `v-model` and `change`. |
| `hasSelectAll` / `hasClear` | `boolean` | `false` | Shows bulk add and clear actions. |
| `selectedEmptyText` / `availableEmptyText` / `noResultsText` | `string` | Built-in text | Empty-state text. |

Options support `group`, `description`, `isTransferDisabled`, `isReorderDisabled`, and `disabledMessage`. An `isReorderDisabled` option has no handle and stays in place. `change` emits the latest value; use `#option="{ option }"` to customize rows.
