---
title: ListInput
---

# ListInput

Edits a list of records with a consistent shape. Each column supplies an input through `renderInput`, with add, remove, validation, drag, and keyboard-reorder support.

<script setup lang="ts">
import { labListInput, labListInputBudgetAllocation, labListInputFamilyMembers, labListInputMailingList } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labListInput" description="Each guest has editable name and role fields; records can be added, removed, or reordered." locale="en" title="Reorderable records" /></ClientOnly>

<ClientOnly><DemoExample :demo="labListInputFamilyMembers" description="Three simple fields per record, the recommended ceiling. Order is immaterial, so the list is not reorderable. At 640px or narrower each record stacks its fields with repeated labels." locale="en" title="Family members" /></ClientOnly>

<ClientOnly><DemoExample :demo="labListInputBudgetAllocation" description="A team Selector beside a percentage NumberInput. Each team can appear once (a record error), the rows must total 100% (a list error), and Add stops at four teams." locale="en" title="Budget allocation" /></ClientOnly>

<ClientOnly><DemoExample :demo="labListInputMailingList" description="A one-column list that starts empty and stops adding at six addresses. A repeated address is a record error, a malformed address is a field error after blur, and removing the last address shows the required-list error." locale="en" title="Mailing list" /></ClientOnly>

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
