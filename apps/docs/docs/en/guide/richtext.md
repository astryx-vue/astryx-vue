---
title: Rich text
---

<script setup lang="ts">
import { richtextAutoLink, richtextToolbar, richtextView } from '../../../components/richtext-demos'
</script>

# Rich text

::: warning
`lexical` and `@lexical/*` are optional peer dependencies. Install them yourself, pinned to `0.52.0`.
:::

## Usage

`@astryx-vue/richtext` is a WYSIWYG rich text editor based on Lexical.

Install dependencies and import styles:

```bash
pnpm add @astryx-vue/richtext \
  lexical@0.52.0 @lexical/code@0.52.0 @lexical/extension@0.52.0 @lexical/headless@0.52.0 \
  @lexical/history@0.52.0 @lexical/html@0.52.0 @lexical/link@0.52.0 @lexical/list@0.52.0 \
  @lexical/markdown@0.52.0 @lexical/rich-text@0.52.0 @lexical/selection@0.52.0 \
  @lexical/table@0.52.0 @lexical/utils@0.52.0
```

```ts
import '@astryx-vue/richtext/richtext.css'
```

Minimal usage (`label` is required):

```vue
<RichTextEditor label="Publish content" placeholder="Write something..." />
```

<DemoExample :demo="richtextToolbar" description="Rich text editor with a top formatting toolbar." locale="en" title="Full editor" />

## Best practices

- **Lexical types**: `nodes` and `transformers` accept Lexical types, and `@change` provides a Lexical `EditorState`. Install Lexical where you use them.
- **State persistence**: Listen to `@change` to get `editorState.toJSON()` and store it in your backend. Read it back via `defaultValue` or `<RichTextView :value="...">`.
- **Custom nodes**: Register custom nodes through `nodes` on both `<RichTextEditor>` and `<RichTextView>` to preserve round-trip consistency.
- **Template ref methods**: Call `focus()`, `clear()`, `getEditorState()`, `getMarkdown()`, `getHTML()`, and `getEditor()` via template ref. When read-only or disabled, `focus` and `clear` are no-ops. `getMarkdown()` preserves untouched blocks as-is and normalizes only edited blocks.
- **GFM tables**: Import, edit, and export work by default. Wide tables scroll horizontally within their container. Requires `@lexical/table`. <kbd>Tab</kbd> indents text inside the editor; to leave the editor, press <kbd>Escape</kbd> then <kbd>Tab</kbd>.
- **Horizontal rules**: `---`, `***`, and `___` import as horizontal rules and export as `---`. Click to select, press Backspace to delete. Requires `@lexical/extension`.
- **Server-side conversion**: Import `markdownToEditorStateJSON` and `editorStateJSONToMarkdown` from `@astryx-vue/richtext/markdown`. They have no DOM dependencies and preserve lossless Markdown round-tripping.
- **Markdown extensions**: Create extensions with `createRichTextExtension(plugin)` and pass them to `markdownExtensions` on the client. Plugin syntax renders, edits, and exports as atomic nodes. Registering duplicates throws a `RichTextExtensionError`.
- **Toolbar**: Pass `<RichTextEditorToolbar />` into the `#toolbar` slot. It stretches edge-to-edge across the editor and includes undo, redo, block formats, inline styles, and link buttons. It scrolls horizontally when space is tight. Use the `#end` slot to append extra controls.
- **Links and shortcuts**: The toolbar link button and <kbd>Cmd/Ctrl</kbd> + <kbd>K</kbd> open a dialog. Unsafe protocols are filtered automatically. Links open in a new tab by default (controlled by `hasNewTabLinks`); `promptForUrl` is also supported.
- **Auto-links**: Place `<RichTextEditorAutoLinkPlugin>` inside the default slot. Typed URLs and emails turn into links automatically. Custom rules can be provided through `matchers`.
- **Custom icons**: Toolbar icons use `richtext:*` keys (such as `richtext:bold`). You can override them in your theme configuration without rewriting the toolbar.
- **Read-only display vs. field**: Use `<RichTextView>` to render persisted content for reading. It outputs semantic document content rather than a form input. Use TextInput or TextArea for single-line or plain-text input.

<DemoExample :demo="richtextAutoLink" description="Automatically turns typed URLs into links." locale="en" title="Auto link" />
<DemoExample :demo="richtextView" description="Read-only rendering of saved rich text state." locale="en" title="Read-only view" />

## `<RichTextEditor>` props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | Required | Editor label text for accessibility and screen readers. |
| `isLabelHidden` | `boolean` | `false` | Visually hides the label while keeping it accessible to screen readers. |
| `description` | `string` | - | Helper text displayed between the label and the editing area. |
| `isOptional` | `boolean` | `false` | Marks the field as optional (mutually exclusive with `isRequired`). |
| `isRequired` | `boolean` | `false` | Marks the field as required (mutually exclusive with `isOptional`). |
| `defaultValue` | `string` | - | Initial content JSON string, read only once on mount. |
| `placeholder` | `string` | - | Placeholder text shown when content is empty. |
| `isReadOnly` | `boolean` | `false` | Whether the editor is read-only. Non-editable, text stays clear, and still focusable via Tab. |
| `isDisabled` | `boolean` | `false` | Whether the editor is disabled. Non-editable, colors fade, and removed from Tab order. Takes precedence when both `isReadOnly` and `isDisabled` are true. |
| `status` | `RichTextEditorStatus` | - | Validation status `{ type, message? }`. Sets border color and displays a message below. |
| `statusVariant` | `'attached' \| 'detached' \| 'tooltip'` | `'attached'` | Display placement of the status message. |
| `width` | `number \| string` | - | Field width. Numbers are in pixels; strings are CSS lengths. |
| `minHeight` | `number \| string` | `'4.5rem'` | Minimum height of the editing area. Expands automatically with content. |
| `labelTooltip` | `string` | - | Tooltip text for the info icon next to the label. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Editor size, affecting internal padding. |
| `nodes` | `ReadonlyArray<Klass<LexicalNode>>` | - | Additional Lexical node types to register. |
| `extensions` | `ReadonlyArray<AnyLexicalExtensionArgument>` | - | Additional Lexical extension plugin array. |
| `markdownExtensions` | `ReadonlyArray<RichTextMarkdownExtension>` | - | Markdown extension plugins to recognize. |
| `hasMarkdownShortcuts` | `boolean` | `true` | Whether to enable Markdown shortcuts (such as `# ` for headings). |
| `transformers` | `ReadonlyArray<Transformer>` | Default transformers | Custom Markdown transformation rules. |
| `hasAutoFocus` | `boolean` | `false` | Whether to automatically focus the editing area on mount. |
| `tabEscapeHint` | `string` | Localized text | Screen reader hint to press Escape then Tab to leave; pass `""` to hide. |
| `maxLength` | `number` | - | Character limit for plain text. Exceeding it shows an error style on the counter. |
| `namespace` | `string` | `'astryx-editor'` | Namespace for the underlying Lexical instance. |

- **Events**: `@change="(editorState, editor) => void"` fires when content changes, used for saving state.
- **Slots**: `#toolbar` top toolbar slot; `#default` internal plugin slot (such as placing `<RichTextEditorAutoLinkPlugin>`).
- **Template ref methods**: `focus()` focuses; `clear()` clears; `getEditorState()` gets state; `getMarkdown()` exports Markdown; `getHTML()` exports HTML; `getEditor()` gets underlying Lexical instance.

### `<RichTextEditorToolbar>` props and slots

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | Localized text | Accessible name for the toolbar. |
| `headingLevels` | `ReadonlyArray<'h1' \| 'h2' \| 'h3'>` | `['h1', 'h2', 'h3']` | Heading levels included in the block format dropdown. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` | Toolbar size. |
| `hasLink` | `boolean` | `true` | Whether to show the link button and enable Cmd/Ctrl+K shortcut. |
| `promptForUrl` | `(selectedText: string) => string \| null \| undefined` | - | Custom callback function to prompt for a URL. |
| `hasNewTabLinks` | `boolean` | `true` | Whether inserted links open in a new tab. |

- **Slots**: `#end` custom slot at the end, rendered to the right of default buttons.

### `<RichTextView>` props, events and slots

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `string` | Required | Editor state JSON string to render. |
| `nodes` | `ReadonlyArray<Klass<LexicalNode>>` | - | Additional Lexical nodes to register, matching those used when saving. |
| `markdownExtensions` | `ReadonlyArray<RichTextMarkdownExtension>` | - | Markdown extension plugins to recognize. |
| `namespace` | `string` | `'astryx-view'` | Namespace for the underlying Lexical instance. |

- **Events**: `@parseError="(error: Error) => void"` fires when parsing content fails.
- **Slots**: `#errorFallback` fallback content when parsing fails; `#default` internal extension slot.
