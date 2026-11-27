---
layout: component-docs
title: useOutlineFromDOM
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useOutlineFromDomDocsArticle } from '../../../../components/demos/use-outline-from-dom'
</script>

## Usage

Builds outline items from the headings already in the page. Use it when the article is not a Markdown string, and pass the items to an [Outline](/en/components/outline). The list updates when headings are added, removed, renamed, or given a new id.

```ts
import { useOutlineFromDOM } from '@astryx-vue/core/Outline'
```

```vue
<script setup lang="ts">
import { Outline, useOutlineFromDOM } from '@astryx-vue/core/Outline'
import { ref } from 'vue'

const article = ref<HTMLElement | null>(null)
const items = useOutlineFromDOM(article)
</script>

<template>
  <article ref="article">
    <h2 id="install">
      Install
    </h2>
    <h2 id="configure">
      Configure
    </h2>
  </article>
  <Outline :items="items" />
</template>
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Put an id on every heading the outline should list. A heading with no id, or with no text, is omitted. |
| <Badge variant="success">Do</Badge> | Point the ref at the article, not the page, so headings outside the article stay out of the outline. |
| <Badge variant="error">Don't</Badge> | Expect the hook to invent ids. It only reads the ids the headings already have. |
| <Badge variant="error">Don't</Badge> | Use it for a Markdown string. `useOutlineFromMarkdown` follows the same parser and slugs as `Markdown`. |

## Examples

<DemoExample
  :demo="useOutlineFromDomDocsArticle"
  description="An article with an Outline next to it, built from the headings in the page through useOutlineFromDOM. Add section appends a heading with an id, and a new entry that links to it appears in the outline."
  locale="en"
  title="useOutlineFromDOM — Docs Article"
/>
