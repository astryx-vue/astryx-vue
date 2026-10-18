---
layout: component-docs
title: useTableRowIndex
outline: false
footer: false
---

<script setup lang="ts">
import { useTableRowIndexNumberedRows } from '../../../../components/demos/use-table-row-index'
</script>

## Usage

Hook that returns a TablePlugin which prepends a right-aligned, monospaced row-number column. Numbering follows the rendered data order (reflecting the current sort / filter / pagination view) and starts at 1 by default. Astryx `renderCell` receives only the row item, so the plugin takes the rendered data array to derive each ordinal.

```ts
import { useTableRowIndex } from '@astryx-vue/core/Table'
```

## Examples

<DemoExample
  :demo="useTableRowIndexNumberedRows"
  description="A table with a prepended row-number column. Numbering is monospaced, right-aligned, and follows the rendered data order."
  locale="en"
  title="useTableRowIndex — Numbered Rows"
/>
