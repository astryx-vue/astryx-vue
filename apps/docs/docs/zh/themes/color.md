---
title: 颜色
---

# 颜色

## 颜色是如何组织的？

在 Neutral 主题中，所有颜色变量都统一以 `--astryx-color-*` 开头。

为了让深色模式切换更流畅，每一个颜色变量底层都是通过 CSS 标准的 `light-dark()` 函数定义的。这意味着：
- **浅色与深色合二为一：** 变量内部同时存了浅色模式和深色模式该显示的颜色。
- **无需切换样式表：** 浏览器会根据当前页面或容器的 `color-scheme`（是白天还是黑夜）自动决定展示哪一个颜色，不需要为了深色模式额外打包或动态下载第二份 CSS。

在下方的参考色板中，每个色块左半边展示的是浅色模式效果，右半边展示的是深色模式效果；带有半透明度的颜色底下铺设了棋盘格背景，方便你一眼看清它的透明程度。

## 语义色与状态色

系统中的大部分颜色都具有明确的「语义用途」，而不是冷冰冰的十六进制代码：
- **基础层次：** 背景表面（surface/card）、各级文字（primary/secondary/tertiary）、图标和边框。
- **状态反馈：** 信息（info）、成功（success）、警告（warning）、错误（error）。
- **色彩家族：** 蓝（blue）、青（cyan）、灰（gray）、绿（green）、橙（orange）、粉（pink）、紫（purple）、红（red）、茶（teal）、黄（yellow）。每一组颜色都配齐了对应的浅底背景、边框、图标与文字前景色。例如 `Badge` 徽标组件的 `variant="blue"` 就会成套取用这组蓝色。

## 状态色的几种角色

同一个状态会出现在不同的底上：有时是一整块实心的颜色，有时是一块浅浅的底，有时只是页面上的一行字。每种情况各有一个变量（`<状态>` 是 `info`、`success`、`warning`、`error` 之一）：

| 变量 | 用在哪里 |
| --- | --- |
| `--astryx-color-<状态>` | 实心底色：Badge、StatusDot、进度条的填充。 |
| `--astryx-color-on-<状态>` | 实心底上的文字和图标，反差至少 4.5:1。 |
| `--astryx-color-<状态>-muted` | 浅色底：Banner、表单的状态提示、聊天输入框的状态条。 |
| `--astryx-color-on-<状态>-muted` | 浅色底上的文字和图标。 |
| `--astryx-color-text-<状态>` | 页面和卡片上的状态文字，比如菜单里的危险操作、超出字数的计数。 |
| `--astryx-color-icon-<状态>` | 页面上的状态图标，比如 `Icon color="success"`、步骤条的状态图标。默认跟状态文字色一样。 |
| `--astryx-color-border-<状态>` | 状态边框，比如出错的输入框。默认跟状态文字色一样。 |

信息（info）是独立的状态，不再借用主题强调色。想换某个状态的颜色，写它的底色就够了：用 `defineTheme` 做的主题会把没写的字色自动算出来（见[主题里的状态色](/guide/extending-themes#status-colors)）。

默认值写在 `@astryx-vue/themes/neutral/base.css` 里。需要量颜色的代码（比如对比度检查）可以从 `@astryx-vue/core/Theme` 导入 `STATUS_COLOR_DEFAULTS`，读到的是同一组值。

## 数据可视化与图表色

图表用的颜色以 `--astryx-color-data-*` 开头，一共 56 个，名字和取值都和原版一样：
- **分类色：** 用于柱状图、饼图等展示不同类别的场景（一条数据系列对应一种颜色，例如 `--astryx-color-data-categorical-blue`）。分类色在明暗模式下保持相同的色值，保证图表辨识度一致。
- **连续色阶：** 针对每种主色提供了 1 到 5 档深浅递进梯度（例如 `--astryx-color-data-blue-5` 到 `blue-1`），5 最深、1 最浅，适合热力图或进度占比。
- **中性灰阶与辅助色：** `--astryx-color-data-neutral` 会随明暗自动变换，专门用来绘制图表的坐标轴标签、网格参考线和说明文字。

这些默认值只放在一个地方：`@astryx-vue/themes/data.css`，写在 `:root` 上。每套主题的入口都会引入它，主题自己的样式表不再重复写一遍。这样做的好处是：

- 想改某一条系列的颜色，只要改那一个变量，写在 `:root` 上或者某个主题里都行。
- 嵌套的主题没写的颜色，会沿用外层的设置，不会被改回默认值。

在 CSS 以外画图的代码（比如 canvas 图表），可以从 `@astryx-vue/core/Theme` 导入 `DATA_TOKEN_DEFAULTS` 读同一组默认值，或者调用 `useTheme().token('--color-data-categorical-blue')`。

## 颜色变量参考

<TokenReference locale="zh" :headings="false" :sections="['color']" />
