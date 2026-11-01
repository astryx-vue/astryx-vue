---
layout: component-docs
title: Chart
outline: false
footer: false
---

## `<Chart>` props and slots

`<Chart>` is the root container. It measures container dimensions, builds coordinate scales, calculates geometry positions, and renders the SVG tree.

### Props

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `data` | `Record<string, unknown>[]` | **Required** | Rows of data to render. Each row contains an x-axis field and one or more series fields. |
| `xKey` | `string` | **Required** | Field name used as the x value across all series. |
| `series` | `SeriesDef[]` | **Required** | Array of series definitions, rendered in order on a shared coordinate system. |
| `height` | `number` | `300` | Chart height in CSS pixels. Non-finite values and negative numbers are treated as 0. |
| `width` | `number` | `0` | Chart width in CSS pixels. Ignored after the browser first measures the container. Used during server-side rendering when no DOM container exists. |
| `margin` | `Partial<ChartMargin>` | `{ top: 24, right: 24, bottom: 32, left: 48 }` | Partial margin overrides for the plotting area. Omitted sides use defaults. |
| `yBaseline` | `'auto' \| 'zero' \| 'data'` | `'auto'` | How to determine the y-axis domain when `yDomain` is not set. |
| `yDomain` | `[number, number]` | `undefined` | Explicit y-axis range `[min, max]`. When set, this range is used directly without baseline adjustments or edge padding. |
| `xDomain` | `[number, number]` | `undefined` | Explicit range `[min, max]` for numeric x-axes. Stays active even when `data` is empty, keeping streaming windows stable. Ignored on categorical band axes. |
| `legend` | `boolean \| ChartLegendConfig` | `false` | Whether to show the legend derived from series, or a configuration object to adjust position and alignment. |
| `tooltip` | `boolean \| ChartTooltipConfig` | `false` | Whether to show grouped hover tooltips. |
| `title` | `string` | `undefined` | Chart title, used as the SVG accessible name. |
| `subtitle` | `string` | `undefined` | Supporting text below the title, used as the SVG accessible description. |

### Slots

| Name | Bindings | Description |
| :--- | :--- | :--- |
| `grid` | None | Background grid rendered behind series, usually containing `<ChartGrid />`. |
| `axes` | None | Axes rendered behind series, usually containing one or more `<ChartAxis />` components. |
| `interactions` | None | Custom interaction layer rendered above the pointer capture surface. |
| `tooltip` | `{ xValue: unknown, rows: unknown[] }` | Custom tooltip slot. `xValue` is the active x value under the pointer. `rows` is the list of series data items for that row. |
| `default` | None | Extra content rendered after the built-in tooltip layer. |
