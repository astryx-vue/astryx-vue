---
layout: component-docs
title: Visually Hidden
outline: false
footer: false
---

<script setup lang="ts">
import { visuallyHiddenContext, visuallyHiddenLiveRegion } from '../../../../components/demos/visually-hidden'
</script>


## Usage

Import `VisuallyHidden` from its dedicated entry. The default slot is required:

```vue
<script setup lang="ts">
import { VisuallyHidden } from '@astryx-vue/core/VisuallyHidden'
</script>

<template>
  <a href="/articles/accessibility">
    Read more
    <VisuallyHidden> about accessibility primitives</VisuallyHidden>
  </a>
</template>
```

## Examples

Add context and dynamic status information that assistive technology needs but the visual interface does not show.

<DemoExample
  :demo="visuallyHiddenContext"
  description="Add screen-reader-only context to a short link so its purpose remains clear when read outside the surrounding page."
  locale="en"
  title="Supplementary context"
/>

<DemoExample
  :demo="visuallyHiddenLiveRegion"
  description="Use a block root and aria-live to announce dynamic visual updates while keeping the hidden content in the accessibility tree."
  locale="en"
  title="Live region"
/>

