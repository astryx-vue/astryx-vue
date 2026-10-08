---
layout: component-docs
title: Heading
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { headingLevels, headingDisplays } from '../../../../components/demos/heading'
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
  :demo="headingLevels"
  description="Heading renders h1–h6 semantic elements with level-based sizing by default."
  locale="en"
  title="Levels"
/>

<DemoExample
  :demo="headingDisplays"
  description="display-1, display-2, and display-3 provide larger display typography."
  locale="en"
  title="Display headings"
/>
