---
layout: component-docs
title: Code
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { codeContent, codeInline, codeSizes } from '../../../../components/demos/code'
</script>

## Usage

`Code` marks a short technical reference inside a sentence, such as a function name, a prop, a file path, or a command-line flag. It renders a semantic `<code>` element in a monospace font on a muted background, and it wraps long identifiers instead of pushing the surrounding paragraph wider.

`CodeBlock` presents a read-only snippet of one or more lines. It adds the parts a snippet needs to stand on its own: a header with a title and the language, a copy button, optional line numbers, optional highlighted lines, optional syntax highlighting, a bounded scroll area, and an optional collapse control. Both components are exported from `@astryx-vue/core/Code`.

```vue
<script setup lang="ts">
import { Code, CodeBlock } from '@astryx-vue/core/Code'

const snippet = 'const total = items.length'
</script>

<template>
  <p>Count the items with <Code>items.length</Code>.</p>

  <CodeBlock :code="snippet" language="typescript" title="count.ts" />
</template>
```

The `language` prop selects the tokenizer. The built-in set covers `typescript`, `javascript`, `tsx`, `jsx`, `ts`, `js`, `json`, `html`, `xml`, `svg`, `css`, `scss`, `less`, `python`, `py`, `bash`, `sh`, `zsh`, `shell`, `php`, `hack`, `yaml`, `yml`, `markdown`, and `md`. Anything else, including `plaintext`, renders the code exactly as written without tokens, and `plaintext` also hides the language label because it says nothing the reader needs. A language the tokenizer does not know is not an error: you can also pass your own `tokenizer` function that returns tokens with absolute offsets, and it will be painted while the displayed and copied text stays the source string.

The header appears when there is a title or a visible language label, and it is where the copy button lives. When neither exists, the copy button floats at the top end of the block instead, so copying stays available without a header. `hasLanguageLabel` turns the label off while keeping the header a title-only bar.

Line numbers are off by default. Turn them on with `hasLineNumbers`; the gutter is sized to the widest line number so the code column starts at a stable offset. `highlightLines` takes one-indexed line numbers and tints those lines to draw attention to them. Set `isWrapped` when long lines should wrap rather than scroll sideways, and `maxHeight` to bound the height before the code scrolls vertically; `0` is a valid bound and means the body is fully collapsed to its header height. The block is as wide as its longest line by default: `width="fit-content"` keeps a short snippet compact with a floor, while `width="100%"` fills the parent. `container="section"` drops the border, radius, and background so a block sits inside a card or panel without painting a second surface.

A long block can collapse. Set `isCollapsible` and the header becomes a disclosure control once the header is visible and the code reaches `collapsibleThreshold` lines, which is 10 by default. The block starts expanded, reports its state through `aria-expanded`, and points at the region it controls through `aria-controls`. While collapsed, that region stays mounted but `inert`, so the code is out of the tab order and out of the accessibility tree instead of sitting there invisibly. If the control disappears, for example because the title is removed, the block expands again on its own.

The copy button writes the exact `code` string, so what a reader pastes always matches the source even when the display is tokenized, numbered, or wrapped. After a successful write the control name changes to `Copied`, the icon flips from a copy glyph to a check, and a polite live region announces the same word; the hover hint keeps reading `Copy code`, because the icon flip is the confirmation. A rejected clipboard write keeps the control in its resting state and emits nothing. `copyLabel`, `copiedLabel`, and `codeLabel` carry the English defaults and exist so an application can localize those strings.

The code viewport is a named `role="group"` with a keyboard stop, so a keyboard user can scroll a snippet that overflows. The copy control and the collapse control are separate siblings, each with its own accessible name, so activating one never triggers the other. Syntax colors come from the `--astryx-code-syntax-*` tokens, and `highlightMode` chooses how they are painted: `auto` uses the CSS Custom Highlight API when the browser supports it well and falls back to spans, `ranges` paints through the API without adding any element to the code text, and `spans` wraps every token in an element. The text, the semantics, and the copy output are the same in all three.


<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use `Code` for short references inside prose, such as a property name or a flag, and `CodeBlock` for anything that stands on its own or spans more than one line. |
| <Badge variant="success">Do</Badge> | Set `language` to match the snippet so the tokens are accurate, and add a `title` when the code is a file. The title tells readers where the snippet came from. |
| <Badge variant="success">Do</Badge> | Use `size="inherit"` on inline code inside larger or smaller text so the code matches the line it sits in. |
| <Badge variant="success">Do</Badge> | Reach for `maxHeight` or `isCollapsible` on long snippets instead of nesting the block in your own scroll container. |
| <Badge variant="error">Don't</Badge> | Turn on line numbers for a two-line snippet. They add clutter without helping anyone find a line. |
| <Badge variant="error">Don't</Badge> | Put a paragraph of prose inside a `CodeBlock`, or use `Code` for a whole file. Each component has one job. |
| <Badge variant="error">Don't</Badge> | Rely on syntax colors alone to carry meaning. Tokens paint the code; they do not explain it. |

## Examples

<DemoExample
  :demo="codeSizes"
  description="Inline code rendered inside heading, body, supporting, and label text. Code automatically matches the font size of its parent text element."
  locale="en"
  title="Text sizes"
/>

<DemoExample
  :demo="codeInline"
  description="Inline code references mixed within a paragraph of body text. Use Code to mark up function names, hooks, or API terms so they stand out from surrounding prose."
  locale="en"
  title="Inline"
/>

<DemoExample
  :demo="codeContent"
  description="Inline code used for variables, terminal commands, CSS properties, file paths, and keyboard shortcuts. Shows how Code adapts to different kinds of technical content."
  locale="en"
  title="Content types"
/>
