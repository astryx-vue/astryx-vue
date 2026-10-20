---
layout: component-docs
title: Grid Span
outline: false
footer: false
---

<script setup lang="ts">
import { gridSpanColumns } from '../../../../components/demos/grid-span'
</script>

## Usage

Grid item that spans multiple columns or rows.

```ts
import { GridSpan } from '@astryx-vue/core/Grid'
```

`GridSpan` wraps one child of a `Grid` and changes how many tracks that child takes. `columns` is a number of columns, or `full` to span the whole row; `rows` is a number of rows. Everything else about the grid — the column count, the gaps, the alignment — stays on `Grid`.

`full` renders `grid-column: 1 / -1`, so it spans the row whatever the column count is. A row span needs a height to work with: give `Grid` a `rowHeight`, or the row grows to fit the tallest item that crosses it.

```vue
<script setup lang="ts">
import { Grid, GridSpan } from '@astryx-vue/core/Grid'
</script>

<template>
  <Grid :columns="3" :gap="3">
    <GridSpan :columns="2">
      Spans two columns
    </GridSpan>
    <div>Regular item</div>
    <GridSpan columns="full">
      Spans the full row
    </GridSpan>
  </Grid>
</template>
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="gridSpanColumns" title="Columns" description="Grid items spanning two of three columns. Wrap a grid child in GridSpan to make it occupy multiple columns for asymmetric layouts." locale="en" />
