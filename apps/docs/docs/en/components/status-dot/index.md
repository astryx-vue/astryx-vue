---
layout: component-docs
title: Status Dot
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { statusDotIndicators, statusDotPulsing, statusDotVariants } from '../../../../components/demos/status-dot'
</script>

## Usage

Import the component from its dedicated entry. Structural styles are loaded automatically.

```vue
<script setup lang="ts">
import { StatusDot } from '@astryx-vue/core/StatusDot'
</script>

<template>
  <StatusDot label="Online" variant="success" />
</template>
```


<ComponentAnatomy />

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Recommended</Badge> | Always provide `label`; screen readers announce it via `aria-label`. |
| <Badge variant="success">Recommended</Badge> | Use the dot as a supporting signal alongside a visible text label. |
| <Badge variant="success">Recommended</Badge> | Use `isPulsing` for live, ongoing activity such as streaming or syncing. |
| <Badge variant="error">Don't</Badge> | Rely on color alone for critical status. Color is not perceivable by everyone. |
| <Badge variant="error">Don't</Badge> | Use many pulsing dots on the same screen; it creates visual noise. |

## Examples

<DemoExample
  :demo="statusDotPulsing"
  description="isPulsing makes the dot breathe, for a state that is still in progress."
  locale="en"
  title="Pulsing"
/>

<DemoExample
  :demo="statusDotIndicators"
  description="A label beside the dot for online, away, offline, and unknown."
  locale="en"
  title="Status indicators"
/>

<DemoExample
  :demo="statusDotVariants"
  description="Neutral, info, success, warning, and error, side by side."
  locale="en"
  title="Variants"
/>
