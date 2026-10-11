---
layout: component-docs
title: Markdown
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { markdownBasic, markdownRich, markdownStreaming } from '../../../../components/demos/markdown'
</script>

## Usage

`Markdown` renders a Markdown source as prose. It covers headings, paragraphs, emphasis, links, inline code, code blocks, quotes, lists, task lists, tables, thematic breaks, and images. Tables, strikethrough, task lists, and autolinks follow GFM.

Import it from its own entry. Structural styles load with the component. Import the theme once in the application entry:

```ts
import '@astryx-vue/themes/neutral.css'
```

```vue
<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
</script>

<template>
  <Markdown content="## Title\n\nA **note**." />
</template>
```

When `content` is omitted, text in the default slot is the source. The slot reads text only. It does not accept nodes that are already rendered.

Links have control characters removed. `javascript:`, `vbscript:`, and `data:text/html` do not become clickable targets; the link text stays. Images also reject every `data:` URL. Raw HTML is never executed. Tags are shown as text.

Code blocks go through the existing `CodeBlock`, quotes through `Blockquote`, headings through `Heading`, and links through `Link`. Lists and tables use semantic elements, because the existing `List` component and the table export are interface controls rather than prose.

`components` replaces the renderer for one kind of node. A custom component receives the node data as props and, when the node has content, that content as the default slot.

`isStreaming` turns on streaming. While content is only appended, a block that has already closed keeps its rendered node, and only the last unfinished block is parsed again. New text fades in with `--astryx-duration-fast-max`. When the system prefers reduced motion, the fade is skipped.

`isStreaming` does not reveal the string character by character. Use `useStreamingText` for that, then pass its string as `content`. Markdown does not smooth that string again. To simulate a model, pass the accumulated source as `content` and leave `isStreaming` on until the reply is finished.

This version has no plugin protocol and does not render math.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use it for model replies, documentation excerpts, and explanatory prose. |
| <Badge variant="success">Do</Badge> | While streaming, only append text, and set `isStreaming` back to `false` when the reply is done. |
| <Badge variant="success">Do</Badge> | For a character reveal, call `useStreamingText` once and pass the result as `content`. `isStreaming` handles block parsing and the fade, and does not smooth again. |
| <Badge variant="success">Do</Badge> | Set `contentWidth` when the line length should be capped. Without it, prose uses the container width. |
| <Badge variant="error">Don't</Badge> | Put user-supplied HTML in the source and expect it to run. The component shows it as text. |
| <Badge variant="error">Don't</Badge> | Replace the whole source while `isStreaming` is `true`. The cache assumes the text only grows at the end. |

## Examples

The short sample used on the catalog card.

<DemoExample
  :demo="markdownBasic"
  description="A heading, a paragraph, emphasis, inline code, a link, and a list."
  locale="en"
  title="Basic prose"
/>

<DemoExample
  :demo="markdownRich"
  description="Strikethrough, an autolink, a quote, a task list, a table, a code block, and a rule."
  locale="en"
  title="GFM"
/>

<DemoExample
  :demo="markdownStreaming"
  description="The button appends the source in short pieces. A finished heading stays put, and new text fades in."
  locale="en"
  title="Simulated streaming"
/>
