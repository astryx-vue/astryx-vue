---
layout: component-docs
title: Text
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { textTypes, textTruncation } from '../../../../components/demos/text'
</script>

## Usage

Import the component from its dedicated entry. Structural styles are loaded automatically.

```vue
<script setup lang="ts">
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Text type="body">
    Body content
  </Text>
  <Text type="supporting">
    Supporting details
  </Text>
</template>
```

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Recommended</Badge> | Use `type` for semantic hierarchy: `large` for emphasis, `supporting` for hints, `label` for form labels. |
| <Badge variant="success">Recommended</Badge> | Set `as="p"` or `display="block"` when you need block-level layout. |
| <Badge variant="success">Recommended</Badge> | Use `maxLines` to clamp long text to a fixed number of lines. |
| <Badge variant="error">Don't</Badge> | Use `Text` in place of `Heading`. Headings should use the `Heading` component for correct semantics. |
| <Badge variant="error">Don't</Badge> | Mix too many `type` and `size` combinations in the same short passage. |

## Examples

<DemoExample
  :demo="textTypes"
  description="Text provides body, large, supporting, label, and code semantic types."
  locale="en"
  title="Text types"
/>

<DemoExample
  :demo="textTruncation"
  description="Use maxLines to limit visible lines and truncate with an ellipsis."
  locale="en"
  title="Truncation"
/>
