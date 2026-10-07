---
layout: component-docs
title: Blockquote
outline: false
footer: false
---

<script setup lang="ts">
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

## Examples

Common quote and attribution configurations.

<DemoExample
  :demo="blockquoteCite"
  description="A quote can stand alone. When its source is known, use cite to credit the author or publication."
  locale="en"
  title="With attribution"
/>

