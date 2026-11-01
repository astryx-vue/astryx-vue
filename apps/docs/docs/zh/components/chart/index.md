---
layout: component-docs
title: 图表
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

## 概述

`@astryx-vue/charts` 使用 d3 计算比例尺和图形路径，再由 Vue 渲染 SVG。每个图表由一个 `<Chart>` 画布和一个或多个系列组成；系列可以是折线、柱状、面积或其他数据标记。

## 安装

```bash
pnpm add @astryx-vue/charts
```

`@astryx-vue/charts` 依赖同级的 `@astryx-vue/core` 和 `vue`，请确保项目中已经安装了它们。

图表内置了基础样式。你可以在入口文件引入完整样式文件：

```ts
import '@astryx-vue/charts/charts.css'
```

如果你想按需加载样式，也可以只引入 `@astryx-vue/charts/styles/` 目录下的某一个样式文件（例如 `chart.css`、`chart-axis.css`、`chart-grid.css`、`chart-legend.css`、`chart-tooltip.css` 或 `chart-swatch.css`）。

## 第一张图

画一张图最少需要给 `<Chart>` 传三个必填属性：
- `data`：要展示的数据数组，每一项是一行对象。
- `xKey`：指定每行对象中哪个字段当作横坐标（x 轴）。
- `series`：标记系列数组，用 `line()`、`bar()` 等函数生成。

下面是一段最短的可运行折线图代码：

```vue
<script setup lang="ts">
import { Chart, ChartAxis, ChartGrid, line } from '@astryx-vue/charts'

// 1. 准备数据
const data = [
  { month: '1月', revenue: 100, cost: 60 },
  { month: '2月', revenue: 150, cost: 80 },
  { month: '3月', revenue: 120, cost: 70 },
]

// 2. 定义系列：画两条线，一条读 revenue，一条读 cost
const series = [
  line('revenue', { label: '收入' }),
  line('cost', { label: '成本' }),
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

实际运行效果如下：

<DemoExample
  :demo="chartsLine"
  description="包含收入与成本两条折线，带有网格、坐标轴、底部图例以及鼠标悬停提示框。"
  locale="zh"
  title="折线图"
/>

## 系列

系列代表图表上展示的具体数据图形。同一个系列对象在布局和渲染时会被写入内部状态，所以同一个系列对象只能提供给一个 `<Chart>` 使用，每张图都要重新创建一份。

如果数据中存在缺失值（`null`、`undefined`）或非有限数字（`NaN`、`Infinity`），折线会自然断开形成空洞，不会强行掉到 0 基线上画出一条错误虚假的连线。

在不设置显式 `yDomain` 时，y 轴的范围由 `yBaseline` 决定：
- `'auto'`（默认）：带零基线的标记（柱状图、面积图）会把 0 算进坐标范围；只有离散连续点的图表（折线图、散点图等）会在上下两侧保留一点余量，防止数据点贴在画布边缘。
- `'zero'`：以 0 为中心对称展开坐标轴，适合展示正负波动数据（比如盈利与亏损）。
- `'data'`：紧贴实际数据的最大值与最小值，不强制包含 0，也不留任何边缘余量。

### 折线（line）

折线用于展示数据随时间或类目的连续变化趋势。

```ts
declare function line(dataKey: string, options?: LineOptions): SeriesDef
```

| 选项 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `color` | `string` | 自动取色 | 折线颜色。 |
| `curve` | `'linear' \| 'monotone' \| 'natural' \| 'step'` | `'monotone'` | 曲线插值方式。分别代表折线、单调三次样条、自然样条和阶梯线。 |
| `strokeWidth` | `number` | `2` | 线条粗细（像素）。 |
| `dots` | `boolean` | `false` | 是否在每个数据点上画出实体小圆点。 |
| `label` | `string` | `dataKey` | 图例和提示框中展示的可读名称。 |

### 柱状（bar）

柱状图用于对比不同分类或时间点下的数值大小。相同 `group` 的柱子会把带宽平分并排展示；相同 `stack` 的柱子会一层层堆叠起来展示。

```ts
declare function bar(dataKey: string, options?: BarOptions): SeriesDef
```

| 选项 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `color` | `ColorAccessor` | 自动取色 | 柱子填充色，可以是固定颜色字符串，也可以是基于数据项计算颜色的函数 `(datum, index) => string`。 |
| `opacity` | `number` | `1` | 柱子透明度，取值范围在 0 到 1 之间。 |
| `radius` | `number` | `4` | 柱子顶部的圆角半径（像素）。堆叠时只有最上面一层有圆角。 |
| `stack` | `string` | `undefined` | 堆叠分组名称。相同 `stack` 的系列会自底向上累加堆叠。 |
| `group` | `string` | `undefined` | 并排分组名称。相同 `group` 的系列会在每个类目下并排排列。 |
| `label` | `string` | `dataKey` | 图例和提示框中展示的可读名称。 |

<DemoExample
  :demo="chartsBar"
  description="柱状图示例：收入和成本共用同一个 group 分组，在每个月份下并排显示。"
  locale="zh"
  title="柱状图"
/>

### 面积（area）

面积图在折线下方填充颜色，非常适合表现总量以及各部分占比的变化。如果给多个面积系列指定相同的 `stack` 名字，它们会逐层叠起来。

```ts
declare function area(dataKey: string, options?: AreaOptions): SeriesDef
```

| 选项 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `color` | `string` | 自动取色 | 面积填充色。 |
| `opacity` | `number` | `0.3` | 面积填充透明度。 |
| `curve` | `'linear' \| 'monotone' \| 'natural' \| 'step'` | `'monotone'` | 曲线插值算法。 |
| `stack` | `string` | `undefined` | 堆叠分组名称。相同 `stack` 的面积会依次堆叠。 |
| `gradient` | `boolean` | `false` | 是否使用垂直渐变填充。 |
| `stroke` | `boolean` | `true` | 是否在面积顶部画出边缘描边。 |
| `label` | `string` | `dataKey` | 图例和提示框中展示的可读名称。 |

<DemoExample
  :demo="chartsStackedArea"
  description="堆叠面积图：成本与利润共用相同的 stack 标识，堆叠呈现整体总额。"
  locale="zh"
  title="堆叠面积图"
/>

### 散点（dot）

散点图用于展示离散数据点的分布情况。

```ts
declare function dot(dataKey: string, options?: DotOptions): SeriesDef
```

| 选项 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `color` | `ColorAccessor` | 自动取色 | 圆点颜色，支持传函数按点取色。 |
| `radius` | `number` | `4` | 圆点半径（像素）。 |
| `opacity` | `number` | `0.8` | 圆点透明度。 |
| `dodge` | `boolean` | `false` | 当多个点落在同一个 x 坐标时，是否在水平方向上稍微错开位置，避免重叠遮挡。 |
| `label` | `string` | `dataKey` | 图例和提示框中展示的可读名称。 |

<DemoExample
  :demo="chartsDot"
  description="散点图示例：展示不同样本量下的得分与对照组数据点分布。"
  locale="zh"
  title="散点图"
/>

### 区间带（band）

区间带用于在上下两个边界字段之间涂满一层半透明的带状区域，通常用来展示预测区间的波动范围。它属于辅助标注标记，不会出现在图例和悬停提示框中。

```ts
declare function band(options: BandOptions): SeriesDef
```

| 选项 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `upper` | `string` | **必填** | 上界数据列的字段名。 |
| `lower` | `string` | **必填** | 下界数据列的字段名。 |
| `color` | `string` | `'var(--color-accent)'` | 区域填充颜色。 |
| `opacity` | `number` | `0.15` | 区域透明度。 |

### 参考线（referenceLine）

参考线可以在图表指定的数值位置画一条横线、竖线，或者在两条横线之间涂上一段浅色参考带，常用于标记阈值或目标值。它属于辅助标注标记，不进入图例和提示框。

```ts
declare function referenceLine(options: ReferenceLineOptions): SeriesDef
```

| 选项 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `y` | `number` | `undefined` | 在指定的 y 轴数值位置画一条水平横线。 |
| `y2` | `number` | `undefined` | 第二个 y 轴数值。如果同时传入 `y` 和 `y2`，会在两者之间涂上一片参考带。 |
| `x` | `number` | `undefined` | 在指定的 x 轴数值位置画一条垂直竖线。 |
| `color` | `string` | `'var(--astryx-color-border-emphasized)'` | 线条或参考带的颜色。 |
| `strokeWidth` | `number` | `1` | 描边粗细（像素）。 |
| `strokeDasharray` | `string` | `undefined` | 虚线样式，如 `'4 4'`。 |
| `label` | `string` | `undefined` | 显示在线条旁边的文字标签内容。 |
| `labelPosition` | `'start' \| 'end'` | `'end'` | 标签对齐位置。横线对应左/右端，竖线对应底/顶端。 |
| `bandOpacity` | `number` | `0.1` | 参考带的填充透明度（仅在同时设置了 `y2` 时生效）。 |

<DemoExample
  :demo="chartsBandReference"
  description="区间带与参考线：底层绘制预测波动的带状面积，中间绘制实际折线，上方横穿一条虚线目标参考线。"
  locale="zh"
  title="区间带与参考线"
/>

### 误差条（errorBar）

误差条（须线）用于展示数值的不确定性范围。它通常配合 `bar()` 或 `dot()` 一起使用。需要注意的是，误差条传入的上下界字段是绝对数值，因此即使上下误差不对称也可以正确绘制。如果某一行缺失了上界或下界，则会直接跳过该点，绝不绘制误导人的零刻度须线。它属于辅助标注标记，不进入图例和提示框。

```ts
declare function errorBar(options: ErrorBarOptions): SeriesDef
```

| 选项 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `high` | `string` | **必填** | 上界数据列的字段名（绝对值）。 |
| `low` | `string` | **必填** | 下界数据列的字段名（绝对值）。 |
| `color` | `string` | `'var(--astryx-color-text-primary)'` | 描边线条颜色。 |
| `strokeWidth` | `number` | `1.5` | 线条粗细（像素）。 |
| `capWidth` | `number` | `8` | 须线两端小横杠的宽度（像素）。 |

<DemoExample
  :demo="chartsErrorBar"
  description="误差条：配合柱状图使用，直观展示各实验组均值及对应的 95% 置信区间。"
  locale="zh"
  title="误差条"
/>

### 蜡烛图（candlestick）

蜡烛图（K 线图）用于金融等场景，展示一段时间内的开盘、最高、最低和收盘价。

```ts
declare function candlestick(options: CandlestickOptions): SeriesDef
```

| 选项 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `open` | `string` | **必填** | 开盘价字段名。 |
| `high` | `string` | **必填** | 最高价字段名。 |
| `low` | `string` | **必填** | 最低价字段名。 |
| `close` | `string` | **必填** | 收盘价字段名。 |
| `upColor` | `string` | `'var(--astryx-color-success)'` | 阳线（收盘价高于或等于开盘价）的颜色。 |
| `downColor` | `string` | `'var(--astryx-color-error)'` | 阴线（收盘价低于开盘价）的颜色。 |

<DemoExample
  :demo="chartsCandlestick"
  description="蜡烛图（K 线图）：展示一周内股票或商品的价格走势。"
  locale="zh"
  title="蜡烛图"
/>

## 坐标轴、网格、图例、提示框

图表的辅助元素均以独立组件的形式提供，你可以自由组合和调整。在 `<Chart>` 上直接给 `legend` 或 `tooltip` 传 `true` 即可启用默认样式，也可以传配置对象调整位置。

### 坐标轴（ChartAxis）

坐标轴绘制在图表四周，负责标注刻度与文字。

| 属性 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `position` | `'top' \| 'right' \| 'bottom' \| 'left'` | **必填** | 绘制在哪一条边上。 |
| `tickCount` | `number` | `5` | 期望显示的刻度数量（该值为参考值，d3 会计算出最工整的步长）。 |
| `maxTicks` | `number` | `undefined` | 允许显示的最大刻度文字数量，超出时会等间隔跳过。 |
| `tickFormat` | `(value: unknown) => string` | `undefined` | 自定义刻度文字的格式化函数。 |
| `truncate` | `number` | `undefined` | 刻度文字最大字符数，超出截断并追加省略号。 |
| `animated` | `boolean` | `true` | 刻度位置发生变化时是否开启平滑过渡动画。 |
| `showAxisLine` | `boolean` | 仅底轴为 `true` | 是否绘制轴线。如果设置了 `showTicks`，无论哪条轴都会强制画出轴线。 |
| `showTicks` | `boolean` | `false` | 是否在每个刻度位置画一小段垂直的短刻度须线。 |

### 网格（ChartGrid）

网格线绘制在数据图形底层，帮助读者对齐数值。

| 属性 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `horizontal` | `boolean` | `true` | 是否绘制水平网格线。 |
| `vertical` | `boolean` | `false` | 是否绘制垂直网格线。 |
| `tickCount` | `number` | `5` | 大约绘制几条网格线。与 `<ChartAxis>` 的 `tickCount` 保持一致可使网格与刻度完全对齐。 |

### 图例（ChartLegend）

图例列出各个系列的名称与代表色。在 `<Chart>` 上写 `legend` 就会显示（默认不显示），也可以单独使用 `<ChartLegend>` 组件。

| 属性 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `items` | `LegendItem[]` | `[]` | 显式指定的图例项数组。不传则自动从系列推导。 |
| `position` | `'top' \| 'bottom' \| 'start' \| 'end'` | `'bottom'` | 图例相对图表画布的停靠方位。`start` 和 `end` 会跟随阅读方向。 |
| `alignment` | `'start' \| 'center' \| 'end'` | `'start'` | 图例项在所在边上的对齐方式。 |

### 提示框（ChartTooltip）

鼠标悬停在图表上时，提示框会展示当前位置对应的数据明细。

| 属性 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `series` | `readonly SeriesDef[]` | 由 Chart 注入 | 系列定义。独立使用该组件时需要传入同一份 `series` 数组。 |
| `hoverIndicator` | `boolean` | `true` | 悬停时是否绘制辅助指示。柱状图高亮整列，折线、面积和散点绘制垂直指示线。 |
| `showHoverDots` | `boolean` | `true` | 是否在悬停的数据点上显示高亮小圆点（柱状图自动跳过）。 |
| `placement` | `'auto' \| 'right' \| 'left' \| 'top'` | `'auto'` | 浮层卡片相对悬停点的位置。`auto` 会优先靠右，放不下时自动翻转到左侧。 |

### 颜色色块（ChartSwatch）

用于在图例或自定义提示框中绘制一小块系列代表色标。

| 属性 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `color` | `string` | **必填** | 填充颜色值。 |
| `variant` | `'square' \| 'line'` | `'square'` | 色块形态。`square` 渲染为小方块（适合柱状），`line` 渲染为一小段短线（适合折线和面积）。 |

### 自定义提示框内容

如果内置提示框的样式无法满足要求，可以通过 `<Chart>` 的 `#tooltip` 插槽自定义浮层内容。插槽向外暴露当前悬停的横坐标值 `xValue` 和各系列的数据明细 `rows`：

```vue
<template>
  <Chart :data="monthly" x-key="month" :series="series" tooltip>
    <template #tooltip="{ xValue, rows }">
      <div class="my-custom-tooltip">
        <strong>{{ xValue }}</strong>
        <div v-for="row in asRows(rows)" :key="row.key">
          <ChartSwatch :color="row.color" variant="line" />
          {{ row.label }}：{{ money(row.value) }}
        </div>
      </div>
    </template>
  </Chart>
</template>
```

<DemoExample
  :demo="chartsCustomTooltip"
  description="自定义悬停提示框：通过 #tooltip 插槽读取当前数据并按自定义格式排版渲染。"
  locale="zh"
  title="自定义提示框"
/>

## 颜色

如果创建系列时没有显式指定颜色，图表会根据主题里的分类色板，按顺序自动给每个系列分配颜色。

所有的图表颜色底层都是基于 CSS 变量实现的。这意味着当页面切换主题风格，或者从浅色模式切换到深色模式时，图表上的颜色会自动跟随环境刷新，不需要重新渲染整张图表。

如果你需要手动获取当前图表体系的配色方案，可以调用 `useChartColors()` 组合式函数。它返回的对象在整个包中全局共享且保持不变，其包含的成员如下：

- `categorical(n: number)`：获取包含指定数量的分类色数组。数量超出槽位时会自动循环。
- `sequential`：顺序色阶对象，支持 9 种色相（`blue`、`shamrock`、`orange`、`pink`、`purple`、`red`、`teal`、`yellow`、`gray`）。传入数量 `n` 即可返回渐变过渡色数组。
- `diverging`：双极发散配色。提供 `positiveNegative`（正负分明）、`coldHot`（冷暖分明）以及 `custom`（自定义两侧色相）方法。
- `semantic`：语义单色值对象，包含 `positive`、`negative`、`warning` 和 `neutral` 四种标准状态色。
- `structural`：图表骨架的结构色，包含 `axis`（坐标轴线）、`grid`（网格线）、`tick`（刻度短线）和 `label`（文本标签）四种颜色。
- `alpha(color: string, opacity: number)`：按指定透明度生成带透明通道的颜色值（若为 CSS 变量则自动采用 `color-mix()` 处理）。

## 格式化函数

图表库内置了一组常用的格式化函数。所有格式化函数都遵循安全原则：如果遇到 `NaN`、`Infinity` 或无法解析的值，会原样返回原字符串，绝对不会在界面上打印出异常信息，也不会报错崩溃。

- `compactNumber(value, locale)`：将大数字缩写。例如 `1200` 转为「1.2K」，`1500000` 转为「1.5M」，`1e12` 转为「1T」。
- `currency(symbol?, locale?)`：创建货币格式化器。例如 `currency('¥')` 可以直接传给 `ChartAxis` 的 `tickFormat` 属性，数值大于一千时会自动应用缩写（如「¥1.5K」）。
- `percent(value, locale)`：将小数比例转换为百分比。例如 `0.45` 转换为「45%」，`0.005` 转换为「0.5%」。
- `shortDate(value, locale)`：将日期格式化为简短的月日。例如「Jan 5」或「3月12日」。
- `monthYear(value, locale)`：将日期格式化为年月。例如「Jan 2024」或「2025年3月」。
- `formatList(values, locale)`：按指定语言的语法规则把多个词汇拼接为自然语言列表，例如将数组拼成「甲、乙和丙」。

## 无障碍

图表在可访问性方面做了完善的无障碍设计，让视障人士通过读屏软件也能了解图表内容：

- 整个图表根元素具有 `role="img"` 角色属性。
- 图表的无障碍名称优先使用传入的 `title` 属性；如果没有提供 `title`，系统会根据包含的主要系列与 x 轴字段自动拼接出清晰的语义名称（如「月度 收入和成本 走势」）；如果全是辅助标注线，则默认退化为「图表」。
- 传入的 `subtitle` 会自动关联为图表的无障碍长描述。
- 当数据点总数（数据行数 × 数据列数）不超过 100 个（即常量 `MAX_TABLE_POINTS`）时，图表会自动生成一份在视觉上完全隐藏的数据表格（通过 `VisuallyHidden` 隐藏在屏幕外）。读屏软件能够直接逐行朗读表格中的精准数据；如果数据量超过 100 点，则不会生成表格以避免造成大量无效的语音噪音。

## 服务端渲染

在服务端渲染（SSR）环境中运行时，由于不存在真实的浏览器 DOM，组件无法自动测量父级容器的实际像素宽度。

因此，在服务端渲染时，必须在 `<Chart>` 上显式传入 `width` 属性指定宽度像素值，服务端才能正确完成比例尺计算并完整输出包含路径和矩形的 SVG 标签。在浏览器端水合后，图表一旦首次测量到真实的容器宽度，便会自动接管并按真实容器尺寸响应式排版。

## 现在不支持的

为了保持包的轻量和聚焦，目前以下能力暂未包含在当前包中：
- 4 个基于 WebGL 的超大数据集标记（例如 `dotGL` 等标记）尚未收录于此包中。
- Nuxt 模块中尚未提供针对 `@astryx-vue/charts` 的自动引入配置开关，在 Nuxt 项目中使用时需手动通过 npm 依赖导入。
