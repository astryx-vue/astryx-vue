---
title: Quick start
---

# Quick start

Install the components and the theme. The peer dependency is Vue `^3.5.0`.

```sh
pnpm add @astryx-vue/core @astryx-vue/themes
```

Load the theme once from the app entry. Neutral includes Figtree and JetBrains Mono.

```ts
import '@astryx-vue/themes/neutral.css'
```

Import each component from its own subpath. That entry loads the matching structural styles.

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
</script>

<template>
  <Button label="Get started" />
</template>
```

Import every structural stylesheet at once with:

```ts
import '@astryx-vue/core/styles.css'
```

Next, see how package entries work in [Installation](/en/guide/installation), how layers and variables connect in [Theme and styles](/en/guide/styling), or open [Components](/en/components/). To learn more about the background and design decisions, see [Introduction](/en/guide/why).
