---
layout: component-docs
title: Markdown
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import {
  markdownCited,
  markdownCompact,
  markdownNumbered,
  markdownPlugins,
  markdownRich,
  markdownTable,
} from '../../../../components/demos/markdown'
</script>

## Usage

`Markdown` renders a Markdown source as prose. It covers headings, paragraphs, emphasis, links, inline code, code blocks, quotes, lists, task lists, tables, thematic breaks, and images. Tables, strikethrough, and task lists follow GFM. Angle-bracket URLs and emails are always links. A bare URL, a `www.` host, or a bare email becomes a link only when `autolink` is `gfm`. Trailing sentence punctuation stays outside the link.

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

The values in `components` are component definitions and do not need to be reactive. A plain object works. If you put them inside `ref()` or `reactive()`, Vue makes the component definitions reactive too, and in development it logs `Vue received a Component that was made a reactive object`. Rendering is not affected; the cost is some unnecessary overhead. To avoid the warning, use any one of these:

```ts
import { markRaw, ref, shallowRef } from 'vue'

// A plain object, not wrapped in reactivity
const components = { paragraph: MyParagraph }

// Use shallowRef (or shallowReactive) when you need to swap the whole object
const swappable = shallowRef({ paragraph: MyParagraph })

// Or wrap each component with markRaw; an outer ref then does not warn
const marked = ref({ paragraph: markRaw(MyParagraph) })
```

`plugins` run on the parsed tree. `transform` receives the root and returns the next one. Return the same root when nothing changed, so a streaming render can keep settled blocks. `render` draws an `extension` node whose `plugin` equals that name. `inlinePlugins` match ordinary text nodes. `pattern` needs the `g` flag. Earlier plugins match first, and the first plugin wins when two matches overlap. Inline code and fenced code are left alone. `replace` returns the node that takes the match, or `null` to skip it. An extension node is drawn by the plugin `render` of the same `name`. A `link` node uses the normal link renderer.

`defineMarkdownPlugin` returns the plugin object unchanged, which narrows the type. `isMarkdownExtensionNode` checks that a node belongs to a plugin.

With `sources`, `[id]` and `【id】` render as citation chips. `citationStyle` defaults to `label`, which shows the source title. `number` shows a compact badge, and the same id keeps the same number.

A heading gets a focusable anchor whose `href` is the heading id, with an `aria-label`. Nested list markers cycle by depth: disc, circle, and square for bullets, and decimal, lower-alpha, and lower-roman for numbers.

Character references in prose are decoded, so `&amp;` shows as `&` and `&copy;` shows as ©. A fenced `&copy;` stays as written.

Fenced code wraps long lines. The code element carries `data-wrapped="true"`.

A fence info string of `diff` or `diff-ts` turns the diff layer on for the built-in code block. A custom `components.code` still receives the info string as written.

Import `markdownSourceLinesPlugin` from `@astryx-vue/core/Markdown/plugins` and pass it in `plugins`. Headings, paragraphs, list items, quotes, the code wrapper, the table wrapper, and rules then get `data-source-line` and `data-source-line-end`. Without that plugin, those attributes are absent.

`@astryx-vue/core/Markdown/parser` exports `parseMarkdownAst`, `parseInlineAst`, `decodeMarkdownCharacterReferences`, plus the legacy block list `parseMarkdown` and inline `parseInline`. The `parseMarkdown` used by the component still returns the syntax-tree root, not that block list. `math: true` does not emit math nodes. `parseInlineAst` and `parseInline` read inline content only: `# h` stays text, and a fence reads as one code span.

`isStreaming` turns on streaming. While content is only appended, a block that has already closed keeps its rendered node, and only the last unfinished block is parsed again. New text fades in with `--astryx-duration-fast-max`. When the system prefers reduced motion, the fade is skipped.

`isStreaming` does not reveal the string character by character. Use `useStreamingText` for that, then pass its string as `content`. Markdown does not smooth that string again. To simulate a model, pass the accumulated source as `content` and leave `isStreaming` on until the reply is finished.

This version does not render math.


<ComponentAnatomy />

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

The examples match [Astryx Markdown](https://astryx.atmeta.com/components/Markdown), in the same order. The catalog card is a short English sample, with no button and no status line.

<DemoExample :demo="markdownCited" description="Compact density, headings starting at h3. An [id] in the prose becomes a source chip." locale="en" title="Markdown — Cited Content" />

<DemoExample :demo="markdownNumbered" description="The same sources as numbered badges. A repeated id keeps its number." locale="en" title="Markdown — Numbered citations" />

<DemoExample :demo="markdownPlugins" description="A block plugin turns a Note paragraph into a callout, an inline plugin turns @name into a link, and autolink links the bare URL." locale="en" title="Markdown — Plugins" />

<DemoExample :demo="markdownCompact" description="Compact density, headings starting at h3. Includes a code block, a list, and a quote." locale="en" title="Markdown — Compact AI Response" />

<DemoExample :demo="markdownTable" description="Column alignment follows the GFM markers. The header is secondary text, with row rules only." locale="en" title="Markdown — Data Table" />

<DemoExample :demo="markdownRich" description="Headings, emphasis, a list, a link, a code block, and a task list." locale="en" title="Markdown — Rich Content" />
