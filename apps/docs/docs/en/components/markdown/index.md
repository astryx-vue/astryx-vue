---
layout: component-docs
title: Markdown
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import {
  markdownAlignCenter,
  markdownAlignStart,
  markdownAutolinks,
  markdownBlockquote,
  markdownCodeBlock,
  markdownCompact,
  markdownContentWidth,
  markdownContinuations,
  markdownDivider,
  markdownEmphasis,
  markdownHeadings,
  markdownImages,
  markdownInline,
  markdownInlineCode,
  markdownLinks,
  markdownNestedLists,
  markdownOrderedList,
  markdownShifted,
  markdownStreaming,
  markdownTable,
  markdownTableApi,
  markdownTableComparison,
  markdownTableEdges,
  markdownTableProse,
  markdownTableRelease,
  markdownTableShort320,
  markdownTableShort390,
  markdownTableShort528,
  markdownTableShort1024,
  markdownTableWide,
  markdownTaskList,
  markdownUnorderedList,
} from '../../../../components/demos/markdown'
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

Each feature, variant, and reading width is its own example, matching the original Astryx docs and Storybook. The catalog card uses a short English sample, with no button and no status line.

<DemoExample :demo="markdownHeadings" description="All six levels use the prose heading scale. The hash appears only on hover or keyboard focus." locale="en" title="Headings" />

<DemoExample :demo="markdownEmphasis" description="Bold uses semibold. Italic and strikethrough stay separate." locale="en" title="Emphasis" />

<DemoExample :demo="markdownLinks" description="Links are underlined in the text accent color, not the brand blue." locale="en" title="Links" />

<DemoExample :demo="markdownInlineCode" description="Inline code uses the existing Code component." locale="en" title="Inline code" />

<DemoExample :demo="markdownCodeBlock" description="A fenced block uses CodeBlock and keeps the container width, ignoring contentWidth." locale="en" title="Code block" />

<DemoExample :demo="markdownBlockquote" description="Quotes use Blockquote." locale="en" title="Blockquote" />

<DemoExample :demo="markdownUnorderedList" description="A filled dot. Nested levels switch to a ring, then a square." locale="en" title="Unordered list" />

<DemoExample :demo="markdownOrderedList" description="The default start is 1. A start written in the source is kept, including 26 and 0." locale="en" title="Ordered list" />

<DemoExample :demo="markdownNestedLists" description="Each nesting level picks the next marker. Bullets and numbers both cycle every three levels, and mixed lists count either kind." locale="en" title="Nested lists" />

<DemoExample :demo="markdownTaskList" description="Read-only checkboxes. They are not a form control." locale="en" title="Task list" />

<DemoExample :demo="markdownTable" description="Left, center, and right markers each apply. A column with no marker keeps the default alignment. The header is secondary text with row rules only." locale="en" title="Table alignment" />

<DemoExample :demo="markdownTableShort320" description="Six short columns inside a 320px reading column. Each column keeps a content floor, so this table does not need to scroll." locale="en" title="Narrow table, 320" />

<DemoExample :demo="markdownTableShort390" description="The same six-column table inside a 390px reading column." locale="en" title="Narrow table, 390" />

<DemoExample :demo="markdownTableShort528" description="The same six-column table inside a 528px reading column." locale="en" title="Narrow table, 528" />

<DemoExample :demo="markdownTableShort1024" description="The same six-column table inside a 1024px reading column." locale="en" title="Narrow table, 1024" />

<DemoExample :demo="markdownTableProse" description="Six prose columns. The floor is about half the longest cell, so a column wraps to a couple of lines. Width 390." locale="en" title="Prose columns" />

<DemoExample :demo="markdownTableEdges" description="Empty cells, an unbreakable token, and a cell that mixes a link with inline code. Width 390." locale="en" title="Table edge shapes" />

<DemoExample :demo="markdownTableApi" description="A short method column beside routes that stay whole. The table scrolls instead of crushing the method. Width 390." locale="en" title="API reference" />

<DemoExample :demo="markdownTableRelease" description="Short columns beside one sentence. Version strings stay intact. Width 390." locale="en" title="Release status" />

<DemoExample :demo="markdownTableComparison" description="Headers are longer than the cells under them. A header wraps instead of truncating. Width 390." locale="en" title="Feature comparison" />

<DemoExample :demo="markdownTableWide" description="Long links and long code stay whole, and the table scrolls. Width 390." locale="en" title="Wide table" />

<DemoExample :demo="markdownDivider" description="The rule uses the border color, with heading-scale space above and below." locale="en" title="Divider" />

<DemoExample :demo="markdownImages" description="Landscape, portrait, and wide images stay inside the container and use the element radius." locale="en" title="Images" />

<DemoExample :demo="markdownAutolinks" description="URLs, email addresses, and bracketed autolinks follow GFM." locale="en" title="Autolinks" />

<DemoExample :demo="markdownInline" description="display inline does not create a block box, so the markdown can sit inside a sentence." locale="en" title="Inline display" />

<DemoExample :demo="markdownCompact" description="density compact tightens the space between blocks. Level-one and level-two headings stay a step looser than deeper ones." locale="en" title="Compact density" />

<DemoExample :demo="markdownShifted" description="With headingLevelStart 3, one hash renders as h3, and deeper levels stop at h6." locale="en" title="Shifted headings" />

<DemoExample :demo="markdownContentWidth" description="contentWidth 680 caps prose, headings, lists, and quotes. Code blocks and tables still use the container width." locale="en" title="Measure 680" />

<DemoExample :demo="markdownAlignStart" description="A 580px measure, aligned to the start. The frame is 900px wide so the code block and table read as wider." locale="en" title="Align start" />

<DemoExample :demo="markdownAlignCenter" description="The same measure, centered in the container. Code blocks and tables still fill the frame." locale="en" title="Align center" />

<DemoExample :demo="markdownContinuations" description="The next source line of a quote, list, or task can omit the marker and still belong to the same block." locale="en" title="Lazy continuations" />

<DemoExample :demo="markdownStreaming" description="The button appends the source in short pieces. A finished heading stays put, and new text fades in. The button stays on the component page." locale="en" title="Simulated streaming" />
