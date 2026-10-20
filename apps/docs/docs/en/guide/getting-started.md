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

## For AI agents

Every page is also published as plain text, so an agent can read the docs without installing anything:

- [/llms.txt](https://astryx-vue.pages.dev/llms.txt) lists every page with a one-line summary. Chinese: [/llms-zh.txt](https://astryx-vue.pages.dev/llms-zh.txt).
- [/llms-full.txt](https://astryx-vue.pages.dev/llms-full.txt) puts the whole documentation in one file. Chinese: [/llms-full-zh.txt](https://astryx-vue.pages.dev/llms-full-zh.txt).
- Add `.md` to any page address to read that single page as Markdown, for example [/en/components/button.md](https://astryx-vue.pages.dev/en/components/button.md). Chinese pages have no `/zh` prefix: `/components/button.md`.

A component's Markdown file pulls its overview, props tables, examples with the demo source, and accessibility checks into one document. Every HTML page links to its Markdown version in the page head, and the command line has the same component text, see [CLI](/en/guide/cli).
