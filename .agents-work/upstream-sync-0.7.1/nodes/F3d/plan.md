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
- Sankey：自动/显式分列、流向带、节点、标签、网格、响应式滚动、SSR 与无障碍表格；PR #468。

## 当前阶段：ThreeD SVG

- ThreeDChart 统一相机和投影，支持响应式/SSR 尺寸、Pointer Events、方向键、自动旋转暂停与减少动态效果。
- ThreeDScatter、ThreeDBar、ThreeDGrid、ThreeDAxis、ThreeDSurface 覆盖散点、柱体、地面网格、坐标轴和 x/z 曲面。
- 非法数据、缺格和退化 domain 有明确保护；坐标轴使用紧凑 domain，并按真实文字宽度防止窄屏裁切。
- 不包含 ThreeDScatterGL 或其他 GL/WebGL 图元；主站三组 demo、中文/英文文档与 CLI 资料同步。
- 本阶段验收、合并和发布后，#196 的计划范围完整，可关闭路线卡。

## 验证

组件几何、命中、SSR 与 charts 全量测试，类型与包检查、文档构建，以及 Chromium 雷达/饼图、悬停、触摸、响应式、深浅色和 axe；一个阶段 PR、一次发布。
