---
title: 颜色
---

# 颜色

Neutral 的颜色都是 `--astryx-color-*`。每一项用 `light-dark()` 写下浅色和深色。下面每一格左边是浅色，右边是深色。带透明度的颜色垫了棋盘格。

语义色包括表面、文字、图标、成功、警告、错误，以及蓝、青、灰、绿、橙、粉、紫、红、茶、黄这几组背景、边框、图标和文字色。组件上的 `Badge` 变体和这些色名对应，例如 `variant="blue"`。

图表还没有独立的组件包。配色先放在主题里，变量名是 `--astryx-color-data-*`。分类色一条系列一个颜色，例如 `--astryx-color-data-categorical-blue`，明暗用同一个色值。连续色阶从 5 到 1，5 最深、1 最浅，例如 `--astryx-color-data-blue-5`。灰阶和 `--astryx-color-data-neutral` 会随明暗变化，后者用来画标签和参考线。七套主题写的是同一组数值，其余主题没有另外配色。

<TokenReference locale="zh" :headings="false" :sections="['color']" />
