# F3d：Lab 图表类实施计划

## 范围

Chart 组合、Brush、Zoom、Select、m4Reduce、useChartRange、Radial、Sankey、ThreeD 的 SVG 部分；不含 GL。

## 已完成阶段

- ChartBrush：x/xy 框选、数据范围和命中行、指针捕获、点击清除；PR #454。
- ChartSelect：最近点选择、受控选中项、选中圆环、Shift/Meta 多选；PR #458。
- ChartZoom：滚轮和双指缩放、拖动平移、轴向限制、分类 x 轴保护、工具栏重置；PR #459。

## 当前阶段：m4Reduce

- 按像素桶保留首点、尾点、最低点和最高点，缩减大数据折线的渲染量。
- 输入按 x 升序排列；支持自定义 xDomain，范围外的点归入最近的边缘桶。
- 增加边界与峰值保留测试，以及 12,000 点的原始/缩减折线对比 demo。
- 主站中英文 Chart 文档接入后同步 CLI 内置资料。

## 后续阶段

useChartRange、Radial、Sankey、ThreeD SVG 继续在本 issue 内分别验收；m4Reduce 完成不会关闭 #196。

## 验证

纯计算测试、charts 全量测试、类型与包检查、文档构建，以及 Chromium 原始/缩减折线对比；一个阶段 PR、一次发布。
