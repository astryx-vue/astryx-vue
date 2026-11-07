# F3d：Lab 图表类实施计划

## 范围

Chart 组合、Brush、Zoom、Select、m4Reduce、useChartRange、Radial、Sankey、ThreeD 的 SVG 部分；不含 GL。

## 当前阶段：ChartBrush

- 新增 `ChartBrush`，通过 ChartContext 读取绘图区、比例尺和数据。
- x 模式返回横向数据范围；xy 模式返回矩形范围和命中行。
- 支持拖动选区、指针捕获、点击清除；band 轴不强行做连续范围反演。
- 主站 Chart 文档和 demo 已接入。

## 后续阶段

Zoom、Select、m4Reduce、useChartRange、Radial、Sankey、ThreeD SVG 继续在本 issue 内分别验收；本阶段完成不会关闭 #196。

## 验证

静态测试 + Chromium 实际拖动、范围/命中行、点击清除、截图和 axe；一个阶段 PR、一次发布。
