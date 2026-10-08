---
layout: component-docs
title: Slider
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { sliderBasic, sliderRange, sliderMarks, sliderStates, sliderDirections, sliderForm } from '../../../../components/demos/slider'
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

<DemoExample :demo="sliderBasic" title="Basic usage and formatting" description="Show values in a tooltip or beside the control. formatValue also provides accessible value text." locale="en" />

<DemoExample :demo="sliderRange" title="Range selection" description="The first array item is the lower bound. The second is the upper bound. Thumbs cannot cross." locale="en" />

<DemoExample :demo="sliderMarks" title="Marks" description="Click a mark to choose its value. Dragging and keyboard input still follow step." locale="en" />

<DemoExample :demo="sliderStates" title="Disabled and validation states" description="Disabled reasons remain available through keyboard focus. Status messages appear below the control." locale="en" />

<DemoExample :demo="sliderDirections" title="Vertical and right-to-left" description="Vertical values increase from bottom to top. Horizontal RTL values increase from right to left." locale="en" />

<DemoExample :demo="sliderForm" title="Forms and completed adjustments" description="A range submits two fields with the same name. changeEnd fires when an adjustment ends." locale="en" />

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
