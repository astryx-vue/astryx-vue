# F3d：Lab 图表类实施计划

## 范围

Chart 组合、Brush、Zoom、Select、m4Reduce、useChartRange、Radial、Sankey、ThreeD 的 SVG 部分；不含 GL。

## 已完成阶段

- ChartBrush：x/xy 框选、数据范围和命中行、指针捕获、点击清除；PR #454。
- ChartSelect：最近点选择、受控选中项、选中圆环、Shift/Meta 多选；PR #458。
- ChartZoom：滚轮和双指缩放、拖动平移、轴向限制、分类 x 轴保护、工具栏重置；PR #459。
- m4Reduce：按像素桶保留首点、尾点、最低点和最高点，自定义 xDomain 和边缘桶；PR #462。

## 当前阶段：useChartRange

- 用 Vue `shallowRef` 提供受控 x/y domain，`push()` 同步更新，`reset()` 恢复初始范围。
- x 轴预热后按 xWindow 滑动；y 轴支持固定范围、历史极值、padding 和以 0 为中心。
- 不照搬上游 GL streamRef 参数；当前包仍明确不包含 WebGL。
- 主站提供可启动、暂停和重置的流式折线 demo，并同步 CLI 内置资料。

## 后续阶段

Radial、Sankey、ThreeD SVG 继续在本 issue 内分别验收；useChartRange 完成不会关闭 #196。

## 验证

组合式函数同步行为测试、charts 全量测试、类型与包检查、文档构建，以及 Chromium 启动/暂停/重置、范围变化和 axe；一个阶段 PR、一次发布。
