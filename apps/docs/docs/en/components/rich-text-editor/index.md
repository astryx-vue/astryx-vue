---
layout: component-docs
title: Rich Text Editor
outline: false
footer: false
---

<script setup lang="ts">
import { richtextAutoLink, richtextToolbar, richtextView } from '../../../../components/demos/rich-text-editor'
</script>

## Install

::: code-group
```sh [pnpm]
pnpm add @astryx-vue/richtext
```

```sh [npm]
npm install @astryx-vue/richtext
```

```sh [yarn]
yarn add @astryx-vue/richtext
```

```sh [bun]
bun add @astryx-vue/richtext
```
:::

`RichTextEditor` is built on Lexical. Install `lexical` and the `@lexical/*` packages required by the features you use, all pinned to `0.52.0`.

## Create an editor

Import the stylesheet once in your application entry, then render `RichTextEditor`. The required `label` prop provides the editor's accessible name.

```vue
<script setup lang="ts">
import { RichTextEditor } from '@astryx-vue/richtext'
import '@astryx-vue/richtext/richtext.css'
</script>

<template>
  <RichTextEditor label="Publish content" placeholder="Write something..." />
</template>
```

Add `RichTextEditorToolbar` through the `#toolbar` slot to provide undo, block formats, inline styles, and link actions. The toolbar scrolls horizontally when space is limited.

<DemoExample :demo="richtextToolbar" description="Add a formatting toolbar through the #toolbar slot." locale="en" title="Editor with a toolbar" />

## Save and display content

The editor and read-only view use the same Lexical state JSON:

1. Listen to the editor's `@change` event and save `editorState.toJSON()` to your backend.
2. To edit the content again, pass the saved JSON string to `defaultValue`. This prop is read only when the editor mounts.
3. For read-only display, pass the same string to `RichTextView` through `value` instead of rendering a read-only editor.

When you register custom nodes through `nodes`, register the same set on both the editor and the read-only view so content round-trips without data loss.

<DemoExample :demo="richtextView" description="Render saved Lexical state JSON with RichTextView." locale="en" title="Display saved content" />

## Keyboard commands

| Action | Keys |
| --- | --- |
| Insert a newline inside a code block | <kbd>Enter</kbd> |
| Move between table cells | Arrow keys |
| Create and move to a paragraph below a code block or table | <kbd>ArrowDown</kbd> at the block's end |
| Open or close the link dialog | <kbd>Cmd/Ctrl</kbd> + <kbd>K</kbd> |
| Indent or outdent every line the selection touches in a code block | <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd> |
| Turn a code block into a paragraph | <kbd>Backspace</kbd> at the start of the block |
| Select the code or the cell text first, then the whole document | <kbd>Cmd/Ctrl</kbd> + <kbd>A</kbd> in a code block or a table cell |
| Leave the editor | Press <kbd>Escape</kbd>, then <kbd>Tab</kbd>; use <kbd>Shift</kbd> + <kbd>Tab</kbd> for the reverse direction |

At the end of a code block or table, <kbd>ArrowDown</kbd> inserts a paragraph when no content follows or when another code block or table immediately follows. This lets you place prose between these blocks. When ordinary content already follows, the arrow keys retain Lexical's native navigation.

## Pasting, shortcuts and disabled links

- Pasting rich content into a code block inserts plain text, one line per block, so code never picks up bold, links or tables.
- Pasting a table into table cells writes it cell by cell from the top-left selected cell and adds the rows and columns it needs. A table that arrives with other content, such as a paragraph and a table copied from a web page, goes into the cell as text, since a cell cannot hold a table.
- Typing a Markdown marker (`## `, `> `, `- `, `1. `, `[ ] `) at the start of a list item re-marks that item as a heading, quote, bullet, numbered or task item. Each change is one undo step. It follows `hasMarkdownShortcuts`.
- In a disabled editor, links are not tab stops and never navigate.
- An image in Markdown (`![alt](url)`, or a reference image) comes in as one block of source text: it is deleted whole, the caret cannot enter it, and automatic links leave its URL alone. Editing beside or around it writes the source back exactly as written, so another reader still sees an image.
- A scheme-less address with a port, such as `localhost:3000` or `example.com:8080`, is linked with `https://`.
- The Insert link button with nothing selected inserts the entered address as link text at the caret; with a caret inside a link it updates that link.

## Automatic links and server-side conversion

Place `RichTextEditorAutoLinkPlugin` in the editor's default slot to turn typed URLs and email addresses into links. Use `matchers` to add custom matching rules. Text inside a code block is never linked.

<DemoExample :demo="richtextAutoLink" description="Enable the automatic link plugin in the default slot." locale="en" title="Recognize URLs and email addresses" />

To convert Markdown on the server, import `markdownToEditorStateJSON` and `editorStateJSONToMarkdown` from `@astryx-vue/richtext/markdown`. Neither function requires a browser DOM.

See the [props documentation](/en/components/rich-text-editor/props) for all properties, events, and slots.
