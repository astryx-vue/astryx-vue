---
layout: component-docs
title: Blockquote
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { blockquoteCite } from '../../../../components/demos/blockquote'
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
import { Blockquote } from '@astryx-vue/core/Blockquote'
</script>

<template>
  <Blockquote cite="Steve Jobs">
    Design is not just what it looks like and feels like. Design is how it works.
  </Blockquote>
</template>
```




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use for quoted text, testimonials, or highlighted excerpts from external sources. |
| <Badge variant="success">Do</Badge> | Provide a cite prop when the source of the quote is known. |
| <Badge variant="error">Don't</Badge> | Use for callout boxes or informational notes; use Banner for those. |

## Examples

Common quote and attribution configurations.

<DemoExample
  :demo="blockquoteCite"
  description="A quote can stand alone. When its source is known, use cite to credit the author or publication."
  locale="en"
  title="With attribution"
/>

