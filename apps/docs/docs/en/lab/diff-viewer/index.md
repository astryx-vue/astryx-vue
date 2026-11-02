---
layout: lab-docs
title: DiffViewer
---

# DiffViewer

A read-only code diff: one file's path, change counts, and hunks in unified or split view, with inline highlighting.

<script setup lang="ts">
import { labDiffViewer } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labDiffViewer" description="Build a file diff from two texts with createDiffFile, then show it in unified and split view." locale="en" title="Basic usage" /></ClientOnly>

## Import

```ts
import { createDiffFile, DiffViewer, parseUnifiedDiff } from '@astryx-vue/lab'
```

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `file` | `DiffViewerFile` | Required | The file to render. Build it with `parseUnifiedDiff` or `createDiffFile`. |
| `viewMode` | `'unified' \| 'split'` | `'unified'` | One column, or old and new side by side. |
| `language` | `string` | Inferred from the extension | Syntax-highlighting language; unknown extensions render as plain text. |
| `hasLineNumbers` | `boolean` | `true` | Shows the old and new line-number gutters. |
| `isWrapped` | `boolean` | `false` | Wraps long lines instead of scrolling sideways. |
| `inlineHighlight` | `'word' \| 'char' \| 'none'` | `'word'` | Highlights changed words (or characters) inside paired removed/added lines. |
| `isCollapsible` | `boolean` | `true` | Makes the file header a disclosure; needs a file path to name it. |
| `isCollapsed` | `boolean` | Uncontrolled | Controlled collapsed state. |
| `defaultIsCollapsed` | `boolean` | `false` | Initial collapsed state when uncontrolled. |
| `maxHeight` | `number \| string` | `undefined` | Maximum height of the hunk area before it scrolls. |
| `syntaxTheme` | `SyntaxThemeDefinition` | `undefined` | Per-instance syntax theme. |
| `label` | `string` | `'Diff'` | Accessible name for the hunk area when the file has no path. |
| `renderLineAnnotation` | `(ref) => VNodeChild` | `undefined` | Renders a full-width row under a line, e.g. a review comment; in split view it sits on the line's own side. |

## Events

| Name | Payload | Description |
| --- | --- | --- |
| `collapsedChange` | `(isCollapsed: boolean)` | The header disclosure was toggled. |
| `update:isCollapsed` | `(isCollapsed: boolean)` | Supports `v-model:isCollapsed`. |
| `lineNumberClick` | `(ref: DiffViewerLineRef, event: MouseEvent)` | A line number was clicked. Only the line's anchor side is a button. |

## Slots

| Name | Description |
| --- | --- |
| `headerEnd` | Content at the end of the file header, e.g. a "Viewed" checkbox. |

## Utilities

```ts
const files = parseUnifiedDiff(patch) // one record per file
const file = createDiffFile({
  path: 'src/app.ts',
  oldValue: before,
  newValue: after,
  contextLines: 3,
})
```

`parseUnifiedDiff` accepts `git diff`, `diff -u`, and bare hunks; unreadable input yields an empty array instead of throwing. `createDiffFile` computes a Myers line diff from two texts and returns the same `DiffViewerFile` shape. `contextLines` defaults to 3; pass `oldPath: null` or `newPath: null` to mark a file added or deleted.
