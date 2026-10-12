---
layout: component-docs
title: Complex Selector
outline: false
footer: false
---

<script setup lang="ts">
import {
  complexSelectorCategory,
  complexSelectorFruit,
  complexSelectorStatus,
  complexSelectorTree,
} from '../../../../components/demos/complex-selector'
</script>

## Usage

`ComplexSelector` is a field whose popup content you draw yourself. It owns the label, the trigger, the popover, focus return, and `changeAction`. The default slot owns the content: it receives `value`, `commit`, `close`, and `state`.

`commit` writes the value and runs `changeAction` when one was provided. While that action is pending the trigger shows a spinner and the slot sees the value that was just committed. Arrow Down on the trigger opens the popup.

```vue
<script setup lang="ts">
import { ComplexSelector } from '@astryx-vue/core/ComplexSelector'
import { ref } from 'vue'

const value = ref('Apple, Juicy')
</script>

<template>
  <ComplexSelector v-model="value" label="Fruit blend" :trigger-label="value">
    <template #default="{ commit, close }">
      <button type="button" @click="commit('Pear, Juicy'); close()">
        Pear, Juicy
      </button>
    </template>
  </ComplexSelector>
</template>
```

A grid inside the slot can use `useGridRovingFocus`. A tree can use `TreeList`. `status`, `isDisabled`, `isRequired`, and `description` are the same field props as the other inputs.

## Examples

<DemoExample :demo="complexSelectorFruit" description="Apple, Pear, Peach, and Plum against Crisp, Tender, Juicy, and Peak. Arrow keys stay in the ripeness column." locale="en" title="Fruit ripeness" />
<DemoExample :demo="complexSelectorTree" description="Search folders under Workspace, Teams, and Archive. The current path stays under the tree." locale="en" title="Tree list with search" />
<DemoExample :demo="complexSelectorCategory" description="Produce and Pantry. Save category sits beside the field." locale="en" title="Category tree" />
<DemoExample :demo="complexSelectorStatus" description="Workspace runs a short save and shows a success message. Locked folder is disabled and shows an error." locale="en" title="Status and pending change" />
