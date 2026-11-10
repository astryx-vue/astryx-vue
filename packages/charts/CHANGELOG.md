# @astryx-vue/charts

## 0.8.0

### Minor Changes

- [#468](https://github.com/astryx-vue/astryx-vue/pull/468) [`7dad994`](https://github.com/astryx-vue/astryx-vue/commit/7dad994c3da3bc7eb72dfd9c5b9f290a9e97ead2) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 SankeyChart、SankeyGrid、SankeyLink、SankeyNode、SankeyLabel 和 useSankey，支持自动/显式分列、渐变流向带、响应式滚动、标签、SSR 和无障碍数据表。

## 0.7.1

### Patch Changes

- [#466](https://github.com/astryx-vue/astryx-vue/pull/466) [`cb8377a`](https://github.com/astryx-vue/astryx-vue/commit/cb8377ae0e3bacca93319e0ac28cd9b071b99ceb) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - ChartZoom 工具栏改用 core Icon 承载标准放大、缩小和刷新图形，修正 reset 图标辨识度并统一尺寸与居中。

## 0.7.0

### Minor Changes

- [#464](https://github.com/astryx-vue/astryx-vue/pull/464) [`1a3e7b0`](https://github.com/astryx-vue/astryx-vue/commit/1a3e7b088a071a78ee52708330261ca44e1fb794) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增完整 Radial 组件族：雷达图、饼图/donut、网格、面积、轴标签、真实扇区圆角、悬停/触摸提示框、响应式尺寸、SSR 和无障碍数据表。

## 0.6.0

### Minor Changes

- [#463](https://github.com/astryx-vue/astryx-vue/pull/463) [`258c023`](https://github.com/astryx-vue/astryx-vue/commit/258c023a6e88934c0d87434c62e9023def979abf) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 `useChartRange` 组合式函数，用受控 x/y domain 管理流式数据，支持滑动窗口、自动 y 范围、固定范围、padding、零点居中和重置。

## 0.5.0

### Minor Changes

- [#462](https://github.com/astryx-vue/astryx-vue/pull/462) [`ed329c6`](https://github.com/astryx-vue/astryx-vue/commit/ed329c646331bed771edc22b858509f03c2452be) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 `m4Reduce` 大数据折线缩减工具，按像素桶保留首点、尾点、最低点和最高点，并支持自定义 x 轴范围。

## 0.4.0

### Minor Changes

- [#459](https://github.com/astryx-vue/astryx-vue/pull/459) [`c52b154`](https://github.com/astryx-vue/astryx-vue/commit/c52b154a480506c596ead260af886e1bec130a63) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 ChartZoom，支持滚轮和双指缩放、拖动平移、x/y 轴向限制、分类 x 轴保护，以及放大、缩小、重置工具栏。

## 0.3.0

### Minor Changes

- [#458](https://github.com/astryx-vue/astryx-vue/pull/458) [`0f3f490`](https://github.com/astryx-vue/astryx-vue/commit/0f3f490a8fa77c7993e34081470c67bf3f94d4e0) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 ChartSelect，支持点击或触摸最近数据点、受控选中项、选中圆环，以及 Shift/Meta 多选切换。

## 0.2.0

### Minor Changes

- [#454](https://github.com/astryx-vue/astryx-vue/pull/454) [`463244a`](https://github.com/astryx-vue/astryx-vue/commit/463244ae0a4eba3f00a6daae9f6f175a88d63706) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 ChartBrush：在 Chart 的 interactions 插槽中拖动选择 x 或 xy 数据范围，返回数据坐标与命中行，支持点击清除。

## 0.1.2

### Patch Changes

- Updated dependencies [[`dacf1fe`](https://github.com/astryx-vue/astryx-vue/commit/dacf1fe1fe16bd653cf15b78798e16819a292b29)]:
  - @astryx-vue/core@0.7.0

## 0.1.1

### Patch Changes

- Updated dependencies [[`88e2214`](https://github.com/astryx-vue/astryx-vue/commit/88e22141ad5d24ce3f6db2aefe082a9df44a5359), [`c4f2aa5`](https://github.com/astryx-vue/astryx-vue/commit/c4f2aa52b3834549263b8a98e7787ef6a54262c3), [`004f655`](https://github.com/astryx-vue/astryx-vue/commit/004f655f04fcae2194eb694c9a6b61b19adaff0a), [`22e9a74`](https://github.com/astryx-vue/astryx-vue/commit/22e9a74dcc1bcc38bea4bb8499212afbddf7bbd1), [`9685f9a`](https://github.com/astryx-vue/astryx-vue/commit/9685f9a39d4b01c73f59237f1cff0326bd60864e), [`6d366de`](https://github.com/astryx-vue/astryx-vue/commit/6d366de2fac28a02a75315f0b7283a5eed100ca1), [`78d5669`](https://github.com/astryx-vue/astryx-vue/commit/78d56695cc7ee13c01d3347e4b7dd5ce24665c7a), [`2a9b503`](https://github.com/astryx-vue/astryx-vue/commit/2a9b50310e32eb840caac6afe1fbaba65a810f8c), [`346ff39`](https://github.com/astryx-vue/astryx-vue/commit/346ff392db97126214613c6b5608a173b79240a8), [`a74832f`](https://github.com/astryx-vue/astryx-vue/commit/a74832fee24df16e017324f5fb80e8eff76c9baa), [`7ba5cb9`](https://github.com/astryx-vue/astryx-vue/commit/7ba5cb9a0de1d4e824baf235ec23524f4c11be7b)]:
  - @astryx-vue/core@0.6.0

## 0.1.0

### Minor Changes

- [#257](https://github.com/astryx-vue/astryx-vue/pull/257) [`5688596`](https://github.com/astryx-vue/astryx-vue/commit/5688596e50ead2c7ad8ed458a6a76ddba3850fad) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 首次公开发布 Charts 组件包，包含 Chart 画布、坐标轴、网格、图例、提示框和多种 SVG 数据系列。

### Patch Changes

- Updated dependencies []:
  - @astryx-vue/core@0.5.1
