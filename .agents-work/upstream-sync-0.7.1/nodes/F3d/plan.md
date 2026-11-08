# F3d：Lab 图表类实施计划

## 范围

Chart 组合、Brush、Zoom、Select、m4Reduce、useChartRange、Radial、Sankey、ThreeD 的 SVG 部分；不含 GL。

## 已完成阶段

- ChartBrush：x/xy 框选、数据范围和命中行、指针捕获、点击清除；PR #454。
- ChartSelect：最近点选择、受控选中项、选中圆环、Shift/Meta 多选；本阶段交付。

## 当前阶段：ChartSelect

- 通过 ChartContext 复用图表根已解析的点位，不重复猜数值字段。
- 支持数值和分类 x 轴、30 像素命中范围、越界下标忽略。
- 主站中英文 Chart 文档和 demo 已接入；CLI 内置资料同步更新。

## 后续阶段

Zoom、m4Reduce、useChartRange、Radial、Sankey、ThreeD SVG 继续在本 issue 内分别验收；本阶段完成不会关闭 #196。

## 验证

静态测试 + Chromium 实际点击、Shift/Meta 多选、触摸、截图和 axe；一个阶段 PR、一次发布。
