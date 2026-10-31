---
title: Rich text
---

<script setup lang="ts">
import {
  richtextAutoLink,
  richtextBasic,
  richtextReadOnly,
  richtextState,
  richtextStatus,
  richtextToolbar,
  richtextView,
} from '../../../components/richtext-demos'
</script>

# Rich text

::: warning You install the dependencies yourself
`@astryx-vue/richtext` treats `lexical` and its companion packages as optional peer dependencies (`peerDependencies`). For the editor to work, install `lexical` and the `@lexical/*` packages in your project yourself. Pin them to the same minor version as this package: `0.52.0`.
:::

## What this is

`@astryx-vue/richtext` is a rich text editor package for Vue 3. It builds on the Lexical framework so users can type headings, bold text, lists, code blocks, and tables right in the browser with immediate visual feedback.

It does three main things:
1. Provides a ready-to-use `<RichTextEditor>` input area and an optional `<RichTextEditorToolbar>`.
2. Turns `# ` or `- ` into headings and lists as you type (Markdown shortcuts), and exports the document back to Markdown without touching unchanged blocks.
3. Provides `<RichTextView>`, a lightweight read-only component that renders saved content without the overhead of an editor.

## Install

The editor depends on `@astryx-vue/core`, `vue`, and Meta's `lexical` packages. Run this command in your project terminal (keep all `lexical` and `@lexical/*` packages pinned to `0.52.0`):

```bash
pnpm add @astryx-vue/richtext \
  lexical@0.52.0 \
  @lexical/code@0.52.0 \
  @lexical/extension@0.52.0 \
  @lexical/headless@0.52.0 \
  @lexical/history@0.52.0 \
  @lexical/html@0.52.0 \
  @lexical/link@0.52.0 \
  @lexical/list@0.52.0 \
  @lexical/markdown@0.52.0 \
  @lexical/rich-text@0.52.0 \
  @lexical/selection@0.52.0 \
  @lexical/table@0.52.0 \
  @lexical/utils@0.52.0
```

Import the base styles in your application entry file (such as `main.ts`):

```ts
import '@astryx-vue/richtext/richtext.css'
```

## Your first content

`<RichTextEditor>` requires only the `label` prop to get started. Screen readers use this label to announce the field, so it is required for accessibility.

Here is the shortest working example:

```vue
<script setup lang="ts">
import { RichTextEditor } from '@astryx-vue/richtext'
</script>

<template>
  <RichTextEditor label="Release notes" placeholder="Type something here..." />
</template>
```

Here is the rendered result:

<DemoExample
  :demo="richtextBasic"
  description="Basic rich text editor with a label, placeholder, and an initial paragraph."
  locale="en"
  title="Basic editor"
/>

## `<RichTextEditor>` props

This section covers all props, slots, events, and template ref methods supported by `<RichTextEditor>`.

### Props

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | Required | Accessible label text for the editor. Screen readers require it. |
| `isLabelHidden` | `boolean` | `false` | Visually hides the label while keeping it accessible to screen readers. |
| `description` | `string` | - | Helper text displayed between the label and the editing area. |
| `isOptional` | `boolean` | `false` | Marks the field as optional. Mutually exclusive with `isRequired`. |
| `isRequired` | `boolean` | `false` | Marks the field as required. Mutually exclusive with `isOptional`. |
| `defaultValue` | `string` | - | Initial content string produced by `JSON.stringify(editorState.toJSON())`. The editor is uncontrolled and reads this value only once upon mount. |
| `placeholder` | `string` | - | Dim helper text displayed when the editing area is completely empty. |
| `isReadOnly` | `boolean` | `false` | Read-only state. Text remains sharp and stays in the Tab order so users can select, copy, and read content without modifying it. |
| `isDisabled` | `boolean` | `false` | Disabled state. Muted colors, non-editable, and removed from the keyboard Tab order. Takes precedence if both `isReadOnly` and `isDisabled` are true. |
| `status` | `RichTextEditorStatus` | - | Validation status object `{ type: 'warning' \| 'error' \| 'success', message?: string }`. Sets the border color and renders an alert message below. |
| `statusVariant` | `'attached' \| 'detached' \| 'tooltip'` | `'attached'` | Placement of the status alert message. |
| `width` | `number \| string` | - | Total width of the form field. Numbers are treated as pixels (px); strings are passed as CSS lengths. |
| `minHeight` | `number \| string` | `'4.5rem'` | Minimum height of the editable surface. Numbers are treated as pixels; strings are passed as CSS lengths. |
| `labelTooltip` | `string` | - | Tooltip text shown when hovering the info icon next to the label. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant. Controls the inner padding of the editing box. |
| `nodes` | `ReadonlyArray<Klass<LexicalNode>>` | - | Extra Lexical node classes to register beyond the defaults (headings, quote, lists, link, code block, table). |
| `extensions` | `ReadonlyArray<AnyLexicalExtensionArgument>` | - | Extra Lexical extension arguments. |
| `markdownExtensions` | `ReadonlyArray<RichTextMarkdownExtension>` | - | Markdown extension plugins created by `createRichTextExtension`. |
| `hasMarkdownShortcuts` | `boolean` | `true` | Enables Markdown shortcuts such as typing `# ` for headings or `- ` for bullet lists. |
| `transformers` | `ReadonlyArray<Transformer>` | Default transformers | Custom Markdown transformer rules. Defaults to standard transformers plus GFM tables. |
| `hasAutoFocus` | `boolean` | `false` | Moves focus into the editing surface as soon as the component mounts. |
| `tabEscapeHint` | `string` | Default copy | Instruction announced to screen readers on how to exit the editor. Because Tab indents text inside the editor, exiting requires pressing Escape then Tab. Pass an empty string to silence this hint. |
| `maxLength` | `number` | - | Plain-text character limit. Displays a counter in the bottom-right corner. Text is not truncated when exceeding the limit, but the counter turns red. |
| `namespace` | `string` | `'astryx-editor'` | Namespace for the underlying Lexical instance. Distinguishes multiple editors on the same page. |

### Slots

- `#toolbar`: Full-width slot positioned directly above the editing surface. Typically holds `<RichTextEditorToolbar />`.
- `#default`: Slot inside the editing surface. Used for headless plugin components (such as an auto-link plugin or custom tools that call `useLexicalEditor()`).

### Events

- `@change`: Fires when the user edits the document. Receives two arguments:
  - `editorState: EditorState`: Current state object. Call `editorState.toJSON()` to serialize it for storage.
  - `editor: LexicalEditor`: Underlying Lexical editor instance.

### Methods on the template ref

Bind a `ref` to `<RichTextEditor>` to call these instance methods:

```ts
const editorRef = ref<RichTextEditorExposed>()

// Focus the editing surface
editorRef.value?.focus()

// Clear all content and reset to a single empty paragraph
editorRef.value?.clear()

// Read the current EditorState object
const state = editorRef.value?.getEditorState()

// Export current content as a Markdown string (preserves untouched blocks)
const markdown = editorRef.value?.getMarkdown()

// Export current content as an HTML string (requires a browser DOM environment)
const html = editorRef.value?.getHTML()

// Access the underlying LexicalEditor instance for advanced customization
const rawEditor = editorRef.value?.getEditor()
```

This example shows how to listen to `@change` and call `clear()` and `getMarkdown()`:

<DemoExample
  :demo="richtextState"
  description="Listens to change events, counts state revisions, displays exported Markdown, and provides a clear button."
  locale="en"
  title="State listening and export"
/>

## Read-only and disabled

The editor provides two non-editable states: `isReadOnly` and `isDisabled`. They serve distinct interactive and accessibility needs:

1. **Read-only (`isReadOnly`)**:
   - Text color remains at full contrast.
   - Remains in the keyboard Tab order. Screen readers announce the field as read-only.
   - Users can select and copy text.
2. **Disabled (`isDisabled`)**:
   - The entire input and its text appear dimmed.
   - Completely removed from the Tab order; Tab skips past it.
   - Screen readers announce the field as disabled.
   - If both `isReadOnly` and `isDisabled` are passed to the same component, **disabled wins**.

```vue
<!-- Read-only: easy to inspect and copy, stays focusable and accessible -->
<RichTextEditor label="Release notes" :default-value="savedContent" is-read-only />

<!-- Disabled: dimmed and removed from the Tab order -->
<RichTextEditor label="Release notes" :default-value="savedContent" is-disabled />
```

<DemoExample
  :demo="richtextReadOnly"
  description="A form field configured with is-read-only. Non-editable, but selectable and keyboard-focusable."
  locale="en"
  title="Read-only field"
/>

Notice the distinction between a read-only form field and a display view:
- **`<RichTextEditor is-read-only>`**: Built for **forms**. It keeps its field label, helper description, and border frame. Semantically it remains a form control.
- **`<RichTextView>`**: Built for **article bodies** (such as blog posts or detail views). It strips all form semantics, borders, and labels, rendering pure document content.

Here is how the `status` prop and `maxLength` look in practice:

<DemoExample
  :demo="richtextStatus"
  description="Editor with an error status border, an alert message, and a character counter."
  locale="en"
  title="Validation status and character limit"
/>

## Toolbar

`<RichTextEditorToolbar>` is the companion format bar for the editor. Place it in the `#toolbar` slot of `<RichTextEditor>` to dock it flush to the top of the editing area.

```vue
<script setup lang="ts">
import { RichTextEditor, RichTextEditorToolbar } from '@astryx-vue/richtext'
</script>

<template>
  <RichTextEditor label="Weekly report">
    <template #toolbar>
      <RichTextEditorToolbar />
    </template>
  </RichTextEditor>
</template>
```

<DemoExample
  :demo="richtextToolbar"
  description="Format bar placed in the toolbar slot, offering undo, redo, heading toggles, text styling, and links."
  locale="en"
  title="With format toolbar"
/>

### Actions and keyboard shortcuts

The toolbar includes common typographic controls:
- **History**: Undo and Redo.
- **Block formats**: Paragraph, Heading 1 (H1), Heading 2 (H2), Heading 3 (H3), Quote, Bullet List, and Numbered List.
- **Inline styles**: Bold, Italic, Underline, Strikethrough, and Inline Code.
- **Insert and edit links**: Click the link icon on the toolbar, or select text and press <kbd>Cmd</kbd> + <kbd>K</kbd> (<kbd>Ctrl</kbd> + <kbd>K</kbd> on Windows) to open the built-in popover.
  - Type a destination URL in the popover and press Enter to save. The text selection stays intact while the popover is open.
  - Every URL is sanitized through the built-in `sanitizeUrl` function. Only `http:`, `https:`, `mailto:`, and `tel:` protocols are allowed; scripts like `javascript:` are blocked.

### `<RichTextEditorToolbar>` props and slots

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | Localized string | Accessible name for the entire toolbar (defaults to "Text formatting"). |
| `headingLevels` | `ReadonlyArray<'h1' \| 'h2' \| 'h3'>` | `['h1', 'h2', 'h3']` | Which heading levels to display in the block format dropdown, in the given order. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` | Size variant. Scales all buttons and dropdown menus inside the toolbar. |
| `hasLink` | `boolean` | `true` | Shows the link button and enables the <kbd>Cmd/Ctrl</kbd> + <kbd>K</kbd> shortcut. |
| `hasNewTabLinks` | `boolean` | `true` | Opens inserted links in a new tab by default (attaches `target="_blank"` and `rel="noopener noreferrer"`). |
| `promptForUrl` | `(selectedText: string) => string \| null \| undefined` | - | Custom URL prompt callback. Use this to provide your own dialog instead of the built-in popover. |

Slots:
- `#end`: Custom slot rendered after all default buttons, separated by a vertical divider. Useful for project-specific buttons such as @mentions, AI helpers, or an emoji picker.

### Custom icons

The toolbar ships with built-in SVG icons. To use icons from your own icon library (such as Lucide or Carbon), override them through the global theme helper `defineTheme`. Every icon key uses the `richtext:` prefix:

```ts
import { defineTheme } from '@astryx-vue/core'

defineTheme({
  icons: {
    'richtext:bold': 'lucide:bold',
    'richtext:italic': 'lucide:italic',
    'richtext:link': 'lucide:link',
    // See the list below for all replaceable keys
  },
})
```

`RICHTEXT_ICON_KEYS` exports all replaceable icon keys:
- `bold` -> `'richtext:bold'`
- `italic` -> `'richtext:italic'`
- `underline` -> `'richtext:underline'`
- `strikethrough` -> `'richtext:strikethrough'`
- `code` -> `'richtext:code'`
- `link` -> `'richtext:link'`
- `paragraph` -> `'richtext:paragraph'`
- `h1`, `h2`, `h3` -> `'richtext:h1'`, `'richtext:h2'`, `'richtext:h3'`
- `quote` -> `'richtext:quote'`
- `bullet` -> `'richtext:bullet'`
- `number` -> `'richtext:number'`
- `undo` -> `'richtext:undo'`
- `redo` -> `'richtext:redo'`

## Plugins

Plugins extend the editor with new behaviors, such as task checkboxes, code syntax highlighting, or turning typed URLs into links automatically.

### Default plugins

When you mount `<RichTextEditor>`, it includes these capabilities out of the box with no extra configuration:
- **Task checkboxes**: Supports `- [ ]` and `- [x]` checklist syntax. Checkboxes can be toggled by clicking them and lock automatically when the editor is read-only.
- **Code block header and copy button (CodeBlockHeaderPlugin)**: Displays the language name (such as `TypeScript` or `Python`) above code blocks, along with a one-click copy button.
- **Code syntax highlighting (CodeSyntaxPlugin)**: Colors keywords, strings, numbers, and comments inside code blocks using the same theme variables as `CodeBlock`.
- **Table width sizing and scrolling (Table Plugins)**: Enforces minimum column widths and adds accessible horizontal scrolling when tables overflow their container.

### Auto-link plugin: `RichTextEditorAutoLinkPlugin`

Turning typed or pasted URLs into clickable links is a frequent requirement. To keep the core package light, this feature is a headless Vue component plugin. Place it directly inside the default slot of `<RichTextEditor>`:

```vue
<script setup lang="ts">
import { RichTextEditor, RichTextEditorAutoLinkPlugin, RichTextEditorToolbar } from '@astryx-vue/richtext'
</script>

<template>
  <RichTextEditor label="Notes" placeholder="Try pasting a link here...">
    <template #toolbar>
      <RichTextEditorToolbar />
    </template>
    <!-- Add the auto-link plugin -->
    <RichTextEditorAutoLinkPlugin />
  </RichTextEditor>
</template>
```

<DemoExample
  :demo="richtextAutoLink"
  description="Turns http links or email addresses into clickable links automatically via RichTextEditorAutoLinkPlugin."
  locale="en"
  title="Automatic links"
/>

The plugin provides two default matchers (`DEFAULT_LINK_MATCHERS`): one for web URLs and one for email addresses. URLs without a protocol prefix receive `https://`, emails receive `mailto:`, and all generated links attach `target="_blank"` and `rel="noopener noreferrer"` to open safely in a new tab.

To recognize custom patterns (such as turning `#123` into an issue tracker link), pass custom rules to the `matchers` prop:

```vue
<RichTextEditorAutoLinkPlugin :matchers="myCustomMatchers" @change="(url, prevUrl) => onLinkChange(url, prevUrl)" />
```

The plugin emits a `change` event whenever a link is added, modified, or removed, passing the new URL (`null` on removal) and the previous URL. Build `myCustomMatchers` with `createLinkMatcherWithRegExp` from `@lexical/link`.

## Markdown in and out

Most workflows edit rich text in the browser but store plain Markdown on the server. `@astryx-vue/richtext` provides a lossless round-trip conversion pipeline.

### Pure conversion functions

Import two conversion functions from `@astryx-vue/richtext/markdown`. This entry point has no browser DOM dependency and runs safely in server-side environments such as Node.js or Cloudflare Workers:

```ts
import { editorStateJSONToMarkdown, markdownToEditorStateJSON } from '@astryx-vue/richtext/markdown'

// 1. On the server or during initialization: convert Markdown text to JSON for defaultValue
const defaultValue = markdownToEditorStateJSON('# Welcome\n\nThis is **Markdown** text.')

// 2. When saving or submitting: restore the JSON string back to Markdown text
const markdown = editorStateJSONToMarkdown(savedJson)
```

### Source preservation on round trips

Standard rich text converters often scramble formatting during a Markdown -> editor -> Markdown cycle, dropping indentations or turning every `*` into a `-`.

Astryx Rich Text uses a source-preservation mechanism: imported Markdown blocks keep their original punctuation, spacing, and indents intact on export as long as the user did not edit that block. Only modified or newly added blocks are reformatted with standard syntax.

## Markdown plugin nodes

Projects sometimes need custom Markdown syntax, such as `@username` mentions or custom alert callout blocks.

Use `createRichTextExtension` to register a custom Markdown plugin:

```ts
import { createRichTextExtension } from '@astryx-vue/richtext'
import { mentionPlugin } from './myMentionPlugin'

// Wrap into an extension recognized by the editor
const mentionsExtension = createRichTextExtension(mentionPlugin)
```

Pass the extension to `<RichTextEditor>` or `<RichTextView>` via the `markdownExtensions` prop:

```vue
<RichTextEditor
  label="Discussion"
  :markdown-extensions="[mentionsExtension]"
/>
```

You can also pass it to the conversion functions:

```ts
const json = markdownToEditorStateJSON(markdownText, {
  extensions: [mentionsExtension],
})
```

::: warning Extension conflict check
To keep data reliable, registering the same extension twice or registering two extensions with conflicting syntax rules throws a `RichTextExtensionError` immediately.
:::

## Read-only view: RichTextView

When you need to display an article, a blog post, or a release announcement without any editing capabilities, use the `<RichTextView>` component.

```vue
<script setup lang="ts">
import { RichTextView } from '@astryx-vue/richtext'

// The value is the JSON string saved earlier from editorState.toJSON()
const content = '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Display content","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'
</script>

<template>
  <RichTextView :value="content" />
</template>
```

<DemoExample
  :demo="richtextView"
  description="RichTextView renders persisted rich text content without form borders or text cursors."
  locale="en"
  title="Read-only display view"
/>

### Design role and accessibility

- **Document content, not a form control**: Even when set to non-editable, Lexical defaults to `role="textbox"` on its root element. Tagging a multi-page article as a text input causes screen readers to misidentify it and triggers accessibility audit warnings. `<RichTextView>` strips all form input semantics upon mount and renders as a clean document container.
- **In-place updates**: When the parent updates the `value` prop, `<RichTextView>` re-parses the content in place without tearing down and recreating the DOM tree.
- **Resilient error handling**: If saved JSON cannot be parsed due to a version migration or corrupted data, the component will not crash the entire page. It emits a `@parseError` event and supports a fallback display through the `#errorFallback` slot:

```vue
<RichTextView :value="maybeCorruptedContent" @parse-error="onParseError">
  <template #errorFallback>
    <div class="error-box">Unable to display document content.</div>
  </template>
</RichTextView>
```

## Keyboard

The editor is optimized for full keyboard workflows:

- **Tab indentation and escape**:
  - Pressing <kbd>Tab</kbd> in a paragraph or list item increases its indentation level; pressing <kbd>Shift</kbd> + <kbd>Tab</kbd> decreases it.
  - Because <kbd>Tab</kbd> is used for typography, keyboard-only and screen reader users need a reliable way to exit the editor. Following accessibility standards, **press <kbd>Escape</kbd> once, then press <kbd>Tab</kbd>** to move focus to the next interactive element on the page.
  - The editor announces this escape sequence to screen readers by default. You can change this copy with the `tabEscapeHint` prop, or silence it by passing `tabEscapeHint=""`.
- **Navigating tables**:
  - While editing inside a table cell, pressing arrow keys (<kbd>↑</kbd>, <kbd>↓</kbd>, <kbd>←</kbd>, <kbd>→</kbd>) moves the cursor smoothly between adjacent cells.
- **Keyboard shortcuts**:
  - <kbd>Cmd</kbd> + <kbd>K</kbd> (macOS) or <kbd>Ctrl</kbd> + <kbd>K</kbd> (Windows): Opens the link editing popover.
  - <kbd>Cmd/Ctrl</kbd> + <kbd>B</kbd>: Bold.
  - <kbd>Cmd/Ctrl</kbd> + <kbd>I</kbd>: Italic.
  - <kbd>Cmd/Ctrl</kbd> + <kbd>Z</kbd>: Undo; <kbd>Cmd/Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd>: Redo.
  - Underline has no default shortcut; use the toolbar button.

## Accessibility

Astryx Rich Text includes extensive accessibility (a11y) considerations:

1. **Explicit label association**: The required `label` prop creates an accessible name for the editor. Even when `isLabelHidden` is true, the label is preserved for screen readers via `aria-label`.
2. **Read-only vs. disabled semantics**: `isReadOnly` applies `aria-readonly="true"` and keeps `tabindex="0"`, announcing the field as read-only text; `isDisabled` applies `aria-disabled="true"` and removes the field from the Tab sequence entirely.
3. **Character count feedback**: When `maxLength` is set, an off-screen `aria-live="polite"` region alerts screen reader users when character count nears the threshold (over 80%) or exceeds it. Error states set `aria-invalid="true"` automatically.
4. **Preserved focus and selection**: Opening toolbar dialogs (such as the link popover) preserves the active text selection in the editor. Focus returns smoothly to the text area when the popover closes.

## Not supported yet

To keep the Vue implementation clean and maintainable, this package intentionally differs from the upstream React implementation in two areas:

1. **No `xstyle` styling system**: The upstream React package uses an internal `xstyle` object system, which is omitted in the Vue port. Use standard Vue `class` and `style` attributes to customize appearance.
2. **Plugins use Vue component slots**: Upstream passes plugins as an array of React nodes; in `@astryx-vue/richtext`, plugins are headless, logic-only Vue components (such as `<RichTextEditorAutoLinkPlugin />`) placed directly in the default slot of `<RichTextEditor>`.
