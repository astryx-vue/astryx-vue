---
layout: component-docs
title: Number Input
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { numberInputClearable, numberInputRange, numberInputStatus, numberInputUnits } from '../../../../components/demos/number-input'
</script>

## Usage

`NumberInput` is a numeric field. People type a number; add `hasNumberSteppers` when they should also get up and down chevrons. `min` and `max` clamp the value, and `step` sets how much each click changes it.

Bind a number:

```vue
<script setup lang="ts">
import { NumberInput } from '@astryx-vue/core/NumberInput'
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <NumberInput v-model="count" :min="0" :max="100" />
</template>
```

Values outside `min` and `max` are pulled back into range. The stepper names are English unless the app calls `provideAstryxLocale('zh-CN')`. When `label` is set, it is included in those names.

Three props adjust the field to the number it holds. `isIntegerOnly` keeps decimals out of the committed value. `formatValue` shows a readable form while the field is idle, such as `1,234 items`, and switches back to the raw number on focus. `isWheelEnabled={false}` stops the wheel from stepping the value where page scrolling matters more.


<ComponentAnatomy />

## Best practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Set `min` and `max` when the value has a real range. |
| <Badge variant="success">Do</Badge> | Pick a `step` that matches the field: `1` for a count, `0.01` for a price. |
| <Badge variant="success">Do</Badge> | Put the unit in the label, such as "Quantity (pcs)", rather than inside the field. |
| <Badge variant="error">Don't</Badge> | Use a tiny step across a wide range. People will have to click the stepper many times. |

## Examples

<DemoExample
  :demo="numberInputClearable"
  description="Progress from 0 to 100, with a percent suffix and a clear button."
  locale="en"
  title="Clearable"
/>

<DemoExample
  :demo="numberInputRange"
  description="Team size from 1 to 50, with a description of what the number means."
  locale="en"
  title="Range"
/>

<DemoExample
  :demo="numberInputStatus"
  description="Error, warning, and success on budget, headcount, and completion."
  locale="en"
  title="Status"
/>

<DemoExample
  :demo="numberInputUnits"
  description="A discount with a percent suffix, limited to 0–100."
  locale="en"
  title="Units"
/>
