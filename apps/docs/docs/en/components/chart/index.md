---
layout: component-docs
title: Chart
outline: false
footer: false
---

<script setup lang="ts">
import {
  chartsBandReference,
  chartsBar,
  chartsCandlestick,
  chartsCustomTooltip,
  chartsDot,
  chartsErrorBar,
  chartsLine,
  chartsStackedArea,
} from '../../../../components/demos/chart'
</script>

## Overview

`@astryx-vue/charts` uses d3 to calculate scales and geometry, then renders SVG with Vue. Each chart contains a `<Chart>` canvas and one or more series, such as lines, bars, or areas.

## Install

```bash
pnpm add @astryx-vue/charts
```

`@astryx-vue/charts` depends on `@astryx-vue/core` and `vue`. Make sure both are installed in your project.

The library includes base styles. Import the full stylesheet in your entry file:

```ts
import '@astryx-vue/charts/charts.css'
```

To load styles on demand, import individual files from `@astryx-vue/charts/styles/`, such as `chart.css`, `chart-axis.css`, `chart-grid.css`, `chart-legend.css`, `chart-tooltip.css`, or `chart-swatch.css`.

## Your first chart

A minimal chart requires three props on `<Chart>`:
- `data`: An array of objects where each item represents one row of data.
- `xKey`: The field name in each row to use for the horizontal x-axis.
- `series`: An array of series definitions created with functions such as `line()` or `bar()`.

Here is the shortest working line chart:

```vue
<script setup lang="ts">
import { Chart, ChartAxis, ChartGrid, line } from '@astryx-vue/charts'

// 1. Prepare data
const data = [
  { month: 'Jan', revenue: 100, cost: 60 },
  { month: 'Feb', revenue: 150, cost: 80 },
  { month: 'Mar', revenue: 120, cost: 70 },
]

// 2. Define series: two lines reading revenue and cost
const series = [
  line('revenue', { label: 'Revenue' }),
  line('cost', { label: 'Cost' }),
]
</script>

<template>
  <Chart :data="data" x-key="month" :series="series" :height="260" legend tooltip>
    <template #grid>
      <ChartGrid />
    </template>
    <template #axes>
      <ChartAxis position="bottom" />
      <ChartAxis position="left" />
    </template>
  </Chart>
</template>
```

Here is the live result:

<DemoExample
  :demo="chartsLine"
  description="Line chart with revenue and cost series, grid lines, axes, a bottom legend, and hover tooltips."
  locale="en"
  title="Line chart"
/>

## Series

A series defines a visual representation of data on the chart. A series object holds internal state during layout and rendering. Because of this, provide each series object to one `<Chart>` only. Create fresh series definitions for each chart instance.

When data has missing values (`null`, `undefined`) or non-finite numbers (`NaN`, `Infinity`), line marks break cleanly and leave an empty gap. They never drop to zero or draw false connections across gaps.

When `yDomain` is omitted, `yBaseline` controls how the y-axis range is calculated:
- `'auto'` (default): Marks with a zero baseline (bars, areas) include 0 in the scale. Continuous point marks (lines, dots) keep small padding on both ends so points do not clip at the edges.
- `'zero'`': Expands the scale symmetrically around 0. Useful for values that swing positive and negative, such as profit and loss.
- `'data'`: Clamps tightly to the minimum and maximum data values without forcing 0 or adding edge padding.

### Line (`line`)

A line series shows continuous trends over time or across categories.

```ts
declare function line(dataKey: string, options?: LineOptions): SeriesDef
```

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `color` | `string` | Auto from theme palette | Line color. |
| `curve` | `'linear' \| 'monotone' \| 'natural' \| 'step'` | `'monotone'` | Curve interpolation method. Options are linear, monotone cubic spline, natural spline, and step. |
| `strokeWidth` | `number` | `2` | Line stroke width in pixels. |
| `dots` | `boolean` | `false` | Whether to render solid circular dots at each data point. |
| `label` | `string` | `dataKey` | Human-readable name shown in legends and tooltips. |

### Bar (`bar`)

A bar series compares magnitudes across categories or time steps. Bars with the same `group` split the category bandwidth and sit side by side. Bars with the same `stack` stack on top of each other.

```ts
declare function bar(dataKey: string, options?: BarOptions): SeriesDef
```

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `color` | `ColorAccessor` | Auto from theme palette | Bar fill color. Accepts a color string or a function `(datum, index) => string`. |
| `opacity` | `number` | `1` | Bar opacity, between 0 and 1. |
| `radius` | `number` | `4` | Corner radius on the bar top in pixels. In stacked bars, only the top segment receives rounded corners. |
| `stack` | `string` | `undefined` | Stack group name. Series sharing a `stack` accumulate upward from the baseline. |
| `group` | `string` | `undefined` | Side-by-side group name. Series sharing a `group` sit next to each other within each category. |
| `label` | `string` | `dataKey` | Human-readable name shown in legends and tooltips. |

<DemoExample
  :demo="chartsBar"
  description="Bar chart example: revenue and cost share a group to display side by side for each month."
  locale="en"
  title="Bar chart"
/>

### Area (`area`)

An area series fills the region below a line. It is useful for showing total volume and changing proportions over time. Giving multiple area series the same `stack` name stacks them in order.

```ts
declare function area(dataKey: string, options?: AreaOptions): SeriesDef
```

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `color` | `string` | Auto from theme palette | Area fill color. |
| `opacity` | `number` | `0.3` | Area fill opacity. |
| `curve` | `'linear' \| 'monotone' \| 'natural' \| 'step'` | `'monotone'` | Curve interpolation algorithm. |
| `stack` | `string` | `undefined` | Stack group name. Areas sharing a `stack` stack sequentially. |
| `gradient` | `boolean` | `false` | Whether to apply a vertical gradient fill. |
| `stroke` | `boolean` | `true` | Whether to draw a stroke line along the top edge of the area. |
| `label` | `string` | `dataKey` | Human-readable name shown in legends and tooltips. |

<DemoExample
  :demo="chartsStackedArea"
  description="Stacked area chart: cost and profit share a stack identifier to show overall totals."
  locale="en"
  title="Stacked area chart"
/>

### Dot (`dot`)

A dot series shows the distribution of discrete data points.

```ts
declare function dot(dataKey: string, options?: DotOptions): SeriesDef
```

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `color` | `ColorAccessor` | Auto from theme palette | Dot color. Accepts a color string or a per-point accessor function. |
| `radius` | `number` | `4` | Dot radius in pixels. |
| `opacity` | `number` | `0.8` | Dot opacity. |
| `dodge` | `boolean` | `false` | When multiple points share the same x value, offsets them horizontally to reduce overlap. |
| `label` | `string` | `dataKey` | Human-readable name shown in legends and tooltips. |

<DemoExample
  :demo="chartsDot"
  description="Dot chart example: distribution of test scores across sample sizes and control groups."
  locale="en"
  title="Dot chart"
/>

### Band (`band`)

A band series fills a translucent area between an upper and a lower boundary field. It is often used to show forecast confidence intervals. Band marks are annotations, so they do not appear in legends or tooltips.

```ts
declare function band(options: BandOptions): SeriesDef
```

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `upper` | `string` | **Required** | Field name for the upper boundary value. |
| `lower` | `string` | **Required** | Field name for the lower boundary value. |
| `color` | `string` | `'var(--color-accent)'` | Fill color for the band area. |
| `opacity` | `number` | `0.15` | Fill opacity for the band area. |

### Reference line (`referenceLine`)

A reference line marks a specific horizontal or vertical threshold on the chart, or fills a shaded region between two horizontal values. Reference lines are annotations, so they do not appear in legends or tooltips.

```ts
declare function referenceLine(options: ReferenceLineOptions): SeriesDef
```

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `y` | `number` | `undefined` | Draws a horizontal line at this y-axis value. |
| `y2` | `number` | `undefined` | Second y-axis value. Providing both `y` and `y2` shades a reference band between them. |
| `x` | `number` | `undefined` | Draws a vertical line at this x-axis value. |
| `color` | `string` | `'var(--astryx-color-border-emphasized)'` | Line or band fill color. |
| `strokeWidth` | `number` | `1` | Stroke width in pixels. |
| `strokeDasharray` | `string` | `undefined` | Dash pattern string, such as `'4 4'`. |
| `label` | `string` | `undefined` | Text label displayed alongside the line. |
| `labelPosition` | `'start' \| 'end'` | `'end'` | Label placement along the line: start/end corresponds to left/right for horizontal lines, and bottom/top for vertical lines. |
| `bandOpacity` | `number` | `0.1` | Fill opacity for the reference band (active only when `y2` is set). |

<DemoExample
  :demo="chartsBandReference"
  description="Band and reference line: shaded forecast interval in the background, actual line in the middle, and a dashed target threshold on top."
  locale="en"
  title="Band and reference line"
/>

### Error bar (`errorBar`)

An error bar (whisker) displays value uncertainty. It is usually paired with `bar()` or `dot()`. Boundary fields use absolute values, allowing asymmetric error intervals. If a row lacks an upper or lower bound, the chart skips that point instead of drawing misleading lines to zero. Error bars are annotations, so they do not appear in legends or tooltips.

```ts
declare function errorBar(options: ErrorBarOptions): SeriesDef
```

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `high` | `string` | **Required** | Field name for the upper bound (absolute value). |
| `low` | `string` | **Required** | Field name for the lower bound (absolute value). |
| `color` | `string` | `'var(--astryx-color-text-primary)'` | Stroke color. |
| `strokeWidth` | `number` | `1.5` | Stroke width in pixels. |
| `capWidth` | `number` | `8` | Width in pixels of the horizontal end caps. |

<DemoExample
  :demo="chartsErrorBar"
  description="Error bars: paired with a bar chart to display group averages alongside 95% confidence intervals."
  locale="en"
  title="Error bars"
/>

### Candlestick (`candlestick`)

A candlestick series displays open, high, low, and close prices over time, commonly used in financial charts.

```ts
declare function candlestick(options: CandlestickOptions): SeriesDef
```

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `open` | `string` | **Required** | Field name for the open price. |
| `high` | `string` | **Required** | Field name for the high price. |
| `low` | `string` | **Required** | Field name for the low price. |
| `close` | `string` | **Required** | Field name for the close price. |
| `upColor` | `string` | `'var(--astryx-color-success)'` | Color for up candles, where close is greater than or equal to open. |
| `downColor` | `string` | `'var(--astryx-color-error)'` | Color for down candles, where close is lower than open. |

<DemoExample
  :demo="chartsCandlestick"
  description="Candlestick chart: displays daily price movements for a stock or commodity over a week."
  locale="en"
  title="Candlestick"
/>

## Axes, grid, legend, tooltip

Supporting chart elements are provided as individual components. You can combine and configure them independently. Setting `legend` or `tooltip` to `true` on `<Chart>` enables their defaults. Pass an object to customize position and layout.

### Axes (`ChartAxis`)

Axes render along chart edges to display ticks and label text.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `position` | `'top' \| 'right' \| 'bottom' \| 'left'` | **Required** | Edge to place the axis on. |
| `tickCount` | `number` | `5` | Desired number of ticks. d3 uses this as a hint to find clean intervals. |
| `maxTicks` | `number` | `undefined` | Maximum number of tick labels to render. Excess ticks are skipped at uniform intervals. |
| `tickFormat` | `(value: unknown) => string` | `undefined` | Custom tick label formatting function. |
| `truncate` | `number` | `undefined` | Maximum characters for tick labels before truncating with an ellipsis. |
| `animated` | `boolean` | `true` | Whether to smoothly animate tick transitions when positions change. |
| `showAxisLine` | `boolean` | `true` on bottom axis only | Whether to render the axis baseline. If `showTicks` is true, the baseline is always drawn regardless of position. |
| `showTicks` | `boolean` | `false` | Whether to draw short perpendicular tick lines at each step. |

### Grid (`ChartGrid`)

Grid lines render behind series elements to help align values visually.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `horizontal` | `boolean` | `true` | Whether to draw horizontal grid lines. |
| `vertical` | `boolean` | `false` | Whether to draw vertical grid lines. |
| `tickCount` | `number` | `5` | Approximate number of grid lines. Matching this with `<ChartAxis>` aligns grid lines with axis ticks. |

### Legend (`ChartLegend`)

A legend lists series names alongside their representative colors. Setting `legend` on `<Chart>` shows the legend (off by default), or use the `<ChartLegend>` component directly.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `LegendItem[]` | `[]` | Explicit array of legend items. Inferred automatically from series when omitted. |
| `position` | `'top' \| 'bottom' \| 'start' \| 'end'` | `'bottom'` | Docking side relative to the chart canvas. `start` and `end` follow reading direction. |
| `alignment` | `'start' \| 'center' \| 'end'` | `'start'` | Alignment of items along the docked edge. |

### Tooltip (`ChartTooltip`)

A tooltip displays details for the data row under the pointer.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `series` | `readonly SeriesDef[]` | Injected by Chart | Series definitions. When using `<ChartTooltip>` directly, pass the same `series` array. |
| `hoverIndicator` | `boolean` | `true` | Whether to draw hover indicators. Bars highlight the active column, while lines, areas, and dots draw a vertical rule. |
| `showHoverDots` | `boolean` | `true` | Whether to highlight active data points with dots (skipped automatically on bars). |
| `placement` | `'auto' \| 'right' \| 'left' \| 'top'` | `'auto'` | Card placement relative to the active point. `auto` defaults to the right and flips left when room runs out. |

### Swatch (`ChartSwatch`)

A swatch renders a small color marker representing a series, useful inside legends or custom tooltips.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `color` | `string` | **Required** | Fill color value. |
| `variant` | `'square' \| 'line'` | `'square'` | Swatch shape. `square` renders a small square (for bars); `line` renders a short horizontal line (for lines and areas). |

### Custom tooltip content

When the default tooltip layout is not enough, customize the card content through the `#tooltip` slot on `<Chart>`. The slot exposes the active `xValue` and row details in `rows`:

```vue
<template>
  <Chart :data="monthly" x-key="month" :series="series" tooltip>
    <template #tooltip="{ xValue, rows }">
      <div class="my-custom-tooltip">
        <strong>{{ xValue }}</strong>
        <div v-for="row in asRows(rows)" :key="row.key">
          <ChartSwatch :color="row.color" variant="line" />
          {{ row.label }}: {{ money(row.value) }}
        </div>
      </div>
    </template>
  </Chart>
</template>
```

<DemoExample
  :demo="chartsCustomTooltip"
  description="Custom tooltip: uses the #tooltip slot to read active data and render a custom layout."
  locale="en"
  title="Custom tooltip"
/>

## Colors

When a series does not set an explicit color, the chart assigns one automatically in order from the active theme palette.

All chart colors use CSS variables underneath. When switching themes or toggling dark mode, chart colors update automatically without re-rendering the SVG tree.

To inspect or use the current chart palette programmatically, call `useChartColors()`. It returns a shared object across the package:

- `categorical(n: number)`: Returns an array of `n` categorical colors. If `n` exceeds palette size, colors cycle.
- `sequential`: Sequential color scale helper supporting nine hues (`blue`, `shamrock`, `orange`, `pink`, `purple`, `red`, `teal`, `yellow`, `gray`). Passing a count `n` returns a gradient color array.
- `diverging`: Two-pole diverging palette helper. Provides `positiveNegative`, `coldHot`, and `custom` (custom hues on each pole).
- `semantic`: Semantic status colors, containing `positive`, `negative`, `warning`, and `neutral`.
- `structural`: Structural colors for chart framing, containing `axis`, `grid`, `tick`, and `label`.
- `alpha(color: string, opacity: number)`: Generates a color with an alpha channel for a given opacity. CSS variables use `color-mix()` automatically.

## Formatting functions

The library includes formatting helpers for common chart values. Formatting functions follow a safe fallback rule: if an input is `NaN`, `Infinity`, or cannot be parsed, the function returns the original string as-is instead of printing errors or throwing exceptions.

- `compactNumber(value, locale)`: Abbreviates large numbers. For example, `1200` becomes "1.2K", `1500000` becomes "1.5M", and `1e12` becomes "1T".
- `currency(symbol?, locale?)`: Creates a currency formatter. For example, `currency('$')` can be passed to `ChartAxis`'s `tickFormat`. Values over 1,000 are automatically abbreviated (such as "$1.5K").
- `percent(value, locale)`: Formats a decimal ratio as a percentage. For example, `0.45` becomes "45%" and `0.005` becomes "0.5%".
- `shortDate(value, locale)`: Formats dates as a short month and day. For example, "Jan 5".
- `monthYear(value, locale)`: Formats dates as month and year. For example, "Jan 2024".
- `formatList(values, locale)`: Formats a list of words into a natural language string according to locale rules, such as "A, B, and C".

## Accessibility

Charts include built-in accessibility features so screen reader users can understand chart content:

- The root element has a `role="img"` attribute.
- The chart's accessible name prioritizes the `title` prop. When `title` is omitted, the component builds a semantic description from primary series and the x-axis field (such as "Monthly Revenue and Cost trend"). If only annotations are present, it falls back to "Chart".
- The `subtitle` prop maps to the chart's accessible description.
- When total data points (data rows × data columns) do not exceed 100 (`MAX_TABLE_POINTS`), the chart generates a visually hidden data table using `VisuallyHidden`. Screen readers can read exact values row by row. Above 100 points, the table is omitted to prevent excessive speech noise.

## Server-side rendering

During server-side rendering (SSR), no browser DOM exists, so the component cannot measure parent container width in pixels.

When rendering on the server, pass an explicit `width` prop on `<Chart>`. This allows the server to compute scales and render complete SVG paths and rectangles into HTML. After client-side hydration, once the browser measures the real container width, the chart takes over and responds to container resize events.

## Not supported yet

To stay lightweight and focused, the package currently leaves out:
- Four WebGL-based series marks for very large datasets (such as `dotGL`) are not yet included.
- The Nuxt module does not yet include auto-import switches for `@astryx-vue/charts`. Import components manually when using Nuxt.
