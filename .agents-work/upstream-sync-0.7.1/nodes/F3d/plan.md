# F3d：Lab 图表类实施计划

## 范围

Chart 组合、Brush、Zoom、Select、m4Reduce、useChartRange、Radial、Sankey、ThreeD 的 SVG 部分；不含 GL。

## 已完成阶段

- ChartBrush：x/xy 框选、数据范围和命中行、指针捕获、点击清除；PR #454。
- ChartSelect：最近点选择、受控选中项、选中圆环、Shift/Meta 多选；PR #458。
- ChartZoom：滚轮和双指缩放、拖动平移、轴向限制、分类 x 轴保护、工具栏重置；PR #459。
- m4Reduce：按像素桶保留首点、尾点、最低点和最高点，自定义 xDomain 和边缘桶；PR #462。
- useChartRange：Vue 受控 x/y domain、同步 push、滑动窗口、固定/自动 y 范围和重置；PR #463。

## 当前阶段：Radial

- RadialChart 统一计算中心、半径、雷达轴角度/domain 和饼图扇区，支持响应式宽度与 SSR width。
- RadialGrid、RadialArea、RadialAxis 覆盖雷达图；RadialSlice 覆盖饼图/donut 和真实圆角。
- RadialTooltip 使用极坐标命中、HTML 浮层、扇区轮廓高亮、触摸和 Vue 自定义插槽。
- 小数据提供视觉隐藏表格，中英文生成无障碍名称；主站 demo 与 CLI 资料同步。

## 后续阶段

Sankey、ThreeD SVG 继续在本 issue 内分别验收；Radial 完成不会关闭 #196。

## 验证

组件几何、命中、SSR 与 charts 全量测试，类型与包检查、文档构建，以及 Chromium 雷达/饼图、悬停、触摸、响应式、深浅色和 axe；一个阶段 PR、一次发布。
