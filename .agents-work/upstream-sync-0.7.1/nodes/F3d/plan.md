# F3d：Lab 图表类实施计划

## 范围

Chart 组合、Brush、Zoom、Select、m4Reduce、useChartRange、Radial、Sankey、ThreeD 的 SVG 部分；不含 GL。

## 已完成阶段

- ChartBrush：x/xy 框选、数据范围和命中行、指针捕获、点击清除；PR #454。
- ChartSelect：最近点选择、受控选中项、选中圆环、Shift/Meta 多选；PR #458。
- ChartZoom：滚轮和双指缩放、拖动平移、轴向限制、分类 x 轴保护、工具栏重置；PR #459。
- m4Reduce：按像素桶保留首点、尾点、最低点和最高点，自定义 xDomain 和边缘桶；PR #462。
- useChartRange：Vue 受控 x/y domain、同步 push、滑动窗口、固定/自动 y 范围和重置；PR #463。
- Radial：统一径向上下文，雷达/饼图/donut、圆角扇区、真实极坐标提示层、窄屏标签和触摸；PR #464。

## 当前阶段：Sankey

- SankeyChart 自动或显式分列，统一计算节点、流向带和列坐标；支持响应式宽度、SSR width 和最小列宽滚动。
- SankeyGrid、SankeyLink、SankeyNode、SankeyLabel 覆盖网格、渐变/源色/目标色/平色连线、节点光晕、旋转/旁置标签和百分比。
- 多图渐变 ID 隔离，非法数值与循环连接有有限几何；小图提供视觉隐藏的来源/去向/数值表格。
- 浏览器修正首末列标题裁切，并排除文档全局表格样式对视觉隐藏数据表的滚动影响。
- 主站中英文 demo 和 CLI 资料同步；Sankey 完成不会关闭 #196。

## 后续阶段

ThreeD SVG 继续在本 issue 内单独验收；不含 GL/WebGL。

## 验证

组件几何、命中、SSR 与 charts 全量测试，类型与包检查、文档构建，以及 Chromium 雷达/饼图、悬停、触摸、响应式、深浅色和 axe；一个阶段 PR、一次发布。
