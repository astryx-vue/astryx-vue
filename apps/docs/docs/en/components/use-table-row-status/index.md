---
layout: component-docs
title: useTableRowStatus
outline: false
footer: false
---

<script setup lang="ts">
import { useTableRowStatusMarkers } from '../../../../components/demos/use-table-row-status'
</script>

## Usage

Hook that returns a TablePlugin which prepends a narrow column signaling per-row status. Return `{status, label}` for a semantic success, warning, or error: Table resolves the matching glyph and tone through the active theme. Return `{color, icon?, label}` for a custom marker: every color is paint-only, an omitted icon renders the stable 8px dot, and an explicit icon renders that caller-selected glyph. Named custom icons keep their released Icon color mapping; raw CSS custom icons inherit the caller's exact paint instead of the previous primary fallback. `label` is required and becomes the accessible image name plus supplemental hover tooltip; return `null` for no indicator. The column header is visually blank but carries a screen-reader-only localized name ("Row status", i18n key `@astryx.table.rowStatus.columnHeader`). Put `getStatus` inside a getter when it reads reactive state; the plugin calls it on every render.

```ts
import { useTableRowStatus } from '@astryx-vue/core/Table'
```

## Examples

<DemoExample
  :demo="useTableRowStatusMarkers"
  description="The mark at the start of a row is a themed semantic glyph for success, warning, or error, or a custom color dot. The label is the accessible name and the hover tooltip."
  locale="en"
  title="useTableRowStatus — Row Status"
/>
