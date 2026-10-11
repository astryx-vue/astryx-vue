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

`NumberInput` is a numeric field with stepper buttons, a min and max, and a configurable step.

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
