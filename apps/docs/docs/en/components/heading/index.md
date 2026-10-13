---
layout: component-docs
title: Heading
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { headingCardGrid, headingHierarchy, headingTruncation } from '../../../../components/demos/heading'
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
  description="The heading stays on one line and the description clamps to two, so cards in a grid keep the same height."
  locale="en"
  title="Card grid"
/>

<DemoExample
  :demo="headingHierarchy"
  description="An h1, an h2, and an h3 on one page, each with the text that belongs under it."
  locale="en"
  title="Page hierarchy"
/>

<DemoExample
  :demo="headingTruncation"
  description="Inside a fixed width, maxLines of 1 keeps a single line and maxLines of 2 keeps two, both ending in an ellipsis."
  locale="en"
  title="Truncation"
/>
