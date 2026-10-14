---
layout: component-docs
title: Stepper
outline: false
footer: false
---

<script setup lang="ts">
import {
  stepperCustom,
  stepperHorizontal,
  stepperIndicators,
  stepperNarrow,
  stepperOnTrack,
  stepperStatus,
} from '../../../../components/demos/stepper'
</script>

## Usage

`Stepper` lists the steps of a flow. `activeStep` is the zero-based current step. A step before it is completed, the current step is in progress, and the rest have not started.

Pass `@step-click` when a step can be chosen out of order. The handler receives the zero-based index, and only then do the steps render as buttons. The default `separated` layout draws a track above each horizontal step, with the indicator and the label on one row. `indicatorPosition="on-track"` sets the indicator into the connector and centers the label under it. `indicator` defaults to `auto`: a check when the step is done, a ring on the current step, and a number after that.

`horizontalOptions.minimumStepWidth` defaults to `112`. A horizontal stepper collapses once it is narrower than that width times the step count, and shows the current step with Previous and Next. The track stays. `collapsedVariant` defaults to `withLabelAndControls` and skips disabled steps. `withLabel` drops the controls, and `hiddenLabel` leaves only the track.

```vue
<script setup lang="ts">
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { ref } from 'vue'

const active = ref(2)
</script>

<template>
  <Stepper
    :active-step="active"
    :horizontal-options="{ minimumStepWidth: 112 }"
    @step-click="active = $event"
  >
    <Step label="Cart" :step="0" />
    <Step label="Shipping" :step="1" />
    <Step label="Payment" :step="2" />
    <Step label="Review" :step="3" />
    <Step label="Confirm" :step="4" />
  </Stepper>
</template>
```


## Examples

<DemoExample :demo="stepperCustom" description="Each vertical step owns a slice of the page. The content slot can be fields, a summary, or a banner, and only the active step renders it." locale="en" title="Custom content" />

<DemoExample :demo="stepperIndicators" description="None leaves progress to the bar and the label. Auto uses a check, a ring, or a number. Number always shows the step. A custom icon can replace the glyph." locale="en" title="Indicator modes" />

<DemoExample :demo="stepperHorizontal" description="On a horizontal track, each indicator sits in the connector so the numbers read as beads on one line. Labels center under their node." locale="en" title="On-track horizontal" />

<DemoExample :demo="stepperOnTrack" description="On a vertical rail, the indicator sits on the connector, with the label and description beside the node." locale="en" title="On-track vertical" />

<DemoExample :demo="stepperStatus" description="Success, error, and accent recolor the indicator in a verification flow. Status never recolors the connector." locale="en" title="Validation status" />

<DemoExample :demo="stepperNarrow" description="At 320px, four steps fall below the 112px minimum width and collapse to the current step, with Previous and Next." locale="en" title="Horizontal narrow collapsed" />
