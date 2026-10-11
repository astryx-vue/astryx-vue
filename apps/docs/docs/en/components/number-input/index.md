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
