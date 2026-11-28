---
layout: component-docs
title: useTableSelectionState
outline: false
footer: false
---

<script setup lang="ts">
import { useTableSelectionStateLeadingMark, useTableSelectionStateRowSelection } from '../../../../components/demos/use-table-selection-state'
</script>

## Usage

State management companion for `useTableSelection`. Returns `selectionConfig` for the behaviour plugin plus `selectionState` for selection-aware UI such as `TableSelectionToolbar`. The selection itself stays controlled: you own the `Set` of selected keys and pass a setter. Select-all only takes the rows that can be checked, so rows that are not selectable or are disabled keep whatever state they had. `idKey` takes a property name or a function that returns the key.

```ts
import { useTableSelectionState } from '@astryx-vue/core/Table'
```

## Examples

<DemoExample
  :demo="useTableSelectionStateRowSelection"
  description="Table with row selection checkboxes and a select-all header checkbox. The checked keys and the setter stay in the caller, and selectionState mirrors them for selection-aware UI such as a toolbar."
  locale="en"
  title="useTableSelectionState — Row Selection"
/>

<DemoExample
  :demo="useTableSelectionStateLeadingMark"
  description="Selection without a checkbox column: each person shows an avatar, and the checkbox takes the avatar slot on hover, on keyboard focus, and everywhere once anything is selected. The state comes from useTableSelectionState; the checkboxes render in the name column, so checked rows get no aria-selected or highlight unless you add them."
  locale="en"
  title="useTableSelectionState — Leading-mark Selection"
/>
