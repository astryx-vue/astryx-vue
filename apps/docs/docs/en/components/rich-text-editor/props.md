---
layout: component-docs
title: Rich Text Editor
outline: false
footer: false
---

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
