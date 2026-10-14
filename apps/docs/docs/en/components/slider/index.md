---
layout: component-docs
title: Slider
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { sliderFormatted, sliderRange, sliderMarks, sliderStatus } from '../../../../components/demos/slider'
</script>

## Usage

Use `Slider` to choose a number or numeric range.

```vue
<script setup lang="ts">
import { Slider } from '@astryx-vue/core/Slider'
import { shallowRef } from 'vue'

const volume = shallowRef(50)
const budget = shallowRef<[number, number]>([20, 80])
</script>

<template>
  <Slider v-model="volume" label="Volume" />
  <Slider v-model="budget" label="Budget" value-display="text" />
</template>
```

Import the theme once in the application entry:

```ts
import '@astryx-vue/themes/neutral.css'
```




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Always provide a label, even if visually hidden, so the slider is accessible to screen readers. |
| <Badge variant="success">Do</Badge> | Format values with meaningful units like "$50" or "75%" instead of raw numbers. |
| <Badge variant="error">Don't</Badge> | Use for precise numeric entry; pair with a text input or use NumberInput instead. |
| <Badge variant="error">Don't</Badge> | Set a step size so large that only a few positions are possible; use SegmentedControl or radio buttons instead. |
| <Badge variant="error">Don't</Badge> | Wrap a disabled slider in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead. |

## Examples

<DemoExample
  :demo="sliderFormatted"
  description="Temperature in Fahrenheit, shown beside the slider."
  locale="en"
  title="Formatted value"
/>

<DemoExample
  :demo="sliderRange"
  description="A price range with a lower and an upper thumb."
  locale="en"
  title="Range"
/>

<DemoExample
  :demo="sliderMarks"
  description="Volume with tick labels at 0, 25, 50, 75, and 100."
  locale="en"
  title="Marks"
/>

<DemoExample
  :demo="sliderStatus"
  description="Error, warning, and success on CPU, memory, and disk."
  locale="en"
  title="Validation states"
/>

## Keyboard controls

The slider is fully operable with the keyboard, so users never have to drag. Once a thumb has focus, these keys change its value:

- Tab moves focus to each thumb in turn.
- Left / Right move one step in the horizontal direction; the direction is reversed in right-to-left layouts.
- Up / Down increase or decrease the value by one step.
- PageUp / PageDown increase or decrease the value by ten steps.
- Home / End move to the allowed minimum or maximum.
- Escape closes the value tooltip or the disabled reason tooltip.

In range mode each thumb has its own name, taken from `minLabel` and `maxLabel`, so assistive technology can tell which bound is being adjusted. Each thumb's ARIA bounds also update when its sibling changes, so the range that is announced always matches the values the thumb can actually take.

## Usage guidance

A slider suits choosing a value along a continuous range, not entering an exact number. Keep the following in mind:

- Provide a numeric input when exact entry matters.
- `isRequired` only provides a required description, so assistive technology knows the field is required.
- Validate accepted values in application code.
