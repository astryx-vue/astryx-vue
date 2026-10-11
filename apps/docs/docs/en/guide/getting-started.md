---
title: Getting started
outline: false
footer: false
---

# Getting started

Install the components and the theme:

```sh
pnpm add @astryx-vue/core @astryx-vue/themes
```

Load the theme once from the app entry. Neutral includes JetBrains Mono.

```ts
import '@astryx-vue/themes/neutral.css'
```

Each component entry loads its own structural styles. Import every structural stylesheet at once with:

```ts
import '@astryx-vue/core/styles.css'
```

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
</script>

<template>
  <Button label="Get started" />
</template>
```

Component docs: [Components](/en/components/).
