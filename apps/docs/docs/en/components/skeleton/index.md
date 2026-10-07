---
layout: component-docs
title: Skeleton
outline: false
footer: false
---

<script setup lang="ts">
import { skeletonProfile } from '../../../../components/demos/skeleton'
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
import { Skeleton } from '@astryx-vue/core/Skeleton'
</script>

<template>
  <div aria-busy="true" aria-label="Loading content" role="status">
    <Skeleton :height="20" :width="200" />
  </div>
</template>
```

## Examples

Compose placeholder shapes to match the dimensions and structure of the final content.

<DemoExample
  :demo="skeletonProfile"
  description="Match each placeholder to the final content's size and shape, then use index to stagger the pulse animation."
  locale="en"
  title="Content placeholder"
/>

