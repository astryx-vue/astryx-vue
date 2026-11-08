# F3d：Lab 图表类实施计划

## 范围

Chart 组合、Brush、Zoom、Select、m4Reduce、useChartRange、Radial、Sankey、ThreeD 的 SVG 部分；不含 GL。

## 已完成阶段

- ChartBrush：x/xy 框选、数据范围和命中行、指针捕获、点击清除；PR #454。
- ChartSelect：最近点选择、受控选中项、选中圆环、Shift/Meta 多选；PR #458。
- ChartZoom：滚轮和双指缩放、拖动平移、轴向限制、分类 x 轴保护、工具栏重置；本阶段交付。

## 当前阶段：ChartZoom

- 通过受控 x/y domain 事件让调用方更新图表范围。
- 支持滚轮、双指、拖动和工具栏；重置回到挂载时的初始 domain。
- 主站中英文 Chart 文档和 demo 已接入；CLI 内置资料同步更新。

## 后续阶段

m4Reduce、useChartRange、Radial、Sankey、ThreeD SVG 继续在本 issue 内分别验收；本阶段完成不会关闭 #196。

## 验证

静态测试 + Chromium 实际滚轮、拖动、双指、工具栏、截图和 axe；一个阶段 PR、一次发布。
