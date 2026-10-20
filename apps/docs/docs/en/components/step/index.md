---
layout: component-docs
title: Step
outline: false
footer: false
---

<script setup lang="ts">
import { stepContentSlot, stepIndicator, stepStates } from '../../../../components/demos/step'
</script>

## Usage

Individual step within a Stepper. Renders a progress-bar segment, an indicator, and a label with optional description. Progress (completed/active/not-started) is derived from the parent Stepper's activeStep and this step's step index.

`step` is the zero-based index and decides the progress, so it is never set directly. The default slot puts content under the description, outside the clickable label row, so a form inside keeps its own targets. `end` adds trailing content to the label row, and `icon` replaces the built-in indicator artwork.

```vue
<script setup lang="ts">
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { ref } from 'vue'

const active = ref(1)
</script>

<template>
  <Stepper :active-step="active" @step-click="active = $event">
    <Step label="Cart" :step="0" />
    <Step label="Shipping" :step="1" />
    <Step label="Payment" :step="2" />
  </Stepper>
</template>
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="stepContentSlot" title="Content Slot" description="Children passed to a Step render below its description, indented to line up with the label rather than the indicator, and stay outside the clickable label area so buttons inside remain their own targets. In a full flow you gate the slot on the step being active. That is what turns a vertical stepper into an expanding one." locale="en" />

<DemoExample :demo="stepIndicator" title="Indicator" description="Everything the indicator prop accepts: the auto default, an always-number badge, a custom node, and none, each on its own completed Step so the prop is the only difference between them. Every variant occupies the same 16px box, so a step swapping its number for a check as it completes never shifts the label beside it. The last cell shows that a custom node can be live rather than static: a Spinner on a step that is in progress, shaded inherit so it picks up the step's own tint like any other glyph." locale="en" />

<DemoExample :demo="stepStates" title="States" description="Every state a single Step can land in, each shown as one Step in its own Stepper. Completed, current, and upcoming are derived by comparing the step index against the parent activeStep, so they are never set directly; isDisabled and status are the two a step declares itself. Status is a separate axis from progress, which is why a completed step can still carry a warning." locale="en" />
