# F2b 实现记录（总控接手收尾）

worker 写完了 `Chart`、`ChartAxis`、`ChartGrid`、`ChartLegend`、`ChartSwatch`、`ChartTooltip` 和 8 种标记的 `render()`，以及大部分用例。后来卡在「演示页图表宽度量不出来」上调试了约 50 分钟，没有新提交。总控叫停后接手。

## 总控补修

- 宽度量不出来，原因是 `v-if` 在量到宽度前后切换了根元素，`ResizeObserver` 盯着旧元素。worker 已改成单根元素，这一点是对的。
- 量到宽度后根元素仍写死 `height`，标题、图例被挤出盒子，和下一张图重叠。改成只在量到宽度前用高度占位。
- `HStack` 的 `vAlign` 在模板里写成 `v-align` 会被 Vue 当成指令，图例色块和文字没对齐。改用项目统一的 `align` 属性。
- 补了上游的 `useChartColors` 用例（5 条）。`alpha()` 收到 `var(...)` 时用 `color-mix()` 混透明。上游「解析不了的颜色原样返回」那条用例保持不变，所以这一层放在 `useChartColors`，没改 `getChartColors`。
- charts 的 typecheck 原来依赖 core 先构建出 `dist`，CI 上会红。改成和文档站一样走 `customConditions: ["source"]`。

## 用例对照

| 上游 | 上游条数 | 我们 | 说明 |
| --- | --- | --- | --- |
| Chart | 13 | 14 | |
| ChartAxis | 11 | 11 | |
| ChartGrid | 7 | 7 | |
| ChartLegend | 6 | 6 | |
| ChartSwatch | 5 | 5 | |
| ChartTooltip | 20 | 17 | 4 条依赖 Layer / 原生 Popover 的改成等价写法：卡片挂在图表根容器里的 HTML 层 |
| marks | 25 | 21 | 少的 4 条全是 WebGL（dotGL、dotGLInteractive、heatmapGL、streamGL），归 F2d |
| useChartColors | 5 | 6 | 多 1 条 `color-mix` |

## 留给后续

- 图表的 4 个文案键（`@astryx.chart.*`、`@astryx.chartLegend.label`）还在包内兜底中英文，没接进 core 的 `upstreamMap`，`coverage.mjs` 里也还标着「暂不接入」。F2c 写文档时一起接入。
