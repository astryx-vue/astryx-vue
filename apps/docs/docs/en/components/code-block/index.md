---
layout: component-docs
title: Code Block
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { codeBlockConfig, codeBlockDiff, codeBlockHighlighted, codeBlockScrollable, codeBlockSnippet, codeBlockTerminal } from '../../../../components/demos/code-block'
</script>

## Usage

`CodeBlock` shows a read-only snippet. Import it from `@astryx-vue/core/Code`, next to inline `Code`. The `code` string is what the reader sees and what the copy button writes.

`language` selects the tokenizer. `title` adds a filename in the header. `hasLineNumbers` draws a gutter. `highlightLines` takes one-indexed line numbers and tints those lines. `maxHeight` bounds the body before it scrolls. `hasCopyButton` stays available in the header, or floats at the top end when there is no header.

`isDiff` paints the snippet as a unified diff. A leading `+` marks an added line, `-` a removed line, and `@@` a hunk header. A `--- ` line, a `+++ ` line, and an `@@` line in that order are a file header. The glyph sits in its own column, and the rest of the line keeps the `language` syntax colors. The copy button still writes the original string, glyphs included. The header and the viewport name read `diff`, or `typescript diff` when a language is set. A highlighted line replaces the diff tint. The colors are `--astryx-code-syntax-added`, `--astryx-code-syntax-removed`, `--astryx-code-syntax-diff-header`, plus the `added-marker` and `removed-marker` slots, the same `--astryx-code-syntax-*` scheme as the other syntax colors.

`SyntaxTheme` sets the syntax custom properties for the blocks inside it. `githubDark` is the dark preset shipped with the package. Wrap a bash block in it when the snippet should read as a terminal on a light page. `defineSyntaxTheme` builds another preset from the same token names.

```vue
<script setup lang="ts">
import { CodeBlock, githubDark, SyntaxTheme } from '@astryx-vue/core/Code'

const commands = `$ astryx init --features agents`
</script>

<template>
  <SyntaxTheme :theme="githubDark">
    <CodeBlock :code="commands" language="bash" has-copy-button width="100%" />
  </SyntaxTheme>
</template>
```


<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Set `language` to the snippet, and add `title` when the code is a file. |
| <Badge variant="success">Do</Badge> | Leave line numbers off for a one-line command, and turn them on when a reader must point at a line. |
| <Badge variant="success">Do</Badge> | Use `highlightLines` for the lines a tutorial just changed. When the text is already a diff, use `isDiff` instead of painting those lines by hand. |
| <Badge variant="success">Do</Badge> | Reach for `githubDark` through `SyntaxTheme` when a command should look like a terminal. |
| <Badge variant="error">Don't</Badge> | Paint a dark box with one-off CSS. A preset keeps the token colors and the border together. |
| <Badge variant="error">Don't</Badge> | Put a paragraph of prose in a code block. |

## Examples


<DemoExample
  :demo="codeBlockSnippet"
  description="Short terminal commands with a copy button and no line numbers. Use for install instructions or one-liner commands that readers will paste directly."
  locale="en"
  title="Code — Snippet"
/>

<DemoExample
  :demo="codeBlockHighlighted"
  description="TypeScript code with specific lines highlighted to draw attention to a key section. Use highlightLines to call out new or important code in tutorials and changelogs."
  locale="en"
  title="Code — Highlighted"
/>

<DemoExample
  :demo="codeBlockDiff"
  description="The same TypeScript snippet read as a diff. Added and removed rows are tinted, and the code after the glyph stays highlighted as tsx. File headers and @@ lines stay quiet."
  locale="en"
  title="Code — Diff"
/>

<DemoExample
  :demo="codeBlockConfig"
  description="A JSON configuration file with a title bar and line numbers. The title prop adds a filename label in the header so readers know which file the code belongs to."
  locale="en"
  title="Code — Config"
/>

<DemoExample
  :demo="codeBlockScrollable"
  description="A long code block with a max height that enables vertical scrolling. Use maxHeight to keep the block from dominating the page when displaying large files."
  locale="en"
  title="Code — Scrollable"
/>

<DemoExample
  :demo="codeBlockTerminal"
  description="A dark terminal-style command block: a bash CodeBlock wrapped in SyntaxTheme with the GitHub Dark preset, copy button on, and no line numbers. Use for shell sessions or CLI output that should read as a terminal even on light pages."
  locale="en"
  title="Code — Terminal"
/>
