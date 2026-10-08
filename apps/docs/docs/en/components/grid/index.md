---
layout: component-docs
title: Grid
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { gridAlignment, gridBasic, gridColumns, gridSpan } from '../../../../components/demos/grid'
</script>

## Usage

`Grid` arranges its children into rows and columns with CSS grid. It solves two-dimensional layout: card galleries, dashboard panels, and any region where several columns have to line up. One-dimensional arrangement belongs to the `Stack` family; reach for `Grid` when rows and columns both matter.

Give it a column configuration and it is ready:

```vue
<script setup lang="ts">
import { Grid } from '@astryx-vue/core/Grid'
</script>

<template>
  <Grid :columns="3" :gap="4">
    <div>First</div>
    <div>Second</div>
    <div>Third</div>
  </Grid>
</template>
```

A number for `columns` means a fixed number of equal-width columns. An object means responsive columns: `minWidth` is the smallest a column may get, in pixels, and the grid decides how many columns fit in the available width on its own, dropping to fewer columns on a narrow screen.

```vue
<template>
  <Grid :columns="{ minWidth: 280 }" :gap="4">
    <div>First</div>
    <div>Second</div>
  </Grid>
</template>
```

The responsive configuration has two more options. `repeat` decides what happens to the gap a partly filled last row leaves behind: `'fill'` (the default) keeps the empty tracks, so every column always has the same width, while `'fit'` collapses them so the columns that are present stretch across the whole row. `max` caps how many columns may appear, which keeps columns from growing uncomfortably wide on a large screen. The cap sits on the minimum track size rather than the maximum, so the count never exceeds `max` while the columns that are present still fill the row — no dead space on the right.

`gap` sets the spacing between rows and columns, with `rowGap` and `columnGap` overriding it on a single axis, and all three take a step from the Astryx spacing scale. `rowHeight` fixes the height of implicit rows in pixels and, together with `GridSpan rows`, produces items that span several rows.

Wrap an item in `GridSpan` when it has to span more than one column or row. Its `columns` takes a number for the number of columns, or `'full'` to span the entire row, and `rows` takes the number of rows.

```vue
<template>
  <Grid :columns="4" :gap="3">
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

`width`, `height`, `maxWidth`, and `minHeight` size the container itself: numbers are pixels and strings are used as they are. `align` controls how items sit vertically inside their row (`align-items`) and `justify` controls the horizontal axis (`justify-items`); both default to `stretch`, which makes every item fill its cell.

The column template is written to the container as the CSS variable `--astryx-grid-template-columns` rather than as an inline `grid-template-columns` declaration. That way your own stylesheet, including a rule inside a media query, can still override the variable or the declaration itself.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use responsive columns (`:columns="{ minWidth: 280 }"`) whenever the layout should adapt to the screen. Let the grid work out the column count instead of writing media queries. |
| <Badge variant="success">Do</Badge> | Cap the count with `max` on wide screens. Without a cap each column grows very wide and the contents of a row drift far apart. |
| <Badge variant="success">Do</Badge> | Keep the default `repeat: 'fill'` when every column should have the same width, and switch to `'fit'` when the items of a partly filled row should stretch into the leftover space. |
| <Badge variant="success">Do</Badge> | Leave spacing to `gap` and the container size to `width`, `maxWidth`, and friends rather than adding margins to the children. |
| <Badge variant="error">Don't</Badge> | Hand-write `display: grid` and `grid-template-columns` and compute the gaps yourself. `Grid` already does that work. |
| <Badge variant="error">Don't</Badge> | Fake a grid with a wrapping `HStack`. Use `Stack` for one-dimensional arrangement and `Grid` when both axes have to line up. |
| <Badge variant="error">Don't</Badge> | Express a fixed column count through the object form of `columns`. Pass a number, which says what it means. |

## Examples

<DemoExample
  :demo="gridBasic"
  description="Responsive columns: the grid decides how many columns fit and reflows on a narrow screen. Give the smallest a column may be and let it do the rest."
  locale="en"
  title="Responsive columns"
/>

<DemoExample
  :demo="gridColumns"
  description="Fixed column counts come from a number and produce equal-width columns. Override gap per axis with rowGap and columnGap when the two differ."
  locale="en"
  title="Fixed columns"
/>

<DemoExample
  :demo="gridSpan"
  description="GridSpan makes one item span several columns. Give columns a number for the count, or 'full' to span the whole row."
  locale="en"
  title="Spanning columns and rows"
/>

<DemoExample
  :demo="gridAlignment"
  description="align positions items vertically inside their row and justify positions them horizontally. Both default to stretch, which fills the cell."
  locale="en"
  title="Alignment"
/>
