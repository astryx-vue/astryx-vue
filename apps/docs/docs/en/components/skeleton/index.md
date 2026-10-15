---
layout: component-docs
title: Skeleton
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { skeletonCard, skeletonList, skeletonTable } from '../../../../components/demos/skeleton'
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





<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Match the size and shape of the content being loaded to create a realistic placeholder. |
| <Badge variant="success">Do</Badge> | Stagger multiple skeletons with the `index` prop for a natural wave animation. |
| <Badge variant="error">Don't</Badge> | Use when the content dimensions are unknown; use Spinner instead. |
| <Badge variant="error">Don't</Badge> | Combine with a Spinner on the same content area; pick one loading pattern. |
| <Badge variant="error">Don't</Badge> | Show skeletons indefinitely; if loading takes too long, show an error or empty state instead. |

## Examples

<DemoExample
  :demo="skeletonCard"
  description="A card placeholder: a round avatar, a name, a short line, then a few lines of body text. index staggers the pulse."
  locale="en"
  title="Card loading"
/>

<DemoExample
  :demo="skeletonList"
  description="Horizontal bars of different widths, standing in for a list that has not loaded yet."
  locale="en"
  title="Staggered list"
/>

<DemoExample
  :demo="skeletonTable"
  description="Four columns per row, with widths that follow the content, and a pulse that steps forward by index."
  locale="en"
  title="Table rows"
/>

