---
layout: component-docs
title: Complex Selector
outline: false
footer: false
---

<script setup lang="ts">
import {
  complexSelectorDeadline,
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

const value = ref('Today')
</script>

<template>
  <ComplexSelector v-model="value" label="Deadline" :trigger-label="value">
    <template #default="{ commit, close }">
      <button type="button" @click="commit('Next week'); close()">
        Next week
      </button>
    </template>
  </ComplexSelector>
</template>
```

The popup stays open until the slot calls `commit`. A tree can use `TreeList`. `status`, `isDisabled`, `isRequired`, and `description` are the same field props as the other inputs.

`alignment` places the popup along its axis. `startIcon` draws an icon in the trigger. `variant="ghost"` drops the border so the trigger matches a toolbar button. `renderTrigger`, or the `trigger` slot, replaces the field: spread the bindings onto your own control. `handleRef` and a template `ref` both expose `open`, `close`, `toggle`, and `isOpen`.

```vue
<script setup lang="ts">
import type { ComplexSelectorHandle } from '@astryx-vue/core/ComplexSelector'
import { ComplexSelector } from '@astryx-vue/core/ComplexSelector'
import { ref, shallowRef } from 'vue'

const value = ref('Today')
const selector = shallowRef<ComplexSelectorHandle | null>(null)
</script>

<template>
  <button type="button" @click="selector?.open()">
    Open
  </button>
  <ComplexSelector
    ref="selector"
    v-model="value"
    label="Deadline"
    start-icon="calendar"
    :trigger-label="value"
    variant="ghost"
  >
    <template #default="{ commit, close }">
      <button type="button" @click="commit('Next week'); close()">
        Next week
      </button>
    </template>
  </ComplexSelector>
</template>
```


<ComponentAnatomy />

## Examples

<DemoExample :demo="complexSelectorDeadline" description="Today, Tomorrow, or Next week, or a custom date and time. Apply commits the value and closes the popup." locale="en" title="Deadline picker" />
<DemoExample :demo="complexSelectorTree" description="Search folders under Teams and Workspace. Choosing a folder closes the popup." locale="en" title="Tree search" />
