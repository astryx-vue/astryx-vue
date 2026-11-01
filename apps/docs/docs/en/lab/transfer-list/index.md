---
layout: lab-docs
title: TransferList
---

# TransferList

Moves options between available and selected panels with search, grouping, drag reordering, and keyboard reordering.

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
| `hasSearch` | `boolean` | `false` | Shows shared search. |
| `searchLabel` / `searchPlaceholder` | `string` | Built-in text | Search label and placeholder. |
| `isReorderable` | `boolean` | `true` | Allows selected-option reordering. |
| `hasSelectAll` / `hasClear` | `boolean` | `false` | Shows bulk add and clear actions. |
| `selectedEmptyText` / `availableEmptyText` / `noResultsText` | `string` | Built-in text | Empty-state text. |

Options support `group`, `description`, `isTransferDisabled`, `isReorderDisabled`, and `disabledMessage`. `change` emits the latest value; use `#option="{ option }"` to customize rows.
