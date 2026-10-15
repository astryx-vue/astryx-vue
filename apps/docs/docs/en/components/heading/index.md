---
layout: component-docs
title: Heading
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { headingCardGrid, headingHierarchy, headingOutline, headingTruncation } from '../../../../components/demos/heading'
</script>

## Usage

Import the component from its dedicated entry. Structural styles are loaded automatically.

```vue
<script setup lang="ts">
import { Heading } from '@astryx-vue/core/Heading'
</script>

<template>
  <Heading :level="1">
    Page title
  </Heading>
  <Heading :level="2" type="display-2">
    Overview
  </Heading>
</template>
```

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Recommended</Badge> | Choose `level` to match the document outline; avoid skipping levels. |
| <Badge variant="success">Recommended</Badge> | Use `type="display-*"` for marketing or large callouts while keeping the semantic `level`. |
| <Badge variant="success">Recommended</Badge> | Use `color="secondary"` for lower-emphasis headings. |
| <Badge variant="error">Don't</Badge> | Pick a `level` purely for visual size. Use `type` for visuals and `level` for semantics. |
| <Badge variant="error">Don't</Badge> | Put long paragraphs inside headings. Keep headings short. |

## Examples

<DemoExample
  :demo="headingCardGrid"
  description="Responsive card grid with truncated headings and descriptions for uniform layout."
  locale="en"
  title="Card grid"
/>

<DemoExample
  :demo="headingHierarchy"
  description="Real-world page layout demonstrating heading levels h1 through h3 with supporting text."
  locale="en"
  title="Page hierarchy"
/>

<DemoExample
  :demo="headingTruncation"
  description="Single-line and multi-line heading truncation with ellipsis for constrained layouts. Hover reads the full text once it is cut off."
  locale="en"
  title="Truncation"
/>

<DemoExample
  :demo="headingOutline"
  description="The visual level and the outline level can differ. Strikethrough and alignment stay on the heading."
  locale="en"
  title="Outline and alignment"
/>
