---
title: Quick start
---

# Quick start

Install the components and the theme. The peer dependency is Vue `^3.5.0`.

```sh
pnpm add @astryx-vue/core @astryx-vue/themes
```

Load the theme once from the app entry. Neutral includes JetBrains Mono.

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

Figtree is the first family in the body stack, and the theme package does not load it. Load the face in the app if you want it. Otherwise the stack falls through to the system sans.

Next, see how package entries work in [Installation](/en/guide/installation), how layers and variables connect in [Theme and styles](/en/guide/styling), or open [Components](/en/components/). The reason the project is shaped this way is in [Why](/en/guide/why).
