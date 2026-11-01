---
layout: lab-docs
title: ListInput
---

# ListInput

Edits a list of records with a consistent shape. Each column supplies an input through `renderInput`, with add, remove, validation, drag, and keyboard-reorder support.

<script setup lang="ts">
import { labListInput } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labListInput" description="Each guest has editable name and role fields; records can be added, removed, or reordered." locale="en" title="Reorderable records" /></ClientOnly>

## Import

```ts
import { ListInput } from '@astryx-vue/lab'
```

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `T[]` | `[]` | Records, bound with `v-model`. |
| `label` | `string` | Required | List label and accessible name. |
| `columns` | `ListInputColumn<T>[]` | Required | Column definitions and input renderers. |
| `getItemKey` | `(item) => string \| number` | Required | Returns a stable record key. |
| `createItem` | `() => T` | Required | Creates a record for the add action. |
| `description` / `itemName` | `string` | `undefined` | List description and singular item noun. |
| `status` | `FieldStatus` | `undefined` | Whole-list validation status. |
| `getItemStatus` | `(item, index) => FieldStatus` | `undefined` | Per-record validation status. |
| `getFieldStatus` | `(item, columnKey, index) => FieldStatus` | `undefined` | Per-cell validation status. |
| `isReorderable` | `boolean` | `false` | Allows reordering. |
| `isDisabled` / `isLoading` | `boolean` | `false` | Disabled or busy state. |
| `maxItems` | `number` | `undefined` | Maximum record count. |
| `isLabelHidden` / `isOptional` / `isRequired` | `boolean` | `false` | Label and required markers. |

A column contains `key`, `header`, optional `width`, and `renderInput`. The renderer receives the record, accessible label, status, disabled state, and `updateItem`; the example connects core's `TextInput`.

## Events

`change` emits both the new array and the change details: `add`, `update`, `remove`, or `reorder`.
