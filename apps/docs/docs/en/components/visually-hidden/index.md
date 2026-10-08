---
layout: component-docs
title: Visually Hidden
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
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




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use to give icon-only buttons and controls an accessible name that screen readers announce. |
| <Badge variant="success">Do</Badge> | Render as a block element (as="div") with aria-live to announce dynamic updates like drag-and-drop or result counts. |
| <Badge variant="error">Don't</Badge> | Use it to hide content from everyone; it stays in the accessibility tree; use conditional rendering or `hidden` to remove content entirely. |
| <Badge variant="error">Don't</Badge> | Put interactive controls inside it; the content is not visible and cannot receive pointer input. |

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

