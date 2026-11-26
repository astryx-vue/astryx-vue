---
layout: component-docs
title: useOutlineFromMarkdown
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useOutlineFromMarkdownDocsArticle } from '../../../../components/demos/use-outline-from-markdown'
</script>

## Usage

Extracts the headings of a Markdown string for an [Outline](/en/components/outline) next to the rendered document. It uses the parser and heading slugs that `Markdown` uses, so in a complete document each item links to its heading, and a hash inside fenced code never counts as a heading. The result is a computed ref that follows the source and the options. Outside a component, call `parseOutlineFromMarkdown` instead.

```ts
import { useOutlineFromMarkdown } from '@astryx-vue/core/Outline'
```

```vue
<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { Outline, useOutlineFromMarkdown } from '@astryx-vue/core/Outline'
import { ref } from 'vue'

const markdown = ref('## Install\n\n…\n\n## Configure\n\n…')
const items = useOutlineFromMarkdown(markdown)
</script>

<template>
  <Markdown :content="markdown" />
  <Outline :items="items" />
</template>
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Pass the same string, plugin list and finality to `Markdown` and this hook, so the items match the rendered headings once the content is complete. |
| <Badge variant="success">Do</Badge> | Declare the plugin list outside the component. A new array on each read recomputes the outline. |
| <Badge variant="error">Don't</Badge> | Write the items by hand or find headings with a regular expression. They drift from the rendered ids. |
| <Badge variant="error">Don't</Badge> | Expect every item to have a target while content streams. `Markdown` reveals text gradually and trims unfinished syntax, so a heading can be absent or have another id until the content is complete. |
| <Badge variant="error">Don't</Badge> | Expect an item to link to a heading that cites a `sources` entry. The hook does not receive `sources`, so for `# Intro [ref]` `Markdown` renders `intro` while the hook returns `intro-ref`. |
| <Badge variant="error">Don't</Badge> | Expect an item for a nested heading, such as one in a blockquote. Only root headings become items. |

## Examples

<DemoExample
  :demo="useOutlineFromMarkdownDocsArticle"
  description="A docs-style article with an Outline next to it, built from the same Markdown string through useOutlineFromMarkdown. Add section appends a heading to the string, and a new entry that links to it appears in the outline."
  locale="en"
  title="useOutlineFromMarkdown — Docs Article"
/>
