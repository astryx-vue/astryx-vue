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

`NumberInput` is a component for numeric input with stepper buttons, min/max limits, and precision control.

## Examples

<DemoExample
  :demo="numberInputBasic"
  description="Bind a number value, increment/decrement with buttons or keyboard arrows."
  locale="en"
  title="Basic Usage"
/>

<DemoExample
  :demo="numberInputPrecision"
  description="Control decimal places with precision, suitable for prices and ratings."
  locale="en"
  title="Precision"
/>

<DemoExample
  :demo="numberInputSizes"
  description="Available in sm, md, lg sizes, md by default."
  locale="en"
  title="Sizes"
/>
