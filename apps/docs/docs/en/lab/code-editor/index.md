---
title: CodeEditor
---

# CodeEditor

CodeEditor is a lightweight code input with a controlled value, syntax highlighting, line numbers, placeholder text, and read-only state. It uses `contenteditable="plaintext-only"` and the CSS Custom Highlight API, not Monaco. It is a Lab component and ships only under the `canary` tag.

<script setup lang="ts">
import { labCodeEditor } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labCodeEditor" description="Edit TypeScript code with syntax highlighting and line numbers. Tab indents, Shift+Tab outdents, and Escape then Tab leaves the editor." locale="en" title="Basic usage" /></ClientOnly>

## Import

```ts
import { CodeEditor } from '@astryx-vue/lab'
```

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | Required | The controlled text. |
| `label` | `string` | Required | Accessible name of the editable region. |
| `language` | `string` | `'plaintext'` | Highlighting language. |
| `hasLineNumbers` | `boolean` | `false` | Shows the line-number gutter. |
| `isReadOnly` | `boolean` | `false` | Read-only; the text remains focusable and selectable. |
| `placeholder` | `string` | `undefined` | Placeholder shown when the value is empty. |
| `maxHeight` | `number \| string` | `undefined` | Maximum content height before scrolling. |
| `size` | `'sm' \| 'md'` | `'md'` | Code text size. |
| `tokenizer` | `(code, language) => TokenLine[]` | Core tokenizer | Custom syntax parser. |
| `escapeHint` | `string` | English hint | Tells assistive technology how to leave the Tab-indenting editor. |

## Events

`change` carries the latest text:

```vue
<CodeEditor :value="source" label="Source code" @change="source = $event" />
```

## Keyboard

- `Tab` inserts two spaces.
- `Shift+Tab` removes up to two leading spaces on the current line.
- `Enter` preserves the current indentation.
- Brackets and quotes auto-close, with the caret between the pair.
- Because Tab indents, press `Escape` once and then `Tab` or `Shift+Tab` to leave. This escape mode is one-shot. Typing again restores ordinary indentation.
- Assistive technology reads `escapeHint` through `aria-describedby`. Override it for localization.

Highlighting uses the CSS Custom Highlight API and does not insert syntax nodes into the editable text. Large text uses the core async tokenizer; old ranges are cleaned up on change and unmount.
