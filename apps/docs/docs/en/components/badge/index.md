---
layout: component-docs
title: Badge
outline: false
footer: false
---

<script setup lang="ts">
import { badgeColors, badgeCounts } from '../../../../components/demos/badge'
</script>


## Usage

Import the component from its dedicated entry. The component loads its structural styles.

Import the theme in your application entry:

```ts
import '@astryx-vue/themes/neutral.css'
```

Component usage:

```vue
<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

<template>
  <Badge variant="success">
    Completed
  </Badge>
</template>
```

## Examples

Common Badge configurations and use cases.

<DemoExample
  :demo="badgeColors"
  description="Use non-semantic colors to distinguish categories such as teams, topics, or priorities. Color establishes visual grouping rather than communicating system status."
  locale="en"
  title="Colors"
/>

<DemoExample
  :demo="badgeCounts"
  description="Show concise counts beside notifications, lists, or navigation items. Use compact forms such as 99+ for larger values."
  locale="en"
  title="Counts"
/>

