---
layout: component-docs
title: Number Input
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { numberInputBasic, numberInputPrecision, numberInputSizes } from '../../../../components/demos/number-input'
</script>

## Usage

`NumberInput` is a numeric field. People can type a number or use the up and down chevrons. `min` and `max` clamp the value, and `step` sets how much each click changes it.

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

## Best practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Set `min` and `max` when the value has a real range. |
| <Badge variant="success">Do</Badge> | Pick a `step` that matches the field: `1` for a count, `0.01` for a price. |
| <Badge variant="success">Do</Badge> | Put the unit in the label, such as "Quantity (pcs)", rather than inside the field. |
| <Badge variant="error">Don't</Badge> | Use a tiny step across a wide range. People will have to click the stepper many times. |

## Examples

<DemoExample
  :demo="numberInputBasic"
  description="Bind a number value, increment/decrement with buttons or keyboard arrows."
  locale="en"
  title="Basic Usage"
/>

<DemoExample
  :demo="numberInputPrecision"
  description="Limit the range with min and max, and set how much each step changes the value."
  locale="en"
  title="Range and step"
/>

<DemoExample
  :demo="numberInputSizes"
  description="Available in sm, md, lg sizes, md by default."
  locale="en"
  title="Sizes"
/>
