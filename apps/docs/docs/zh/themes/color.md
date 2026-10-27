---
title: 颜色
---

# 颜色

## 颜色是如何组织的？

在 Neutral 主题中，所有颜色变量均以 `--astryx-color-*` 前缀命名。

颜色变量在底层采用标准 CSS `light-dark()` 函数定义：
- **明暗一体**：单个变量内同时包含浅色与深色模式下的取值。
- **无需切换样式文件**：浏览器根据元素或容器的 `color-scheme` 状态自动计算对应的颜色值，无需加载额外的深色样式表。

下方的参考色板中，色块左侧展示浅色模式色值，右侧展示深色模式色值；半透明色块底层铺设了棋盘格纹理以直观显示透明度。

## 语义色与状态色

系统内的颜色变量均依据具体用途进行语义化抽象：
- **界面层次**：包含背景表面（surface/card）、各级文本（primary/secondary/tertiary）、图标及边框。
- **状态反馈**：包含成功（success）、警告（warning）、危险/错误（danger）与信息提示。
- **色彩体系**：包含蓝（blue）、青（cyan）、灰（gray）、绿（green）、橙（orange）、粉（pink）、紫（purple）、红（red）、茶绿（teal）、黄（yellow）。每个色彩系列均包含匹配的浅色底色、边框、图标与前景色。例如 `Badge` 徽标组件设置 `variant="blue"` 时即引用该组蓝色变量。

## 数据可视化与图表色

图表专用颜色以 `--astryx-color-data-*` 前缀命名，共计 56 个变量，名称与取值均对齐上游规范：
- **分类色**：用于柱状图、饼图等多分类展示场景（如 `--astryx-color-data-categorical-blue`）。分类色在浅色与深色模式下保持统一色值，确保数据辨识度连贯。
- **连续色阶**：针对各主色提供 1 至 5 档梯度（例如 `--astryx-color-data-blue-5` 至 `blue-1`），5 为最深、1 为最浅，适用于热力图或分级分布。
- **中性灰阶与辅助线条**：`--astryx-color-data-neutral` 随明暗模式动态适配，用于渲染坐标轴标签、参考网格线与图例文本。

上述默认变量集中维护于 `@astryx-vue/themes/data.css` 的 `:root` 规则中。各主题入口统一引入该文件，无需在各主题中重复声明：

- 修改特定系列的颜色时，覆盖对应变量即可，支持在 `:root` 或特定主题范围内覆盖。
- 嵌套主题中未显式声明的图表色，自然继承上层配置，不会重置为默认值。

在 CSS 之外的渲染逻辑（如 Canvas 或 SVG 图表）中，可从 `@astryx-vue/core/Theme` 导入 `DATA_TOKEN_DEFAULTS` 读取这组默认值，或通过 `useTheme().token('--color-data-categorical-blue')` 动态读取。

## 颜色变量参考

<TokenReference locale="zh" :headings="false" :sections="['color']" />
