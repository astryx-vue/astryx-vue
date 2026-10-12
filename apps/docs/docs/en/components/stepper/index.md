---
layout: component-docs
title: Stepper
outline: false
footer: false
---

<script setup lang="ts">
import {
  stepperCheckout,
  stepperForm,
  stepperHorizontal,
  stepperIndicators,
  stepperOnTrack,
  stepperStatus,
  stepperVertical,
} from '../../../../components/demos/stepper'
</script>

## Usage

`Stepper` lists the steps of a flow. `activeStep` is the zero-based current step. A step before it is completed, the current step is in progress, and the rest have not started.

Pass `@step-click` when a step can be chosen out of order. The handler receives the zero-based index, and only then do the steps render as buttons. `indicatorPosition="on-track"` draws the marker on the connector. `separated` draws a bar above a horizontal step. `hasCollapsibleLabels` hides every horizontal label except the current one once the stepper is narrower than 480px.

```vue
<script setup lang="ts">
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { ref } from 'vue'

const active = ref(2)
</script>

<template>
  <Stepper :active-step="active" indicator-position="on-track" @step-click="active = $event">
    <Step indicator="number" label="Cart" :step="0" />
    <Step indicator="number" label="Shipping" :step="1" />
    <Step indicator="number" label="Payment" :step="2" />
  </Stepper>
</template>
```

`indicator` is `auto`, `number`, or `none`. `auto` uses a check, a ring, or a number. `status` recolors the indicator only. The `icon` slot replaces the indicator artwork.

## Examples

<DemoExample :demo="stepperCheckout" description="A horizontal checkout. Cart, Shipping, Payment, Review, and Confirm are numbered and can be selected." locale="en" title="Checkout progress" />
<DemoExample :demo="stepperVertical" description="A vertical onboarding list with a description under each step." locale="en" title="Vertical onboarding" />
<DemoExample :demo="stepperHorizontal" description="Workspace through Launch, with the progress bar separated from the labels." locale="en" title="Horizontal progress" />
<DemoExample :demo="stepperIndicators" description="The same steps with an automatic indicator, a number, and a custom icon." locale="en" title="Indicator modes" />
<DemoExample :demo="stepperForm" description="Project details, environment, and deploy. The fields sit in the current step." locale="en" title="Multi-step form" />
<DemoExample :demo="stepperOnTrack" description="The onboarding list with the indicator sitting on the vertical track." locale="en" title="On-track vertical" />
<DemoExample :demo="stepperStatus" description="Success, error, and accent recolor the indicator. Background check is optional." locale="en" title="Validation status" />
