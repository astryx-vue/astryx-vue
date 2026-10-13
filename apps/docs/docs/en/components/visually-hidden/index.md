---
layout: component-docs
title: Visually Hidden
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { visuallyHiddenContext, visuallyHiddenLiveRegion, visuallyHiddenStructural } from '../../../../components/demos/visually-hidden'
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




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use to give icon-only buttons and controls an accessible name that screen readers announce. |
| <Badge variant="success">Do</Badge> | Render as a block element (as="div") with aria-live to announce dynamic updates like drag-and-drop or result counts. |
| <Badge variant="error">Don't</Badge> | Use it to hide content from everyone; it stays in the accessibility tree; use conditional rendering or `hidden` to remove content entirely. |
| <Badge variant="error">Don't</Badge> | Put interactive controls inside it; the content is not visible and cannot receive pointer input. |

## Examples

<DemoExample
  :demo="visuallyHiddenLiveRegion"
  description="When the task moves to the next column, aria-live reads the new place. People who can see the label do not need that sentence."
  locale="en"
  title="Live region"
/>

<DemoExample
  :demo="visuallyHiddenStructural"
  description="The group is obvious on screen and has no visible heading. A hidden h2 gives screen-reader users a landmark to jump to."
  locale="en"
  title="Structural heading"
/>

<DemoExample
  :demo="visuallyHiddenContext"
  description="The arrow is decoration. Whether the number went up or down is written in VisuallyHidden for a screen reader."
  locale="en"
  title="Supplementary context"
/>

