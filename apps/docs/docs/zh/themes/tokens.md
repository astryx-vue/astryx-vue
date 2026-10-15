---
title: Design token
---

# Design token

Design token 是这套设计语言里可以复用的决定：一种颜色、一档间距、一个圆角、一段时长。组件不把这些数写死，而是读 token。换主题，就是换这批数。

astryx-vue 的 token 对齐原版 Astryx 的 `tokens.stylex.ts`，公开形式是 CSS 变量，不是 StyleX 对象。每条语义 token 都有 `--astryx-` 前缀。颜色类 token 用 `light-dark()` 同时写下浅色和深色，不拆成两份样式表。

值从哪来，按这个顺序：

1. Neutral 覆盖过的，用 Neutral 的值。
2. Neutral 没覆盖的，用原版默认值。
3. 组件主题文件若重复声明了同名变量，后声明的规则具有更高优先级；扩展样式时请通过语义层覆盖。

所以 token 名是稳定的接口，某一条现在的具体数值以 `packages/themes/neutral/base.css` 为准。文档里的色板和尺寸条就是从这个文件解析出来的，不另维护一份名单。

分类如下：

| 页面 | 变量 |
| --- | --- |
| [颜色](/themes/color) | `--astryx-color-*`，其中 `--astryx-color-data-*` 是图表用的分类色和连续色阶 |
| [排版与字体](/themes/typography) | `--astryx-font-*`、`--astryx-text-*` |
| [动画](/themes/motion) | `--astryx-duration-*`、`--astryx-ease-*`，以及共享关键帧 |
| [间距、圆角与阴影](/themes/scale) | `--astryx-spacing-*`、`--astryx-size-*`、`--astryx-radius-*`、`--astryx-shadow-*`、边框和焦点环 |

在组件外面使用时，直接写 `var(--astryx-color-text-primary)` 这种引用。变量名和层的规则见 [CSS 变量](/themes/css-variables)。
