---
layout: component-docs
title: Status Dot
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { statusDotVariants, statusDotPulsing } from '../../../../components/demos/status-dot'
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
  :demo="statusDotVariants"
  description="Status dots come in neutral, info, success, warning, and error semantic variants."
  locale="en"
  title="Variants"
/>

<DemoExample
  :demo="statusDotPulsing"
  description="Set isPulsing to make the dot pulse, indicating an active state."
  locale="en"
  title="Pulsing"
/>
