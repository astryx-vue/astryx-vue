---
layout: component-docs
title: Checkbox List Item
outline: false
footer: false
---

<script setup lang="ts">
import { checkboxListItemBasic } from '../../../../components/demos/checkbox-list-item'
</script>

## Usage

Individual checkbox item with label, description, and end content slot. Works in collection mode (inside a `CheckboxList` with a value array) or standalone mode (inside `List`, or inside a `CheckboxList` without value, such as a select-all item).

```ts
import { CheckboxListItem } from '@astryx-vue/core/CheckboxList'
```

In collection mode the row's `value` is its identity: the parent [Checkbox List](/en/components/checkbox-list) holds the `v-model` array, and the row throws without a `value`. In standalone mode there is no array, so `isChecked` shows the state and `check` reports the next one; that is the shape used inside a [List](/en/components/list) or by a select-all row.

## Examples

Common configurations, variations, and states.

<DemoExample :demo="checkboxListItemBasic" title="Basic" description="Checkbox items with labels and descriptions inside a controlled CheckboxList. Use for multi-select option groups like notification preferences." locale="en" />
