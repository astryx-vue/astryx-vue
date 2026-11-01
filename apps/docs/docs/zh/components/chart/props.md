---
layout: component-docs
title: 图表
outline: false
footer: false
---

## `<Chart>` 的属性与插槽

`<Chart>` 是整张图表的根容器。它负责测量尺寸、建立坐标系、计算点位并把图形画在 SVG 里。

### 属性

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `data` | `Record<string, unknown>[]` | **必填** | 要画的数据行。每行既有 x 对应的列，也有一到多个系列的数据列。 |
| `xKey` | `string` | **必填** | 每行里当 x 用的字段名，所有系列共用。 |
| `series` | `SeriesDef[]` | **必填** | 标记定义数组，按顺序画在同一套坐标系上。 |
| `height` | `number` | `300` | 图表高度（单位是 CSS 像素）。非有限值和负数都会当成 0 处理。 |
| `width` | `number` | `0` | 图表宽度（单位是 CSS 像素）。浏览器里第一次量到容器宽度后就不再使用；服务端渲染时没有容器可量，全靠它出图。 |
| `margin` | `Partial<ChartMargin>` | `{ top: 24, right: 24, bottom: 32, left: 48 }` | 绘图区内边距的部分覆盖值，没传的边使用默认留白。 |
| `yBaseline` | `'auto' \| 'zero' \| 'data'` | `'auto'` | 没写 `yDomain` 时 y 轴范围怎么定。 |
| `yDomain` | `[number, number]` | `undefined` | 显式指定的 y 轴范围 `[min, max]`。一旦指定就以此为准，不额外加基线、也不留上下余量。 |
| `xDomain` | `[number, number]` | `undefined` | 数值 x 轴的显式范围 `[min, max]`。即使 `data` 为空也会照常生效（保证流式更新窗口稳定）。在离散类目的 band 轴上会被忽略。 |
| `legend` | `boolean \| ChartLegendConfig` | `false` | 是否显示从系列推导出的图例，或者传配置对象调整位置与对齐。 |
| `tooltip` | `boolean \| ChartTooltipConfig` | `false` | 是否显示分组的悬停提示框。 |
| `title` | `string` | `undefined` | 图表标题，同时作为 SVG 的无障碍名称（Accessible Name）。 |
| `subtitle` | `string` | `undefined` | 标题下方的补充说明文字，同时作为 SVG 的无障碍描述。 |

### 插槽

| 名称 | 参数 | 说明 |
| :--- | :--- | :--- |
| `grid` | 无 | 画在系列后方的背景网格，通常放置 `<ChartGrid />`。 |
| `axes` | 无 | 画在系列后方的坐标轴，通常放置若干个 `<ChartAxis />`。 |
| `interactions` | 无 | 画在指针捕获层上方的自定义交互图层。 |
| `tooltip` | `{ xValue: unknown, rows: unknown[] }` | 提示框的自定义内容插槽。`xValue` 是当前悬停的 x 坐标值，`rows` 是当前行对应各个系列的数据明细。 |
| `default` | 无 | 额外扩展内容，画在内置提示框图层之后。 |
