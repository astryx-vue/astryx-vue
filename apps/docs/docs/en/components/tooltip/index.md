---
layout: component-docs
title: Tooltip
outline: false
footer: false
---

<script setup lang="ts">
import { tooltipBasic, tooltipControlled, tooltipPlacements, tooltipText } from '../../../../components/demos/tooltip'
</script>

## Usage

`Tooltip` shows a short hint next to a trigger on hover or keyboard focus. The trigger keeps its own behavior.

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Tooltip } from '@astryx-vue/core/Tooltip'
</script>

<template>
  <Tooltip content="Save your changes">
    <Button label="Save" />
  </Tooltip>
</template>
```

## Examples

<DemoExample :demo="tooltipBasic" title="Basic" description="Hover or focus the button to show the hint after a short delay." locale="en" />

<DemoExample :demo="tooltipPlacements" title="Placements" description="placement sets the side of the trigger. The tooltip flips to the other side when there is no room." locale="en" />

<DemoExample :demo="tooltipText" title="Text trigger" description="A plain text trigger becomes focusable and shows a dashed underline." locale="en" />

<DemoExample :demo="tooltipControlled" title="Controlled" description="Pass isOpen to control visibility. Escape sends openChange(false) and the parent decides whether to close." locale="en" />

## Accessibility

- The bubble has `role="tooltip"`.
- The trigger receives `aria-describedby` that points to the bubble.
- Escape closes an uncontrolled tooltip.
- Hover and focus are the only triggers. Keep essential information out of tooltips.
